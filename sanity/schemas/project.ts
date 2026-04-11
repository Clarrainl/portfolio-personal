import { defineField, defineType } from 'sanity';

// Rich blog-style content block — text + inline images + GIFs
const blogContent = {
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
          { title: 'Underline', value: 'underline' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [{ name: 'href', type: 'url', title: 'URL' }],
          },
        ],
      },
    },
    // Inline image (JPG, PNG, GIF, WebP)
    {
      type: 'image',
      title: 'Imagen / GIF',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Descripción', type: 'string' },
        { name: 'caption', title: 'Caption (opcional)', type: 'string' },
      ],
    },
    // Inline video
    {
      type: 'file',
      title: 'Video',
      options: { accept: 'video/*' },
      fields: [
        { name: 'caption', title: 'Caption (opcional)', type: 'string' },
      ],
    },
  ],
};

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
      description: 'Máximo 120 caracteres — aparece en las tarjetas de proyecto',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'description',
      title: 'Contenido del proyecto (ES)',
      group: 'es',
      description: 'Escribe, pega texto, sube imágenes y GIFs libremente',
      ...blogContent,
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
      description: 'Max 120 characters — shown on project cards',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'descriptionEn',
      title: 'Project content (EN)',
      group: 'en',
      description: 'Write, paste text, upload images and GIFs freely',
      ...blogContent,
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
    defineField({
      name: 'authors',
      title: 'Autores',
      type: 'array',
      group: 'meta',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'course',
      title: 'Curso',
      type: 'string',
      group: 'meta',
    }),
    defineField({
      name: 'institution',
      title: 'Institución',
      type: 'string',
      group: 'meta',
    }),
    defineField({
      name: 'moreInfoUrl',
      title: 'Link de más información',
      type: 'url',
      group: 'meta',
      description: 'URL a blog externo u otra fuente',
    }),

    // ── Media ──
    defineField({
      name: 'heroVideo',
      title: 'Video hero (opcional)',
      type: 'file',
      group: 'media',
      options: { accept: 'video/*' },
      description: 'Si se sube un video, reemplaza la imagen de portada en el hero a pantalla completa',
    }),
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
      title: 'Galerías de imágenes',
      type: 'array',
      group: 'media',
      description: 'Añade una o varias secciones, cada una con su propio título y fotos',
      of: [
        {
          type: 'object',
          name: 'gallerySection',
          title: 'Sección',
          fields: [
            {
              name: 'sectionTitle',
              title: 'Título de la sección',
              type: 'string',
              description: 'Ej: Construcción, Proyecto final, Montaje',
            },
            {
              name: 'images',
              title: 'Imágenes',
              type: 'array',
              of: [
                {
                  type: 'image',
                  options: { hotspot: true },
                  fields: [
                    { name: 'alt', title: 'Alt', type: 'string' },
                    { name: 'caption', title: 'Caption', type: 'string' },
                  ],
                },
              ],
              options: { layout: 'grid' },
            },
          ],
          preview: {
            select: { title: 'sectionTitle', images: 'images' },
            prepare({ title, images }: { title: string; images: unknown[] }) {
              return {
                title: title || 'Sin título',
                subtitle: `${(images || []).length} imagen(es)`,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'videoUrl',
      title: 'URL del video (YouTube)',
      type: 'url',
      group: 'media',
      description: 'Pega el link de YouTube del video explicativo del proyecto',
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
