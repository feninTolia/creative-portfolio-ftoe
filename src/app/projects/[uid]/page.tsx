import ContentBody from '@/components/ContentBody';
import { createClient } from '@/prismicio';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Params = { uid: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID('project', uid).catch(() => notFound());

  return <ContentBody page={page} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID('project', uid).catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType('project');

  return pages.map((page) => {
    return { uid: page.uid };
  });
}
