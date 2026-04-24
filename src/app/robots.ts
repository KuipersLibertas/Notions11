import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/user/',
          '/api/',
          '/create-new-link',
          '/manage-link',
          '/manage-subscription',
          '/prosignup',
          '/reset-password/',
          '/invalid-link',
          '/404',
        ],
      },
    ],
    sitemap: 'https://www.notions11.com/sitemap.xml',
  };
}
