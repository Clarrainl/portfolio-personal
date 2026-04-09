import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Proyecto',
  type: 'document',
  groups: [
    { name: 'es', title: '🇪🇸 Español', default: true },
    { name: 'en', title: '🇬🇧 English' },
    { name: 'media', title: 'Media' },
    { name: 'meta', title: 'Meta' },
  ],
  fields: [
    // ── Español ──
    defineField({
      name: 'title',
      title: 'Título (ES)',
      type: 'string',
      group: 'es',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Descripción corta (ES)',
      type: 'string',
      group: 'es',
      description: 'Máximo 120 caracteres',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'description',
      title: 'Descripción completa (ES)',
      type: 'array',
      group: 'es',
      of: [{ type: 'block', styles: [{ title: 'Normal', value: 'normal' }, { title: 'H2', value: 'h2' }, { title: 'H3', value: 'h3' }], marks: { decorators: [{ title: 'Bold', value: 'strong' }, { title: 'Italic', value: 'em' }] } }],
    }),

    // ── English ──
    defineField({
      name: 'titleEn',
      title: 'Title (EN)',
      type: 'string',
      group: 'en',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'shortDescriptionEn',
      title: 'Short description (EN)',
      type: 'string',
      group: 'en',
      description: 'Max 120 characters',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'descriptionEn',
      title: 'Full description (EN)',
      type: 'array',
      group: 'en',
      of: [{ type: 'block', styles: [{ title: 'Normal', value: 'normal' }, { title: 'H2', value: 'h2' }, { title: 'H3', value: 'h3' }], marks: { decorators: [{ title: 'Bold', value: 'strong' }, { title: 'Italic', value: 'em' }] } }],
    }),

    // ── Meta ──
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'meta',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          { title: 'Arquitectura', value: 'arquitectura' },
          { title: 'Robótica', value: 'robotica' },
          { title: 'Impresión 3D', value: 'impresion3d' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Año',
      type: 'number',
      group: 'meta',
      validation: (Rule) => Rule.required().integer().min(2000).max(2030),
    }),
    defineField({
      name: 'featured',
      title: '¿Proyecto destacado?',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
    }),
    defineField({
      name: 'tags',
      title: 'Etiquetas',
      type: 'array',
      group: 'meta',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),

    // ── Media ──
    defineField({
      name: 'coverImage',
      title: 'Imagen principal',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Texto alternativo', type: 'string' })],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Galería',
      type: 'array',
      group: 'media',
      of: [
        { type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt', type: 'string' }, { name: 'caption', title: 'Caption', type: 'string' }] },
        { type: 'file', title: 'Video', options: { accept: 'video/*' }, fields: [{ name: 'caption', title: 'Caption', type: 'string' }] },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'coverImage' },
    prepare({ title, subtitle, media }) {
      const categories: Record<string, string> = { arquitectura: 'Arquitectura', robotica: 'Robótica', impresion3d: 'Impresión 3D' };
      return { title, subtitle: categories[subtitle] || subtitle, media };
    },
  },
});
