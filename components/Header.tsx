// components/Header.tsx
import React from "react";

const Header = () => {
  return (
    <header
      className="bg-primary text-white p-8 text-center"
      data-aos="fade-down"
      data-aos-duration="1000"
    >
      <h1 className="text-5xl font-bold">E-Library Himasis</h1>
      <p className="mt-4 text-xl">Your academic resources, all in one place.</p>
    </header>
  );
};

export default Header;
