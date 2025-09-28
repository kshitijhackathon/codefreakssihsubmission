import { appWithTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { CartProvider } from '../context/CartContext';
import { DarkModeProvider } from '../context/DarkModeContext';
import '../styles/globals.css';
import '../styles/Home.module.css';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Register service worker for offline functionality
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Enhanced offline detection
    const handleOnline = () => {
      console.log('Connection restored');
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('connectionRestored');
        window.dispatchEvent(event);
      }
    };

    const handleOffline = () => {
      console.log('Connection lost');
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('connectionLost');
        window.dispatchEvent(event);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <DarkModeProvider>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </DarkModeProvider>
  );
}

export default appWithTranslation(MyApp);
