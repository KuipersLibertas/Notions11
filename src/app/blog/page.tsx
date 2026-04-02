import React from 'react';
import MainLayout from '@/layouts/Main';

import { default as BlogOverviewView } from '@/views/Blog';
import { IPost } from '@/types';

const BlogOverview = async (): Promise<JSX.Element> => {
  let postList: IPost[] = [];
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_GHOST_SITE_URL}/ghost/api/content/posts/?key=${process.env.NEXT_PUBLIC_GHOST_API_KEY}&include=tags,authors&filter=tag:Notions11`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    const json = await response.json();
    console.log(json.posts);
    postList = json.posts;
  } catch (error) {
    console.log(error);
  }
  
  return (
    <MainLayout>
      <BlogOverviewView postList={postList} />
    </MainLayout>
  );
};

export default BlogOverview;