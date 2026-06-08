/**
 * Builds the GitHub OAuth authorization URL that redirects the user to GitHub
 * to authorize the OAuth App.
 *
 * @param redirectUri - The full callback URL (e.g. http://localhost:3000/api/auth/github/callback)
 * @param scopes      - GitHub permission scopes (default: repo, read:user, user:email)
 */
export function buildGithubOAuthUrl(
  redirectUri: string,
  scopes: string[] = ["repo", "read:user", "user:email"]
): string {
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

  if (!clientId) {
    throw new Error("NEXT_PUBLIC_GITHUB_CLIENT_ID is not set in environment variables.");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes.join(" "),
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}
