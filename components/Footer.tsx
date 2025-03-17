// app/components/Footer.tsx
import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 px-6 shadow-lg border-primary">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo on the left */}
        <div className="flex items-center">
          <div className="w-24 h-24 rounded-full border-4 border-primary overflow-hidden">
            <Image
              src="/himasis.jpeg"
              alt="Logo"
              width={150}
              height={150}
              className="object-cover"
            />
          </div>
        </div>

        {/* Footer content on the right */}
        <div className="text-right">
          {/* Copyright text */}
          <p className="text-sm text-gray-400 font-[--font-geist-sans]">
            &copy; 2025 Himasis. All rights reserved.
          </p>

          {/* Social media icons */}
          <div className="flex justify-end space-x-6 mt-2">
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
