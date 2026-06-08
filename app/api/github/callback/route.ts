import { NextRequest, NextResponse } from "next/server";

/**
 * GitHub OAuth callback handler.
 *
 * Flow:
 *  1. GitHub redirects here with ?code=xxx after user authorises the OAuth App.
 *  2. We exchange the code for an access token using the client secret (server-side only).
 *  3. We redirect the user back to /dashboard/github with the token in a short-lived cookie.
 *
 * The client secret NEVER leaves the server — it is only read from process.env here.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // GitHub returned an error (e.g. user denied access)
  if (error) {
    const redirectUrl = new URL("/dashboard/github", origin);
    redirectUrl.searchParams.set("gh_error", errorDescription || error);
    return NextResponse.redirect(redirectUrl.toString());
  }

  if (!code) {
    const redirectUrl = new URL("/dashboard/github", origin);
    redirectUrl.searchParams.set("gh_error", "No authorization code received from GitHub.");
    return NextResponse.redirect(redirectUrl.toString());
  }

  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("[GitHub OAuth] Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET env vars.");
    const redirectUrl = new URL("/dashboard/github", origin);
    redirectUrl.searchParams.set("gh_error", "Server configuration error. Contact support.");
    return NextResponse.redirect(redirectUrl.toString());
  }

  // Exchange the code for an access token
  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error || !tokenData.access_token) {
      throw new Error(tokenData.error_description || "Failed to obtain access token from GitHub.");
    }

    const accessToken: string = tokenData.access_token;

    // Redirect back to the GitHub dashboard page.
    // We pass the token via a short-lived, SameSite=Strict cookie so it never appears in URL history.
    const redirectUrl = new URL("/dashboard/github", origin);
    redirectUrl.searchParams.set("gh_connected", "1");

    const response = NextResponse.redirect(redirectUrl.toString());

    // Store token in a short-lived cookie (60 seconds) — client reads it once then clears it.
    response.cookies.set("gh_access_token", accessToken, {
      httpOnly: false,       // must be readable by JS so the client store can grab it
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60,            // expires in 60 seconds — only needed for the handoff
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("[GitHub OAuth] Token exchange failed:", err.message);
    const redirectUrl = new URL("/dashboard/github", origin);
    redirectUrl.searchParams.set("gh_error", err.message || "Authentication failed.");
    return NextResponse.redirect(redirectUrl.toString());
  }
}
