import { DetailPage } from "@/modules/DetailPage/detailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Await params terlebih dahulu
  const { slug } = await params;

  // Nanti tinggal ganti dengan actual API call:
  // const data = await fetch(`${process.env.API_URL}/umkm/${slug}`).then(r => r.json());

  return <DetailPage slug={slug} />;
}
