import { Alert, AlertSettings } from './alert-storage';

export interface CrossTabMessage {
  type: 'alert_triggered' | 'alert_updated' | 'alert_deleted' | 'settings_updated' | 'sync_request' | 'sync_response';
  data: any;
  timestamp: number;
  tabId: string;
}

export interface TabState {
  id: string;
  isActive: boolean;
  lastSeen: Date;
  alerts: Alert[];
  settings: AlertSettings;
}

class CrossTabSync {
  private channel: BroadcastChannel;
  private tabId: string;
  private isActive = true;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private tabStates: Map<string, TabState> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.channel = new BroadcastChannel('tabdila_alerts');
    this.setupEventListeners();
    this.startHeartbeat();
    this.requestSync();
  }

  private setupEventListeners(): void {
    this.channel.addEventListener('message', (event) => {
      const message: CrossTabMessage = event.data;
      
      // Ignore messages from self
      if (message.tabId === this.tabId) return;
      
      this.handleMessage(message);
    });

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.isActive = !document.hidden;
      this.broadcastState();
    });

    // Handle page unload
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }

  private handleMessage(message: CrossTabMessage): void {
    switch (message.type) {
      case 'alert_triggered':
        this.notifyListeners('alert_triggered', message.data);
        break;
      case 'alert_updated':
        this.notifyListeners('alert_updated', message.data);
        break;
      case 'alert_deleted':
        this.notifyListeners('alert_deleted', message.data);
        break;
      case 'settings_updated':
        this.notifyListeners('settings_updated', message.data);
        break;
      case 'sync_request':
        this.handleSyncRequest(message);
        break;
      case 'sync_response':
        this.handleSyncResponse(message);
        break;
    }
  }

  private async handleSyncRequest(message: CrossTabMessage): Promise<void> {
    // Send current state to requesting tab
    const { alertStorage } = await import('./alert-storage');
    const alerts = await alertStorage.getAlerts();
    const settings = await alertStorage.getSettings();
    
    this.sendMessage({
      type: 'sync_response',
      data: { alerts, settings },
      timestamp: Date.now(),
      tabId: this.tabId
    });
  }

  private handleSyncResponse(message: CrossTabMessage): void {
    this.notifyListeners('sync_response', message.data);
  }

  private async requestSync(): Promise<void> {
    this.sendMessage({
      type: 'sync_request',
      data: {},
      timestamp: Date.now(),
      tabId: this.tabId
    });
  }

  private async broadcastState(): Promise<void> {
    const { alertStorage } = await import('./alert-storage');
    const alerts = await alertStorage.getAlerts();
    const settings = await alertStorage.getSettings();
    
    this.tabStates.set(this.tabId, {
      id: this.tabId,
      isActive: this.isActive,
      lastSeen: new Date(),
      alerts,
      settings
    });
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.broadcastState();
    }, 5000); // Send heartbeat every 5 seconds
  }

  private sendMessage(message: CrossTabMessage): void {
    this.channel.postMessage(message);
  }

  // Public methods
  broadcastAlertTriggered(alert: Alert): void {
    this.sendMessage({
      type: 'alert_triggered',
      data: alert,
      timestamp: Date.now(),
      tabId: this.tabId
    });
  }

  broadcastAlertUpdated(alert: Alert): void {
    this.sendMessage({
      type: 'alert_updated',
      data: alert,
      timestamp: Date.now(),
      tabId: this.tabId
    });
  }

  broadcastAlertDeleted(alertId: string): void {
    this.sendMessage({
      type: 'alert_deleted',
      data: { id: alertId },
      timestamp: Date.now(),
      tabId: this.tabId
    });
  }

  broadcastSettingsUpdated(settings: AlertSettings): void {
    this.sendMessage({
      type: 'settings_updated',
      data: settings,
      timestamp: Date.now(),
      tabId: this.tabId
    });
  }

  addListener(eventType: string, listener: (data: any) => void): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);
  }

  removeListener(eventType: string, listener: (data: any) => void): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  private notifyListeners(eventType: string, data: any): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error('Error in cross-tab listener:', error);
        }
      });
    }
  }

  getActiveTabs(): TabState[] {
    const now = new Date();
    const activeTabs: TabState[] = [];
    
    this.tabStates.forEach((state, tabId) => {
      const timeSinceLastSeen = now.getTime() - state.lastSeen.getTime();
      if (timeSinceLastSeen < 10000) { // 10 seconds
        activeTabs.push(state);
      }
    });
    
    return activeTabs;
  }

  getTabCount(): number {
    return this.getActiveTabs().length;
  }

  isMainTab(): boolean {
    const activeTabs = this.getActiveTabs();
    if (activeTabs.length === 0) return true;
    
    // The tab with the earliest ID is considered the main tab
    const sortedTabs = activeTabs.sort((a, b) => a.id.localeCompare(b.id));
    return sortedTabs[0].id === this.tabId;
  }

  private cleanup(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    this.channel.close();
    this.listeners.clear();
    this.tabStates.clear();
  }

  // Static method to check if cross-tab sync is supported
  static isSupported(): boolean {
    return typeof BroadcastChannel !== 'undefined';
  }
}

// Singleton instance
export const crossTabSync = new CrossTabSync();

// Export for use in other modules
export { CrossTabSync };
