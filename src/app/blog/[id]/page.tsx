import React from 'react';
import MainLayout from '@/layouts/Main';
import Script from 'next/script';

import { default as BlogDetailView } from '@/views/Blog/Detail';
import { redirect } from 'next/navigation';
import { IPost } from '@/types';
import { Metadata } from 'next';

const SITE_URL = 'https://www.notions11.com';

const getPost = async (id: string): Promise<IPost|null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_GHOST_SITE_URL}/ghost/api/content/posts/slug/${id}/?key=${process.env.NEXT_PUBLIC_GHOST_API_KEY}&include=tags,authors`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    const json = await response.json();
    if (json.posts.length === 0) {
      redirect('/');
    }

    return json.posts[0];
  } catch (error) {
    console.log(error);
  }
  return null;
};

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post: IPost|null = await getPost(params.id);
  const canonicalUrl = `${SITE_URL}/blog/${post?.slug ?? params.id}`;

  return {
    title: post?.title ?? 'Blog',
    description: post?.custom_excerpt ?? undefined,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'article',
      siteName: 'Notions11',
      url: canonicalUrl,
      title: post?.title ?? 'Notions11 Blog',
      description: post?.custom_excerpt ?? undefined,
      images: post?.feature_image
        ? [{ url: post.feature_image, width: 1200, height: 630 }]
        : undefined,
      publishedTime: post?.published_at ?? undefined,
      modifiedTime: post?.updated_at ?? undefined,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@Notions_11',
      title: post?.title ?? 'Notions11 Blog',
      description: post?.custom_excerpt ?? undefined,
      images: post?.feature_image ? [post.feature_image] : undefined,
    },
  };
}

const BlogDetail = async ({ params }: { params: { id: string } }): Promise<JSX.Element> => {
  if (!params.id) {
    redirect('/');
  }

  const post: IPost|null = await getPost(params.id);
  const canonicalUrl = `${SITE_URL}/blog/${post?.slug ?? params.id}`;

  const jsonLd = post ? {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.custom_excerpt,
    image: post.feature_image,
    url: canonicalUrl,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Organization',
      name: 'Notions11',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Notions11',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/images/newlogo3.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
  } : null;

  return (
    <MainLayout>
      {jsonLd && (
        <Script
          id="json-ld-blog"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {post && <BlogDetailView post={post} />}
    </MainLayout>
  );
};

export default BlogDetail;
