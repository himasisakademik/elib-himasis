import { auth } from "@/auth";
import AdminDashboard from "../../../components/AdminDashboard";
import { redirect } from "next/navigation";

const SUPER_ADMIN_EMAIL = 'nabilzihni08@gmail.com';

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session || session.user?.email !== SUPER_ADMIN_EMAIL) {
    redirect("/unauthorized");
  }

  return <AdminDashboard session={session} />;
}
