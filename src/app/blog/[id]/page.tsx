import React from 'react';
import MainLayout from '@/layouts/Main';

import { default as BlogDetailView } from '@/views/Blog/Detail';
import { redirect } from 'next/navigation';
import { IPost } from '@/types';
import { Metadata } from 'next';

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

export async function generateMetadata({ params }: { params: { id: string } }) {
  const post: IPost|null = await getPost(params.id);
  
  const metadata: Metadata = {
    description: post?.custom_excerpt,
    twitter: {
      card: 'summary_large_image',
      title: `Notions11 - ${post?.title}`,
      description: post?.custom_excerpt,
      images: post?.feature_image,

    },
    openGraph: {
      type: 'website',
      siteName: 'Notions11',
      url: `${process.env.NEXT_PUBLIC_NOTIONS11_SITE_URL}/blog/detail/${post?.slug}`,
      title: `Notions11 - ${post?.title}`,
      description: post?.custom_excerpt,
      images: post?.feature_image,
    }
  };

  return metadata;
}

const BlogDetail = async ({ params }: { params: { id: string } }): Promise<JSX.Element> => {
  if (!params.id) {
    redirect('/');
  }

  const post: IPost|null = await getPost(params.id);
  
  return (
    <MainLayout>
      {post&&
        <BlogDetailView post={post} />
      }
    </MainLayout>
  );
};

export default BlogDetail;