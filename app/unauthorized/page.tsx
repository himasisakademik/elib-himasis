"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Shield, Lock, Home, ArrowRight, AlertTriangle } from "lucide-react";

const Unauthorized = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoHome = () => {
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-orange-600/5 to-yellow-600/5" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-32 right-10 w-48 h-48 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-yellow-500/10 to-red-500/10 rounded-full blur-2xl animate-pulse delay-500" />

      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="flex-grow flex items-center justify-center px-4 py-12 mt-8">
          <div className="max-w-2xl mx-auto text-center">
            
            <div className="relative mb-12">
              <div className="inline-flex items-center justify-center w-32 h-32 relative">
                <div className="absolute inset-0 border-2 border-red-500/20 rounded-full animate-ping" />
                <div className="absolute inset-2 border-2 border-orange-500/30 rounded-full animate-pulse" />
                <div className="absolute inset-4 border-2 border-yellow-500/40 rounded-full animate-bounce" />
                
                <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/30">
                  <Shield className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold">
                  <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                    Akses Ditolak
                  </span>
                </h1>
                
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                </div>
              </div>

              <div className="max-w-lg mx-auto space-y-4">
                <p className="text-xl text-slate-300 leading-relaxed">
                  Anda tidak memiliki izin untuk mengakses halaman ini
                </p>
                <p className="text-slate-400 leading-relaxed">
                  Silakan login dengan akun yang memiliki akses atau kembali ke beranda untuk menjelajahi konten lainnya.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-12">
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 group hover:bg-slate-800/70 transition-all duration-300">
                  <Lock className="w-8 h-8 text-red-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-semibold text-white mb-2">Terlindungi</h3>
                  <p className="text-sm text-slate-400">Halaman ini dilindungi</p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 group hover:bg-slate-800/70 transition-all duration-300">
                  <Shield className="w-8 h-8 text-orange-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-semibold text-white mb-2">Aman</h3>
                  <p className="text-sm text-slate-400">Akses terbatas</p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 group hover:bg-slate-800/70 transition-all duration-300">
                  <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-semibold text-white mb-2">Terbatas</h3>
                  <p className="text-sm text-slate-400">Perlu otorisasi</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
                
                <button
                  onClick={handleLogin}
                  className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 min-w-[200px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <Lock className="w-5 h-5" />
                    <span>Login Sekarang</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>

                <button
                  onClick={handleGoHome}
                  className="group relative bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 border border-slate-600/50 hover:border-slate-500 min-w-[200px]"
                >
                  <div className="absolute inset-0 bg-slate-700/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <Home className="w-5 h-5" />
                    <span>Kembali ke Beranda</span>
                  </span>
                </button>
              </div>

              <div className="mt-12 p-6 bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl max-w-lg mx-auto">
                <h3 className="font-semibold text-white mb-2 flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  Butuh Bantuan?
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Jika Anda yakin seharusnya memiliki akses ke halaman ini, silakan hubungi administrator sistem atau coba login ulang.
                </p>
              </div>

              <div className="flex items-center justify-center space-x-2 mt-8">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse shadow-md shadow-red-400/50" />
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-75 shadow-md shadow-orange-400/50" />
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-150 shadow-md shadow-yellow-400/50" />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Unauthorized;