import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export interface ContactData {
  name: string;
  company?: string;
  email: string;
  message: string;
}

export async function sendContactEmail(data: ContactData) {
  const { name, company, email, message } = data;
  const contactEmail = import.meta.env.CONTACT_EMAIL || 'clarrainlihn@gmail.com';
  const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321';

  const fromEmail = import.meta.env.RESEND_FROM_EMAIL || 'noreply@charlielarrain.com';

  const { data, error } = await resend.emails.send({
    from: `Portfolio <${fromEmail}>`,
    to: [contactEmail],
    replyTo: email,
    subject: `Nuevo mensaje de contacto — ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h2 style="font-size: 20px; margin-bottom: 24px;">Nuevo mensaje de contacto</h2>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #E5E2DD; width: 120px; color: #6B6B6B; font-size: 14px;">Nombre</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #E5E2DD; font-size: 14px;">${name}</td>
          </tr>
          ${company ? `
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #E5E2DD; color: #6B6B6B; font-size: 14px;">Empresa</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #E5E2DD; font-size: 14px;">${company}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #E5E2DD; color: #6B6B6B; font-size: 14px;">Email</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #E5E2DD; font-size: 14px;"><a href="mailto:${email}">${email}</a></td>
          </tr>
        </table>

        <div style="margin-top: 24px;">
          <p style="color: #6B6B6B; font-size: 14px; margin-bottom: 8px;">Mensaje:</p>
          <div style="background: #F8F7F5; padding: 16px; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
        </div>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
