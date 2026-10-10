[Bahasa Indonesia](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Dokumen-dokumen ini adalah terjemahan mesin dari teks proyek publik dan belum semuanya ditinjau oleh penutur asli. Konsultasikan dengan sumber berbahasa Inggris atau Cina untuk mengetahui ambiguitas teknis. Tidak ada data pengguna pribadi yang disertakan.

# Akun situs web

## Penggunaan

Di Mac yang menjalankan layanan, buka `http://127.0.0.1:1235/setup` untuk membuat administrator pertama. Nama pengguna berisi huruf, angka, garis bawah, atau tanda hubung 3–32 dan dinormalisasi menjadi huruf kecil. Kata sandi berisi karakter 12–128. Tidak ada kredensial default. Perangkat jarak jauh tidak dapat mengklaim akun administrator awal.

Setelah penyiapan, perangkat yang tidak diautentikasi akan melihat halaman masuk. Buka **Akun / Keluar** (`/account`) untuk mengubah kata sandi atau keluar. Administrator dapat membuat users/administrators, mereset kata sandi, akun disable/enable, mengubah peran dan menghapus akun. Penghapusan dan perubahan izin memerlukan konfirmasi. Server mencegah penghapusan, penonaktifan, atau penurunan pangkat administrator yang terakhir diaktifkan. Menghapus akun tidak menghapus tugas bersama.

Gunakan menu bahasa di kanan atas untuk memilih bahasa 33. Browser mengingat pilihan Anda. Paket bahasa disajikan secara lokal; beralih bahasa tidak mengirimkan konten ke layanan terjemahan online. Perintah pengguna, percakapan, dan konten yang disimpan tetap menggunakan bahasa aslinya.

Ini adalah studio bersama. Pengguna yang masuk berbagi akses ke gambar, video, dan tugas obrolan sisi server. Riwayat obrolan browser tetap di localStorage. Tidak ada isolasi multi-penyewa, penyimpanan tugas per pengguna, atau penagihan. Pembatasan video lokal saja masih berlaku.

## Penyimpanan dan perlindungan

- `src/studio_auth.mjs` berjalan sebelum rute bisnis, termasuk API dan file image/reference/video. Pengalihan halaman yang tidak diautentikasi dengan 303; API dan media mengembalikan 401. Aset akun, aset bahasa, dan status setup/sign-in non-rahasia bersifat publik.
- File akun: `LOCAL_IMAGE_DATA_DIR/auth/users.json`, default `app/.local/auth/users.json`; penerapan khusus menggunakan `runtime/auth/users.json`. Mode direktori: 0700; modus berkas: 0600. Kata sandi menggunakan scrypt N32768/r8/p1, garam acak dan perbandingan hash waktu konstan. Penulisan bersifat atomik dan perubahan akun diserialkan. Basis data yang rusak mencegah startup daripada membuka kembali pendaftaran.
- Sesi menggunakan byte acak 32; server hanya menyimpan intisari. Cookie adalah HttpOnly, SameSite=Strict, berlaku untuk jam 12. Memulai ulang memerlukan masuk lagi. Password/role mengubah, menyetel ulang, menonaktifkan, dan menghapus mencabut sesi yang terpengaruh. Keluar tidak akan menghapus atau menjalankan kembali tugas yang sudah dimulai.
- Penulisan memerlukan Origin dan JSON asal yang sama. X-Forwarded-For tidak dipercaya. Setiap IP sumber mendapatkan upaya 15 sign-in/setup/self-password-change paling banyak per 15 menit. Batasan: 4 derivasi kata sandi bersamaan dan akun 100. Memulai ulang akan menghapus batas upaya.
- Penerapan yang ada menggunakan HTTP melalui Tailscale pribadi. Tailscale mengenkripsi transportasi perangkat-ke-perangkat; LAN HTTP biasa sendiri tidak. Akses publik dan TLS tidak dikonfigurasi oleh paket ini. Cookie Secure disetel hanya untuk permintaan TLS asli. Jangan memaparkannya secara langsung melalui HTTP publik.
- Jangan pernah mengunggah database otentikasi, sesi, atau kata sandi. Inisialisasi akun baru saat bermigrasi. stdio MCP, LM Studio lokal, dan izin file OS berada di luar otentikasi situs web.

## Validasi

Jalankan `node tests/studio_auth.mjs` dengan database akun sementara dan tanpa models asli. Ini mencakup pemblokiran API/media yang tidak diautentikasi, pembatasan asal pengaturan awal, peran, mode kata sandi hashing/file, perlindungan administrator terakhir, pencabutan sesi, persistensi, penolakan file yang rusak, dan batas kecepatan.

Pengujian local_chat, chat_background, image_studio, dan video_web masuk dengan administrator pengujian yang terisolasi; tidak ada jalan pintas otentikasi produksi. Kata sandi asli dimasukkan oleh pengguna dan tidak boleh disimpan dalam pengujian atau dokumentasi.
