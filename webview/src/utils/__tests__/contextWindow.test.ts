import { describe, expect, it } from 'vitest';
import { formatContextCapacity } from '../contextWindow';

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
