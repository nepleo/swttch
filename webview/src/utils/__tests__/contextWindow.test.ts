import { describe, expect, it } from 'vitest';
import {
  estimateContextWindowFromModel,
  formatContextCapacity,
  DEFAULT_CONTEXT_WINDOW,
  EXTENDED_CONTEXT_WINDOW,
} from '../contextWindow';

describe('estimateContextWindowFromModel', () => {
  it('reads the [1m] suffix as a 1M window', () => {
    expect(estimateContextWindowFromModel('claude-opus-4-8[1m]')).toBe(EXTENDED_CONTEXT_WINDOW);
    expect(estimateContextWindowFromModel('opus[1m]')).toBe(EXTENDED_CONTEXT_WINDOW);
  });

  it('falls back to 200k when the id has no 1m marker', () => {
    expect(estimateContextWindowFromModel('claude-sonnet-4-5')).toBe(DEFAULT_CONTEXT_WINDOW);
    expect(estimateContextWindowFromModel(null)).toBe(DEFAULT_CONTEXT_WINDOW);
  });
});

describe('formatContextCapacity', () => {
  it('formats million-token windows as M', () => {
    expect(formatContextCapacity(1_000_000)).toBe('1M');
    expect(formatContextCapacity(2_000_000)).toBe('2M');
  });

  it('formats thousand-token windows as k', () => {
    expect(formatContextCapacity(200_000)).toBe('200k');
    expect(formatContextCapacity(58_300)).toBe('58.3k');
  });

  it('keeps small counts as plain numbers', () => {
    expect(formatContextCapacity(800)).toBe('800');
  });

  it('returns an em dash for non-positive values', () => {
    expect(formatContextCapacity(0)).toBe('—');
    expect(formatContextCapacity(-1)).toBe('—');
  });
});
