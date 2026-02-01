/**
 * Tests for SplashScreen component
 */
import { describe, it, expect } from 'vitest';
import { mountComponent } from '../helpers';
import SplashScreen from '~/components/SplashScreen.vue';

describe('SplashScreen', () => {
  describe('rendering', () => {
    it('should render the splash screen', () => {
      const wrapper = mountComponent(SplashScreen, {
        props: { loading: true }
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should display app name', () => {
      const wrapper = mountComponent(SplashScreen, {
        props: { loading: true }
      });

      expect(wrapper.text()).toContain('CallShield');
    });

    it('should display tagline', () => {
      const wrapper = mountComponent(SplashScreen, {
        props: { loading: true }
      });

      expect(wrapper.text()).toContain('Protecting South Africa');
      expect(wrapper.text()).toContain('from spam calls');
    });

    it('should show loading indicator when loading is true', () => {
      const wrapper = mountComponent(SplashScreen, {
        props: { loading: true }
      });

      // Loading dots
      expect(wrapper.findAll('.w-2.h-2').length).toBe(3);
    });

    it('should hide loading indicator when loading is false', () => {
      const wrapper = mountComponent(SplashScreen, {
        props: { loading: false }
      });

      // No loading dots
      expect(wrapper.findAll('.w-2.h-2').length).toBe(0);
    });

    it('should default to not loading', () => {
      const wrapper = mountComponent(SplashScreen, {
        props: {}
      });

      // No loading dots by default
      expect(wrapper.findAll('.w-2.h-2').length).toBe(0);
    });
  });

  describe('styling', () => {
    it('should be fixed full screen', () => {
      const wrapper = mountComponent(SplashScreen, {
        props: { loading: true }
      });

      expect(wrapper.find('.fixed.inset-0').exists()).toBe(true);
    });

    it('should have gradient background', () => {
      const wrapper = mountComponent(SplashScreen, {
        props: { loading: true }
      });

      expect(wrapper.find('.bg-gradient-to-b').exists()).toBe(true);
    });

    it('should have high z-index', () => {
      const wrapper = mountComponent(SplashScreen, {
        props: { loading: true }
      });

      expect(wrapper.find('.z-50').exists()).toBe(true);
    });

    it('should have logo container', () => {
      const wrapper = mountComponent(SplashScreen, {
        props: { loading: true }
      });

      expect(wrapper.find('.w-24.h-24').exists()).toBe(true);
    });
  });
});
