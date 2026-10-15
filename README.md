# Robot Cari Kunci — 50 level TK A sampai SD kelas 6

Game 3D lokal untuk belajar urutan instruksi, arah relatif, sebab-akibat, debugging, dan pengulangan. **50 peta tetap** dibagi menjadi delapan jenjang, dari tugas tiga aksi sampai labirin dengan rute 57 aksi. Semua level terbuka. Jenjang merupakan panduan kesulitan, bukan tes atau sertifikasi kurikulum.

Disiapkan sebelum kegiatan TK Arkana bersama Om Arif, 16 Oktober 2026, pukul 09.00–10.00 WIB; lalu diperluas menjadi 50 level atas permintaan Om Arif. Default belum merupakan keputusan anak. Source: https://github.com/ardzix/game_robot_find_key. Versi lokal dapat dipakai tanpa internet; versi web dapat dideploy sebagai situs statis ke Vercel.

**Mulai:** ekstrak seluruh paket, klik `MULAI.cmd`, lalu klik **Mulai** di browser. Gunakan Chrome atau Edge di Windows 10/11 x64. Runtime Node sudah disertakan; tidak perlu npm install. Jangan membuka `index.html` langsung. Detail dan cara berhenti: [RUNNING](docs/RUNNING.md).

| Jenjang | Level | Fokus |
| --- | --- | --- |
| TK A | 1–6 | Maju, putar, urutan pendek |
| TK B | 7–12 | Mengambil kunci sebagai syarat |
| SD 1 | 13–18 | Arah hadap dan beberapa belokan |
| SD 2 | 19–24 | Rencana menuju kunci lalu peti |
| SD 3 | 25–30 | Membandingkan dan memperbaiki rute |
| SD 4 | 31–36 | Mengenal pola dan blok Ulangi |
| SD 5 | 37–43 | Menggabungkan blok dengan rute memutar |
| SD 6 | 44–50 | Membagi masalah, debugging, efisiensi program |

Lima kartu dasar: **Maju, Putar kiri, Putar kanan, Ambil kunci, Buka peti**. Ambil/buka harus pada petak yang sama. Mulai level 31 tersedia **Ulangi 2–4×** berisi 1–12 kartu dasar, tanpa pengulangan bersarang. Batas program: 64 kartu/blok dan 256 aksi setelah pengulangan dijabarkan. Mode Satu langkah menjalankan satu aksi dasar, termasuk di dalam blok. Kegagalan aman menjeda program tanpa hukuman.

## Deploy ke Vercel

Import repository ini dengan Root Directory `./`. `vercel.json` menetapkan Framework Preset **Other**, Build Command `node scripts/build-static.mjs`, Install Command kosong, dan Output Directory **dist**. Konfigurasi berkas ini mengatasi pengaturan otomatis framework/build di dashboard. Tidak diperlukan environment variable.

Build menyalin 14 berkas browser, aset dan lisensi ke `dist/`; server lokal dan runtime Windows tetap untuk paket offline. Jangan menjalankan `npm start` sebagai build/deployment Vercel. JavaScript game memerlukan `document` di browser; jika dianggap sebagai entrypoint fungsi Node, deployment gagal dengan `ReferenceError: document is not defined` / `FUNCTION_INVOCATION_FAILED`.

Untuk memperbaiki deployment lama, deploy commit terbaru yang berisi `vercel.json`; **Redeploy** commit lama tidak mengambil perbaikan dari Git. Jika Git integration aktif, push ke `main` akan membuat deployment baru. Jika melakukan deployment manual, pilih commit terbaru dari `main`. Hasil yang benar berupa static assets, tanpa fungsi Node untuk halaman `/`.

Verifikasi build lokal dengan `node scripts/build-static.mjs`. Folder `dist` dapat disajikan oleh static HTTP server apa pun; `app.js` dilayani sebagai file JavaScript, bukan dieksekusi di server. Sumber pengaturan: [Vercel project configuration](https://vercel.com/docs/project-configuration/vercel-json).

## Isi utama

| Kebutuhan | Berkas |
| --- | --- |
| Panduan mengajar, kontrol dan konfigurasi | [PANDUAN_GURU.md](docs/PANDUAN_GURU.md) |
| Peta, koordinat, arah dan solusi | [LEVELS.md](docs/LEVELS.md) |
| Hasil uji dan batasan nyata | [QA_REPORT.md](docs/QA_REPORT.md) |
| Kontrak fitur aktual | [FEATURE_MANIFEST.json](config/FEATURE_MANIFEST.json) |
| Field konfigurasi yang aman | [CLASS_CONFIG_SCHEMA.json](config/CLASS_CONFIG_SCHEMA.json) |
| Default usulan teruji | [DEFAULT_CONFIG.json](config/DEFAULT_CONFIG.json) |
| Catatan kelas awal, belum disetujui | [CLASS_STATE.json](config/CLASS_STATE.json) |
| Konteks lanjutan Prompt 2 | [PROMPT_2_HANDOFF.md](docs/PROMPT_2_HANDOFF.md) |
| Musik MIDI orisinal | [music.mid](assets/music.mid) |
| Audio lokal yang dapat didengar | [music-preview.wav](assets/music-preview.wav) |
| Cara sintesis suara di game | [AUDIO.md](docs/AUDIO.md) |
| Pemulihan versi dasar | [CHECKPOINT.md](docs/CHECKPOINT.md) |

Source: `app.js` (kontrol/antrean), `engine.js` (aturan murni), `levels.js` (peta tetap), `scene.js` (model dan animasi Three.js), `audio.js` (sintesis Web Audio), `index.html`, `style.css`. Semua model, ikon, teks dan komposisi dibuat khusus untuk paket ini. Three.js r169 disertakan lokal beserta lisensi MIT di `vendor/`; runtime Node lokal beserta lisensinya di `runtime/`. Font memakai font sistem, tidak mengunduh webfont.

Repository mempertahankan `LICENSE` GPL versi 2 yang sudah ada. Lisensi pihak ketiga tetap disertakan terpisah. Tidak ada akun, profil anak, analytics, iklan, API, CDN, atau generasi AI saat bermain. Tanda level selesai disimpan lokal tanpa identitas; semua level tetap dapat dipilih.

## Verifikasi lokal tanpa dependensi tambahan

Jalankan `MULAI.cmd` terlebih dahulu untuk tes server. Tes lain dapat dijalankan tanpa browser.

```powershell
.\runtime\node.exe tests\engine.test.mjs
.\runtime\node.exe tests\audio.test.mjs
.\runtime\node.exe tests\server.test.mjs
.\runtime\node.exe tests\checkpoint.test.mjs
.\runtime\node.exe scripts\check-assets.mjs
```

Tes browser pengembangan memakai Playwright yang telah tersedia pada mesin persiapan, terpisah dari dependensi game. Game dan server tidak memerlukan Playwright. Lihat laporan QA untuk versi browser, bukti, serta hal yang masih harus dicoba pada TV/speaker kelas.

Saat membuat ZIP dari source, `scripts/package.ps1` menyertakan runtime, source, aset dan checkpoint, lalu menguji daftar isi arsip. Berkas sementara tes dan cache npm tidak ikut. Checkpoint lokal/arsip ZIP tidak dilacak dalam Git; source yang sudah dikomit juga dapat dipulihkan dari commit tersebut.
