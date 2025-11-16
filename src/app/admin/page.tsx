import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/features/admin/AdminDashboard";

export default async function AdminPage() {
  const session = await getServerSession(authConfig);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Check role from session first (set by JWT callback in auth.ts)
  const userRole = (session.user as any)?.role;

  // If not administrator, redirect to home
  if (userRole !== "administrator") {
    redirect("/home");
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

  // Get full user data and include token from session
  const userResponse = await fetch(
    `${baseUrl}/user?email=${session.user.email}`,
    {
      cache: "no-store",
    }
  );

  let user: any = {
    email: session.user.email,
    role: "administrator",
    token: (session as any).token // Include token from session
  };

  if (userResponse.ok) {
    const userData = await userResponse.json();
    user = {
      ...userData.data,
      token: (session as any).token // Make sure token is included
    };
  }

  // Fetch all UMKM
  const umkmResponse = await fetch(`${baseUrl}/api/umkm`, {
    cache: "no-store",
  });
  const umkmData = await umkmResponse.json();
  const allUmkm = umkmData.data || [];

  // Fetch all users with authentication token
  let allUsers = [];
  try {
    const token = (session as any).token;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const usersResponse = await fetch(`${baseUrl}/user/all`, {
      cache: "no-store",
      headers: headers,
    });

    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      allUsers = usersData.data || [];
    } else {
      console.error("Failed to fetch users:", usersResponse.status, await usersResponse.text());
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }

  return <AdminDashboard user={user} allUmkm={allUmkm} allUsers={allUsers} />;
}
