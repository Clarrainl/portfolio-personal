import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageAsset, Project, About, CV } from '../types/index.js';

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

export async function sanityFetch<T>(query: string, params?: Record<string, unknown>): Promise<T> {
  return sanityClient.fetch<T>(query, params ?? {});
}

// ── GROQ Queries ──

export async function getProjects(): Promise<Project[]> {
  return sanityFetch<Project[]>(`
    *[_type == "project"] | order(year desc) {
      _id, title, titleEn, slug, category, year,
      shortDescription, shortDescriptionEn,
      coverImage, featured, tags
    }
  `);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return sanityFetch<Project[]>(`
    *[_type == "project" && featured == true] | order(year desc) [0...3] {
      _id, title, titleEn, slug, category, year,
      shortDescription, shortDescriptionEn,
      coverImage, tags
    }
  `);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return sanityFetch<Project | null>(`
    *[_type == "project" && slug.current == $slug][0] {
      _id, title, titleEn, slug, category, year,
      shortDescription, shortDescriptionEn,
      description, descriptionEn,
      coverImage, gallery, featured, tags,
      authors, course, institution, moreInfoUrl,
      heroVideo{ asset->{ url } }
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
      _id, sections, lastUpdated
    }
  `);
}
