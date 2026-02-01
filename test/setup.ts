/**
 * Global test setup for CallShield Vitest tests
 */
import 'fake-indexeddb/auto';
import { vi } from 'vitest';
import { config } from '@vue/test-utils';

// Mock Capacitor modules
vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: () => false,
    getPlatform: () => 'web'
  }
}));

vi.mock('@capacitor/app', () => ({
  App: {
    addListener: vi.fn(),
    removeAllListeners: vi.fn(),
    minimizeApp: vi.fn()
  }
}));

vi.mock('@capacitor/network', () => ({
  Network: {
    getStatus: vi.fn().mockResolvedValue({ connected: true, connectionType: 'wifi' }),
    addListener: vi.fn()
  }
}));

vi.mock('@capacitor/status-bar', () => ({
  StatusBar: {
    setStyle: vi.fn(),
    setBackgroundColor: vi.fn()
  },
  Style: {
    Light: 'LIGHT',
    Dark: 'DARK'
  }
}));

// Mock window.navigator for web tests
Object.defineProperty(window, 'navigator', {
  value: {
    onLine: true
  },
  writable: true
});

// Mock console methods to reduce noise in tests
vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'warn').mockImplementation(() => {});

// Configure Vue Test Utils global stubs for Ionic components
config.global.stubs = {
  IonIcon: {
    template: '<span class="ion-icon-stub" :data-icon="icon"><slot /></span>',
    props: ['icon']
  },
  IonPage: {
    template: '<div class="ion-page-stub"><slot /></div>'
  },
  IonHeader: {
    template: '<header class="ion-header-stub"><slot /></header>'
  },
  IonContent: {
    template: '<main class="ion-content-stub"><slot /></main>'
  },
  IonButton: {
    template: '<button class="ion-button-stub"><slot /></button>'
  },
  IonInput: {
    template: '<input class="ion-input-stub" />'
  },
  IonItem: {
    template: '<div class="ion-item-stub"><slot /></div>'
  },
  IonLabel: {
    template: '<label class="ion-label-stub"><slot /></label>'
  },
  IonList: {
    template: '<div class="ion-list-stub"><slot /></div>'
  },
  IonToggle: {
    template: '<input type="checkbox" class="ion-toggle-stub" />'
  }
};
