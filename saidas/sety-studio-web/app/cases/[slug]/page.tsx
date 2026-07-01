import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PROJECTS } from '@/lib/data';
import CasePage from '@/components/sections/CasePage';

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — Case Study | Sety Studio`,
    description: project.tagline,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();
  return <CasePage project={project} />;
}
