"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="bg-gray-900 text-white p-4 fixed top-0 left-0 w-full z-50 shadow-lg">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image src="/himasis.png" alt="Logo" width={50} height={50} />
          <h1 className="text-xl font-bold font-[--font-geist-sans]">E-Library Himasis</h1>
        </div>

        {/* Navigation for Large Screens */}
        <nav className="hidden lg:flex space-x-6 text-lg">
          <Link href="/" className="hover:text-blue-400 font-[--font-geist-sans]">Home</Link>
          <Link href="/library/search/matkul" className="hover:text-blue-400 font-[--font-geist-sans]">Mata Kuliah</Link>
          <Link href="/library/search/jurnal" className="hover:text-blue-400 font-[--font-geist-sans]">Jurnal</Link>
          <Link href="/library/search/tugas-akhir" className="hover:text-blue-400 font-[--font-geist-sans]">Tugas Akhir</Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="text-white text-2xl">
            {menuOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-14 left-0 w-full bg-gray-800 transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <nav className="flex flex-col space-y-3 p-4 text-center">
          <Link href="/" className="py-2 hover:bg-gray-700 rounded-md" onClick={toggleMenu}>Home</Link>
          <Link href="/library/search/matkul" className="py-2 hover:bg-gray-700 rounded-md" onClick={toggleMenu}>Mata Kuliah</Link>
          <Link href="/library/search/jurnal" className="py-2 hover:bg-gray-700 rounded-md" onClick={toggleMenu}>Jurnal</Link>
          <Link href="/library/search/tugas-akhir" className="py-2 hover:bg-gray-700 rounded-md" onClick={toggleMenu}>Tugas Akhir</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
