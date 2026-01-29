import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { UserSettings } from '~/types';
import { useDatabase } from '~/composables/useDatabase';

export const useSettingsStore = defineStore('settings', () => {
  const { getSettings, updateSettings } = useDatabase();

  // State - default settings
  const settings = ref<UserSettings>({
    autoBlockSpam: false,
    autoBlockThreshold: 80,
    showCallOverlay: true,
    postCallPrompt: true,
    wifiOnlySync: true,
    enableNotifications: true,
    darkMode: 'system',
    language: 'en'
  });

  const isLoaded = ref(false);

  // Load settings from database
  async function loadSettings() {
    try {
      const stored = await getSettings();
      settings.value = { ...settings.value, ...stored };
      isLoaded.value = true;
      console.log('[CallShield] Settings loaded');
    } catch (error) {
      console.error('[CallShield] Failed to load settings:', error);
    }
  }

  // Save individual setting
  async function setSetting<K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) {
    settings.value[key] = value;
    await updateSettings({ [key]: value });
    console.log(`[CallShield] Setting updated: ${key} = ${value}`);
  }

  // Toggle boolean settings
  async function toggleSetting(key: keyof UserSettings) {
    if (typeof settings.value[key] === 'boolean') {
      await setSetting(key, !settings.value[key] as UserSettings[typeof key]);
    }
  }

  // Save all settings at once
  async function saveAllSettings() {
    await updateSettings(settings.value);
    console.log('[CallShield] All settings saved');
  }

  // Reset to defaults
  async function resetSettings() {
    settings.value = {
      autoBlockSpam: false,
      autoBlockThreshold: 80,
      showCallOverlay: true,
      postCallPrompt: true,
      wifiOnlySync: true,
      enableNotifications: true,
      darkMode: 'system',
      language: 'en'
    };
    await saveAllSettings();
    console.log('[CallShield] Settings reset to defaults');
  }

  // Available languages for SA
  const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'af', name: 'Afrikaans' },
    { code: 'zu', name: 'isiZulu' },
    { code: 'xh', name: 'isiXhosa' },
    { code: 'st', name: 'Sesotho' },
    { code: 'tn', name: 'Setswana' },
    { code: 'ss', name: 'siSwati' },
    { code: 've', name: 'Tshivenda' },
    { code: 'ts', name: 'Xitsonga' },
    { code: 'nr', name: 'isiNdebele' },
    { code: 'nso', name: 'Sepedi' }
  ];

  return {
    // State
    settings,
    isLoaded,
    availableLanguages,

    // Actions
    loadSettings,
    setSetting,
    toggleSetting,
    saveAllSettings,
    resetSettings
  };
});