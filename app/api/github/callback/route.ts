import { NextRequest, NextResponse } from "next/server";

/**
 * GitHub OAuth callback handler.
 *
 * Full web application flow (with state + PKCE):
 *
 *  1. GitHub redirects here with ?code=xxx&state=yyy after the user authorises.
 *  2. We read the `gh_oauth_state` cookie set by /api/github/initiate and
 *     compare it to the `state` query param — reject if they don't match (CSRF).
 *  3. We read the `gh_pkce_verifier` cookie and include it as `code_verifier`
 *     in the token-exchange POST so GitHub can verify the PKCE challenge.
 *  4. We store the resulting access token in a short-lived, JS-readable cookie
 *     so the client page can pick it up exactly once, then clear it.
 *
 * Security notes:
 *  - The client secret NEVER leaves the server.
 *  - The code verifier NEVER reaches the browser (HttpOnly cookie).
 *  - State validation prevents CSRF attacks.
 *  - PKCE prevents authorization-code interception attacks.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const returnedState = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const dashboardUrl = new URL("/dashboard/github", origin);

  // ── 1. Handle GitHub-returned errors ──────────────────────────────────────
  if (error) {
    dashboardUrl.searchParams.set(
      "gh_error",
      errorDescription || error
    );
    return NextResponse.redirect(dashboardUrl.toString());
  }

  if (!code) {
    dashboardUrl.searchParams.set(
      "gh_error",
      "No authorization code received from GitHub."
    );
    return NextResponse.redirect(dashboardUrl.toString());
  }

  // ── 2. CSRF — validate state ───────────────────────────────────────────────
  const storedState = request.cookies.get("gh_oauth_state")?.value;

  if (!storedState || !returnedState || storedState !== returnedState) {
    console.error("[GitHub OAuth] State mismatch — possible CSRF attack.");
    dashboardUrl.searchParams.set(
      "gh_error",
      "Security validation failed (state mismatch). Please try again."
    );

    const response = NextResponse.redirect(dashboardUrl.toString());
    response.cookies.delete("gh_oauth_state");
    response.cookies.delete("gh_pkce_verifier");
    return response;
  }

  // ── 3. Read PKCE verifier ──────────────────────────────────────────────────
  const codeVerifier = request.cookies.get("gh_pkce_verifier")?.value;

  if (!codeVerifier) {
    console.error("[GitHub OAuth] Missing PKCE code verifier cookie.");
    dashboardUrl.searchParams.set(
      "gh_error",
      "Security validation failed (missing PKCE verifier). Please try again."
    );

    const response = NextResponse.redirect(dashboardUrl.toString());
    response.cookies.delete("gh_oauth_state");
    response.cookies.delete("gh_pkce_verifier");
    return response;
  }

  // ── 4. Read credentials ────────────────────────────────────────────────────
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error(
      "[GitHub OAuth] Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET env vars."
    );
    dashboardUrl.searchParams.set(
      "gh_error",
      "Server configuration error. Please contact support."
    );
    return NextResponse.redirect(dashboardUrl.toString());
  }

  // ── 5. Exchange the code for an access token ───────────────────────────────
  try {
    const callbackUrl = `${origin}/api/github/callback`;

    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: callbackUrl,
          code_verifier: codeVerifier,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error || !tokenData.access_token) {
      throw new Error(
        tokenData.error_description || "Failed to obtain access token from GitHub."
      );
    }

    const accessToken: string = tokenData.access_token;

    // ── 6. Set handoff cookie and redirect ──────────────────────────────────
    dashboardUrl.searchParams.set("gh_connected", "1");

    const response = NextResponse.redirect(dashboardUrl.toString());

    // Clear the PKCE + state cookies — they are single-use
    const clearOpts = { path: "/", maxAge: 0 };
    response.cookies.set("gh_oauth_state", "", clearOpts);
    response.cookies.set("gh_pkce_verifier", "", clearOpts);

    // Pass the access token to the client in a short-lived JS-readable cookie.
    // 60-second TTL — only needed for the one-time handoff to the Zustand store.
    response.cookies.set("gh_access_token", accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60,
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("[GitHub OAuth] Token exchange failed:", err.message);

    const response = NextResponse.redirect(dashboardUrl.toString());
    dashboardUrl.searchParams.set(
      "gh_error",
      err.message || "Authentication failed."
    );

    // Clean up security cookies even on failure
    response.cookies.set("gh_oauth_state", "", { path: "/", maxAge: 0 });
    response.cookies.set("gh_pkce_verifier", "", { path: "/", maxAge: 0 });

    return NextResponse.redirect(dashboardUrl.toString());
  }
}
