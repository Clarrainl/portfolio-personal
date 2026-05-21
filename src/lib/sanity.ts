import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageAsset, Project, About, CV } from '../types/index.js';
import { autoTranslate, autoTranslateBlocks } from './translate.js';

export const sanityClient = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID || 'zoh6ht03',
  dataset: import.meta.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: import.meta.env.PROD,
  token: import.meta.env.SANITY_API_TOKEN,
});

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageAsset) {
  return builder.image(source);
}

// Returns original URL for animated GIFs; transformed CDN URL for everything else.
export function coverUrl(source: SanityImageAsset | undefined, width = 800, height = 600): string | null {
  if (!source?.asset?._ref) return null;
  const ref = source.asset._ref; // image-{id}-{w}x{h}-{format}
  if (ref.endsWith('-gif')) {
    const id = ref.replace(/^image-/, '').replace(/-gif$/, '');
    const { projectId, dataset } = sanityClient.config();
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.gif`;
  }
  return builder.image(source).width(width).height(height).fit('crop').url();
}

export async function sanityFetch<T>(query: string, params?: Record<string, unknown>): Promise<T> {
  return sanityClient.fetch<T>(query, params ?? {});
}

// ── GROQ Queries ──

export async function getProjects(): Promise<Project[]> {
  return sanityFetch<Project[]>(`
    *[_type == "project"] | order(year desc) {
      _id, title, titleEn, slug, category, year,
      shortDescription, shortDescriptionEn,
      coverImage, featured, tags, faculty
    }
  `);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return sanityFetch<Project[]>(`
    *[_type == "project" && featured == true] | order(year desc) [0...3] {
      _id, title, titleEn, slug, category, year,
      shortDescription, shortDescriptionEn,
      coverImage, tags, faculty
    }
  `);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return sanityFetch<Project | null>(`
    *[_type == "project" && slug.current == $slug][0] {
      _id, title, titleEn, slug, category, year,
      shortDescription, shortDescriptionEn,
      description, descriptionEn,
      coverImage, featured, tags,
      gallery[]{ _key, sectionTitle, images[]{ _key, _type, asset, alt, caption } },
      authors, faculty, course, institution, moreInfoUrl,
      heroVideo{ asset->{ url } },
      videoUrl
    }
  `, { slug });
}

export async function getAbout(): Promise<About | null> {
  return sanityFetch<About | null>(`
    *[_type == "about"][0] {
      _id, bio, bioEn, photo, education, skills, socialLinks
    }
  `);
}

export async function getCV(): Promise<CV | null> {
  return sanityFetch<CV | null>(`
    *[_type == "cv"][0] {
      _id, educacion, experiencia, habilidades, intereses, lastUpdated
    }
  `);
}

// ── English auto-translated versions ──

async function withProjectTranslation(p: Project): Promise<Project> {
  return {
    ...p,
    titleEn: p.titleEn || await autoTranslate(p.title || ''),
    shortDescriptionEn: p.shortDescriptionEn || await autoTranslate(p.shortDescription || ''),
  };
}

export async function getProjectsEn(): Promise<Project[]> {
  const projects = await getProjects();
  return Promise.all(projects.map(withProjectTranslation));
}

export async function getFeaturedProjectsEn(): Promise<Project[]> {
  const projects = await getFeaturedProjects();
  return Promise.all(projects.map(withProjectTranslation));
}

export async function getProjectBySlugEn(slug: string): Promise<Project | null> {
  const project = await getProjectBySlug(slug);
  if (!project) return null;
  return {
    ...project,
    titleEn: project.titleEn || await autoTranslate(project.title || ''),
    shortDescriptionEn: project.shortDescriptionEn || await autoTranslate(project.shortDescription || ''),
    descriptionEn: project.descriptionEn?.length
      ? project.descriptionEn
      : (await autoTranslateBlocks(project.description || [])) as typeof project.descriptionEn,
  };
}

export async function getAboutEn(): Promise<About | null> {
  const about = await getAbout();
  if (!about) return null;
  const education = about.education
    ? await Promise.all(
        about.education.map(async (item) => ({
          ...item,
          degreeEn: item.degreeEn || await autoTranslate(item.degree || ''),
          descriptionEn: item.descriptionEn || await autoTranslate(item.description || ''),
        }))
      )
    : about.education;
  return {
    ...about,
    bioEn: about.bioEn?.length
      ? about.bioEn
      : (await autoTranslateBlocks(about.bio || [])) as typeof about.bioEn,
    education,
  };
}

export async function getCVEn(): Promise<CV | null> {
  const cv = await getCV();
  if (!cv) return null;
  const educacion = cv.educacion
    ? await Promise.all(
        cv.educacion.map(async (e) => ({
          ...e,
          program:     await autoTranslate(e.program     || '', true),
          city:        await autoTranslate(e.city        || '', true),
          description: await autoTranslate(e.description || '', true),
        }))
      )
    : cv.educacion;
  const experiencia = cv.experiencia
    ? await Promise.all(
        cv.experiencia.map(async (e) => ({
          ...e,
          role: await autoTranslate(e.role || '', true),
        }))
      )
    : cv.experiencia;
  const habilidades = cv.habilidades
    ? await Promise.all(cv.habilidades.map((h) => autoTranslate(h, true)))
    : cv.habilidades;
  const intereses = cv.intereses
    ? await Promise.all(cv.intereses.map((i) => autoTranslate(i, true)))
    : cv.intereses;
  return { ...cv, educacion, experiencia, habilidades, intereses };
}
