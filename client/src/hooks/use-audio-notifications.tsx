import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { audioService } from '@/lib/audio';

interface AudioNotificationContextType {
  isEnabled: boolean;
  enableAudio: () => Promise<void>;
  playNotification: (type: string) => Promise<void>;
  toggleAudio: () => void;
}

const AudioNotificationContext = createContext<AudioNotificationContextType | undefined>(undefined);

export function AudioNotificationProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(false);

  const enableAudio = async () => {
    try {
      await audioService.enableAudio();
      setIsEnabled(true);
      localStorage.setItem('audioEnabled', 'true');
    } catch (error) {
      console.warn('Failed to enable audio:', error);
    }
  };

  const playNotification = async (type: string) => {
    if (isEnabled) {
      await audioService.playNotification(type);
    }
  };

  const toggleAudio = () => {
    if (isEnabled) {
      setIsEnabled(false);
      localStorage.setItem('audioEnabled', 'false');
    } else {
      enableAudio();
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('audioEnabled');
    if (saved === 'true') {
      enableAudio();
    }
  }, []);

  return (
    <AudioNotificationContext.Provider value={{ isEnabled, enableAudio, playNotification, toggleAudio }}>
      {children}
    </AudioNotificationContext.Provider>
  );
}

export function useAudioNotifications() {
  const context = useContext(AudioNotificationContext);
  if (!context) {
    throw new Error('useAudioNotifications must be used within an AudioNotificationProvider');
  }
  return context;
}
