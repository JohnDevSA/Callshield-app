/**
 * Tests for IncomingCallOverlay component
 */
import { describe, it, expect } from 'vitest';
import { mountComponent } from '../helpers';
import IncomingCallOverlay from '~/components/IncomingCallOverlay.vue';
import type { IncomingCallContext, LookupResult } from '~/types';

function createContext(overrides: Partial<IncomingCallContext> = {}): IncomingCallContext {
  return {
    phoneNumber: '+27 82 123 4567',
    isContact: false,
    isBlocked: false,
    ...overrides
  };
}

function createLookup(overrides: Partial<LookupResult> = {}): LookupResult {
  return {
    phoneNumber: '082 123 4567',
    found: true,
    category: 'unknown',
    classification: 'unknown',
    spamScore: 0,
    reportCount: 0,
    verifiedBusiness: false,
    source: 'offline',
    ...overrides
  };
}

describe('IncomingCallOverlay', () => {
  describe('call type detection', () => {
    it('should detect blocked number', () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext({ isBlocked: true })
        }
      });

      expect(wrapper.text()).toContain('Blocked Number');
    });

    it('should detect contact', () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext({
            isContact: true,
            lookup: createLookup({ name: 'John Doe', classification: 'contact' })
          })
        }
      });

      expect(wrapper.text()).toContain('John Doe');
    });

    it('should detect high spam', () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext({
            lookup: createLookup({
              classification: 'high_spam',
              spamScore: 85,
              reportCount: 150
            })
          })
        }
      });

      expect(wrapper.text()).toContain('Likely Spam');
      expect(wrapper.text()).toContain('150 people reported this number');
    });

    it('should detect low spam', () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext({
            lookup: createLookup({
              classification: 'low_spam',
              spamScore: 45,
              reportCount: 20
            })
          })
        }
      });

      expect(wrapper.text()).toContain('Possible Spam');
      expect(wrapper.text()).toContain('20 spam reports');
    });

    it('should detect verified business', () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext({
            lookup: createLookup({
              name: 'FNB Customer Service',
              classification: 'verified',
              verifiedBusiness: true,
              category: 'bank'
            })
          })
        }
      });

      expect(wrapper.text()).toContain('Verified Business');
      expect(wrapper.text()).toContain('FNB Customer Service');
    });

    it('should detect private number', () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext({ phoneNumber: 'Private' })
        }
      });

      expect(wrapper.text()).toContain('Private Number');
      expect(wrapper.text()).toContain('Caller ID withheld');
    });

    it('should show no data for unknown number', () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext()
        }
      });

      expect(wrapper.text()).toContain('No data available');
    });
  });

  describe('background colors', () => {
    it('should have red gradient for high spam', () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext({
            lookup: createLookup({ classification: 'high_spam' })
          })
        }
      });

      expect(wrapper.find('.from-red-600').exists()).toBe(true);
    });

    it('should have amber gradient for low spam', () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext({
            lookup: createLookup({ classification: 'low_spam' })
          })
        }
      });

      expect(wrapper.find('.from-amber-500').exists()).toBe(true);
    });

    it('should have emerald gradient for verified', () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext({
            lookup: createLookup({ classification: 'verified' })
          })
        }
      });

      expect(wrapper.find('.from-emerald-500').exists()).toBe(true);
    });

    it('should have blue gradient for contact', () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext({ isContact: true })
        }
      });

      expect(wrapper.find('.from-blue-500').exists()).toBe(true);
    });

    it('should have gray gradient for blocked', () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext({ isBlocked: true })
        }
      });

      expect(wrapper.find('.from-gray-600').exists()).toBe(true);
    });

    it('should have slate gradient for no data', () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext()
        }
      });

      expect(wrapper.find('.from-slate-700').exists()).toBe(true);
    });
  });

  describe('block button visibility', () => {
    it('should show block button for high spam', () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext({
            lookup: createLookup({ classification: 'high_spam' })
          })
        }
      });

      expect(wrapper.text()).toContain('Block & Report');
    });

    it('should show block button for low spam', () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext({
            lookup: createLookup({ classification: 'low_spam' })
          })
        }
      });

      expect(wrapper.text()).toContain('Block & Report');
    });

    it('should show block button for unknown number', () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext()
        }
      });

      expect(wrapper.text()).toContain('Block & Report');
    });

    it('should not show block button for contact', () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext({ isContact: true })
        }
      });

      expect(wrapper.text()).not.toContain('Block & Report');
    });

    it('should not show block button for verified', () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext({
            lookup: createLookup({ classification: 'verified' })
          })
        }
      });

      expect(wrapper.text()).not.toContain('Block & Report');
    });
  });

  describe('action buttons', () => {
    it('should always show decline button', () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext()
        }
      });

      expect(wrapper.text()).toContain('Decline');
    });

    it('should always show answer button', () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext()
        }
      });

      expect(wrapper.text()).toContain('Answer');
    });

    it('should emit answer event when answer clicked', async () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext()
        }
      });

      const buttons = wrapper.findAll('button');
      const answerButton = buttons.find(b => b.text().includes('Answer'));
      await answerButton?.trigger('click');

      expect(wrapper.emitted('answer')).toBeTruthy();
    });

    it('should emit decline event when decline clicked', async () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext()
        }
      });

      const buttons = wrapper.findAll('button');
      const declineButton = buttons.find(b => b.text().includes('Decline'));
      await declineButton?.trigger('click');

      expect(wrapper.emitted('decline')).toBeTruthy();
    });

    it('should emit block event when block clicked', async () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext({
            lookup: createLookup({ classification: 'high_spam' })
          })
        }
      });

      const buttons = wrapper.findAll('button');
      const blockButton = buttons.find(b => b.text().includes('Block'));
      await blockButton?.trigger('click');

      expect(wrapper.emitted('block')).toBeTruthy();
    });
  });

  describe('contact avatar', () => {
    it('should show first letter for contact', () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext({
            isContact: true,
            lookup: createLookup({ name: 'Alice Smith' })
          })
        }
      });

      expect(wrapper.text()).toContain('A');
    });

    it('should show icon for non-contact', () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext()
        }
      });

      // Should have the avatar container but not a letter (since it's not a contact)
      const avatar = wrapper.find('.w-28.h-28');
      expect(avatar.exists()).toBe(true);
      // Non-contact should not have a single letter displayed as text
      expect(avatar.text()).not.toMatch(/^[A-Z]$/);
    });
  });

  describe('category tag', () => {
    it('should show category for spam calls', () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext({
            lookup: createLookup({
              classification: 'high_spam',
              category: 'telemarketer'
            })
          })
        }
      });

      expect(wrapper.text()).toContain('Telemarketer');
    });

    it('should not show category for non-spam calls', () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext({
            lookup: createLookup({
              classification: 'verified',
              category: 'bank'
            })
          })
        }
      });

      // Category shows in banner for verified, but not as a tag
      const categoryTags = wrapper.findAll('.rounded-full');
      const hasStandaloneTag = categoryTags.some(
        el => el.classes().includes('mt-2') && el.text() === 'Bank'
      );
      expect(hasStandaloneTag).toBe(false);
    });
  });

  describe('phone number display', () => {
    it('should show formatted phone number when no name', () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext({ phoneNumber: '0821234567' })
        }
      });

      // formatPhoneNumber should format it
      expect(wrapper.text()).toMatch(/082/);
    });

    it('should show name and number when both available', () => {
      const wrapper = mountComponent(IncomingCallOverlay, {
        props: {
          context: createContext({
            phoneNumber: '0821234567',
            lookup: createLookup({
              name: 'Spammer Inc',
              classification: 'high_spam'
            })
          })
        }
      });

      expect(wrapper.text()).toContain('Spammer Inc');
      expect(wrapper.text()).toMatch(/082/);
    });
  });
});
