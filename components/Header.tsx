"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Book, FileText, GraduationCap, Globe, Search } from "lucide-react";
import clsx from "clsx"; 
interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  isDropdown?: boolean; 
  children?: NavItem[]; 
}

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: <Globe className="w-4 h-4" />, description: "Halaman utama" },
  { 
    href: "/library", 
    label: "Library", 
    icon: <Book className="w-4 h-4" />, 
    description: "Jelajahi koleksi digital",
    isDropdown: true,
    children: [
      { href: "/library/search/matkul", label: "Mata Kuliah", icon: <Book className="w-4 h-4" />, description: "Materi perkuliahan" },
      { href: "/library/search/jurnal", label: "Jurnal", icon: <FileText className="w-4 h-4" />, description: "Jurnal akademik" },
      { href: "/library/search/tugas-akhir", label: "Tugas Akhir", icon: <GraduationCap className="w-4 h-4" />, description: "Proyek & skripsi" },
      { href: "/library/search/umum", label: "Umum", icon: <Search className="w-4 h-4" />, description: "Sumber daya umum" },
    ]
  },
];

const SCROLL_THRESHOLD = 10; 

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    window.addEventListener("scroll", handleScroll, { passive: true }); 
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };
  const isActiveRoute = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      <header 
        className={clsx(
          "fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out",
          scrolled 
            ? "bg-slate-900/80 backdrop-blur-lg shadow-2xl shadow-slate-900/30" 
            : "bg-slate-900/50 backdrop-blur-md"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5 pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-2 rounded-xl border border-slate-700/50 group-hover:border-blue-500/50 transition-colors">
                  <Image src="/himasis.png" alt="HiVerse Logo" width={32} height={32} className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent tracking-tight">HiVerse</h1>
                <span className="text-xs text-slate-400 -mt-1 font-medium tracking-wide">Digital Library</span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => (
                item.isDropdown ? (
                  <div className="relative" ref={dropdownRef} key={item.label}>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      aria-expanded={activeDropdown === item.label}
                      aria-controls={`dropdown-${item.label}`}
                      className={clsx(
                        "relative flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 group",
                        item.children?.some(child => isActiveRoute(child.href)) ? "text-white shadow-lg shadow-blue-500/25" : "text-slate-300 hover:text-white"
                      )}
                    >
                      {item.children?.some(child => isActiveRoute(child.href)) && <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl" />}
                      {!item.children?.some(child => isActiveRoute(child.href)) && <div className="absolute inset-0 bg-slate-800/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />}
                      <span className="relative z-10">{item.label}</span>
                      <ChevronDown className={clsx("relative z-10 w-4 h-4 transition-transform", activeDropdown === item.label && "rotate-180")} />
                      {item.children?.some(child => isActiveRoute(child.href)) && <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl" />}
                    </button>
                    <div
                      id={`dropdown-${item.label}`}
                      className={clsx(
                        "absolute top-full left-0 mt-3 w-80 transition-all duration-300",
                        activeDropdown === item.label ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-3 pointer-events-none"
                      )}
                    >
                      <div className="bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-slate-700/50 shadow-2xl shadow-slate-900/50 overflow-hidden">
                        <div className="p-3">
                          {item.children?.map((child) => (
                            <Link key={child.href} href={child.href} className={clsx("flex items-center space-x-4 w-full p-4 rounded-2xl transition-colors group", isActiveRoute(child.href) ? "bg-blue-600/20 text-white" : "hover:bg-slate-800/50 text-slate-300 hover:text-white")}>
                              <div className={clsx("p-3 rounded-xl", isActiveRoute(child.href) ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg" : "bg-slate-800 text-slate-400 group-hover:text-white")}>{child.icon}</div>
                              <div>
                                <div className="font-semibold text-sm">{child.label}</div>
                                <div className="text-xs text-slate-500">{child.description}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link key={item.label} href={item.href} className={clsx("relative px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 group", isActiveRoute(item.href) ? "text-white shadow-lg shadow-blue-500/25" : "text-slate-300 hover:text-white")}>
                    {isActiveRoute(item.href) && <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl" />}
                    {!isActiveRoute(item.href) && <div className="absolute inset-0 bg-slate-800/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />}
                    <span className="relative z-10">{item.label}</span>
                    {isActiveRoute(item.href) && <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl" />}
                  </Link>
                )
              ))}
            </nav>

            <button onClick={toggleMenu} className="lg:hidden p-3 text-slate-300" aria-label="Toggle Menu" aria-expanded={menuOpen} aria-controls="mobile-menu">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div id="mobile-menu" className={clsx("lg:hidden overflow-hidden transition-all duration-500 ease-in-out", menuOpen ? "max-h-screen" : "max-h-0")}>
          <div className="bg-slate-900/95 backdrop-blur-2xl px-4 py-6 space-y-2">
            {[...navItems.filter(i => !i.isDropdown), ...(navItems.find(i => i.isDropdown)?.children || [])].map((item, index) => (
              <Link key={item.href} href={item.href} className={clsx("flex items-center space-x-4 w-full p-4 rounded-2xl transition-colors", isActiveRoute(item.href) ? "bg-blue-600/20 text-white" : "text-slate-300 hover:bg-slate-800/50")}>
                <div className={clsx("p-3 rounded-xl", isActiveRoute(item.href) ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg" : "bg-slate-800 text-slate-400")}>{item.icon}</div>
                <div>
                  <div className="font-semibold text-sm">{item.label}</div>
                  <div className="text-xs text-slate-500">{item.description}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </header>

      <div className="h-20" />
      {menuOpen && <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 lg:hidden" onClick={toggleMenu} />}
    </>
  );
};

export default Header;