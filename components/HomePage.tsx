"use client";

import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Logo from "../public/akademik_home.png";

const textArray = [
  "E Library adalah media platform pembelajaran berbasis digital. Dirancang untuk membantu mahasiswa dalam mengakses referensi akademik dengan mudah.",
  "Temukan berbagai buku, jurnal, dan materi kuliah di E Library. Belajar jadi lebih efisien dengan akses tanpa batas.",
  "Dengan E Library, belajar kapan saja dan di mana saja jadi lebih fleksibel. Dapatkan sumber belajar terbaik untuk menunjang akademik Anda.",
];

const HomePage = () => {
  const router = useRouter();
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 1000,
      easing: "ease-in-out",
      delay: 100,
    });

    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % textArray.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
  className="bg-gray-900 text-white flex overflow-x-hidden flex-col items-center justify-center min-h-[90vh] w-full px-6 pt-24 pb-12"
  data-aos="fade-up"
  data-aos-duration="1500"
>

<div className="flex mt-28 md:mt-20 flex-col md:flex-row items-center justify-between w-full max-w-7xl">

        {/* Bagian Kiri: Judul, Deskripsi, Button */}
        <div className="text-center md:text-left space-y-6">
          <h1 className="mt-35 text-6xl font-extrabold leading-tight tracking-wide font-[--font-geist-sans]">
            E - Library
          </h1>

          {/* Animasi teks dengan Framer Motion */}
          <motion.p
            key={textIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="text-2xl max-w-2xl mx-auto md:mx-0 leading-relaxed font-[--font-geist-sans]"
          >
            {textArray[textIndex]}
          </motion.p>

          {/* Button Mulai */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/library/search/matkul")}
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white text-lg font-semibold px-10 py-5 rounded-xl shadow-lg transition-all hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500 font-[--font-geist-sans]"
          >
            Mulai
          </motion.button>
        </div>

        <motion.div
  initial={{ opacity: 0, x: 50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 1 }}
  className="flex justify-center md:justify-end w-full mt-10 md:mt-0"
>
  <Image
    src={Logo}
    alt="E-Library Illustration"
    className="rounded-xl shadow-2xl w-[90%] max-w-[350px] md:max-w-[450px] h-auto"
    data-aos="fade-left"
    data-aos-duration="2000"
  />
</motion.div>

      </div>
    </section>
  );
};

export default HomePage;
