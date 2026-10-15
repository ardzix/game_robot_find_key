# Laporan QA — 50 level

Pengujian persiapan pada 15 Oktober 2026, Windows x64. Node lokal/bundel 16.16.0 untuk server dan tes logika; Chrome 155.0.8059.80 melalui Playwright pada runtime pengembangan. Browser berjalan headless dengan software WebGL. Ini bukti eksekusi game lokal, bukan uji coba anak atau perangkat kelas.

## Hasil langsung

| Area | Hasil | Bukti |
| --- | --- | --- |
| Aturan, peta, solusi, konfigurasi, pengulangan | 65/65 lulus | `tests/engine.test.mjs` |
| MIDI, score, WAV, lifecycle audio | 4/4 lulus | `tests/audio.test.mjs` |
| Browser seluruh koleksi | 50/50 berhasil membuka peti | [all50-browser-report.json](evidence/all50-browser-report.json) |
| Animasi produksi tanpa percepatan | 9/9 level: 1, 7, 13, 19, 25, 31, 37, 44, 50 | Laporan all50 yang sama |
| Kontrol dasar, kegagalan, spam, reset, pause, step, audio, reload | 21/21 lulus | [browser-report.json](evidence/browser-report.json) |
| Pemilih jenjang, composer pengulangan, batas validasi | 8/8 kelompok pemeriksaan lulus | [loop-controls-report.json](evidence/loop-controls-report.json) |
| Level 31–50 dengan antrean biasa tanpa blok | 20/20 lulus | Laporan loop-controls yang sama |
| Kontrol guru, contoh, impor/ekspor, fullscreen | 12/12 lulus | [teacher-tools-report.json](evidence/teacher-tools-report.json) |
| Rancangan, izin kelas, pembatalan animasi, reload | 9/9 lulus | [class-controls-report.json](evidence/class-controls-report.json) |
| Ukuran layar dan pemulihan scroll antrean | 8/8 lulus | [visual-report.json](evidence/visual-report.json) |
| Server lokal dan jalur permintaan tidak valid | 8/8 lulus | `tests/server.test.mjs` |
| Checkpoint dan pemulihan non-destruktif | 4/4 lulus | `tests/checkpoint.test.mjs` |
| Launcher start, reuse, stop, restart; aset lokal | Lulus | [packaging-report.json](evidence/packaging-report.json) |

Laporan browser seluruh koleksi memakai percepatan **khusus skrip tes**: durasi gerakan diubah menjadi 12 ms agar 50 rute dapat ditelusuri lengkap. Renderer, antrean, engine, reset dan kondisi menang tetap dijalankan. Tes 20 rute biasa SD 4–6 memakai percepatan yang sama. Sembilan level perwakilan memakai animasi produksi: 650 ms per instruksi dan 1650 ms saat berhasil. Level 50 menjalankan 57 aksi dan selesai sekitar 44 detik pada renderer perangkat lunak. Tidak mengklaim semua 50 level diuji dengan durasi normal.

Pencarian BFS terpisah memeriksa posisi, arah dan kepemilikan kunci serta panjang solusi optimum 3–57 aksi. Ada 50 skenario berbeda dan 44 susunan penghalang berbeda; beberapa papan awal kosong atau pola koridor digunakan kembali dengan posisi objek berbeda. Program contoh pengulangan mengembang menjadi solusi biasa yang sama. Urutan kesulitan mengikuti konsep; saat Ulangi diperkenalkan di SD 4, rute kembali lebih pendek agar konsep baru bisa dipelajari.

## Audio, offline, dan tampilan

AudioContext belum ada sebelum klik Mulai. Sesudah gestur, musik dan delapan efek menghasilkan sinyal nonnol pada Analyser Web Audio; mute menekan sinyal hampir nol. Kontrol volume terpisah, pause/resume audio, dan percobaan ulang saat context suspended diuji. MIDI format 1 valid, 186 nada berpasangan note-on/off, 104 BPM; pratinjau WAV PCM valid dan tidak clipping. Ini pemeriksaan data dan sinyal browser, **bukan mendengarkan speaker fisik**. Penjelasan serta file: [AUDIO.md](AUDIO.md).

Browser memakai konteks baru, semua host eksternal diblokir, dan server mengirim `no-store`. Halaman memuat sembilan request lokal, tanpa request eksternal atau error JavaScript. Reload tetap dapat dimainkan. Ini tidak bergantung pada cache internet. Server, library Three.js, model prosedural, ikon, score dan runtime tersedia lokal; tidak ada npm install saat bermain.

Halaman diuji pada 1366×768 dan 1920×1080. Level 1, 31 dan 50 muat tanpa overflow halaman. Antrean panjang memiliki area gulir internal, otomatis mengikuti aksi yang berjalan, dan kembali ke awal setelah reset/penerapan konfigurasi. Screenshot final: [TK A](evidence/final-level-01-1366x768.png), [SD 4](evidence/final-level-31-1366x768.png), [SD 6](evidence/final-level-50-1366x768.png).

## Temuan yang diperbaiki

- Kunci sesi saat animasi berjalan kini membatalkan aksi tertunda dan mempertahankan state terakhir yang sudah selesai; callback lama tidak boleh mengubah state baru.
- Otorisasi konfigurasi setelah reload tetap meminta tombol Mulai untuk audio. Context suspended memiliki tombol Mulai audio. Mengizinkan rencana tidak otomatis menjalankan game.
- Editor yang berbeda dari rancangan tersimpan harus disimpan lagi sebelum diizinkan, sehingga rencana yang diterapkan sesuai yang terlihat guru.
- Kamera diperbesar untuk kejelasan dan kunci pada petak robot digeser secara visual agar tetap terlihat. Aturan koordinat tetap petak yang sama.
- Scroll antrean yang terbawa saat ganti level/reset diperbaiki dan diuji ulang melalui delapan pemeriksaan visual.

Pada tes composer sempat ada kegagalan skrip QA karena skrip memasukkan isi blok lewat API antrean biasa. Skrip diperbaiki memakai klik kartu UI sebenarnya; delapan pemeriksaan akhir lulus. Laporan akhir yang disertakan adalah hasil lulus, bukan screenshot kegagalan skrip lama. Tidak ada bug produk terbuka yang diketahui dari cakupan tes ini.

## Belum diuji dan batas penggunaan

- Wi-Fi/Ethernet **belum dimatikan secara fisik**. Lakukan cold reload dari paket pada perangkat kelas dengan jaringan dimatikan sesuai [RUNNING.md](RUNNING.md).
- TV/HDMI, jarak kursi anak, speaker, volume nyaman dan kinerja GPU laptop kelas belum diperiksa secara fisik. Resolusi screenshot bukan bukti keterbacaan dari belakang kelas.
- Belum diuji pada komputer Windows lain, browser lain, atau perangkat seluler. Paket runtime ditujukan Windows 10/11 x64 dengan Chrome/Edge dan WebGL.
- Pembagian jenjang adalah usulan pedagogis; belum diuji bersama guru/anak atau disertifikasi kurikulum. Guru memilih level sesuai kesiapan anak. Tidak perlu menyelesaikan 50 level dalam satu jam.
- Kunci sesi merupakan alur kerja, bukan autentikasi pengguna atau pengenal suara. Frasa izin pada tes hanya digunakan dalam konteks browser QA terisolasi, bukan izin pelaksanaan kelas.
- Penyimpanan browser bersifat lokal pada origin/profil tersebut; CLASS_STATE harus diekspor untuk menjadi berkas. Baseline berkas tidak mengandung keputusan atau identitas anak.

## Menjalankan ulang

### Perbaikan deploy statis Vercel

Log deployment awal menunjukkan `FUNCTION_INVOCATION_FAILED` dengan `ReferenceError: document is not defined`: modul browser `app.js` dijalankan sebagai fungsi Node. Repo sekarang menetapkan `framework: null`, perintah build statis, dan output `dist` melalui `vercel.json`. Build menyalin tepat 14 berkas game/aset/lisensi (sekitar 2,69 MB), tanpa server, runtime Windows, atau data kelas.

Delapan pemeriksaan lokal lulus pada output yang sama: HTML dan modul JavaScript dilayani sebagai berkas, seluruh 50 definisi level tersedia, audio menunggu klik Mulai, level 1 selesai pada durasi normal, level 31/50 selesai dengan percepatan 12 ms khusus tes, dan reload berhasil tanpa error browser/request eksternal. Source: `tests/static-deploy.browser.test.mjs`; [laporan](evidence/static-deploy-report.json). Pemeriksaan ini menguji output statis secara lokal; hasil deployment Vercel harus diperiksa terpisah pada commit terbaru.

Jalankan `MULAI.cmd`, lalu perintah tes di README. Untuk tes browser pengembangan, sediakan Playwright pada `PLAYWRIGHT_PATH` dan Chrome pada `BROWSER_PATH`; jalankan sumber `tests/*.test.mjs` yang terkait dengan Node modern. Playwright tidak diperlukan untuk menjalankan game. Source tes dan bukti disertakan agar hasil dapat ditinjau.

Checkpoint menyimpan source/aset/runtime beserta hash SHA-256, mengecualikan cache, log server dan fixture tes. Pemulihan wajib ke folder baru; hash korup dan tujuan yang sudah ada ditolak. ZIP dibuat melalui `scripts/package.ps1` dengan pemeriksaan daftar isi dan hash arsip. Ikuti [CHECKPOINT.md](CHECKPOINT.md) untuk pemulihan.
