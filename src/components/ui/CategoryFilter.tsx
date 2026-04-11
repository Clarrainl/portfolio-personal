import { useState } from 'react';
import type { Project, Lang } from '../../types/index.js';

interface Props {
  projects: Pick<Project, '_id' | 'title' | 'titleEn' | 'slug' | 'category' | 'year' | 'shortDescription' | 'shortDescriptionEn' | 'coverImage' | 'tags'>[];
  lang?: Lang;
}

const categoryLabelsEs: Record<string, string> = {
  all: 'Todos',
  arquitectura: 'Arquitectura',
  robotica: 'Robótica',
  impresion3d: 'Impresión 3D',
  escultura: 'Escultura',
  docencia: 'Docencia',
};

const categoryLabelsEn: Record<string, string> = {
  all: 'All',
  arquitectura: 'Architecture',
  robotica: 'Robotics',
  impresion3d: '3D Printing',
  escultura: 'Sculpture',
  docencia: 'Teaching',
};

function buildImageUrl(coverImage: Project['coverImage'] | undefined): string | null {
  if (!coverImage?.asset?._ref) return null;
  // Parse Sanity asset reference: image-abc123-800x600-jpg
  const ref = coverImage.asset._ref;
  const parts = ref.replace('image-', '').split('-');
  const ext = parts.pop();
  const id = parts.join('-');
  return `https://cdn.sanity.io/images/zoh6ht03/production/${id}.${ext}?w=800&h=600&fit=crop`;
}

export default function CategoryFilter({ projects, lang = 'es' }: Props) {
  const [active, setActive] = useState('all');
  const [animating, setAnimating] = useState(false);

  const categoryLabels = lang === 'en' ? categoryLabelsEn : categoryLabelsEs;
  const categories = ['all', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filtered = active === 'all' ? projects : projects.filter((p) => p.category === active);

  function handleCategoryChange(cat: string) {
    if (cat === active) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(cat);
      setAnimating(false);
    }, 200);
  }

  return (
    <div>
      {/* Filter buttons — full viewport width, centered on same axis as nav */}
      <div className="w-full flex flex-wrap justify-center gap-3" style={{ marginBottom: '2rem' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            style={{ padding: '0.25rem 0.9rem' }}
            className={[
              'text-[10px] font-medium tracking-widest uppercase rounded-full transition-all duration-200',
              active === cat
                ? 'bg-[#0A0A0A] text-white'
                : 'bg-[#0A0A0A] text-white/50 hover:text-white',
            ].join(' ')}
          >
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {/* Projects grid — same bounds as the header line (px-6 lg:px-12 + 80% centered) */}
      <div className="px-6 lg:px-12">
        <div style={{ width: '80%', margin: '0 auto' }}>
      <div
        className={[
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-200',
          animating ? 'opacity-0' : 'opacity-100',
        ].join(' ')}
      >
        {filtered.map((project) => {
          const imageUrl = buildImageUrl(project.coverImage);
          const title = (lang === 'en' && project.titleEn) ? project.titleEn : project.title;
          const shortDesc = (lang === 'en' && project.shortDescriptionEn) ? project.shortDescriptionEn : project.shortDescription;
          const href = lang === 'en' ? `/en/projects/${project.slug.current}` : `/proyectos/${project.slug.current}`;

          return (
            <a
              key={project._id}
              href={href}
              className="group block relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F8F7F5] cursor-pointer"
            >
              {/* Image */}
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-[#1a1a1a]" />
              )}

              {/* Default: pill near bottom */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center transition-opacity duration-300 group-hover:opacity-0">
                <span style={{ padding: '0.375rem 1rem' }} className="bg-black/40 backdrop-blur-md text-white text-[10px] font-medium tracking-widest uppercase rounded-full">
                  {title}
                </span>
              </div>

              {/* Hover: dark overlay + description */}
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-8">
                <span style={{ padding: '0.375rem 1rem' }} className="bg-black/50 backdrop-blur-md text-white text-[10px] font-medium tracking-widest uppercase rounded-full">
                  {title}
                </span>
                {shortDesc && (
                  <p className="text-white/80 text-xs text-center leading-relaxed line-clamp-3">{shortDesc}</p>
                )}
              </div>
            </a>
          );
        })}
      </div>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-[#6B6B6B]">
          <p className="text-lg font-light">{lang === 'en' ? 'No projects in this category yet.' : 'No hay proyectos en esta categoría aún.'}</p>
        </div>
      )}
    </div>
  );
}
