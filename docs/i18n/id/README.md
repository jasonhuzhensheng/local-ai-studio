[Bahasa Indonesia](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Dokumen-dokumen ini adalah terjemahan mesin dari teks proyek publik dan belum semuanya ditinjau oleh penutur asli. Konsultasikan dengan sumber berbahasa Inggris atau Cina untuk mengetahui ambiguitas teknis. Tidak ada data pengguna pribadi yang disertakan.

# MacBook Pro Studio

Studio gambar, obrolan, dan video eksperimental lokal untuk Apple Silicon Mac.

## Bahasa antarmuka

Gunakan menu bahasa di kanan atas untuk memilih bahasa 33. Browser mengingat pilihan Anda. Paket bahasa disajikan secara lokal; beralih bahasa tidak mengirimkan konten ke layanan terjemahan online. Perintah pengguna, percakapan, dan konten yang disimpan tetap menggunakan bahasa aslinya.

## Pratinjau antarmuka

Pratinjau ini menggunakan gaya halaman yang dirilis. Semua petunjuk, ID tugas, stempel waktu, ilustrasi, dan percakapan adalah konten demo fiktif yang dibuat untuk README ini. Mereka tidak berisi akun nyata, gambar pengguna, atau catatan obrolan. Ilustrasi digambar secara terprogram, bukan tolok ukur model atau klaim kualitas.

### Studio gambar

Pilih model, masukkan prompt dan telusuri tugas dan hasil gambar.

![Studio gambar dengan tugas fiksi dan ilustrasi lanskap yang digambar secara terprogram](../../images/image-studio-demo.en.png)

### Obrolan lokal

Ngobrol di studio yang sama dan pilih mode dan durasi respons.

![Obrolan lokal dengan percakapan perencanaan ilustrasi fiksi yang ditulis secara manual](../../images/chat-studio-demo.en.png)

## Siapkan Mac baru

1. Kloning repositori ini.
2. Baca [panduan penerapan](README-FIRST.txt) ([中文](../../../README-先读我.txt)).
3. Berikan [prompt instalasi](INSTALL-PROMPT.txt) ([中文](../../../INSTALL-PROMPT.txt)) ke asisten pengkodean pada Mac target untuk menginstal dependensi dan mengunduh models yang sesuai untuk perangkat keras tersebut.

Halaman: `/edit` untuk gambar, `/chat` untuk chat, `/video` untuk video. Port web defaultnya adalah `1235`.

Repositori ini adalah salinan rilis dan migrasi yang telah ditinjau. Hal ini mungkin tertinggal dibandingkan pembangunan atau produksi lokal. Ini tidak termasuk bobot model, lingkungan virtual, tugas pengguna, rekaman obrolan, gambar referensi, dan konfigurasi akun. Instalasi lengkap pada mesin baru belum divalidasi. Ini bukan aplikasi sekali klik.

## Isi repositori

- `src/`: frontend, backend, manifes model, alat instalasi dan validasi.
- `tests/`: tes; beberapa memerlukan models yang terinstal atau menjalankan layanan.
- `requirements/`: dependensi yang disematkan.
- `vendor/`: sumber mesin asli, dengan lisensi upstream dipertahankan.
- `patches/`: versi yang disematkan dan adaptasi Apple.

Model dan sumber pihak ketiga mempertahankan lisensi upstreamnya. H3/ClipProj Dukungan Apple bersifat eksperimental. Sampel singkat yang berhasil tidak memberikan dukungan untuk setiap resolusi atau durasi.

## Masuk dan akun

Di Mac yang menjalankan layanan, buka `http://127.0.0.1:1235/setup` untuk membuat administrator pertama, lalu masuk dari perangkat lain. Administrator dapat membuat, menonaktifkan dan menghapus akun serta mengatur ulang kata sandi. Lihat [dokumentasi akun](accounts.md) ([中文](../../accounts.md)). Tidak ada kata sandi default. File akun tetap berada di direktori data runtime dan tidak boleh diunggah. Tugas tetap menjadi data studio bersama.

## Viggle v0.3

Tersedia mode detail enam langkah dan sembilan langkah terpisah, dengan default sebelumnya dipertahankan. Lihat [instalasi dan validasi](viggle-v03.md) ([中文](../../viggle-v03.md)). Unduh bobot model secara terpisah di Mac target.
