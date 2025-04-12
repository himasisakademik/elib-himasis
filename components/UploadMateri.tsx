"use client";

import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { signOut } from "next-auth/react";
import { FaTrash, FaCopy, FaDownload, FaSearch, FaEdit } from 'react-icons/fa';

interface SweetAlertResult {
  isConfirmed: boolean;
  value: any;
  dismiss?: string;
}

const UploadMateri = ({ session }: { session: any }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [name, setName] = useState("");
  const [semester, setSemester] = useState("");
  const [dosen, setDosen] = useState("");
  const [category, setCategory] = useState("matkul");
  const [penerbit, setPenerbit] = useState("");
  const [tahunTerbit, setTahunTerbit] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [files, setFiles] = useState<any[]>([]); // State for files
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("dateDesc");
  const [recordsPerPage, setRecordsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const droppedFile = acceptedFiles[0];
      setFile(droppedFile);
      setFileName(droppedFile.name);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Silakan pilih file untuk diupload.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    if (category === "umum") {
      formData.append("name", name);
      formData.append("penerbit", penerbit);
      formData.append("tahun_terbit", tahunTerbit);
      formData.append("deskripsi", deskripsi);
    } else {
      formData.append("name", name);
      formData.append("semester", semester);
      formData.append("dosen", dosen);
    }

    const response = await fetch("/api/uploadmateri", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.message === "File uploaded successfully") {
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "File berhasil diupload!",
      });

      setFile(null);
      setFileName("");
      setName("");
      setSemester("");
      setDosen("");
      setCategory("matkul");
      setPenerbit("");
      setTahunTerbit("");
      setDeskripsi("");

      fetchFiles();
    } else {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat mengupload file.",
      });
    }
  };

  const fetchFiles = async () => {
    const response = await fetch(`/api/uploadmateri?category=${category}`);
    const data = await response.json();
    setFiles(data);
  };

  useEffect(() => {
    fetchFiles();
  }, [category]);

  const deleteFile = async (fileName: string) => {
    try {
      const response = await fetch('/api/uploadmateri', {
        method: 'DELETE',
        body: JSON.stringify({ file: fileName, category: category }),
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (result.message === 'File deleted successfully') {
        setFiles(files.filter(file => file.name !== fileName));
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "File has been deleted successfully.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.error,
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete the file.",
      });
    }
  };

  const getShareUrl = (fileName: string) => {
    const fileUrl = `${window.location.origin}/api/downloadmateri?file=${encodeURIComponent(fileName)}&category=${encodeURIComponent(category)}`;
    return {
      fileUrl: fileUrl,
    };
  };

  const handleCopyUrl = (fileUrl: string) => {
    navigator.clipboard.writeText(fileUrl);
    Swal.fire({
      icon: 'success',
      title: 'URL copied!',
      text: 'The URL for the file has been copied to your clipboard.',
    });
  };

  // Format date to Asia/Jakarta timezone
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid date"; // Return a fallback string if the date is invalid
    }

    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Jakarta',
    }).format(date);
  };

  // Search functionality
  const filteredFiles = files.filter((file) => {
    const searchLower = searchQuery.toLowerCase();
    if (category === "umum") {
      return (
        file.name.toLowerCase().includes(searchLower) ||
        file.penerbit?.toLowerCase().includes(searchLower) ||
        file.tahunTerbit?.toLowerCase().includes(searchLower) ||
        file.deskripsi?.toLowerCase().includes(searchLower)
      );
    } else {
      return (
        file.name.toLowerCase().includes(searchLower) ||
        file.semester?.toLowerCase().includes(searchLower) ||
        file.dosen?.toLowerCase().includes(searchLower)
      );
    }
  });

  // Sorting files
  const sortFiles = (files: any[], sortBy: string) => {
    let sorted = [...files];

    if (sortBy === "dateDesc") {
      sorted.sort((a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime());
    } else if (sortBy === "dateAsc") {
      sorted.sort((a, b) => new Date(a.uploadTime).getTime() - new Date(b.uploadTime).getTime());
    } else if (sortBy === "alphaAsc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "alphaDesc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }

    return sorted;
  };

  const sortedFiles = sortFiles(filteredFiles, sortBy);

  // Pagination
  const indexOfLastFile = currentPage * recordsPerPage;
  const indexOfFirstFile = indexOfLastFile - recordsPerPage;
  const currentFiles = sortedFiles.slice(indexOfFirstFile, indexOfLastFile);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredFiles.length / recordsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleUpdateFile = (file: any) => {
    Swal.fire({
      title: 'Update Materi',
      html: `
        <div class="swal2-input-label text-white">Nama Materi (jangan ubah ext file)</div>
        <input id="name" class="swal2-input bg-gray-800 text-white border-gray-600 focus:ring-2 focus:ring-blue-500" value="${file.name}" />
        
        ${category !== 'umum' ? `
        <div class="swal2-input-label text-white">Semester</div>
        <input id="semester" class="swal2-input bg-gray-800 text-white border-gray-600 focus:ring-2 focus:ring-blue-500" value="${file.semester || ''}" />
        
        <div class="swal2-input-label text-white">Nama Dosen</div>
        <input id="dosen" class="swal2-input bg-gray-800 text-white border-gray-600 focus:ring-2 focus:ring-blue-500" value="${file.dosen || ''}" />
        ` : `
        <div class="swal2-input-label text-white">Penerbit</div>
        <input id="penerbit" class="swal2-input bg-gray-800 text-white border-gray-600 focus:ring-2 focus:ring-blue-500" value="${file.penerbit || ''}" />
        
        <div class="swal2-input-label text-white">Tahun Terbit</div>
        <input id="tahunTerbit" class="swal2-input bg-gray-800 text-white border-gray-600 focus:ring-2 focus:ring-blue-500" value="${file.tahunTerbit || ''}" />
        
        <div class="swal2-input-label text-white">Deskripsi</div>
        <textarea id="deskripsi" class="swal2-textarea bg-gray-800 text-white border-gray-600 focus:ring-2 focus:ring-blue-500">${file.deskripsi || ''}</textarea>
        `}
      `,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'bg-gray-900 text-white rounded-lg p-8 shadow-lg', // Dark background and padding
        title: 'text-2xl font-semibold mb-6', // Larger, bolder title
        content: 'text-base mb-4', // Content text
        confirmButton: 'bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors duration-200', // Tailwind for button styles
        cancelButton: 'bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors duration-200', // Cancel button style
        input: 'bg-gray-800 text-white border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-blue-500', // Input field styles
        textarea: 'bg-gray-800 text-white border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-blue-500', // Textarea styles
      },
      background: '#1A202C', // Dark background color for the modal
      preConfirm: () => {
        const updatedFile = {
          name: (document.getElementById('name') as HTMLInputElement).value,
          category,
          semester: category !== 'umum' ? (document.getElementById('semester') as HTMLInputElement).value : undefined,
          dosen: category !== 'umum' ? (document.getElementById('dosen') as HTMLInputElement).value : undefined,
          penerbit: category === 'umum' ? (document.getElementById('penerbit') as HTMLInputElement).value : undefined,
          tahunTerbit: category === 'umum' ? (document.getElementById('tahunTerbit') as HTMLInputElement).value : undefined,
          deskripsi: category === 'umum' ? (document.getElementById('deskripsi') as HTMLTextAreaElement).value : undefined,
          uploadTime: new Date().toISOString()  // Add the current time as the uploadTime
        };
        return updatedFile;
      }
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        const updatedFile = result.value;
  
        // Send updated data to backend here
        fetch("/api/uploadmateri", {
          method: "PUT",
          body: JSON.stringify({ ...updatedFile, fileName: file.name }),
          headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(() => {
          Swal.fire('Updated!', 'The file details have been updated.', 'success');
          fetchFiles(); // Re-fetch files after update
        })
        .catch(() => Swal.fire('Error!', 'There was an error updating the file.', 'error'));
      }
    });
  };
  
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
      <section className="mt-20 bg-gray-900 py-16 px-8">
        <div className="max-w-4xl mx-auto p-8 rounded-lg shadow-xl bg-gray-800">
          <h2 className="text-3xl font-semibold text-center text-white mb-8">
            Upload Materi
          </h2>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Image
                src={session?.user?.image ?? "https://i.pravatar.cc/300"}
                alt="User Avatar"
                width={64}
                height={64}
                className="w-16 h-16 rounded-full border-2 border-white object-cover"
              />
              <h3 className="text-lg font-semibold text-white">
                Welcome, {session?.user?.name}!
              </h3>
            </div>
            
            <button
              onClick={() => signOut()}
              className="p-3 bg-transparent text-white rounded-full hover:bg-red-600 hover:scale-110 transition-all duration-300"
            >
              <LogOut size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama Materi (Selalu tampil) */}
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Materi"
              className="w-full p-4 border border-gray-500 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Kategori Pilihan */}
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-4 border border-gray-500 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="matkul">Mata Kuliah</option>
              <option value="jurnal">Jurnal</option>
              <option value="tugas-akhir">Tugas Akhir</option>
              <option value="umum">Umum</option>
            </select>

            {/* Form for "non-umum" categories */}
            {category !== "umum" && (
              <>
                <input
                  type="text"
                  name="semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="Semester"
                  className="w-full p-4 border border-gray-500 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="dosen"
                  value={dosen}
                  onChange={(e) => setDosen(e.target.value)}
                  placeholder="Nama Dosen"
                  className="w-full p-4 border border-gray-500 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </>
            )}

            {/* Form for "umum" category */}
            {category === "umum" && (
              <>
                <input
                  type="text"
                  name="penerbit"
                  value={penerbit}
                  onChange={(e) => setPenerbit(e.target.value)}
                  placeholder="Penerbit"
                  className="w-full p-4 border border-gray-500 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="tahunTerbit"
                  value={tahunTerbit}
                  onChange={(e) => setTahunTerbit(e.target.value)}
                  placeholder="Tahun Terbit"
                  className="w-full p-4 border border-gray-500 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  name="deskripsi"
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Deskripsi Singkat (max 50 karakter)"
                  maxLength={50}
                  className="w-full p-4 border border-gray-500 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </>
            )}

            {/* File upload */}
            <div
              {...getRootProps()}
              className="w-full p-4 border border-gray-500 rounded-lg bg-gray-700 text-white cursor-pointer flex items-center justify-center"
            >
              <input {...getInputProps()} className="hidden" />
              <FiUpload className="mr-3 text-white text-2xl" />
              <span className="text-white">Drag & drop file di sini atau klik untuk memilih</span>
            </div>

            {fileName && (
              <p className="text-green-500 mt-2">
                File yang diupload: <strong>{fileName}</strong>
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Upload
            </button>
          </form>

          {/* Search Form */}
          <div className="mt-20 flex items-center mt-6 mb-4">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, semester, dosen, etc."
              className="w-full p-4 border border-gray-500 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* File List */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-white mb-4">Uploaded Files</h3>
            <div className="space-y-4">
              {currentFiles.map((file, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-700 p-4 rounded-lg">
                  <div>
                    <p className="text-white">{file.name}</p>
                    <p className="text-gray-400 text-sm">{formatDate(file.uploadTime)}</p>
                    {category !== 'umum' && (
                      <>
                        <p className="text-sm text-gray-400">Semester: {file.semester || 'N/A'}</p>
                        <p className="text-sm text-gray-400">Dosen: {file.dosen || 'N/A'}</p>
                      </>
                    )}
                    {category === 'umum' && (
                      <>
                        <p className="text-sm text-gray-400">Penerbit: {file.penerbit || 'N/A'}</p>
                        <p className="text-sm text-gray-400">Tahun Terbit: {file.tahunTerbit || 'N/A'}</p>
                        <p className="text-sm text-gray-400">Deskripsi: {file.deskripsi || 'N/A'}</p>
                      </>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <a href={file.path} className="text-blue-500 hover:text-blue-700" download>
                      <FaDownload />
                    </a>
                    <button
                      onClick={() => handleCopyUrl(file.path)}
                      className="text-yellow-500 hover:text-yellow-700"
                    >
                      <FaCopy />
                    </button>
                    <button
                      onClick={() => deleteFile(file.name)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => handleUpdateFile(file)}
                      className="text-green-500 hover:text-green-700"
                    >
                      <FaEdit />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6">
            <select
              value={recordsPerPage}
              onChange={(e) => setRecordsPerPage(Number(e.target.value))}
              className="bg-gray-700 text-white p-2 rounded"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={75}>75</option>
              <option value={100}>100</option>
            </select>

            <div className="flex space-x-2">
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
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default UploadMateri;
