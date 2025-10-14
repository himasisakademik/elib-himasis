"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { LogOut, UserPlus, Trash2, ShieldCheck, Mail, Loader2, ListChecks } from "lucide-react";
import Swal from "sweetalert2";
import { AnimatePresence, motion } from "framer-motion";

export default function AdminDashboard({ session }: { session: any }) {
  const [allowedEmails, setAllowedEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAllowedEmails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/allowed-emails");
      const data = await response.json();
      if (response.ok) {
        setAllowedEmails(data);
      } else {
        throw new Error(data.error || "Failed to fetch emails");
      }
    } catch (error) {
      console.error("Failed to fetch emails:", error);
      Swal.fire({
        icon: 'error',
        title: 'Fetch Error',
        text: 'Could not load the list of authorized emails.',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllowedEmails();
  }, []);

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || isSubmitting) return;

    setIsSubmitting(true);
    try {
        const response = await fetch("/api/allowed-emails", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: newEmail }),
        });
        const result = await response.json();
        if (response.ok) {
            setAllowedEmails(prev => [...prev, newEmail].sort());
            setNewEmail("");
        } else {
            throw new Error(result.error || "Failed to add email");
        }
    } catch (error: any) {
        Swal.fire({
            icon: 'error',
            title: 'Submission Error',
            text: error.message,
            background: '#1e293b',
            color: '#fff',
            confirmButtonColor: '#ef4444'
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDeleteEmail = async (emailToDelete: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${emailToDelete}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#3b82f6',
      confirmButtonText: 'Yes, delete it!',
      background: '#1e293b',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch("/api/allowed-emails", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailToDelete }),
        });
        const res = await response.json();
        if (response.ok) {
            setAllowedEmails(prev => prev.filter(email => email !== emailToDelete));
        } else {
            throw new Error(res.error || 'Failed to delete email');
        }
      } catch (error: any) {
        Swal.fire({
            icon: 'error',
            title: 'Deletion Error',
            text: error.message,
            background: '#1e293b',
            color: '#fff',
            confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        <header className="flex flex-col sm:flex-row justify-between items-center mb-10 sm:mb-12">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full blur-sm opacity-75"></div>
                <Image src={session.user.image!} alt="Admin Avatar" width={60} height={60} className="relative rounded-full border-2 border-slate-700"/>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Admin Dashboard</h1>
              <p className="text-purple-400 flex items-center gap-2 text-sm sm:text-base"><ShieldCheck size={16}/> Super Admin Access</p>
            </div>
          </div>
          <button onClick={() => signOut()} className="group relative w-full sm:w-auto px-6 py-3 bg-slate-800/50 hover:bg-red-600/50 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 border border-slate-600/50 hover:border-red-500/50 flex items-center justify-center gap-3">
            <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="font-semibold">Sign Out</span>
          </button>
        </header>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl shadow-black/20 overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-blue-500"></div>

            <div className="p-6 sm:p-8 border-b border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg">
                    <UserPlus className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Add New Authorized Email</h2>
              </div>
              <form onSubmit={handleAddEmail} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="user@example.com"
                        className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 pl-10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-600 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg shadow-purple-500/20"
                >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18}/>}
                    <span>{isSubmitting ? 'Adding...' : 'Add Email'}</span>
                </button>
              </form>
            </div>

            <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg">
                        <ListChecks className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Authorized User List</h2>
                </div>
                {isLoading ? (
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex justify-between items-center bg-slate-800/50 p-4 rounded-lg animate-pulse">
                                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                                <div className="h-6 w-6 bg-slate-700 rounded-md"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <ul className="space-y-3">
                    <AnimatePresence>
                        {allowedEmails.length > 0 ? (
                            allowedEmails.map(email => (
                                <motion.li 
                                    key={email} 
                                    layout
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                                    className="flex justify-between items-center bg-slate-800/50 hover:bg-slate-700/50 p-4 rounded-lg transition-colors duration-300"
                                >
                                    <span className="flex items-center gap-3 text-slate-300 truncate">
                                        <Mail size={16} className="text-slate-400 flex-shrink-0"/>
                                        <span className="truncate">{email}</span>
                                    </span>
                                    <button onClick={() => handleDeleteEmail(email)} className="text-slate-500 hover:text-red-500 p-2 rounded-md transition-colors duration-300 flex-shrink-0">
                                        <Trash2 size={18}/>
                                    </button>
                                </motion.li>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-8 px-4"
                            >
                                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <ListChecks className="w-8 h-8 text-slate-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-300">No Authorized Emails</h3>
                                <p className="text-slate-500">Add an email above to grant access.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    </ul>
                )}
            </div>
        </motion.div>
      </div>
    </div>
  );
}

