interface PluginUpdate {
  id: number;
  pluginId: number;
  version: string;
  notes: string;     // HTML changelog
  channel?: string;
  cdate: string | number; // timestamp (string from API)
  since?: string;
  until?: string;
}

interface UsePluginUpdatesReturn {
  updates: PluginUpdate[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/** Downstream Bedrock build: never query JetBrains Marketplace for Swttch updates. */
export function usePluginUpdates(): UsePluginUpdatesReturn {
  return { updates: [], isLoading: false, error: null, refresh: async () => {} };
}
