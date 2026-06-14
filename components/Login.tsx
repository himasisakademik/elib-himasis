"use client";

import Footer from "./Footer";
import Header from "./Header";
import { useState } from "react";
import { handleGoogleSignIn } from "@/lib/auth-actions";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Lightweight CSS particles replacing heavy particles.js CDN injection */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: i % 3 === 0 ? '#6366f1' : i % 3 === 1 ? '#8b5cf6' : '#a78bfa',
              opacity: Math.random() * 0.4 + 0.1,
              animationDuration: `${Math.random() * 4 + 3}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-transparent z-10" />
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-slate-900/50 to-transparent z-10" />
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-slate-900/50 to-transparent z-10" />
      
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse z-10" />
      <div className="absolute bottom-32 right-10 w-48 h-48 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000 z-10" />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-full blur-2xl animate-pulse delay-500 z-10" />
      
      <div className="relative z-20 flex flex-col min-h-screen">
        <Header />
        
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-2xl shadow-blue-500/25">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                  Selamat Datang Kembali
                </span>
              </h1>
              
              <p className="text-slate-400 text-lg leading-relaxed">
                Masuk ke platform pembelajaran digital terdepan
              </p>
              
              <div className="flex items-center justify-center space-x-2 mt-6">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
                <span className="text-slate-500 text-sm font-medium px-3">HIVERSE</span>
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              
              <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500" />
                
                <div className="p-8 md:p-10">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-3">
                      Selamat Datang Sobat Akademik!
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                      Gunakan akun Google Anda untuk mengakses ribuan materi pembelajaran berkualitas
                    </p>
                  </div>

                  <form action={async (formData) => {
                      setIsLoading(true);
                      try {
                        await handleGoogleSignIn(formData);
                      } catch (error) {
                        console.error('Login failed:', error);
                        setIsLoading(false); 
                      }
                  }}>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group relative w-full bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 disabled:from-slate-800 disabled:to-slate-800 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25 disabled:transform-none disabled:shadow-none border border-slate-600/50 hover:border-blue-500/50 disabled:border-slate-700"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-blue-500/10 rounded-2xl transition-all duration-500" />
                      
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                            <span>Menghubungkan...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            <span className="text-lg">Lanjutkan dengan Google</span>
                          </>
                        )}
                      </span>
                    </button>
                  </form>

                  <div className="mt-8 pt-6 border-t border-slate-700/50">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="group">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-500/20 transition-colors duration-300">
                          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Akses Aman</p>
                      </div>
                      <div className="group">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-purple-500/20 transition-colors duration-300">
                          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Login Cepat</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-2 mt-8">
                    <div className="w-2 h-2 rounded-full bg-green-400 shadow-md shadow-green-400/50" />
                    <div className="w-2 h-2 rounded-full bg-blue-400 shadow-md shadow-blue-400/50" />
                    <div className="w-2 h-2 rounded-full bg-purple-400 shadow-md shadow-purple-400/50" />
                  </div>
                  
                  <p className="text-center text-xs text-slate-500 mt-3">
                    Sistem Siap
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-slate-500 text-sm">
                Dengan masuk, Anda menyetujui{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Syarat & Ketentuan
                </a>{' '}
                kami
              </p>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default Login;
