# Musik dan suara Robot Cari Kunci

**Langkah Kecil Robot** adalah komposisi orisinal untuk game ini: 16 birama, C mayor, 4/4, 104 BPM, sekitar 36,92 detik per putaran. Melodinya ada di `audio.js` sebagai `MUSIC_SCORE`. Tidak menggunakan rekaman, sampel, soundfont, atau aset musik pihak ketiga.

- `assets/music.mid`: Standard MIDI File format 1, empat track, resolusi 480 ticks per ketuk; satu track tempo serta tiga suara (melodi, bas, nada pengiring). Semua note-on mempunyai note-off, dan panjang semua track sama dengan 64 ketuk.
- `assets/music-score.json`: data nada, waktu, durasi, dinamika, dan jenis suara yang sama dengan skor game.
- `assets/music-preview.wav`: pratinjau lokal PCM mono 16 bit/24 kHz dari skor yang sama. File ini dapat diputar di pemutar audio untuk pemeriksaan guru. Warna suara MIDI tergantung soundfont pemutar; game memakai instrumen Web Audio sendiri.
- `audio.js`: game menghasilkan suara sungguhan memakai oscillator Web Audio (triangle lembut untuk melodi dan sine untuk bas/pengiring), amplop volume, serta bus volume musik dan efek yang terpisah. Tidak memerlukan jaringan atau MIDI player.

`new GameAudio()` tidak membuat AudioContext. Hanya handler gestur **Mulai** yang boleh memanggil `await audio.unlock()`, kemudian `audio.startMusic()`. Musik tidak berbunyi sebelum audio dibuka. Volume bawaan musik 20% dan efek 45%; tombol mute menutup keluaran utama sambil mempertahankan nilai volume. Slider kedua bus menerima angka 0–1. Volume perangkat/TV tetap perlu diperiksa guru; persentase aplikasi tidak menetapkan kekerasan speaker secara fisik.

Efek tersedia: `move` (langkah bulat pendek), `turn` (geser nada naik), `key` (tiga nada naik), `locked` (boing lembut), `success` (fanfare singkat), `blocked` (boing turun), `missing` (dua nada penasaran), dan `already` (dua nada pengingat). Semua dibuat lokal lewat oscillator, tanpa suara mengejutkan atau hukuman.

Musik dijadwalkan 180 ms ke depan lewat satu timer 75 ms. Start berulang tidak menambah timer; stop membersihkan timer dan oscillator musik. Setelah tab lama tersembunyi, musik melompati jadwal yang sudah lewat. Suara efek dibatasi 24 oscillator aktif dan musik 32; oscillator dilepas setelah selesai. Kompresor keluaran dengan ambang −12 dB meredam lonjakan bila beberapa efek tumpang tindih. `dispose()` menutup semuanya bila halaman induk mengganti game.

API publik: `unlock()`, `startMusic()`, `stopMusic()`, `setVolumes(music, effects)`, `setMuted(boolean)`, `play(event)`, `getStatus()`, dan cleanup opsional `dispose()`.

Untuk membangun ulang aset, jalankan `node scripts/generate-music.mjs` dari folder game. Generator tanpa dependensi mengambil skor yang sama persis dengan game. Jalankan `node tests/audio.test.mjs` untuk memeriksa struktur MIDI, kecocokan nada, PCM tak kosong/tidak terpotong, larangan AudioContext sebelum unlock, setiap SFX, mute, dua volume terpisah, satu timer, dan batas suara saat spam. Tes memakai `node:assert` dan tidak memerlukan runner `node:test`, agar sesuai dengan Node yang sudah tersedia.

Tes unit menggunakan AudioContext tiruan untuk menguji penjadwalan dan jalur kontrol; file WAV diuji sebagai data PCM. Hasil tersebut **bukan bukti pendengaran dari speaker fisik**. Pengujian browser Web Audio (jika dilakukan) dicatat terpisah pada laporan QA utama. Guru perlu memutar musik serta efek dari TV sebelum kelas untuk menilai kenyamanan, speaker, dan jalur HDMI/Bluetooth yang benar.
