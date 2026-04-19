import "server-only";
import nodemailer from "nodemailer";
import { env } from "./env";
import { db } from "./db";
import { messages } from "./db/schema";
import { encrypt } from "./crypto";

/**
 * Lazy-initialised Gmail SMTP transport (using EMAIL + EMAIL_PASSWORD app password).
 */
let _transport: ReturnType<typeof nodemailer.createTransport> | null = null;
function transport() {
  if (_transport) return _transport;
  _transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user: env.EMAIL, pass: env.EMAIL_PASSWORD },
  });
  return _transport;
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  bookingId?: string | null;
  toUserId?: string | null;
}): Promise<{ ok: boolean; error?: string }> {
  let messageId: string | null = null;
  try {
    const inserted = await db
      .insert(messages)
      .values({
        bookingId: opts.bookingId ?? null,
        toUserId: opts.toUserId ?? null,
        channel: "EMAIL",
        toAddressEnc: encrypt(opts.to),
        subject: opts.subject,
        body: opts.text,
        status: "QUEUED",
      })
      .returning({ id: messages.id });
    messageId = inserted[0].id;

    await transport().sendMail({
      from: `Nawi Experiences <${env.EMAIL}>`,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    });

    await db
      .update(messages)
      .set({ status: "SENT", sentAt: new Date() })
      .where(eqId(messageId));

    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (messageId) {
      await db
        .update(messages)
        .set({ status: "FAILED", error: msg })
        .where(eqId(messageId));
    }
    console.error("[email] send failed:", msg);
    return { ok: false, error: msg };
  }
}

import { eq } from "drizzle-orm";
function eqId(id: string) {
  return eq(messages.id, id);
}

/* ───────────────────────────── Templates ─────────────────────────── */

export function welcomeEmail(opts: {
  alias: string;
  password: string;
  agentPersona: string;
}): { subject: string; text: string; html: string } {
  const subject = "Your Nawi Experience — private credentials";
  const text = `Welcome to Nawi Experiences.

Your private alias and credentials have been created. Keep them safe — they
are the only way you'll be known to us.

  Username : ${opts.alias}
  Password : ${opts.password}

Your assigned concierge for this experience is "${opts.agentPersona}". You will
only ever know them by this name. They will reach out shortly to begin
designing your moment.

Sign in at: /login

— Nawi Experiences`;

  const html = `
<!doctype html><html><body style="font-family:Georgia,serif;background:#F5F3ED;padding:32px;color:#3A3A3A">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:24px;border:1px solid rgba(128,0,32,0.08);padding:48px">
    <p style="color:#800020;letter-spacing:0.4em;font-size:11px;font-weight:700;margin:0 0 8px">NAWI · EXPERIENCES</p>
    <h1 style="font-size:28px;color:#3A3A3A;margin:0 0 24px;font-weight:700">Welcome.</h1>
    <p style="line-height:1.6;color:#6B6B6B">Your private alias and credentials have been created. Keep them safe &mdash; they are the only way you'll be known to us.</p>

    <div style="margin:32px 0;padding:24px;background:#F5F3ED;border-radius:16px;border-left:3px solid #800020">
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.2em;color:#999;font-weight:700">USERNAME</p>
      <p style="margin:0 0 16px;font-size:22px;color:#800020;font-style:italic;font-family:Georgia,serif">${opts.alias}</p>
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.2em;color:#999;font-weight:700">PASSWORD</p>
      <p style="margin:0;font-size:18px;color:#3A3A3A;font-weight:700;font-family:monospace">${opts.password}</p>
    </div>

    <p style="line-height:1.6;color:#6B6B6B">Your assigned concierge is <strong style="color:#800020">${opts.agentPersona}</strong>. You will only ever know them by this name. They will reach out shortly to begin designing your moment.</p>
    <p style="margin-top:32px;font-size:12px;color:#999;font-style:italic">Discretion is our craft. — Nawi</p>
  </div>
</body></html>`;
  return { subject, text, html };
}

export function bookingUpdateEmail(opts: {
  alias: string;
  status: string;
  agentPersona: string;
  message?: string;
}): { subject: string; text: string; html: string } {
  const subject = `Nawi · Your booking is now ${opts.status}`;
  const text = `Hello ${opts.alias},

Your booking status has been updated to: ${opts.status}.

Your concierge ${opts.agentPersona} will be in touch.

${opts.message ?? ""}

— Nawi Experiences`;
  const html = `<div style="font-family:Georgia,serif;color:#3A3A3A">
    <p style="color:#800020;letter-spacing:0.3em;font-size:11px">NAWI</p>
    <h2>Booking ${opts.status}</h2>
    <p>Hello <strong>${opts.alias}</strong>, your concierge <em>${opts.agentPersona}</em> will be in touch.</p>
    ${opts.message ? `<p>${opts.message}</p>` : ""}
  </div>`;
  return { subject, text, html };
}

/**
 * Brief, privacy-respecting alert that a new chat message has arrived.
 * The message body is intentionally NOT included — recipients sign in to read.
 */
export function chatAlertEmail(opts: {
  recipientLabel: string;       // e.g. the alias or persona name shown to recipient
  fromLabel: string;            // who they see the sender as (persona or alias)
  preview: string;              // first 80 chars, no PII
  signInUrl?: string;           // defaults to /login
}): { subject: string; text: string; html: string } {
  const url = opts.signInUrl ?? "/login";
  const subject = `Nawi · New message from ${opts.fromLabel}`;
  const text = `Hello ${opts.recipientLabel},

You have a new message from ${opts.fromLabel}.

  "${opts.preview}"

Sign in to reply: ${url}

— Nawi Experiences`;

  const html = `
<!doctype html><html><body style="font-family:Georgia,serif;background:#F5F3ED;padding:32px;color:#3A3A3A;margin:0">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:24px;border:1px solid rgba(128,0,32,0.08);padding:40px">
    <p style="color:#800020;letter-spacing:0.4em;font-size:11px;font-weight:700;margin:0 0 8px">NAWI · NEW MESSAGE</p>
    <h1 style="font-size:22px;color:#3A3A3A;margin:0 0 16px;font-weight:700">${escapeHtml(opts.fromLabel)} sent you a message.</h1>
    <p style="line-height:1.6;color:#6B6B6B;margin:0 0 24px">Hello <strong>${escapeHtml(opts.recipientLabel)}</strong>, you have a new message waiting in your dashboard.</p>

    <blockquote style="margin:0 0 28px;padding:16px 20px;background:#F5F3ED;border-radius:14px;border-left:3px solid #800020;color:#3A3A3A;font-style:italic;font-family:Georgia,serif">
      &ldquo;${escapeHtml(opts.preview)}&rdquo;
    </blockquote>

    <a href="${url}" style="display:inline-block;background:#800020;color:white;text-decoration:none;padding:14px 28px;border-radius:999px;font-weight:700;font-size:13px;letter-spacing:0.05em">
      Open Dashboard
    </a>

    <p style="margin-top:32px;font-size:11px;color:#999;font-style:italic">For your privacy, the full message is only available after sign-in. — Nawi</p>
  </div>
</body></html>`;
  return { subject, text, html };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
