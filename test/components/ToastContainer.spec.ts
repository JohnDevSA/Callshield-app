/**
 * Tests for ToastContainer component
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { mountComponent } from '../helpers';
import ToastContainer from '~/components/ToastContainer.vue';
import { useToast } from '~/composables/useToast';

describe('ToastContainer', () => {
  beforeEach(() => {
    const { clear } = useToast();
    clear();
  });

  describe('rendering', () => {
    it('should render empty when no toasts', () => {
      const wrapper = mountComponent(ToastContainer, {});

      expect(wrapper.exists()).toBe(true);
      // No toast items
      expect(wrapper.findAll('.px-4.py-3').length).toBe(0);
    });

    it('should render toasts', async () => {
      const { success } = useToast();
      success('Test message', 0);

      const wrapper = mountComponent(ToastContainer, {});

      expect(wrapper.text()).toContain('Test message');
    });

    it('should render multiple toasts', () => {
      const { success, error, warning } = useToast();
      success('Success', 0);
      error('Error', 0);
      warning('Warning', 0);

      const wrapper = mountComponent(ToastContainer, {});

      expect(wrapper.text()).toContain('Success');
      expect(wrapper.text()).toContain('Error');
      expect(wrapper.text()).toContain('Warning');
    });
  });

  describe('styling', () => {
    it('should have fixed positioning at top', () => {
      const wrapper = mountComponent(ToastContainer, {});

      expect(wrapper.find('.fixed.top-0').exists()).toBe(true);
    });

    it('should have high z-index', () => {
      const wrapper = mountComponent(ToastContainer, {});

      expect(wrapper.find('.z-50').exists()).toBe(true);
    });

    it('should have success styling for success toast', () => {
      const { success } = useToast();
      success('Success', 0);

      const wrapper = mountComponent(ToastContainer, {});

      expect(wrapper.find('.bg-emerald-500').exists()).toBe(true);
    });

    it('should have error styling for error toast', () => {
      const { error } = useToast();
      error('Error', 0);

      const wrapper = mountComponent(ToastContainer, {});

      expect(wrapper.find('.bg-red-500').exists()).toBe(true);
    });

    it('should have warning styling for warning toast', () => {
      const { warning } = useToast();
      warning('Warning', 0);

      const wrapper = mountComponent(ToastContainer, {});

      expect(wrapper.find('.bg-amber-500').exists()).toBe(true);
    });

    it('should have info styling for info toast', () => {
      const { info } = useToast();
      info('Info', 0);

      const wrapper = mountComponent(ToastContainer, {});

      expect(wrapper.find('.bg-gray-800').exists()).toBe(true);
    });
  });

  describe('dismiss button', () => {
    it('should have dismiss button on each toast', () => {
      const { success } = useToast();
      success('Test', 0);

      const wrapper = mountComponent(ToastContainer, {});

      // Find button inside toast
      const toast = wrapper.find('.px-4.py-3');
      expect(toast.find('button').exists()).toBe(true);
    });

    it('should remove toast when dismiss clicked', async () => {
      const { success, toasts } = useToast();
      success('Test', 0);

      expect(toasts.value.length).toBe(1);

      const wrapper = mountComponent(ToastContainer, {});
      const dismissButton = wrapper.find('.px-4.py-3 button');
      await dismissButton.trigger('click');

      expect(toasts.value.length).toBe(0);
    });
  });
});
