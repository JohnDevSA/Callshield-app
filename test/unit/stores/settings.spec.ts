/**
 * Tests for settings store
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useSettingsStore } from '~/stores/settings';
import { useDatabase } from '~/composables/useDatabase';
import { setupPinia, resetDatabase } from '../../helpers';

describe('useSettingsStore', () => {
  beforeEach(async () => {
    setupPinia();
    await resetDatabase();
  });

  afterEach(async () => {
    await resetDatabase();
  });

  describe('initial state', () => {
    it('should have default settings', () => {
      const store = useSettingsStore();

      expect(store.settings.autoBlockSpam).toBe(false);
      expect(store.settings.autoBlockThreshold).toBe(80);
      expect(store.settings.showCallOverlay).toBe(true);
      expect(store.settings.postCallPrompt).toBe(true);
      expect(store.settings.wifiOnlySync).toBe(true);
      expect(store.settings.enableNotifications).toBe(true);
      expect(store.settings.darkMode).toBe('system');
      expect(store.settings.language).toBe('en');
    });

    it('should not be loaded initially', () => {
      const store = useSettingsStore();

      expect(store.isLoaded).toBe(false);
    });
  });

  describe('availableLanguages', () => {
    it('should include all South African languages', () => {
      const store = useSettingsStore();

      expect(store.availableLanguages.length).toBe(11);
      expect(store.availableLanguages.map(l => l.code)).toContain('en');
      expect(store.availableLanguages.map(l => l.code)).toContain('af');
      expect(store.availableLanguages.map(l => l.code)).toContain('zu');
      expect(store.availableLanguages.map(l => l.code)).toContain('xh');
    });

    it('should have correct language names', () => {
      const store = useSettingsStore();

      const english = store.availableLanguages.find(l => l.code === 'en');
      expect(english?.name).toBe('English');

      const zulu = store.availableLanguages.find(l => l.code === 'zu');
      expect(zulu?.name).toBe('isiZulu');

      const afrikaans = store.availableLanguages.find(l => l.code === 'af');
      expect(afrikaans?.name).toBe('Afrikaans');
    });
  });

  describe('action: loadSettings', () => {
    it('should load settings from database', async () => {
      const store = useSettingsStore();
      const { initDatabase, updateSettings } = useDatabase();

      await initDatabase();
      await updateSettings({ language: 'af', autoBlockSpam: true });

      await store.loadSettings();

      expect(store.settings.language).toBe('af');
      expect(store.settings.autoBlockSpam).toBe(true);
      expect(store.isLoaded).toBe(true);
    });

    it('should merge with defaults', async () => {
      const store = useSettingsStore();
      const { initDatabase } = useDatabase();

      await initDatabase();

      await store.loadSettings();

      // Should have defaults
      expect(store.settings.autoBlockThreshold).toBe(80);
    });
  });

  describe('action: setSetting', () => {
    it('should update a single setting', async () => {
      const store = useSettingsStore();
      const { initDatabase, getSettings } = useDatabase();

      await initDatabase();

      await store.setSetting('language', 'zu');

      expect(store.settings.language).toBe('zu');

      // Verify persisted to database
      const dbSettings = await getSettings();
      expect(dbSettings.language).toBe('zu');
    });

    it('should update autoBlockThreshold', async () => {
      const store = useSettingsStore();
      const { initDatabase } = useDatabase();

      await initDatabase();

      await store.setSetting('autoBlockThreshold', 70);

      expect(store.settings.autoBlockThreshold).toBe(70);
    });

    it('should update darkMode', async () => {
      const store = useSettingsStore();
      const { initDatabase } = useDatabase();

      await initDatabase();

      await store.setSetting('darkMode', 'dark');

      expect(store.settings.darkMode).toBe('dark');
    });
  });

  describe('action: toggleSetting', () => {
    it('should toggle boolean settings', async () => {
      const store = useSettingsStore();
      const { initDatabase } = useDatabase();

      await initDatabase();

      expect(store.settings.autoBlockSpam).toBe(false);

      await store.toggleSetting('autoBlockSpam');

      expect(store.settings.autoBlockSpam).toBe(true);

      await store.toggleSetting('autoBlockSpam');

      expect(store.settings.autoBlockSpam).toBe(false);
    });

    it('should toggle enableNotifications', async () => {
      const store = useSettingsStore();
      const { initDatabase } = useDatabase();

      await initDatabase();

      expect(store.settings.enableNotifications).toBe(true);

      await store.toggleSetting('enableNotifications');

      expect(store.settings.enableNotifications).toBe(false);
    });

    it('should toggle showCallOverlay', async () => {
      const store = useSettingsStore();
      const { initDatabase } = useDatabase();

      await initDatabase();

      await store.toggleSetting('showCallOverlay');

      expect(store.settings.showCallOverlay).toBe(false);
    });
  });

  describe('action: saveAllSettings', () => {
    it('should persist all settings', async () => {
      const store = useSettingsStore();
      const { initDatabase, getSettings } = useDatabase();

      await initDatabase();

      store.settings.language = 'xh';
      store.settings.autoBlockSpam = true;
      store.settings.autoBlockThreshold = 60;

      await store.saveAllSettings();

      const dbSettings = await getSettings();
      expect(dbSettings.language).toBe('xh');
      expect(dbSettings.autoBlockSpam).toBe(true);
      expect(dbSettings.autoBlockThreshold).toBe(60);
    });
  });

  describe('action: resetSettings', () => {
    it('should reset to default values', async () => {
      const store = useSettingsStore();
      const { initDatabase } = useDatabase();

      await initDatabase();

      // Change some settings
      await store.setSetting('language', 'af');
      await store.setSetting('autoBlockSpam', true);
      await store.setSetting('autoBlockThreshold', 50);

      await store.resetSettings();

      expect(store.settings.language).toBe('en');
      expect(store.settings.autoBlockSpam).toBe(false);
      expect(store.settings.autoBlockThreshold).toBe(80);
    });

    it('should persist reset values to database', async () => {
      const store = useSettingsStore();
      const { initDatabase, getSettings } = useDatabase();

      await initDatabase();
      await store.setSetting('language', 'af');

      await store.resetSettings();

      const dbSettings = await getSettings();
      expect(dbSettings.language).toBe('en');
    });
  });
});
