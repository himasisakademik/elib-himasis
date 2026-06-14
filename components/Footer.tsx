"use client";

import React, { useState, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Twitter, Facebook, Instagram, Youtube, Music2 as Tiktok, Podcast as Spotify, ArrowUp, Heart } from "lucide-react";

interface NavigationLink {
    href: string;
    label: string;
    description: string;
    icon: string;
}

interface SocialLink {
    href: string;
    icon: React.ComponentType<any>;
    label: string;
    color: string;
    hoverColor: string;
}

const navigationLinks: NavigationLink[] = [
    {
        href: "/library/search/matkul",
        label: "Ikhtisar Materi Kuliah",
        description: "Materi Kuliah",
        icon: "📚",
    },
    // {
    //   href: "/library/search/jurnal",
    //   label: "Jurnal",
    //   description: "Research Journals",
    //   icon: "📄"
    // },
    // {
    //   href: "/library/search/tugas-akhir",
    //   label: "Tugas Akhir",
    //   description: "Final Projects",
    //   icon: "🎓"
    // },
    {
        href: "/library/search/umum",
        label: "Umum",
        description: "Sumber Umum",
        icon: "📖",
    },
];

const socialLinks: SocialLink[] = [
    {
        href: "https://x.com/himasis_stmi?t=K1Gn17jjkm8VtfHCLH53Qw&s=09",
        icon: Twitter,
        label: "Twitter",
        color: "hover:text-blue-400",
        hoverColor: "group-hover:shadow-blue-400/25",
    },
    {
        href: "https://www.facebook.com/share/1ALjti5EsX/",
        icon: Facebook,
        label: "Facebook",
        color: "hover:text-blue-600",
        hoverColor: "group-hover:shadow-blue-600/25",
    },
    {
        href: "https://www.instagram.com/himasis.poltekstmi?igsh=eWV2ZGIwbXo3b294",
        icon: Instagram,
        label: "Instagram",
        color: "hover:text-pink-500",
        hoverColor: "group-hover:shadow-pink-500/25",
    },
    {
        href: "https://youtube.com/@himasis?si=KgqAFCt6tLWudTd2",
        icon: Youtube,
        label: "YouTube",
        color: "hover:text-red-500",
        hoverColor: "group-hover:shadow-red-500/25",
    },
    {
        href: "https://www.tiktok.com/@himasis.poltekstmi",
        icon: Tiktok,
        label: "TikTok",
        color: "hover:text-gray-800",
        hoverColor: "group-hover:shadow-gray-800/25",
    },
];

const Footer: React.FC = () => {
    const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
    const controls = useAnimation();
    const ref = React.useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (inView) {
            controls.start("visible");
        }
    }, [controls, inView]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                duration: 0.6,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
            },
        },
    };

    return (
        <>
            <footer ref={ref} className="relative bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-tl from-indigo-500/5 via-cyan-500/5 to-transparent rounded-full blur-3xl" />

                    <div className="absolute inset-0 opacity-5">
                        <div
                            className="h-full w-full"
                            style={{
                                backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
                                backgroundSize: "40px 40px",
                            }}
                        />
                    </div>
                </div>

                <motion.div
                    className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20"
                    variants={containerVariants}
                    initial="hidden"
                    animate={controls}
                >
                    <motion.div className="mb-12 sm:mb-16 text-center" variants={itemVariants}>
                        <div className="flex justify-center mb-6 sm:mb-8">
                            <motion.div
                                className="relative group"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl sm:rounded-3xl blur-lg sm:blur-xl group-hover:blur-xl sm:group-hover:blur-2xl transition-all duration-500" />
                                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10 shadow-2xl">
                                    <Image
                                        src="/himasis.png"
                                        alt="HIMASIS - Himpunan Mahasiswa Sistem Informasi"
                                        width={80}
                                        height={80}
                                        className="sm:w-[120px] sm:h-[120px] object-cover rounded-xl sm:rounded-2xl transition-all duration-500 group-hover:brightness-110"
                                    />
                                </div>
                            </motion.div>
                        </div>

                        <motion.h2
                            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            HIMASIS
                        </motion.h2>

                        <motion.p
                            className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Memberdayakan generasi profesional sistem informasi berikutnya melalui inovasi, kolaborasi, dan keunggulan.
                        </motion.p>
                    </motion.div>

                    <div className="space-y-12 sm:space-y-16">
                        <motion.div variants={itemVariants} className="w-full">
                            <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 flex items-center gap-3 justify-center sm:justify-start">
                                <span className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                                Tautan Cepat
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {navigationLinks.map((link, index) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                    >
                                        <Link
                                            href={link.href}
                                            className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                                        >
                                            <div className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                                {link.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium sm:font-semibold text-white group-hover:text-blue-300 transition-colors duration-300 text-sm sm:text-base truncate">
                                                    {link.label}
                                                </div>
                                                <div className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 truncate">
                                                    {link.description}
                                                </div>
                                            </div>
                                            <motion.div
                                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0"
                                                whileHover={{ x: 5 }}
                                            >
                                                <svg
                                                    className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </motion.div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="w-full">
                            <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 flex items-center gap-3 justify-center sm:justify-start">
                                <span className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                                Terhubung Dengan Kami
                            </h3>

                            <div className="flex flex-wrap gap-3 sm:gap-4 mb-8 justify-center">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={social.href}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`group w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110 ${social.hoverColor} shadow-lg hover:shadow-xl`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.6 + index * 0.1 }}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        title={social.label}
                                    >
                                        <social.icon
                                            className={`text-base sm:text-lg text-gray-400 ${social.color} transition-colors duration-300`}
                                        />
                                    </motion.a>
                                ))}
                            </div>

                            <motion.div
                                className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-500/20"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center">Tetap Terkini</h4>
                                <p className="text-sm text-gray-300 text-center mb-4 sm:mb-6 px-2">
                                    Dapatkan pembaruan dan sumber daya terbaru yang dikirimkan ke kotak masuk Anda.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="email"
                                        placeholder="Masukkan email Anda"
                                        className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-sm sm:text-base"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg sm:rounded-xl font-medium sm:font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base whitespace-nowrap"
                                    >
                                        Berlangganan
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    <motion.div className="pt-8 sm:pt-12 mt-12 sm:mt-16 border-t border-white/10" variants={itemVariants}>
                        <div className="flex flex-col items-center gap-4 sm:gap-6">
                            <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                                <p className="text-sm sm:text-base text-gray-300 mb-2">
                                    &copy; {new Date().getFullYear()} HIMASIS. Hak cipta dilindungi undang-undang.
                                </p>
                                <p className="text-xs sm:text-sm text-gray-400 flex items-center justify-center gap-2">
                                    Dibuat dengan <Heart className="text-red-500 animate-pulse w-4 h-4 sm:w-5 sm:h-5 inline mx-1" /> oleh Tim HIMASIS
                                </p>
                            </motion.div>

                            <motion.div
                                className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.1 }}
                            >
                                <span>Pengembangan Oleh Akademik Himasis</span>
                                <span className="w-1 h-1 bg-gray-500 rounded-full" />
                                <span>Hi Verse Platform</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.button
                    onClick={scrollToTop}
                    className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center group ${
                        showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
                    }`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{
                        opacity: showScrollTop ? 1 : 0,
                        y: showScrollTop ? 0 : 100,
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <ArrowUp className="text-sm sm:text-base group-hover:animate-bounce" />
                </motion.button>
            </footer>
        </>
    );
};

export default Footer;
