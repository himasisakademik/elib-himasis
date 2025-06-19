"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";  
import Header from "../components/Header";
import CategoryList from "../components/CategoryList";
import AboutUs from "../components/AboutUs";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import HomePage from "../components/HomePage";  

const Page = () => {
  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 1000,
      easing: "ease-in-out",
      delay: 100,
    });

    // Pastikan navigasi tidak ketiban oleh efek AOS
    document.body.style.overflow = "visible";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

<<<<<<< HEAD
  const category = "matkul";  

  return (
    <div className="bg-gray-900 text-white">
=======
  const category = "terbaru";  

  return (
    <div className="bg-gray-900 text-white min-h-screen w-full overflow-x-hidden">
>>>>>>> 73990efc66e917b917af19d197cdce76cc2c1087
      {/* Header tetap di atas */}
      <Header />

      {/* Wrapper untuk mengatasi AOS overlap */}
<<<<<<< HEAD
      <div className="bg-gray-900 text-white">
=======
      <div className="w-full">
>>>>>>> 73990efc66e917b917af19d197cdce76cc2c1087

        {/* HomePage Section */}
        <HomePage /> 

        {/* About Us Section */}
        <section className="bg-gray-800 py-16" data-aos="fade-up" data-aos-duration="1000">
          <AboutUs />
        </section>

        {/* Category Section */}
        <section className="bg-gray-800 py-16" data-aos="fade-up" data-aos-duration="1000">
          <CategoryList category={category} />
        </section>

        {/* Contact Form Section */}
        <section className="bg-gray-800" data-aos="fade-up" data-aos-duration="1000">
          <ContactForm />
        </section>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Page;
