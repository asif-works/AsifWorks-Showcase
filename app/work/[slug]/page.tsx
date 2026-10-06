import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS } from "@/lib/data";
import CaseStudy from "@/components/work/CaseStudy";
import Footer from "@/components/sections/Footer";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};
  const title = `${project.title} — ${project.kind}`;
  return {
    title,
    description: project.description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title, description: project.description, url: `/work/${project.slug}` },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = PROJECTS[index];
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  return (
    <>
      <CaseStudy project={project} next={next} />
      <Footer />
    </>
  );
}
