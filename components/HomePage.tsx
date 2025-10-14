"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Logo from "../public/akademik_home.png";

import Particles from "react-tsparticles";
import type { Container, Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

const heroContent = [
  {
    badge: "🚀 Innovation Hub",
    title: "Transform Your Learning Journey",
    subtitle: "Hi Verse revolutionizes digital education with cutting-edge technology, providing seamless access to academic resources that adapt to your learning style.",
    gradient: "from-violet-600 via-purple-600 to-indigo-600",
    accent: "from-violet-400 to-purple-400",
    color: "from-violet-500/20 to-indigo-500/20",
    border: "border-violet-500/30"
  },
  {
    badge: "📚 Knowledge Vault",
    title: "Unlimited Academic Universe",
    subtitle: "Discover an infinite library of books, journals, and research materials. Your academic excellence starts here with our comprehensive digital collection.",
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    accent: "from-emerald-400 to-teal-400",
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/30"
  },
  {
    badge: "⚡ Smart Learning",
    title: "Learn Anywhere, Anytime",
    subtitle: "Experience the future of flexible education. Our AI-powered platform adapts to your schedule and learning preferences for maximum efficiency.",
    gradient: "from-orange-600 via-amber-600 to-yellow-600",
    accent: "from-orange-400 to-amber-400",
    color: "from-orange-500/20 to-yellow-500/20",
    border: "border-orange-500/30"
  },
];

const achievements = [
  { 
    icon: "📖", 
    count: "100+", 
    label: "Digital Books",
    description: "Curated collection",
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30"
  },
  { 
    icon: "📄", 
    count: "100+", 
    label: "Research Papers",
    description: "Academic journals",
    color: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/30"
  },
  { 
    icon: "🎓", 
    count: "300+", 
    label: "Active Students",
    description: "Growing community",
    color: "from-green-500/20 to-emerald-500/20",
    border: "border-green-500/30"
  },
  { 
    icon: "⚡", 
    count: "24/7", 
    label: "Availability",
    description: "Always accessible",
    color: "from-orange-500/20 to-red-500/20",
    border: "border-orange-500/30"
  },
];

const HomePage = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = async (container: Container | undefined) => {
    console.log("Particles system initialized:", container);
  };

  useEffect(() => {
    setIsVisible(true);
    const contentRotation = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroContent.length);
    }, 7000);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearInterval(contentRotation);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
        duration: 0.8,
      },
    },
  };

  const elementAnimation = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.9,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const floatingAnimation = {
    initial: { y: 0, rotate: 0 },
    animate: {
      y: [-8, 8, -8],
      rotate: [-1, 1, -1],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white overflow-hidden">
      <Particles
        id="particles-background"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 120,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "attract" },
              onClick: { enable: true, mode: "repulse" },
              resize: true,
            },
            modes: {
              attract: { distance: 200, duration: 0.4, speed: 1 },
              repulse: { distance: 100, duration: 0.4 },
            },
          },
          particles: {
            color: { value: ["#6366f1", "#8b5cf6", "#ec4899", "#06b6d4"] },
            links: {
              color: "#ffffff",
              distance: 120,
              enable: true,
              opacity: 0.08,
              width: 0.8,
            },
            move: {
              enable: true,
              outModes: { default: "out" },
              random: true,
              speed: 0.8,
              straight: false,
            },
            number: { density: { enable: true }, value: 80 },
            opacity: {
              value: { min: 0.1, max: 0.6 },
              animation: { enable: true, speed: 1, minimumValue: 0.05 },
            },
            shape: { type: "circle" },
            size: {
              value: { min: 0.5, max: 3 },
              animation: { enable: true, speed: 3, minimumValue: 0.1 },
            },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 z-0"
      />

      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full opacity-30 blur-3xl transition-all duration-[3s] ease-out"
          style={{
            background: `radial-gradient(circle, ${heroContent[currentIndex].gradient.replace('from-', '').replace('via-', ', ').replace('to-', ', ')} 0%, transparent 70%)`,
            left: `${mousePosition.x * 0.01}%`,
            top: `${mousePosition.y * 0.01}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div className="absolute -top-1/2 -right-1/2 w-[600px] h-[600px] bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-teal-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        className="relative z-10 flex flex-col xl:flex-row items-center justify-between min-h-screen max-w-8xl mx-auto px-6 lg:px-12 py-20"
        variants={containerAnimation}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <motion.section
          className="flex-1 max-w-3xl space-y-12 text-center xl:text-left"
          variants={elementAnimation}
        >
          <div className="space-y-6">
            <motion.div
              className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl rounded-full px-6 py-3 border border-white/10 shadow-2xl"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="relative">
                <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-ping" />
                <div className="absolute inset-0 w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full" />
              </div>
              <span className="text-sm font-semibold tracking-wide text-gray-300">
                HIMASIS DIGITAL LIBRARY
              </span>
            </motion.div>

            <motion.h1
              className="text-7xl xl:text-8xl font-black tracking-tight leading-[0.9]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            >
              <span className="block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                Hi
              </span>
              <span className={`block bg-gradient-to-r ${heroContent[currentIndex].gradient} bg-clip-text text-transparent transition-all duration-1000`}>
                Verse
              </span>
            </motion.h1>
          </div>

          <div className="space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 40, rotateX: -10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -40, rotateX: 10 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="space-y-6"
              >
                <motion.div
                  className={`inline-flex items-center gap-2 bg-gradient-to-r ${heroContent[currentIndex].color} backdrop-blur-sm rounded-full px-5 py-2 border ${heroContent[currentIndex].border}`}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-sm font-medium">
                    {heroContent[currentIndex].badge}
                  </span>
                </motion.div>

                <h2 className={`text-4xl xl:text-5xl font-bold bg-gradient-to-r ${heroContent[currentIndex].accent} bg-clip-text text-transparent leading-tight`}>
                  {heroContent[currentIndex].title}
                </h2>

                <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                  {heroContent[currentIndex].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center xl:justify-start gap-3">
              {heroContent.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-700 ${
                    index === currentIndex
                      ? `w-16 bg-gradient-to-r ${heroContent[currentIndex].gradient}`
                      : "w-6 bg-gray-600 hover:bg-gray-500"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
            </div>
          </div>

          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-r ${heroContent[currentIndex].gradient} rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500`} />
              
              <motion.button
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/library/search/matkul")}
                className={`relative group bg-gradient-to-r ${heroContent[currentIndex].gradient} text-white text-lg font-bold px-10 py-5 rounded-2xl shadow-2xl border border-white/20 transition-all duration-500 overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <div className="relative flex items-center gap-4">
                  <span className="tracking-wide">Start Your Journey</span>
                  <motion.svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </div>
              </motion.button>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {achievements.map((stat, index) => (
                <motion.div
                  key={index}
                  className={`bg-gradient-to-br ${stat.color} backdrop-blur-xl rounded-2xl p-5 border ${stat.border} shadow-xl hover:shadow-2xl group cursor-pointer`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <div className="text-center space-y-3">
                    <motion.div
                      className="text-3xl group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {stat.icon}
                    </motion.div>
                    <div>
                      <div className="text-2xl font-black text-white mb-1">
                        {stat.count}
                      </div>
                      <div className="text-sm font-semibold text-gray-300">
                        {stat.label}
                      </div>
                      <div className="text-xs text-gray-400">
                        {stat.description}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          className="flex-1 flex justify-center xl:justify-end max-w-2xl"
          variants={elementAnimation}
        >
          <motion.div
            className="relative group"
            variants={floatingAnimation}
            initial="initial"
            animate="animate"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${heroContent[currentIndex].gradient} rounded-[2rem] blur-3xl scale-110 opacity-40 group-hover:opacity-60 transition-all duration-700`} />
            
            <div className="relative bg-white/5 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 shadow-2xl">
              <motion.div
                whileHover={{ scale: 1.02, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Image
                  src={Logo}
                  alt="Hi Verse - Next Generation Digital Learning Platform"
                  className="rounded-2xl w-full max-w-[500px] h-auto transition-all duration-700 group-hover:brightness-110"
                  priority
                  width={600}
                  height={480}
                />
              </motion.div>
              
              <motion.div
                className="absolute -top-6 -right-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-3 rounded-2xl font-bold shadow-xl"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🚀</span>
                  <span className="text-sm">Latest</span>
                </div>
              </motion.div>
              
              <motion.div
                className="absolute -bottom-6 -left-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-3 rounded-2xl font-bold shadow-xl"
                initial={{ scale: 0, rotate: 10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">📚</span>
                  <span className="text-sm">Free Access</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-gray-400"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <span className="text-sm font-medium tracking-wide">Discover More</span>
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-8 h-12 border-2 border-gray-400/30 rounded-full flex justify-center pt-3"
        >
          <div className={`w-1.5 h-4 bg-gradient-to-b ${heroContent[currentIndex].accent} rounded-full`} />
        </motion.div>
      </motion.div>
    </main>
  );
};

export default HomePage;