// components/Header.tsx
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link for navigation

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <header
      className="bg-primary text-white p-8 text-center relative"
      data-aos="fade-down"
      data-aos-duration="1000"
    >
      {/* Logo and Title */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-23 h-23 rounded-full border-4 border-primary overflow-hidden">
                        <Image
                          src="/himasis.jpeg"
                          alt="Logo"
                          width={150}
                          height={150}
                          className="object-cover"
                        />
                        </div>  
          <h1 className="text-4xl font-extrabold font-[--font-geist-sans]">E-Library Himasis</h1>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden" onClick={toggleMenu}>
          <button className="text-white">
            <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"} text-2xl`}></i>
          </button>
        </div>
      </div>

      {/* Navbar Menu for Desktop */}
      <nav className="hidden lg:flex justify-center space-x-8 mt-8 text-lg">
        <Link href="/" className="hover:text-primary transition-colors font-[--font-geist-sans]">Home</Link>
        <Link href="https://himasis.org/artikel" className="hover:text-primary transition-colors font-[--font-geist-sans]">Artikel</Link>
        <Link href="https://himasis.org/galeri" className="hover:text-primary transition-colors font-[--font-geist-sans]">Galery</Link>
        <Link href="https://himasis.org/about-us" className="hover:text-primary transition-colors font-[--font-geist-sans]">About Us</Link>
        <Link href="https://open.spotify.com/show/4YU5UODxxEuHwg8DlYYMA0" className="hover:text-primary transition-colors font-[--font-geist-sans]">Podcast</Link>
        <Link href="https://himasis.org/mata-kuliah-sistem-informasi-industri-otomotif-stmi-jakarta" className="hover:text-primary transition-colors font-[--font-geist-sans]">Mata Kuliah</Link>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-16 left-0 w-full bg-white text-primary p-6 shadow-md transition-all transform ${
          menuOpen ? "translate-y-0 opacity-100" : "-translate-y-96 opacity-0"
        }`}
      >
        <nav className="flex flex-col space-y-6 text-lg">
          <Link href="/" className="hover:text-primary transition-colors font-[--font-geist-sans]">Home</Link>
          <Link href="https://himasis.org/artikel" className="hover:text-primary transition-colors font-[--font-geist-sans]">Artikel</Link>
          <Link href="https://himasis.org/galeri" className="hover:text-primary transition-colors font-[--font-geist-sans]">Galery</Link>
          <Link href="https://himasis.org/about-us" className="hover:text-primary transition-colors font-[--font-geist-sans]">About Us</Link>
          <Link href="https://open.spotify.com/show/4YU5UODxxEuHwg8DlYYMA0" className="hover:text-primary transition-colors font-[--font-geist-sans]">Podcast</Link>
          <Link href="https://himasis.org/mata-kuliah-sistem-informasi-industri-otomotif-stmi-jakarta" className="hover:text-primary transition-colors font-[--font-geist-sans]">Mata Kuliah</Link>
  
          {/* Dropdown Menu for Mobile */}
          <div className="relative">
            <button
              className="w-full text-left p-2 hover:text-primary transition-colors"
              onClick={toggleDropdown}
            >
              More Options
            </button>
            {/* Make sure the dropdown is absolutely positioned */}
            {dropdownOpen && (
              <div className="absolute left-0 w-full bg-white text-primary shadow-md mt-2 py-2">
                <Link
                  href="/another-page"
                  className="block px-4 py-2 hover:bg-gray-200"
                >
                  Another Page
                </Link>
                <Link
                  href="/contact-us"
                  className="block px-4 py-2 hover:bg-gray-200"
                >
                  Contact Us
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
