// Capacitor initialization - client-side only
import { useDatabase } from '~/composables/useDatabase';
import { useMockData } from '~/composables/useMockData';

export default defineNuxtPlugin(async () => {
  const { initDatabase } = useDatabase();
  const { seedDatabase } = useMockData();

  try {
    await initDatabase();

    // Seed mock data in development
    if (import.meta.dev) {
      await seedDatabase();
    }

    console.log('[CallShield] Capacitor plugin initialized');
  } catch (error) {
    console.error('[CallShield] Failed to initialize:', error);
  }
});