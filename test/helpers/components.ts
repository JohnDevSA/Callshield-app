/**
 * Component test helpers for CallShield
 */
import { mount, type VueWrapper, type MountingOptions } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import type { Component } from 'vue';

/**
 * Mount a component with Pinia and common test utilities
 */
export function mountWithPinia<T extends Component>(
  component: T,
  options: MountingOptions<T> = {}
): VueWrapper {
  const pinia = createPinia();
  setActivePinia(pinia);

  return mount(component, {
    global: {
      plugins: [pinia],
      stubs: {
        IonIcon: {
          template: '<span class="ion-icon-stub" :data-icon="icon"><slot /></span>',
          props: ['icon']
        },
        ...options.global?.stubs
      },
      ...options.global
    },
    ...options
  });
}

/**
 * Mount a component without Pinia (for simple presentational components)
 */
export function mountComponent<T extends Component>(
  component: T,
  options: MountingOptions<T> = {}
): VueWrapper {
  return mount(component, {
    global: {
      stubs: {
        IonIcon: {
          template: '<span class="ion-icon-stub" :data-icon="icon"><slot /></span>',
          props: ['icon']
        },
        ...options.global?.stubs
      },
      ...options.global
    },
    ...options
  });
}

/**
 * Wait for Vue to process reactive updates
 */
export async function flushPromises(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 0));
}

/**
 * Find element by test id
 */
export function findByTestId(wrapper: VueWrapper, testId: string) {
  return wrapper.find(`[data-testid="${testId}"]`);
}
