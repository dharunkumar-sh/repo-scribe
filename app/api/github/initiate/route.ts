import { NextRequest, NextResponse } from "next/server";
import { generatePkce, generateState, buildGithubOAuthUrl } from "@/lib/githubOAuth";

/**
 * GitHub OAuth initiation endpoint.
 *
 * This server-side route is responsible for:
 *  1. Generating a cryptographically random `state` token (CSRF protection).
 *  2. Generating a PKCE `code_verifier` and deriving the `code_challenge`.
 *  3. Storing the verifier + state in short-lived HttpOnly cookies so the
 *     callback route can validate the state and send the verifier to GitHub.
 *  4. Returning the fully-formed GitHub authorization URL to the client.
 *
 * The `code_verifier` and `state` never touch the browser — they live only in
 * HttpOnly cookies that the browser forwards automatically.
 *
 * Cookie TTL: 5 minutes — long enough for the user to complete the GitHub
 * authorization flow but short enough to limit the CSRF/replay attack window.
 */
export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url);

  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "Server misconfiguration: GITHUB_CLIENT_ID not set." },
      { status: 500 }
    );
  }

  // Generate PKCE pair and state token
  const { codeVerifier, codeChallenge } = generatePkce();
  const state = generateState();

  const callbackUrl = `${origin}/api/github/callback`;
  const authUrl = buildGithubOAuthUrl(callbackUrl, state, codeChallenge);

  const response = NextResponse.json({ authUrl });

  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 300, // 5 minutes
    path: "/",
  };

  // Store verifier for the token-exchange step in the callback
  response.cookies.set("gh_pkce_verifier", codeVerifier, cookieOpts);

  // Store state for CSRF validation in the callback
  response.cookies.set("gh_oauth_state", state, cookieOpts);

  return response;
}
