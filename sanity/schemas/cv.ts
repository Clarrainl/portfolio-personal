import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'cv',
  title: 'CV',
  type: 'document',
  fields: [
    // ── Educación ──
    defineField({
      name: 'educacion',
      title: 'Educación',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'yearStart', title: 'Año inicio', type: 'string', description: 'Ej: 2020' },
            { name: 'yearEnd', title: 'Año fin', type: 'string', description: 'Ej: 2024 o Presente' },
            { name: 'program', title: 'Programa / Título', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'institution', title: 'Institución', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'city', title: 'Ciudad / País', type: 'string' },
            { name: 'description', title: 'Descripción (opcional)', type: 'text', rows: 3, description: 'Aparece en cursiva' },
          ],
          preview: {
            select: { title: 'program', subtitle: 'institution' },
          },
        },
      ],
    }),

    // ── Experiencia ──
    defineField({
      name: 'experiencia',
      title: 'Experiencia',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'year', title: 'Año', type: 'string', description: 'Ej: 2023 o 2022–2023' },
            { name: 'company', title: 'Empresa / Lugar', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'role', title: 'Rol', type: 'string', validation: (Rule: any) => Rule.required() },
          ],
          preview: {
            select: { title: 'company', subtitle: 'role' },
          },
        },
      ],
    }),

    // ── Habilidades e Intereses ──
    defineField({
      name: 'habilidades',
      title: 'Habilidades',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Lista de habilidades — columna izquierda',
    }),
    defineField({
      name: 'intereses',
      title: 'Intereses',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Lista de intereses — columna derecha',
    }),

    defineField({
      name: 'lastUpdated',
      title: 'Última actualización',
      type: 'date',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'CV' };
    },
  },
});
