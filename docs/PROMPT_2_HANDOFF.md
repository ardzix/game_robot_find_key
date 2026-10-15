# Sumber konteks Prompt 2

Workspace utama: `C:\Users\ardzi\Documents\ChatGPT\Arif PA Local\robot-cari-kunci`.

Kegiatan TK Arkana: 16 Oktober 2026, 09.00–10.00 WIB, guru tamu Om Arif. Tahap ini hanya persiapan; persona diskusi anak belum aktif. Game bukan dibuat dari nol saat anak berdiskusi.

Baca berurutan: `config/FEATURE_MANIFEST.json`, `config/CLASS_CONFIG_SCHEMA.json`, `config/DEFAULT_CONFIG.json`, `config/CLASS_STATE.json`, `docs/PANDUAN_GURU.md`, `docs/LEVELS.md`, `docs/QA_REPORT.md`, `docs/CHECKPOINT.md`. Source aktual mengatasi perbedaan dokumentasi; jangan menambah klaim tanpa uji.

Game diperluas atas permintaan Om Arif menjadi **50 diorama Three.js lokal**, TK A 1–6, TK B 7–12, SD 1 13–18, SD 2 19–24, SD 3 25–30, SD 4 31–36, SD 5 37–43, SD 6 44–50. Kamera tetap, lima kartu (maju relatif hidung, kiri, kanan, ambil, buka). Mulai level 31 ada blok **Ulangi 2–4×**, isi 1–12 kartu dasar, tanpa bersarang. Ambil/buka wajib petak sama, arah bebas. Maksimum 64 kartu/blok dan 256 aksi setelah dijabarkan. Gagal aman menjeda. Antrean diedit → papan kembali awal. Reset mempertahankan antrean. Config mendukung level siap pakai, antrean/blok, mode langkah dan suara. Tidak mendukung peta baru atau pemindahan benda.

Jalankan paket lewat `MULAI.cmd`; alamat `http://127.0.0.1:4186`. Tidak membuka index.html langsung. Browser manual selalu tersedia. Alat browser berhasil dipakai saat persiapan, tetapi ketersediaannya di sesi berikutnya harus diverifikasi lagi. Jangan menganggap bisa mengendalikan TV atau mendengar speaker.

Sesudah Prompt 2 aktif: catat pilihan/prediksi tanpa identitas sebagai rancangan. **Hanya Om Arif** dengan frasa persis **“Ayo om pit eksekusi buat game nya”** mengizinkan penerapan konfigurasi yang disepakati dan uji/bermain. Ini penerapan ke skeleton yang sama. Pengujian persiapan bukan izin sesi kelas.

Panel Guru menyediakan Kunci sesi kelas, Simpan rancangan, kolom izin, Izinkan rencana ini, serta ekspor CLASS_STATE. Rancangan browser tidak otomatis menimpa `config/CLASS_STATE.json`; ekspor/unduhan diperlukan untuk menyimpan hasil ke berkas. File baseline masih kosong dan berstatus rancangan. Nilai default tetap usulan, belum keputusan anak. Catat ide di luar manifest untuk nanti.

Source tersedia di **https://github.com/ardzix/game_robot_find_key**. Versi web pada **https://game-robot-find-key.vercel.app** sudah diuji setelah perbaikan deploy statis Vercel; pengujian dan batasannya ada di QA_REPORT. Paket lokal tetap tersedia untuk kelas tanpa internet. Rancangan dan tanda selesai di browser lokal dan alamat Vercel memakai origin berbeda, sehingga penyimpanan tidak otomatis dibagikan.

Tidak ada izin pembelian, akun baru, instalasi skill, atau penggunaan identitas anak. Checkpoint tiga level sebelum perluasan dipertahankan; versi terbaru memakai 50 level. Pelaksanaan kelas tetap mengikuti frasa izin Om Arif.
