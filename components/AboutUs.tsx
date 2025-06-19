import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const textArray = [
  "Himasis E-library is dedicated to providing access to academic resources for students in the Himasis community.",
  "We strive to make learning easier and more efficient with our vast collection of educational materials.",
];

const AboutUs = () => {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % textArray.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-secondary p-12">
      <div className="max-w-4xl mx-auto text-center">
        {/* Judul */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-semibold text-primary mb-6 font-[--font-geist-sans]"
        >
          About Us
        </motion.h2>

        <div className="flex flex-col md:flex-row items-center justify-center space-x-8">
          {/* Gambar dengan efek animasi */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="relative mb-8 md:mb-0 w-full md:w-1/2"
          >
            <Image
              src="/akademik.jpeg"
              alt="About Us Image"
              width={500}
              height={500}
              className="rounded-lg border-4 border-primary shadow-xl transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
            />
          </motion.div>

          {/* Teks dengan efek animasi */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="w-full md:w-1/2"
          >
            <motion.p
              key={textIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="text-2xl text-gray-600 font-[--font-geist-sans]"
            >
              {textArray[textIndex]}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
