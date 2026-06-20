"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UploadMateri from "@/components/UploadMateri";
import { SUPER_ADMIN_EMAIL } from "@/lib/admin-config";

const UploadMateriPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.email) {
      router.push("/login");
      return;
    }

    if (session.user.email === SUPER_ADMIN_EMAIL) {
      router.replace("/admin/dashboard");
      return;
    }

    const checkAuthorization = async () => {
      try {
        const response = await fetch("/api/allowed-emails");
        if (!response.ok) {
          router.push("/unauthorized");
          return;
        }
        const allowedEmails: string[] = await response.json();

        if (allowedEmails.includes(session.user!.email!)) {
          setIsAuthorized(true);
        } else {
          router.push("/unauthorized");
        }
      } catch (error) {
        console.error("Error checking authorization:", error);
        router.push("/unauthorized");
      }
    };

    checkAuthorization();
  }, [session, status, router]);

  if (status === "loading" || isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl">Memuat, harap tunggu...</p>
        </div>
      </div>
    );
  }

  if (isAuthorized) {
    return <UploadMateri session={session} />;
  }

  return null;
};

export default UploadMateriPage;
