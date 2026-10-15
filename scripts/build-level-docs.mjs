// Maintainer tool, never loaded by the game. Rebuilds contracts and map documentation from static levels.
import { readFile, writeFile } from 'node:fs/promises';
import { LEVELS, LEVEL_GROUPS, COMMANDS } from '../levels.js';
import { MAX_QUEUE_LENGTH, MAX_EXPANDED_LENGTH, DEFAULT_CONFIG } from '../engine.js';
const root=new URL('../',import.meta.url),save=(path,value)=>writeFile(new URL(path,root),typeof value==='string'?value:JSON.stringify(value,null,2)+'\n');

const schema={
  $schema:'https://json-schema.org/draft/2020-12/schema',
  title:'Robot Cari Kunci — 50 level, konfigurasi kelas versi 1',
  description:'Schema disertakan lokal. URL $schema hanya penanda standar; browser tidak mengambilnya. Runtime engine.js memvalidasi panjang hasil loop maksimal 256 dan posisi awal yang sesuai level. Default merupakan usulan persiapan, bukan keputusan anak.',
  type:'object',additionalProperties:false,
  required:['version','levelId','queue','playMode','musicVolume','effectsVolume','muted'],
  $defs:{
    command:{type:'string',enum:COMMANDS},
    repeatBlock:{type:'object',additionalProperties:false,required:['repeat','commands'],properties:{repeat:{type:'integer',enum:[2,3,4]},commands:{type:'array',minItems:1,maxItems:12,items:{$ref:'#/$defs/command'}}},description:'Ulangi tersedia hanya level 31–50 (SD 4–6). Tidak bersarang. Setiap perintah di dalamnya tetap satu langkah eksekusi.'}
  },
  properties:{
    version:{const:1},
    levelId:{type:'integer',minimum:1,maximum:50,description:'Memilih satu dari 50 peta tetap dan mereset posisi, kunci, peti, serta penunjuk program.'},
    initialState:{type:'object',additionalProperties:false,required:['x','y','dir','hasKey','won'],properties:{x:{type:'integer',minimum:0,maximum:7},y:{type:'integer',minimum:0,maximum:7},dir:{enum:['N','E','S','W']},hasKey:{const:false},won:{const:false}},description:'Metadata opsional yang wajib cocok dengan posisi tetap level. Hilangkan field ini saat mengganti level; validator akan mengisinya. Bukan pemindahan robot bebas.'},
    queue:{type:'array',maxItems:MAX_QUEUE_LENGTH,items:{oneOf:[{$ref:'#/$defs/command'},{$ref:'#/$defs/repeatBlock'}]},description:'Maksimal 64 kartu/blok di baris program, maksimal 256 instruksi biasa setelah Ulangi dibentangkan. Antrean kosong atau rute keliru boleh diuji sebagai proses belajar. Menerapkan konfigurasi tidak menjalankan program otomatis.'},
    playMode:{type:'string',enum:['sequence','step'],description:'sequence menjalankan program berurutan; step menjalankan satu instruksi biasa, termasuk satu isi Ulangi, setiap tindakan guru.'},
    musicVolume:{type:'number',minimum:0,maximum:1,description:'Volume musik saja.'},
    effectsVolume:{type:'number',minimum:0,maximum:1,description:'Volume efek saja.'},
    muted:{type:'boolean',description:'Membisukan seluruh suara tanpa mengubah dua nilai volume.'}
  },
  allOf:[
    {if:{properties:{levelId:{maximum:30}}},then:{properties:{queue:{items:{$ref:'#/$defs/command'}}}}},
    ...LEVELS.map(level=>({if:{properties:{levelId:{const:level.id}}},then:{properties:{initialState:{properties:{x:{const:level.start.x},y:{const:level.start.y},dir:{const:level.start.dir}}}}}}))
  ],
  'x-expanded-command-limit':MAX_EXPANDED_LENGTH,
  'x-apply':'validateConfig(config) memvalidasi seluruh struktur, rentang, level, initialState, dan batas hasil Ulangi. Gunakan Guru > Konfigurasi lokal > Validasi lalu Terapkan konfigurasi. Memuat file hanya menampilkan pratinjau. configToState(config) memberi state awal tanpa menjalankannya.',
  'x-class-permission':'Setelah Prompt 2 aktif, hanya Om Arif dengan frasa persis “Ayo om pit eksekusi buat game nya” boleh mengizinkan penerapan konfigurasi dan pengujian/bermain. Sebelumnya simpan rancangan.'
};
await save('config/CLASS_CONFIG_SCHEMA.json',schema);
await save('config/DEFAULT_CONFIG.json',DEFAULT_CONFIG);

const manifest=JSON.parse(await readFile(new URL('config/FEATURE_MANIFEST.json',root),'utf8'));
manifest.edition='50-level progression with finite repeat blocks';
manifest.designStatus='Pengembangan 50 level dan loop SD 4–6 diminta Om Arif. Penempatan jenjang adalah usulan pedagogis, bukan keputusan anak atau klaim validasi kurikulum/uji coba anak.';
manifest.sources=['levels.js','engine.js','index.html','docs/LEVELS.md','tests/engine.test.mjs'];
manifest.logicEvidence={date:'2026-10-15',runtime:'Node.js 16.16.0 lokal, runner node:assert',command:'node tests/engine.test.mjs',result:'65 tests passed; 0 failed',scope:['50 peta unik, objek berada di dalam batas dan bukan batu','Semua 50 solusi tanpa kegagalan','BFS independen pada posisi/arah/status kunci membuktikan optimum 3–57 instruksi','Program contoh loop membentang tepat sama dengan solusi biasa','Distribusi jenjang 6/6/6/6/6/6/7/7','Arah relatif dan interaksi petak yang sama','Kunci wajib, batas dan batu, pemulihan kegagalan','5000 perintah berulang tanpa state ilegal','Loop 2–4 kali hanya level 31–50','Badan 1–12 kartu, tanpa loop bersarang','Batas 64 blok dan 256 instruksi, 257 ditolak','Config divalidasi ketat dan disalin tanpa berbagi badan loop'],limitation:'Tes logika bukan bukti browser, animasi, audio, TV fisik, atau jaringan. Bukti integrasi 50 level dicatat terpisah setelah QA.'};
manifest.rules.maxQueueLength=MAX_QUEUE_LENGTH;
manifest.rules.maxExpandedLength=MAX_EXPANDED_LENGTH;
manifest.rules.repeat={levels:'31–50 / SD 4–6',repeatCounts:[2,3,4],bodyLength:'1–12 kartu biasa',nested:false,step:'Satu langkah menjalankan satu instruksi biasa, bukan seluruh blok Ulangi.'};
manifest.groups=LEVEL_GROUPS.map(group=>{const levels=LEVELS.filter(l=>l.grade===group.grade);return {...group,shortestRouteRange:[Math.min(...levels.map(l=>l.solution.length)),Math.max(...levels.map(l=>l.solution.length))]};});
manifest.progression='Bertahap berdasarkan konsep dan struktur rute, bukan selalu panjang solusi yang meningkat. SD 4 dimulai dengan rute lebih pendek untuk memperkenalkan Ulangi.';
manifest.levels=LEVELS.map(level=>({...level,interaction:'same_cell',keyRequired:true,status:'tested_logic'}));
manifest.configuration.supported=['levelId 1–50','queue maksimal 64 kartu/blok','Ulangi 2–4 kali, badan 1–12 kartu, hanya level 31–50','Maksimal 256 instruksi hasil pembentangan','playMode sequence/step','musicVolume 0–1','effectsVolume 0–1','muted boolean'];
manifest.configuration.validation='engine.js validateConfig dan expandQueue: field, tipe, level, rentang, posisi tetap, bentuk loop, larangan loop bersarang, dan batas hasil eksekusi.';
const pauseControl=manifest.controls.find(control=>control.id==='pause-button');if(pauseControl)pauseControl.label='Jeda / Dijeda';
const runControl=manifest.controls.find(control=>control.id==='run-button');if(runControl)runControl.label='Jalankan / Lanjutkan';
const additions=[['level-picker','Pilih level'],['grade-tabs','Pilih jenjang'],['previous-level','Level sebelumnya'],['advance-level','Level selanjutnya'],['repeat-toggle','Buat pengulangan'],['repeat-count','Ulangi 2× / 3× / 4×'],['repeat-save','Simpan blok'],['repeat-cancel','Batal'],['audio-retry','Mulai audio']];
for(const[id,label]of additions){const existing=manifest.controls.find(control=>control.id===id);if(existing)existing.label=label;else manifest.controls.push({id,label,status:'ui_present_not_tested'});}
manifest.pendingEvidence=['Browser seluruh 50 level','Pemilihan level dan jenjang','Composer Ulangi, penunjuk iterasi, pause/reset/step di tengah blok','Input cepat dengan loop','Pengujian ulang offline reload paket 50 level','Keterbacaan peta 8×8 pada TV fisik','Penilaian kesesuaian kesulitan oleh guru/anak'];
manifest.unsupported=['Ulangi bersarang','repeat selain 2, 3, 4','Perubahan peta atau posisi objek melalui config','Generasi AI saat kelas','Multiplayer','Profil atau identitas anak','Perekaman anak','Musuh, horor, lompatan, eliminasi, atau penghitung waktu'];
await save('config/FEATURE_MANIFEST.json',manifest);

const names={forward:'Maju',left:'Putar kiri',right:'Putar kanan',take:'Ambil kunci',open:'Buka peti'};
const directions={N:'utara',E:'timur',S:'selatan',W:'barat'};
const lines=[
  '# Peta, solusi, dan konfigurasi 50 level Robot Cari Kunci','',
  'Sumber kebenaran: `levels.js` (50 peta tetap) dan `engine.js` (aturan/validasi). Dokumentasi ini dibuat dari data yang sama, lalu semua solusi diverifikasi oleh BFS independen dan simulasi engine. Tidak ada peta acak atau generasi saat kelas. Semua karakter, peta, musik, dan nama merupakan rancangan orisinal.','',
  'Perluasan 50 level dan pengulangan SD 4–6 diminta Om Arif. Jenjang merupakan usulan tingkat kesulitan; guru boleh memilih sesuai kebutuhan. Ini bukan klaim uji pembelajaran dengan anak atau kesesuaian kurikulum resmi. Tidak perlu menamatkan 50 level dalam satu pertemuan TK.','',
  '## Progresi konsep','',
  '| Jenjang | Level | Solusi terpendek (kartu biasa) | Fokus |','|---|---|---:|---|',
  ...manifest.groups.map(g=>`| ${g.grade} | ${g.levelIds[0]}–${g.levelIds.at(-1)} | ${g.shortestRouteRange.join('–')} | ${g.focus} |`),'',
  'Jumlah level: 6 + 6 + 6 + 6 + 6 + 6 + 7 + 7 = 50. Kesulitan tidak selalu bertambah menurut panjang solusi: pengenalan Ulangi di SD 4 sengaja kembali ke rute pendek berpola.','',
  '## Aturan yang selalu sama','',
  '- Koordinat `(x,y)` berbasis nol: x ke kanan, y ke bawah; baris y=0 di utara. Arah N=utara, E=timur, S=selatan, W=barat.',
  '- **Maju** satu petak relatif hidung robot. **Putar kiri/kanan** 90° di tempat. Arah instruksi tidak berubah mengikuti kamera.',
  '- **Ambil kunci** dan **Buka peti** harus berada di petak yang sama dengan objek. Arah hadap bebas. Melewati kunci tidak mengambilnya otomatis.',
  '- Peti memerlukan kunci. Kunci/peti boleh ditempati robot. Batu dan batas peta menahan gerak tanpa hukuman.',
  '- Percobaan gagal menggunakan satu instruksi, lalu antrean dijeda untuk diskusi. Posisi/kunci tetap aman; tidak ada waktu habis atau eliminasi.',
  '- Reset level mengembalikan state dan penunjuk ke awal sambil menyimpan antrean. Mengedit antrean juga mengembalikan papan ke awal. Kosongkan menghapus antrean dan mengembalikan papan.',
  '- Setelah berhasil, state tetap sampai reset.','',
  '## Ulangi: hanya level 31–50 (SD 4–6)','',
  'Buat pengulangan menerima 2, 3, atau 4 ulangan dengan badan 1–12 kartu biasa. Loop bersarang tidak tersedia. Antrean maksimal 64 kartu/blok dan maksimal 256 instruksi biasa setelah pembentangan. Satu langkah guru mengeksekusi satu instruksi biasa di dalam blok; tampilan menunjukkan ulangan yang sedang berjalan.','',
  'Contoh level 31: Ambil kunci → Ulangi 2× [Maju, Putar kiri, Maju, Putar kanan] → Maju → Putar kiri → Maju → Buka peti. Enam kartu/blok yang terlihat menjadi 13 instruksi eksekusi.','',
  '```json',JSON.stringify(LEVELS[30].programSolution,null,2),'```','',
  'Guru dapat membahas prediksi posisi dan arah setelah satu ulangan sebelum menjalankan ulangan berikutnya. Untuk perbaikan, jeda/reset dahulu lalu ubah program. Contoh program di bawah membentang tepat ke solusi biasa; kompresi tidak mengubah arti instruksi.','',
  '## Membaca peta dan solusi','',
  '`S`=robot awal, `K`=kunci, `P`=peti, `@`=robot awal dan kunci satu petak, `#`=batu, `.`=bebas. Arah awal ditulis pada metadata. Solusi terpendek menghitung setiap Maju/Putar/Ambil/Buka sebagai 1 instruksi; blok Ulangi dihitung setelah dibentangkan. Tidak ada skor atau tekanan efisiensi untuk anak.',''
];
for(const level of LEVELS){
  const walls=new Set(level.obstacles.map(p=>`${p.x},${p.y}`)),map=['     '+Array.from({length:level.width},(_,x)=>x).join(' ')];
  for(let y=0;y<level.height;y++){const row=[];for(let x=0;x<level.width;x++){const start=x===level.start.x&&y===level.start.y,key=x===level.key.x&&y===level.key.y,chest=x===level.chest.x&&y===level.chest.y;row.push(start&&key?'@':start?'S':key?'K':chest?'P':walls.has(`${x},${y}`)?'#':'.');}map.push(`y=${y}  ${row.join(' ')}`);}
  lines.push(`## ${level.id}. ${level.title} — ${level.grade}`,'',`Ukuran ${level.width}×${level.height}. Awal (${level.start.x},${level.start.y}), hadap ${level.start.dir} (${directions[level.start.dir]}). Kunci (${level.key.x},${level.key.y}); peti (${level.chest.x},${level.chest.y}). Batu: ${level.obstacles.length?level.obstacles.map(p=>`(${p.x},${p.y})`).join(', '):'tidak ada'}.`,'','```text',...map,'```','',`Fokus: ${level.lesson}`,'',`Solusi terpendek terverifikasi: **${level.shortestCommandCount} instruksi biasa**.`,level.solution.map(command=>names[command]).join(' → ')+'.','','```json',JSON.stringify(level.solution),'```','');
  if(level.loopAvailable)lines.push('Contoh program dengan Ulangi (hasil pembentangan sama persis):','','```json',JSON.stringify(level.programSolution),'```','');
}
lines.push('## Kontrak konfigurasi dan sesi kelas','',
  '`config/DEFAULT_CONFIG.json`: level 1, awal (0, 2) arah E, antrean kosong, kunci belum diambil, peti tertutup, mode sequence, musik 20%, efek 45%, tidak dimute. Suara baru dibuka oleh gestur Mulai. Ini default usulan persiapan, bukan keputusan anak.','',
  'Konfigurasi aman: level 1–50, program dengan batas di atas, mode sequence/step, mute, dan dua volume 0–1. Peta, arah awal, serta posisi objek tetap. `initialState` hanya metadata opsional yang harus cocok dengan level; saat mengganti level, hapus field itu agar validator mengisinya.','',
  '`validateConfig(config)` menghasilkan `{valid,errors,config}` bila sah; config merupakan salinan bersih termasuk badan loop. Jika gagal, hanya `{valid:false,errors}`. `configToState(config)` memvalidasi ulang dan memberi state awal baru. `expandQueue(queue)` menghasilkan daftar `{command,sourceIndex,iteration,repeatCount,bodyIndex}`; sourceIndex/bodyIndex berbasis nol, iteration mulai 1. Tidak ada fungsi ini yang otomatis memainkan kelas.','',
  'Gunakan Guru → Konfigurasi lokal (JSON) → Validasi → Terapkan konfigurasi. Membaca file hanya pratinjau. Saat Kunci sesi kelas aktif, simpan rancangan dan prediksi tanpa identitas; penerapan harus melalui izin Om Arif. Setelah Prompt 2 aktif, frasa tepat **“Ayo om pit eksekusi buat game nya”** mengizinkan rencana disepakati diterapkan pada skeleton yang sama dan diuji/bermain. Frasa ini tidak diperlukan untuk pembangunan/QA persiapan saat ini.','',
  'Sumber Prompt 2: `config/FEATURE_MANIFEST.json`, `config/CLASS_CONFIG_SCHEMA.json`, `config/DEFAULT_CONFIG.json`, `config/CLASS_STATE.json`, panduan guru, laporan QA, dan dokumen ini. Ide di luar manifest dicatat untuk nanti.','',
  '## Verifikasi dan pemulihan','',
  '`node tests/engine.test.mjs` pada Node 16.16.0: **65/65 lulus**. Semua 50 rute 3–57 instruksi telah dibuktikan oleh BFS independen pada `(x,y,arah,kunci)` dan dijalankan melalui engine. Seluruh 20 contoh loop membentang tepat ke solusi biasa. Struktur loop, batas 64/256, larangan bersarang, izin level, kegagalan aman, dan 5000 input berulang juga diuji.','',
  'Bukti logika bukan pengujian speaker, TV, jaringan, atau pengalaman anak. Lihat laporan QA untuk hasil browser 50 level, animasi, audio, offline, dan batas yang tersisa.','',
  'Checkpoint 3 level sebelum perluasan: `checkpoints/baseline-2026-10-15T 16-06-43-460Z-dc 8028` (43 berkas, SHA-256 diverifikasi). Ini titik pemulihan versi lama; jangan menimpanya. Gunakan panduan checkpoint untuk membuat salinan pemulihan terpisah. Checkpoint final 50 level dibuat setelah QA akhir.','');
await save('docs/LEVELS.md',lines.join('\n'));
console.log('Updated schema, defaults, manifest, and documentation for all 50 static maps.');
