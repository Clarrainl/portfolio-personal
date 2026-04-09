import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'cv',
  title: 'CV',
  type: 'document',
  fields: [
    defineField({
      name: 'sections',
      title: 'Secciones del CV',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Título de la sección',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'items',
              title: 'Entradas',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'role', title: 'Cargo / Título', type: 'string', validation: (Rule: any) => Rule.required() },
                    { name: 'place', title: 'Empresa / Institución', type: 'string', validation: (Rule: any) => Rule.required() },
                    { name: 'period', title: 'Período', type: 'string', description: 'Ej: 2022 – Presente' },
                    { name: 'description', title: 'Descripción', type: 'text', rows: 3 },
                  ],
                  preview: {
                    select: { title: 'role', subtitle: 'place' },
                  },
                },
              ],
            },
          ],
          preview: {
            select: { title: 'title' },
          },
        },
      ],
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
