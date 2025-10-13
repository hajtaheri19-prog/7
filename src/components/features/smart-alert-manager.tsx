"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  Play, 
  Pause, 
  AlertCircle, 
  Settings,
  Download,
  Upload,
  Lightbulb,
  Volume2,
  Mic,
  Calendar,
  Repeat
} from 'lucide-react';
import { 
  Alert, 
  AlertSettings, 
  alertStorage, 
  generateAlertId, 
  formatTime,
  parseTime 
} from '@/lib/alert-storage';
import { smartAlertEngine, SmartSuggestion } from '@/lib/smart-alert-engine';
import { voiceAndSoundSystem } from '@/lib/voice-sound-system';
import { crossTabSync } from '@/lib/cross-tab-sync';
import { AlertNotification, SmartSuggestionCard, VoiceControls } from '../alert/alert-components';

export default function SmartAlertManager() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [settings, setSettings] = useState<AlertSettings>({
    theme: 'dark',
    soundEnabled: true,
    voiceEnabled: true,
    notificationEnabled: true,
    ambientMode: true,
    autoSnooze: false,
    smartSuggestions: true,
  });
  const [activeAlert, setActiveAlert] = useState<Alert | null>(null);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    time: '09:00',
    days: [1, 2, 3, 4, 5], // Monday to Friday
    type: 'reminder' as Alert['type'],
    color: '#6A3EAB',
    sound: true,
    voice: true,
    repeat: true,
    snooze: 5,
    enabled: true,
  });

  useEffect(() => {
    initializeSystem();
  }, []);

  const initializeSystem = async () => {
    try {
      await alertStorage.init();
      await voiceAndSoundSystem.init();
      
      const [alertsData, settingsData] = await Promise.all([
        alertStorage.getAlerts(),
        alertStorage.getSettings()
      ]);
      
      setAlerts(alertsData);
      setSettings(settingsData);
      
      // Set up alert engine listener
      smartAlertEngine.addListener(handleAlertTriggered);
      
      // Set up cross-tab sync listeners
      crossTabSync.addListener('alert_triggered', handleCrossTabAlert);
      crossTabSync.addListener('alert_updated', handleCrossTabUpdate);
      crossTabSync.addListener('alert_deleted', handleCrossTabDelete);
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to initialize alert system:', error);
      toast({
        title: "خطا",
        description: "خطا در راه‌اندازی سیستم هشدار",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleAlertTriggered = async (alert: Alert) => {
    setActiveAlert(alert);
    
    // Play sound and voice
    if (settings.soundEnabled) {
      await voiceAndSoundSystem.playAlertSound(alert);
    }
    if (settings.voiceEnabled) {
      await voiceAndSoundSystem.speakAlert(alert);
    }
    
    // Broadcast to other tabs
    crossTabSync.broadcastAlertTriggered(alert);
    
    // Get smart suggestions
    if (settings.smartSuggestions) {
      const alertSuggestions = smartAlertEngine.getSmartSuggestions(alert.id);
      setSuggestions(alertSuggestions);
    }
  };

  const handleCrossTabAlert = (alert: Alert) => {
    setActiveAlert(alert);
  };

  const handleCrossTabUpdate = (alert: Alert) => {
    setAlerts(prev => prev.map(a => a.id === alert.id ? alert : a));
  };

  const handleCrossTabDelete = (data: { id: string }) => {
    setAlerts(prev => prev.filter(a => a.id !== data.id));
  };

  const handleDismissAlert = async () => {
    if (!activeAlert) return;
    
    await smartAlertEngine.dismissAlert(activeAlert.id);
    setActiveAlert(null);
    setSuggestions([]);
  };

  const handleSnoozeAlert = async (minutes: number) => {
    if (!activeAlert) return;
    
    await smartAlertEngine.snoozeAlert(activeAlert.id, minutes);
    setActiveAlert(null);
    setSuggestions([]);
    
    toast({
      title: "هشدار به تعویق افتاد",
      description: `هشدار برای ${minutes} دقیقه دیگر تکرار می‌شود`
    });
  };

  const handleCreateAlert = async () => {
    try {
      const newAlert: Alert = {
        id: generateAlertId(),
        ...formData,
        createdAt: new Date(),
      };
      
      await alertStorage.saveAlert(newAlert);
      setAlerts(prev => [...prev, newAlert]);
      
      // Broadcast to other tabs
      crossTabSync.broadcastAlertUpdated(newAlert);
      
      setIsDialogOpen(false);
      resetForm();
      
      toast({
        title: "هشدار ایجاد شد",
        description: "هشدار جدید با موفقیت اضافه شد"
      });
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در ایجاد هشدار",
        variant: "destructive"
      });
    }
  };

  const handleEditAlert = async () => {
    if (!editingAlert) return;
    
    try {
      const updatedAlert = { ...editingAlert, ...formData };
      await alertStorage.saveAlert(updatedAlert);
      setAlerts(prev => prev.map(a => a.id === updatedAlert.id ? updatedAlert : a));
      
      // Broadcast to other tabs
      crossTabSync.broadcastAlertUpdated(updatedAlert);
      
      setIsDialogOpen(false);
      setEditingAlert(null);
      resetForm();
      
      toast({
        title: "هشدار به‌روزرسانی شد",
        description: "تغییرات با موفقیت اعمال شد"
      });
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در به‌روزرسانی هشدار",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAlert = async (id: string) => {
    try {
      await alertStorage.deleteAlert(id);
      setAlerts(prev => prev.filter(a => a.id !== id));
      
      // Broadcast to other tabs
      crossTabSync.broadcastAlertDeleted(id);
      
      toast({
        title: "هشدار حذف شد",
        description: "هشدار با موفقیت حذف شد"
      });
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در حذف هشدار",
        variant: "destructive"
      });
    }
  };

  const handleToggleAlert = async (id: string, enabled: boolean) => {
    try {
      await alertStorage.updateAlert(id, { enabled });
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, enabled } : a));
      
      // Broadcast to other tabs
      const alert = alerts.find(a => a.id === id);
      if (alert) {
        crossTabSync.broadcastAlertUpdated({ ...alert, enabled });
      }
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در تغییر وضعیت هشدار",
        variant: "destructive"
      });
    }
  };

  const handleUpdateSettings = async (newSettings: Partial<AlertSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      await alertStorage.saveSettings(updatedSettings);
      setSettings(updatedSettings);
      
      // Update voice/sound system
      voiceAndSoundSystem.updateVoiceSettings({
        enabled: updatedSettings.voiceEnabled
      });
      voiceAndSoundSystem.updateSoundSettings({
        enabled: updatedSettings.soundEnabled
      });
      
      // Broadcast to other tabs
      crossTabSync.broadcastSettingsUpdated(updatedSettings);
      
      toast({
        title: "تنظیمات به‌روزرسانی شد",
        description: "تغییرات با موفقیت اعمال شد"
      });
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در به‌روزرسانی تنظیمات",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      time: '09:00',
      days: [1, 2, 3, 4, 5],
      type: 'reminder',
      color: '#6A3EAB',
      sound: true,
      voice: true,
      repeat: true,
      snooze: 5,
      enabled: true,
    });
  };

  const openEditDialog = (alert: Alert) => {
    setEditingAlert(alert);
    setFormData({
      title: alert.title,
      message: alert.message,
      time: alert.time,
      days: alert.days,
      type: alert.type,
      color: alert.color,
      sound: alert.sound,
      voice: alert.voice,
      repeat: alert.repeat,
      snooze: alert.snooze,
      enabled: alert.enabled,
    });
    setIsDialogOpen(true);
  };

  const exportData = async () => {
    try {
      const data = await alertStorage.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tabdila-alerts-backup.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "پشتیبان‌گیری انجام شد",
        description: "فایل پشتیبان دانلود شد"
      });
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در پشتیبان‌گیری",
        variant: "destructive"
      });
    }
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result as string;
        await alertStorage.importData(data);
        
        const [alertsData, settingsData] = await Promise.all([
          alertStorage.getAlerts(),
          alertStorage.getSettings()
        ]);
        
        setAlerts(alertsData);
        setSettings(settingsData);
        
        toast({
          title: "بازیابی انجام شد",
          description: "داده‌ها با موفقیت بازیابی شدند"
        });
      } catch (error) {
        toast({
          title: "خطا",
          description: "خطا در بازیابی داده‌ها",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const getDayNames = () => [
    'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'
  ];

  const getAlertTypeIcon = (type: Alert['type']) => {
    switch (type) {
      case 'focus':
        return <Play className="w-4 h-4 text-blue-400" />;
      case 'break':
        return <Pause className="w-4 h-4 text-green-400" />;
      case 'reminder':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'custom':
        return <Bell className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">در حال راه‌اندازی سیستم هشدار...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
            <Bell className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">هشدار هوشمند</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          سیستم هشدار شخصی و هوشمند بدون نیاز به لاگین
        </p>
      </div>

      {/* Active Alert Notification */}
      {activeAlert && (
        <AlertNotification
          alert={activeAlert}
          onDismiss={handleDismissAlert}
          onSnooze={handleSnoozeAlert}
          onSettings={() => {}}
        />
      )}

      {/* Smart Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <SmartSuggestionCard
              key={index}
              suggestion={suggestion}
              onDismiss={() => setSuggestions(prev => prev.filter((_, i) => i !== index))}
              onApply={() => setSuggestions(prev => prev.filter((_, i) => i !== index))}
            />
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Alert Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                resetForm();
                setEditingAlert(null);
              }}
              className="h-20 text-lg"
            >
              <Plus className="w-6 h-6 mr-3" />
              ایجاد هشدار جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAlert ? 'ویرایش هشدار' : 'ایجاد هشدار جدید'}
              </DialogTitle>
              <DialogDescription>
                {editingAlert ? 'هشدار را ویرایش کنید' : 'هشدار جدیدی ایجاد کنید'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="عنوان هشدار"
                />
              </div>
              
              <div>
                <Label htmlFor="message">پیام</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="پیام هشدار (اختیاری)"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="time">زمان</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">نوع</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as Alert['type'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="focus">تمرکز</SelectItem>
                      <SelectItem value="break">استراحت</SelectItem>
                      <SelectItem value="reminder">یادآوری</SelectItem>
                      <SelectItem value="custom">سفارشی</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>روزهای هفته</Label>
                <div className="grid grid-cols-7 gap-2 mt-2">
                  {getDayNames().map((day, index) => (
                    <Button
                      key={index}
                      variant={formData.days.includes(index) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const newDays = formData.days.includes(index)
                          ? formData.days.filter(d => d !== index)
                          : [...formData.days, index];
                        setFormData(prev => ({ ...prev, days: newDays }));
                      }}
                      className="text-xs"
                    >
                      {day[0]}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sound"
                    checked={formData.sound}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sound: checked }))}
                  />
                  <Label htmlFor="sound">صدای هشدار</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="voice"
                    checked={formData.voice}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, voice: checked }))}
                  />
                  <Label htmlFor="voice">صدای گفتار</Label>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={editingAlert ? handleEditAlert : handleCreateAlert}
                  className="flex-1"
                >
                  {editingAlert ? 'به‌روزرسانی' : 'ایجاد'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  لغو
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Voice Controls */}
        <VoiceControls
          isVoiceEnabled={settings.voiceEnabled}
          isSoundEnabled={settings.soundEnabled}
          onToggleVoice={() => handleUpdateSettings({ voiceEnabled: !settings.voiceEnabled })}
          onToggleSound={() => handleUpdateSettings({ soundEnabled: !settings.soundEnabled })}
          onTestVoice={() => voiceAndSoundSystem.testVoice()}
          onTestSound={() => voiceAndSoundSystem.testSound()}
        />
      </div>

      {/* Alerts List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">هشدارهای من</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              پشتیبان‌گیری
            </Button>
            <Button variant="outline" size="sm" onClick={() => document.getElementById('import-file')?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              بازیابی
            </Button>
            <input
              id="import-file"
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />
          </div>
        </div>
        
        {alerts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>هنوز هیچ هشداری ایجاد نکرده‌اید</p>
            <p className="text-sm mt-1">برای شروع، هشدار جدیدی ایجاد کنید</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <Card key={alert.id} className="p-4 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getAlertTypeIcon(alert.type)}
                    <div>
                      <h3 className="font-medium">{alert.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {alert.time} - {alert.days.map(d => getDayNames()[d]).join('، ')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={alert.enabled}
                      onCheckedChange={(checked) => handleToggleAlert(alert.id, checked)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(alert)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAlert(alert.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
