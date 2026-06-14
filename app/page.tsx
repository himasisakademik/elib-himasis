"use client";

import React from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import CategoryList from "../components/CategoryList";
import AboutUs from "../components/AboutUs";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import HomePage from "../components/HomePage";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const Page = () => {
  const category = "matkul";

  return (
    <div className="bg-gray-900 text-white">
      <Header />

      <div className="bg-gray-900 text-white">
        <HomePage />

        <motion.section
          className="py-16"
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <AboutUs />
        </motion.section>

        <motion.section
          className="py-16"
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <CategoryList category={category} />
        </motion.section>

        <motion.section
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <ContactForm />
        </motion.section>
      </div>

      <Footer />
    </div>
  );
};

export default Page;
