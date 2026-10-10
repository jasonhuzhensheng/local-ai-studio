Bahasa Indonesia | ../README.md
Dokumen-dokumen ini adalah terjemahan mesin dari teks proyek publik dan belum semuanya ditinjau oleh penutur asli. Konsultasikan dengan sumber berbahasa Inggris atau Cina untuk mengetahui ambiguitas teknis. Tidak ada data pengguna pribadi yang disertakan.

Local AI Studio: paket sumber migrasi untuk Mac Apple Silicon baru

Rilis yang ditinjau ini mencakup sumber frontend/backend, pengujian, manifes unduhan model, dependensi yang disematkan, sumber mesin asli, dan patch video eksperimental Apple. Hal ini mungkin tertinggal dibandingkan pembangunan atau produksi lokal.
Ini tidak termasuk bobot, lingkungan virtual, tugas sebelumnya, gambar referensi, catatan obrolan, konfigurasi akun, dan rahasia. Ini bukan app sekali klik.

Berikan seluruh folder ini ke asisten pengkodean di Mac target, bersama dengan INSTALL-PROMPT.en.txt.
Mesin validasi asli adalah M2 Max dengan memori 96GB. Periksa model target, memori dan OS terlebih dahulu. Jangan menggunakan kembali pengaturan video secara membabi buta pada Mac dengan memori lebih rendah.

Isi:
 src/ Frontend, backend, alat download/validation, manifes model
 Tes tests/; ada pula yang memerlukan models/services. terinstal. Jangan menjalankan semua sembarangan
 requirements/viggle-pinned.txt Lingkungan gambar yang disematkan
 src/h3_requirements.lock Pisahkan lingkungan video yang disematkan
 vendor/ Sumber asli tanpa biner terkompilasi; mempertahankan lisensi hulu
 patches/ ComfyUI/ClipProj melakukan dan menerapkan perubahan Python
 SHA256SUMS.txt Checksum per file

Titik masuk model: image_models.json (Qwen GGUF), viggle_turbo_model.json / viggle_turbo_v021_model.json / viggle_turbo_v03_model.json (basis model/adapters), wai_model.json, upscale_model.json dan h3_apple_models.json (video), di bawah src/. Periksa setiap manifes dan penginstalnya sebelum mengunduh.
Model teks: huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF, file Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf. Paket ini tidak termasuk revision/hash lengkap yang disematkan untuk model tersebut. Dapatkan dan catat metadata upstream tepercaya terlebih dahulu; jangan mengklaim kesetaraan byte-demi-byte dengan mesin aslinya.

Instalasi mesin baru belum divalidasi. Tinjau jalur mesin asli, alias model, dan jalur alat sistem untuk pengguna target. Jangan menerapkan kembali patch historis ke sumber vendor yang sudah dimodifikasi. Pengunduhan yang berhasil bukanlah bukti keberhasilan kesimpulan atau kualitas yang dapat diterima.

Gunakan menu bahasa di kanan atas untuk memilih bahasa 33. Browser mengingat pilihan Anda. Paket bahasa disajikan secara lokal; beralih bahasa tidak mengirimkan konten ke layanan terjemahan online. Perintah pengguna, percakapan, dan konten yang disimpan tetap menggunakan bahasa aslinya.
