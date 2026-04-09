import { useState } from 'react';
import type { GalleryItem } from '../../types/index.js';

interface Props {
  items: GalleryItem[];
  projectId?: string;
}

function buildImageUrl(ref: string, width = 1200): string {
  const parts = ref.replace('image-', '').split('-');
  const ext = parts.pop();
  const id = parts.join('-');
  return `https://cdn.sanity.io/images/zoh6ht03/production/${id}.${ext}?w=${width}`;
}

function buildThumbnailUrl(ref: string): string {
  return buildImageUrl(ref, 600);
}

export default function MediaGallery({ items }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!items || items.length === 0) return null;

  const isImage = (item: GalleryItem) => item._type === 'image';
  const isVideo = (item: GalleryItem) => item._type === 'file';

  function openLightbox(idx: number) {
    if (isImage(items[idx])) setLightboxIndex(idx);
  }

  function closeLightbox() {
    setLightboxIndex(null);
  }

  function prev() {
    if (lightboxIndex === null) return;
    let idx = lightboxIndex - 1;
    while (idx >= 0 && !isImage(items[idx])) idx--;
    if (idx >= 0) setLightboxIndex(idx);
  }

  function next() {
    if (lightboxIndex === null) return;
    let idx = lightboxIndex + 1;
    while (idx < items.length && !isImage(items[idx])) idx++;
    if (idx < items.length) setLightboxIndex(idx);
  }

  const currentItem = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
        {items.map((item, idx) => (
          <div key={item._key} className="aspect-[4/3] overflow-hidden bg-[#F8F7F5]">
            {isImage(item) && item._type === 'image' && item.asset?._ref && (
              <button
                onClick={() => openLightbox(idx)}
                className="w-full h-full cursor-zoom-in group"
                aria-label="Abrir imagen"
              >
                <img
                  src={buildThumbnailUrl(item.asset._ref)}
                  alt={(item as any).alt || ''}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </button>
            )}

            {isVideo(item) && item._type === 'file' && (item as any).asset?.url && (
              <video
                src={(item as any).asset.url}
                controls
                className="w-full h-full object-cover"
                preload="metadata"
              >
                Tu navegador no soporta video.
              </video>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && currentItem && isImage(currentItem) && (currentItem as any).asset?._ref && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl z-10 p-2"
            aria-label="Cerrar"
          >
            ✕
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 text-white/70 hover:text-white text-3xl z-10 p-3"
            aria-label="Anterior"
          >
            ←
          </button>

          {/* Image */}
          <img
            src={buildImageUrl((currentItem as any).asset._ref)}
            alt={(currentItem as any).alt || ''}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 text-white/70 hover:text-white text-3xl z-10 p-3"
            aria-label="Siguiente"
          >
            →
          </button>

          {/* Caption */}
          {(currentItem as any).caption && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm text-center px-8">
              {(currentItem as any).caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}
