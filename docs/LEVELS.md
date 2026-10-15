# Peta, solusi, dan konfigurasi 50 level Robot Cari Kunci

Sumber kebenaran: `levels.js` (50 peta tetap) dan `engine.js` (aturan/validasi). Dokumentasi ini dibuat dari data yang sama, lalu semua solusi diverifikasi oleh BFS independen dan simulasi engine. Tidak ada peta acak atau generasi saat kelas. Semua karakter, peta, musik, dan nama merupakan rancangan orisinal.

Perluasan 50 level dan pengulangan SD 4–6 diminta Om Arif. Jenjang merupakan usulan tingkat kesulitan; guru boleh memilih sesuai kebutuhan. Ini bukan klaim uji pembelajaran dengan anak atau kesesuaian kurikulum resmi. Tidak perlu menamatkan 50 level dalam satu pertemuan TK.

## Progresi konsep

| Jenjang | Level | Solusi terpendek (kartu biasa) | Fokus |
|---|---|---:|---|
| TK A | 1–6 | 3–7 | Urutan pendek, satu petak, dan arah hadap. |
| TK B | 7–12 | 7–12 | Kunci sebagai syarat, putaran, dan rute sederhana. |
| SD 1 | 13–18 | 16–19 | Prediksi, rute alternatif, dan memperbaiki satu kesalahan. |
| SD 2 | 19–24 | 18–24 | Membagi rute menjadi bagian sebelum dan sesudah mengambil kunci. |
| SD 3 | 25–30 | 22–28 | Membandingkan jalur dan menghitung langkah serta putaran. |
| SD 4 | 31–36 | 13–26 | Mengenali pola dan memakai blok Ulangi 2–4 kali tanpa loop bersarang. |
| SD 5 | 37–43 | 28–49 | Menggabungkan pengulangan dengan syarat kunci dan perjalanan kembali. |
| SD 6 | 44–50 | 38–57 | Merencanakan, menelusuri, dan menyederhanakan algoritma yang lebih panjang. |

Jumlah level: 6 + 6 + 6 + 6 + 6 + 6 + 7 + 7 = 50. Kesulitan tidak selalu bertambah menurut panjang solusi: pengenalan Ulangi di SD 4 sengaja kembali ke rute pendek berpola.

## Aturan yang selalu sama

- Koordinat `(x,y)` berbasis nol: x ke kanan, y ke bawah; baris y=0 di utara. Arah N=utara, E=timur, S=selatan, W=barat.
- **Maju** satu petak relatif hidung robot. **Putar kiri/kanan** 90° di tempat. Arah instruksi tidak berubah mengikuti kamera.
- **Ambil kunci** dan **Buka peti** harus berada di petak yang sama dengan objek. Arah hadap bebas. Melewati kunci tidak mengambilnya otomatis.
- Peti memerlukan kunci. Kunci/peti boleh ditempati robot. Batu dan batas peta menahan gerak tanpa hukuman.
- Percobaan gagal menggunakan satu instruksi, lalu antrean dijeda untuk diskusi. Posisi/kunci tetap aman; tidak ada waktu habis atau eliminasi.
- Reset level mengembalikan state dan penunjuk ke awal sambil menyimpan antrean. Mengedit antrean juga mengembalikan papan ke awal. Kosongkan menghapus antrean dan mengembalikan papan.
- Setelah berhasil, state tetap sampai reset.

## Ulangi: hanya level 31–50 (SD 4–6)

Buat pengulangan menerima 2, 3, atau 4 ulangan dengan badan 1–12 kartu biasa. Loop bersarang tidak tersedia. Antrean maksimal 64 kartu/blok dan maksimal 256 instruksi biasa setelah pembentangan. Satu langkah guru mengeksekusi satu instruksi biasa di dalam blok; tampilan menunjukkan ulangan yang sedang berjalan.

Contoh level 31: Ambil kunci → Ulangi 2× [Maju, Putar kiri, Maju, Putar kanan] → Maju → Putar kiri → Maju → Buka peti. Enam kartu/blok yang terlihat menjadi 13 instruksi eksekusi.

```json
[
  "take",
  {
    "repeat": 2,
    "commands": [
      "forward",
      "left",
      "forward",
      "right"
    ]
  },
  "forward",
  "left",
  "forward",
  "open"
]
```

Guru dapat membahas prediksi posisi dan arah setelah satu ulangan sebelum menjalankan ulangan berikutnya. Untuk perbaikan, jeda/reset dahulu lalu ubah program. Contoh program di bawah membentang tepat ke solusi biasa; kompresi tidak mengubah arti instruksi.

## Membaca peta dan solusi

`S`=robot awal, `K`=kunci, `P`=peti, `@`=robot awal dan kunci satu petak, `#`=batu, `.`=bebas. Arah awal ditulis pada metadata. Solusi terpendek menghitung setiap Maju/Putar/Ambil/Buka sebagai 1 instruksi; blok Ulangi dihitung setelah dibentangkan. Tidak ada skor atau tekanan efisiensi untuk anak.

## 1. Satu Langkah Lagi — TK A

Ukuran 4×3. Awal (0,2), hadap E (timur). Kunci (0,2); peti (1,2). Batu: tidak ada.

```text
     0 1 2 3
y=0  . . . .
y=1  . . . .
y=2  @ P . .
```

Fokus: Urutan pendek, satu petak, dan arah hadap.

Solusi terpendek terverifikasi: **3 instruksi biasa**.
Ambil kunci → Maju → Buka peti.

```json
["take","forward","open"]
```

## 2. Dua Petak Ceria — TK A

Ukuran 4×3. Awal (0,2), hadap E (timur). Kunci (0,2); peti (2,2). Batu: tidak ada.

```text
     0 1 2 3
y=0  . . . .
y=1  . . . .
y=2  @ . P .
```

Fokus: Urutan pendek, satu petak, dan arah hadap.

Solusi terpendek terverifikasi: **4 instruksi biasa**.
Ambil kunci → Maju → Maju → Buka peti.

```json
["take","forward","forward","open"]
```

## 3. Belok ke Peti — TK A

Ukuran 4×3. Awal (0,2), hadap E (timur). Kunci (0,2); peti (2,1). Batu: tidak ada.

```text
     0 1 2 3
y=0  . . . .
y=1  . . P .
y=2  @ . . .
```

Fokus: Urutan pendek, satu petak, dan arah hadap.

Solusi terpendek terverifikasi: **6 instruksi biasa**.
Ambil kunci → Maju → Maju → Putar kiri → Maju → Buka peti.

```json
["take","forward","forward","left","forward","open"]
```

## 4. Ikuti Jalannya — TK A

Ukuran 4×3. Awal (0,2), hadap E (timur). Kunci (0,2); peti (3,1). Batu: tidak ada.

```text
     0 1 2 3
y=0  . . . .
y=1  . . . P
y=2  @ . . .
```

Fokus: Urutan pendek, satu petak, dan arah hadap.

Solusi terpendek terverifikasi: **7 instruksi biasa**.
Ambil kunci → Maju → Maju → Maju → Putar kiri → Maju → Buka peti.

```json
["take","forward","forward","forward","left","forward","open"]
```

## 5. Hidung ke Utara — TK A

Ukuran 4×4. Awal (0,3), hadap N (utara). Kunci (0,2); peti (2,2). Batu: tidak ada.

```text
     0 1 2 3
y=0  . . . .
y=1  . . . .
y=2  K . P .
y=3  S . . .
```

Fokus: Urutan pendek, satu petak, dan arah hadap.

Solusi terpendek terverifikasi: **6 instruksi biasa**.
Maju → Putar kanan → Ambil kunci → Maju → Maju → Buka peti.

```json
["forward","right","take","forward","forward","open"]
```

## 6. Batu Pertama — TK A

Ukuran 4×4. Awal (0,3), hadap E (timur). Kunci (1,3); peti (2,2). Batu: (2,3).

```text
     0 1 2 3
y=0  . . . .
y=1  . . . .
y=2  . . P .
y=3  S K # .
```

Fokus: Urutan pendek, satu petak, dan arah hadap.

Solusi terpendek terverifikasi: **7 instruksi biasa**.
Maju → Putar kiri → Ambil kunci → Maju → Putar kanan → Maju → Buka peti.

```json
["forward","left","take","forward","right","forward","open"]
```

## 7. Kuncinya Dulu — TK B

Ukuran 4×4. Awal (0,3), hadap E (timur). Kunci (2,3); peti (2,1). Batu: tidak ada.

```text
     0 1 2 3
y=0  . . . .
y=1  . . P .
y=2  . . . .
y=3  S . K .
```

Fokus: Kunci sebagai syarat, putaran, dan rute sederhana.

Solusi terpendek terverifikasi: **7 instruksi biasa**.
Maju → Maju → Putar kiri → Ambil kunci → Maju → Maju → Buka peti.

```json
["forward","forward","left","take","forward","forward","open"]
```

## 8. Berangkat ke Kiri — TK B

Ukuran 4×4. Awal (3,3), hadap W (barat). Kunci (1,3); peti (1,0). Batu: tidak ada.

```text
     0 1 2 3
y=0  . P . .
y=1  . . . .
y=2  . . . .
y=3  . K . S
```

Fokus: Kunci sebagai syarat, putaran, dan rute sederhana.

Solusi terpendek terverifikasi: **8 instruksi biasa**.
Maju → Maju → Putar kanan → Ambil kunci → Maju → Maju → Maju → Buka peti.

```json
["forward","forward","right","take","forward","forward","forward","open"]
```

## 9. Singgah Ambil Kunci — TK B

Ukuran 5×4. Awal (0,3), hadap E (timur). Kunci (2,3); peti (4,2). Batu: (3,3).

```text
     0 1 2 3 4
y=0  . . . . .
y=1  . . . . .
y=2  . . . . P
y=3  S . K # .
```

Fokus: Kunci sebagai syarat, putaran, dan rute sederhana.

Solusi terpendek terverifikasi: **9 instruksi biasa**.
Maju → Maju → Putar kiri → Ambil kunci → Maju → Putar kanan → Maju → Maju → Buka peti.

```json
["forward","forward","left","take","forward","right","forward","forward","open"]
```

## 10. Putar Sebelum Maju — TK B

Ukuran 5×4. Awal (0,3), hadap E (timur). Kunci (0,1); peti (4,1). Batu: tidak ada.

```text
     0 1 2 3 4
y=0  . . . . .
y=1  K . . . P
y=2  . . . . .
y=3  S . . . .
```

Fokus: Kunci sebagai syarat, putaran, dan rute sederhana.

Solusi terpendek terverifikasi: **10 instruksi biasa**.
Putar kiri → Maju → Maju → Putar kanan → Ambil kunci → Maju → Maju → Maju → Maju → Buka peti.

```json
["left","forward","forward","right","take","forward","forward","forward","forward","open"]
```

## 11. Kunci di Balik Batu — TK B

Ukuran 5×4. Awal (4,3), hadap W (barat). Kunci (3,2); peti (1,0). Batu: (2,2), (2,3).

```text
     0 1 2 3 4
y=0  . P . . .
y=1  . . . . .
y=2  . . # K .
y=3  . . # . S
```

Fokus: Kunci sebagai syarat, putaran, dan rute sederhana.

Solusi terpendek terverifikasi: **10 instruksi biasa**.
Maju → Putar kanan → Maju → Ambil kunci → Maju → Maju → Putar kiri → Maju → Maju → Buka peti.

```json
["forward","right","forward","take","forward","forward","left","forward","forward","open"]
```

## 12. Coba Jalan Lain — TK B

Ukuran 5×4. Awal (0,3), hadap E (timur). Kunci (0,3); peti (4,2). Batu: (2,3), (2,2).

```text
     0 1 2 3 4
y=0  . . . . .
y=1  . . . . .
y=2  . . # . P
y=3  @ . # . .
```

Fokus: Kunci sebagai syarat, putaran, dan rute sederhana.

Solusi terpendek terverifikasi: **12 instruksi biasa**.
Putar kiri → Ambil kunci → Maju → Maju → Putar kanan → Maju → Maju → Maju → Maju → Putar kanan → Maju → Buka peti.

```json
["left","take","forward","forward","right","forward","forward","forward","forward","right","forward","open"]
```

## 13. Lihat Sebelum Melangkah — SD 1

Ukuran 5×4. Awal (4,3), hadap E (timur). Kunci (0,0); peti (4,0). Batu: (1,1), (2,1), (1,2).

```text
     0 1 2 3 4
y=0  K . . . P
y=1  . # # . .
y=2  . # . . .
y=3  . . . . S
```

Fokus: Prediksi, rute alternatif, dan memperbaiki satu kesalahan.

Solusi terpendek terverifikasi: **17 instruksi biasa**.
Putar kiri → Maju → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Putar kiri → Putar kiri → Ambil kunci → Maju → Maju → Maju → Maju → Buka peti.

```json
["left","forward","forward","forward","left","forward","forward","forward","forward","left","left","take","forward","forward","forward","forward","open"]
```

## 14. Dua Bagian Rencana — SD 1

Ukuran 5×4. Awal (4,0), hadap E (timur). Kunci (0,3); peti (0,0). Batu: (1,0), (3,0), (4,3).

```text
     0 1 2 3 4
y=0  P # . # S
y=1  . . . . .
y=2  . . . . .
y=3  K . . . #
```

Fokus: Prediksi, rute alternatif, dan memperbaiki satu kesalahan.

Solusi terpendek terverifikasi: **17 instruksi biasa**.
Putar kanan → Maju → Maju → Putar kanan → Maju → Maju → Maju → Maju → Putar kiri → Maju → Putar kiri → Putar kiri → Ambil kunci → Maju → Maju → Maju → Buka peti.

```json
["right","forward","forward","right","forward","forward","forward","forward","left","forward","left","left","take","forward","forward","forward","open"]
```

## 15. Sudut yang Berbeda — SD 1

Ukuran 5×4. Awal (0,0), hadap N (utara). Kunci (4,3); peti (0,3). Batu: (1,1), (2,1), (3,1).

```text
     0 1 2 3 4
y=0  S . . . .
y=1  . # # # .
y=2  . . . . .
y=3  P . . . K
```

Fokus: Prediksi, rute alternatif, dan memperbaiki satu kesalahan.

Solusi terpendek terverifikasi: **16 instruksi biasa**.
Putar kanan → Maju → Maju → Maju → Maju → Putar kanan → Maju → Maju → Maju → Putar kanan → Ambil kunci → Maju → Maju → Maju → Maju → Buka peti.

```json
["right","forward","forward","forward","forward","right","forward","forward","forward","right","take","forward","forward","forward","forward","open"]
```

## 16. Jangan Lewat Batu — SD 1

Ukuran 5×5. Awal (0,4), hadap E (timur). Kunci (4,0); peti (4,4). Batu: (2,0), (2,3), (2,4).

```text
     0 1 2 3 4
y=0  . . # . K
y=1  . . . . .
y=2  . . . . .
y=3  . . # . .
y=4  S . # . P
```

Fokus: Prediksi, rute alternatif, dan memperbaiki satu kesalahan.

Solusi terpendek terverifikasi: **19 instruksi biasa**.
Maju → Putar kiri → Maju → Maju → Maju → Putar kanan → Maju → Maju → Maju → Putar kiri → Maju → Putar kiri → Putar kiri → Ambil kunci → Maju → Maju → Maju → Maju → Buka peti.

```json
["forward","left","forward","forward","forward","right","forward","forward","forward","left","forward","left","left","take","forward","forward","forward","forward","open"]
```

## 17. Prediksi Satu Putaran — SD 1

Ukuran 5×5. Awal (4,4), hadap E (timur). Kunci (0,0); peti (4,0). Batu: (3,2), (2,3), (3,3), (1,4).

```text
     0 1 2 3 4
y=0  K . . . P
y=1  . . . . .
y=2  . . . # .
y=3  . . # # .
y=4  . # . . S
```

Fokus: Prediksi, rute alternatif, dan memperbaiki satu kesalahan.

Solusi terpendek terverifikasi: **18 instruksi biasa**.
Putar kiri → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Putar kiri → Putar kiri → Ambil kunci → Maju → Maju → Maju → Maju → Buka peti.

```json
["left","forward","forward","forward","forward","left","forward","forward","forward","forward","left","left","take","forward","forward","forward","forward","open"]
```

## 18. Perbaiki Rute Kita — SD 1

Ukuran 5×5. Awal (4,0), hadap N (utara). Kunci (0,4); peti (0,0). Batu: (4,1), (1,2), (4,2), (1,4), (4,4).

```text
     0 1 2 3 4
y=0  P . . . S
y=1  . . . . #
y=2  . # . . #
y=3  . . . . .
y=4  K # . . #
```

Fokus: Prediksi, rute alternatif, dan memperbaiki satu kesalahan.

Solusi terpendek terverifikasi: **18 instruksi biasa**.
Putar kiri → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Putar kiri → Putar kiri → Ambil kunci → Maju → Maju → Maju → Maju → Buka peti.

```json
["left","forward","forward","forward","forward","left","forward","forward","forward","forward","left","left","take","forward","forward","forward","forward","open"]
```

## 19. Ke Kunci Lalu ke Peti — SD 2

Ukuran 5×5. Awal (0,0), hadap N (utara). Kunci (4,4); peti (0,4). Batu: (2,2), (1,3), (3,3), (4,3).

```text
     0 1 2 3 4
y=0  S . . . .
y=1  . . . . .
y=2  . . # . .
y=3  . # . # #
y=4  P . . . K
```

Fokus: Membagi rute menjadi bagian sebelum dan sesudah mengambil kunci.

Solusi terpendek terverifikasi: **19 instruksi biasa**.
Putar kiri → Putar kiri → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Putar kiri → Putar kiri → Ambil kunci → Maju → Maju → Maju → Maju → Buka peti.

```json
["left","left","forward","forward","forward","forward","left","forward","forward","forward","forward","left","left","take","forward","forward","forward","forward","open"]
```

## 20. Peta dari Selatan — SD 2

Ukuran 5×5. Awal (0,4), hadap N (utara). Kunci (4,0); peti (4,4). Batu: (1,1), (0,2), (2,2), (0,3).

```text
     0 1 2 3 4
y=0  . . . . K
y=1  . # . . .
y=2  # . # . .
y=3  # . . . .
y=4  S . . . P
```

Fokus: Membagi rute menjadi bagian sebelum dan sesudah mengambil kunci.

Solusi terpendek terverifikasi: **18 instruksi biasa**.
Putar kanan → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Putar kiri → Putar kiri → Ambil kunci → Maju → Maju → Maju → Maju → Buka peti.

```json
["right","forward","forward","forward","forward","left","forward","forward","forward","forward","left","left","take","forward","forward","forward","forward","open"]
```

## 21. Rencanakan Persinggahan — SD 2

Ukuran 5×5. Awal (4,4), hadap E (timur). Kunci (0,0); peti (4,0). Batu: (1,0), (1,2), (3,3), (0,4), (1,4).

```text
     0 1 2 3 4
y=0  K # . . P
y=1  . . . . .
y=2  . # . . .
y=3  . . . # .
y=4  # # . . S
```

Fokus: Membagi rute menjadi bagian sebelum dan sesudah mengambil kunci.

Solusi terpendek terverifikasi: **23 instruksi biasa**.
Putar kiri → Maju → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Putar kanan → Maju → Putar kiri → Putar kiri → Ambil kunci → Maju → Putar kiri → Maju → Maju → Maju → Maju → Putar kiri → Maju → Buka peti.

```json
["left","forward","forward","forward","left","forward","forward","forward","forward","right","forward","left","left","take","forward","left","forward","forward","forward","forward","left","forward","open"]
```

## 22. Dari Sudut ke Sudut — SD 2

Ukuran 6×5. Awal (5,0), hadap E (timur). Kunci (0,4); peti (0,0). Batu: (0,1), (3,1), (0,2), (2,2), (4,2).

```text
     0 1 2 3 4 5
y=0  P . . . . S
y=1  # . . # . .
y=2  # . # . # .
y=3  . . . . . .
y=4  K . . . . .
```

Fokus: Membagi rute menjadi bagian sebelum dan sesudah mengambil kunci.

Solusi terpendek terverifikasi: **23 instruksi biasa**.
Putar kanan → Maju → Maju → Maju → Maju → Putar kanan → Maju → Maju → Maju → Maju → Maju → Putar kiri → Putar kiri → Ambil kunci → Maju → Putar kiri → Maju → Maju → Maju → Maju → Putar kiri → Maju → Buka peti.

```json
["right","forward","forward","forward","forward","right","forward","forward","forward","forward","forward","left","left","take","forward","left","forward","forward","forward","forward","left","forward","open"]
```

## 23. Balik Arah dengan Tenang — SD 2

Ukuran 6×5. Awal (0,0), hadap N (utara). Kunci (5,4); peti (0,4). Batu: (1,1), (5,1), (3,4).

```text
     0 1 2 3 4 5
y=0  S . . . . .
y=1  . # . . . #
y=2  . . . . . .
y=3  . . . . . .
y=4  P . . # . K
```

Fokus: Membagi rute menjadi bagian sebelum dan sesudah mengambil kunci.

Solusi terpendek terverifikasi: **24 instruksi biasa**.
Putar kanan → Maju → Maju → Maju → Maju → Putar kanan → Maju → Maju → Maju → Maju → Putar kiri → Maju → Putar kiri → Ambil kunci → Maju → Putar kiri → Maju → Maju → Maju → Maju → Maju → Putar kiri → Maju → Buka peti.

```json
["right","forward","forward","forward","forward","right","forward","forward","forward","forward","left","forward","left","take","forward","left","forward","forward","forward","forward","forward","left","forward","open"]
```

## 24. Cek Setiap Bagian — SD 2

Ukuran 6×5. Awal (0,4), hadap E (timur). Kunci (5,0); peti (5,4). Batu: (2,0), (0,1), (2,1), (3,1), (5,1), (3,2), (5,2), (3,3), (5,3).

```text
     0 1 2 3 4 5
y=0  . . # . . K
y=1  # . # # . #
y=2  . . . # . #
y=3  . . . # . #
y=4  S . . . . P
```

Fokus: Membagi rute menjadi bagian sebelum dan sesudah mengambil kunci.

Solusi terpendek terverifikasi: **23 instruksi biasa**.
Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Putar kanan → Maju → Putar kiri → Putar kiri → Ambil kunci → Maju → Putar kiri → Maju → Maju → Maju → Maju → Putar kiri → Maju → Buka peti.

```json
["forward","forward","forward","forward","left","forward","forward","forward","forward","right","forward","left","left","take","forward","left","forward","forward","forward","forward","left","forward","open"]
```

## 25. Pilih Jalur Efisien — SD 3

Ukuran 6×5. Awal (5,4), hadap E (timur). Kunci (0,0); peti (5,0). Batu: (3,1), (1,2), (0,3), (1,3), (2,3), (3,3), (5,3).

```text
     0 1 2 3 4 5
y=0  K . . . . P
y=1  . . . # . .
y=2  . # . . . .
y=3  # # # # . #
y=4  . . . . . S
```

Fokus: Membandingkan jalur dan menghitung langkah serta putaran.

Solusi terpendek terverifikasi: **22 instruksi biasa**.
Putar kiri → Putar kiri → Maju → Putar kanan → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Putar kiri → Putar kiri → Ambil kunci → Maju → Maju → Maju → Maju → Maju → Buka peti.

```json
["left","left","forward","right","forward","forward","forward","forward","left","forward","forward","forward","forward","left","left","take","forward","forward","forward","forward","forward","open"]
```

## 26. Hitung Langkah dan Putar — SD 3

Ukuran 6×5. Awal (5,0), hadap E (timur). Kunci (0,4); peti (0,0). Batu: (1,1), (2,1), (0,3), (2,3).

```text
     0 1 2 3 4 5
y=0  P . . . . S
y=1  . # # . . .
y=2  . . . . . .
y=3  # . # . . .
y=4  K . . . . .
```

Fokus: Membandingkan jalur dan menghitung langkah serta putaran.

Solusi terpendek terverifikasi: **24 instruksi biasa**.
Putar kanan → Maju → Maju → Maju → Maju → Putar kanan → Maju → Maju → Maju → Maju → Maju → Putar kiri → Putar kiri → Ambil kunci → Maju → Putar kiri → Maju → Maju → Putar kiri → Maju → Putar kanan → Maju → Maju → Buka peti.

```json
["right","forward","forward","forward","forward","right","forward","forward","forward","forward","forward","left","left","take","forward","left","forward","forward","left","forward","right","forward","forward","open"]
```

## 27. Rute Sama Cara Berbeda — SD 3

Ukuran 6×5. Awal (0,0), hadap W (barat). Kunci (5,4); peti (0,4). Batu: (5,0), (1,1), (4,1), (0,2), (1,2).

```text
     0 1 2 3 4 5
y=0  S . . . . #
y=1  . # . . # .
y=2  # # . . . .
y=3  . . . . . .
y=4  P . . . . K
```

Fokus: Membandingkan jalur dan menghitung langkah serta putaran.

Solusi terpendek terverifikasi: **22 instruksi biasa**.
Putar kiri → Putar kiri → Maju → Maju → Maju → Putar kanan → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Putar kiri → Putar kiri → Ambil kunci → Maju → Maju → Maju → Maju → Maju → Buka peti.

```json
["left","left","forward","forward","forward","right","forward","forward","forward","forward","left","forward","forward","left","left","take","forward","forward","forward","forward","forward","open"]
```

## 28. Cari Putaran yang Hemat — SD 3

Ukuran 6×6. Awal (0,5), hadap N (utara). Kunci (5,0); peti (5,5). Batu: (1,1), (4,1), (1,2), (2,2), (1,3), (2,3), (3,3), (5,3), (1,5), (2,5), (4,5).

```text
     0 1 2 3 4 5
y=0  . . . . . K
y=1  . # . . # .
y=2  . # # . . .
y=3  . # # # . #
y=4  . . . . . .
y=5  S # # . # P
```

Fokus: Membandingkan jalur dan menghitung langkah serta putaran.

Solusi terpendek terverifikasi: **25 instruksi biasa**.
Maju → Maju → Maju → Maju → Maju → Putar kanan → Maju → Maju → Maju → Maju → Maju → Putar kanan → Ambil kunci → Maju → Maju → Putar kanan → Maju → Putar kiri → Maju → Maju → Putar kiri → Maju → Putar kanan → Maju → Buka peti.

```json
["forward","forward","forward","forward","forward","right","forward","forward","forward","forward","forward","right","take","forward","forward","right","forward","left","forward","forward","left","forward","right","forward","open"]
```

## 29. Bandingkan Dua Rencana — SD 3

Ukuran 6×6. Awal (5,5), hadap S (selatan). Kunci (0,0); peti (5,0). Batu: (2,0), (3,1), (5,1), (5,2), (4,3), (5,3), (3,4), (4,4).

```text
     0 1 2 3 4 5
y=0  K . # . . P
y=1  . . . # . #
y=2  . . . . . #
y=3  . . . . # #
y=4  . . . # # .
y=5  . . . . . S
```

Fokus: Membandingkan jalur dan menghitung langkah serta putaran.

Solusi terpendek terverifikasi: **28 instruksi biasa**.
Putar kanan → Maju → Maju → Maju → Maju → Maju → Putar kanan → Maju → Maju → Maju → Maju → Maju → Putar kiri → Putar kiri → Ambil kunci → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Putar kanan → Maju → Buka peti.

```json
["right","forward","forward","forward","forward","forward","right","forward","forward","forward","forward","forward","left","left","take","forward","forward","left","forward","forward","forward","forward","left","forward","forward","right","forward","open"]
```

## 30. Uji Dugaan Kita — SD 3

Ukuran 6×6. Awal (5,0), hadap E (timur). Kunci (0,5); peti (0,0). Batu: (0,1), (2,1), (3,2), (4,2), (4,3), (5,3), (2,4), (5,5).

```text
     0 1 2 3 4 5
y=0  P . . . . S
y=1  # . # . . .
y=2  . . . # # .
y=3  . . . . # #
y=4  . . # . . .
y=5  K . . . . #
```

Fokus: Membandingkan jalur dan menghitung langkah serta putaran.

Solusi terpendek terverifikasi: **27 instruksi biasa**.
Putar kiri → Putar kiri → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Maju → Putar kanan → Maju → Putar kiri → Putar kiri → Ambil kunci → Maju → Putar kiri → Maju → Maju → Maju → Maju → Maju → Putar kiri → Maju → Buka peti.

```json
["left","left","forward","forward","forward","forward","left","forward","forward","forward","forward","forward","right","forward","left","left","take","forward","left","forward","forward","forward","forward","forward","left","forward","open"]
```

## 31. Tangga Berulang — SD 4

Ukuran 6×6. Awal (0,5), hadap E (timur). Kunci (0,5); peti (3,2). Batu: (0,0), (1,0), (2,0), (3,0), (4,0), (5,0), (0,1), (1,1), (2,1), (3,1), (4,1), (5,1), (0,2), (1,2), (2,2), (4,2), (5,2), (0,3), (1,3), (4,3), (5,3), (0,4), (3,4), (4,4), (5,4), (2,5), (3,5), (4,5), (5,5).

```text
     0 1 2 3 4 5
y=0  # # # # # #
y=1  # # # # # #
y=2  # # # P # #
y=3  # # . . # #
y=4  # . . # # #
y=5  @ . # # # #
```

Fokus: Mengenali pola dan memakai blok Ulangi 2–4 kali tanpa loop bersarang.

Solusi terpendek terverifikasi: **13 instruksi biasa**.
Ambil kunci → Maju → Putar kiri → Maju → Putar kanan → Maju → Putar kiri → Maju → Putar kanan → Maju → Putar kiri → Maju → Buka peti.

```json
["take","forward","left","forward","right","forward","left","forward","right","forward","left","forward","open"]
```

Contoh program dengan Ulangi (hasil pembentangan sama persis):

```json
["take",{"repeat":2,"commands":["forward","left","forward","right"]},"forward","left","forward","open"]
```

## 32. Tangga dari Sisi Lain — SD 4

Ukuran 6×6. Awal (5,0), hadap W (barat). Kunci (5,0); peti (1,4). Batu: (5,5), (4,5), (3,5), (2,5), (1,5), (0,5), (5,4), (4,4), (3,4), (2,4), (0,4), (5,3), (4,3), (3,3), (0,3), (5,2), (4,2), (1,2), (0,2), (5,1), (2,1), (1,1), (0,1), (3,0), (2,0), (1,0), (0,0).

```text
     0 1 2 3 4 5
y=0  # # # # . @
y=1  # # # . . #
y=2  # # . . # #
y=3  # . . # # #
y=4  # P # # # #
y=5  # # # # # #
```

Fokus: Mengenali pola dan memakai blok Ulangi 2–4 kali tanpa loop bersarang.

Solusi terpendek terverifikasi: **17 instruksi biasa**.
Ambil kunci → Maju → Putar kiri → Maju → Putar kanan → Maju → Putar kiri → Maju → Putar kanan → Maju → Putar kiri → Maju → Putar kanan → Maju → Putar kiri → Maju → Buka peti.

```json
["take","forward","left","forward","right","forward","left","forward","right","forward","left","forward","right","forward","left","forward","open"]
```

Contoh program dengan Ulangi (hasil pembentangan sama persis):

```json
["take",{"repeat":3,"commands":["forward","left","forward","right"]},"forward","left","forward","open"]
```

## 33. Dua Baris Berulang — SD 4

Ukuran 7×5. Awal (0,4), hadap E (timur). Kunci (0,4); peti (6,1). Batu: (0,0), (1,0), (2,0), (3,0), (4,0), (5,0), (6,0), (0,1), (1,1), (2,1), (3,1), (4,1), (5,1), (0,2), (1,2), (2,2), (3,2), (0,3), (1,3), (5,3), (6,3), (3,4), (4,4), (5,4), (6,4).

```text
     0 1 2 3 4 5 6
y=0  # # # # # # #
y=1  # # # # # # P
y=2  # # # # . . .
y=3  # # . . . # #
y=4  @ . . # # # #
```

Fokus: Mengenali pola dan memakai blok Ulangi 2–4 kali tanpa loop bersarang.

Solusi terpendek terverifikasi: **16 instruksi biasa**.
Ambil kunci → Maju → Maju → Putar kiri → Maju → Putar kanan → Maju → Maju → Putar kiri → Maju → Putar kanan → Maju → Maju → Putar kiri → Maju → Buka peti.

```json
["take","forward","forward","left","forward","right","forward","forward","left","forward","right","forward","forward","left","forward","open"]
```

Contoh program dengan Ulangi (hasil pembentangan sama persis):

```json
["take",{"repeat":2,"commands":["forward","forward","left","forward","right"]},"forward","forward","left","forward","open"]
```

## 34. Pola Berbalik Arah — SD 4

Ukuran 7×5. Awal (6,0), hadap W (barat). Kunci (6,0); peti (0,3). Batu: (6,4), (5,4), (4,4), (3,4), (2,4), (1,4), (0,4), (6,3), (5,3), (4,3), (3,3), (2,3), (1,3), (6,2), (5,2), (4,2), (3,2), (6,1), (5,1), (1,1), (0,1), (3,0), (2,0), (1,0), (0,0).

```text
     0 1 2 3 4 5 6
y=0  # # # # . . @
y=1  # # . . . # #
y=2  . . . # # # #
y=3  P # # # # # #
y=4  # # # # # # #
```

Fokus: Mengenali pola dan memakai blok Ulangi 2–4 kali tanpa loop bersarang.

Solusi terpendek terverifikasi: **16 instruksi biasa**.
Ambil kunci → Maju → Maju → Putar kiri → Maju → Putar kanan → Maju → Maju → Putar kiri → Maju → Putar kanan → Maju → Maju → Putar kiri → Maju → Buka peti.

```json
["take","forward","forward","left","forward","right","forward","forward","left","forward","right","forward","forward","left","forward","open"]
```

Contoh program dengan Ulangi (hasil pembentangan sama persis):

```json
["take",{"repeat":2,"commands":["forward","forward","left","forward","right"]},"forward","forward","left","forward","open"]
```

## 35. Ulangi Lalu Ambil — SD 4

Ukuran 5×6. Awal (0,0), hadap E (timur). Kunci (4,1); peti (4,4). Batu: (0,5), (1,5), (2,5), (3,5), (4,5), (1,3), (2,3), (3,3), (4,3), (0,1), (1,1), (2,1), (3,1).

```text
     0 1 2 3 4
y=0  S . . . .
y=1  # # # # K
y=2  . . . . .
y=3  . # # # #
y=4  . . . . P
y=5  # # # # #
```

Fokus: Mengenali pola dan memakai blok Ulangi 2–4 kali tanpa loop bersarang.

Solusi terpendek terverifikasi: **22 instruksi biasa**.
Maju → Maju → Maju → Maju → Putar kanan → Maju → Ambil kunci → Maju → Putar kanan → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Buka peti.

```json
["forward","forward","forward","forward","right","forward","take","forward","right","forward","forward","forward","forward","left","forward","forward","left","forward","forward","forward","forward","open"]
```

Contoh program dengan Ulangi (hasil pembentangan sama persis):

```json
[{"repeat":4,"commands":["forward"]},"right","forward","take","forward","right",{"repeat":2,"commands":["forward"]},{"repeat":2,"commands":["forward","forward","left"]},{"repeat":4,"commands":["forward"]},"open"]
```

## 36. Pola yang Lebih Panjang — SD 4

Ukuran 4×7. Awal (0,6), hadap E (timur). Kunci (0,6); peti (0,0). Batu: (0,1), (1,1), (2,1), (1,3), (2,3), (3,3), (0,5), (1,5), (2,5).

```text
     0 1 2 3
y=0  P . . .
y=1  # # # .
y=2  . . . .
y=3  . # # #
y=4  . . . .
y=5  # # # .
y=6  @ . . .
```

Fokus: Mengenali pola dan memakai blok Ulangi 2–4 kali tanpa loop bersarang.

Solusi terpendek terverifikasi: **26 instruksi biasa**.
Ambil kunci → Maju → Maju → Maju → Putar kiri → Maju → Maju → Putar kiri → Maju → Maju → Maju → Putar kanan → Maju → Maju → Putar kanan → Maju → Maju → Maju → Putar kiri → Maju → Maju → Putar kiri → Maju → Maju → Maju → Buka peti.

```json
["take","forward","forward","forward","left","forward","forward","left","forward","forward","forward","right","forward","forward","right","forward","forward","forward","left","forward","forward","left","forward","forward","forward","open"]
```

Contoh program dengan Ulangi (hasil pembentangan sama persis):

```json
["take",{"repeat":3,"commands":["forward"]},{"repeat":2,"commands":["left","forward","forward"]},{"repeat":2,"commands":["forward","right","forward"]},{"repeat":2,"commands":["forward","forward","left"]},{"repeat":3,"commands":["forward"]},"open"]
```

## 37. Baris Panjang Bersama — SD 5

Ukuran 7×6. Awal (0,5), hadap E (timur). Kunci (6,5); peti (6,1). Batu: (0,0), (1,0), (2,0), (3,0), (4,0), (5,0), (6,0), (1,2), (2,2), (3,2), (4,2), (5,2), (6,2), (0,4), (1,4), (2,4), (3,4), (4,4), (5,4).

```text
     0 1 2 3 4 5 6
y=0  # # # # # # #
y=1  . . . . . . P
y=2  . # # # # # #
y=3  . . . . . . .
y=4  # # # # # # .
y=5  S . . . . . K
```

Fokus: Menggabungkan pengulangan dengan syarat kunci dan perjalanan kembali.

Solusi terpendek terverifikasi: **28 instruksi biasa**.
Maju → Maju → Maju → Maju → Maju → Maju → Putar kiri → Ambil kunci → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Maju → Maju → Putar kanan → Maju → Maju → Putar kanan → Maju → Maju → Maju → Maju → Maju → Maju → Buka peti.

```json
["forward","forward","forward","forward","forward","forward","left","take","forward","forward","left","forward","forward","forward","forward","forward","forward","right","forward","forward","right","forward","forward","forward","forward","forward","forward","open"]
```

Contoh program dengan Ulangi (hasil pembentangan sama persis):

```json
[{"repeat":3,"commands":["forward","forward"]},"left","take",{"repeat":2,"commands":["forward"]},"left",{"repeat":4,"commands":["forward"]},{"repeat":2,"commands":["forward","forward","right"]},{"repeat":3,"commands":["forward","forward"]},"open"]
```

## 38. Pola dari Timur — SD 5

Ukuran 7×6. Awal (6,5), hadap W (barat). Kunci (1,3); peti (0,1). Batu: (6,0), (5,0), (4,0), (3,0), (2,0), (1,0), (0,0), (5,2), (4,2), (3,2), (2,2), (1,2), (0,2), (6,4), (5,4), (4,4), (3,4), (2,4), (1,4).

```text
     0 1 2 3 4 5 6
y=0  # # # # # # #
y=1  P . . . . . .
y=2  # # # # # # .
y=3  . K . . . . .
y=4  . # # # # # #
y=5  . . . . . . S
```

Fokus: Menggabungkan pengulangan dengan syarat kunci dan perjalanan kembali.

Solusi terpendek terverifikasi: **28 instruksi biasa**.
Maju → Maju → Maju → Maju → Maju → Maju → Putar kanan → Maju → Maju → Putar kanan → Maju → Ambil kunci → Maju → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Maju → Maju → Buka peti.

```json
["forward","forward","forward","forward","forward","forward","right","forward","forward","right","forward","take","forward","forward","forward","forward","forward","left","forward","forward","left","forward","forward","forward","forward","forward","forward","open"]
```

Contoh program dengan Ulangi (hasil pembentangan sama persis):

```json
["forward",{"repeat":4,"commands":["forward"]},{"repeat":2,"commands":["forward","right","forward"]},"take",{"repeat":3,"commands":["forward"]},{"repeat":2,"commands":["forward","forward","left"]},{"repeat":3,"commands":["forward","forward"]},"open"]
```

## 39. Kunci di Tengah Pola — SD 5

Ukuran 7×6. Awal (0,0), hadap E (timur). Kunci (0,3); peti (6,4). Batu: (0,5), (1,5), (2,5), (3,5), (4,5), (5,5), (6,5), (1,3), (2,3), (3,3), (4,3), (5,3), (6,3), (0,1), (1,1), (2,1), (3,1), (4,1), (5,1).

```text
     0 1 2 3 4 5 6
y=0  S . . . . . .
y=1  # # # # # # .
y=2  . . . . . . .
y=3  K # # # # # #
y=4  . . . . . . P
y=5  # # # # # # #
```

Fokus: Menggabungkan pengulangan dengan syarat kunci dan perjalanan kembali.

Solusi terpendek terverifikasi: **28 instruksi biasa**.
Maju → Maju → Maju → Maju → Maju → Maju → Putar kanan → Maju → Maju → Putar kanan → Maju → Maju → Maju → Maju → Maju → Maju → Putar kiri → Maju → Ambil kunci → Maju → Putar kiri → Maju → Maju → Maju → Maju → Maju → Maju → Buka peti.

```json
["forward","forward","forward","forward","forward","forward","right","forward","forward","right","forward","forward","forward","forward","forward","forward","left","forward","take","forward","left","forward","forward","forward","forward","forward","forward","open"]
```

Contoh program dengan Ulangi (hasil pembentangan sama persis):

```json
[{"repeat":4,"commands":["forward"]},{"repeat":2,"commands":["forward","forward","right"]},{"repeat":3,"commands":["forward","forward"]},"left","forward","take","forward","left",{"repeat":3,"commands":["forward","forward"]},"open"]
```

## 40. Empat Baris Terencana — SD 5

Ukuran 7×7. Awal (0,6), hadap E (timur). Kunci (5,4); peti (0,0). Batu: (0,1), (1,1), (2,1), (3,1), (4,1), (5,1), (1,3), (2,3), (3,3), (4,3), (5,3), (6,3), (0,5), (1,5), (2,5), (3,5), (4,5), (5,5).

```text
     0 1 2 3 4 5 6
y=0  P . . . . . .
y=1  # # # # # # .
y=2  . . . . . . .
y=3  . # # # # # #
y=4  . . . . . K .
y=5  # # # # # # .
y=6  S . . . . . .
```

Fokus: Menggabungkan pengulangan dengan syarat kunci dan perjalanan kembali.

Solusi terpendek terverifikasi: **38 instruksi biasa**.
Maju → Maju → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Putar kiri → Maju → Ambil kunci → Maju → Maju → Maju → Maju → Maju → Putar kanan → Maju → Maju → Putar kanan → Maju → Maju → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Maju → Maju → Buka peti.

```json
["forward","forward","forward","forward","forward","forward","left","forward","forward","left","forward","take","forward","forward","forward","forward","forward","right","forward","forward","right","forward","forward","forward","forward","forward","forward","left","forward","forward","left","forward","forward","forward","forward","forward","forward","open"]
```

Contoh program dengan Ulangi (hasil pembentangan sama persis):

```json
["forward",{"repeat":4,"commands":["forward"]},{"repeat":2,"commands":["forward","left","forward"]},"take",{"repeat":3,"commands":["forward"]},{"repeat":2,"commands":["forward","forward","right"]},{"repeat":4,"commands":["forward"]},{"repeat":2,"commands":["forward","forward","left"]},{"repeat":3,"commands":["forward","forward"]},"open"]
```

## 41. Jelajah Lalu Kembali — SD 5

Ukuran 7×7. Awal (6,6), hadap W (barat). Kunci (6,0); peti (0,2). Batu: (6,1), (5,1), (4,1), (3,1), (2,1), (1,1), (5,3), (4,3), (3,3), (2,3), (1,3), (0,3), (6,5), (5,5), (4,5), (3,5), (2,5), (1,5).

```text
     0 1 2 3 4 5 6
y=0  . . . . . . K
y=1  . # # # # # #
y=2  P . . . . . .
y=3  # # # # # # .
y=4  . . . . . . .
y=5  . # # # # # #
y=6  . . . . . . S
```

Fokus: Menggabungkan pengulangan dengan syarat kunci dan perjalanan kembali.

Solusi terpendek terverifikasi: **49 instruksi biasa**.
Maju → Maju → Maju → Maju → Maju → Maju → Putar kanan → Maju → Maju → Putar kanan → Maju → Maju → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Maju → Maju → Putar kanan → Maju → Maju → Putar kanan → Maju → Maju → Maju → Maju → Maju → Maju → Putar kiri → Putar kiri → Ambil kunci → Maju → Maju → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Buka peti.

```json
["forward","forward","forward","forward","forward","forward","right","forward","forward","right","forward","forward","forward","forward","forward","forward","left","forward","forward","left","forward","forward","forward","forward","forward","forward","right","forward","forward","right","forward","forward","forward","forward","forward","forward","left","left","take","forward","forward","forward","forward","forward","forward","left","forward","forward","open"]
```

Contoh program dengan Ulangi (hasil pembentangan sama persis):

```json
[{"repeat":4,"commands":["forward"]},{"repeat":2,"commands":["forward","forward","right"]},{"repeat":4,"commands":["forward"]},{"repeat":2,"commands":["forward","forward","left"]},{"repeat":4,"commands":["forward"]},{"repeat":2,"commands":["forward","forward","right"]},{"repeat":3,"commands":["forward","forward"]},{"repeat":2,"commands":["left"]},"take",{"repeat":3,"commands":["forward","forward"]},"left",{"repeat":2,"commands":["forward"]},"open"]
```

## 42. Potong Awal Rute — SD 5

Ukuran 7×7. Awal (4,0), hadap E (timur). Kunci (6,6); peti (0,6). Batu: (0,5), (1,5), (2,5), (3,5), (4,5), (5,5), (1,3), (2,3), (3,3), (4,3), (5,3), (6,3), (0,1), (1,1), (2,1), (3,1), (4,1), (5,1).

```text
     0 1 2 3 4 5 6
y=0  . . . . S . .
y=1  # # # # # # .
y=2  . . . . . . .
y=3  . # # # # # #
y=4  . . . . . . .
y=5  # # # # # # .
y=6  P . . . . . K
```

Fokus: Menggabungkan pengulangan dengan syarat kunci dan perjalanan kembali.

Solusi terpendek terverifikasi: **34 instruksi biasa**.
Maju → Maju → Putar kanan → Maju → Maju → Putar kanan → Maju → Maju → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Maju → Maju → Putar kanan → Maju → Maju → Putar kanan → Ambil kunci → Maju → Maju → Maju → Maju → Maju → Maju → Buka peti.

```json
["forward","forward","right","forward","forward","right","forward","forward","forward","forward","forward","forward","left","forward","forward","left","forward","forward","forward","forward","forward","forward","right","forward","forward","right","take","forward","forward","forward","forward","forward","forward","open"]
```

Contoh program dengan Ulangi (hasil pembentangan sama persis):

```json
[{"repeat":2,"commands":["forward","forward","right"]},{"repeat":4,"commands":["forward"]},{"repeat":2,"commands":["forward","forward","left"]},{"repeat":4,"commands":["forward"]},{"repeat":2,"commands":["forward","forward","right"]},"take",{"repeat":3,"commands":["forward","forward"]},"open"]
```

## 43. Pola dan Persinggahan — SD 5

Ukuran 7×7. Awal (4,0), hadap W (barat). Kunci (4,4); peti (6,6). Batu: (6,5), (5,5), (4,5), (3,5), (2,5), (1,5), (5,3), (4,3), (3,3), (2,3), (1,3), (0,3), (6,1), (5,1), (4,1), (3,1), (2,1), (1,1).

```text
     0 1 2 3 4 5 6
y=0  . . . . S . .
y=1  . # # # # # #
y=2  . . . . . . .
y=3  # # # # # # .
y=4  . . . . K . .
y=5  . # # # # # #
y=6  . . . . . . P
```

Fokus: Menggabungkan pengulangan dengan syarat kunci dan perjalanan kembali.

Solusi terpendek terverifikasi: **36 instruksi biasa**.
Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Maju → Maju → Putar kanan → Maju → Maju → Putar kanan → Maju → Maju → Ambil kunci → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Maju → Maju → Buka peti.

```json
["forward","forward","forward","forward","left","forward","forward","left","forward","forward","forward","forward","forward","forward","right","forward","forward","right","forward","forward","take","forward","forward","forward","forward","left","forward","forward","left","forward","forward","forward","forward","forward","forward","open"]
```

Contoh program dengan Ulangi (hasil pembentangan sama persis):

```json
[{"repeat":2,"commands":["forward"]},{"repeat":2,"commands":["forward","forward","left"]},{"repeat":3,"commands":["forward","forward"]},{"repeat":2,"commands":["right","forward","forward"]},"take",{"repeat":2,"commands":["forward"]},{"repeat":2,"commands":["forward","forward","left"]},{"repeat":3,"commands":["forward","forward"]},"open"]
```

## 44. Susun Rencana Besar — SD 6

Ukuran 8×8. Awal (0,7), hadap E (timur). Kunci (0,5); peti (0,1). Batu: (0,0), (1,0), (2,0), (3,0), (4,0), (5,0), (6,0), (7,0), (0,2), (1,2), (2,2), (3,2), (4,2), (5,2), (6,2), (1,4), (2,4), (3,4), (4,4), (5,4), (6,4), (7,4), (0,6), (1,6), (2,6), (3,6), (4,6), (5,6), (6,6).

```text
     0 1 2 3 4 5 6 7
y=0  # # # # # # # #
y=1  P . . . . . . .
y=2  # # # # # # # .
y=3  . . . . . . . .
y=4  . # # # # # # #
y=5  K . . . . . . .
y=6  # # # # # # # .
y=7  S . . . . . . .
```

Fokus: Merencanakan, menelusuri, dan menyederhanakan algoritma yang lebih panjang.

Solusi terpendek terverifikasi: **42 instruksi biasa**.
Maju → Maju → Maju → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Maju → Maju → Maju → Putar kanan → Ambil kunci → Maju → Maju → Putar kanan → Maju → Maju → Maju → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Maju → Maju → Maju → Buka peti.

```json
["forward","forward","forward","forward","forward","forward","forward","left","forward","forward","left","forward","forward","forward","forward","forward","forward","forward","right","take","forward","forward","right","forward","forward","forward","forward","forward","forward","forward","left","forward","forward","left","forward","forward","forward","forward","forward","forward","forward","open"]
```

Contoh program dengan Ulangi (hasil pembentangan sama persis):

```json
[{"repeat":3,"commands":["forward","forward"]},{"repeat":2,"commands":["forward","left","forward"]},{"repeat":3,"commands":["forward","forward"]},"right","take",{"repeat":2,"commands":["forward"]},"right",{"repeat":3,"commands":["forward","forward"]},{"repeat":2,"commands":["forward","left","forward"]},{"repeat":3,"commands":["forward","forward"]},"open"]
```

## 45. Mulai dari Tengah — SD 6

Ukuran 8×8. Awal (3,7), hadap W (barat). Kunci (7,1); peti (7,1). Batu: (7,0), (6,0), (5,0), (4,0), (3,0), (2,0), (1,0), (0,0), (7,2), (6,2), (5,2), (4,2), (3,2), (2,2), (1,2), (6,4), (5,4), (4,4), (3,4), (2,4), (1,4), (0,4), (7,6), (6,6), (5,6), (4,6), (3,6), (2,6), (1,6).

```text
     0 1 2 3 4 5 6 7
y=0  # # # # # # # #
y=1  . . . . . . . K
y=2  . # # # # # # #
y=3  . . . . . . . .
y=4  # # # # # # # .
y=5  . . . . . . . .
y=6  . # # # # # # #
y=7  . . . S . . . .
```

Fokus: Merencanakan, menelusuri, dan menyederhanakan algoritma yang lebih panjang.

Solusi terpendek terverifikasi: **38 instruksi biasa**.
Maju → Maju → Maju → Putar kanan → Maju → Maju → Putar kanan → Maju → Maju → Maju → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Maju → Maju → Maju → Putar kanan → Maju → Maju → Putar kanan → Maju → Maju → Maju → Maju → Maju → Maju → Maju → Ambil kunci → Buka peti.

```json
["forward","forward","forward","right","forward","forward","right","forward","forward","forward","forward","forward","forward","forward","left","forward","forward","left","forward","forward","forward","forward","forward","forward","forward","right","forward","forward","right","forward","forward","forward","forward","forward","forward","forward","take","open"]
```

Contoh program dengan Ulangi (hasil pembentangan sama persis):

```json
[{"repeat":2,"commands":["forward"]},{"repeat":2,"commands":["forward","right","forward"]},{"repeat":4,"commands":["forward"]},{"repeat":2,"commands":["forward","forward","left"]},{"repeat":3,"commands":["forward","forward"]},{"repeat":2,"commands":["forward","right","forward"]},{"repeat":3,"commands":["forward","forward"]},"take","open"]
```

## 46. Ambil Lalu Kembali — SD 6

Ukuran 8×8. Awal (5,0), hadap E (timur). Kunci (0,6); peti (5,4). Batu: (0,7), (1,7), (2,7), (3,7), (4,7), (5,7), (6,7), (7,7), (0,5), (1,5), (2,5), (3,5), (4,5), (5,5), (6,5), (1,3), (2,3), (3,3), (4,3), (5,3), (6,3), (7,3), (0,1), (1,1), (2,1), (3,1), (4,1), (5,1), (6,1).

```text
     0 1 2 3 4 5 6 7
y=0  . . . . . S . .
y=1  # # # # # # # .
y=2  . . . . . . . .
y=3  . # # # # # # #
y=4  . . . . . P . .
y=5  # # # # # # # .
y=6  K . . . . . . .
y=7  # # # # # # # #
```

Fokus: Merencanakan, menelusuri, dan menyederhanakan algoritma yang lebih panjang.

Solusi terpendek terverifikasi: **52 instruksi biasa**.
Maju → Maju → Putar kanan → Maju → Maju → Putar kanan → Maju → Maju → Maju → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Maju → Maju → Maju → Putar kanan → Maju → Maju → Putar kanan → Maju → Maju → Maju → Maju → Maju → Maju → Maju → Putar kiri → Putar kiri → Ambil kunci → Maju → Maju → Maju → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Putar kiri → Maju → Maju → Buka peti.

```json
["forward","forward","right","forward","forward","right","forward","forward","forward","forward","forward","forward","forward","left","forward","forward","left","forward","forward","forward","forward","forward","forward","forward","right","forward","forward","right","forward","forward","forward","forward","forward","forward","forward","left","left","take","forward","forward","forward","forward","forward","forward","forward","left","forward","forward","left","forward","forward","open"]
```

Contoh program dengan Ulangi (hasil pembentangan sama persis):

```json
["forward",{"repeat":2,"commands":["forward","right","forward"]},{"repeat":4,"commands":["forward"]},{"repeat":2,"commands":["forward","forward","left"]},{"repeat":3,"commands":["forward","forward"]},{"repeat":2,"commands":["forward","right","forward"]},{"repeat":3,"commands":["forward","forward"]},{"repeat":2,"commands":["left"]},"take","forward",{"repeat":3,"commands":["forward","forward"]},{"repeat":2,"commands":["left","forward","forward"]},"open"]
```

## 47. Baca Peta Terbalik — SD 6

Ukuran 8×8. Awal (5,0), hadap W (barat). Kunci (4,4); peti (7,6). Batu: (7,7), (6,7), (5,7), (4,7), (3,7), (2,7), (1,7), (0,7), (7,5), (6,5), (5,5), (4,5), (3,5), (2,5), (1,5), (6,3), (5,3), (4,3), (3,3), (2,3), (1,3), (0,3), (7,1), (6,1), (5,1), (4,1), (3,1), (2,1), (1,1).

```text
     0 1 2 3 4 5 6 7
y=0  . . . . . S . .
y=1  . # # # # # # #
y=2  . . . . . . . .
y=3  # # # # # # # .
y=4  . . . . K . . .
y=5  . # # # # # # #
y=6  . . . . . . . P
y=7  # # # # # # # #
```

Fokus: Merencanakan, menelusuri, dan menyederhanakan algoritma yang lebih panjang.

Solusi terpendek terverifikasi: **40 instruksi biasa**.
Maju → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Maju → Maju → Maju → Putar kanan → Maju → Maju → Putar kanan → Maju → Maju → Maju → Ambil kunci → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Maju → Maju → Maju → Buka peti.

```json
["forward","forward","forward","forward","forward","left","forward","forward","left","forward","forward","forward","forward","forward","forward","forward","right","forward","forward","right","forward","forward","forward","take","forward","forward","forward","forward","left","forward","forward","left","forward","forward","forward","forward","forward","forward","forward","open"]
```

Contoh program dengan Ulangi (hasil pembentangan sama persis):

```json
[{"repeat":3,"commands":["forward"]},{"repeat":2,"commands":["forward","forward","left"]},{"repeat":3,"commands":["forward","forward"]},{"repeat":2,"commands":["forward","right","forward"]},{"repeat":2,"commands":["forward"]},"take",{"repeat":3,"commands":["forward"]},{"repeat":2,"commands":["forward","left","forward"]},{"repeat":3,"commands":["forward","forward"]},"open"]
```

## 48. Telusuri Setiap Ulangan — SD 6

Ukuran 8×7. Awal (0,6), hadap E (timur). Kunci (0,0); peti (7,1). Batu: (0,1), (1,1), (2,1), (3,1), (4,1), (5,1), (6,1), (1,3), (2,3), (3,3), (4,3), (5,3), (6,3), (7,3), (0,5), (1,5), (2,5), (3,5), (4,5), (5,5), (6,5).

```text
     0 1 2 3 4 5 6 7
y=0  K . . . . . . .
y=1  # # # # # # # P
y=2  . . . . . . . .
y=3  . # # # # # # #
y=4  . . . . . . . .
y=5  # # # # # # # .
y=6  S . . . . . . .
```

Fokus: Merencanakan, menelusuri, dan menyederhanakan algoritma yang lebih panjang.

Solusi terpendek terverifikasi: **53 instruksi biasa**.
Maju → Maju → Maju → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Maju → Maju → Maju → Putar kanan → Maju → Maju → Putar kanan → Maju → Maju → Maju → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Maju → Maju → Maju → Putar kiri → Putar kiri → Ambil kunci → Maju → Maju → Maju → Maju → Maju → Maju → Maju → Putar kanan → Maju → Buka peti.

```json
["forward","forward","forward","forward","forward","forward","forward","left","forward","forward","left","forward","forward","forward","forward","forward","forward","forward","right","forward","forward","right","forward","forward","forward","forward","forward","forward","forward","left","forward","forward","left","forward","forward","forward","forward","forward","forward","forward","left","left","take","forward","forward","forward","forward","forward","forward","forward","right","forward","open"]
```

Contoh program dengan Ulangi (hasil pembentangan sama persis):

```json
[{"repeat":3,"commands":["forward","forward"]},{"repeat":2,"commands":["forward","left","forward"]},{"repeat":4,"commands":["forward"]},{"repeat":2,"commands":["forward","forward","right"]},{"repeat":3,"commands":["forward","forward"]},{"repeat":2,"commands":["forward","left","forward"]},{"repeat":3,"commands":["forward","forward"]},{"repeat":2,"commands":["left"]},"take","forward",{"repeat":3,"commands":["forward","forward"]},"right","forward","open"]
```

## 49. Rencanakan Jalan Pulang — SD 6

Ukuran 8×7. Awal (4,6), hadap W (barat). Kunci (3,0); peti (7,2). Batu: (7,1), (6,1), (5,1), (4,1), (3,1), (2,1), (1,1), (6,3), (5,3), (4,3), (3,3), (2,3), (1,3), (0,3), (7,5), (6,5), (5,5), (4,5), (3,5), (2,5), (1,5).

```text
     0 1 2 3 4 5 6 7
y=0  . . . K . . . .
y=1  . # # # # # # #
y=2  . . . . . . . P
y=3  # # # # # # # .
y=4  . . . . . . . .
y=5  . # # # # # # #
y=6  . . . . S . . .
```

Fokus: Merencanakan, menelusuri, dan menyederhanakan algoritma yang lebih panjang.

Solusi terpendek terverifikasi: **51 instruksi biasa**.
Maju → Maju → Maju → Maju → Putar kanan → Maju → Maju → Putar kanan → Maju → Maju → Maju → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Maju → Maju → Maju → Putar kanan → Maju → Maju → Putar kanan → Maju → Maju → Maju → Putar kiri → Putar kiri → Ambil kunci → Maju → Maju → Maju → Putar kiri → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Maju → Maju → Maju → Buka peti.

```json
["forward","forward","forward","forward","right","forward","forward","right","forward","forward","forward","forward","forward","forward","forward","left","forward","forward","left","forward","forward","forward","forward","forward","forward","forward","right","forward","forward","right","forward","forward","forward","left","left","take","forward","forward","forward","left","forward","forward","left","forward","forward","forward","forward","forward","forward","forward","open"]
```

Contoh program dengan Ulangi (hasil pembentangan sama persis):

```json
[{"repeat":2,"commands":["forward"]},{"repeat":2,"commands":["forward","forward","right"]},{"repeat":3,"commands":["forward","forward"]},{"repeat":2,"commands":["forward","left","forward"]},{"repeat":4,"commands":["forward"]},{"repeat":2,"commands":["forward","forward","right"]},{"repeat":3,"commands":["forward"]},{"repeat":2,"commands":["left"]},"take",{"repeat":2,"commands":["forward"]},{"repeat":2,"commands":["forward","left","forward"]},{"repeat":3,"commands":["forward","forward"]},"open"]
```

## 50. Misi Algoritma Bersama — SD 6

Ukuran 8×8. Awal (0,7), hadap E (timur). Kunci (0,1); peti (5,3). Batu: (0,0), (1,0), (2,0), (3,0), (4,0), (5,0), (6,0), (7,0), (0,2), (1,2), (2,2), (3,2), (4,2), (5,2), (6,2), (1,4), (2,4), (3,4), (4,4), (5,4), (6,4), (7,4), (0,6), (1,6), (2,6), (3,6), (4,6), (5,6), (6,6).

```text
     0 1 2 3 4 5 6 7
y=0  # # # # # # # #
y=1  K . . . . . . .
y=2  # # # # # # # .
y=3  . . . . . P . .
y=4  . # # # # # # #
y=5  . . . . . . . .
y=6  # # # # # # # .
y=7  S . . . . . . .
```

Fokus: Merencanakan, menelusuri, dan menyederhanakan algoritma yang lebih panjang.

Solusi terpendek terverifikasi: **57 instruksi biasa**.
Maju → Maju → Maju → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Maju → Maju → Maju → Putar kanan → Maju → Maju → Putar kanan → Maju → Maju → Maju → Maju → Maju → Maju → Maju → Putar kiri → Maju → Maju → Putar kiri → Maju → Maju → Maju → Maju → Maju → Maju → Maju → Putar kiri → Putar kiri → Ambil kunci → Maju → Maju → Maju → Maju → Maju → Maju → Maju → Putar kanan → Maju → Maju → Putar kanan → Maju → Maju → Buka peti.

```json
["forward","forward","forward","forward","forward","forward","forward","left","forward","forward","left","forward","forward","forward","forward","forward","forward","forward","right","forward","forward","right","forward","forward","forward","forward","forward","forward","forward","left","forward","forward","left","forward","forward","forward","forward","forward","forward","forward","left","left","take","forward","forward","forward","forward","forward","forward","forward","right","forward","forward","right","forward","forward","open"]
```

Contoh program dengan Ulangi (hasil pembentangan sama persis):

```json
[{"repeat":3,"commands":["forward","forward"]},{"repeat":2,"commands":["forward","left","forward"]},{"repeat":4,"commands":["forward"]},{"repeat":2,"commands":["forward","forward","right"]},{"repeat":3,"commands":["forward","forward"]},{"repeat":2,"commands":["forward","left","forward"]},{"repeat":3,"commands":["forward","forward"]},{"repeat":2,"commands":["left"]},"take","forward",{"repeat":3,"commands":["forward","forward"]},{"repeat":2,"commands":["right","forward","forward"]},"open"]
```

## Kontrak konfigurasi dan sesi kelas

`config/DEFAULT_CONFIG.json`: level 1, awal (0, 2) arah E, antrean kosong, kunci belum diambil, peti tertutup, mode sequence, musik 20%, efek 45%, tidak dimute. Suara baru dibuka oleh gestur Mulai. Ini default usulan persiapan, bukan keputusan anak.

Konfigurasi aman: level 1–50, program dengan batas di atas, mode sequence/step, mute, dan dua volume 0–1. Peta, arah awal, serta posisi objek tetap. `initialState` hanya metadata opsional yang harus cocok dengan level; saat mengganti level, hapus field itu agar validator mengisinya.

`validateConfig(config)` menghasilkan `{valid,errors,config}` bila sah; config merupakan salinan bersih termasuk badan loop. Jika gagal, hanya `{valid:false,errors}`. `configToState(config)` memvalidasi ulang dan memberi state awal baru. `expandQueue(queue)` menghasilkan daftar `{command,sourceIndex,iteration,repeatCount,bodyIndex}`; sourceIndex/bodyIndex berbasis nol, iteration mulai 1. Tidak ada fungsi ini yang otomatis memainkan kelas.

Gunakan Guru → Konfigurasi lokal (JSON) → Validasi → Terapkan konfigurasi. Membaca file hanya pratinjau. Saat Kunci sesi kelas aktif, simpan rancangan dan prediksi tanpa identitas; penerapan harus melalui izin Om Arif. Setelah Prompt 2 aktif, frasa tepat **“Ayo om pit eksekusi buat game nya”** mengizinkan rencana disepakati diterapkan pada skeleton yang sama dan diuji/bermain. Frasa ini tidak diperlukan untuk pembangunan/QA persiapan saat ini.

Sumber Prompt 2: `config/FEATURE_MANIFEST.json`, `config/CLASS_CONFIG_SCHEMA.json`, `config/DEFAULT_CONFIG.json`, `config/CLASS_STATE.json`, panduan guru, laporan QA, dan dokumen ini. Ide di luar manifest dicatat untuk nanti.

## Verifikasi dan pemulihan

`node tests/engine.test.mjs` pada Node 16.16.0: **65/65 lulus**. Semua 50 rute 3–57 instruksi telah dibuktikan oleh BFS independen pada `(x,y,arah,kunci)` dan dijalankan melalui engine. Seluruh 20 contoh loop membentang tepat ke solusi biasa. Struktur loop, batas 64/256, larangan bersarang, izin level, kegagalan aman, dan 5000 input berulang juga diuji.

Bukti logika bukan pengujian speaker, TV, jaringan, atau pengalaman anak. Lihat laporan QA untuk hasil browser 50 level, animasi, audio, offline, dan batas yang tersisa.

Checkpoint 3 level sebelum perluasan: `checkpoints/baseline-2026-10-15T 16-06-43-460Z-dc 8028` (43 berkas, SHA-256 diverifikasi). Ini titik pemulihan versi lama; jangan menimpanya. Gunakan panduan checkpoint untuk membuat salinan pemulihan terpisah. Checkpoint final 50 level dibuat setelah QA akhir.
