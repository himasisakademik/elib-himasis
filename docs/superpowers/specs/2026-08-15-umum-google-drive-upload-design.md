# Kategori Umum dengan Google Drive

## Tujuan
Menyamakan mekanisme upload dan update kategori `umum` dengan `matkul` menggunakan link Google Drive, tanpa memutus akses data kategori `umum` lama.

## Perubahan
- Form upload dan modal update kategori `umum` menampilkan input link Google Drive.
- API upload memvalidasi field berdasarkan kategori.
- Metadata baru menyimpan `gdriveUrl` dan `downloadUrl` hasil ekstraksi Google Drive.
- Respons upload menggunakan status sukses yang konsisten untuk semua kategori aktif.
- Metadata lama tanpa link tetap mendapat fallback endpoint download lokal.

## Batasan
- Kategori aktif tetap `matkul` dan `umum`.
- Format link mengikuti mekanisme Google Drive yang sudah digunakan.
- Tidak ada dependency baru atau migrasi data lama.

## Verifikasi
- Validasi field kategori `umum` dan `matkul`.
- Build production.
- Lint dan pemeriksaan diff.
