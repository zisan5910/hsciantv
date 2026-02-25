import { useState, useEffect, useCallback, useRef } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Global variable to persist the prompt across component re-renders and page navigations
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;

export const usePwaInstall = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const promptRef = useRef<BeforeInstallPromptEvent | null>(globalDeferredPrompt);

  useEffect(() => {
    // Check if already installed (running in standalone mode)
    const checkIfInstalled = () => {
      const isStandalone = 
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      
      return isStandalone;
    };

    if (checkIfInstalled()) {
      setIsInstalled(true);
      return;
    }

    // Listen for display mode changes (for when app is opened after install)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true);
        setIsReady(false);
        globalDeferredPrompt = null;
        promptRef.current = null;
      }
    };
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      globalDeferredPrompt = promptEvent;
      promptRef.current = promptEvent;
      setIsReady(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsReady(false);
      globalDeferredPrompt = null;
      promptRef.current = null;
    };

    // Check if prompt is already available from previous capture
    if (globalDeferredPrompt) {
      promptRef.current = globalDeferredPrompt;
      setIsReady(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  const installApp = useCallback(async () => {
    if (isInstalled) return;

    const prompt = promptRef.current || globalDeferredPrompt;

    if (prompt) {
      try {
        await prompt.prompt();
        const { outcome } = await prompt.userChoice;
        
        if (outcome === 'accepted') {
          setIsInstalled(true);
        }
        globalDeferredPrompt = null;
        promptRef.current = null;
        setIsReady(false);
      } catch (error) {
        console.error('Install error:', error);
      }
    } else {
      // Fallback: Show manual install instructions for browsers that don't support beforeinstallprompt
      const userAgent = navigator.userAgent.toLowerCase();
      const isIOS = /iphone|ipad|ipod/.test(userAgent);
      const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
      
      if (isIOS || isSafari) {
        alert('অ্যাপ ইন্সটল করতে:\n\n1. নিচে Share (শেয়ার) বাটনে ট্যাপ করুন\n2. "Add to Home Screen" সিলেক্ট করুন\n3. উপরের ডানে "Add" এ ট্যাপ করুন');
      } else {
        alert('অ্যাপ ইন্সটল করতে:\n\nব্রাউজারের মেনু (⋮) থেকে "Install App" বা "Add to Home Screen" সিলেক্ট করুন');
      }
    }
  }, [isInstalled]);

  return { 
    isInstallable: isReady && !isInstalled, 
    isInstalled, 
    installApp
  };
};
