const SYSTEM_OVERHEAD = 13_000;

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
