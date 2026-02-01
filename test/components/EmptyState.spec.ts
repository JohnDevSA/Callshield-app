/**
 * Tests for EmptyState component
 */
import { describe, it, expect } from 'vitest';
import { mountComponent } from '../helpers';
import EmptyState from '~/components/EmptyState.vue';

describe('EmptyState', () => {
  describe('rendering', () => {
    it('should render with required props', () => {
      const wrapper = mountComponent(EmptyState, {
        props: {
          icon: 'call-outline',
          title: 'No calls yet'
        }
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should display title', () => {
      const wrapper = mountComponent(EmptyState, {
        props: {
          icon: 'call-outline',
          title: 'No recent calls'
        }
      });

      expect(wrapper.text()).toContain('No recent calls');
    });

    it('should display subtitle when provided', () => {
      const wrapper = mountComponent(EmptyState, {
        props: {
          icon: 'call-outline',
          title: 'No calls',
          subtitle: 'Make your first call'
        }
      });

      expect(wrapper.text()).toContain('Make your first call');
    });

    it('should not render subtitle when not provided', () => {
      const wrapper = mountComponent(EmptyState, {
        props: {
          icon: 'call-outline',
          title: 'No calls'
        }
      });

      // Should only have one p element (title)
      const paragraphs = wrapper.findAll('p');
      expect(paragraphs.length).toBe(1);
    });
  });

  describe('icon', () => {
    it('should pass icon to IonIcon stub', () => {
      const wrapper = mountComponent(EmptyState, {
        props: {
          icon: 'ban-outline',
          title: 'No blocked numbers'
        }
      });

      const iconStub = wrapper.find('.ion-icon-stub');
      expect(iconStub.attributes('data-icon')).toBe('ban-outline');
    });

    it('should have large icon size class', () => {
      const wrapper = mountComponent(EmptyState, {
        props: {
          icon: 'call-outline',
          title: 'Test'
        }
      });

      const iconStub = wrapper.find('.ion-icon-stub');
      expect(iconStub.classes()).toContain('text-5xl');
    });

    it('should have reduced opacity', () => {
      const wrapper = mountComponent(EmptyState, {
        props: {
          icon: 'call-outline',
          title: 'Test'
        }
      });

      const iconStub = wrapper.find('.ion-icon-stub');
      expect(iconStub.classes()).toContain('opacity-50');
    });
  });

  describe('layout', () => {
    it('should be centered', () => {
      const wrapper = mountComponent(EmptyState, {
        props: {
          icon: 'call-outline',
          title: 'Test'
        }
      });

      expect(wrapper.find('.text-center').exists()).toBe(true);
    });

    it('should have vertical padding', () => {
      const wrapper = mountComponent(EmptyState, {
        props: {
          icon: 'call-outline',
          title: 'Test'
        }
      });

      expect(wrapper.find('.py-12').exists()).toBe(true);
    });

    it('should have secondary text color', () => {
      const wrapper = mountComponent(EmptyState, {
        props: {
          icon: 'call-outline',
          title: 'Test'
        }
      });

      expect(wrapper.find('.text-secondary').exists()).toBe(true);
    });
  });

  describe('subtitle styling', () => {
    it('should have smaller text size for subtitle', () => {
      const wrapper = mountComponent(EmptyState, {
        props: {
          icon: 'call-outline',
          title: 'No calls',
          subtitle: 'Start making calls'
        }
      });

      const paragraphs = wrapper.findAll('p');
      expect(paragraphs[1].classes()).toContain('text-sm');
    });
  });
});
