"use client"; // Mark this file as a client component to enable hooks

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link for navigation

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <header className="bg-gray-900 text-white p-8 relative">
      {/* Logo and Title */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {/* Logo with a modern gradient border */}
            <Image
              src="/himasis.png"
              alt="Logo"
              width={90}
              height={120}
              className="object-cover"
            />
          <h1 className="text-4xl font-extrabold font-[--font-geist-sans]">E-Library Himasis</h1>
        </div>

        {/* Navbar Menu for Desktop (Aligned to the right) */}
        <nav className="hidden lg:flex ml-auto space-x-8 mt-8 text-lg">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/library/search/matkul" className="nav-link">Mata Kuliah</Link>
          <Link href="/library/search/jurnal" className="nav-link">Jurnal</Link>
          <Link href="/library/search/tugas-akhir" className="nav-link">Tugas Akhir</Link>
        </nav>

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden" onClick={toggleMenu}>
          <button className="text-white">
            <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"} text-2xl`}></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
