import { getAllUmkm } from "@/lib/data-fetch";
import UmkmClientPageSimple from "@/components/features/umkm";

export default async function Page() {
  const allUmkm = await getAllUmkm();

  return <UmkmClientPageSimple allUmkm={allUmkm} />;
}
