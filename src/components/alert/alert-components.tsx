"use client";

import React, { useState, useEffect } from 'react';
import { Alert } from '@/lib/alert-storage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Clock, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  X, 
  Clock as SnoozeIcon,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Settings,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertNotificationProps {
  alert: Alert;
  onDismiss: () => void;
  onSnooze: (minutes: number) => void;
  onSettings: () => void;
}

export function AlertNotification({ 
  alert, 
  onDismiss, 
  onSnooze, 
  onSettings 
}: AlertNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Ambient pulse effect
    const pulseInterval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(pulseInterval);
  }, [alert]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  const handleSnooze = (minutes: number) => {
    setIsVisible(false);
    setTimeout(() => onSnooze(minutes), 300);
  };

  const getAlertColor = () => {
    switch (alert.type) {
      case 'focus':
        return 'from-blue-500/20 to-purple-500/20 border-blue-500/30';
      case 'break':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'reminder':
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      case 'custom':
        return 'from-purple-500/20 to-pink-500/20 border-purple-500/30';
      default:
        return 'from-gray-500/20 to-slate-500/20 border-gray-500/30';
    }
  };

  const getAlertIcon = () => {
    switch (alert.type) {
      case 'focus':
        return <Play className="w-5 h-5 text-blue-400" />;
      case 'break':
        return <Pause className="w-5 h-5 text-green-400" />;
      case 'reminder':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'custom':
        return <Bell className="w-5 h-5 text-purple-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const pulseIntensity = Math.sin(pulsePhase * 0.1) * 0.5 + 0.5;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Ambient background overlay */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: pulseIntensity * 0.3 }}
      />
      
      {/* Notification card */}
      <Card 
        className={cn(
          "relative max-w-md w-full p-6 bg-gradient-to-br backdrop-blur-xl border shadow-2xl transform transition-all duration-300",
          getAlertColor(),
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
        style={{
          boxShadow: `0 0 ${20 + pulseIntensity * 20}px rgba(0,0,0,0.3), 0 0 ${40 + pulseIntensity * 40}px rgba(0,0,0,0.1)`
        }}
      >
        {/* Ambient pulse effect */}
        <div 
          className="absolute inset-0 rounded-lg opacity-20"
          style={{
            background: `radial-gradient(circle at center, rgba(255,255,255,${pulseIntensity * 0.1}) 0%, transparent 70%)`,
            animation: 'pulse 2s ease-in-out infinite'
          }}
        />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getAlertIcon()}
              <div>
                <h3 className="text-lg font-semibold text-foreground">{alert.title}</h3>
                <p className="text-sm text-muted-foreground">{alert.time}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Message */}
          {alert.message && (
            <p className="text-foreground/90 mb-4 leading-relaxed">{alert.message}</p>
          )}

          {/* Alert type badge */}
          <div className="mb-4">
            <Badge 
              variant="secondary" 
              className={cn(
                "text-xs",
                alert.type === 'focus' && "bg-blue-500/20 text-blue-300 border-blue-500/30",
                alert.type === 'break' && "bg-green-500/20 text-green-300 border-green-500/30",
                alert.type === 'reminder' && "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
                alert.type === 'custom' && "bg-purple-500/20 text-purple-300 border-purple-500/30"
              )}
            >
              {alert.type === 'focus' && 'تمرکز'}
              {alert.type === 'break' && 'استراحت'}
              {alert.type === 'reminder' && 'یادآوری'}
              {alert.type === 'custom' && 'سفارشی'}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSnooze(5)}
              className="flex-1"
            >
              <SnoozeIcon className="w-4 h-4 mr-2" />
              ۵ دقیقه
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSnooze(15)}
              className="flex-1"
            >
              <SnoozeIcon className="w-4 h-4 mr-2" />
              ۱۵ دقیقه
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSnooze(30)}
              className="flex-1"
            >
              <SnoozeIcon className="w-4 h-4 mr-2" />
              ۳۰ دقیقه
            </Button>
          </div>

          {/* Settings button */}
          <div className="mt-3 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettings}
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings className="w-4 h-4 mr-2" />
              تنظیمات
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface SmartSuggestionCardProps {
  suggestion: {
    type: string;
    message: string;
    confidence: number;
    action?: () => void;
  };
  onDismiss: () => void;
  onApply: () => void;
}

export function SmartSuggestionCard({ 
  suggestion, 
  onDismiss, 
  onApply 
}: SmartSuggestionCardProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  const handleApply = () => {
    if (suggestion.action) {
      suggestion.action();
    }
    setIsVisible(false);
    setTimeout(onApply, 300);
  };

  if (!isVisible) return null;

  return (
    <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20 mb-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              پیشنهاد هوشمند
            </h4>
            <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-600">
              {Math.round(suggestion.confidence * 100)}% اطمینان
            </Badge>
          </div>
          
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-3">
            {suggestion.message}
          </p>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleApply}
              className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30 border-yellow-500/30"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              اعمال
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              className="text-yellow-600 border-yellow-500/30 hover:bg-yellow-500/10"
            >
              <X className="w-4 h-4 mr-2" />
              رد
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

interface AmbientPulseProps {
  isActive: boolean;
  intensity?: number;
  color?: string;
}

export function AmbientPulse({ 
  isActive, 
  intensity = 0.5, 
  color = 'rgba(106, 62, 171, 0.3)' 
}: AmbientPulseProps) {
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const pulseInterval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(pulseInterval);
  }, [isActive]);

  if (!isActive) return null;

  const pulseIntensity = Math.sin(pulsePhase * 0.1) * intensity;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-40"
      style={{
        background: `radial-gradient(circle at center, ${color.replace('0.3', (pulseIntensity * 0.3).toString())} 0%, transparent 70%)`,
        opacity: pulseIntensity * 0.5,
        transition: 'opacity 0.3s ease-in-out'
      }}
    />
  );
}

interface VoiceControlsProps {
  isVoiceEnabled: boolean;
  isSoundEnabled: boolean;
  onToggleVoice: () => void;
  onToggleSound: () => void;
  onTestVoice: () => void;
  onTestSound: () => void;
}

export function VoiceControls({
  isVoiceEnabled,
  isSoundEnabled,
  onToggleVoice,
  onToggleSound,
  onTestVoice,
  onTestSound
}: VoiceControlsProps) {
  return (
    <Card className="p-4 bg-muted/30">
      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
        <Volume2 className="w-4 h-4" />
        کنترل صدا
      </h4>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isVoiceEnabled ? <Mic className="w-4 h-4 text-green-500" /> : <MicOff className="w-4 h-4 text-red-500" />}
            <span className="text-sm">صدای گفتار</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onTestVoice}
              disabled={!isVoiceEnabled}
            >
              تست
            </Button>
            <Button
              variant={isVoiceEnabled ? "default" : "outline"}
              size="sm"
              onClick={onToggleVoice}
            >
              {isVoiceEnabled ? "فعال" : "غیرفعال"}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isSoundEnabled ? <Volume2 className="w-4 h-4 text-green-500" /> : <VolumeX className="w-4 h-4 text-red-500" />}
            <span className="text-sm">صدای هشدار</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onTestSound}
              disabled={!isSoundEnabled}
            >
              تست
            </Button>
            <Button
              variant={isSoundEnabled ? "default" : "outline"}
              size="sm"
              onClick={onToggleSound}
            >
              {isSoundEnabled ? "فعال" : "غیرفعال"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
