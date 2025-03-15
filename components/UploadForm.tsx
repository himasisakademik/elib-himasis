// app/components/UploadForm.tsx
import React, { useState } from 'react';

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [semester, setSemester] = useState('');
  const [dosen, setDosen] = useState('');
  const [category, setCategory] = useState('matkul');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('semester', semester);
    formData.append('dosen', dosen);
    formData.append('category', category);
    formData.append('file', file); // Append the file

    const response = await fetch('/api/route', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (result.message === 'File uploaded successfully') {
      alert('File uploaded successfully!');
    } else {
      alert('Error uploading file');
    }
  };

  return (
    <section className="bg-gray-900 text-white py-16 px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-primary mb-8">Upload Materi</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Materi"
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
          <input
            type="text"
            name="semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            placeholder="Semester"
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
          <input
            type="text"
            name="dosen"
            value={dosen}
            onChange={(e) => setDosen(e.target.value)}
            placeholder="Nama Dosen"
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          >
            <option value="matkul">Mata Kuliah</option>
            <option value="jurnal">Jurnal</option>
            <option value="tugas-akhir">Tugas Akhir</option>
          </select>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
          >
            Upload
          </button>
        </form>
      </div>
    </section>
  );
};

export default UploadForm;
