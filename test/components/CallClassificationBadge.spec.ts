/**
 * Tests for CallClassificationBadge component
 */
import { describe, it, expect } from 'vitest';
import { mountComponent } from '../helpers';
import CallClassificationBadge from '~/components/CallClassificationBadge.vue';

describe('CallClassificationBadge', () => {
  describe('classification colors', () => {
    it('should have green background for verified', () => {
      const wrapper = mountComponent(CallClassificationBadge, {
        props: { classification: 'verified' }
      });

      expect(wrapper.find('.bg-green-100').exists()).toBe(true);
      expect(wrapper.find('.text-green-700').exists()).toBe(true);
    });

    it('should have green background for safe', () => {
      const wrapper = mountComponent(CallClassificationBadge, {
        props: { classification: 'safe' }
      });

      expect(wrapper.find('.bg-green-100').exists()).toBe(true);
      expect(wrapper.find('.text-green-700').exists()).toBe(true);
    });

    it('should have blue background for contact', () => {
      const wrapper = mountComponent(CallClassificationBadge, {
        props: { classification: 'contact' }
      });

      expect(wrapper.find('.bg-blue-100').exists()).toBe(true);
      expect(wrapper.find('.text-blue-700').exists()).toBe(true);
    });

    it('should have amber background for low_spam', () => {
      const wrapper = mountComponent(CallClassificationBadge, {
        props: { classification: 'low_spam' }
      });

      expect(wrapper.find('.bg-amber-100').exists()).toBe(true);
      expect(wrapper.find('.text-amber-700').exists()).toBe(true);
    });

    it('should have red background for high_spam', () => {
      const wrapper = mountComponent(CallClassificationBadge, {
        props: { classification: 'high_spam' }
      });

      expect(wrapper.find('.bg-red-100').exists()).toBe(true);
      expect(wrapper.find('.text-red-700').exists()).toBe(true);
    });

    it('should have gray background for unknown', () => {
      const wrapper = mountComponent(CallClassificationBadge, {
        props: { classification: 'unknown' }
      });

      expect(wrapper.find('.bg-gray-100').exists()).toBe(true);
      expect(wrapper.find('.text-gray-600').exists()).toBe(true);
    });

    it('should have gray background for blocked', () => {
      const wrapper = mountComponent(CallClassificationBadge, {
        props: { classification: 'blocked' }
      });

      expect(wrapper.find('.bg-gray-100').exists()).toBe(true);
      expect(wrapper.find('.text-gray-600').exists()).toBe(true);
    });
  });

  describe('classification labels', () => {
    it('should display "Verified" for verified', () => {
      const wrapper = mountComponent(CallClassificationBadge, {
        props: { classification: 'verified' }
      });

      expect(wrapper.text()).toContain('Verified');
    });

    it('should display "Safe" for safe', () => {
      const wrapper = mountComponent(CallClassificationBadge, {
        props: { classification: 'safe' }
      });

      expect(wrapper.text()).toContain('Safe');
    });

    it('should display "Contact" for contact', () => {
      const wrapper = mountComponent(CallClassificationBadge, {
        props: { classification: 'contact' }
      });

      expect(wrapper.text()).toContain('Contact');
    });

    it('should display "Suspected Spam" for low_spam', () => {
      const wrapper = mountComponent(CallClassificationBadge, {
        props: { classification: 'low_spam' }
      });

      expect(wrapper.text()).toContain('Suspected Spam');
    });

    it('should display "Spam" for high_spam', () => {
      const wrapper = mountComponent(CallClassificationBadge, {
        props: { classification: 'high_spam' }
      });

      expect(wrapper.text()).toContain('Spam');
    });

    it('should display "Unknown" for unknown', () => {
      const wrapper = mountComponent(CallClassificationBadge, {
        props: { classification: 'unknown' }
      });

      expect(wrapper.text()).toContain('Unknown');
    });

    it('should display "Blocked" for blocked', () => {
      const wrapper = mountComponent(CallClassificationBadge, {
        props: { classification: 'blocked' }
      });

      expect(wrapper.text()).toContain('Blocked');
    });
  });

  describe('size variants', () => {
    it('should use default md size', () => {
      const wrapper = mountComponent(CallClassificationBadge, {
        props: { classification: 'verified' }
      });

      expect(wrapper.find('.px-4').exists()).toBe(true);
      expect(wrapper.find('.py-2').exists()).toBe(true);
      expect(wrapper.find('.text-sm').exists()).toBe(true);
    });

    it('should use sm size when specified', () => {
      const wrapper = mountComponent(CallClassificationBadge, {
        props: { classification: 'verified', size: 'sm' }
      });

      expect(wrapper.find('.px-2').exists()).toBe(true);
      expect(wrapper.find('.py-0\\.5').exists()).toBe(true);
      expect(wrapper.find('.text-xs').exists()).toBe(true);
    });

    it('should use md size when explicitly specified', () => {
      const wrapper = mountComponent(CallClassificationBadge, {
        props: { classification: 'verified', size: 'md' }
      });

      expect(wrapper.find('.px-4').exists()).toBe(true);
      expect(wrapper.find('.py-2').exists()).toBe(true);
    });
  });

  describe('layout', () => {
    it('should be rounded pill shape', () => {
      const wrapper = mountComponent(CallClassificationBadge, {
        props: { classification: 'verified' }
      });

      expect(wrapper.find('.rounded-full').exists()).toBe(true);
    });

    it('should be flex container with gap', () => {
      const wrapper = mountComponent(CallClassificationBadge, {
        props: { classification: 'verified' }
      });

      expect(wrapper.find('.flex').exists()).toBe(true);
      expect(wrapper.find('.items-center').exists()).toBe(true);
      expect(wrapper.find('.gap-1').exists()).toBe(true);
    });

    it('should have font-medium', () => {
      const wrapper = mountComponent(CallClassificationBadge, {
        props: { classification: 'verified' }
      });

      expect(wrapper.find('.font-medium').exists()).toBe(true);
    });
  });

  describe('icon', () => {
    it('should render an icon', () => {
      const wrapper = mountComponent(CallClassificationBadge, {
        props: { classification: 'verified' }
      });

      expect(wrapper.find('.ion-icon-stub').exists()).toBe(true);
    });
  });
});
