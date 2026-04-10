import { urlFor } from '../../lib/sanity.js';

function buildImageUrl(asset: { _ref: string } | undefined): string | null {
  if (!asset?._ref) return null;
  const ref = asset._ref;
  const parts = ref.replace('image-', '').split('-');
  const ext = parts.pop();
  const id = parts.join('-');
  return `https://cdn.sanity.io/images/zoh6ht03/production/${id}.${ext}`;
}

export const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      const url = value?.asset ? buildImageUrl(value.asset) : null;
      if (!url) return null;
      return (
        <figure className="my-8">
          <img
            src={url}
            alt={value.alt || ''}
            className="w-full h-auto"
            loading="lazy"
          />
          {value.caption && (
            <figcaption className="text-xs text-center mt-2" style={{ color: 'var(--color-text-secondary)' }}>
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    file: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      const ref = value.asset._ref;
      const parts = ref.replace('file-', '').split('-');
      const ext = parts.pop();
      const id = parts.join('-');
      const url = `https://cdn.sanity.io/files/zoh6ht03/production/${id}.${ext}`;
      return (
        <figure className="my-8">
          <video
            src={url}
            controls
            className="w-full h-auto"
            playsInline
          />
          {value.caption && (
            <figcaption className="text-xs text-center mt-2" style={{ color: 'var(--color-text-secondary)' }}>
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-2 pl-6 my-6 italic" style={{ borderColor: 'var(--color-accent)', color: 'var(--color-text-secondary)' }}>
        {children}
      </blockquote>
    ),
  },
};
