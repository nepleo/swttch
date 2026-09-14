import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getPluginUpdatesHandler } from '../getPluginUpdates';
import type { ConnectionManager } from '../../../ws/connection-manager';
import type { Bridge } from '../../../bridge/bridge-interface';
import type { IPCMessage } from '../../types';
import { MessageType } from '../../../shared';

describe('getPluginUpdatesHandler', () => {
  const fetchSpy = vi.spyOn(globalThis, 'fetch');

  beforeEach(() => {
    fetchSpy.mockReset();
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('ACKs an empty updates list without fetching Marketplace', async () => {
    const connections = { sendTo: vi.fn() } as unknown as ConnectionManager;
    const message = { requestId: 'req-1', payload: {} } as IPCMessage;
    await getPluginUpdatesHandler('c1', message, connections, {} as Bridge);
    expect(connections.sendTo).toHaveBeenCalledWith('c1', MessageType.ACK, {
      requestId: 'req-1',
      status: 'ok',
      updates: [],
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
