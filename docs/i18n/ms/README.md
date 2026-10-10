[Bahasa Melayu](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Dokumen ini ialah terjemahan mesin bagi teks projek awam dan belum semuanya disemak oleh penutur asli. Rujuk sumber Inggeris atau Cina untuk kesamaran teknikal. Tiada data pengguna peribadi disertakan.

# MacBook Pro Studio

Imej tempatan, sembang dan studio video percubaan untuk Apple Silicon Mac.

## Bahasa antara muka

Gunakan menu bahasa di bahagian atas sebelah kanan untuk memilih daripada bahasa 33. Penyemak imbas mengingati pilihan anda. Pek bahasa dihidangkan secara tempatan; menukar bahasa tidak menghantar kandungan ke perkhidmatan terjemahan dalam talian. Gesaan pengguna, perbualan dan kandungan yang disimpan mengekalkan bahasa asalnya.

## Pratonton antara muka

Pratonton ini menggunakan gaya halaman yang dikeluarkan. Semua gesaan, ID tugas, cap masa, ilustrasi dan perbualan adalah kandungan demo fiksyen yang dibuat untuk README ini. Ia tidak mengandungi akaun sebenar, imej pengguna atau rekod sembang. Ilustrasi dilukis secara atur cara, bukan penanda aras model atau tuntutan kualiti.

### Studio imej

Pilih model, masukkan gesaan dan semak imbas tugas dan hasil imej.

![Studio imej dengan tugasan fiksyen dan ilustrasi landskap yang dilukis secara aturcara](../../images/image-studio-demo.en.png)

### Sembang tempatan

Berbual dalam studio yang sama dan pilih mod dan panjang respons.

![Sembang tempatan dengan perbualan perancangan ilustrasi fiksyen yang ditulis secara manual](../../images/chat-studio-demo.en.png)

## Sediakan Mac baharu

1. Klon repositori ini.
2. Baca [panduan penggunaan](README-FIRST.txt) ([中文](../../../README-先读我.txt)).
3. Berikan [promo pemasangan](INSTALL-PROMPT.txt) ([中文](../../../INSTALL-PROMPT.txt)) kepada pembantu pengekodan pada Mac sasaran untuk memasang kebergantungan dan memuat turun models yang sesuai untuk perkakasan itu.

Halaman: `/edit` untuk imej, `/chat` untuk sembang, `/video` untuk video. Port web lalai ialah `1235`.

Repositori ini ialah salinan keluaran dan migrasi yang disemak. Ia mungkin ketinggalan daripada pembangunan atau pengeluaran tempatan. Ia tidak termasuk berat model, persekitaran maya, tugas pengguna, rekod sembang, imej rujukan dan konfigurasi akaun. Pemasangan lengkap pada mesin baru belum disahkan. Ini bukan aplikasi satu klik.

## Kandungan repositori

- `src/`: bahagian hadapan, hujung belakang, manifes model, alat pemasangan dan pengesahan.
- `tests/`: ujian; sesetengahnya memerlukan models yang dipasang atau menjalankan perkhidmatan.
- `requirements/`: kebergantungan disematkan.
- `vendor/`: sumber enjin asli, dengan lesen huluan dikekalkan.
- `patches/`: versi disematkan dan penyesuaian Apple.

Model dan sumber pihak ketiga mengekalkan lesen huluan mereka. H3/ClipProj Sokongan Apple adalah percubaan. Sampel pendek yang berjaya tidak mewujudkan sokongan untuk setiap resolusi atau tempoh.

## Log masuk dan akaun

Pada Mac yang menjalankan perkhidmatan, buka `http://127.0.0.1:1235/setup` untuk mencipta pentadbir pertama, kemudian log masuk daripada peranti lain. Pentadbir boleh membuat, melumpuhkan dan memadam akaun serta menetapkan semula kata laluan. Lihat [dokumentasi akaun](accounts.md) ([中文](../../accounts.md)). Tiada kata laluan lalai. Fail akaun kekal dalam direktori data runtime dan tidak boleh dimuat naik. Tugas kekal berkongsi data studio.

## Viggle v0.3

Mod butiran enam langkah dan sembilan langkah yang berasingan tersedia, dengan lalai sebelumnya dikekalkan. Lihat [pemasangan dan pengesahan](viggle-v03.md) ([中文](../../viggle-v03.md)). Muat turun berat model secara berasingan pada Mac sasaran.
