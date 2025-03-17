// app/page.tsx
"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../components/Header";
import CategoryList from "../components/CategoryList";
import AboutUs from "../components/AboutUs";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";

const Page = () => {
  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 1000,
      easing: "ease-in-out",
      delay: 100,
    });
  }, []);

  // You can pass a dynamic category if needed, otherwise use a fixed one like "matkul"
  const category = "matkul";  // Example: You can dynamically change this value

  return (
    <div className="bg-gray-900 text-white">
      {/* Header */}
      <Header />

      {/* About Us Section */}
      <section
        className="bg-gray-800 py-16"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <AboutUs />
      </section>

      {/* Category Section */}
      <section
        className="bg-gray-800 py-16"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        {/* Pass the category as a prop to CategoryList */}
        <CategoryList category={category} />
      </section>

      {/* Contact Form Section */}
      <section
        className="bg-gray-800"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <ContactForm />
      </section>

    <section
    className="bg-gray-800"
    data-aos="fade-up"
    data-aos-duration="1000"
    >
      {/* Footer */}
      <Footer />
    </section>
    </div>
  );
};

export default Page;
