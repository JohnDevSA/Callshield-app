/**
 * Tests for PostCallFeedback component
 */
import { describe, it, expect } from 'vitest';
import { mountComponent } from '../helpers';
import PostCallFeedback from '~/components/PostCallFeedback.vue';

describe('PostCallFeedback', () => {
  describe('rendering', () => {
    it('should render the modal', () => {
      const wrapper = mountComponent(PostCallFeedback, {
        props: { phoneNumber: '0821234567' }
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should display the question', () => {
      const wrapper = mountComponent(PostCallFeedback, {
        props: { phoneNumber: '0821234567' }
      });

      expect(wrapper.text()).toContain('How was that call?');
    });

    it('should display formatted phone number', () => {
      const wrapper = mountComponent(PostCallFeedback, {
        props: { phoneNumber: '0821234567' }
      });

      expect(wrapper.text()).toMatch(/082/);
    });

    it('should have Safe button', () => {
      const wrapper = mountComponent(PostCallFeedback, {
        props: { phoneNumber: '0821234567' }
      });

      expect(wrapper.text()).toContain('Safe');
    });

    it('should have Spam button', () => {
      const wrapper = mountComponent(PostCallFeedback, {
        props: { phoneNumber: '0821234567' }
      });

      expect(wrapper.text()).toContain('Spam');
    });

    it('should have Dismiss button', () => {
      const wrapper = mountComponent(PostCallFeedback, {
        props: { phoneNumber: '0821234567' }
      });

      expect(wrapper.text()).toContain('Dismiss');
    });
  });

  describe('events', () => {
    it('should emit safe event when Safe clicked', async () => {
      const wrapper = mountComponent(PostCallFeedback, {
        props: { phoneNumber: '0821234567' }
      });

      const buttons = wrapper.findAll('button');
      const safeButton = buttons.find(b => b.text().includes('Safe'));
      await safeButton?.trigger('click');

      expect(wrapper.emitted('safe')).toBeTruthy();
    });

    it('should emit spam event when Spam clicked', async () => {
      const wrapper = mountComponent(PostCallFeedback, {
        props: { phoneNumber: '0821234567' }
      });

      const buttons = wrapper.findAll('button');
      const spamButton = buttons.find(b => b.text().includes('Spam'));
      await spamButton?.trigger('click');

      expect(wrapper.emitted('spam')).toBeTruthy();
    });

    it('should emit dismiss event when Dismiss clicked', async () => {
      const wrapper = mountComponent(PostCallFeedback, {
        props: { phoneNumber: '0821234567' }
      });

      const buttons = wrapper.findAll('button');
      const dismissButton = buttons.find(b => b.text().includes('Dismiss'));
      await dismissButton?.trigger('click');

      expect(wrapper.emitted('dismiss')).toBeTruthy();
    });
  });

  describe('styling', () => {
    it('should have backdrop overlay', () => {
      const wrapper = mountComponent(PostCallFeedback, {
        props: { phoneNumber: '0821234567' }
      });

      expect(wrapper.find('.bg-black\\/50').exists()).toBe(true);
    });

    it('should have bottom sheet styling', () => {
      const wrapper = mountComponent(PostCallFeedback, {
        props: { phoneNumber: '0821234567' }
      });

      expect(wrapper.find('.rounded-t-3xl').exists()).toBe(true);
    });

    it('should have drag handle', () => {
      const wrapper = mountComponent(PostCallFeedback, {
        props: { phoneNumber: '0821234567' }
      });

      expect(wrapper.find('.w-12.h-1').exists()).toBe(true);
    });

    it('should have green styling for Safe button', () => {
      const wrapper = mountComponent(PostCallFeedback, {
        props: { phoneNumber: '0821234567' }
      });

      expect(wrapper.find('.bg-emerald-50').exists()).toBe(true);
    });

    it('should have red styling for Spam button', () => {
      const wrapper = mountComponent(PostCallFeedback, {
        props: { phoneNumber: '0821234567' }
      });

      expect(wrapper.find('.bg-red-50').exists()).toBe(true);
    });
  });
});
