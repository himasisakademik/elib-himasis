"use client";
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { useDropzone } from 'react-dropzone'; // Import react-dropzone
import { FiUpload } from 'react-icons/fi'; // Import file upload icon from react-icons

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState(''); // Track the file name
  const [name, setName] = useState('');
  const [semester, setSemester] = useState('');
  const [dosen, setDosen] = useState('');
  const [category, setCategory] = useState('matkul');

  // Handle drop of file
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const droppedFile = acceptedFiles[0];
      setFile(droppedFile);
      setFileName(droppedFile.name); // Set the file name on drop
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    // accept: '.pdf,.doc,.docx,.pptx,.txt,.xlsx', // Accept file types (optional)
    multiple: false, // Only one file at a time
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select a file to upload.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('semester', semester);
    formData.append('dosen', dosen);
    formData.append('category', category); // Include category field
    formData.append('file', file); // Include the file

    const response = await fetch('/api/uploadmateri', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (result.message === 'File uploaded successfully') {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'File uploaded successfully!',
      });
      // Reset form after successful upload
      setFile(null);
      setFileName('');
      setName('');
      setSemester('');
      setDosen('');
      setCategory('matkul');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Error uploading file',
      });
    }
  };

  return (
    <div className="bg-gray-900 text-white">
      <Header />
      <section className="bg-gray-900 py-16 px-8">
        <div className="max-w-4xl mx-auto p-8 rounded-lg shadow-xl bg-gray-800">
          <h2 className="text-3xl font-semibold text-center text-white mb-8 font-[--font-geist-sans]">Upload Materi</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Materi"
              className="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white font-[--font-geist-sans]"
            />
            <input
              type="text"
              name="semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="Semester"
              className="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white font-[--font-geist-sans]"
            />
            <input
              type="text"
              name="dosen"
              value={dosen}
              onChange={(e) => setDosen(e.target.value)}
              placeholder="Nama Dosen"
              className="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white font-[--font-geist-sans]"
            />
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white font-[--font-geist-sans]"
            >
              <option value="matkul">Mata Kuliah</option>
              <option value="jurnal">Jurnal</option>
              <option value="tugas-akhir">Tugas Akhir</option>
            </select>

            {/* File input field for drag-and-drop */}
            <div
              {...getRootProps()}
              className="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white font-[--font-geist-sans] cursor-pointer flex items-center justify-center"
            >
              <input {...getInputProps()} className="hidden" />
              <FiUpload className="mr-3 text-white text-2xl" /> {/* Icon for file upload */}
              <span className="text-white">Drag & drop a file here or click to select</span>
            </div>

            {/* Display the uploaded file name */}
            {fileName && (
              <p className="text-green-500 mt-2">
                File uploaded: <strong>{fileName}</strong>
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-[--font-geist-sans] py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
            >
              Upload
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default UploadForm;
