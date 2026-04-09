import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'about',
  title: 'Sobre Mí',
  type: 'document',
  fields: [
    defineField({
      name: 'bio',
      title: 'Biografía',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'photo',
      title: 'Foto profesional',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'education',
      title: 'Educación',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'degree', title: 'Título / Grado', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'institution', title: 'Institución', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'year', title: 'Año', type: 'number' },
            { name: 'description', title: 'Descripción', type: 'text', rows: 3 },
          ],
          preview: {
            select: { title: 'degree', subtitle: 'institution' },
          },
        },
      ],
    }),
    defineField({
      name: 'skills',
      title: 'Habilidades',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'socialLinks',
      title: 'Redes Sociales',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Plataforma',
              type: 'string',
              options: {
                list: ['LinkedIn', 'GitHub', 'Instagram', 'Twitter', 'Behance'],
              },
            },
            { name: 'url', title: 'URL', type: 'url' },
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Sobre Mí' };
    },
  },
});
