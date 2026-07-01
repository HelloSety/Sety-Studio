import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { vehicles } from "@/lib/data";
import VehicleDetail from "./VehicleDetail";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return vehicles.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const v = vehicles.find((v) => v.slug === slug);
  if (!v) return {};
  return {
    title: `${v.name} ${v.version}`,
    description: v.description,
    openGraph: {
      title: `${v.name} ${v.version} | Alex Messias Consultor GWM`,
      description: v.description,
      images: [{ url: v.hero }],
    },
  };
}

export default async function VehiclePage({ params }: Props) {
  const { slug } = await params;
  const vehicle = vehicles.find((v) => v.slug === slug);
  if (!vehicle) notFound();
  return <VehicleDetail vehicle={vehicle} />;
}
