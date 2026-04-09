import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Introduce un email válido'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  company: z.string().optional(),
  website: z.string().optional(), // honeypot
});

type FormData = z.infer<typeof schema>;

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json() as { success?: boolean; error?: string };

      if (json.success) {
        setStatus('success');
        reset();
      } else {
        setStatus('error');
        setErrorMessage(json.error || 'Error desconocido');
      }
    } catch {
      setStatus('error');
      setErrorMessage('No se pudo conectar con el servidor. Intenta de nuevo.');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl" noValidate>
      {/* Honeypot field — hidden from users, visible to bots */}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
      >
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} {...register('website')} />
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2 text-[#0A0A0A]">
          Nombre <span className="text-[#D94F4F]">*</span>
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          className={[
            'w-full px-4 py-3 border text-sm bg-transparent outline-none transition-colors duration-200',
            'focus:border-[#0A0A0A] placeholder:text-[#6B6B6B]/50',
            errors.name ? 'border-[#D94F4F]' : 'border-[#E5E2DD]',
          ].join(' ')}
          placeholder="Tu nombre"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-xs text-[#D94F4F] mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Company (optional) */}
      <div>
        <label htmlFor="company" className="block text-sm font-medium mb-2 text-[#0A0A0A]">
          Empresa <span className="text-[#6B6B6B] font-normal">(opcional)</span>
        </label>
        <input
          id="company"
          type="text"
          autoComplete="organization"
          className="w-full px-4 py-3 border border-[#E5E2DD] text-sm bg-transparent outline-none transition-colors duration-200 focus:border-[#0A0A0A] placeholder:text-[#6B6B6B]/50"
          placeholder="Tu empresa o estudio"
          {...register('company')}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2 text-[#0A0A0A]">
          Email <span className="text-[#D94F4F]">*</span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={[
            'w-full px-4 py-3 border text-sm bg-transparent outline-none transition-colors duration-200',
            'focus:border-[#0A0A0A] placeholder:text-[#6B6B6B]/50',
            errors.email ? 'border-[#D94F4F]' : 'border-[#E5E2DD]',
          ].join(' ')}
          placeholder="tu@email.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-[#D94F4F] mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2 text-[#0A0A0A]">
          Mensaje <span className="text-[#D94F4F]">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          className={[
            'w-full px-4 py-3 border text-sm bg-transparent outline-none transition-colors duration-200 resize-none',
            'focus:border-[#0A0A0A] placeholder:text-[#6B6B6B]/50',
            errors.message ? 'border-[#D94F4F]' : 'border-[#E5E2DD]',
          ].join(' ')}
          placeholder="Cuéntame sobre tu proyecto o consulta..."
          {...register('message')}
        />
        {errors.message && (
          <p className="text-xs text-[#D94F4F] mt-1">{errors.message.message}</p>
        )}
      </div>

      {/* Error message */}
      {status === 'error' && (
        <p className="text-sm text-[#D94F4F] bg-red-50 px-4 py-3 border border-[#D94F4F]/20">
          {errorMessage}
        </p>
      )}

      {/* Success message */}
      {status === 'success' && (
        <div className="text-sm text-[#4F9D69] bg-green-50 px-4 py-3 border border-[#4F9D69]/20">
          ¡Mensaje enviado! Te responderé lo antes posible.
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className={[
          'w-full py-4 text-sm font-medium tracking-[0.2em] uppercase transition-all duration-200',
          status === 'loading'
            ? 'bg-[#6B6B6B] text-white cursor-not-allowed'
            : 'bg-[#0A0A0A] text-white hover:bg-[#8B7355]',
        ].join(' ')}
      >
        {status === 'loading' ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  );
}
