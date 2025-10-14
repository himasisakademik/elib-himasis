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

    document.body.style.overflow = "visible";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const category = "matkul";  

  return (
    <div className="bg-gray-900 text-white">
      <Header />

      <div className="bg-gray-900 text-white">

        <HomePage /> 

        <section className="py-16" data-aos="fade-up" data-aos-duration="1000">
          <AboutUs />
        </section>

        <section className="py-16" data-aos="fade-up" data-aos-duration="1000">
          <CategoryList category={category} />
        </section>

        <section data-aos="fade-up" data-aos-duration="1000">
          <ContactForm />
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Page;
