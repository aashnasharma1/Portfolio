// Enquiry email in the site's style: cream ground, square hairline frame,
// mustard tag and reply button, italic wordmark. Email-safe: tables and
// inline styles only (Gmail/Outlook drop <style>, gradients and web fonts),
// so the site's stripe pattern is drawn with real 1px rules.

const C = {
  page: '#F7F2E2',
  card: '#FFFDF3',
  ink: '#1A1712',
  text: '#2A2620',
  soft: '#4D473C',
  muted: '#655E4E',
  line: '#D9D0B6',
  stripe: '#EEDBB5',
  accent: '#F2B549',
};

const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const SERIF = "'Instrument Serif', Georgia, 'Times New Roman', serif";
const MONO = "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace";
const SITE = 'https://aashnasharma.vercel.app';

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// A band of fine horizontal rules, like the site's page frame
const stripes = (rows) =>
  Array.from({ length: rows }, () =>
    `<tr><td style="height:3px;line-height:3px;font-size:0;border-bottom:1px solid ${C.stripe};">&nbsp;</td></tr>`
  ).join('');

const label = (text) =>
  `<p style="margin:0 0 6px;font-family:${MONO};font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:${C.muted};">${text}</p>`;

export function enquiryEmail({ name, email, message }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
  const firstName = escapeHtml(name.split(/\s+/)[0]);
  const received = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const replyHref = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent('Re: your message')}`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<title>New enquiry from ${safeName}</title>
</head>
<body style="margin:0;padding:0;background-color:${C.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${safeName} sent a message through your portfolio.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.page};">
  <tr>
    <td align="center" style="padding:32px 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background-color:${C.card};border:1px solid ${C.line};">

        <!-- Header: wordmark + mustard tag -->
        <tr>
          <td style="padding:22px 28px;border-bottom:1px solid ${C.line};">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:${SERIF};font-style:italic;font-size:28px;line-height:1;color:${C.ink};">Aashna</td>
                <td align="right">
                  <span style="display:inline-block;padding:7px 10px;background-color:${C.accent};font-family:${SANS};font-size:10px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${C.ink};">New enquiry</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Stripe band -->
        <tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${stripes(5)}</table></td></tr>

        <!-- Sender -->
        <tr>
          <td style="padding:30px 28px 22px;">
            ${label('From')}
            <p style="margin:0;font-family:${SANS};font-size:30px;line-height:1.1;font-weight:800;letter-spacing:-0.5px;text-transform:uppercase;color:${C.ink};">${safeName}</p>
            <p style="margin:8px 0 0;font-family:${SANS};font-size:15px;"><a href="mailto:${safeEmail}" style="color:${C.text};text-decoration:none;border-bottom:1px solid ${C.accent};">${safeEmail}</a></p>
          </td>
        </tr>

        <!-- Meta row -->
        <tr>
          <td style="padding:0 28px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C.line};border-bottom:1px solid ${C.line};">
              <tr>
                <td width="50%" style="padding:12px 12px 12px 0;border-right:1px solid ${C.line};">
                  ${label('Received')}
                  <p style="margin:0;font-family:${SANS};font-size:14px;color:${C.text};">${received} IST</p>
                </td>
                <td width="50%" style="padding:12px 0 12px 16px;">
                  ${label('Via')}
                  <p style="margin:0;font-family:${SANS};font-size:14px;color:${C.text};">Portfolio contact form</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Message -->
        <tr>
          <td style="padding:26px 28px 8px;">
            ${label('Message')}
            <p style="margin:0;padding-left:14px;border-left:2px solid ${C.accent};font-family:${SANS};font-size:16px;line-height:1.65;color:${C.text};">${safeMessage}</p>
          </td>
        </tr>

        <!-- Reply -->
        <tr>
          <td style="padding:24px 28px 32px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background-color:${C.accent};">
                  <a href="${replyHref}" style="display:inline-block;padding:13px 22px;font-family:${SANS};font-size:15px;font-weight:600;color:${C.ink};text-decoration:none;">Reply to ${firstName} &#8599;</a>
                </td>
              </tr>
            </table>
            <p style="margin:12px 0 0;font-family:${SANS};font-size:12px;color:${C.muted};">Or just hit reply. It goes straight to ${safeEmail}.</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${stripes(3)}</table></td></tr>
        <tr>
          <td style="padding:16px 28px;border-top:1px solid ${C.line};">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:${MONO};font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:${C.muted};">Aashna Sharma &middot; Portfolio</td>
                <td align="right" style="font-family:${MONO};font-size:10px;letter-spacing:1.4px;text-transform:uppercase;"><a href="${SITE}" style="color:${C.muted};text-decoration:none;">aashnasharma.vercel.app &#8599;</a></td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  const text = [
    `New enquiry from ${name}`,
    `${email}`,
    `Received ${received} IST via the portfolio contact form`,
    '',
    message,
    '',
    `Reply to this email to answer ${name.split(/\s+/)[0]} directly.`,
  ].join('\n');

  return { html, text };
}
