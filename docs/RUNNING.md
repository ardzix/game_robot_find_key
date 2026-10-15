# Menjalankan Robot Cari Kunci

Paket disiapkan untuk kegiatan 16 Oktober 2026, 09.00–10.00 WIB. Semua kode dan aset permainan berada di folder ini. Server hanya mendengar di komputer sendiri (`127.0.0.1`), tanpa login, CDN, API, atau unduhan saat bermain.

## Mulai di Windows

1. Ekstrak seluruh ZIP ke folder lokal yang dapat ditulis. Jangan menjalankan dari pratinjau ZIP.
2. Sambungkan TV melalui HDMI dan pilih keluaran suara yang benar di Windows.
3. Klik dua kali **MULAI.cmd**. Launcher memakai `runtime/node.exe` yang sudah dibundel, membuka server tersembunyi, lalu browser default ke **http://127.0.0.1:4186**.
4. Klik **Mulai** di halaman untuk membuka audio. Gunakan browser desktop Edge atau Chrome dengan JavaScript, WebGL, dan Web Audio aktif.
5. Seusai kelas tutup halaman dan jalankan **BERHENTI.cmd** untuk menghentikan server yang dimulai launcher ini.

Jangan membuka `index.html` langsung: modul JavaScript memerlukan server HTTP lokal. Server tidak memerlukan internet dan mengirim semua berkas dengan cache dimatikan. Tidak ada instalasi atau unduhan otomatis. Jika runtime hilang, launcher mencari Node yang sudah terpasang; bila tidak ada, launcher memberi pesan gagal.

Jika browser default tidak mendukung WebGL, salin alamat lokal tersebut ke Edge/Chrome. Windows 10/11 64-bit diperlukan untuk runtime Windows x64 yang dibundel. Aktifkan akselerasi grafis browser dan gunakan driver grafis yang mendukung WebGL. Kinerja pada laptop/TV kelas sebenarnya wajib dicoba.

## Perintah terminal yang setara

Dari PowerShell pada folder paket:

```powershell
.\runtime\node.exe .\server.mjs
```

Buka `http://127.0.0.1:4186` secara manual. Terminal itu menampilkan pesan sukses bila server sudah mendengar; tekan Ctrl+C untuk berhenti. Bila port sedang dipakai, hentikan server paket lama terlebih dahulu. `MULAI.cmd` akan memakai ulang server dari folder paket yang sama.

## Pemeriksaan sebelum kelas

- Matikan koneksi Wi-Fi/Ethernet secara manual, tutup halaman lama, jalankan launcher, lalu muat ulang halaman. Selesaikan beberapa level yang akan dipakai di kelas. Pengujian otomatis memblokir request eksternal pada seluruh 50 level; itu tidak menggantikan percobaan mematikan jaringan fisik pada perangkat kelas.
- Klik **Pilih level** dan pilih kelompok TK A, TK B, atau SD 1–6. Pastikan robot, arah hadap, petak, kunci, peti, penghalang, dan antrean terlihat jelas pada TV dari kursi anak. Untuk kelas TK ini mulai dari kelompok TK A; 50 level adalah koleksi bertahap, bukan target satu sesi.
- Klik Mulai; dengarkan musik, langkah, putaran, kunci, peti terkunci, dan perayaan. Coba mute serta dua volume terpisah. Mulai dengan volume TV rendah dan atur bersama orang dewasa.
- Coba layar penuh browser (F11), zoom 100%, input mouse/trackpad, dan koneksi HDMI. Keyboard sistem/F11 bukan bagian game.
- Coba **Jalankan**, **Jeda**, **Satu langkah**, **Reset level**, **Kosongkan**, dan pindah level. Pastikan pemulihan setelah rute salah tidak menghukum anak.

## Checkpoint dan pemulihan

Checkpoint menyimpan salinan penuh ke subfolder baru bernama waktu unik beserta SHA-256 setiap berkas. Pembuatan tidak menimpa versi lama:

```powershell
.\runtime\node.exe .\scripts\checkpoint.mjs
```

Untuk memulihkan, **hentikan server lama**, lalu pulihkan ke folder baru yang belum ada. Ganti nama checkpoint dengan yang tercantum dalam paket:

```powershell
.\runtime\node.exe .\scripts\checkpoint.mjs --restore '.\checkpoints\NAMA_CHECKPOINT' --to '..\robot-cari-kunci-pulih'
```

Perintah memeriksa hash sebelum setiap penyalinan dan menolak menimpa folder tujuan yang sudah ada. Jalankan `MULAI.cmd` dari folder baru. Snapshot tidak mengandung log/PID server, cache dependensi pengembang, atau checkpoint rekursif. File konfigurasi dan CLASS_STATE ikut tersalin. Jika pemulihan berhenti karena hash tidak cocok, simpan versi lama dan gunakan ulang checkpoint yang utuh; jangan mengganti hash agar terlihat lulus.

Pemeriksaan referensi aset lokal:

```powershell
.\runtime\node.exe .\scripts\check-assets.mjs
```

Hasil `ok: true` berarti referensi statis yang dikenali tersedia; bukti lengkap tetap memerlukan pengujian browser dan laporan QA.
