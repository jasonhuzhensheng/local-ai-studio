[Bahasa Indonesia](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Dokumen-dokumen ini adalah terjemahan mesin dari teks proyek publik dan belum semuanya ditinjau oleh penutur asli. Konsultasikan dengan sumber berbahasa Inggris atau Cina untuk mengetahui ambiguitas teknis. Tidak ada data pengguna pribadi yang disertakan.

# Instalasi dan mode Viggle v0.3

Sumber resmi: https://huggingface.co/Viggle/Qwen-Image-2.1-viggle-turbo

Revisi, ukuran, dan hash yang disematkan: `src/viggle_turbo_v03_model.json`. Pemasang: `src/install_viggle_turbo_v03.py`. Menggunakan direktori `models/viggle-qwen-turbo-v03` terpisah sambil berbagi model dasar yang diinstal dan lingkungan Python yang ada. Itu tidak meningkatkan dependensi atau menimpa v0.1/v0.2.1.

Menu model gambar menawarkan:

- **Viggle v0.3 · Langkah 6, gambar lebih bersih**: jadwal sigma enam-node resmi, CFG1.
- **Viggle v0.3 · Langkah 9, detail yang ditingkatkan**: tujuh langkah Turbo, lalu nonaktifkan LoRA, alihkan pass KV cache berikutnya ke ekstraksi dan gunakan model dasar untuk dua langkah terakhir. LoRA dan perilaku maju dipulihkan setelahnya. Menyetel jumlah langkah biasa menjadi sembilan saja tidaklah setara.

v0.3 mendukung hingga tiga referensi, tidak ada prompt negatif dan default kotak 1024px saat dipilih. Default v0.2.1 dan dimensi iPhone sebelumnya tetap ada; model aslinya masih mendukung sepuluh referensi. Ukuran besar asli, ubin VAE, dan pasca-pemrosesan 8K yang ada tetap dapat dipilih, namun tidak semua kombinasi telah diuji.

LoRA tidak menyatu dengan bobot BF16; kekuatannya adalah 1. Penjadwal `shift_terminal` harus null. v0.3 tidak terlalu kasar tetapi sedikit lebih lembut; itu tidak dijamin akan mengungguli versi lama dalam setiap kasus. Rasio waktu sembilan langkah yang resmi bukanlah patokan lokal.

## Validasi

`tests/viggle_model.mjs` menggunakan perlengkapan model renggang yang terisolasi untuk memverifikasi jumlah langkah, batas referensi, perutean ukuran besar, dan penanda kesiapan. `tests/viggle_schedule.py` memverifikasi penonaktifan LoRA setelah langkah ketujuh, satu ekstraksi ulang dan pemulihan KV.

Sampel cangkir biru 512×512 enam langkah, seed-42 diselesaikan dalam 52.98 termasuk pemuatan process/model. Dimensi dan gambar sebenarnya diperiksa. Upaya sembilan langkah pertama berhenti ketika koneksi teks baru memicu perlindungan sumber daya; ini bukan kesalahan inferensi.

Percobaan ulang sembilan langkah diselesaikan dalam 65.42 di 512×512, unggulan 42. Ia beralih ke model dasar setelah langkah ketujuh, menyelesaikan sembilan langkah dan menghasilkan dimensi yang benar. Inspeksi visual tidak menemukan kebisingan green/magenta. Satu sampel per mode bukanlah tolok ukur kinerja yang stabil. Beberapa referensi, gambar besar, dan pasca-pemrosesan 8K tidak divalidasi oleh proses tersebut.
