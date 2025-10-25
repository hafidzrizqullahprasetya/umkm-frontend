import { DetailPage } from "@/modules/DetailPage/detailPage";

export default async function Page({ params }: { params: { slug: string } }) {
  // Nanti tinggal ganti dengan actual API call:
  // const data = await fetch(`${process.env.API_URL}/umkm/${params.slug}`).then(r => r.json());

  return <DetailPage slug={params.slug} />;
}