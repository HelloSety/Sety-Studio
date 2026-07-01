import type { MetadataRoute } from "next";
import { vehicles } from "@/lib/data";

export const dynamic = "force-static";

const base = "https://alexmessias.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const vehicleUrls = vehicles.map((v) => ({
    url: `${base}/veiculos/${v.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...vehicleUrls,
  ];
}
