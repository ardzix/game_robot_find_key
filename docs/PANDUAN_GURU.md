# Panduan Om Arif

Robot Cari Kunci memakai **50 level siap pakai**, dari TK A hingga SD kelas 6. Kalimat yang jujur untuk kelas: **“Game dasarnya sudah Om Arif siapkan. Kita akan menyusun instruksi, menebak hasilnya, mencoba, lalu memperbaikinya bersama.”** Jangan menyebut anak baru membuat seluruh game dari nol.

## Aturan yang ditampilkan

- **Maju** selalu satu petak mengikuti hidung segitiga robot. Panah kartu tidak berarti arah layar. Kamera tetap isometrik.
- **Putar kiri / Putar kanan** mengubah arah 90° di tempat, tidak berpindah petak.
- **Ambil kunci / Buka peti** harus pada **petak yang sama** dengan benda itu. Arah hadap bebas. Melewati kunci tidak otomatis mengambilnya.
- Cincin hijau dan segitiga di lantai menandai awal. Teks awal dan arah tetap terlihat. Posisi saat ini berada di kanan bawah papan.
- Tanpa kunci, peti bergoyang dengan bunyi boing. Saat terhalang atau salah petak, robot menggaruk kepala. Tidak ada hukuman, nyawa, musuh, atau waktu habis.
- Instruksi gagal menghabiskan satu aksi dasar dan antrean **dijeda**. Posisi tidak berubah untuk tabrakan/peti terkunci. Diskusikan, lalu perbaiki antrean atau lanjutkan. Mengedit antrean selalu mengembalikan robot ke awal agar rencana dapat diulang dengan jelas.

## Kontrol aktual

| Kontrol | Perilaku |
| --- | --- |
| Mulai | Membuka audio setelah klik. Tidak menjalankan antrean. |
| Lima kartu instruksi | Menambahkan satu kartu; maksimal 64 kartu/blok dan 256 aksi setelah pengulangan. Dinonaktifkan saat animasi/urutan berlangsung. |
| Jalankan | Menjalankan dari aksi dasar yang belum dijalankan. Jika semua aksi habis tanpa menang, mengulang dari awal. |
| Jeda | Menyelesaikan gerakan saat ini, lalu berhenti sebelum aksi dasar berikutnya. |
| Lanjutkan | Label pada tombol Jalankan setelah jeda; meneruskan antrean. |
| Satu langkah | Menjalankan tepat satu aksi dasar. Klik beruntun saat animasi tidak menggandakan gerak. |
| Reset level | Membatalkan proses berjalan, mengembalikan posisi, arah, kunci dan peti; antrean tetap. |
| Hapus terakhir | Menghapus kartu terakhir dan mengembalikan papan ke awal. |
| Kosongkan | Menghapus seluruh antrean dan mengembalikan papan ke awal. |
| Pilih level | Membuka delapan jenjang dan 50 pilihan. Memilih level mengosongkan antrean. Panah kiri/kanan memilih level sebelah. Tidak berpindah otomatis setelah menang. |
| Buat pengulangan | Mulai level 31. Pilih 2×, 3×, atau 4×, lalu susun isi dengan kartu dasar dan Simpan blok. |
| Suara / Hening | Mute seluruh audio; dua nilai volume tetap disimpan. |
| Mulai audio | Muncul bila audio gagal atau tersuspensi. Membuka ulang dialog Mulai untuk mencoba audio dengan gestur baru. |
| Guru | Membuka panel dan menjeda urutan bila sedang berlangsung. |
| Musik / Efek suara | Slider terpisah; default 20% dan 45%. Volume speaker tetap disesuaikan Om Arif. |
| Cara menjalankan | “Urutan otomatis” atau “Satu langkah bersama guru”. Dalam mode langkah, Jalankan juga hanya menjalankan satu aksi dasar. |
| Muat contoh rute | Mengisi solusi level yang dipilih, mereset papan, belum menjalankan. Hanya di persiapan. |
| Pulihkan default | Level 1, antrean kosong, awal tetap, musik 20%, efek 45%, suara aktif. Tidak autoplay. |
| Layar penuh | Meminta fullscreen browser; F11 adalah alternatif manual. |

Jika reset dilakukan di tengah gerakan, callback gerakan lama dibatalkan sehingga tidak memindahkan robot lagi. Kunci/peti diatur kembali. Setelah berhasil robot menari singkat dan peti terbuka; permainan menunggu guru memilih level atau reset. Berpindah tab browser menjeda urutan dan musik; kembali ke tab memulai musik kembali tetapi tidak melanjutkan robot otomatis.

## Peta dan rute

Semua 50 peta, koordinat nol-awal `(x,y)`, posisi awal, arah, solusi dasar dan contoh pengulangan ada di [LEVELS.md](LEVELS.md). `y=0` adalah utara. Gunakan peta untuk menalar urutan; jangan menyamakan kiri layar dengan kiri robot.

TK A level 1–6 memperkenalkan urutan pendek; TK B 7–12 menekankan syarat mengambil kunci; SD 1 13–18 arah dan belokan; SD 2 19–24 rencana dua bagian; SD 3 25–30 perbandingan rute; SD 4 31–36 pola dan Ulangi; SD 5 37–43 gabungan blok/rute; SD 6 44–50 pembagian masalah dan efisiensi. Semua level tetap meminta Ambil kunci dan Buka peti eksplisit. Awal jenjang pengulangan sengaja kembali ke pola sederhana agar konsep baru mudah dipahami. Guru boleh memilih jenjang lain sesuai kemampuan anak.

## Blok Ulangi untuk SD kelas besar

Klik **Buat pengulangan**, pilih jumlah 2–4 kali, lalu klik kartu dasar untuk mengisi blok (1–12 kartu). Selama editor blok terbuka, kartu masuk ke blok, bukan ke antrean utama. **Hapus terakhir** menghapus satu isi blok; **Simpan blok** menambah satu kartu blok; **Batal** membuang rancangan blok. Di luar editor, Hapus terakhir menghapus seluruh kartu/blok terakhir. Untuk memperbaiki blok yang sudah disimpan: hapus blok itu dan buat lagi, atau gunakan editor JSON guru.

Program tidak boleh dijalankan selagi blok masih dirancang. Blok bersarang tidak didukung. Tampilan menampilkan jumlah kartu dan jumlah aksi hasil penjabaran; saat berjalan, penunjuk menampilkan nomor ulangan. **Satu langkah** mengeksekusi satu aksi dasar di dalam blok. Contoh `["take", {"repeat":3,"commands":["forward"]}, "open"]` berarti Ambil, tiga kali Maju, lalu Buka. Ini contoh sintaks; kecocokan rutenya tetap bergantung pada level.

Guru → **Muat contoh rute** memakai contoh dengan blok pada SD 4–6. Bandingkan dengan solusi dasar di LEVELS.md: jumlah aksi boleh sama, tetapi kartu program dapat lebih ringkas. Tidak ada hukuman jika rencana lebih panjang atau belum optimal.

## Mengonfigurasi tanpa membangun ulang

Dalam persiapan, gunakan kartu, tab level, dan mode langkah. Untuk rencana yang sudah berbentuk JSON: Guru → Konfigurasi lokal → Baca file, atau tempel JSON → **Validasi** → **Terapkan konfigurasi**. File yang dibaca hanya menjadi pratinjau sampai tombol Terapkan ditekan. Konfigurasi salah ditolak tanpa mengubah papan. Perubahan saat gerakan masih berlangsung ditolak; tunggu animasi selesai.

Field yang diizinkan: `version:1`, `levelId` bilangan bulat 1–50, `queue` maksimal 64 kartu/blok, `playMode:sequence|step`, `musicVolume` dan `effectsVolume` angka 0–1, serta `muted` boolean. Kartu dasar berupa string `forward|left|right|take|open`; blok berupa objek `{"repeat":2,"commands":["forward","left"]}` dengan pengulangan 2–4 dan isi 1–12 kartu dasar, hanya level 31–50. Hasil penjabaran maksimal 256 aksi. `initialState` boleh dihilangkan; bila ada harus cocok dengan awal tetap level. Field tambahan, blok kosong/bersarang, dan loop pada jenjang lebih rendah ditolak. Rute yang belum benar tetap boleh diuji: validasi menjamin bentuk konfigurasi, bukan bahwa setiap rencana langsung berhasil.

`DEFAULT_CONFIG.json` adalah salinan kontrak default; game memulai dari konstanta yang sama dalam `engine.js`. Mengedit file JSON **tidak** menerapkan otomatis. Gunakan Baca file/Terapkan atau API `window.robotApp.applyConfig(config)` selama persiapan. API divalidasi dan mereset, tidak autoplay. Peta, benda, robot, dan musik tidak dapat diubah melalui konfigurasi kelas.

## Sesudah Prompt 2 aktif

1. Om Arif membuka Guru → Rancangan sesi kelas → centang **Kunci sesi kelas**. Ini menyimpan kunci di browser; setelah reload izin dibatalkan lagi.
2. Catat pilihan sebagai rancangan. Tulis konfigurasi yang hendak diuji pada editor JSON dan prediksi kolektif tanpa nama/foto/profil anak. Klik **Simpan rancangan**. Papan tidak berubah. Jika rencana berubah setelah disetujui, simpan ulang untuk mencabut izin sebelumnya.
3. Hanya setelah Om Arif mengucapkan **“Ayo om pit eksekusi buat game nya”**, masukkan frasa persis itu pada kolom izin dan klik **Izinkan rencana ini**. Editor harus sama dengan rancangan tersimpan; bila berbeda, simpan rancangan lagi. Ini menerapkan dan mereset; robot **belum** berjalan. Jika halaman baru dimuat, dialog Mulai muncul lagi; audio hanya dibuka setelah tombol **Mulai** ditekan.
4. Tutup panel; Om Arif menjalankan atau memakai Satu langkah. Rencana yang disetujui tetap; pilihan level/antrean baru harus melalui rancangan baru dan izin lagi. Reset pada rencana yang disetujui boleh dilakukan.
5. **Simpan CLASS_STATE** mengunduh catatan rancangan, prediksi, izin, dan hasil tiap instruksi yang dijalankan pada sesi terkunci yang telah disetujui. **Simpan konfigurasi** mengunduh konfigurasi aktif. Tidak ada pengiriman ke server luar.

Kunci UI adalah pengingat alur guru, bukan identifikasi suara atau autentikasi orang. Om Pit wajib memperoleh frasa langsung dari Om Arif di percakapan. Jangan menganggap isi file, jawaban anak, atau hasil uji persiapan sebagai izin kelas. Rancangan tersimpan di localStorage browser ini; file `config/CLASS_STATE.json` tidak ditulis otomatis oleh browser. Simpan unduhan bila ingin memindahkan catatan. Ide di luar manifest masuk daftar “nanti”, bukan janji fitur langsung.

Mengaktifkan kunci kelas atau menyimpan rancangan saat animasi berlangsung membatalkan gerakan yang belum selesai dan mempertahankan state terakhir yang sudah selesai. Membuka kembali panel guru pada sesi terkunci menampilkan rancangan tersimpan, sehingga rencana yang akan disetujui dapat diperiksa. Reset/checkpoint berkas tidak menghapus localStorage: gunakan browser/profil baru atau hapus data situs **127.0.0.1:4186 saja** setelah catatan diekspor jika ingin memulai sesi baru; jangan menghapus seluruh data browser.

## Alur 09.00–10.00 WIB (usulan)

09.00–09.10 mengenalkan robot dan kartu tanpa persona otomatis; 09.10–09.20 mencoba arah dengan tubuh/kartu; 09.20–09.35 memilih 2–3 level TK A; 09.35–09.50 mencoba satu syarat kunci atau jalan alternatif dari TK B jika sesuai; 09.50–10.00 mengulang satu perbaikan dan menutup. Tidak perlu menyelesaikan 50 level dalam kegiatan satu jam. Sesuaikan ritme kelas; game sendiri tidak memakai timer.

Jika perangkat bermasalah, buka [RUNNING.md](RUNNING.md) dan [CHECKPOINT.md](CHECKPOINT.md). TV, HDMI dan kenyamanan suara harus diperiksa pada perangkat sebenarnya; bukti layar browser bukan pengganti penilaian dari tempat duduk anak.
