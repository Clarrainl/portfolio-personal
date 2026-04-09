import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Proyecto',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
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
      validation: (Rule) => Rule.required().integer().min(2000).max(2030),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Descripción corta',
      type: 'string',
      description: 'Máximo 120 caracteres — aparece en la tarjeta del grid',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'description',
      title: 'Descripción completa',
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
      name: 'coverImage',
      title: 'Imagen principal',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Galería',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Texto alternativo', type: 'string' },
            { name: 'caption', title: 'Caption', type: 'string' },
          ],
        },
        {
          type: 'file',
          title: 'Video',
          options: { accept: 'video/*' },
          fields: [
            { name: 'caption', title: 'Caption', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'featured',
      title: '¿Proyecto destacado?',
      type: 'boolean',
      description: 'Aparece en el home si está activado',
      initialValue: false,
    }),
    defineField({
      name: 'tags',
      title: 'Etiquetas',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'coverImage',
    },
    prepare({ title, subtitle, media }) {
      const categories: Record<string, string> = {
        arquitectura: 'Arquitectura',
        robotica: 'Robótica',
        impresion3d: 'Impresión 3D',
      };
      return {
        title,
        subtitle: categories[subtitle] || subtitle,
        media,
      };
    },
  },
});
