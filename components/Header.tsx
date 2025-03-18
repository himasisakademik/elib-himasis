"use client"; 

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link"; 

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <header className="bg-gray-900 text-white p-8 relative">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <Image
              src="/himasis.png"
              alt="Logo"
              width={90}
              height={120}
              className="object-cover"
            />
          <h1 className="text-4xl font-extrabold font-[--font-geist-sans]">E-Library Himasis</h1>
        </div>

        <nav className="hidden lg:flex ml-auto space-x-8 mt-8 text-lg">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/library/search/matkul" className="nav-link">Mata Kuliah</Link>
          <Link href="/library/search/jurnal" className="nav-link">Jurnal</Link>
          <Link href="/library/search/tugas-akhir" className="nav-link">Tugas Akhir</Link>
        </nav>

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
