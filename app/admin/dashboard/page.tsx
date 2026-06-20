import { auth } from "@/auth";
import AdminDashboard from "../../../components/AdminDashboard";
import { redirect } from "next/navigation";
import { SUPER_ADMIN_EMAIL } from "@/lib/admin-config";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session || session.user?.email !== SUPER_ADMIN_EMAIL) {
    redirect("/unauthorized");
  }

  return <AdminDashboard session={session} />;
}
