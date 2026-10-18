import { Resend } from 'resend';
import { enquiryEmail } from './emailTemplate';

// Contact form → Resend. Runs on the server only, so the API key never
// reaches the browser.
//   RESEND_API_KEY  required
//   CONTACT_TO      inbox that receives messages (defaults to Aashna's)
//   CONTACT_FROM    verified sender, e.g. "Portfolio <hello@yourdomain.com>".
//                   Until a domain is verified, Resend's test sender works,
//                   but it can only deliver to the Resend account's own email.
const TO = process.env.CONTACT_TO || 'aashnajuyal@gmail.com';
const FROM = process.env.CONTACT_FROM || 'Portfolio <onboarding@resend.dev>';

const LIMITS = { name: 100, email: 200, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Light per-IP throttle: 5 messages per 10 minutes. In-memory, so it resets
// on cold starts — enough to stop casual spam without a database.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map();

const throttled = (ip) => {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
};

const json = (body, status = 200) => Response.json(body, { status });

export async function POST(request) {
  if (!process.env.RESEND_API_KEY) {
    return json({ error: 'Email is not configured yet.' }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  // Honeypot: real visitors never see or fill this field
  if (body.company) return json({ ok: true });

  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const message = String(body.message || '').trim();

  if (!name || !email || !message) {
    return json({ error: 'Please fill in your name, email and message.' }, 400);
  }
  if (!EMAIL_RE.test(email)) {
    return json({ error: 'That email address doesn’t look right.' }, 400);
  }
  if (name.length > LIMITS.name || email.length > LIMITS.email || message.length > LIMITS.message) {
    return json({ error: 'Your message is too long. Please shorten it and try again.' }, 400);
  }

  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  if (throttled(ip)) {
    return json({ error: 'Too many messages. Please try again in a few minutes.' }, 429);
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: FROM,
    to: TO,
    // Hitting reply in the inbox goes straight to the visitor
    replyTo: email,
    subject: `New enquiry from ${name}`,
    ...enquiryEmail({ name, email, message })
  });

  if (error) {
    console.error('Resend error:', error);
    return json({ error: 'The message couldn’t be sent. Please email me directly instead.' }, 502);
  }

  return json({ ok: true });
}
