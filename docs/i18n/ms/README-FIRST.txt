Bahasa Melayu | ../README.md
Dokumen ini ialah terjemahan mesin bagi teks projek awam dan belum semuanya disemak oleh penutur asli. Rujuk sumber Inggeris atau Cina untuk kesamaran teknikal. Tiada data pengguna peribadi disertakan.

Local AI Studio: pakej sumber penghijrahan untuk Mac Apple Silicon baharu

Keluaran yang disemak ini termasuk sumber frontend/backend, ujian, manifes muat turun model, kebergantungan yang disematkan, sumber enjin asli dan tampung video Apple percubaan. Ia mungkin ketinggalan daripada pembangunan atau pengeluaran tempatan.
Ia tidak termasuk pemberat, persekitaran maya, tugas sebelumnya, imej rujukan, rekod sembang, konfigurasi akaun dan rahsia. Ia bukan satu klik app.

Berikan keseluruhan folder ini kepada pembantu pengekodan pada Mac sasaran, bersama-sama dengan INSTALL-PROMPT.en.txt.
Mesin pengesahan asal ialah M2 Max dengan memori 96GB. Semak model sasaran, memori dan OS terlebih dahulu. Jangan gunakan semula tetapan video secara membuta tuli pada Mac memori rendah.

kandungan:
 src/ Bahagian hadapan, bahagian belakang, alat download/validation, manifes model
 Ujian tests/; sesetengahnya memerlukan models/services. dipasang Jangan jalankan semua secara sembarangan
 requirements/viggle-pinned.txt Persekitaran imej yang disematkan
 src/h3_requirements.lock Persekitaran video disematkan berasingan
 vendor/ Sumber asli tanpa binari tersusun; mengekalkan lesen huluan
 patches/ ComfyUI/ClipProj melakukan dan menggunakan perubahan Python
 SHA256SUMS.txt Jumlah semak setiap fail

Titik masuk model: image_models.json (Qwen GGUF), viggle_turbo_model.json / viggle_turbo_v021_model.json / viggle_turbo_v03_model.json (base model/adapters), wai_model.json, upscale_model.json dan h3_apple_models.json (video), di bawah src/. Semak setiap muat turun dan pemasangnya.
Model teks: huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF, fail Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf. Pakej ini tidak termasuk revision/hash yang disematkan lengkap untuk model tersebut. Dapatkan dan rekod metadata huluan yang dipercayai terlebih dahulu; jangan tuntut kesetaraan bait-untuk-bait dengan mesin asal.

Pemasangan mesin baru belum disahkan. Semak laluan mesin asal, alias model dan laluan alat sistem untuk pengguna sasaran. Jangan gunakan semula tampung sejarah kepada sumber vendor yang telah diubah suai. Muat turun yang berjaya bukanlah bukti inferens yang berjaya atau kualiti yang boleh diterima.

Gunakan menu bahasa di bahagian atas sebelah kanan untuk memilih daripada bahasa 33. Penyemak imbas mengingati pilihan anda. Pek bahasa dihidangkan secara tempatan; menukar bahasa tidak menghantar kandungan ke perkhidmatan terjemahan dalam talian. Gesaan pengguna, perbualan dan kandungan yang disimpan mengekalkan bahasa asalnya.
