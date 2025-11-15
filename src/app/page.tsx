import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { getAllUmkm } from "@/lib/data-fetch";
import UmkmClientPageSimple from "@/components/features/umkm";
import Header from '@/components/shared/header/Header';

export default async function Page() {
  const session = await getServerSession(authConfig);
  const allUmkm = await getAllUmkm();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={session?.user} />

      {/* Main Content - UMKM Listings */}
      <main className="mt-20"> {/* Add margin to account for fixed header */}
        <UmkmClientPageSimple allUmkm={allUmkm} />
      </main>
    </div>
  );
}