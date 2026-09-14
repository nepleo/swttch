/**
 * Fresh sponsor check for actions gated on the frontend.
 *
 * Bedrock custom build: sponsorship is not offered; formerly sponsor-only
 * features are always available, so this always returns true.
 */
export async function ensureSponsor(): Promise<boolean> {
  return true;
}
