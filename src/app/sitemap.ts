import { MetadataRoute } from 'next';

const SITE_URL = 'https://www.notions11.com';

const staticRoutes: MetadataRoute.Sitemap = [
  { url: `${SITE_URL}/`,               lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
  { url: `${SITE_URL}/about-us`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${SITE_URL}/blog`,           lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
  { url: `${SITE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  { url: `${SITE_URL}/terms-of-service`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
];

interface GhostPost {
  slug: string;
  updated_at: string;
}

async function getBlogPosts(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_GHOST_SITE_URL}/ghost/api/content/posts/?key=${process.env.NEXT_PUBLIC_GHOST_API_KEY}&filter=tag:Notions11&fields=slug,updated_at&limit=all`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const json = await res.json();
    return (json.posts as GhostPost[]).map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await getBlogPosts();
  return [...staticRoutes, ...blogPosts];
}
