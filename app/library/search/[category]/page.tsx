"use client";  

import { useParams } from 'next/navigation'; 
import CategoryList from '../../../../components/CategoryList'; 
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CategoryPage = () => {
  const { category } = useParams(); 

  const categoryString = Array.isArray(category) ? category[0] : category;

  if (!categoryString) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <section className="py-12 flex-grow max-w-full">
        <CategoryList category={categoryString} />
      </section>
      <Footer />
    </div>
  );
};

export default CategoryPage;
