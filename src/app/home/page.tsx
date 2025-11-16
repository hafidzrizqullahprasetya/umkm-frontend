import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserUmkm } from "@/lib/data-fetch";
import DashboardPage from "@/components/features/dashboard/DashboardPage";

export default async function HomePage() {
  const session = await getServerSession(authConfig);

  // Redirect to home if not logged in
  if (!session?.user) {
    redirect("/");
  }

  // Check role from session first (set by JWT callback in auth.ts)
  const userRole = (session.user as any)?.role;

  // If role is administrator, redirect to admin dashboard
  if (userRole === "administrator") {
    redirect("/admin");
  }

  // Get user email
  const userEmail = session.user.email || "";

  // Fetch user data to get whatsapp
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  let userWhatsapp = "";

  try {
    const userResponse = await fetch(`${baseUrl}/user?email=${userEmail}`, {
      cache: "no-store",
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      userWhatsapp = userData.data?.whatsapp || "";
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }

  // Get user's UMKM data (only for admin_umkm users)
  const token = (session as any)?.token;
  const userUmkm = userEmail && token ? await getUserUmkm(userEmail, token) : [];

  return (
    <DashboardPage
      userUmkm={userUmkm}
      userName={session.user.name || session.user.email || "User"}
      userEmail={userEmail}
      userWhatsapp={userWhatsapp}
    />
  );
}
