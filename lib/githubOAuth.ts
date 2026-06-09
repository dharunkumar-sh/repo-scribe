/**
 * GitHub OAuth Web Application Flow — helpers
 *
 * Provides utilities for building the authorization URL and generating the
 * cryptographic material required by the GitHub web application flow:
 *   - `state`          : random token for CSRF protection
 *   - `code_challenge` : PKCE challenge (SHA-256 of the verifier, Base64url-encoded)
 *   - `code_verifier`  : the raw secret that the server sends when redeeming the code
 *
 * NOTE: These helpers run on the **server** (Node.js crypto module). The
 * initiate route uses them so the verifier never touches the browser.
 */

import crypto from "crypto";

// ─── PKCE ───────────────────────────────────────────────────────────────────

/**
 * Generates a PKCE code-verifier / code-challenge pair.
 *
 * Verifier : 32 cryptographically random bytes, Base64url-encoded (43 chars).
 * Challenge: SHA-256 hash of the verifier, Base64url-encoded.
 *
 * GitHub requires `code_challenge_method=S256`.
 */
export function generatePkce(): { codeVerifier: string; codeChallenge: string } {
  const codeVerifier = crypto.randomBytes(32).toString("base64url");

  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

  return { codeVerifier, codeChallenge };
}

// ─── State ──────────────────────────────────────────────────────────────────

/**
 * Generates a cryptographically random state token for CSRF protection.
 * Returned as a 32-character hex string.
 */
export function generateState(): string {
  return crypto.randomBytes(16).toString("hex");
}

// ─── Authorization URL ──────────────────────────────────────────────────────

/**
 * Builds the GitHub OAuth authorization URL.
 *
 * @param redirectUri      - Exact callback URL registered in the GitHub App settings.
 * @param state            - Random CSRF token (must match what's stored server-side).
 * @param codeChallenge    - PKCE SHA-256 challenge derived from the code verifier.
 * @param scopes           - GitHub permission scopes to request.
 */
export function buildGithubOAuthUrl(
  redirectUri: string,
  state: string,
  codeChallenge: string,
  scopes: string[] = ["repo", "read:user", "user:email"]
): string {
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

  if (!clientId) {
    throw new Error(
      "NEXT_PUBLIC_GITHUB_CLIENT_ID is not set in environment variables."
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes.join(" "),
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}
