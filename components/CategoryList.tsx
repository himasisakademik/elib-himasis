import React, { useState, useEffect } from 'react';

interface File {
  name: string;
  size: number;
  semester: string;
  dosen: string;
  path: string;
  uploadTime: string; // Add upload time to filter by date
}

interface CategoryListProps {
  category: string;
}

const CategoryList: React.FC<CategoryListProps> = ({ category }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [sortedFiles, setSortedFiles] = useState<File[]>([]);
  const [sortBy, setSortBy] = useState<string>('dateDesc'); // default: sort by date descending
  const [filterCategory, setFilterCategory] = useState<string>(category);

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await fetch(`/api/uploadmateri?category=${filterCategory}`);
      const data = await response.json();
      setFiles(data);
      setSortedFiles(data); // Initialize sortedFiles with the fetched data
    };

    fetchFiles();
  }, [filterCategory]);

  useEffect(() => {
    // Sorting function based on selected filter
    const sortFiles = (files: File[], sortBy: string) => {
      let sorted = [...files];

      if (sortBy === 'dateDesc') {
        sorted.sort((a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime()); // Newest first
      } else if (sortBy === 'dateAsc') {
        sorted.sort((a, b) => new Date(a.uploadTime).getTime() - new Date(b.uploadTime).getTime()); // Oldest first
      } else if (sortBy === 'alphaAsc') {
        sorted.sort((a, b) => a.name.localeCompare(b.name)); // A-Z
      } else if (sortBy === 'alphaDesc') {
        sorted.sort((a, b) => b.name.localeCompare(a.name)); // Z-A
      }

      return sorted;
    };

    // Apply the sorting whenever the sort order or file list changes
    setSortedFiles(sortFiles(files, sortBy));
  }, [files, sortBy]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCategory(e.target.value);
  };

  return (
    <div>
      <h2 className="text-4xl font-bold mb-6">Materi {filterCategory}</h2>

      {/* Filter by Category */}
      <div className="mb-4">
        <select
          value={filterCategory}
          onChange={handleCategoryChange}
          className="bg-gray-700 text-white p-2 rounded"
        >
          <option value="matkul">Mata Kuliah</option>
          <option value="jurnal">Jurnal</option>
          <option value="tugas-akhir">Tugas Akhir</option>
        </select>
      </div>

      {/* Sort by Dropdown */}
      <div className="mb-4">
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="bg-gray-700 text-white p-2 rounded"
        >
          <option value="dateDesc">Newest First</option>
          <option value="dateAsc">Oldest First</option>
          <option value="alphaAsc">A-Z</option>
          <option value="alphaDesc">Z-A</option>
        </select>
      </div>

      <div>
        {sortedFiles.map((file, index) => (
          <div key={index} className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-lg mb-4">
            <div className="flex items-center">
              <span className="text-xl">📄</span>
              <div className="ml-4">
                <p className="font-semibold">{file.name}</p>
                <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                <p className="text-sm text-gray-400">Semester: {file.semester}</p>
                <p className="text-sm text-gray-400">Dosen: {file.dosen}</p>
                <p className="text-sm text-gray-400">Uploaded: {new Date(file.uploadTime).toLocaleString()}</p>
              </div>
            </div>
            <a
              href={`/e-lib/${filterCategory}/${file.name}`}
              className="text-blue-500 hover:text-blue-700"
              download
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
