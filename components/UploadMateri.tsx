"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import Image from "next/image";
import Swal from "sweetalert2";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { signOut } from "next-auth/react";

const UploadMateri = ({ session }: { session: any }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [name, setName] = useState("");
  const [semester, setSemester] = useState("");
  const [dosen, setDosen] = useState("");
  const [category, setCategory] = useState("matkul");

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
    formData.append("name", name);
    formData.append("semester", semester);
    formData.append("dosen", dosen);
    formData.append("category", category);
    formData.append("file", file);

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
    } else {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat mengupload file.",
      });
    }
  };

  return (
    <div className="bg-gray-900 text-white">
      <Header />
      <section className="bg-gray-900 py-16 px-8">
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
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
            >
              Logout
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Materi"
              className="w-full p-4 border border-gray-300 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="Semester"
              className="w-full p-4 border border-gray-300 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="dosen"
              value={dosen}
              onChange={(e) => setDosen(e.target.value)}
              placeholder="Nama Dosen"
              className="w-full p-4 border border-gray-300 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="matkul">Mata Kuliah</option>
              <option value="jurnal">Jurnal</option>
              <option value="tugas-akhir">Tugas Akhir</option>
            </select>

            <div
              {...getRootProps()}
              className="w-full p-4 border border-gray-300 rounded-lg bg-gray-700 text-white cursor-pointer flex items-center justify-center"
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
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default UploadMateri;
