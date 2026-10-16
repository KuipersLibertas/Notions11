import React from 'react';
import type { Metadata } from 'next';
import MainLayout from '@/layouts/Main';

import { default as BlogOverviewView } from '@/views/Blog';
import posts from '@/lib/blog/posts';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Guides, tips, and updates on protecting your Notion links — learn how to add passwords, set expiry dates, track link analytics, and more.',
  alternates: { canonical: 'https://www.notions11.com/blog' },
  openGraph: {
    url: 'https://www.notions11.com/blog',
    title: 'Blog — Notions11',
    description:
      'Guides and tips on securing Notion links with passwords, expiry limits, and download analytics.',
  },
};

const BlogOverview = (): JSX.Element => {
  return (
    <MainLayout>
      <BlogOverviewView postList={posts} />
    </MainLayout>
  );
};

export default BlogOverview;
