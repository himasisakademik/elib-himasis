/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useRef, FC, FormEvent } from "react";
import { useDropzone } from "react-dropzone";
import {
  LogOut,
  Upload,
  Search,
  Download,
  Trash2,
  Edit3,
  Globe,
  FileText,
  Calendar,
  User,
  Building,
  Eye,
  Filter,
  Grid,
  File,
  List,
  Plus,
} from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { signOut } from "next-auth/react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPaginationItems = () => {
        const pageNeighbours = 1; 
        const totalNumbers = (pageNeighbours * 2) + 3;
        const totalBlocks = totalNumbers + 2;

        if (totalPages > totalBlocks) {
            const startPage = Math.max(2, currentPage - pageNeighbours);
            const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
            let pages: (number | string)[] = Array.from({ length: (endPage - startPage) + 1 }, (_, i) => startPage + i);

            const hasLeftSpill = startPage > 2;
            const hasRightSpill = (totalPages - endPage) > 1;
            const spillOffset = totalNumbers - (pages.length + 1);

            switch (true) {
                case (hasLeftSpill && !hasRightSpill): {
                    const extraPages = Array.from({ length: spillOffset + 1 }, (_, i) => startPage - i - 1).reverse();
                    pages = ["...", ...extraPages, ...pages];
                    break;
                }
                case (!hasLeftSpill && hasRightSpill): {
                    const extraPages = Array.from({ length: spillOffset + 1 }, (_, i) => endPage + i + 1);
                    pages = [...pages, ...extraPages, "..."];
                    break;
                }
                case (hasLeftSpill && hasRightSpill):
                default: {
                    pages = ["...", ...pages, "..."];
                    break;
                }
            }
            return [1, ...pages, totalPages];
        }
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    };

    const pages = getPaginationItems();

    return (
        <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8 flex-wrap">
            {pages.map((page, index) => {
                if (typeof page === 'string') {
                    return <span key={`${page}-${index}`} className="px-3 sm:px-4 py-2 text-slate-400">...</span>;
                }
                return (
                    <button key={page} onClick={() => onPageChange(page)} className={`px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 ${ currentPage === page ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white' }`}>
                        {page}
                    </button>
                );
            })}
        </div>
    );
};
interface FileData {
  name: string;
  originalFileName: string;
  size: number;
  uploadTime: string;
  path: string;
  mataKuliah?: string;
  semester?: string;
  dosen?: string;
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
}

interface ParticleConfig {
  particles: {
    number: {
      value: number;
      density: {
        enable: boolean;
        value_area: number;
      };
    };
    color: {
      value: string;
    };
    shape: {
      type: string;
      stroke: {
        width: number;
        color: string;
      };
      polygon: {
        nb_sides: number;
      };
    };
    opacity: {
      value: number;
      random: boolean;
      anim: {
        enable: boolean;
        speed: number;
        opacity_min: number;
        sync: boolean;
      };
    };
    size: {
      value: number;
      random: boolean;
      anim: {
        enable: boolean;
        speed: number;
        size_min: number;
        sync: boolean;
      };
    };
    line_linked: {
      enable: boolean;
      distance: number;
      color: string;
      opacity: number;
      width: number;
    };
    move: {
      enable: boolean;
      speed: number;
      direction: string;
      random: boolean;
      straight: boolean;
      out_mode: string;
      bounce: boolean;
      attract: {
        enable: boolean;
        rotateX: number;
        rotateY: number;
      };
    };
  };
  interactivity: {
    detect_on: string;
    events: {
      onhover: {
        enable: boolean;
        mode: string;
      };
      onclick: {
        enable: boolean;
        mode: string;
      };
      resize: boolean;
    };
    modes: {
      grab: {
        distance: number;
        line_linked: {
          opacity: number;
        };
      };
      bubble: {
        distance: number;
        size: number;
        duration: number;
        opacity: number;
        speed: number;
      };
      repulse: {
        distance: number;
        duration: number;
      };
      push: {
        particles_nb: number;
      };
      remove: {
        particles_nb: number;
      };
    };
  };
  retina_detect: boolean;
}

interface SweetAlertResult {
  isConfirmed: boolean;
  value: any;
  dismiss?: string;
}

const UploadMateri: FC<{ session: any }> = ({ session }) => {
  // --- State Umum ---
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("matkul");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [mataKuliah, setMataKuliah] = useState("");
  const [semester, setSemester] = useState("");
  const [dosen, setDosen] = useState("");

  const [penerbit, setPenerbit] = useState("");
  const [tahunTerbit, setTahunTerbit] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  const [judulJurnal, setJudulJurnal] = useState("");
  const [penulisJurnal, setPenulisJurnal] = useState("");
  const [penerbitJurnal, setPenerbitJurnal] = useState("");
  const [tahunJurnal, setTahunJurnal] = useState("");
  const [asalJurnal, setAsalJurnal] = useState("");

  const [judulTA, setJudulTA] = useState("");
  const [namaTA, setNamaTA] = useState("");
  const [tahunTA, setTahunTA] = useState("");

  const [files, setFiles] = useState<FileData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("dateDesc");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [updateFormData, setUpdateFormData] = useState({
    name: "",
    mataKuliah: "",
    semester: "",
    dosen: "",
    penerbit: "",
    tahunTerbit: "",
    deskripsi: "",
    judulJurnal: "",
    penulisJurnal: "",
    penerbitJurnal: "",
    tahunJurnal: "",
    asalJurnal: "",
    judulTA: "",
    namaTA: "",
    tahunTA: "",
  });
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadParticles = async () => {
      try {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js";
        script.async = true;

        script.onload = () => {
          if (typeof (window as any).particlesJS !== "undefined") {
            const particlesConfig: ParticleConfig = {
              particles: {
                number: {
                  value: 60,
                  density: {
                    enable: true,
                    value_area: 1000,
                  },
                },
                color: {
                  value: "#6366f1",
                },
                shape: {
                  type: "circle",
                  stroke: {
                    width: 0,
                    color: "#000000",
                  },
                  polygon: {
                    nb_sides: 5,
                  },
                },
                opacity: {
                  value: 0.2,
                  random: true,
                  anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.05,
                    sync: false,
                  },
                },
                size: {
                  value: 2,
                  random: true,
                  anim: {
                    enable: true,
                    speed: 1,
                    size_min: 0.1,
                    sync: false,
                  },
                },
                line_linked: {
                  enable: true,
                  distance: 120,
                  color: "#8b5cf6",
                  opacity: 0.15,
                  width: 1,
                },
                move: {
                  enable: true,
                  speed: 1,
                  direction: "none",
                  random: false,
                  straight: false,
                  out_mode: "out",
                  bounce: false,
                  attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200,
                  },
                },
              },
              interactivity: {
                detect_on: "canvas",
                events: {
                  onhover: {
                    enable: true,
                    mode: "bubble",
                  },
                  onclick: {
                    enable: true,
                    mode: "repulse",
                  },
                  resize: true,
                },
                modes: {
                  grab: {
                    distance: 140,
                    line_linked: {
                      opacity: 0.3,
                    },
                  },
                  bubble: {
                    distance: 200,
                    size: 4,
                    duration: 2,
                    opacity: 0.4,
                    speed: 3,
                  },
                  repulse: {
                    distance: 150,
                    duration: 0.4,
                  },
                  push: {
                    particles_nb: 4,
                  },
                  remove: {
                    particles_nb: 2,
                  },
                },
              },
              retina_detect: true,
            };

            (window as any).particlesJS("particles-js-upload", particlesConfig);
          }
        };

        script.onerror = () => {
          console.warn("Failed to load particles.js");
        };

        document.head.appendChild(script);

        return () => {
          if (document.head.contains(script)) {
            document.head.removeChild(script);
          }
        };
      } catch (error) {
        console.warn("Error loading particles:", error);
      }
    };

    loadParticles();
  }, []);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const droppedFile = acceptedFiles[0];
      setFile(droppedFile);
      setFileName(droppedFile.name);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!file) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Silakan pilih file untuk diupload.",
        background: "#1e293b",
        color: "#fff",
        confirmButtonColor: "#3b82f6",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);
      formData.append("category", category);

      if (category === "matkul") {
        formData.append("mataKuliah", mataKuliah);
        formData.append("semester", semester);
        formData.append("dosen", dosen);
      } else if (category === "umum") {
        formData.append("penerbit", penerbit);
        formData.append("tahun_terbit", tahunTerbit);
        formData.append("deskripsi", deskripsi);
      } else if (category === "jurnal") {
        formData.append("juduljurnal", judulJurnal);
        formData.append("penulisjurnal", penulisJurnal);
        formData.append("penerbitjurnal", penerbitJurnal);
        formData.append("tahunjurnal", tahunJurnal);
        formData.append("asaljurnal", asalJurnal);
      } else if (category === "tugas-akhir") {
        formData.append("judulta", judulTA);
        formData.append("namata", namaTA);
        formData.append("tahunta", tahunTA);
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
          background: "#1e293b",
          color: "#fff",
          confirmButtonColor: "#10b981",
        });

        setFile(null);
        setFileName("");
        setName("");
        setSemester("");
        setMataKuliah("");
        setDosen("");
        setCategory("matkul");
        setPenerbit("");
        setTahunTerbit("");
        setDeskripsi("");
        setJudulJurnal("");
        setPenulisJurnal("");
        setPenerbitJurnal("");
        setTahunJurnal("");
        setAsalJurnal("");
        setJudulTA("");
        setNamaTA("");
        setTahunTA("");

        fetchFiles();
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Terjadi kesalahan saat mengupload file.",
          background: "#1e293b",
          color: "#fff",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Gagal mengupload. Coba lagi.",
        background: "#1e293b",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSubmitting(false);
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
    const result = await Swal.fire({
      title: "Hapus File?",
      text: "File yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      background: "#1e293b",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch("/api/uploadmateri", {
          method: "DELETE",
          body: JSON.stringify({ file: fileName, category: category }),
          headers: { "Content-Type": "application/json" },
        });
        const result = await response.json();
        if (result.message === "File deleted successfully") {
          setFiles(files.filter((file) => file.name !== fileName));
          Swal.fire({
            icon: "success",
            title: "Terhapus!",
            text: "File berhasil dihapus.",
            background: "#1e293b",
            color: "#fff",
            confirmButtonColor: "#10b981",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: result.error,
            background: "#1e293b",
            color: "#fff",
            confirmButtonColor: "#ef4444",
          });
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal menghapus file.",
          background: "#1e293b",
          color: "#fff",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  const filteredFiles = files.filter((file) => {
    const search = searchQuery.toLowerCase();
    if (!search) return true;
    const check = (val?: string) => val?.toLowerCase().includes(search);
    return (
      check(file.name) ||
      check(file.mataKuliah) ||
      check(file.dosen) ||
      check(file.penerbit) ||
      check(file.judulJurnal) ||
      check(file.penulisJurnal) ||
      check(file.judulTA) ||
      check(file.namaTA) ||
      check(file.asalJurnal) ||
      check(file.deskripsi)
    );
  });

  const sortFiles = (files: any[], sortBy: string) => {
    let sorted = [...files];

    if (sortBy === "dateDesc") {
      sorted.sort(
        (a, b) =>
          new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime()
      );
    } else if (sortBy === "dateAsc") {
      sorted.sort(
        (a, b) =>
          new Date(a.uploadTime).getTime() - new Date(b.uploadTime).getTime()
      );
    } else if (sortBy === "alphaAsc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "alphaDesc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }

    return sorted;
  };

  const sortedFiles = sortFiles(filteredFiles, sortBy);

  const indexOfLastFile = currentPage * recordsPerPage;
  const indexOfFirstFile = indexOfLastFile - recordsPerPage;
  const currentFiles = sortedFiles.slice(indexOfFirstFile, indexOfLastFile);

  const totalPages = Math.ceil(sortedFiles.length / recordsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredFiles.length / recordsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleUpdateFile = (file: FileData) => {
    setSelectedFile(file);
    setUpdateFormData({
      name: file.name || "",
      mataKuliah: file.mataKuliah || "",
      semester: file.semester || "",
      dosen: file.dosen || "",
      penerbit: file.penerbit || "",
      tahunTerbit: file.tahunTerbit || "",
      deskripsi: file.deskripsi || "",
      judulJurnal: file.judulJurnal || "",
      penulisJurnal: file.penulisJurnal || "",
      penerbitJurnal: file.penerbitJurnal || "",
      tahunJurnal: file.tahunJurnal || "",
      asalJurnal: file.asalJurnal || "",
      judulTA: file.judulTA || "",
      namaTA: file.namaTA || "",
      tahunTA: file.tahunTA || "",
    });
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const updatedFile = {
        ...updateFormData,
        category,
        uploadTime: selectedFile?.uploadTime || new Date().toISOString(),
        fileName: selectedFile?.name,
      };

      const response = await fetch("/api/uploadmateri", {
        method: "PUT",
        body: JSON.stringify(updatedFile),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setIsUpdateModalOpen(false);
        fetchFiles();
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "File berhasil diupdate!",
          background: "#1e293b",
          color: "#fff",
          confirmButtonColor: "#10b981",
        });
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal mengupdate file!",
        background: "#1e293b",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const closeUpdateModal = () => setIsUpdateModalOpen(false);

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return "Unknown date";
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Unknown date";
    }

    try {
      return new Intl.DateTimeFormat("id-ID", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown date";
    }
  };

  const getShareUrl = (fileName: string): string => {
    return `${
      window.location.origin
    }/api/downloadmateri?file=${encodeURIComponent(
      fileName
    )}&category=${encodeURIComponent(category)}`;
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "matkul":
        return <FileText className="w-4 h-4" />;
      case "jurnal":
        return <FileText className="w-4 h-4" />;
      case "tugas-akhir":
        return <FileText className="w-4 h-4" />;
      case "umum":
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "matkul":
        return "from-blue-500 to-blue-600";
      case "jurnal":
        return "from-green-500 to-green-600";
      case "tugas-akhir":
        return "from-purple-500 to-purple-600";
      case "umum":
        return "from-orange-500 to-orange-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      <div
        id="particles-js-upload"
        className="absolute inset-0 w-full h-full z-0"
        ref={particlesRef}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-transparent z-10" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse z-10" />
      <div className="absolute bottom-32 right-10 w-48 h-48 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000 z-10" />

      <div className="relative z-20">
        <Header />

        <main className="container mx-auto px-4 py-8 mt-8">
          <div className="mb-8">
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-4 sm:p-8 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-lg opacity-30" />
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-slate-600/50 overflow-hidden">
                      <Image
                        src={
                          session?.user?.image ?? "https://i.pravatar.cc/300"
                        }
                        alt="User Avatar"
                        fill
                        sizes="(max-width: 640px) 64px, 80px"
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                      Welcome Back, {session?.user?.name?.split(" ")[0]}!
                    </h1>
                    <p className="text-slate-400 mt-1">
                      Manage your learning materials
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => signOut()}
                  className="group relative p-3 sm:p-4 bg-slate-800 hover:bg-red-600 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 border border-slate-600/50 hover:border-red-500/50 flex-shrink-0"
                >
                  <div className="absolute inset-0 bg-red-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <LogOut className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
                </button>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sm:p-8">
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                    <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      Upload Materi
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base">
                      Tambahkan materi pembelajaran baru
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">
                        Nama Materi
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Masukkan nama materi"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">
                        Kategori
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                      >
                        <option value="matkul">Mata Kuliah</option>
                        <option value="jurnal">Jurnal</option>
                        <option value="tugas-akhir">Tugas Akhir</option>
                        <option value="umum">Umum</option>
                      </select>
                    </div>

                    {category === "matkul" && (
                      <>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-slate-300">
                            Mata Kuliah
                          </label>
                          <input
                            type="text"
                            value={mataKuliah}
                            onChange={(e) => setMataKuliah(e.target.value)}
                            placeholder="Contoh: Dasar Sistem Informasi"
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-slate-300">
                            Semester
                          </label>
                          <input
                            type="text"
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                            placeholder="Contoh: 5"
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl"
                            required
                          />
                        </div>
                        <div className="space-y-2 lg:col-span-2">
                          <label className="block text-sm font-medium text-slate-300">
                            Nama Dosen
                          </label>
                          <input
                            type="text"
                            value={dosen}
                            onChange={(e) => setDosen(e.target.value)}
                            placeholder="Nama dosen pengampu"
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl"
                            required
                          />
                        </div>
                      </>
                    )}
                    {category === "jurnal" && (
                      <>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-slate-300">
                            Judul Jurnal
                          </label>
                          <input
                            type="text"
                            value={judulJurnal}
                            onChange={(e) => setJudulJurnal(e.target.value)}
                            placeholder="Masukkan judul jurnal"
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-slate-300">
                            Penulis
                          </label>
                          <input
                            type="text"
                            value={penulisJurnal}
                            onChange={(e) => setPenulisJurnal(e.target.value)}
                            placeholder="Nama penulis"
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-slate-300">
                            Penerbit
                          </label>
                          <input
                            type="text"
                            value={penerbitJurnal}
                            onChange={(e) => setPenerbitJurnal(e.target.value)}
                            placeholder="Nama penerbit"
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-slate-300">
                            Tahun
                          </label>
                          <input
                            type="text"
                            value={tahunJurnal}
                            onChange={(e) => setTahunJurnal(e.target.value)}
                            placeholder="Tahun terbit"
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl"
                            required
                          />
                        </div>
                        <div className="space-y-2 lg:col-span-2">
                          <label className="block text-sm font-medium text-slate-300">
                            Asal Tempat (Kampus)
                          </label>
                          <input
                            type="text"
                            value={asalJurnal}
                            onChange={(e) => setAsalJurnal(e.target.value)}
                            placeholder="Asal institusi"
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl"
                            required
                          />
                        </div>
                      </>
                    )}
                    {category === "tugas-akhir" && (
                      <>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-slate-300">
                            Judul TA
                          </label>
                          <input
                            type="text"
                            value={judulTA}
                            onChange={(e) => setJudulTA(e.target.value)}
                            placeholder="Masukkan judul tugas akhir"
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-slate-300">
                            Nama Mahasiswa
                          </label>
                          <input
                            type="text"
                            value={namaTA}
                            onChange={(e) => setNamaTA(e.target.value)}
                            placeholder="Nama mahasiswa"
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl"
                            required
                          />
                        </div>
                        <div className="space-y-2 lg:col-span-2">
                          <label className="block text-sm font-medium text-slate-300">
                            Tahun
                          </label>
                          <input
                            type="text"
                            value={tahunTA}
                            onChange={(e) => setTahunTA(e.target.value)}
                            placeholder="Tahun lulus"
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl"
                            required
                          />
                        </div>
                      </>
                    )}
                    {category === "umum" && (
                      <>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-slate-300">
                            Penerbit
                          </label>
                          <input
                            type="text"
                            value={penerbit}
                            onChange={(e) => setPenerbit(e.target.value)}
                            placeholder="Nama penerbit"
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-slate-300">
                            Tahun Terbit
                          </label>
                          <input
                            type="text"
                            value={tahunTerbit}
                            onChange={(e) => setTahunTerbit(e.target.value)}
                            placeholder="Contoh: 2024"
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl"
                            required
                          />
                        </div>
                        <div className="lg:col-span-2 space-y-2">
                          <label className="block text-sm font-medium text-slate-300">
                            Deskripsi
                          </label>
                          <textarea
                            value={deskripsi}
                            onChange={(e) => setDeskripsi(e.target.value)}
                            placeholder="Deskripsi singkat (max 50 karakter)"
                            maxLength={50}
                            rows={3}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl resize-none"
                            required
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">
                      Upload File
                    </label>
                    <div
                      {...getRootProps()}
                      className={`w-full p-6 sm:p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
                        isDragActive
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-slate-600/50 hover:border-blue-500/50 bg-slate-700/30 hover:bg-slate-700/50"
                      }`}
                    >
                      <input {...getInputProps()} required />
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
                          <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                          {isDragActive
                            ? "Drop file di sini"
                            : "Drag & drop file atau klik untuk memilih"}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          Mendukung format PDF, DOC, PPT, dan lainnya
                        </p>
                      </div>
                    </div>

                    {fileName && (
                      <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-green-400 font-medium">
                            File dipilih:
                          </p>
                          <p className="text-white text-sm truncate">
                            {fileName}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 disabled:shadow-none"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Mengupload...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        <span>Upload Materi</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-4 sm:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    File Management
                  </h2>
                  <p className="text-slate-400 text-sm sm:text-base">
                    Kelola file yang telah diupload ({filteredFiles.length}{" "}
                    files)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-800/50 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 mb-6 sm:mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berdasarkan nama, mata kuliah, dosen, semester..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                >
                  <option value="dateDesc">Terbaru</option>
                  <option value="dateAsc">Terlama</option>
                  <option value="alphaAsc">A-Z</option>
                  <option value="alphaDesc">Z-A</option>
                </select>

                <select
                  value={recordsPerPage}
                  onChange={(e) => setRecordsPerPage(Number(e.target.value))}
                  className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                >
                  <option value={10}>10 per halaman</option>
                  <option value={20}>20 per halaman</option>
                  <option value={50}>50 per halaman</option>
                </select>
              </div>
            </div>

            {currentFiles.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-300 mb-2">
                  Belum ada file
                </h3>
                <p className="text-slate-400">
                  Upload file pertama Anda untuk memulai
                </p>
              </div>
            ) : viewMode === "list" ? (
              <div className="space-y-4">
                {currentFiles.map((file, index) => (
                  <div
                    key={index}
                    className="group bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sm:p-6 hover:bg-slate-800/50 transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${getCategoryColor(
                            category
                          )} rounded-xl flex items-center justify-center flex-shrink-0`}
                        >
                          {getCategoryIcon(category)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white text-base sm:text-lg mb-1 truncate pr-2">
                            {file.name}
                          </h4>
                          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-400 mb-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="truncate">
                                {formatDate(file.uploadTime)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 lg:max-w-md">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                          {category === "matkul" && (
                            <>
                              <span>
                                <User size={14} className="inline mr-1" />
                                {file.dosen}
                              </span>
                              <span>
                                <FileText size={14} className="inline mr-1" />
                                {file.mataKuliah}
                              </span>
                              <span>Semester: {file.semester}</span>
                            </>
                          )}
                          {category === "jurnal" && (
                            <>
                              <span>
                                <File size={14} className="inline mr-1" />
                                {file.judulJurnal}
                              </span>
                              <span>
                                <User size={14} className="inline mr-1" />
                                {file.penulisJurnal}
                              </span>
                              <span>
                                <Building size={14} className="inline mr-1" />
                                {file.penerbitJurnal}
                              </span>
                              <span>
                                <Calendar size={14} className="inline mr-1" />
                                {file.tahunJurnal}
                              </span>
                              <span>
                                <Globe size={14} className="inline mr-1" />
                                {file.asalJurnal}
                              </span>
                            </>
                          )}
                          {category === "tugas-akhir" && (
                            <>
                              <span>
                                <File size={14} className="inline mr-1" />
                                {file.judulTA}
                              </span>
                              <span>
                                <User size={14} className="inline mr-1" />
                                {file.namaTA}
                              </span>
                              <span>
                                <Calendar size={14} className="inline mr-1" />
                                {file.tahunTA}
                              </span>
                            </>
                          )}
                          {category === "umum" && (
                            <>
                              <span>
                                <Building size={14} className="inline mr-1" />
                                {file.penerbit}
                              </span>
                              <span>
                                <Calendar size={14} className="inline mr-1" />
                                {file.tahunTerbit}
                              </span>
                              <span className="col-span-2">
                                {file.deskripsi}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-center lg:justify-end gap-2 flex-shrink-0">
                        <a
                          href={getShareUrl(file.name)}
                          download
                          className="group/btn relative p-2 sm:p-3 bg-slate-700/50 hover:bg-blue-600 text-slate-400 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-110"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => handleUpdateFile(file)}
                          className="group/btn relative p-2 sm:p-3 bg-slate-700/50 hover:bg-green-600 text-slate-400 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-110"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => deleteFile(file.name)}
                          className="group/btn relative p-2 sm:p-3 bg-slate-700/50 hover:bg-red-600 text-slate-400 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-110"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {currentFiles.map((file, index) => (
                  <div
                    key={index}
                    className="group bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sm:p-6 hover:bg-slate-800/50 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${getCategoryColor(
                          category
                        )} rounded-xl flex items-center justify-center flex-shrink-0`}
                      >
                        {getCategoryIcon(category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-sm sm:text-base truncate">
                          {file.name}
                        </h4>
                        <p className="text-xs text-slate-400 truncate">
                          {formatDate(file.uploadTime)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 text-xs sm:text-sm">
                      {category === "matkul" && (
                        <>
                          <p className="truncate">
                            <FileText size={12} className="inline mr-1.5" />
                            {file.mataKuliah}
                          </p>
                          <p className="truncate">
                            <User size={12} className="inline mr-1.5" />
                            {file.dosen}
                          </p>
                          <p>Semester: {file.semester}</p>
                        </>
                      )}
                      {category === "jurnal" && (
                        <>
                          <p className="truncate">
                            <File size={12} className="inline mr-1.5" />
                            {file.judulJurnal}
                          </p>
                          <p className="truncate">
                            <User size={12} className="inline mr-1.5" />
                            {file.penulisJurnal}
                          </p>
                          <p className="truncate">
                            <Building size={12} className="inline mr-1.5" />
                            {file.penerbitJurnal}
                          </p>
                          <p className="truncate">
                            <Calendar size={12} className="inline mr-1.5" />
                            {file.tahunJurnal}
                          </p>
                          <p className="truncate">
                            <Globe size={12} className="inline mr-1.5" />
                            {file.asalJurnal}
                          </p>
                        </>
                      )}
                      {category === "tugas-akhir" && (
                        <>
                          <p className="truncate">
                            <File size={12} className="inline mr-1.5" />
                            {file.judulTA}
                          </p>
                          <p className="truncate">
                            <User size={12} className="inline mr-1.5" />
                            {file.namaTA}
                          </p>
                          <p className="truncate">
                            <Calendar size={12} className="inline mr-1.5" />
                            {file.tahunTA}
                          </p>
                        </>
                      )}
                      {category === "umum" && (
                        <>
                          <p className="truncate">
                            <User size={12} className="inline mr-1.5" />
                            {file.penulis}
                          </p>
                          <p className="truncate">
                            <Building size={12} className="inline mr-1.5" />
                            {file.penerbit}
                          </p>
                          <p className="truncate">
                            <Calendar size={12} className="inline mr-1.5" />
                            {file.tahunTerbit}
                          </p>
                          <p className="line-clamp-2">{file.deskripsi}</p>
                        </>
                      )}
                    </div>

                    <div className="flex justify-center gap-2">
                      <a
                        href={getShareUrl(file.name)}
                        download
                        className="p-2 bg-slate-700/50 hover:bg-blue-600 text-slate-400 hover:text-white rounded-lg transition-all duration-300"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => handleUpdateFile(file)}
                        className="p-2 bg-slate-700/50 hover:bg-green-600 text-slate-400 hover:text-white rounded-lg transition-all duration-300"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => deleteFile(file.name)}
                        className="p-2 bg-slate-700/50 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg transition-all duration-300"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
          </div>
        </main>

        {isUpdateModalOpen && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900/95 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl">
                    <Edit3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      Update Materi
                    </h3>
                    <p className="text-slate-400 text-sm sm:text-base">
                      Edit informasi file yang dipilih
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeUpdateModal}
                  className="p-2 sm:p-3 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form
                onSubmit={handleUpdateSubmit}
                className="p-6 sm:p-8 space-y-6"
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">
                      Nama Materi{" "}
                      <span className="text-slate-500">
                        (jangan ubah ekstensi file)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={updateFormData.name}
                      onChange={(e) =>
                        setUpdateFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                      placeholder="Masukkan nama materi"
                      required
                    />
                  </div>

                  {category === "matkul" && (
                    <>
                      <div className="space-y-2">
                        <label>Mata Kuliah</label>
                        <input
                          type="text"
                          value={updateFormData.mataKuliah}
                          onChange={(e) =>
                            setUpdateFormData({
                              ...updateFormData,
                              mataKuliah: e.target.value,
                            })
                          }
                          className="w-full bg-slate-700 p-2 rounded-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <label>Semester</label>
                        <input
                          type="text"
                          value={updateFormData.semester}
                          onChange={(e) =>
                            setUpdateFormData({
                              ...updateFormData,
                              semester: e.target.value,
                            })
                          }
                          className="w-full bg-slate-700 p-2 rounded-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <label>Dosen</label>
                        <input
                          type="text"
                          value={updateFormData.dosen}
                          onChange={(e) =>
                            setUpdateFormData({
                              ...updateFormData,
                              dosen: e.target.value,
                            })
                          }
                          className="w-full bg-slate-700 p-2 rounded-md"
                        />
                      </div>
                    </>
                  )}
                  {category === "jurnal" && (
                    <>
                      <div className="space-y-2">
                        <label>Judul Jurnal</label>
                        <input
                          type="text"
                          value={updateFormData.judulJurnal}
                          onChange={(e) =>
                            setUpdateFormData({
                              ...updateFormData,
                              judulJurnal: e.target.value,
                            })
                          }
                          className="w-full bg-slate-700 p-2 rounded-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <label>Penulis</label>
                        <input
                          type="text"
                          value={updateFormData.penulisJurnal}
                          onChange={(e) =>
                            setUpdateFormData({
                              ...updateFormData,
                              penulisJurnal: e.target.value,
                            })
                          }
                          className="w-full bg-slate-700 p-2 rounded-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <label>Penerbit</label>
                        <input
                          type="text"
                          value={updateFormData.penerbitJurnal}
                          onChange={(e) =>
                            setUpdateFormData({
                              ...updateFormData,
                              penerbitJurnal: e.target.value,
                            })
                          }
                          className="w-full bg-slate-700 p-2 rounded-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <label>Tahun</label>
                        <input
                          type="text"
                          value={updateFormData.tahunJurnal}
                          onChange={(e) =>
                            setUpdateFormData({
                              ...updateFormData,
                              tahunJurnal: e.target.value,
                            })
                          }
                          className="w-full bg-slate-700 p-2 rounded-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <label>Asal Tempat</label>
                        <input
                          type="text"
                          value={updateFormData.asalJurnal}
                          onChange={(e) =>
                            setUpdateFormData({
                              ...updateFormData,
                              asalJurnal: e.target.value,
                            })
                          }
                          className="w-full bg-slate-700 p-2 rounded-md"
                        />
                      </div>
                    </>
                  )}
                  {category === "tugas-akhir" && (
                    <>
                      <div className="space-y-2">
                        <label>Judul TA</label>
                        <input
                          type="text"
                          value={updateFormData.judulTA}
                          onChange={(e) =>
                            setUpdateFormData({
                              ...updateFormData,
                              judulTA: e.target.value,
                            })
                          }
                          className="w-full bg-slate-700 p-2 rounded-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <label>Nama Mahasiswa</label>
                        <input
                          type="text"
                          value={updateFormData.namaTA}
                          onChange={(e) =>
                            setUpdateFormData({
                              ...updateFormData,
                              namaTA: e.target.value,
                            })
                          }
                          className="w-full bg-slate-700 p-2 rounded-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <label>Tahun</label>
                        <input
                          type="text"
                          value={updateFormData.tahunTA}
                          onChange={(e) =>
                            setUpdateFormData({
                              ...updateFormData,
                              tahunTA: e.target.value,
                            })
                          }
                          className="w-full bg-slate-700 p-2 rounded-md"
                        />
                      </div>
                    </>
                  )}
                  {category === "umum" && (
                    <>
                      <div className="space-y-2">
                        <label>Penerbit</label>
                        <input
                          type="text"
                          value={updateFormData.penerbit}
                          onChange={(e) =>
                            setUpdateFormData({
                              ...updateFormData,
                              penerbit: e.target.value,
                            })
                          }
                          className="w-full bg-slate-700 p-2 rounded-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <label>Tahun Terbit</label>
                        <input
                          type="text"
                          value={updateFormData.tahunTerbit}
                          onChange={(e) =>
                            setUpdateFormData({
                              ...updateFormData,
                              tahunTerbit: e.target.value,
                            })
                          }
                          className="w-full bg-slate-700 p-2 rounded-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <label>Deskripsi</label>
                        <textarea
                          value={updateFormData.deskripsi}
                          onChange={(e) =>
                            setUpdateFormData({
                              ...updateFormData,
                              deskripsi: e.target.value,
                            })
                          }
                          className="w-full bg-slate-700 p-2 rounded-md resize-none"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-700/50">
                  <button
                    type="button"
                    onClick={closeUpdateModal}
                    className="flex-1 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25"
                  >
                    Update Materi
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default UploadMateri;
