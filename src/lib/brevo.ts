const BREVO_API_KEY = process.env.BREVO_API_KEY ?? '';
const WELCOME_LIST_ID = 11; // "New Signups - Welcome Flow"

async function brevoPost(endpoint: string, body: object) {
  const res = await fetch(`https://api.brevo.com/v3${endpoint}`, {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });
  return res;
}

export async function addToWelcomeList(email: string, name: string) {
  if (!BREVO_API_KEY) return;
  await brevoPost('/contacts', {
    email,
    attributes: { FIRSTNAME: name },
    listIds: [WELCOME_LIST_ID],
    updateEnabled: true,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  if (!BREVO_API_KEY) return;

  const firstName = name.split(' ')[0];

  await brevoPost('/smtp/email', {
    sender: { name: 'Robin from Notions11', email: 'contact@notions11.com' },
    to: [{ email, name }],
    subject: 'Welcome to Notions11',
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Notions11</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 16px; color: #111; background: #fff;">

  <div style="margin: 0 0 32px;">
    <img src="https://www.notions11.com/assets/images/newlogo3.png" alt="Notions11" width="160" style="display: block; height: auto;">
  </div>

  <p style="margin: 0 0 24px;">Hi ${firstName},</p>

  <p style="margin: 0 0 16px;">Welcome to <strong>Notions11</strong> — you can now password-protect any Notion share link in seconds.</p>

  <p style="margin: 0 0 8px;">Here's how to create your first protected link:</p>

  <ol style="margin: 0 0 24px; padding-left: 20px; line-height: 1.8;">
    <li>Open Notion and share the page you want to protect</li>
    <li>Copy the share URL</li>
    <li>Paste it into your <a href="https://notions11.com/manage-link" style="color: #000;">Notions11 dashboard</a></li>
    <li>Set a password — done</li>
  </ol>

  <p style="margin: 0 0 16px;">Anyone who visits your link will need to enter the password before they can access your Notion page. No Notion account required on their end.</p>

  <p style="margin: 0 0 32px;">
    <a href="https://notions11.com/manage-link"
       style="display: inline-block; background: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 15px; font-weight: 500;">
      Create my first link
    </a>
  </p>

  <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">

  <p style="margin: 0 0 8px; font-size: 14px; color: #555;"><strong>When you're ready, Pro adds ($5/month):</strong></p>

  <ul style="margin: 0 0 24px; padding-left: 20px; line-height: 1.8; font-size: 14px; color: #444;">
    <li><strong>Expiring links</strong> — set a date or access limit</li>
    <li><strong>Access notifications</strong> — email when someone opens your link</li>
    <li><strong>Location analytics</strong> — city and country per visit</li>
  </ul>

  <p style="margin: 0 0 8px; color: #555; font-size: 14px;">— Robin, Notions11</p>

  <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">

  <p style="color: #999; font-size: 12px; margin: 0;">
    You're receiving this because you just created an account at notions11.com.<br>
    Notions11, PO Box 2162, 1200 CD Hilversum, Netherlands
  </p>

</body>
</html>`,
    textContent: `Hi ${firstName},

Welcome to Notions11 — you can now password-protect any Notion share link in seconds.

Here's how to create your first protected link:

1. Open Notion and share the page you want to protect
2. Copy the share URL
3. Paste it into your Notions11 dashboard: https://notions11.com/manage-link
4. Set a password — done

Anyone who visits your link will need to enter the password before they can access your Notion page.

https://notions11.com/manage-link

---
When you're ready, Pro adds ($5/month):
- Expiring links — set a date or access limit
- Access notifications — email when someone opens your link
- Location analytics — city and country per visit

https://notions11.com/#pricing

— Robin, Notions11

Notions11, PO Box 2162, 1200 CD Hilversum, Netherlands`,
  });
}
