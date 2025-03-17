import React from 'react';
import Image from 'next/image';

const AboutUs = () => {
  return (
    <section className="bg-secondary p-12">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-primary mb-6 font-[--font-geist-sans]">About Us</h2>
        <div className="flex flex-col md:flex-row items-center justify-center space-x-8">
          <div className="relative mb-8 md:mb-0 w-full md:w-1/2">
            <Image
              src="/akademik.jpeg" // Replace with your image path
              alt="About Us Image"
              width={500} // Define width of the image
              height={500} // Define height of the image
              className="rounded-lg border-4 border-primary shadow-xl transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
            />
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-lg text-gray-600 font-[--font-geist-sans]">
              Himasis E-library is dedicated to providing access to academic resources for students in the Himasis community. We strive to
              make learning easier and more efficient with our vast collection of educational materials.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
