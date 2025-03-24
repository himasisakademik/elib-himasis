"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import UploadMateri from "@/components/UploadMateri";
import { motion } from "framer-motion";

const allowedEmails = ["nabilzihni08@gmail.com"];

const UploadMateriPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Tunggu session selesai
    if (!session?.user) {
      router.push("/login"); // Redirect jika tidak login
    } else if (!allowedEmails.includes(session.user.email || "")) {
      router.push("/unauthorized"); // Redirect jika email tidak diizinkan
    }
  }, [session, status, router]);

  // Loading Screen UI - Animasi Modern
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full"
          ></motion.div>
          <p className="text-white text-lg font-semibold mt-4">Loading, please wait...</p>
        </motion.div>
      </div>
    );
  }

  return (
      <UploadMateri session={session} />
  );
};

export default UploadMateriPage;
