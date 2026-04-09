import { defineField, defineType } from 'sanity';

const blockContent = {
  type: 'block',
  styles: [{ title: 'Normal', value: 'normal' }, { title: 'H2', value: 'h2' }, { title: 'H3', value: 'h3' }],
  marks: { decorators: [{ title: 'Bold', value: 'strong' }, { title: 'Italic', value: 'em' }] },
};

export default defineType({
  name: 'about',
  title: 'Sobre Mí',
  type: 'document',
  groups: [
    { name: 'es', title: '🇪🇸 Español', default: true },
    { name: 'en', title: '🇬🇧 English' },
    { name: 'shared', title: 'Compartido' },
  ],
  fields: [
    // ── Español ──
    defineField({
      name: 'bio',
      title: 'Biografía (ES)',
      type: 'array',
      group: 'es',
      of: [blockContent],
    }),

    // ── English ──
    defineField({
      name: 'bioEn',
      title: 'Bio (EN)',
      type: 'array',
      group: 'en',
      of: [blockContent],
    }),

    // ── Compartido ──
    defineField({
      name: 'photo',
      title: 'Foto profesional',
      type: 'image',
      group: 'shared',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Texto alternativo', type: 'string' })],
    }),
    defineField({
      name: 'education',
      title: 'Educación',
      type: 'array',
      group: 'shared',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'degree', title: 'Título / Grado (ES)', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'degreeEn', title: 'Degree (EN)', type: 'string' },
            { name: 'institution', title: 'Institución', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'year', title: 'Año', type: 'number' },
            { name: 'description', title: 'Descripción (ES)', type: 'text', rows: 2 },
            { name: 'descriptionEn', title: 'Description (EN)', type: 'text', rows: 2 },
          ],
          preview: { select: { title: 'degree', subtitle: 'institution' } },
        },
      ],
    }),
    defineField({
      name: 'skills',
      title: 'Habilidades (igual en ambos idiomas)',
      type: 'array',
      group: 'shared',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'socialLinks',
      title: 'Redes Sociales',
      type: 'array',
      group: 'shared',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'platform', title: 'Plataforma', type: 'string', options: { list: ['LinkedIn', 'GitHub', 'Instagram', 'Twitter', 'Behance'] } },
            { name: 'url', title: 'URL', type: 'url' },
          ],
          preview: { select: { title: 'platform', subtitle: 'url' } },
        },
      ],
    }),
  ],
  preview: {
    prepare() { return { title: 'Sobre Mí / About' }; },
  },
});
