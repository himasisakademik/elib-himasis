// app/components/Footer.tsx
import React from 'react';
import Image from 'next/image';  // Import Image from next/image

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-6 text-center">
      {/* Use next/image for better performance */}
      <Image
        src="/himasis.jpeg"
        alt="Logo"
        width={150}  // Set width
        height={50}  // Set height
      />
      <p>&copy; 2025 Your Company. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
