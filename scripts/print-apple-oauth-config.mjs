import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return {};
  }

  const values = {};

  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[key] = value;
  }

  return values;
}

function getSupabaseAppleCallbackUrl(supabaseUrl) {
  try {
    const { hostname } = new URL(supabaseUrl);
    const projectRef = hostname.split(".")[0];
    if (!projectRef) {
      return null;
    }
    return `https://${projectRef}.supabase.co/auth/v1/callback`;
  } catch {
    return null;
  }
}

function getAppCallbackUrls(siteUrl) {
  const urls = ["http://localhost:3000/auth/callback"];

  if (siteUrl && !siteUrl.startsWith("http://localhost")) {
    urls.push(`${siteUrl.replace(/\/$/, "")}/auth/callback`);
  }

  return [...new Set(urls)];
}

function printSection(title) {
  process.stdout.write(`\n${title}\n${"-".repeat(title.length)}\n`);
}

function main() {
  const env = {
    ...loadEnvFile(path.join(rootDir, ".env.example")),
    ...loadEnvFile(path.join(rootDir, ".env.local")),
  };

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const appleEnabled = env.NEXT_PUBLIC_OAUTH_APPLE === "true";
  const appleReturnUrl = getSupabaseAppleCallbackUrl(supabaseUrl);
  const appCallbackUrls = getAppCallbackUrls(siteUrl);

  process.stdout.write("SteKir Cakes — Apple OAuth setup checklist\n");
  process.stdout.write("==========================================\n");

  printSection("1. Apple Developer Program");
  process.stdout.write(
    [
      "- Enroll at https://developer.apple.com/programs/ ($99/year)",
      "- Note your Team ID (Membership details in Apple Developer account)",
      "",
    ].join("\n"),
  );

  printSection("2. Apple Developer Portal");
  process.stdout.write(
    [
      "App ID:",
      "  Identifiers -> App IDs -> create App ID with Sign In with Apple enabled",
      "",
      "Services ID (this becomes Supabase Client ID):",
      "  Identifiers -> Services IDs -> create, e.g. com.stekircakes.web",
      "  Enable Sign In with Apple -> Configure:",
      "    Primary App ID: choose the App ID above",
      "    Domains: your production domain without https://",
      appleReturnUrl
        ? `    Return URL: ${appleReturnUrl}`
        : "    Return URL: https://<PROJECT_REF>.supabase.co/auth/v1/callback",
      "",
      "Private key:",
      "  Keys -> create key with Sign In with Apple",
      "  Download the .p8 file once and save Key ID + Team ID",
      "  Rotate the secret in Supabase every 6 months",
      "",
    ].join("\n"),
  );

  printSection("3. Supabase Dashboard");
  process.stdout.write(
    [
      "Authentication -> Providers -> Apple:",
      "  Enable Apple",
      "  Client ID: your Services ID (e.g. com.stekircakes.web)",
      "  Secret Key: contents of the .p8 file",
      "  Key ID + Team ID from Apple Developer",
      "",
      "Authentication -> URL Configuration:",
      `  Site URL: ${siteUrl}`,
      "  Redirect URLs:",
      ...appCallbackUrls.map((url) => `    - ${url}`),
      "",
    ].join("\n"),
  );

  printSection("4. Next.js environment");
  process.stdout.write(
    [
      `NEXT_PUBLIC_OAUTH_APPLE=${appleEnabled ? "true" : "false (set to true to show the button)"}`,
      `NEXT_PUBLIC_SITE_URL=${siteUrl}`,
      supabaseUrl
        ? `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}`
        : "NEXT_PUBLIC_SUPABASE_URL=<missing>",
      "",
      "Restart `npm run dev` after changing .env.local.",
      "",
    ].join("\n"),
  );

  printSection("5. Local verification");
  process.stdout.write(
    [
      "Run: npm test -- lib/account/oauth-providers.test.ts",
      "Open: http://localhost:3000/en/account/login",
      appleEnabled
        ? "Apple button should be visible when NEXT_PUBLIC_OAUTH_APPLE=true"
        : "Set NEXT_PUBLIC_OAUTH_APPLE=true to show the Apple button",
      "After Apple + Supabase are configured, complete a sign-in and check:",
      "  Supabase -> Authentication -> Users (provider: apple)",
      "  public.profiles row created for the new user",
      "",
    ].join("\n"),
  );

  if (!supabaseUrl) {
    process.stdout.write("Warning: NEXT_PUBLIC_SUPABASE_URL is missing.\n");
    process.exitCode = 1;
  }
}

main();
