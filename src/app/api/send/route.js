import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const generateEmailHTML = ({ name, email, organization, services, message }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f0;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #1c1f1a; padding: 40px 40px 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px; font-size: 12px; color: #85885c; text-transform: uppercase; letter-spacing: 2px;">New Message</p>
                    <h1 style="margin: 0; font-size: 28px; font-weight: 600; color: #f5f5f0;">Contact Form Submission</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Date Badge -->
          <tr>
            <td style="padding: 24px 40px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: #f5f5f0; padding: 8px 16px; border-radius: 20px;">
                    <p style="margin: 0; font-size: 12px; color: #666;">${currentDate}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Sender Info Card -->
          <tr>
            <td style="padding: 24px 40px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fafaf8; border-radius: 8px; border-left: 4px solid #85885c;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 4px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px;">From</p>
                    <p style="margin: 0 0 4px; font-size: 18px; font-weight: 600; color: #1c1f1a;">${name}</p>
                    <a href="mailto:${email}" style="color: #85885c; text-decoration: none; font-size: 14px;">${email}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Details Grid -->
          <tr>
            <td style="padding: 0 40px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="50%" style="padding-right: 10px; vertical-align: top;">
                    <p style="margin: 0 0 6px; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Organization</p>
                    <p style="margin: 0; font-size: 15px; color: #1c1f1a; font-weight: 500;">${organization || '—'}</p>
                  </td>
                  <td width="50%" style="padding-left: 10px; vertical-align: top;">
                    <p style="margin: 0 0 6px; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Services Needed</p>
                    <p style="margin: 0; font-size: 15px; color: #1c1f1a; font-weight: 500;">${services || '—'}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding: 24px 40px;">
              <hr style="border: none; border-top: 1px solid #eee; margin: 0;">
            </td>
          </tr>
          
          <!-- Message -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <p style="margin: 0 0 12px; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Message</p>
              <div style="background-color: #fafaf8; border-radius: 8px; padding: 20px;">
                <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #1c1f1a; white-space: pre-wrap;">${message}</p>
              </div>
            </td>
          </tr>
          
          <!-- Reply Button -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: #85885c; border-radius: 8px;">
                    <a href="mailto:${email}?subject=Re: Your inquiry" style="display: inline-block; padding: 14px 28px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none;">Reply to ${name.split(' ')[0]}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1c1f1a; padding: 24px 40px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <p style="margin: 0; font-size: 13px; color: #888;">Sent from your portfolio contact form</p>
                    <p style="margin: 8px 0 0; font-size: 12px; color: #666;">© ${new Date().getFullYear()} Aashna Sharma</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

export async function POST(request) {
  try {
    const { name, email, organization, services, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return Response.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: ['aashnajuyal@gmail.com'],
      subject: `New inquiry from ${name}`,
      html: generateEmailHTML({ name, email, organization, services, message }),
      replyTo: email,
    });

    if (error) {
      console.error('Resend error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error('API error:', error);
    return Response.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
