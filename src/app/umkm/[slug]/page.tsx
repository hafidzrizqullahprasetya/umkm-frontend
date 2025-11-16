import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { getAllUmkm } from "@/lib/data-fetch";
import UMKMDetailPage from "@/components/features/umkm/UMKMDetailPage";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authConfig);

  // Await params in Next.js 15
  const { slug } = await params;

  // Fetch UMKM data from API
  const allUmkm = await getAllUmkm();

  const umkm = allUmkm.find((u: any) => u.id === parseInt(slug));

  if (!umkm) {
    return <div>UMKM tidak ditemukan</div>;
  }

  // Get unique categories
  const allCategories = Array.from(new Set(allUmkm.map((u: any) => u.type).filter(Boolean))).sort();

  return <UMKMDetailPage umkm={umkm} allUmkm={allUmkm} allCategories={allCategories} user={session?.user} />;
}