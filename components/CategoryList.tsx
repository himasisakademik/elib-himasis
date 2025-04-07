import React, { useState, useEffect } from 'react';
import { FaSearch, FaCopy, FaSortAmountDown, FaSortAmountUp, FaFileAlt, FaFilter, FaDownload } from 'react-icons/fa'; 
import { AiOutlineWhatsApp } from 'react-icons/ai'; 

interface File {
  name: string;
  size: number;
  semester?: string;
  dosen?: string;
  path: string;
  uploadTime: string;
  penerbit?: string;   // Menambahkan penerbit
  tahunTerbit?: string; // Menambahkan tahun terbit
  deskripsi?: string;  // Menambahkan deskripsi singkat
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
  const [copiedFile, setCopiedFile] = useState<string | null>(null); // State untuk notifikasi copy

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
      file.dosen?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.semester?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.penerbit?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tahunTerbit?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase()) // Search by Deskripsi
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
    const fileUrl = `${window.location.origin}/api/downloadmateri?materi=${encodeURIComponent(fileName)}&category=${encodeURIComponent(filterCategory)}`;
    return {
      whatsapp: `https://wa.me/?text=${encodeURIComponent("Hello Sobat! Silahkan dibaca materi berikut : \n" + fileUrl + "\n\nThank You...")}`,
      fileUrl: fileUrl, 
    };
  };

  const handleCopyUrl = (fileUrl: string, fileName: string) => {
    navigator.clipboard.writeText(fileUrl);
    setCopiedFile(fileName);

    setTimeout(() => {
      setCopiedFile(null);
    }, 2000);
  };

  return (
    <div className="p-6">
      {/* Notifikasi Copy */}
      {copiedFile && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 animate-fade-in">
          ✅ URL "{copiedFile}" berhasil disalin!
        </div>
      )}
      <h2 className="text-4xl font-extrabold text-center mb-6 text-primary">Materi {filterCategory}</h2>

      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <FaFilter className="text-lg text-primary" />
          <select
            value={filterCategory}
            onChange={handleCategoryChange}
            className="bg-gray-700 text-white p-2 rounded flex items-center"
          >
            <option value="matkul">Mata Kuliah</option>
            <option value="jurnal">Jurnal</option>
            <option value="tugas-akhir">Tugas Akhir</option>
            <option value="umum">Umum</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <FaSortAmountDown className="text-lg text-primary" />
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="bg-gray-700 text-white p-2 rounded flex items-center"
          >
            <option value="dateDesc">Newest First</option>
            <option value="dateAsc">Oldest First</option>
            <option value="alphaAsc">A-Z</option>
            <option value="alphaDesc">Z-A</option>
          </select>
          <FaSortAmountUp className="text-lg text-primary" />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-primary">Show</span>
          <select
            value={recordsPerPage}
            onChange={handleRecordsPerPageChange}
            className="bg-gray-700 text-white p-2 rounded"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={75}>75</option>
            <option value={100}>100</option>
          </select>
          <span className="text-primary">items</span>
        </div>
      </div>

      <div className="mb-6 flex justify-center items-center space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Mau Baca Apa Hari Ini ?"
          className="bg-gray-700 text-white p-3 rounded-lg w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          className="bg-primary text-white p-3 rounded-lg hover:bg-primary-dark transition-all"
          onClick={() => setSearchQuery('')} 
        >
          <FaSearch />
        </button>
      </div>

      {filteredFiles.length === 0 && searchQuery && (
        <div className="text-center text-lg text-gray-400">Nothing found for your search.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentFiles.map((file, index) => {
          const { whatsapp, fileUrl } = getShareUrl(file.name);
          return (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-xl hover:shadow-2xl"
            >
              <div className="flex items-center mb-4">
                <FaFileAlt className="text-3xl text-primary" />
                <div className="ml-4">
                  <p className="font-semibold text-xl text-white">{file.name}</p>
                  <p className="text-sm text-gray-400">Size: {(file.size / 1024).toFixed(2)} KB</p>
                  {filterCategory === "umum" && (
                    <>
                      <p className="text-sm text-gray-400">Penerbit: {file.penerbit || 'N/A'}</p>
                      <p className="text-sm text-gray-400">Tahun Terbit: {file.tahunTerbit || 'N/A'}</p>
                      <p className="text-sm text-gray-400">Deskripsi: {file.deskripsi || 'N/A'}</p>
                    </>
                  )}
                  {filterCategory !== "umum" && (
                    <>
                      <p className="text-sm text-gray-400">Semester: {file.semester || 'N/A'}</p>
                      <p className="text-sm text-gray-400">Dosen: {file.dosen || 'N/A'}</p>
                    </>
                  )}
                  <p className="text-sm text-gray-400">Uploaded: {new Date(file.uploadTime).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex space-x-3">
                  <a href={whatsapp} target="_blank" className="text-green-500 hover:text-green-700">
                    <AiOutlineWhatsApp className="text-2xl" />
                  </a>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleCopyUrl(fileUrl, file.name)}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    <FaCopy className="text-lg" />
                  </button>

                  <a
                    href={fileUrl}
                    className="text-blue-500 hover:text-blue-700"
                    download
                  >
                    <FaDownload className="text-lg" />
                  </a>
                </div>
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
            className={`px-4 py-2 rounded-lg ${currentPage === number ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
