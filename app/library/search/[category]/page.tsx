"use client";  // Add this line at the top to mark this file as a client component

import { useParams } from 'next/navigation'; // This is how you can access the dynamic route parameter
import CategoryList from '../../../../components/CategoryList'; // Import the CategoryList component
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CategoryPage = () => {
  const { category } = useParams(); // Retrieve the category from the URL

  // Ensure the category is a string
  const categoryString = Array.isArray(category) ? category[0] : category;

  if (!categoryString) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col overflow-x-hidden">
      {/* Category List Section */}
      <Header />
      <section className="py-12 flex-grow max-w-full">
        <CategoryList category={categoryString} /> {/* Pass the category to CategoryList */}
      </section>
      <Footer />
    </div>
  );
};

export default CategoryPage;
