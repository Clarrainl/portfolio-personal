import { useState, useRef, useEffect } from 'react';
import type { GalleryItem } from '../../types/index.js';

interface Props {
  items: GalleryItem[];
  projectId?: string;
}

function buildImageUrl(ref: string, width = 1200): string {
  if (ref.endsWith('-gif')) {
    const id = ref.replace(/^image-/, '').replace(/-gif$/, '');
    return `https://cdn.sanity.io/images/zoh6ht03/production/${id}.gif`;
  }
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
  const [dragOffset, setDragOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const didDrag = useRef(false);

  // Bloquear scroll del body mientras el lightbox está abierto
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  if (!items || items.length === 0) return null;

  const isImage = (item: GalleryItem) => item._type === 'image';
  const isVideo = (item: GalleryItem) => item._type === 'file';

  function getAdjacentIndex(from: number, direction: 1 | -1): number | null {
    let idx = from + direction;
    while (idx >= 0 && idx < items.length && !isImage(items[idx])) idx += direction;
    if (idx < 0 || idx >= items.length) return null;
    return isImage(items[idx]) ? idx : null;
  }

  function openLightbox(idx: number) {
    if (isImage(items[idx])) setLightboxIndex(idx);
  }

  function closeLightbox() {
    setLightboxIndex(null);
    setDragOffset(0);
    setIsAnimating(false);
  }

  // Navegar con animación de carrusel
  function navigate(direction: 1 | -1) {
    if (lightboxIndex === null || isAnimating) return;
    const targetIdx = getAdjacentIndex(lightboxIndex, direction);
    if (targetIdx === null) return;

    setIsAnimating(true);
    setDragOffset(-direction * window.innerWidth);

    setTimeout(() => {
      setLightboxIndex(targetIdx);
      setDragOffset(0);
      setTimeout(() => setIsAnimating(false), 30);
    }, 300);
  }

  // Touch handlers
  function handleTouchStart(e: React.TouchEvent) {
    if (isAnimating) return;
    touchStartX.current = e.touches[0].clientX;
    didDrag.current = false;
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (touchStartX.current === null || isAnimating) return;
    const delta = e.touches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 5) didDrag.current = true;
    setDragOffset(delta);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || isAnimating) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) < 50) {
      // snap back
      setIsAnimating(true);
      setDragOffset(0);
      setTimeout(() => setIsAnimating(false), 300);
      return;
    }

    const direction = delta < 0 ? 1 : -1; // 1 = siguiente, -1 = anterior
    if (lightboxIndex === null) return;
    const targetIdx = getAdjacentIndex(lightboxIndex, direction);

    if (targetIdx === null) {
      // no hay imagen en esa dirección, volver atrás
      setIsAnimating(true);
      setDragOffset(0);
      setTimeout(() => setIsAnimating(false), 300);
      return;
    }

    // completar la animación hacia afuera
    setIsAnimating(true);
    setDragOffset(direction < 0 ? window.innerWidth : -window.innerWidth);

    setTimeout(() => {
      setLightboxIndex(targetIdx);
      setDragOffset(0);
      setTimeout(() => setIsAnimating(false), 30);
    }, 280);
  }

  function handleLightboxClick() {
    if (didDrag.current) { didDrag.current = false; return; }
    closeLightbox();
  }

  // Imágenes adyacentes para el carrusel
  const prevIdx = lightboxIndex !== null ? getAdjacentIndex(lightboxIndex, -1) : null;
  const nextIdx = lightboxIndex !== null ? getAdjacentIndex(lightboxIndex, 1) : null;
  const currentItem = lightboxIndex !== null ? items[lightboxIndex] : null;
  const prevItem = prevIdx !== null ? items[prevIdx] : null;
  const nextItem = nextIdx !== null ? items[nextIdx] : null;

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
        {items.map((item, idx) => (
          <div key={item._key} className="aspect-[4/3] overflow-hidden bg-[#F8F7F5]">
            {isImage(item) && item.asset?._ref && (
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

            {isVideo(item) && (item as any).asset?.url && (
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
          className="fixed inset-0 z-[100] bg-black/90 overflow-hidden"
          onClick={handleLightboxClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: 'none' }}
        >
          {/* Carrusel: 3 paneles en fila, se desplazan juntos */}
          <div
            style={{
              display: 'flex',
              width: '300vw',
              height: '100%',
              transform: `translateX(calc(-100vw + ${dragOffset}px))`,
              transition: isAnimating ? 'transform 0.3s ease' : 'none',
              willChange: 'transform',
            }}
          >
            {/* Panel anterior */}
            <div style={{ width: '100vw', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {prevItem && (prevItem as any).asset?._ref && (
                <img
                  src={buildImageUrl((prevItem as any).asset._ref)}
                  alt={(prevItem as any).alt || ''}
                  style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', pointerEvents: 'none', userSelect: 'none' }}
                  draggable={false}
                />
              )}
            </div>

            {/* Panel actual */}
            <div style={{ width: '100vw', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={buildImageUrl((currentItem as any).asset._ref)}
                alt={(currentItem as any).alt || ''}
                style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', pointerEvents: 'none', userSelect: 'none' }}
                draggable={false}
              />
            </div>

            {/* Panel siguiente */}
            <div style={{ width: '100vw', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {nextItem && (nextItem as any).asset?._ref && (
                <img
                  src={buildImageUrl((nextItem as any).asset._ref)}
                  alt={(nextItem as any).alt || ''}
                  style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', pointerEvents: 'none', userSelect: 'none' }}
                  draggable={false}
                />
              )}
            </div>
          </div>

          {/* Close */}
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl z-10 p-2"
            aria-label="Cerrar"
          >
            ✕
          </button>

          {/* Prev */}
          {prevIdx !== null && (
            <button
              onClick={(e) => { e.stopPropagation(); navigate(-1); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-3xl z-10 p-3"
              aria-label="Anterior"
            >
              ←
            </button>
          )}

          {/* Next */}
          {nextIdx !== null && (
            <button
              onClick={(e) => { e.stopPropagation(); navigate(1); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-3xl z-10 p-3"
              aria-label="Siguiente"
            >
              →
            </button>
          )}

          {/* Caption */}
          {(currentItem as any).caption && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm text-center px-8 z-10">
              {(currentItem as any).caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}
