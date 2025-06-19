import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; 
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaSpotify } from 'react-icons/fa'; 

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 px-6 shadow-lg">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
            <Image
              src="/himasis.png"
              alt="Logo"
              width={90}
              height={90}
              className="object-cover"
            />
        </div>

        <div className="w-full md:w-auto flex flex-wrap justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link href="/library/search/matkul" className="text-sm text-gray-400 hover:text-primary transition-colors font-[--font-geist-sans]">
              Mata Kuliah
            </Link>
            <Link href="/library/search/jurnal" className="text-sm text-gray-400 hover:text-primary transition-colors font-[--font-geist-sans]">
              Jurnal
            </Link>
            <Link href="/library/search/tugas-akhir" className="text-sm text-gray-400 hover:text-primary transition-colors font-[--font-geist-sans]">
              Tugas Akhir
            </Link>
            <Link href="/library/search/umum" className="text-sm text-gray-400 hover:text-primary transition-colors font-[--font-geist-sans]">
              Umum
            </Link>
          </div>

          <div className="mb-30 flex flex-wrap space-x-6 mt-4 justify-between items-center md:w-auto">
            <a
              href="https://x.com/himasis_stmi?t=K1Gn17jjkm8VtfHCLH53Qw&s=09"
              target="_blank"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <FaTwitter className="text-xl" />
            </a>
            <a
              href="https://www.facebook.com/share/1ALjti5EsX/"
              target="_blank"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <FaFacebook className="text-xl" />
            </a>
            <a
              href="https://www.instagram.com/himasis.poltekstmi?igsh=eWV2ZGIwbXo3b294"
              target="_blank"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <FaInstagram className="text-xl" />
            </a>
            <a
              href="https://youtube.com/@himasis?si=KgqAFCt6tLWudTd2"
              target="_blank"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <FaYoutube className="text-xl" />
            </a>
            <a
              href="https://www.tiktok.com/@himasis.poltekstmi"
              target="_blank"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <FaTiktok className="text-xl" />
            </a>
            <a
              href="https://open.spotify.com/show/0lS1dBg7hpyo1wTVCiikxa?si=sa5QhNBcT26s8v15MKH7YQ"
              target="_blank"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <FaSpotify className="text-xl" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-400 font-[--font-geist-sans]">
        <p>&copy; 2025 Himasis. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
