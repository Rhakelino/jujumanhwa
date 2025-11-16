Ringkasan Proyek: Frontend Web Manhwa
Proyek ini adalah aplikasi web (React) client-side yang berfungsi sebagai viewer atau pembaca manhwa. Aplikasi ini akan mengambil semua data secara dinamis dari API eksternal yang sudah Anda sediakan. Karena API sudah lengkap, tidak ada backend atau database yang perlu dibuat.

Tujuan: Membuat antarmuka (UI) yang cepat, modern, dan mudah digunakan untuk membaca komik.

Tech Stack: Next.js (untuk routing dan rendering) & shadcn/ui (untuk komponen UI).

Fitur Utama
Berdasarkan endpoint API yang Anda berikan, berikut adalah fitur-fitur utama yang akan kita bangun:

Beranda (Daftar Terbaru)

Fungsi: Menampilkan daftar komik yang baru saja diperbarui.

Data: Menggunakan endpoint .../comic/terbaru.

UI: Tampilan grid yang berisi gambar sampul (cover), judul, dan chapter terbaru dari setiap komik.

Halaman Detail Komik

Fungsi: Menampilkan informasi lengkap tentang satu komik spesifik.

Data: Menggunakan endpoint .../comic/comic/[slug-komik].

UI: Halaman ini akan menampilkan gambar sampul, judul, sinopsis, genre, status (ongoing/completed), dan yang terpenting: daftar chapter yang bisa dibaca.

Halaman Baca (Reader)

Fungsi: Antarmuka utama untuk membaca komik.

Data: Menggunakan endpoint .../comic/chapter/[slug-chapter].

UI: Menampilkan gambar-gambar (panel) komik secara vertikal. Fitur wajib di sini adalah navigasi (Tombol "Chapter Berikutnya" dan "Chapter Sebelumnya") dan dropdown untuk melompat ke chapter lain.

Fitur Pencarian

Fungsi: Memungkinkan pengguna mencari komik berdasarkan judul.

Data: Menggunakan endpoint .../comic/search?q=[query].

UI: Membutuhkan Search Bar (biasanya di Navbar) dan halaman hasil pencarian yang menampilkan daftar komik yang cocok dalam format grid.

Implementasi Teknis (Next.js & shadcn)
Untuk mewujudkan fitur-fitur tersebut, ini adalah rencana teknis singkatnya:

1. Struktur Halaman (Next.js App Router):

app/page.tsx: Beranda (Fitur 1), akan fetch data dari /terbaru.

app/comic/[slug]/page.tsx: Halaman Detail Komik (Fitur 2). [slug] adalah nama komik (cth: it-all-starts-with...).

app/read/[...slug]/page.tsx: Halaman Reader (Fitur 3). Dibuat catch-all [...slug] agar bisa menangani format nama-komik-chapter-156.

app/search/page.tsx: Halaman Hasil Pencarian (Fitur 4), akan membaca query parameter dari URL (cth: ?q=naruto).

2. Komponen Utama (shadcn/ui):

Card (Card, CardContent, CardHeader): Akan digunakan untuk setiap item komik di halaman Beranda dan halaman Pencarian.

Input & Button: Untuk membangun Search Bar.

Badge: Untuk menampilkan label genre atau status komik di halaman Detail.

Select / DropdownMenu: Untuk navigasi pilihan chapter di halaman Reader.

Pagination: Jika halaman "Terbaru" memiliki lebih dari satu halaman.

Skeleton: Komponen penting untuk menampilkan loading state yang cantik saat data sedang diambil dari API.