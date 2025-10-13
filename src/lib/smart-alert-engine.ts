import { Alert, AlertPattern, alertStorage } from './alert-storage';

export interface SmartSuggestion {
  type: 'time' | 'frequency' | 'snooze' | 'pattern';
  message: string;
  confidence: number;
  action?: () => void;
}

export interface AlertTriggerEvent {
  alert: Alert;
  timestamp: Date;
  action: 'triggered' | 'snoozed' | 'dismissed';
  snoozeMinutes?: number;
  dismissTime?: number; // seconds to dismiss
}

class SmartAlertEngine {
  private patterns: Map<string, AlertPattern> = new Map();
  private triggerHistory: AlertTriggerEvent[] = [];
  private isRunning = false;
  private checkInterval: NodeJS.Timeout | null = null;
  private listeners: Set<(alert: Alert) => void> = new Set();

  async init(): Promise<void> {
    await alertStorage.init();
    await this.loadPatterns();
    await this.loadTriggerHistory();
    this.startMonitoring();
  }

  private async loadPatterns(): Promise<void> {
    const alerts = await alertStorage.getAlerts();
    for (const alert of alerts) {
      if (alert.pattern) {
        this.patterns.set(alert.id, alert.pattern);
      }
    }
  }

  private async loadTriggerHistory(): Promise<void> {
    // Load from localStorage as backup
    const historyData = localStorage.getItem('tabdila_alert_history');
    if (historyData) {
      try {
        this.triggerHistory = JSON.parse(historyData).map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp)
        }));
      } catch (error) {
        console.warn('Failed to load trigger history:', error);
        this.triggerHistory = [];
      }
    }
  }

  private async saveTriggerHistory(): Promise<void> {
    localStorage.setItem('tabdila_alert_history', JSON.stringify(this.triggerHistory));
  }

  private startMonitoring(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.checkInterval = setInterval(() => {
      this.checkAlerts();
    }, 1000); // Check every second
  }

  private stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isRunning = false;
  }

  private async checkAlerts(): Promise<void> {
    const alerts = await alertStorage.getAlerts();
    const now = new Date();
    
    for (const alert of alerts) {
      if (this.shouldTrigger(alert, now)) {
        await this.triggerAlert(alert);
      }
    }
  }

  private shouldTrigger(alert: Alert, now: Date): boolean {
    if (!alert.enabled) return false;
    
    const currentDay = now.getDay();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Check if today is in the alert's days
    if (!alert.days.includes(currentDay)) return false;
    
    // Check if it's the right time
    if (alert.time !== currentTime) return false;
    
    // Check if we already triggered this alert today
    const today = now.toDateString();
    const lastTriggered = alert.lastTriggered?.toDateString();
    
    if (lastTriggered === today) return false;
    
    return true;
  }

  private async triggerAlert(alert: Alert): Promise<void> {
    // Update last triggered time
    await alertStorage.updateAlert(alert.id, { lastTriggered: new Date() });
    
    // Record trigger event
    const triggerEvent: AlertTriggerEvent = {
      alert,
      timestamp: new Date(),
      action: 'triggered'
    };
    
    this.triggerHistory.push(triggerEvent);
    await this.saveTriggerHistory();
    
    // Update pattern
    await this.updatePattern(alert.id, 'triggered');
    
    // Notify listeners
    this.listeners.forEach(listener => listener(alert));
  }

  async snoozeAlert(alertId: string, minutes: number): Promise<void> {
    const alert = await alertStorage.getAlert(alertId);
    if (!alert) return;
    
    // Record snooze event
    const snoozeEvent: AlertTriggerEvent = {
      alert,
      timestamp: new Date(),
      action: 'snoozed',
      snoozeMinutes: minutes
    };
    
    this.triggerHistory.push(snoozeEvent);
    await this.saveTriggerHistory();
    
    // Update pattern
    await this.updatePattern(alertId, 'snoozed', minutes);
    
    // Schedule next trigger
    const nextTrigger = new Date();
    nextTrigger.setMinutes(nextTrigger.getMinutes() + minutes);
    
    // Update alert with snooze time
    await alertStorage.updateAlert(alertId, { 
      lastTriggered: nextTrigger 
    });
  }

  async dismissAlert(alertId: string, dismissTime?: number): Promise<void> {
    const alert = await alertStorage.getAlert(alertId);
    if (!alert) return;
    
    // Record dismiss event
    const dismissEvent: AlertTriggerEvent = {
      alert,
      timestamp: new Date(),
      action: 'dismissed',
      dismissTime
    };
    
    this.triggerHistory.push(dismissEvent);
    await this.saveTriggerHistory();
    
    // Update pattern
    await this.updatePattern(alertId, 'dismissed', undefined, dismissTime);
  }

  private async updatePattern(
    alertId: string, 
    action: 'triggered' | 'snoozed' | 'dismissed',
    snoozeMinutes?: number,
    dismissTime?: number
  ): Promise<void> {
    let pattern = this.patterns.get(alertId) || {
      frequency: 1,
      lastTriggered: new Date(),
      triggerCount: 0,
      averageSnooze: 0,
      dismissTime: 0
    };
    
    pattern.lastTriggered = new Date();
    pattern.triggerCount++;
    
    if (action === 'snoozed' && snoozeMinutes) {
      pattern.averageSnooze = (pattern.averageSnooze + snoozeMinutes) / 2;
    }
    
    if (action === 'dismissed' && dismissTime) {
      pattern.dismissTime = (pattern.dismissTime + dismissTime) / 2;
    }
    
    this.patterns.set(alertId, pattern);
    await alertStorage.savePattern(alertId, pattern);
  }

  getSmartSuggestions(alertId: string): SmartSuggestion[] {
    const pattern = this.patterns.get(alertId);
    const suggestions: SmartSuggestion[] = [];
    
    if (!pattern) return suggestions;
    
    // Time-based suggestions
    if (pattern.triggerCount > 5) {
      const avgSnooze = pattern.averageSnooze;
      if (avgSnooze > 0) {
        suggestions.push({
          type: 'snooze',
          message: `بر اساس الگوی شما، پیشنهاد می‌کنیم هشدار را ${Math.round(avgSnooze)} دقیقه زودتر تنظیم کنید`,
          confidence: 0.8,
          action: () => this.adjustAlertTime(alertId, -avgSnooze)
        });
      }
    }
    
    // Frequency suggestions
    if (pattern.triggerCount > 10) {
      const frequency = pattern.frequency;
      if (frequency > 1) {
        suggestions.push({
          type: 'frequency',
          message: `این هشدار ${frequency} روز یکبار تکرار می‌شود. آیا می‌خواهید آن را روزانه کنید؟`,
          confidence: 0.7,
          action: () => this.makeDaily(alertId)
        });
      }
    }
    
    // Pattern recognition
    const recentTriggers = this.triggerHistory
      .filter(event => event.alert.id === alertId)
      .slice(-10);
    
    if (recentTriggers.length >= 5) {
      const avgDismissTime = recentTriggers
        .filter(event => event.dismissTime)
        .reduce((sum, event) => sum + (event.dismissTime || 0), 0) / recentTriggers.length;
      
      if (avgDismissTime < 5) {
        suggestions.push({
          type: 'pattern',
          message: 'شما معمولاً این هشدار را سریع dismiss می‌کنید. آیا می‌خواهید آن را غیرفعال کنید؟',
          confidence: 0.6,
          action: () => this.disableAlert(alertId)
        });
      }
    }
    
    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  private async adjustAlertTime(alertId: string, minutes: number): Promise<void> {
    const alert = await alertStorage.getAlert(alertId);
    if (!alert) return;
    
    const [hours, mins] = alert.time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    
    const newTime = `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
    
    await alertStorage.updateAlert(alertId, { time: newTime });
  }

  private async makeDaily(alertId: string): Promise<void> {
    await alertStorage.updateAlert(alertId, { 
      days: [0, 1, 2, 3, 4, 5, 6] // All days
    });
  }

  private async disableAlert(alertId: string): Promise<void> {
    await alertStorage.updateAlert(alertId, { enabled: false });
  }

  addListener(listener: (alert: Alert) => void): void {
    this.listeners.add(listener);
  }

  removeListener(listener: (alert: Alert) => void): void {
    this.listeners.delete(listener);
  }

  getTriggerHistory(): AlertTriggerEvent[] {
    return [...this.triggerHistory];
  }

  getPattern(alertId: string): AlertPattern | null {
    return this.patterns.get(alertId) || null;
  }

  async cleanup(): Promise<void> {
    this.stopMonitoring();
    this.listeners.clear();
    
    // Keep only last 100 trigger events
    if (this.triggerHistory.length > 100) {
      this.triggerHistory = this.triggerHistory.slice(-100);
      await this.saveTriggerHistory();
    }
  }
}

// Singleton instance
export const smartAlertEngine = new SmartAlertEngine();

// Initialize on module load
if (typeof window !== 'undefined') {
  smartAlertEngine.init().catch(console.error);
}
