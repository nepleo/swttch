import { describe, expect, it, vi } from 'vitest';

vi.mock('@/config/environment', () => ({ isMac: () => false }));
vi.mock('@/utils/shortcut', () => ({
  displayShortcut: (s: string) => s.replace('Meta+', '⌘').replace('Ctrl+', 'Ctrl+'),
}));

import { sendKeyLabel } from '../sendKeyLabel';

describe('sendKeyLabel', () => {
  it('names plain Enter when ctrl-enter-to-send is off', () => {
    expect(sendKeyLabel(false)).toBe('Enter');
  });

  it('names the platform send chord when ctrl-enter-to-send is on', () => {
    expect(sendKeyLabel(true)).toBe('Ctrl+Enter');
  });
});
