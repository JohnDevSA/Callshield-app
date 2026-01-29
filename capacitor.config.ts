import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'za.co.callshield.app',
  appName: 'CallShield',
  webDir: 'dist',

  server: {
    androidScheme: 'https'
  },

  plugins: {
    // Push Notifications
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },

    // Local Notifications (for blocked call alerts)
    LocalNotifications: {
      smallIcon: 'ic_stat_icon',
      iconColor: '#2563EB',
      sound: 'default'
    },

    // Status Bar styling
    StatusBar: {
      style: 'light',
      backgroundColor: '#2563EB'
    },

    // Keyboard behavior
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true
    },

    // Background Task (for call monitoring)
    BackgroundTask: {
      // Background task configuration
    }
  },

  android: {
    allowMixedContent: false,
    backgroundColor: '#F9FAFB',
    // Required for call detection
    // See docs/NATIVE_PLUGINS.md for permissions
  },

  ios: {
    backgroundColor: '#F9FAFB',
    contentInset: 'automatic',
    // CallKit integration required
    // See docs/NATIVE_PLUGINS.md for setup
  }
};

export default config;