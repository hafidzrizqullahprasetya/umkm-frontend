import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { getAllUmkm } from "@/lib/data-fetch";
import UmkmClientPageSimple from "@/components/features/umkm";
import Header from "@/components/shared/header/Header";
import ProductTour from "@/components/tour/ProductTour";

export default async function Page() {
  const session = await getServerSession(authConfig);

  // Fetch UMKM data from API
  const allUmkm = await getAllUmkm();

  // Get unique categories
  const allCategories = Array.from(
    new Set(allUmkm.map((u: any) => u.type).filter(Boolean)),
  ).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={session?.user}
        allUmkm={allUmkm}
        allCategories={allCategories}
      />

      {/* Main Content - UMKM Listings */}
      <main className="pt-32">
        {" "}
        {/* Add padding to account for fixed header + breadcrumb */}
        <UmkmClientPageSimple allUmkm={allUmkm} />
      </main>

      {/* Product Tour for first-time visitors - DISABLED */}
      {/* <ProductTour /> */}
    </div>
  );
}
