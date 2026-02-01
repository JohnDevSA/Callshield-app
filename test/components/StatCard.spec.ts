/**
 * Tests for StatCard component
 */
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StatCard from '~/components/StatCard.vue';

describe('StatCard', () => {
  describe('rendering', () => {
    it('should render with required props', () => {
      const wrapper = mount(StatCard, {
        props: {
          value: 42,
          label: 'Total Calls'
        }
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should display numeric value', () => {
      const wrapper = mount(StatCard, {
        props: {
          value: 123,
          label: 'Blocked'
        }
      });

      expect(wrapper.text()).toContain('123');
    });

    it('should display string value', () => {
      const wrapper = mount(StatCard, {
        props: {
          value: 'N/A',
          label: 'Status'
        }
      });

      expect(wrapper.text()).toContain('N/A');
    });

    it('should display label', () => {
      const wrapper = mount(StatCard, {
        props: {
          value: 5,
          label: 'Spam Today'
        }
      });

      expect(wrapper.text()).toContain('Spam Today');
    });
  });

  describe('color variants', () => {
    it('should apply primary color', () => {
      const wrapper = mount(StatCard, {
        props: {
          value: 10,
          label: 'Test',
          color: 'primary'
        }
      });

      expect(wrapper.find('.text-primary').exists()).toBe(true);
    });

    it('should apply danger color (red)', () => {
      const wrapper = mount(StatCard, {
        props: {
          value: 10,
          label: 'Test',
          color: 'danger'
        }
      });

      expect(wrapper.find('.text-red-500').exists()).toBe(true);
    });

    it('should apply warning color (amber)', () => {
      const wrapper = mount(StatCard, {
        props: {
          value: 10,
          label: 'Test',
          color: 'warning'
        }
      });

      expect(wrapper.find('.text-amber-500').exists()).toBe(true);
    });

    it('should apply success color (green)', () => {
      const wrapper = mount(StatCard, {
        props: {
          value: 10,
          label: 'Test',
          color: 'success'
        }
      });

      expect(wrapper.find('.text-green-500').exists()).toBe(true);
    });

    it('should not apply color class when color prop is not set', () => {
      const wrapper = mount(StatCard, {
        props: {
          value: 10,
          label: 'Test'
        }
      });

      expect(wrapper.find('.text-primary').exists()).toBe(false);
      expect(wrapper.find('.text-red-500').exists()).toBe(false);
      expect(wrapper.find('.text-amber-500').exists()).toBe(false);
      expect(wrapper.find('.text-green-500').exists()).toBe(false);
    });
  });

  describe('layout', () => {
    it('should have card class', () => {
      const wrapper = mount(StatCard, {
        props: {
          value: 10,
          label: 'Test'
        }
      });

      expect(wrapper.find('.card').exists()).toBe(true);
    });

    it('should be centered', () => {
      const wrapper = mount(StatCard, {
        props: {
          value: 10,
          label: 'Test'
        }
      });

      expect(wrapper.find('.text-center').exists()).toBe(true);
    });

    it('should have bold value', () => {
      const wrapper = mount(StatCard, {
        props: {
          value: 10,
          label: 'Test'
        }
      });

      expect(wrapper.find('.font-bold').exists()).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle zero value', () => {
      const wrapper = mount(StatCard, {
        props: {
          value: 0,
          label: 'None'
        }
      });

      expect(wrapper.text()).toContain('0');
    });

    it('should handle large numbers', () => {
      const wrapper = mount(StatCard, {
        props: {
          value: 999999,
          label: 'Total'
        }
      });

      expect(wrapper.text()).toContain('999999');
    });

    it('should handle empty string value', () => {
      const wrapper = mount(StatCard, {
        props: {
          value: '',
          label: 'Test'
        }
      });

      expect(wrapper.exists()).toBe(true);
    });
  });
});
