import { redirect } from 'next/navigation';

const Page = ({ params }: any): JSX.Element => {
  redirect(`/download/go/${params.slug}`);
};

export default Page;