import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Only allow POST requests for security
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get data from the form body
  const { first_name, last_name, email, phone, project_type, message } = req.body;

  // Basic validation
  if (!first_name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'CMD CTR <onboarding@resend.dev>',
      to: [process.env.EMAIL_TO || 'dixitatharvv@gmail.com'],
      subject: `[Portfolio Inquiry] ${project_type} from ${first_name} ${last_name}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Inquiry</title>
        </head>
        <body style="background-color: #0a0a0a; color: #f0f0f0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; margin: 0; -webkit-font-smoothing: antialiased;">
          <div style="max-width: 600px; margin: 0 auto; border: 1px solid #222; border-radius: 16px; overflow: hidden; background-color: #111; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            
            <!-- Header -->
            <div style="padding: 40px 30px; border-bottom: 1px solid #222; background: linear-gradient(135deg, #111 0%, #1a1a1a 100%);">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #fff; letter-spacing: -0.5px; text-transform: uppercase; font-style: italic;">
                New Contact Message
              </h1>
              <p style="margin: 8px 0 0; color: #888; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
                Krishna Kapale Portfolio &bull; Inquiry Alert
              </p>
            </div>

            <!-- Content Area -->
            <div style="padding: 40px 30px;">
              
              <!-- Sender Info -->
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 35px;">
                <tr>
                  <td style="width: 50%; padding-bottom: 25px;">
                    <span style="display: block; text-transform: uppercase; font-size: 10px; font-weight: 700; color: #666; margin-bottom: 6px; letter-spacing: 1.5px;">Client Name</span>
                    <span style="font-size: 16px; font-weight: 600; color: #fff;">${first_name} ${last_name}</span>
                  </td>
                  <td style="width: 50%; padding-bottom: 25px;">
                    <span style="display: block; text-transform: uppercase; font-size: 10px; font-weight: 700; color: #666; margin-bottom: 6px; letter-spacing: 1.5px;">Email Address</span>
                    <a href="mailto:${email}" style="font-size: 16px; color: #fff; text-decoration: none; font-weight: 600;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="width: 50%;">
                    <span style="display: block; text-transform: uppercase; font-size: 10px; font-weight: 700; color: #666; margin-bottom: 6px; letter-spacing: 1.5px;">Phone</span>
                    <span style="font-size: 16px; color: #fff;">${phone || 'Not available'}</span>
                  </td>
                  <td style="width: 50%;">
                    <span style="display: block; text-transform: uppercase; font-size: 10px; font-weight: 700; color: #666; margin-bottom: 6px; letter-spacing: 1.5px;">Inquiry Type</span>
                    <span style="font-size: 14px; padding: 4px 10px; background-color: #222; color: #fff; border-radius: 4px; font-weight: 600;">${project_type}</span>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <div style="background-color: #0d0d0d; padding: 30px; border-radius: 12px; border: 1px solid #222;">
                <span style="display: block; text-transform: uppercase; font-size: 10px; font-weight: 700; color: #666; margin-bottom: 12px; letter-spacing: 1.5px;">Message Details</span>
                <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #bbb; white-space: pre-wrap;">${message}</p>
              </div>

            </div>

            <!-- Footer -->
            <div style="padding: 25px 30px; background-color: #0a0a0a; border-top: 1px solid #222; text-align: center;">
              <p style="margin: 0; color: #444; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
                &copy; 2026 Krishna Kapale &bull; Built with Resend
              </p>
            </div>

          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Resend Error:', error);
      return res.status(400).json({ error });
    }

    res.status(200).json({ success: true, messageId: data.id });
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
