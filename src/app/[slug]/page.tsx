import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const Page = ({ params }: any): JSX.Element => {
  redirect(`/download/go/${params.slug}`);
};

export default Page;
