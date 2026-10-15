# Checkpoint dan pemulihan

Ada dua tahap yang dipertahankan lokal: checkpoint tiga level sebelum perluasan, dan checkpoint final 50 level setelah QA. Folder `checkpoints/` memakai nama unik berbasis waktu UTC dan hash SHA-256 per berkas. Pembuatan selalu menambah folder baru dan tidak menimpa versi lama.

Versi sebelum perluasan: `checkpoints/baseline-2026-10-15T16-06-43-460Z-dc8028`. Ini salinan tiga level beserta bukti pengujian saat itu. Untuk penggunaan sekarang, pilih **checkpoint paling baru** yang berisi 50 level dan laporan QA final. ZIP final menyertakan checkpoint terbaru; Git menyimpan source melalui commit, tidak menyimpan duplikasi folder checkpoint.

## Pemulihan cepat tanpa mengganti berkas

Untuk rencana yang tidak sesuai saat persiapan, Guru → **Pulihkan default**. Ini mengembalikan level 1, awal `(0,2,E)`, antrean kosong, musik 20%, efek 45%. Tidak menjalankan otomatis. Jika JSON tidak valid, papan tidak berubah; perbaiki editor atau baca kembali `config/DEFAULT_CONFIG.json`. Saat sesi kelas dikunci, penerapan tetap memerlukan alur izin Om Arif.

## Pemulihan berkas ke folder baru

Hentikan server paket lama dengan `BERHENTI.cmd`. Dari PowerShell di folder paket, pilih checkpoint terbaru:

```powershell
$savedCheckpoint = Get-ChildItem -LiteralPath .\checkpoints -Directory | Sort-Object Name -Descending | Select-Object -First 1
.\runtime\node.exe .\scripts\checkpoint.mjs --restore $savedCheckpoint.FullName --to ..\robot-cari-kunci-pulih
```

Tujuan harus folder yang belum ada. Script memeriksa SHA-256 setiap berkas dan menolak menimpa folder tujuan yang sudah ada. Jika hash tidak cocok, pemulihan berhenti; jangan mengedit hash untuk memaksa lulus. Pakai checkpoint lain yang utuh atau source commit Git yang teruji. Jalankan `MULAI.cmd` dari folder hasil pemulihan.

LocalStorage adalah data browser, bukan bagian snapshot filesystem. Rancangan kelas dan tanda selesai yang sudah tersimpan tetap ada bila menggunakan origin browser yang sama. Ekspor CLASS_STATE dahulu; gunakan profil browser baru atau hapus hanya data situs `127.0.0.1:4186` untuk sesi bersih. Jangan menghapus seluruh data browser.

## Membuat checkpoint baru

```powershell
.\runtime\node.exe .\scripts\checkpoint.mjs
```

Tes pemulihan mencakup salinan versi lama setelah source berubah, penolakan target yang sudah ada, dan deteksi isi korup. Checkpoint final juga diverifikasi dengan hash sebelum paket dibuat. Tidak ada overwrite destruktif.
