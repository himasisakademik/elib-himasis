"use client";

import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Unauthorized = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="mt-20 flex-grow flex items-center justify-center px-6 py-12 text-center">
        <div className="max-w-lg mx-auto">
          <h1 className="text-5xl font-extrabold text-red-600 mb-6">
            Akses Ditolak ðŸš«
          </h1>
          <p className="text-lg mb-6 text-gray-300">
            Anda tidak memiliki izin untuk mengakses halaman ini. Mohon login untuk melanjutkan.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Kembali ke Beranda
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Unauthorized;
