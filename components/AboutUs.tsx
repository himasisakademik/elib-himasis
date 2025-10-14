import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const textArray = [
  {
    title: "Academic Excellence",
    text: "Himasis E-library is dedicated to providing access to premium academic resources for students in the Himasis community.",
    icon: "🎓"
  },
  {
    title: "Learning Innovation",
    text: "We strive to make learning easier and more efficient with our vast collection of educational materials and cutting-edge technology.",
    icon: "💡"
  },
  {
    title: "Community Growth",
    text: "Empowering students through collaborative learning and comprehensive digital resources that foster academic success.",
    icon: "🌱"
  }
];

const stats = [
  { number: "30+", label: "Digital Books", icon: "📚" },
  { number: "500+", label: "Research Papers", icon: "📄" },
  { number: "100+", label: "Active Users", icon: "👥" },
  { number: "20", label: "Study Categories", icon: "🗂️" }
];

const AboutUs = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % textArray.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/30 rounded-full animate-ping" />
        <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-purple-400/30 rounded-full animate-ping delay-700" />
        <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-ping delay-1000" />
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-blue-400/30 rounded-full animate-ping delay-300" />
      </div>

      <motion.div
        className="max-w-7xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <motion.div className="text-center mb-20" variants={itemVariants}>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-xl rounded-2xl mb-8 shadow-lg shadow-blue-500/10 border border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <svg className="w-10 h-10 text-blue-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-6">
            About Us
          </h2>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Discover the story behind Himasis E-Library and our mission to revolutionize digital learning
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            className="relative group"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl scale-110 opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
            
            <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-2xl">
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src="/akademik.jpeg"
                  alt="Himasis E-Library - Academic Excellence"
                  width={600}
                  height={500}
                  className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                  priority
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg border border-white/20">
                Since 2024
              </div>
            </div>
          </motion.div>

          <motion.div className="space-y-8" variants={itemVariants}>
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={textIndex}
                  initial={{ opacity: 0, x: 50, rotateX: -10 }}
                  animate={{ opacity: 1, x: 0, rotateX: 0 }}
                  exit={{ opacity: 0, x: -50, rotateX: 10 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="relative"
                >
                  <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-xl">
                    <div className="flex items-center mb-6">
                      <div className="text-3xl mr-4 bg-gradient-to-br from-blue-500/20 to-purple-600/20 p-3 rounded-2xl backdrop-blur-sm border border-white/10">
                        {textArray[textIndex].icon}
                      </div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                        {textArray[textIndex].title}
                      </h3>
                    </div>
                    
                    <p className="text-lg text-slate-300 leading-relaxed">
                      {textArray[textIndex].text}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center space-x-2 mt-6">
              {textArray.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === textIndex
                      ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-500'
                      : 'w-2 bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div className="mt-20" variants={itemVariants}>
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/30 shadow-2xl">
            <h3 className="text-2xl font-bold text-center mb-12 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              Our Impact in Numbers
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-slate-600/30 group-hover:border-blue-500/30 transition-all duration-300 group-hover:scale-105">
                    <div className="text-3xl mb-3">{stat.icon}</div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm text-slate-400 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div className="mt-20 text-center" variants={itemVariants}>
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-slate-800/40 via-slate-800/60 to-slate-800/40 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50 shadow-2xl">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-sm">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            
            <blockquote className="text-2xl text-slate-200 leading-relaxed italic mb-6">
              "Empowering minds, enriching futures. We believe that access to quality education should be limitless, 
              and every student deserves the tools to achieve their academic dreams."
            </blockquote>
            
            <div className="text-blue-400 font-semibold">
              — Himasis E-Library Team
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutUs;