// Local Alert Storage System using IndexedDB
export interface Alert {
  id: string;
  title: string;
  message: string;
  time: string; // HH:MM format
  days: number[]; // 0-6 (Sunday-Saturday)
  type: 'focus' | 'break' | 'reminder' | 'custom';
  color: string;
  sound: boolean;
  voice: boolean;
  repeat: boolean;
  snooze: number; // minutes
  enabled: boolean;
  createdAt: Date;
  lastTriggered?: Date;
  pattern?: AlertPattern;
}

export interface AlertPattern {
  frequency: number; // days
  lastTriggered: Date;
  triggerCount: number;
  averageSnooze: number;
  dismissTime: number; // average time to dismiss
}

export interface AlertSettings {
  theme: 'dark' | 'twilight' | 'deep-focus';
  soundEnabled: boolean;
  voiceEnabled: boolean;
  notificationEnabled: boolean;
  ambientMode: boolean;
  autoSnooze: boolean;
  smartSuggestions: boolean;
}

class LocalAlertStorage {
  private dbName = 'TabdilaAlerts';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Alerts store
        if (!db.objectStoreNames.contains('alerts')) {
          const alertsStore = db.createObjectStore('alerts', { keyPath: 'id' });
          alertsStore.createIndex('time', 'time');
          alertsStore.createIndex('type', 'type');
          alertsStore.createIndex('enabled', 'enabled');
        }

        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }

        // Patterns store
        if (!db.objectStoreNames.contains('patterns')) {
          db.createObjectStore('patterns', { keyPath: 'id' });
        }
      };
    });
  }

  async saveAlert(alert: Alert): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['alerts'], 'readwrite');
      const store = transaction.objectStore('alerts');
      const request = store.put(alert);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAlerts(): Promise<Alert[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['alerts'], 'readonly');
      const store = transaction.objectStore('alerts');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async getAlert(id: string): Promise<Alert | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['alerts'], 'readonly');
      const store = transaction.objectStore('alerts');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteAlert(id: string): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['alerts'], 'readwrite');
      const store = transaction.objectStore('alerts');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updateAlert(id: string, updates: Partial<Alert>): Promise<void> {
    if (!this.db) await this.init();
    
    const alert = await this.getAlert(id);
    if (!alert) throw new Error('Alert not found');

    const updatedAlert = { ...alert, ...updates };
    await this.saveAlert(updatedAlert);
  }

  async saveSettings(settings: AlertSettings): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['settings'], 'readwrite');
      const store = transaction.objectStore('settings');
      const request = store.put({ key: 'settings', ...settings });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSettings(): Promise<AlertSettings> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['settings'], 'readonly');
      const store = transaction.objectStore('settings');
      const request = store.get('settings');

      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          const { key, ...settings } = result;
          resolve(settings);
        } else {
          // Default settings
          resolve({
            theme: 'dark',
            soundEnabled: true,
            voiceEnabled: true,
            notificationEnabled: true,
            ambientMode: true,
            autoSnooze: false,
            smartSuggestions: true,
          });
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async savePattern(id: string, pattern: AlertPattern): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['patterns'], 'readwrite');
      const store = transaction.objectStore('patterns');
      const request = store.put({ id, ...pattern });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getPattern(id: string): Promise<AlertPattern | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['patterns'], 'readonly');
      const store = transaction.objectStore('patterns');
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          const { id: _, ...pattern } = result;
          resolve(pattern);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async exportData(): Promise<string> {
    const alerts = await this.getAlerts();
    const settings = await this.getSettings();
    
    const exportData = {
      alerts,
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };

    return JSON.stringify(exportData, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    const data = JSON.parse(jsonData);
    
    if (data.alerts) {
      for (const alert of data.alerts) {
        await this.saveAlert(alert);
      }
    }
    
    if (data.settings) {
      await this.saveSettings(data.settings);
    }
  }

  async clearAllData(): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['alerts', 'settings', 'patterns'], 'readwrite');
      
      let completed = 0;
      const total = 3;
      
      const checkComplete = () => {
        completed++;
        if (completed === total) resolve();
      };

      transaction.objectStore('alerts').clear().onsuccess = checkComplete;
      transaction.objectStore('settings').clear().onsuccess = checkComplete;
      transaction.objectStore('patterns').clear().onsuccess = checkComplete;
      
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

// Singleton instance
export const alertStorage = new LocalAlertStorage();

// Helper functions
export function generateAlertId(): string {
  return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function parseTime(timeString: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeString.split(':').map(Number);
  return { hours, minutes };
}

export function formatTime(hours: number, minutes: number): string {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function isTimeToTrigger(alert: Alert): boolean {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = formatTime(now.getHours(), now.getMinutes());
  
  return alert.enabled && 
         alert.days.includes(currentDay) && 
         alert.time === currentTime;
}

export function getNextTriggerTime(alert: Alert): Date {
  const now = new Date();
  const { hours, minutes } = parseTime(alert.time);
  
  // Find next occurrence
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(now);
    checkDate.setDate(now.getDate() + i);
    const dayOfWeek = checkDate.getDay();
    
    if (alert.days.includes(dayOfWeek)) {
      checkDate.setHours(hours, minutes, 0, 0);
      
      if (checkDate > now) {
        return checkDate;
      }
    }
  }
  
  // Fallback to next week
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);
  nextWeek.setHours(hours, minutes, 0, 0);
  return nextWeek;
}
