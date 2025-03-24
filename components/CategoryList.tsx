import React, { useState, useEffect } from 'react';
import { FaSearch, FaSortAmountDown, FaSortAmountUp, FaFileAlt, FaFilter, FaDownload } from 'react-icons/fa'; 
import { AiOutlineInstagram, AiOutlineWhatsApp } from 'react-icons/ai'; 

interface File {
  name: string;
  size: number;
  semester: string;
  dosen: string;
  path: string;
  uploadTime: string;
}

interface CategoryListProps {
  category: string;
}

const CategoryList: React.FC<CategoryListProps> = ({ category }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [sortedFiles, setSortedFiles] = useState<File[]>([]);
  const [sortBy, setSortBy] = useState<string>('dateDesc');
  const [filterCategory, setFilterCategory] = useState<string>(category);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recordsPerPage, setRecordsPerPage] = useState<number>(10);

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await fetch(`/api/uploadmateri?category=${filterCategory}`);
      const data = await response.json();
      setFiles(data);
      setSortedFiles(data);
    };

    fetchFiles();
  }, [filterCategory]);

  useEffect(() => {
    const sortFiles = (files: File[], sortBy: string) => {
      let sorted = [...files];

      if (sortBy === 'dateDesc') {
        sorted.sort((a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime());
      } else if (sortBy === 'dateAsc') {
        sorted.sort((a, b) => new Date(a.uploadTime).getTime() - new Date(b.uploadTime).getTime());
      } else if (sortBy === 'alphaAsc') {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === 'alphaDesc') {
        sorted.sort((a, b) => b.name.localeCompare(a.name));
      }

      return sorted;
    };

    setSortedFiles(sortFiles(files, sortBy));
  }, [files, sortBy]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCategory(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleRecordsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1); 
  };

  const filteredFiles = sortedFiles.filter(file => {
    return (
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.dosen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.semester.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastFile = currentPage * recordsPerPage;
  const indexOfFirstFile = indexOfLastFile - recordsPerPage;
  const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredFiles.length / recordsPerPage); i++) {
    pageNumbers.push(i);
  }

  const getShareUrl = (fileName: string) => {
    const fileUrl = `${window.location.origin}/e-lib/${filterCategory}/${fileName}`;
    return {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(fileUrl)}`,
      instagram: `https://www.instagram.com/sharer.php?u=${encodeURIComponent(fileUrl)}`,
    };
  };

  return (
    <div className="p-6">
      <h2 className="text-4xl font-extrabold text-center mb-6 text-primary font-[--font-geist-sans]">Materi {filterCategory}</h2>

      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <FaFilter className="text-lg text-primary" />
          <select
            value={filterCategory}
            onChange={handleCategoryChange}
            className="bg-gray-700 text-white p-2 rounded flex items-center font-[--font-geist-sans]"
          >
            <option value="matkul">Mata Kuliah</option>
            <option value="jurnal">Jurnal</option>
            <option value="tugas-akhir">Tugas Akhir</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <FaSortAmountDown className="text-lg text-primary" />
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="bg-gray-700 text-white p-2 rounded flex items-center font-[--font-geist-sans]"
          >
            <option value="dateDesc">Newest First</option>
            <option value="dateAsc">Oldest First</option>
            <option value="alphaAsc">A-Z</option>
            <option value="alphaDesc">Z-A</option>
          </select>
          <FaSortAmountUp className="text-lg text-primary" />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-primary font-[--font-geist-sans]">Show</span>
          <select
            value={recordsPerPage}
            onChange={handleRecordsPerPageChange}
            className="bg-gray-700 text-white p-2 rounded flex items-center font-[--font-geist-sans]"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={75}>75</option>
            <option value={100}>100</option>
          </select>
          <span className="text-primary font-[--font-geist-sans]">items</span>
        </div>
      </div>

      <div className="mb-6 flex justify-center items-center space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by Materi, Dosen, or Semester"
          className="bg-gray-700 text-white p-3 rounded-lg w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-[--font-geist-sans]"
        />
        <button
          className="bg-primary text-white p-3 rounded-lg hover:bg-primary-dark transition-all"
          onClick={() => setSearchQuery('')} 
        >
          <FaSearch />
        </button>
      </div>

      {files.length === 0 && (
        <div className="text-center text-lg text-gray-400">No materials uploaded yet for {filterCategory}.</div>
      )}

      {filteredFiles.length === 0 && searchQuery && (
        <div className="text-center text-lg text-gray-400">Nothing found for your search.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentFiles.map((file, index) => {
          const shareUrls = getShareUrl(file.name);
          return (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <FaFileAlt className="text-3xl text-primary" />
                <div className="ml-4">
                  <p className="font-semibold text-xl text-white">{file.name}</p>
                  <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                  <p className="text-sm text-gray-400">Semester: {file.semester}</p>
                  <p className="text-sm text-gray-400">Dosen: {file.dosen}</p>
                  <p className="text-sm text-gray-400">Uploaded: {new Date(file.uploadTime).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex space-x-3">
                  <a
                    href={shareUrls.whatsapp}
                    target="_blank"
                    className="text-green-500 hover:text-green-700"
                  >
                    <AiOutlineWhatsApp className="text-2xl" />
                  </a>
                  <a
                    href={shareUrls.instagram}
                    target="_blank"
                    className="text-pink-500 hover:text-pink-700"
                  >
                    <AiOutlineInstagram className="text-2xl" />
                  </a>
                </div>
                <a
                  href={`/e-lib/${filterCategory}/${file.name}`}
                  className="text-blue-500 hover:text-blue-700 flex items-center space-x-2 transition-transform transform hover:scale-110"
                  download
                >
                  <FaDownload className="text-lg" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-4 py-2 rounded-lg ${currentPage === number ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'} hover:bg-primary hover:text-white transition-all`}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
