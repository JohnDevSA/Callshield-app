/**
 * Tests for useToast composable
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useToast } from '~/composables/useToast';

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    const { clear } = useToast();
    clear();
  });

  describe('show', () => {
    it('should add a toast to the list', () => {
      const { show, toasts } = useToast();

      show('Test message');

      expect(toasts.value.length).toBe(1);
      expect(toasts.value[0].message).toBe('Test message');
    });

    it('should return toast id', () => {
      const { show } = useToast();

      const id = show('Test message');

      expect(typeof id).toBe('number');
    });

    it('should default to info type', () => {
      const { show, toasts } = useToast();

      show('Test message');

      expect(toasts.value[0].type).toBe('info');
    });

    it('should accept custom type', () => {
      const { show, toasts } = useToast();

      show('Error message', 'error');

      expect(toasts.value[0].type).toBe('error');
    });

    it('should auto-remove toast after duration', () => {
      const { show, toasts } = useToast();

      show('Test message', 'info', 1000);

      expect(toasts.value.length).toBe(1);

      vi.advanceTimersByTime(1000);

      expect(toasts.value.length).toBe(0);
    });

    it('should not auto-remove when duration is 0', () => {
      const { show, toasts } = useToast();

      show('Test message', 'info', 0);

      vi.advanceTimersByTime(10000);

      expect(toasts.value.length).toBe(1);
    });
  });

  describe('remove', () => {
    it('should remove toast by id', () => {
      const { show, remove, toasts } = useToast();

      const id = show('Test message', 'info', 0);
      expect(toasts.value.length).toBe(1);

      remove(id);

      expect(toasts.value.length).toBe(0);
    });

    it('should handle removing non-existent id', () => {
      const { show, remove, toasts } = useToast();

      show('Test message', 'info', 0);

      remove(9999);

      expect(toasts.value.length).toBe(1);
    });
  });

  describe('success', () => {
    it('should create success toast', () => {
      const { success, toasts } = useToast();

      success('Success message');

      expect(toasts.value[0].type).toBe('success');
      expect(toasts.value[0].message).toBe('Success message');
    });

    it('should default to 3000ms duration', () => {
      const { success, toasts } = useToast();

      success('Success message');

      expect(toasts.value[0].duration).toBe(3000);

      vi.advanceTimersByTime(3000);

      expect(toasts.value.length).toBe(0);
    });
  });

  describe('error', () => {
    it('should create error toast', () => {
      const { error, toasts } = useToast();

      error('Error message');

      expect(toasts.value[0].type).toBe('error');
      expect(toasts.value[0].message).toBe('Error message');
    });

    it('should default to 4000ms duration', () => {
      const { error, toasts } = useToast();

      error('Error message');

      expect(toasts.value[0].duration).toBe(4000);
    });
  });

  describe('warning', () => {
    it('should create warning toast', () => {
      const { warning, toasts } = useToast();

      warning('Warning message');

      expect(toasts.value[0].type).toBe('warning');
      expect(toasts.value[0].message).toBe('Warning message');
    });

    it('should default to 3500ms duration', () => {
      const { warning, toasts } = useToast();

      warning('Warning message');

      expect(toasts.value[0].duration).toBe(3500);
    });
  });

  describe('info', () => {
    it('should create info toast', () => {
      const { info, toasts } = useToast();

      info('Info message');

      expect(toasts.value[0].type).toBe('info');
      expect(toasts.value[0].message).toBe('Info message');
    });
  });

  describe('clear', () => {
    it('should remove all toasts', () => {
      const { show, clear, toasts } = useToast();

      show('Message 1', 'info', 0);
      show('Message 2', 'info', 0);
      show('Message 3', 'info', 0);

      expect(toasts.value.length).toBe(3);

      clear();

      expect(toasts.value.length).toBe(0);
    });
  });

  describe('multiple toasts', () => {
    it('should handle multiple toasts', () => {
      const { success, error, warning, toasts } = useToast();

      success('Success', 0);
      error('Error', 0);
      warning('Warning', 0);

      expect(toasts.value.length).toBe(3);
      expect(toasts.value[0].type).toBe('success');
      expect(toasts.value[1].type).toBe('error');
      expect(toasts.value[2].type).toBe('warning');
    });

    it('should assign unique ids', () => {
      const { show, toasts } = useToast();

      show('Message 1', 'info', 0);
      show('Message 2', 'info', 0);
      show('Message 3', 'info', 0);

      const ids = toasts.value.map(t => t.id);
      const uniqueIds = [...new Set(ids)];

      expect(uniqueIds.length).toBe(3);
    });
  });
});
