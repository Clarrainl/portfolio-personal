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

// Carousel constants
const STEP_VW = 48;   // vw between item centers
const SIDE_SCALE = 0.65;
const SIDE_OPACITY = 0.45;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

function slotStyle(relPos: number, dragPx: number, stepPx: number, withTransition: boolean) {
  const frac = stepPx > 0 ? dragPx / stepPx : 0;
  const eff = relPos + frac;           // effective (fractional) position from center
  const abs = Math.abs(eff);

  const scale   = abs <= 1 ? lerp(1, SIDE_SCALE, abs)
                : abs <= 2 ? lerp(SIDE_SCALE, SIDE_SCALE * 0.55, abs - 1)
                : 0;
  const opacity = abs <= 1 ? lerp(1, SIDE_OPACITY, abs)
                : abs <= 2 ? lerp(SIDE_OPACITY, 0, abs - 1)
                : 0;
  const zIndex  = Math.round(20 - abs * 4);
  const tx      = relPos * stepPx + dragPx;

  return {
    position: 'absolute' as const,
    left: '50%',
    top: '50%',
    width: '78vw',
    maxWidth: '860px',
    transform: `translate(-50%, -50%) translateX(${tx}px) scale(${scale.toFixed(4)})`,
    opacity: opacity.toFixed(4),
    zIndex,
    transition: withTransition ? 'transform 0.35s ease, opacity 0.35s ease' : 'none',
    cursor: abs < 0.5 ? 'default' : 'pointer',
    pointerEvents: (opacity > 0.05 ? 'auto' : 'none') as 'auto' | 'none',
  };
}

export default function MediaGallery({ items }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [dragPx, setDragPx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const didDrag = useRef(false);
  const stepPx = useRef(0);

  useEffect(() => {
    const update = () => { stepPx.current = window.innerWidth * STEP_VW / 100; };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  if (!items || items.length === 0) return null;

  const isImg = (item: GalleryItem) => item._type === 'image';
  const imgIdxList = items.map((_, i) => i).filter(i => isImg(items[i]));

  function imgPos(idx: number | null) {
    return idx === null ? -1 : imgIdxList.indexOf(idx);
  }

  function openLightbox(idx: number) {
    if (isImg(items[idx])) setLightboxIndex(idx);
  }

  function closeLightbox() {
    setLightboxIndex(null);
    setDragPx(0);
    setAnimating(false);
  }

  function navigate(dir: 1 | -1) {
    if (animating || lightboxIndex === null) return;
    const cur = imgPos(lightboxIndex);
    const next = cur + dir;
    if (next < 0 || next >= imgIdxList.length) return;

    setAnimating(true);
    setDragPx(-dir * stepPx.current);

    setTimeout(() => {
      // Apagar animating en el mismo batch: React no aplica transición al reset
      setAnimating(false);
      setLightboxIndex(imgIdxList[next]);
      setDragPx(0);
    }, 320);
  }

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft')  navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'Escape')     closeLightbox();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, animating]);

  // Touch
  function onTouchStart(e: React.TouchEvent) {
    if (animating) return;
    touchStartX.current = e.touches[0].clientX;
    didDrag.current = false;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (touchStartX.current === null || animating) return;
    const d = e.touches[0].clientX - touchStartX.current;
    if (Math.abs(d) > 5) didDrag.current = true;
    setDragPx(d);
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || animating) return;
    const d = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(d) < 50) {
      setAnimating(true);
      setDragPx(0);
      setTimeout(() => setAnimating(false), 350);
      return;
    }

    const dir: 1 | -1 = d < 0 ? 1 : -1;
    const cur = imgPos(lightboxIndex);
    const next = cur + dir;

    if (next < 0 || next >= imgIdxList.length) {
      setAnimating(true);
      setDragPx(0);
      setTimeout(() => setAnimating(false), 350);
      return;
    }

    setAnimating(true);
    setDragPx(-dir * stepPx.current);
    setTimeout(() => {
      setAnimating(false);
      setLightboxIndex(imgIdxList[next]);
      setDragPx(0);
    }, 300);
  }

  function onBgClick() {
    if (didDrag.current) { didDrag.current = false; return; }
    closeLightbox();
  }

  // Slots to render: relative positions -2 … +2
  const curPos = imgPos(lightboxIndex);
  function slotItem(offset: number) {
    const p = curPos + offset;
    if (p < 0 || p >= imgIdxList.length) return null;
    return items[imgIdxList[p]];
  }

  const sp = stepPx.current || (typeof window !== 'undefined' ? window.innerWidth * STEP_VW / 100 : 300);
  const showTransition = animating;
  const hasPrev = curPos > 0;
  const hasNext = curPos < imgIdxList.length - 1;

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
        {items.map((item, idx) => (
          <div key={item._key} className="aspect-[4/3] overflow-hidden bg-[#F8F7F5]">
            {isImg(item) && item.asset?._ref && (
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
            {item._type === 'file' && (item as any).asset?.url && (
              <video src={(item as any).asset.url} controls className="w-full h-full object-cover" preload="metadata">
                Tu navegador no soporta video.
              </video>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox carousel */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] overflow-hidden"
          style={{ background: 'rgba(0,0,0,0.93)', touchAction: 'none' }}
          onClick={onBgClick}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Carousel slots -2 … +2 */}
          {([-2, -1, 0, 1, 2] as const).map((relPos) => {
            const item = slotItem(relPos);
            if (!item || !(item as any).asset?._ref) return null;

            const style = slotStyle(relPos, dragPx, sp, showTransition);

            return (
              <div
                key={relPos}
                style={style}
                onClick={(e) => {
                  e.stopPropagation();
                  if (relPos === -1) navigate(-1);
                  else if (relPos === 1) navigate(1);
                }}
              >
                <img
                  src={buildImageUrl((item as any).asset._ref)}
                  alt={(item as any).alt || ''}
                  style={{
                    width: '100%',
                    maxHeight: '82vh',
                    objectFit: 'contain',
                    display: 'block',
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                  draggable={false}
                />
              </div>
            );
          })}

          {/* Close */}
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 50,
              color: 'rgba(255,255,255,0.7)', fontSize: '1.5rem', padding: '0.5rem',
              background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}
            aria-label="Cerrar"
          >
            ✕
          </button>

          {/* Arrow prev */}
          {hasPrev && (
            <button
              onClick={(e) => { e.stopPropagation(); navigate(-1); }}
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                zIndex: 50, color: 'rgba(255,255,255,0.7)', fontSize: '2rem', padding: '0.75rem',
                background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}
              aria-label="Anterior"
            >
              ←
            </button>
          )}

          {/* Arrow next */}
          {hasNext && (
            <button
              onClick={(e) => { e.stopPropagation(); navigate(1); }}
              style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                zIndex: 50, color: 'rgba(255,255,255,0.7)', fontSize: '2rem', padding: '0.75rem',
                background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}
              aria-label="Siguiente"
            >
              →
            </button>
          )}

          {/* Dots indicator */}
          {imgIdxList.length > 1 && (
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%',
              transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 50 }}>
              {imgIdxList.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === curPos ? '18px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    background: i === curPos ? 'white' : 'rgba(255,255,255,0.35)',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
