export type Lang = 'es' | 'en';

export interface SanityImageAsset {
  _type: 'image';
  asset: { _ref: string; _type: 'reference' };
  alt?: string;
  caption?: string;
}

export interface SanityVideoAsset {
  _type: 'file';
  asset: { _ref: string; _type: 'reference'; url: string };
  caption?: string;
}

export type GalleryItem =
  | (SanityImageAsset & { _key: string })
  | (SanityVideoAsset & { _key: string });

export interface GallerySection {
  _key: string;
  sectionTitle?: string;
  images: (SanityImageAsset & { _key: string })[];
}

export interface Project {
  _id: string;
  title: string;
  titleEn?: string;
  slug: { current: string };
  category: 'arquitectura' | 'robotica' | 'impresion3d';
  year: number;
  shortDescription: string;
  shortDescriptionEn?: string;
  description: PortableTextBlock[];
  descriptionEn?: PortableTextBlock[];
  coverImage: SanityImageAsset;
  gallery: GallerySection[];
  featured: boolean;
  tags: string[];
  authors?: string[];
  course?: string;
  institution?: string;
  moreInfoUrl?: string;
  heroVideo?: { asset: { url: string } };
  videoUrl?: string;
}

export interface Education {
  _key: string;
  degree: string;
  degreeEn?: string;
  institution: string;
  year: number;
  description?: string;
  descriptionEn?: string;
}

export interface SocialLink {
  _key: string;
  platform: string;
  url: string;
}

export interface About {
  _id: string;
  bio: PortableTextBlock[];
  bioEn?: PortableTextBlock[];
  photo: SanityImageAsset;
  education: Education[];
  skills: string[];
  socialLinks: SocialLink[];
}

export interface CVEducacion {
  _key: string;
  yearStart?: string;
  yearEnd?: string;
  program: string;
  institution: string;
  city?: string;
  description?: string;
}

export interface CVExperiencia {
  _key: string;
  year?: string;
  company: string;
  role: string;
}

export interface CV {
  _id: string;
  educacion: CVEducacion[];
  experiencia: CVExperiencia[];
  habilidades: string[];
  intereses: string[];
  lastUpdated: string;
}

export type PortableTextBlock = {
  _type: string;
  _key: string;
  [key: string]: unknown;
};
