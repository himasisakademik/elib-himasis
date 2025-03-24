"use client";

import { useRouter } from "next/navigation";

const Unauthorized = () => {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Akses Ditolak 🚫</h1>
      <p className="text-lg mb-6">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      <button
        onClick={() => router.push("/login")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300"
      >
        Kembali ke Beranda
      </button>
    </div>
  );
};

export default Unauthorized;
