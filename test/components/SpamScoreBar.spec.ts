/**
 * Tests for SpamScoreBar component
 */
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SpamScoreBar from '~/components/SpamScoreBar.vue';

describe('SpamScoreBar', () => {
  describe('rendering', () => {
    it('should render with required props', () => {
      const wrapper = mount(SpamScoreBar, {
        props: { score: 50 }
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should display score percentage', () => {
      const wrapper = mount(SpamScoreBar, {
        props: { score: 75 }
      });

      expect(wrapper.text()).toContain('75%');
    });

    it('should display default label', () => {
      const wrapper = mount(SpamScoreBar, {
        props: { score: 50 }
      });

      expect(wrapper.text()).toContain('Spam Score');
    });

    it('should display custom label', () => {
      const wrapper = mount(SpamScoreBar, {
        props: { score: 50, label: 'Risk Level' }
      });

      expect(wrapper.text()).toContain('Risk Level');
    });
  });

  describe('bar width', () => {
    it('should set bar width based on score', () => {
      const wrapper = mount(SpamScoreBar, {
        props: { score: 45 }
      });

      const bar = wrapper.find('[style*="width"]');
      expect(bar.attributes('style')).toContain('width: 45%');
    });

    it('should handle 0% score', () => {
      const wrapper = mount(SpamScoreBar, {
        props: { score: 0 }
      });

      const bar = wrapper.find('[style*="width"]');
      expect(bar.attributes('style')).toContain('width: 0%');
    });

    it('should handle 100% score', () => {
      const wrapper = mount(SpamScoreBar, {
        props: { score: 100 }
      });

      const bar = wrapper.find('[style*="width"]');
      expect(bar.attributes('style')).toContain('width: 100%');
    });
  });

  describe('color thresholds', () => {
    it('should be green for score < 30', () => {
      const wrapper = mount(SpamScoreBar, {
        props: { score: 29 }
      });

      const bar = wrapper.find('.bg-green-500');
      expect(bar.exists()).toBe(true);
    });

    it('should be green for score = 0', () => {
      const wrapper = mount(SpamScoreBar, {
        props: { score: 0 }
      });

      const bar = wrapper.find('.bg-green-500');
      expect(bar.exists()).toBe(true);
    });

    it('should be amber for score >= 30 and < 70', () => {
      const wrapper = mount(SpamScoreBar, {
        props: { score: 30 }
      });

      const bar = wrapper.find('.bg-amber-500');
      expect(bar.exists()).toBe(true);
    });

    it('should be amber for score = 69', () => {
      const wrapper = mount(SpamScoreBar, {
        props: { score: 69 }
      });

      const bar = wrapper.find('.bg-amber-500');
      expect(bar.exists()).toBe(true);
    });

    it('should be red for score >= 70', () => {
      const wrapper = mount(SpamScoreBar, {
        props: { score: 70 }
      });

      const bar = wrapper.find('.bg-red-500');
      expect(bar.exists()).toBe(true);
    });

    it('should be red for score = 100', () => {
      const wrapper = mount(SpamScoreBar, {
        props: { score: 100 }
      });

      const bar = wrapper.find('.bg-red-500');
      expect(bar.exists()).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle boundary at 30', () => {
      const wrapper29 = mount(SpamScoreBar, { props: { score: 29 } });
      const wrapper30 = mount(SpamScoreBar, { props: { score: 30 } });

      expect(wrapper29.find('.bg-green-500').exists()).toBe(true);
      expect(wrapper30.find('.bg-amber-500').exists()).toBe(true);
    });

    it('should handle boundary at 70', () => {
      const wrapper69 = mount(SpamScoreBar, { props: { score: 69 } });
      const wrapper70 = mount(SpamScoreBar, { props: { score: 70 } });

      expect(wrapper69.find('.bg-amber-500').exists()).toBe(true);
      expect(wrapper70.find('.bg-red-500').exists()).toBe(true);
    });
  });
});
