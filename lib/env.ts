import "server-only";

function required(name: string): string {
  const v = process.env[name];
  if (!v || v.length === 0) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
}

function optional(name: string): string | undefined {
  const v = process.env[name];
  return v && v.length > 0 ? v : undefined;
}

export const env = {
  DATABASE_URL: required("DATABASE_URL"),
  EMAIL: required("EMAIL"),
  EMAIL_PASSWORD: required("EMAIL_PASSWORD"),
  UPLOADTHING_TOKEN: required("UPLOADTHING_TOKEN"),

  // 32+ char secret used for HMAC + cookie signing. Generate with `openssl rand -base64 48`.
  SESSION_SECRET:
    process.env.SESSION_SECRET ||
    "dev-only-session-secret-please-set-SESSION_SECRET-in-env-32chars-min",

  // 32-byte (base64) key used for AES-256-GCM encryption of contact info at rest.
  // Generate with `openssl rand -base64 32`.
  ENCRYPTION_KEY:
    process.env.ENCRYPTION_KEY ||
    "ZGV2LW9ubHktZW5jcnlwdGlvbi1rZXktcGxlYXNlLXNldC1FTkM=",

  // Meta WhatsApp Cloud API. If absent, the WhatsApp adapter logs to DB only.
  WHATSAPP_PHONE_NUMBER_ID: optional("WHATSAPP_PHONE_NUMBER_ID"),
  WHATSAPP_ACCESS_TOKEN: optional("WHATSAPP_ACCESS_TOKEN"),

  NODE_ENV: process.env.NODE_ENV ?? "development",
};

export const isProd = env.NODE_ENV === "production";
