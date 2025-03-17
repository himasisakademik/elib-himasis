import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // For navigation links
import { FaTwitter, FaWhatsapp, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa'; // Import icons from react-icons

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 px-6 shadow-lg">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        {/* Logo on the left */}
        <div className="flex items-center mb-4 md:mb-0">
        <div className="w-24 h-24 rounded-full border-4 border-gradient-to-r from-teal-500 via-blue-500 to-purple-500 overflow-hidden">
            <Image
              src="/himasis.png"
              alt="Logo"
              width={150}
              height={150}
              className="object-cover"
            />
          </div>
        </div>

        {/* Footer Content on the Right */}
        <div className="w-full md:w-auto flex flex-wrap justify-between items-center">
          {/* Navigation Links */}
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link href="/category/matkul" className="text-sm text-gray-400 hover:text-primary transition-colors">
              Mata Kuliah
            </Link>
            <Link href="/category/jurnal" className="text-sm text-gray-400 hover:text-primary transition-colors">
              Jurnal
            </Link>
            <Link href="/category/tugas-akhir" className="text-sm text-gray-400 hover:text-primary transition-colors">
              Tugas Akhir
            </Link>
          </div>

          {/* Social Media Icons */}
          <div className="mb-30 flex flex-wrap space-x-6 mt-4 justify-between items-center md:w-auto">
            <a
              href="https://twitter.com"
              target="_blank"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <FaTwitter className="text-xl" />
            </a>
            <a
              href="https://wa.me"
              target="_blank"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <FaWhatsapp className="text-xl" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <FaInstagram className="text-xl" />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <FaYoutube className="text-xl" />
            </a>
            <a
              href="https://www.tiktok.com"
              target="_blank"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <FaTiktok className="text-xl" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-6 text-center text-sm text-gray-400">
        <p>&copy; 2025 Himasis. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
