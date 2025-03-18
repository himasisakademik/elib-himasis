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
      className="bg-gray-900 text-white flex items-center justify-center py-24 px-4"
      data-aos="fade-up"
      data-aos-duration="1500"
    >
      <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8 w-full max-w-screen-xl">
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight leading-tight">
            E - Library
          </h1>
          <p className="text-xl mb-6 max-w-lg mx-auto md:mx-0">
            E Library adalah media platform yang ditujukan untuk membantu mahasiswa Sistem informasi Industri Otomotif
          </p>
          <button
            onClick={scrollToCategory}
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-500"
          >
            Mulai
          </button>
        </div>

        <div className="flex justify-center md:justify-end">
          <Image
            src={Logo}  
            alt="Logo"
            className="rounded-xl shadow-2xl"
            width={300}  
            height={300} 
            data-aos="fade-left"  
            data-aos-duration="2000" 
          />
        </div>
      </div>
    </section>
  );
};

export default HomePage;
