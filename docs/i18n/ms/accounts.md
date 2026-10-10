[Bahasa Melayu](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Dokumen ini ialah terjemahan mesin bagi teks projek awam dan belum semuanya disemak oleh penutur asli. Rujuk sumber Inggeris atau Cina untuk kesamaran teknikal. Tiada data pengguna peribadi disertakan.

# Akaun laman web

## Penggunaan

Pada Mac yang menjalankan perkhidmatan, buka `http://127.0.0.1:1235/setup` untuk mencipta pentadbir pertama. Nama pengguna mengandungi 3–32 huruf, digit, garis bawah atau sempang dan dinormalisasi kepada huruf kecil. Kata laluan mengandungi aksara 12–128. Tiada bukti kelayakan lalai. Peranti jauh tidak boleh menuntut akaun pentadbir awal.

Selepas persediaan, peranti yang tidak disahkan melihat halaman log masuk. Buka **Akaun / Log keluar** (`/account`) untuk menukar kata laluan anda atau log keluar. Pentadbir boleh membuat users/administrators, menetapkan semula kata laluan, akaun disable/enable, menukar peranan dan memadam akaun. Perubahan pemadaman dan kebenaran memerlukan pengesahan. Pelayan menghalang pemadaman, melumpuhkan atau menurunkan pentadbir terakhir yang didayakan. Memadamkan akaun tidak memadamkan tugas yang dikongsi.

Gunakan menu bahasa di bahagian atas sebelah kanan untuk memilih daripada bahasa 33. Penyemak imbas mengingati pilihan anda. Pek bahasa dihidangkan secara tempatan; menukar bahasa tidak menghantar kandungan ke perkhidmatan terjemahan dalam talian. Gesaan pengguna, perbualan dan kandungan yang disimpan mengekalkan bahasa asalnya.

Ini ialah studio kongsi. Pengguna yang dilog masuk berkongsi akses kepada imej, video dan tugas sembang sebelah pelayan. Sejarah sembang penyemak imbas kekal dalam localStorage. Tiada pengasingan berbilang penyewa, storan tugas setiap pengguna atau pengebilan. Sekatan video tempatan sahaja sedia ada kekal.

## Penyimpanan dan perlindungan

- `src/studio_auth.mjs` berjalan sebelum laluan perniagaan, termasuk API dan fail image/reference/video. Unauthenticated pages redirect with 303; APIs and media return 401. Aset akaun, aset bahasa dan status setup/sign-in bukan rahsia adalah awam.
- Account file: `LOCAL_IMAGE_DATA_DIR/auth/users.json`, default `app/.local/auth/users.json`; the dedicated deployment uses `runtime/auth/users.json`. Mod direktori: 0700; mod fail: 0600. Kata laluan menggunakan scrypt N32768/r8/p1, garam rawak dan perbandingan cincang masa tetap. Tulisan adalah atom dan perubahan akaun bersiri. Pangkalan data sedia ada yang rosak menghalang permulaan daripada membuka semula pendaftaran.
- Sessions use 32 random bytes; pelayan hanya menyimpan digest. Kuki ialah HttpOnly, SameSite=Strict, sah untuk jam 12. Memulakan semula memerlukan log masuk semula. Password/role menukar, menetapkan semula, melumpuhkan dan pemadaman membatalkan sesi yang terjejas. Mendaftar keluar tidak memadamkan atau menjalankan semula tugas yang telah dimulakan.
- Tulisan memerlukan Origin dan JSON asal yang sama. X-Forwarded-For tidak dipercayai. Setiap IP sumber mendapat paling banyak percubaan 15 sign-in/setup/self-password-change setiap 15 minit. Had: 4 terbitan kata laluan serentak dan akaun 100. Memulakan semula mengosongkan had percubaan.
- Arahan sedia ada menggunakan HTTP melalui Tailscale peribadi. Tailscale encrypts device-to-device transport; HTTP LAN biasa itu sendiri tidak. Akses awam dan TLS tidak dikonfigurasikan oleh pakej ini. Kuki Secure ditetapkan hanya untuk permintaan TLS asli. Jangan dedahkannya terus melalui HTTP awam.
- Jangan sekali-kali memuat naik pangkalan data pengesahan, sesi atau kata laluan. Mulakan akaun baharu apabila berhijrah. stdio MCP, LM Studio tempatan dan kebenaran fail OS adalah di luar pengesahan tapak web.

## Pengesahan

Jalankan `node tests/studio_auth.mjs` dengan pangkalan data akaun sementaranya dan tiada models sebenar. Ia meliputi penyekatan API/media yang tidak disahkan, sekatan asal persediaan awal, peranan, kata laluan mod hashing/file, perlindungan pentadbir terakhir, pembatalan sesi, kegigihan, penolakan fail rasuah dan had kadar.

Ujian local_chat, chat_background, image_studio dan video_web log masuk dengan pentadbir ujian terpencil; tiada pintasan pengesahan pengeluaran. Kata laluan sebenar dimasukkan oleh pengguna dan tidak boleh disimpan dalam ujian atau dokumentasi.
