import { useState } from 'react';
import type { Project } from '../../types/index.js';

interface Props {
  projects: Pick<Project, '_id' | 'title' | 'slug' | 'category' | 'year' | 'shortDescription' | 'coverImage' | 'tags'>[];
}

const categoryLabels: Record<string, string> = {
  all: 'Todos',
  arquitectura: 'Arquitectura',
  robotica: 'Robótica',
  impresion3d: 'Impresión 3D',
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

export default function CategoryFilter({ projects }: Props) {
  const [active, setActive] = useState('all');
  const [animating, setAnimating] = useState(false);

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
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={[
              'px-5 py-2 text-sm font-medium tracking-wide transition-all duration-200 border',
              active === cat
                ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                : 'bg-transparent text-[#6B6B6B] border-[#E5E2DD] hover:border-[#0A0A0A] hover:text-[#0A0A0A]',
            ].join(' ')}
          >
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {/* Projects grid */}
      <div
        className={[
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-200',
          animating ? 'opacity-0' : 'opacity-100',
        ].join(' ')}
      >
        {filtered.map((project) => {
          const imageUrl = buildImageUrl(project.coverImage);

          return (
            <a
              key={project._id}
              href={`/proyectos/${project.slug.current}`}
              className="group block overflow-hidden border border-[#E5E2DD] transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#F8F7F5]">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-[#F8F7F5] flex items-center justify-center">
                    <span className="text-[#6B6B6B] text-sm">Sin imagen</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-end p-5">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                    <p className="text-white/70 text-xs tracking-widest uppercase mb-1">
                      {categoryLabels[project.category] || project.category}
                    </p>
                    <p className="text-white font-serif text-xl font-light">{project.title}</p>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 bg-white">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-medium text-[#0A0A0A] leading-tight">{project.title}</h3>
                  <span className="text-xs text-[#6B6B6B] shrink-0">{project.year}</span>
                </div>
                <p className="text-xs text-[#6B6B6B] mt-1 tracking-wider uppercase">
                  {categoryLabels[project.category] || project.category}
                </p>
                {project.shortDescription && (
                  <p className="text-sm text-[#6B6B6B] mt-2 line-clamp-2">{project.shortDescription}</p>
                )}
              </div>
            </a>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-[#6B6B6B]">
          <p className="text-lg font-light">No hay proyectos en esta categoría aún.</p>
        </div>
      )}
    </div>
  );
}
