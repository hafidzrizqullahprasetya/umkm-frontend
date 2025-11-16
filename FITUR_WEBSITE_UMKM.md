# Rangkuman Fitur dan Rencana Pengembangan Website UMKM

Dokumen ini merangkum fitur-fitur utama yang telah diimplementasikan dalam platform website UMKM serta rencana pengembangan untuk masa depan.

---

## 🚀 Fitur Utama Website Saat Ini (Existing Features)

### 1. Pencarian dan Visualisasi Data UMKM
- **Tampilan Peta Interaktif (`MapView.tsx`):** Fitur sentral yang memungkinkan pengguna melihat persebaran lokasi UMKM secara geografis, memudahkan pencarian UMKM terdekat.
- **Tampilan Daftar dan Grid (`UmkmListCard.tsx`, `UmkmGridCard.tsx`):** Pengguna dapat memilih cara menampilkan data UMKM, baik dalam format daftar yang informatif maupun format grid yang visual.
- **Halaman Detail UMKM (`[slug]/page.tsx`):** Setiap UMKM memiliki halaman khusus yang menampilkan informasi lengkap seperti deskripsi usaha, galeri foto, alamat, dan kontak.

### 2. Sistem Autentikasi dan Manajemen Pengguna
- **Registrasi & Login (`login/page.tsx`, `register/page.tsx`):** Pengguna (khususnya pemilik UMKM) dapat membuat akun dan masuk ke sistem.
- **Manajemen Sesi dengan NextAuth (`[...nextauth]/route.ts`):** Menggunakan standar industri untuk mengelola sesi login pengguna secara aman.

### 3. Dashboard Khusus untuk Pemilik UMKM
- **Manajemen Data UMKM (CRUD):** Pemilik UMKM memiliki akses ke dashboard (`DashboardPage.tsx`) untuk mengelola informasi usaha mereka (membuat, membaca, memperbarui, menghapus data).
- **Formulir Input Data (`UmkmFormModal.tsx`):** Antarmuka modal yang intuitif untuk menambah atau mengedit data UMKM tanpa perlu berpindah halaman.

### 4. Panel Kontrol Admin
- **Halaman Admin (`admin/page.tsx`):** Terdapat halaman khusus yang dipersiapkan untuk administrator guna mengawasi dan mengelola seluruh data di platform (pengguna dan UMKM).

### 5. Arsitektur Modern dan Skalabel
- **Backend Terpisah (Node.js & Express):** API service (`be-mia-umkm`) yang terpisah dari frontend, memungkinkan pengembangan yang lebih fleksibel dan terstruktur.
- **Frontend Modern (Next.js & TypeScript):** Dibangun dengan teknologi terkini untuk performa tinggi, SEO-friendly, dan pengalaman pengguna yang cepat.

---

## ✨ Rencana Pengembangan Website ke Depan (Future Development)

### 1. Meningkatkan Interaksi Pengguna
- **Sistem Rating dan Ulasan:** Mengizinkan pelanggan untuk memberikan rating (bintang 1-5) dan menulis ulasan pada halaman detail UMKM untuk membangun kepercayaan dan kredibilitas.
- **Fitur "Favorit" atau "Simpan":** Memungkinkan pengguna untuk menyimpan daftar UMKM yang mereka sukai untuk dikunjungi kembali di lain waktu.

### 2. Fitur Pencarian dan Filter yang Lebih Canggih
- **Filter Berdasarkan Kategori:** Menambahkan filter untuk menyaring UMKM berdasarkan kategori usaha (misalnya: Kuliner, Fashion, Kerajinan, Jasa).
- **Filter Berdasarkan Rating dan Popularitas:** Memfilter UMKM berdasarkan ulasan terbaik atau yang paling sering dikunjungi.
- **Pencarian Berbasis Produk/Layanan:** Memungkinkan pengguna mencari tidak hanya nama UMKM, tetapi juga produk atau layanan spesifik yang mereka tawarkan.

### 3. Memberdayakan Pemilik UMKM
- **Dashboard Analitik Sederhana:** Memberikan pemilik UMKM wawasan dasar seperti: jumlah pengunjung halaman, jumlah klik ke kontak/media sosial, dan performa rating.
- **Manajemen Katalog Produk/Layanan:** Fitur bagi pemilik UMKM untuk mengunggah dan mengelola daftar produk atau layanan mereka lengkap dengan harga dan deskripsi.
- **Fitur Promosi:** Memungkinkan pemilik UMKM untuk membuat dan menampilkan pengumuman promo, diskon, atau event khusus di halaman mereka.

### 4. Ekspansi Platform dan Teknologi
- **Sistem Rekomendasi Cerdas:** Mengembangkan algoritma untuk merekomendasikan UMKM kepada pengguna berdasarkan lokasi, riwayat pencarian, dan preferensi mereka.
- **Integrasi Notifikasi:** Mengirimkan notifikasi (email atau push notification) kepada pengguna tentang promo dari UMKM favorit atau adanya UMKM baru yang relevan di sekitar mereka.
- **Pengembangan Progressive Web App (PWA):** Meningkatkan pengalaman mobile dengan membuat website dapat "di-install" di homescreen smartphone, serta dapat diakses secara offline.
