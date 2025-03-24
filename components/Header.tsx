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
          <h1 className="text-xl font-bold">E-Library Himasis</h1>
        </div>

        {/* Navigation for Large Screens */}
        <nav className="hidden lg:flex space-x-6 text-lg">
          <Link href="/" className="hover:text-blue-400">Home</Link>
          <Link href="/library/search/matkul" className="hover:text-blue-400">Mata Kuliah</Link>
          <Link href="/library/search/jurnal" className="hover:text-blue-400">Jurnal</Link>
          <Link href="/library/search/tugas-akhir" className="hover:text-blue-400">Tugas Akhir</Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="text-white text-2xl">
            {menuOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-gray-800 shadow-md p-4">
          <nav className="flex flex-col space-y-4 text-center">
            <Link href="/" className="hover:text-blue-400" onClick={toggleMenu}>Home</Link>
            <Link href="/library/search/matkul" className="hover:text-blue-400" onClick={toggleMenu}>Mata Kuliah</Link>
            <Link href="/library/search/jurnal" className="hover:text-blue-400" onClick={toggleMenu}>Jurnal</Link>
            <Link href="/library/search/tugas-akhir" className="hover:text-blue-400" onClick={toggleMenu}>Tugas Akhir</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
