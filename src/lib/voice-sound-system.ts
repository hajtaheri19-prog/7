import { Alert } from './alert-storage';

export interface VoiceSettings {
  enabled: boolean;
  language: string;
  rate: number; // 0.1 to 10
  pitch: number; // 0 to 2
  volume: number; // 0 to 1
  voice?: SpeechSynthesisVoice;
}

export interface SoundSettings {
  enabled: boolean;
  volume: number; // 0 to 1
  frequency: number; // Hz
  duration: number; // milliseconds
  type: 'beep' | 'chime' | 'bell' | 'custom';
}

class VoiceAndSoundSystem {
  private voiceSettings: VoiceSettings = {
    enabled: true,
    language: 'fa-IR',
    rate: 1,
    pitch: 1,
    volume: 0.8
  };

  private soundSettings: SoundSettings = {
    enabled: true,
    volume: 0.5,
    frequency: 800,
    duration: 500,
    type: 'chime'
  };

  private audioContext: AudioContext | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isInitialized = false;

  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Load voices
      await this.loadVoices();
      
      // Load settings from storage
      await this.loadSettings();
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize voice and sound system:', error);
    }
  }

  private async loadVoices(): Promise<void> {
    return new Promise((resolve) => {
      if (speechSynthesis.getVoices().length > 0) {
        this.voices = speechSynthesis.getVoices();
        resolve();
      } else {
        speechSynthesis.addEventListener('voiceschanged', () => {
          this.voices = speechSynthesis.getVoices();
          resolve();
        });
      }
    });
  }

  private async loadSettings(): Promise<void> {
    try {
      const voiceSettingsData = localStorage.getItem('tabdila_voice_settings');
      if (voiceSettingsData) {
        this.voiceSettings = { ...this.voiceSettings, ...JSON.parse(voiceSettingsData) };
      }

      const soundSettingsData = localStorage.getItem('tabdila_sound_settings');
      if (soundSettingsData) {
        this.soundSettings = { ...this.soundSettings, ...JSON.parse(soundSettingsData) };
      }
    } catch (error) {
      console.warn('Failed to load voice/sound settings:', error);
    }
  }

  private async saveSettings(): Promise<void> {
    try {
      localStorage.setItem('tabdila_voice_settings', JSON.stringify(this.voiceSettings));
      localStorage.setItem('tabdila_sound_settings', JSON.stringify(this.soundSettings));
    } catch (error) {
      console.warn('Failed to save voice/sound settings:', error);
    }
  }

  // Voice TTS Methods
  async speakAlert(alert: Alert): Promise<void> {
    if (!this.voiceSettings.enabled || !this.isInitialized) return;

    const message = this.generateAlertMessage(alert);
    await this.speak(message);
  }

  async speak(text: string): Promise<void> {
    if (!this.voiceSettings.enabled || !this.isInitialized) return;

    return new Promise((resolve, reject) => {
      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice
      if (this.voiceSettings.voice) {
        utterance.voice = this.voiceSettings.voice;
      } else {
        // Find best Persian voice
        const persianVoice = this.voices.find(voice => 
          voice.lang.startsWith('fa') || voice.lang.startsWith('persian')
        );
        if (persianVoice) {
          utterance.voice = persianVoice;
        }
      }

      // Set voice properties
      utterance.rate = this.voiceSettings.rate;
      utterance.pitch = this.voiceSettings.pitch;
      utterance.volume = this.voiceSettings.volume;
      utterance.lang = this.voiceSettings.language;

      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);

      speechSynthesis.speak(utterance);
    });
  }

  private generateAlertMessage(alert: Alert): string {
    const time = alert.time;
    const title = alert.title;
    
    switch (alert.type) {
      case 'focus':
        return `زمان تمرکز فرا رسیده است. ${title}`;
      case 'break':
        return `زمان استراحت فرا رسیده است. ${title}`;
      case 'reminder':
        return `یادآوری: ${title}`;
      case 'custom':
        return title;
      default:
        return title;
    }
  }

  // Sound Methods
  async playAlertSound(alert: Alert): Promise<void> {
    if (!this.soundSettings.enabled || !this.isInitialized) return;

    switch (this.soundSettings.type) {
      case 'beep':
        await this.playBeep();
        break;
      case 'chime':
        await this.playChime();
        break;
      case 'bell':
        await this.playBell();
        break;
      case 'custom':
        await this.playCustomSound(alert);
        break;
    }
  }

  private async playBeep(): Promise<void> {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(this.soundSettings.frequency, this.audioContext.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.soundSettings.volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + this.soundSettings.duration / 1000);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + this.soundSettings.duration / 1000);
  }

  private async playChime(): Promise<void> {
    if (!this.audioContext) return;

    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    const duration = this.soundSettings.duration / 1000;

    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.frequency.setValueAtTime(freq, this.audioContext!.currentTime);
      oscillator.type = 'sine';

      const startTime = this.audioContext!.currentTime + index * 0.1;
      const endTime = startTime + duration;

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(this.soundSettings.volume * 0.3, startTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, endTime);

      oscillator.start(startTime);
      oscillator.stop(endTime);
    });
  }

  private async playBell(): Promise<void> {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.5);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.soundSettings.volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 1);
  }

  private async playCustomSound(alert: Alert): Promise<void> {
    // Custom sound based on alert type
    if (!this.audioContext) return;

    const frequencies = this.getCustomFrequencies(alert.type);
    const duration = this.soundSettings.duration / 1000;

    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.frequency.setValueAtTime(freq, this.audioContext!.currentTime);
      oscillator.type = 'sine';

      const startTime = this.audioContext!.currentTime + index * 0.05;
      const endTime = startTime + duration;

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(this.soundSettings.volume * 0.4, startTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, endTime);

      oscillator.start(startTime);
      oscillator.stop(endTime);
    });
  }

  private getCustomFrequencies(type: Alert['type']): number[] {
    switch (type) {
      case 'focus':
        return [440, 554.37, 659.25]; // A4, C#5, E5 - uplifting
      case 'break':
        return [392, 523.25, 659.25]; // G4, C5, E5 - relaxing
      case 'reminder':
        return [523.25, 659.25]; // C5, E5 - simple
      case 'custom':
        return [440, 554.37]; // A4, C#5 - neutral
      default:
        return [440]; // A4 - default
    }
  }

  // Settings Methods
  updateVoiceSettings(settings: Partial<VoiceSettings>): void {
    this.voiceSettings = { ...this.voiceSettings, ...settings };
    this.saveSettings();
  }

  updateSoundSettings(settings: Partial<SoundSettings>): void {
    this.soundSettings = { ...this.soundSettings, ...settings };
    this.saveSettings();
  }

  getVoiceSettings(): VoiceSettings {
    return { ...this.voiceSettings };
  }

  getSoundSettings(): SoundSettings {
    return { ...this.soundSettings };
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices.filter(voice => 
      voice.lang.startsWith('fa') || 
      voice.lang.startsWith('persian') ||
      voice.lang.startsWith('en')
    );
  }

  // Utility Methods
  async testVoice(text: string = 'تست صدا'): Promise<void> {
    await this.speak(text);
  }

  async testSound(): Promise<void> {
    await this.playBeep();
  }

  stopAll(): void {
    speechSynthesis.cancel();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  isVoiceSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  isSoundSupported(): boolean {
    return 'AudioContext' in window || 'webkitAudioContext' in window;
  }
}

// Singleton instance
export const voiceAndSoundSystem = new VoiceAndSoundSystem();

// Initialize on module load
if (typeof window !== 'undefined') {
  voiceAndSoundSystem.init().catch(console.error);
}
