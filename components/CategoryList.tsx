"use client";

import React, { useState, useEffect, useRef, FC } from "react";
import {
  Search,
  Copy,
  HelpCircle,
  ArrowDownAZ,
  ArrowUpAZ,
  FileText,
  Filter,
  Download,
  MessageCircle,
  Eye,
  Check
} from "lucide-react";
import Pagination from "./Pagination";

const formatFileSize = (sizeInBytes: number): string => {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} Bytes`;
  }
  const sizeInKB = sizeInBytes / 1024;
  if (sizeInKB < 1024) {
    return `${sizeInKB.toFixed(2)} KB`;
  }
  const sizeInMB = sizeInKB / 1024;
  if (sizeInMB < 1024) {
    return `${sizeInMB.toFixed(2)} MB`;
  }
  const sizeInGB = sizeInMB / 1024;
  return `${sizeInGB.toFixed(2)} GB`;
};

interface File {
  name: string;
  originalFileName: string;
  size: number;
  uploadTime: string;
  path: string;
  mataKuliah?: string;
  semester?: string;
  penyusun?: string;
  penerbit?: string;
  tahunTerbit?: string;
  deskripsi?: string;
  judulJurnal?: string;
  penulisJurnal?: string;
  penerbitJurnal?: string;
  tahunJurnal?: string;
  asalJurnal?: string;
  judulTA?: string;
  namaTA?: string;
  tahunTA?: string;
  downloadUrl?: string;
  gdriveUrl?: string;
  tahun?: string;
}

interface CategoryListProps {
  category: string;
}

// ParticleCanvas removed for performance - was consuming high CPU with O(n²) connection drawing

const tutorialSteps = [
  {
    title: "Selamat Datang di E-Library!",
    content:
      "Ini adalah panduan singkat untuk membantu Anda menemukan materi dengan mudah. Mari kita mulai!",
    icon: "👋",
  },
  {
    title: "Langkah 1: Pilih Kategori",
    content:
      "Gunakan menu dropdown ini untuk memilih jenis materi yang Anda cari, seperti Ikhtisar Materi Kuliah, dan lainnya.",
    icon: "📚",
  },
  {
    title: "Langkah 2: Gunakan Pencarian Cerdas",
    content:
      "Ketik kata kunci di kolom pencarian. Sistem akan otomatis mencari di semua informasi yang relevan dengan kategori yang dipilih.",
    icon: "🔍",
  },
  {
    title: "Contoh: Kategori Ikhtisar Materi Kuliah",
    content:
      "Anda bisa mencari berdasarkan 'Nama Materi', 'Mata Ikhtisar Materi Kuliah', 'Semester', atau 'Nama Penyusun'. Cukup ketik salah satunya!",
    icon: "🎓",
  },
  // {
  //   title: "Contoh: Kategori Jurnal",
  //   content:
  //     "Cari berdasarkan 'Judul Jurnal', 'Penulis', 'Penerbit', 'Tahun', atau 'Asal Kampus'.",
  //   icon: "🔬",
  // },
  // {
  //   title: "Contoh: Kategori Tugas Akhir",
  //   content:
  //     "Temukan skripsi atau TA dengan mencari 'Judul TA', 'Nama Penulis', atau 'Tahun'.",
  //   icon: "📜",
  // },
  {
    title: "Contoh: Kategori Umum",
    content:
      "Untuk buku atau materi umum, cari berdasarkan 'Penerbit', 'Tahun Terbit', atau 'Deskripsi' singkatnya.",
    icon: "🌐",
  },
  {
    title: "Langkah 3: Urutkan & Bagikan",
    content:
      "Anda bisa mengurutkan hasil pencarian dan membagikan link materi ke teman Anda melalui WhatsApp atau menyalin URL-nya. Selamat mencari!",
    icon: "🚀",
  },
];

const TutorialModal: FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const handleNext = () =>
    setStep((s) => Math.min(s + 1, tutorialSteps.length - 1));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 0));
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  const currentStep = tutorialSteps[step];

  return (
    <div
      className={`fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fadeIn`}
    >
      <div
        className={`bg-slate-800/80 border border-slate-600/50 rounded-2xl shadow-2xl w-full max-w-md p-6 text-center transform transition-all duration-300 ${isExiting ? "scale-90 opacity-0" : "scale-100 opacity-100"}`}
      >
        <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
          {currentStep.icon}
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          {currentStep.title}
        </h3>
        <p className="text-slate-300 mb-6 min-h-[72px]">
          {currentStep.content}
        </p>

        <div className="flex justify-center items-center gap-2 mb-6">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${step === index ? "bg-blue-400 w-6" : "bg-slate-600"}`}
            ></div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className="px-4 py-2 text-slate-400 rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            Kembali
          </button>
          {step === tutorialSteps.length - 1 ? (
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition-opacity"
            >
              Selesai
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition-opacity"
            >
              Lanjut
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const CategoryList: React.FC<CategoryListProps> = ({ category }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [sortBy, setSortBy] = useState<string>("dateDesc");
  const [filterCategory, setFilterCategory] = useState<string>(category);
  const [filterSemester, setFilterSemester] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recordsPerPage, setRecordsPerPage] = useState<number>(10);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(
          `/api/uploadmateri?category=${filterCategory}`,
        );
        if (!response.ok) {
          console.error("API error:", response.status, response.statusText);
          setFiles([]);
          return;
        }
        const data = await response.json();
        setFiles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching files:", error);
        setFiles([]);
      }
    };
    fetchFiles();
  }, [filterCategory]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSortBy(e.target.value);
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCategory(e.target.value);
    setFilterSemester("all");
    setCurrentPage(1);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  const handleRecordsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  

  const processedFiles = React.useMemo(() => {
    let filtered = files.filter((file) => {
      if (filterSemester !== "all" && file.semester !== filterSemester) {
        return false;
      }
      const searchLower = searchQuery.toLowerCase();
      const searchableFields = [
        file.name,
        file.tahun,
        file.mataKuliah,
        file.semester,
        file.penyusun,
        file.penerbit,
        file.tahunTerbit,
        file.deskripsi,
        file.judulJurnal,
        file.penulisJurnal,
        file.penerbitJurnal,
        file.tahunJurnal,
        file.asalJurnal,
        file.judulTA,
        file.namaTA,
        file.tahunTA,
      ];
      return searchableFields.some((field) =>
        field?.toLowerCase().includes(searchLower),
      );
    });
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "dateAsc":
          return (
            new Date(a.uploadTime).getTime() - new Date(b.uploadTime).getTime()
          );
        case "alphaAsc":
          return a.name.localeCompare(b.name);
        case "alphaDesc":
          return b.name.localeCompare(a.name);
        case "dateDesc":
        default:
          return (
            new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime()
          );
      }
    });
  }, [files, searchQuery, sortBy, filterSemester]);

  const totalPages = Math.ceil(processedFiles.length / recordsPerPage);
  const indexOfLastFile = currentPage * recordsPerPage;
  const indexOfFirstFile = indexOfLastFile - recordsPerPage;
  const currentFiles = processedFiles.slice(indexOfFirstFile, indexOfLastFile);

  // const getShareUrl = (fileName: string) => {
  //   const fileUrl = `${window.location.origin}/api/downloadmateri?file=${encodeURIComponent(fileName)}&category=${encodeURIComponent(filterCategory)}`;
  //   // const fileUrl = ;
  //   return {
  //     whatsapp: `https://wa.me/?text=${encodeURIComponent("Hello Sobat! Silahkan dibaca materi berikut : \n" + fileUrl + "\n\nThank You...")}`,
  //     fileUrl: fileUrl,
  //   };
  // };

  const getShareUrl = (downloadUrl: string) => {
    return {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(
        "Hello Sobat! Silahkan dibaca materi berikut :\n" +
        downloadUrl +
        "\n\nThank You..."
      )}`,
      fileUrl: downloadUrl,
    };
  };

  const handleCopyUrl = (fileUrl: string, fileName: string) => {
    navigator.clipboard.writeText(fileUrl);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 3000);
  };

  const renderFileDetails = (file: File) => {
    switch (filterCategory) {
      case "matkul":
        return (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Materi Kuliah:</span>
              <span className="text-cyan-300 font-medium truncate text-right">
                {file.mataKuliah || "N/A"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Semester:</span>
              <span className="text-cyan-300 font-medium">
                {file.semester || "N/A"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">penyusun:</span>
              <span className="text-emerald-300 font-medium truncate text-right">
                {file.penyusun || "N/A"}
              </span>
            </div>
            
          </>
        );
      // case "jurnal":
      //   return (
      //     <>
      //       <div className="flex justify-between text-sm">
      //         <span className="text-gray-400">Judul:</span>
      //         <span className="text-cyan-300 font-medium truncate text-right">
      //           {file.judulJurnal || "N/A"}
      //         </span>
      //       </div>
      //       <div className="flex justify-between text-sm">
      //         <span className="text-gray-400">Penulis:</span>
      //         <span className="text-emerald-300 font-medium truncate text-right">
      //           {file.penulisJurnal || "N/A"}
      //         </span>
      //       </div>
      //       <div className="flex justify-between text-sm">
      //         <span className="text-gray-400">Penerbit:</span>
      //         <span className="text-white font-medium truncate text-right">
      //           {file.penerbitJurnal || "N/A"}
      //         </span>
      //       </div>
      //       <div className="flex justify-between text-sm">
      //         <span className="text-gray-400">Tahun:</span>
      //         <span className="text-white font-medium">
      //           {file.tahunJurnal || "N/A"}
      //         </span>
      //       </div>
      //       <div className="flex justify-between text-sm">
      //         <span className="text-gray-400">Asal:</span>
      //         <span className="text-white font-medium truncate text-right">
      //           {file.asalJurnal || "N/A"}
      //         </span>
      //       </div>
      //     </>
      //   );
      // case "tugas-akhir":
      //   return (
      //     <>
      //       <div className="flex justify-between text-sm">
      //         <span className="text-gray-400">Judul TA:</span>
      //         <span className="text-cyan-300 font-medium truncate text-right">
      //           {file.judulTA || "N/A"}
      //         </span>
      //       </div>
      //       <div className="flex justify-between text-sm">
      //         <span className="text-gray-400">Penulis:</span>
      //         <span className="text-emerald-300 font-medium truncate text-right">
      //           {file.namaTA || "N/A"}
      //         </span>
      //       </div>
      //       <div className="flex justify-between text-sm">
      //         <span className="text-gray-400">Tahun:</span>
      //         <span className="text-white font-medium">
      //           {file.tahunTA || "N/A"}
      //         </span>
      //       </div>
      //     </>
      //   );
      case "umum":
        return (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Penerbit:</span>
              <span className="text-white font-medium truncate text-right">
                {file.penerbit || "N/A"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Tahun Terbit:</span>
              <span className="text-white font-medium">
                {file.tahunTerbit || "N/A"}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Deskripsi:</span>
              <p className="text-white font-medium mt-1 line-clamp-2">
                {file.deskripsi || "N/A"}
              </p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-slate-800/10 to-slate-700/20 backdrop-blur-sm z-10"></div>
      {isTutorialOpen && (
        <TutorialModal onClose={() => setIsTutorialOpen(false)} />
      )}

      <button
        onClick={() => setIsTutorialOpen(true)}
        className="fixed bottom-6 right-6 z   -50 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
        title="Buka Tutorial"
      >
        <HelpCircle className="w-6 h-6" />
      </button>
      <div className="relative z-20 p-6">
        {copiedFile && (
          <div className="fixed top-24 right-6 z-[9999] animate-slideInRight">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-lg border border-white/20 max-w-sm">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                  <Check className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">URL Berhasil Disalin!</div>
                  <div className="text-xs text-white/80 truncate max-w-[200px]">
                    {copiedFile}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-pulse">
          Ikhtisar Materi Kuliah 
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full animate-pulse"></div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-8 border border-white/20 shadow-2xl">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center space-x-3 bg-slate-800/50 backdrop-blur-sm p-3 rounded-xl border border-white/10 hover:bg-slate-700/50 transition-all duration-300 group">
              <Filter className="text-xl text-blue-400 group-hover:text-blue-300 transition-colors" />
              <select
                value={filterCategory}
                onChange={handleCategoryChange}
                className="bg-transparent text-white focus:outline-none cursor-pointer"
              >
                <option value="matkul" className="bg-slate-800">
                Ikhtisar Materi Kuliah
                </option>
                <option value="umum" className="bg-slate-800">
                  Umum
                </option>
              </select>
            </div>
            {filterCategory === "matkul" && (
              <div className="flex items-center space-x-3 bg-slate-800/50 backdrop-blur-sm p-3 rounded-xl border border-white/10 hover:bg-slate-700/50 transition-all duration-300 group animate-fade-in">
                <Filter className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                <select
                  value={filterSemester}
                  onChange={(e) => {
                    setFilterSemester(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-white focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-slate-800">
                    Semua Semester
                  </option>
                  <option value="1" className="bg-slate-800">
                    Semester 1
                  </option>
                  <option value="2" className="bg-slate-800">
                    Semester 2
                  </option>
                  <option value="3" className="bg-slate-800">
                    Semester 3
                  </option>
                  <option value="4" className="bg-slate-800">
                    Semester 4
                  </option>
                  <option value="5" className="bg-slate-800">
                    Semester 5
                  </option>
                  <option value="6" className="bg-slate-800">
                    Semester 6
                  </option>
                  <option value="7" className="bg-slate-800">
                    Semester 7
                  </option>
                  <option value="8" className="bg-slate-800">
                    Semester 8
                  </option>
                </select>
              </div>
            )}
            <div className="flex items-center space-x-3 bg-slate-800/50 backdrop-blur-sm p-3 rounded-xl border border-white/10 hover:bg-slate-700/50 transition-all duration-300 group">
              <ArrowDownAZ className="text-xl text-purple-400 group-hover:text-purple-300 transition-colors" />
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="bg-transparent text-white focus:outline-none cursor-pointer"
              >
                <option value="dateDesc" className="bg-slate-800">
                  Terbaru
                </option>
                <option value="dateAsc" className="bg-slate-800">
                  Terlama
                </option>
                <option value="alphaAsc" className="bg-slate-800">
                  A-Z
                </option>
                <option value="alphaDesc" className="bg-slate-800">
                  Z-A
                </option>
              </select>
              <ArrowUpAZ className="text-xl text-purple-400 group-hover:text-purple-300 transition-colors" />
            </div>
            <div className="flex items-center space-x-3 bg-slate-800/50 backdrop-blur-sm p-3 rounded-xl border border-white/10 hover:bg-slate-700/50 transition-all duration-300">
              <span className="text-cyan-400 font-medium">Tampilkan</span>
              <select
                value={recordsPerPage}
                onChange={handleRecordsPerPageChange}
                className="bg-transparent text-white focus:outline-none cursor-pointer"
              >
                <option value={10} className="bg-slate-800">
                  10
                </option>
                <option value={25} className="bg-slate-800">
                  25
                </option>
                <option value={50} className="bg-slate-800">
                  50
                </option>
                <option value={75} className="bg-slate-800">
                  75
                </option>
                <option value={100} className="bg-slate-800">
                  100
                </option>
              </select>
              <span className="text-cyan-400 font-medium">item</span>
            </div>
          </div>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-2xl">
            <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden group hover:bg-white/15 transition-all duration-300">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Mau Baca Apa Hari Ini ?"
                className="w-full bg-transparent text-white placeholder-gray-300 p-4 pl-6 pr-16 focus:outline-none text-lg"
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-110 shadow-lg"
                onClick={() => setSearchQuery("")}
              >
                <Search className="text-lg" />
              </button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl -z-10 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300"></div>
          </div>
        </div>

        {processedFiles.length === 0 && searchQuery && (
          <div className="text-center py-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <div className="text-xl text-gray-300 font-medium">
                Tidak ada hasil yang ditemukan untuk pencarian Anda.
              </div>
              <div className="text-gray-400 mt-2">
                Coba kata kunci yang berbeda atau jelajahi kategori
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentFiles.map((file, index) => {
            const { whatsapp, fileUrl } = getShareUrl(  file.downloadUrl || file.gdriveUrl || "#"
            );
            return (
              <div
                key={`${file.name}-${index}`}
                className="group relative bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:bg-white/15 overflow-hidden"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <FileText className="text-2xl text-white" />
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <p className="font-bold text-xl text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors truncate">
                        {file.name}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    {renderFileDetails(file)}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Tahun:</span>
                      <span className="text-amber-300 font-medium">
                        {file.tahun || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  
                    <div className="flex space-x-3">
                      <a
                        href={whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500/20 backdrop-blur-sm p-3 rounded-xl border border-green-500/30 text-green-400 hover:text-green-300 hover:bg-green-500/30 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-green-500/25"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                    <div className="flex space-x-3">
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={file.gdriveUrl}
                        className="bg-violet-500/20 backdrop-blur-sm p-3 rounded-xl border border-violet-500/30 text-violet-400 hover:text-blue-300 hover:bg-blue-500/30 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-blue-500/25"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleCopyUrl(fileUrl, file.name)}
                        className="bg-yellow-500/20 backdrop-blur-sm p-3 rounded-xl border border-yellow-500/30 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/30 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-yellow-500/25"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <a
                        href={fileUrl}
                        className="bg-blue-500/20 backdrop-blur-sm p-3 rounded-xl border border-blue-500/30 text-blue-400 hover:text-blue-300 hover:bg-blue-500/30 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-blue-500/25"
                        download
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                    
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .animate-fade-in {
          animation: fadeInUp 0.6s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CategoryList;