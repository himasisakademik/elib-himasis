"use client";
import React, { useState } from "react";
import Turnstile from 'react-turnstile';

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  nim: "",
  angkatan: "",
  message: "",
};

interface InputFieldProps {
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  maxLength?: number;
  icon: React.ReactNode;
}

// Dynamic import SweetAlert2 only when needed
const showAlert = async (options: Record<string, unknown>) => {
  const Swal = (await import("sweetalert2")).default;
  return Swal.fire(options);
};

const InputField: React.FC<InputFieldProps> = ({ type, name, value, onChange, placeholder, maxLength, icon }) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors duration-300 z-10">
      {icon}
    </div>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      className="w-full pl-12 pr-4 py-4 bg-slate-900/50 backdrop-blur-sm border border-slate-600/40 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/60 transition-all duration-300 hover:shadow-xl hover:border-slate-500/60 font-medium text-slate-200 placeholder:text-slate-400 hover:bg-slate-900/70"
      required
    />
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
    
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-focus-within:opacity-100 blur-sm scale-105 transition-all duration-300 pointer-events-none -z-10" />
  </div>
);

const ContactForm = () => {
  const [form, setForm] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!token) {
      await showAlert({
        title: "Error!",
        text: "Harap selesaikan CAPTCHA.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          popup: 'backdrop-blur-sm bg-white/95',
          confirmButton: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
        }
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Gagal mengirim pesan");
      }

      setForm(initialFormData);
      setToken(null);
      await showAlert({
        title: "Success!",
        text: "Pesan Anda telah berhasil dikirim, Terima Kasih!",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          popup: 'backdrop-blur-sm bg-white/95',
          confirmButton: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
        }
      });
    } catch (error) {
      console.error("Error submitting the form:", error);
      await showAlert({
        title: "Error!",
        text: "Terjadi kesalahan saat mengirim pesan Anda. Silakan coba lagi.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          popup: 'backdrop-blur-sm bg-white/95',
          confirmButton: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/40 rounded-full animate-ping" />
        <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400/40 rounded-full animate-ping delay-700" />
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-pink-400/40 rounded-full animate-ping delay-1000" />
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-blue-400/40 rounded-full animate-ping delay-300" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-xl rounded-2xl mb-6 shadow-lg shadow-blue-500/10 border border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <svg className="w-10 h-10 text-blue-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-3">
            Hubungi Kami
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Bagikan pemikiran, saran, atau umpan balik Anda tentang E-Library Himasis. Kami sangat senang mendengarnya dari Anda!
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-xl scale-105" />
          
          <div className="relative bg-slate-800/40 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/20 border border-slate-700/50 p-8 md:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-3xl" />
            
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nama Lengkap Anda"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
              />
              
              <InputField
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email.anda@domain.com"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Nomor Telepon"
                maxLength={13}
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
              />
              
              <InputField
                type="text"
                name="nim"
                value={form.nim}
                onChange={handleChange}
                placeholder="NIM"
                maxLength={10}
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>}
              />
              
              <InputField
                type="text"
                name="angkatan"
                value={form.angkatan}
                onChange={handleChange}
                placeholder="Angkatan"
                maxLength={4}
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
              />
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-400 transition-colors duration-300 z-10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Bagikan pemikiran, saran, atau umpan balik Anda..."
                rows={5}
                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 backdrop-blur-sm border border-slate-600/40 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/60 transition-all duration-300 hover:shadow-xl hover:border-slate-500/60 font-medium text-slate-200 placeholder:text-slate-400 resize-none hover:bg-slate-900/70"
                required
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-focus-within:opacity-100 blur-sm scale-105 transition-all duration-300 pointer-events-none -z-10" />
            </div>

            <div className="flex justify-center">
              <div className="p-4 bg-slate-900/30 backdrop-blur-sm rounded-2xl border border-slate-600/30 shadow-lg">
                <Turnstile
                  sitekey="0x4AAAAAABA_QX1KUCNORRU0"
                  onVerify={(token: string) => setToken(token)}
                  className="turnstile-captcha"
                />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white font-semibold rounded-2xl shadow-2xl border border-blue-500/20 hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  <div className="relative flex items-center justify-center space-x-3">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Mengirim...</span>
                      </>
                    ) : (
                      <>
                        <span>Kirim Pesan</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            Privasi Anda penting bagi kami. Semua informasi akan ditangani secara aman.
          </p>
        </div>
      </div>
      </div>
    </section>
  );
};

export default ContactForm;