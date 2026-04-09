import type { APIRoute } from 'astro';
import { z } from 'zod';
import { sendContactEmail } from '../../lib/resend.js';

export const prerender = false;

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  company: z.string().optional(),
  website: z.string().optional(), // honeypot
});

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Cuerpo de la solicitud inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    const firstError = parsed.error.errors[0];
    return new Response(JSON.stringify({ error: firstError?.message || 'Datos inválidos' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { name, email, message, company, website } = parsed.data;

  // Honeypot: bot detected
  if (website) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await sendContactEmail({ name, email, message, company });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error sending email:', err);

    return new Response(
      JSON.stringify({ error: 'Error al enviar el mensaje. Intenta de nuevo.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
