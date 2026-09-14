import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

const mockSend = vi.fn();
vi.mock('@/contexts/BridgeContext', () => ({
  useBridgeContext: () => ({ isConnected: true, send: mockSend }),
}));

import { usePluginUpdates } from '../usePluginUpdates';

describe('usePluginUpdates', () => {
  it('returns an empty successful result without contacting the bridge', () => {
    const { result } = renderHook(() => usePluginUpdates());
    expect(result.current.updates).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockSend).not.toHaveBeenCalled();
  });
});
