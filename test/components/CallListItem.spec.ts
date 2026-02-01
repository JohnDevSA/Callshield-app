/**
 * Tests for CallListItem component
 */
import { describe, it, expect } from 'vitest';
import { mountComponent } from '../helpers';
import CallListItem from '~/components/CallListItem.vue';
import type { CallRecord } from '~/types';

function createMockRecord(overrides: Partial<CallRecord> = {}): CallRecord {
  return {
    id: 1,
    phoneNumber: '+27 82 123 4567',
    normalizedNumber: '0821234567',
    direction: 'incoming',
    timestamp: new Date(),
    classification: 'unknown',
    blocked: false,
    ...overrides
  };
}

describe('CallListItem', () => {
  describe('rendering', () => {
    it('should render with required props', () => {
      const wrapper = mountComponent(CallListItem, {
        props: { record: createMockRecord() }
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should display caller name when available', () => {
      const wrapper = mountComponent(CallListItem, {
        props: {
          record: createMockRecord({ callerName: 'Mom' })
        }
      });

      expect(wrapper.text()).toContain('Mom');
    });

    it('should display direction', () => {
      const wrapper = mountComponent(CallListItem, {
        props: {
          record: createMockRecord({ direction: 'incoming' })
        }
      });

      expect(wrapper.text()).toContain('incoming');
    });

    it('should display missed direction', () => {
      const wrapper = mountComponent(CallListItem, {
        props: {
          record: createMockRecord({ direction: 'missed' })
        }
      });

      expect(wrapper.text()).toContain('missed');
    });

    it('should display outgoing direction', () => {
      const wrapper = mountComponent(CallListItem, {
        props: {
          record: createMockRecord({ direction: 'outgoing' })
        }
      });

      expect(wrapper.text()).toContain('outgoing');
    });
  });

  describe('duration display', () => {
    it('should display duration in minutes and seconds', () => {
      const wrapper = mountComponent(CallListItem, {
        props: {
          record: createMockRecord({ duration: 125 }) // 2m 5s
        }
      });

      expect(wrapper.text()).toContain('2m');
      expect(wrapper.text()).toContain('5s');
    });

    it('should not display duration when undefined', () => {
      const wrapper = mountComponent(CallListItem, {
        props: {
          record: createMockRecord({ duration: undefined })
        }
      });

      // Duration shows as "Xm Ys" pattern, check it's not present
      expect(wrapper.text()).not.toMatch(/\d+m \d+s/);
    });

    it('should handle 0 duration', () => {
      const wrapper = mountComponent(CallListItem, {
        props: {
          record: createMockRecord({ duration: 0 })
        }
      });

      // Duration 0 is falsy, so it won't show
      expect(wrapper.text()).not.toContain('0m 0s');
    });

    it('should handle exact minutes', () => {
      const wrapper = mountComponent(CallListItem, {
        props: {
          record: createMockRecord({ duration: 120 }) // 2m 0s
        }
      });

      expect(wrapper.text()).toContain('2m');
      expect(wrapper.text()).toContain('0s');
    });
  });

  describe('classification colors', () => {
    it('should have green icon for verified', () => {
      const wrapper = mountComponent(CallListItem, {
        props: {
          record: createMockRecord({ classification: 'verified' })
        }
      });

      expect(wrapper.find('.bg-green-100').exists()).toBe(true);
      expect(wrapper.find('.text-green-600').exists()).toBe(true);
    });

    it('should have green icon for safe', () => {
      const wrapper = mountComponent(CallListItem, {
        props: {
          record: createMockRecord({ classification: 'safe' })
        }
      });

      expect(wrapper.find('.bg-green-100').exists()).toBe(true);
      expect(wrapper.find('.text-green-600').exists()).toBe(true);
    });

    it('should have red icon for high_spam', () => {
      const wrapper = mountComponent(CallListItem, {
        props: {
          record: createMockRecord({ classification: 'high_spam' })
        }
      });

      expect(wrapper.find('.bg-red-100').exists()).toBe(true);
      expect(wrapper.find('.text-red-600').exists()).toBe(true);
    });

    it('should have amber icon for low_spam', () => {
      const wrapper = mountComponent(CallListItem, {
        props: {
          record: createMockRecord({ classification: 'low_spam' })
        }
      });

      expect(wrapper.find('.bg-amber-100').exists()).toBe(true);
      expect(wrapper.find('.text-amber-600').exists()).toBe(true);
    });

    it('should have blue icon for contact', () => {
      const wrapper = mountComponent(CallListItem, {
        props: {
          record: createMockRecord({ classification: 'contact' })
        }
      });

      expect(wrapper.find('.bg-blue-100').exists()).toBe(true);
      expect(wrapper.find('.text-blue-600').exists()).toBe(true);
    });

    it('should have gray icon for unknown', () => {
      const wrapper = mountComponent(CallListItem, {
        props: {
          record: createMockRecord({ classification: 'unknown' })
        }
      });

      expect(wrapper.find('.bg-gray-100').exists()).toBe(true);
      expect(wrapper.find('.text-gray-500').exists()).toBe(true);
    });
  });

  describe('high spam styling', () => {
    it('should have red text for high spam caller name', () => {
      const wrapper = mountComponent(CallListItem, {
        props: {
          record: createMockRecord({
            classification: 'high_spam',
            callerName: 'Spammer'
          })
        }
      });

      expect(wrapper.find('.text-red-600').exists()).toBe(true);
    });
  });

  describe('time display', () => {
    it('should display time', () => {
      const timestamp = new Date('2024-01-15T14:30:00');
      const wrapper = mountComponent(CallListItem, {
        props: {
          record: createMockRecord({ timestamp })
        }
      });

      // Time format depends on locale, just check it renders
      expect(wrapper.find('.text-right').exists()).toBe(true);
    });

    it('should display "Today" for today\'s calls', () => {
      const wrapper = mountComponent(CallListItem, {
        props: {
          record: createMockRecord({ timestamp: new Date() })
        }
      });

      expect(wrapper.text()).toContain('Today');
    });

    it('should display "Yesterday" for yesterday\'s calls', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(12, 0, 0, 0); // Set to noon to avoid edge cases

      const wrapper = mountComponent(CallListItem, {
        props: {
          record: createMockRecord({ timestamp: yesterday })
        }
      });

      expect(wrapper.text()).toContain('Yesterday');
    });
  });

  describe('layout', () => {
    it('should have card class', () => {
      const wrapper = mountComponent(CallListItem, {
        props: { record: createMockRecord() }
      });

      expect(wrapper.find('.card').exists()).toBe(true);
    });

    it('should be flex container', () => {
      const wrapper = mountComponent(CallListItem, {
        props: { record: createMockRecord() }
      });

      expect(wrapper.find('.flex').exists()).toBe(true);
      expect(wrapper.find('.items-center').exists()).toBe(true);
    });

    it('should have circular icon container', () => {
      const wrapper = mountComponent(CallListItem, {
        props: { record: createMockRecord() }
      });

      expect(wrapper.find('.rounded-full.w-10.h-10').exists()).toBe(true);
    });
  });
});
