import { getAllUmkm } from "@/lib/data-fetch";
import UMKMDetailPage from "@/components/features/umkm/UMKMDetailPage";

export default async function Page({ params }: { params: { slug: string } }) {
  const allUmkm = await getAllUmkm();
  const umkm = allUmkm.find((u) => u.id === parseInt(params.slug));

  if (!umkm) {
    return <div>UMKM tidak ditemukan</div>;
  }

  return <UMKMDetailPage umkm={umkm} />;
}