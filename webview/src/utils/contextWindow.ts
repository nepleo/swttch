const SYSTEM_OVERHEAD = 13_000;

/** Default Claude context window when the model id has no `[1m]` marker. */
export const DEFAULT_CONTEXT_WINDOW = 200_000;
/** Extended context window for models advertised with a `[1m]` suffix. */
export const EXTENDED_CONTEXT_WINDOW = 1_000_000;

export function calculateContextWindowPercent(
  totalTokens: number,
  contextWindow: number,
  maxOutputTokens: number,
): number {
  const availableTokens = Math.max(contextWindow - maxOutputTokens - SYSTEM_OVERHEAD, 1);
  const percent = Math.round((totalTokens / availableTokens) * 100);
  return Math.min(percent, 100);
}

/**
 * Estimate a model's context window from its id before `result.modelUsage`
 * arrives. Claude Code's TUI does the same from its catalog at startup; the
 * CLI only reports the authoritative `contextWindow` on the turn `result`.
 *
 *   claude-opus-4-8[1m] → 1_000_000
 *   claude-sonnet-4-5   → 200_000
 */
export function estimateContextWindowFromModel(model: string | null | undefined): number {
  if (!model) return DEFAULT_CONTEXT_WINDOW;
  // CLI ids use `[1m]`; some remapped catalogs use a bare `1m` suffix.
  if (/\[1m\]/i.test(model) || /(?:^|[^a-z0-9])1m$/i.test(model)) {
    return EXTENDED_CONTEXT_WINDOW;
  }
  return DEFAULT_CONTEXT_WINDOW;
}

/**
 * Compact label for a model's max context window, matching CLI/TUI style:
 *   1_000_000 → "1M" · 200_000 → "200k" · 58_300 → "58.3k"
 */
export function formatContextCapacity(tokens: number): string {
  if (tokens <= 0) return '—';
  if (tokens >= 1_000_000) {
    const m = tokens / 1_000_000;
    return Number.isInteger(m) ? `${m}M` : `${parseFloat(m.toFixed(1))}M`;
  }
  if (tokens >= 1_000) {
    const k = tokens / 1_000;
    return Number.isInteger(k) ? `${k}k` : `${parseFloat(k.toFixed(1))}k`;
  }
  return String(tokens);
}
