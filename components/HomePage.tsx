"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";  
import Logo from "../public/akademik_home.png";  

const HomePage = () => {
  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 1000,
      easing: "ease-in-out",
      delay: 100,
    });
  }, []);

  const scrollToCategory = () => {
    const element = document.getElementById("category-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
  className="bg-gray-900 text-white flex items-center justify-center h-screen min-h-screen w-full px-6 overflow-hidden"
  data-aos="fade-up"
  data-aos-duration="1500"
>
  <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl">
        {/* Bagian Kiri: Judul, Deskripsi, Button */}
        <div className="text-center md:text-left space-y-6">
          <h1 className="mt-35 text-6xl font-extrabold leading-tight tracking-wide font-[--font-geist-sans]">
            E - Library
          </h1>
          <p className="text-2xl max-w-2xl mx-auto md:mx-0 leading-relaxed font-[--font-geist-sans]">
            E Library adalah media platform yang ditujukan untuk membantu mahasiswa Sistem Informasi Industri Otomotif.
          </p>
          <button
            onClick={scrollToCategory}
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white text-lg font-semibold px-10 py-5 rounded-xl shadow-lg transition-all hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500 font-[--font-geist-sans]"
          >
            Mulai
          </button>
        </div>

        {/* Bagian Kanan: Gambar */}
        <div className="flex justify-center md:justify-end mt-10 md:mt-0">
          <Image
            src={Logo}  
            alt="E-Library Illustration"
            className="rounded-xl shadow-2xl w-[450px] h-auto"  
            data-aos="fade-left"  
            data-aos-duration="2000" 
          />
        </div>
      </div>
    </section>
  );
};

export default HomePage;
