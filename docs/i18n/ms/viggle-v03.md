[Bahasa Melayu](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Dokumen ini ialah terjemahan mesin bagi teks projek awam dan belum semuanya disemak oleh penutur asli. Rujuk sumber Inggeris atau Cina untuk kesamaran teknikal. Tiada data pengguna peribadi disertakan.

# Pemasangan dan mod Viggle v0.3

Sumber rasmi: https://huggingface.co/Viggle/Qwen-Image-2.1-viggle-turbo

Semakan, saiz dan cincang yang disematkan: `src/viggle_turbo_v03_model.json`. Pemasang: `src/install_viggle_turbo_v03.py`. Menggunakan direktori `models/viggle-qwen-turbo-v03` yang berasingan semasa berkongsi model asas yang dipasang dan persekitaran Python sedia ada. Ia tidak menaik taraf kebergantungan atau menulis ganti v0.1/v0.2.1.

Menu model imej menawarkan:

- **Viggle v0.3 · 6 langkah, imej yang lebih bersih**: jadual sigma enam-node rasmi, CFG1.
- **Viggle v0.3 · 9 langkah, butiran dipertingkatkan**: tujuh langkah Turbo, kemudian nyahdayakan LoRA, tukar pas KV cache seterusnya kepada pengekstrakan dan gunakan model asas untuk dua langkah terakhir. LoRA dan tingkah laku hadapan dipulihkan selepas itu. Sekadar menetapkan kiraan langkah biasa kepada sembilan tidak bersamaan.

v0.3 menyokong sehingga tiga rujukan, tiada gesaan negatif dan lalai segi empat sama 1024px apabila dipilih. Dimensi lalai dan iPhone v0.2.1 sebelumnya kekal; model asal masih menyokong sepuluh rujukan. Saiz besar asli, jubin VAE dan pemprosesan pasca 8K sedia ada kekal boleh dipilih, tetapi tidak setiap kombinasi telah diuji.

LoRA tidak digabungkan ke dalam pemberat BF16; kekuatan ialah 1. Penjadual `shift_terminal` mestilah null. v0.3 boleh menjadi kurang berbutir tetapi lebih lembut sedikit; ia tidak dijamin untuk mengatasi versi lama dalam setiap kes. Nisbah pemasaan sembilan langkah rasmi bukan penanda aras tempatan.

## Pengesahan

`tests/viggle_model.mjs` menggunakan lekapan model jarang terpencil untuk mengesahkan kiraan langkah, had rujukan, penghalaan bersaiz besar dan penanda kesediaan. `tests/viggle_schedule.py` mengesahkan pelumpuhan LoRA selepas langkah ketujuh, satu pengekstrakan semula dan pemulihan KV.

Sampel cawan biru 512 enam langkah ×512, benih-42 dilengkapkan dalam 52.98 termasuk pemuatan process/model. Dimensi dan imej sebenar telah diperiksa. Percubaan sembilan langkah pertama berhenti apabila sambungan teks baharu mencetuskan perlindungan sumber; ini bukan ralat inferens.

Percubaan semula sembilan langkah selesai dalam 65.42s di 512×512, benih 42. Ia bertukar kepada model asas selepas langkah tujuh, menyelesaikan sembilan langkah dan menghasilkan dimensi yang betul. Pemeriksaan visual mendapati tiada bunyi green/magenta. Satu sampel setiap mod bukanlah penanda aras prestasi yang stabil. Rujukan berbilang, imej besar dan pemprosesan pasca 8K tidak disahkan oleh larian tersebut.
