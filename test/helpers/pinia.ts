/**
 * Pinia test helpers for CallShield
 */
import { createPinia, setActivePinia, type Pinia } from 'pinia';
import { createTestingPinia, type TestingPinia } from '@pinia/testing';
import { vi } from 'vitest';

/**
 * Create and activate a fresh Pinia instance for testing
 */
export function setupPinia(): Pinia {
  const pinia = createPinia();
  setActivePinia(pinia);
  return pinia;
}

/**
 * Create a testing Pinia with stubbed actions
 */
export function setupTestingPinia(options: {
  stubActions?: boolean;
  createSpy?: () => ReturnType<typeof vi.fn>;
  initialState?: Record<string, unknown>;
} = {}): TestingPinia {
  const pinia = createTestingPinia({
    stubActions: options.stubActions ?? true,
    createSpy: options.createSpy ?? vi.fn,
    initialState: options.initialState
  });
  setActivePinia(pinia);
  return pinia;
}

/**
 * Create a real Pinia (non-stubbed) for integration tests
 */
export function setupRealPinia(): Pinia {
  const pinia = createPinia();
  setActivePinia(pinia);
  return pinia;
}
