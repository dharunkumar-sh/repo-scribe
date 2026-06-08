const PROHIBITED_KEYWORDS = [
  "hack", "exploit", "malware", "phishing", "bypass", "jailbreak",
  "dox", "credential", "password", "token", "api_key", "secret_key",
  "private_key", "leak", "spyware", "ransomware", "ddos", "vuln",
  "vulnerability", "backdoor", "trojan", "virus", "worm", "botnet"
];

const PROFANITIES = [
  "fuck", "shit", "asshole", "bitch", "bastard", "cunt", "dick", "pussy",
  "crap", "damn", "nigger", "faggot", "retard", "slut", "whore"
];

/**
 * Checks if a prompt contains words that violate the terms of service.
 * Returns true if a violation is detected.
 */
export function hasToSViolation(text: string): { violated: boolean; word?: string } {
  const normalized = text.toLowerCase();
  for (const keyword of PROHIBITED_KEYWORDS) {
    const regex = new RegExp(`\\b${keyword}\\b`, "i");
    if (regex.test(normalized)) {
      return { violated: true, word: keyword };
    }
  }
  return { violated: false };
}

/**
 * Censers profanity and sensitive keywords in a text by replacing them with asterisks.
 */
export function censorText(text: string): string {
  let censored = text;
  
  // Censor profanities
  for (const word of PROFANITIES) {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    censored = censored.replace(regex, (match) => "*".repeat(match.length));
  }

  // Censor prohibited keywords just in case
  for (const word of PROHIBITED_KEYWORDS) {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    censored = censored.replace(regex, (match) => "*".repeat(match.length));
  }

  return censored;
}
