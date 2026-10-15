/** Fifty original fixed teaching maps, independently checked with command-space BFS.
 * This is static data: no map generation or network dependency runs during class.
 */
export const COMMANDS = Object.freeze(['forward','left','right','take','open']);
export const DIRECTIONS = Object.freeze(['N','E','S','W']);
function deepFreeze(value) { for (const child of Object.values(value)) if (child && typeof child === 'object') deepFreeze(child); return Object.freeze(value); }
export const LEVEL_GROUPS = deepFreeze([
  {
    "grade": "TK A",
    "count": 6,
    "focus": "Urutan pendek, satu petak, dan arah hadap.",
    "index": 1,
    "levelIds": [
      1,
      2,
      3,
      4,
      5,
      6
    ]
  },
  {
    "grade": "TK B",
    "count": 6,
    "focus": "Kunci sebagai syarat, putaran, dan rute sederhana.",
    "index": 2,
    "levelIds": [
      7,
      8,
      9,
      10,
      11,
      12
    ]
  },
  {
    "grade": "SD 1",
    "count": 6,
    "focus": "Prediksi, rute alternatif, dan memperbaiki satu kesalahan.",
    "index": 3,
    "levelIds": [
      13,
      14,
      15,
      16,
      17,
      18
    ]
  },
  {
    "grade": "SD 2",
    "count": 6,
    "focus": "Membagi rute menjadi bagian sebelum dan sesudah mengambil kunci.",
    "index": 4,
    "levelIds": [
      19,
      20,
      21,
      22,
      23,
      24
    ]
  },
  {
    "grade": "SD 3",
    "count": 6,
    "focus": "Membandingkan jalur dan menghitung langkah serta putaran.",
    "index": 5,
    "levelIds": [
      25,
      26,
      27,
      28,
      29,
      30
    ]
  },
  {
    "grade": "SD 4",
    "count": 6,
    "focus": "Mengenali pola dan memakai blok Ulangi 2–4 kali tanpa loop bersarang.",
    "index": 6,
    "levelIds": [
      31,
      32,
      33,
      34,
      35,
      36
    ]
  },
  {
    "grade": "SD 5",
    "count": 7,
    "focus": "Menggabungkan pengulangan dengan syarat kunci dan perjalanan kembali.",
    "index": 7,
    "levelIds": [
      37,
      38,
      39,
      40,
      41,
      42,
      43
    ]
  },
  {
    "grade": "SD 6",
    "count": 7,
    "focus": "Merencanakan, menelusuri, dan menyederhanakan algoritma yang lebih panjang.",
    "index": 8,
    "levelIds": [
      44,
      45,
      46,
      47,
      48,
      49,
      50
    ]
  }
]);
export const LEVELS = deepFreeze([
  {
    "id": 1,
    "title": "Satu Langkah Lagi",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "TK A",
    "group": "TK A",
    "groupIndex": 1,
    "difficulty": 1,
    "lesson": "Urutan pendek, satu petak, dan arah hadap.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 4,
    "height": 3,
    "start": {
      "x": 0,
      "y": 2,
      "dir": "E"
    },
    "key": {
      "x": 0,
      "y": 2
    },
    "chest": {
      "x": 1,
      "y": 2
    },
    "obstacles": [],
    "solution": [
      "take",
      "forward",
      "open"
    ],
    "programSolution": [
      "take",
      "forward",
      "open"
    ],
    "shortestCommandCount": 3,
    "loopAvailable": false
  },
  {
    "id": 2,
    "title": "Dua Petak Ceria",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "TK A",
    "group": "TK A",
    "groupIndex": 1,
    "difficulty": 2,
    "lesson": "Urutan pendek, satu petak, dan arah hadap.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 4,
    "height": 3,
    "start": {
      "x": 0,
      "y": 2,
      "dir": "E"
    },
    "key": {
      "x": 0,
      "y": 2
    },
    "chest": {
      "x": 2,
      "y": 2
    },
    "obstacles": [],
    "solution": [
      "take",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      "take",
      "forward",
      "forward",
      "open"
    ],
    "shortestCommandCount": 4,
    "loopAvailable": false
  },
  {
    "id": 3,
    "title": "Belok ke Peti",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "TK A",
    "group": "TK A",
    "groupIndex": 1,
    "difficulty": 3,
    "lesson": "Urutan pendek, satu petak, dan arah hadap.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 4,
    "height": 3,
    "start": {
      "x": 0,
      "y": 2,
      "dir": "E"
    },
    "key": {
      "x": 0,
      "y": 2
    },
    "chest": {
      "x": 2,
      "y": 1
    },
    "obstacles": [],
    "solution": [
      "take",
      "forward",
      "forward",
      "left",
      "forward",
      "open"
    ],
    "programSolution": [
      "take",
      "forward",
      "forward",
      "left",
      "forward",
      "open"
    ],
    "shortestCommandCount": 6,
    "loopAvailable": false
  },
  {
    "id": 4,
    "title": "Ikuti Jalannya",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "TK A",
    "group": "TK A",
    "groupIndex": 1,
    "difficulty": 4,
    "lesson": "Urutan pendek, satu petak, dan arah hadap.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 4,
    "height": 3,
    "start": {
      "x": 0,
      "y": 2,
      "dir": "E"
    },
    "key": {
      "x": 0,
      "y": 2
    },
    "chest": {
      "x": 3,
      "y": 1
    },
    "obstacles": [],
    "solution": [
      "take",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "open"
    ],
    "programSolution": [
      "take",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "open"
    ],
    "shortestCommandCount": 7,
    "loopAvailable": false
  },
  {
    "id": 5,
    "title": "Hidung ke Utara",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "TK A",
    "group": "TK A",
    "groupIndex": 1,
    "difficulty": 5,
    "lesson": "Urutan pendek, satu petak, dan arah hadap.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 4,
    "height": 4,
    "start": {
      "x": 0,
      "y": 3,
      "dir": "N"
    },
    "key": {
      "x": 0,
      "y": 2
    },
    "chest": {
      "x": 2,
      "y": 2
    },
    "obstacles": [],
    "solution": [
      "forward",
      "right",
      "take",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      "forward",
      "right",
      "take",
      "forward",
      "forward",
      "open"
    ],
    "shortestCommandCount": 6,
    "loopAvailable": false
  },
  {
    "id": 6,
    "title": "Batu Pertama",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "TK A",
    "group": "TK A",
    "groupIndex": 1,
    "difficulty": 6,
    "lesson": "Urutan pendek, satu petak, dan arah hadap.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 4,
    "height": 4,
    "start": {
      "x": 0,
      "y": 3,
      "dir": "E"
    },
    "key": {
      "x": 1,
      "y": 3
    },
    "chest": {
      "x": 2,
      "y": 2
    },
    "obstacles": [
      {
        "x": 2,
        "y": 3
      }
    ],
    "solution": [
      "forward",
      "left",
      "take",
      "forward",
      "right",
      "forward",
      "open"
    ],
    "programSolution": [
      "forward",
      "left",
      "take",
      "forward",
      "right",
      "forward",
      "open"
    ],
    "shortestCommandCount": 7,
    "loopAvailable": false
  },
  {
    "id": 7,
    "title": "Kuncinya Dulu",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "TK B",
    "group": "TK B",
    "groupIndex": 2,
    "difficulty": 7,
    "lesson": "Kunci sebagai syarat, putaran, dan rute sederhana.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 4,
    "height": 4,
    "start": {
      "x": 0,
      "y": 3,
      "dir": "E"
    },
    "key": {
      "x": 2,
      "y": 3
    },
    "chest": {
      "x": 2,
      "y": 1
    },
    "obstacles": [],
    "solution": [
      "forward",
      "forward",
      "left",
      "take",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      "forward",
      "forward",
      "left",
      "take",
      "forward",
      "forward",
      "open"
    ],
    "shortestCommandCount": 7,
    "loopAvailable": false
  },
  {
    "id": 8,
    "title": "Berangkat ke Kiri",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "TK B",
    "group": "TK B",
    "groupIndex": 2,
    "difficulty": 8,
    "lesson": "Kunci sebagai syarat, putaran, dan rute sederhana.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 4,
    "height": 4,
    "start": {
      "x": 3,
      "y": 3,
      "dir": "W"
    },
    "key": {
      "x": 1,
      "y": 3
    },
    "chest": {
      "x": 1,
      "y": 0
    },
    "obstacles": [],
    "solution": [
      "forward",
      "forward",
      "right",
      "take",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      "forward",
      "forward",
      "right",
      "take",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "shortestCommandCount": 8,
    "loopAvailable": false
  },
  {
    "id": 9,
    "title": "Singgah Ambil Kunci",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "TK B",
    "group": "TK B",
    "groupIndex": 2,
    "difficulty": 9,
    "lesson": "Kunci sebagai syarat, putaran, dan rute sederhana.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 5,
    "height": 4,
    "start": {
      "x": 0,
      "y": 3,
      "dir": "E"
    },
    "key": {
      "x": 2,
      "y": 3
    },
    "chest": {
      "x": 4,
      "y": 2
    },
    "obstacles": [
      {
        "x": 3,
        "y": 3
      }
    ],
    "solution": [
      "forward",
      "forward",
      "left",
      "take",
      "forward",
      "right",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      "forward",
      "forward",
      "left",
      "take",
      "forward",
      "right",
      "forward",
      "forward",
      "open"
    ],
    "shortestCommandCount": 9,
    "loopAvailable": false
  },
  {
    "id": 10,
    "title": "Putar Sebelum Maju",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "TK B",
    "group": "TK B",
    "groupIndex": 2,
    "difficulty": 10,
    "lesson": "Kunci sebagai syarat, putaran, dan rute sederhana.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 5,
    "height": 4,
    "start": {
      "x": 0,
      "y": 3,
      "dir": "E"
    },
    "key": {
      "x": 0,
      "y": 1
    },
    "chest": {
      "x": 4,
      "y": 1
    },
    "obstacles": [],
    "solution": [
      "left",
      "forward",
      "forward",
      "right",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      "left",
      "forward",
      "forward",
      "right",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "shortestCommandCount": 10,
    "loopAvailable": false
  },
  {
    "id": 11,
    "title": "Kunci di Balik Batu",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "TK B",
    "group": "TK B",
    "groupIndex": 2,
    "difficulty": 11,
    "lesson": "Kunci sebagai syarat, putaran, dan rute sederhana.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 5,
    "height": 4,
    "start": {
      "x": 4,
      "y": 3,
      "dir": "W"
    },
    "key": {
      "x": 3,
      "y": 2
    },
    "chest": {
      "x": 1,
      "y": 0
    },
    "obstacles": [
      {
        "x": 2,
        "y": 2
      },
      {
        "x": 2,
        "y": 3
      }
    ],
    "solution": [
      "forward",
      "right",
      "forward",
      "take",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      "forward",
      "right",
      "forward",
      "take",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "open"
    ],
    "shortestCommandCount": 10,
    "loopAvailable": false
  },
  {
    "id": 12,
    "title": "Coba Jalan Lain",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "TK B",
    "group": "TK B",
    "groupIndex": 2,
    "difficulty": 12,
    "lesson": "Kunci sebagai syarat, putaran, dan rute sederhana.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 5,
    "height": 4,
    "start": {
      "x": 0,
      "y": 3,
      "dir": "E"
    },
    "key": {
      "x": 0,
      "y": 3
    },
    "chest": {
      "x": 4,
      "y": 2
    },
    "obstacles": [
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 2,
        "y": 2
      }
    ],
    "solution": [
      "left",
      "take",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "open"
    ],
    "programSolution": [
      "left",
      "take",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "open"
    ],
    "shortestCommandCount": 12,
    "loopAvailable": false
  },
  {
    "id": 13,
    "title": "Lihat Sebelum Melangkah",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "SD 1",
    "group": "SD 1",
    "groupIndex": 3,
    "difficulty": 13,
    "lesson": "Prediksi, rute alternatif, dan memperbaiki satu kesalahan.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 5,
    "height": 4,
    "start": {
      "x": 4,
      "y": 3,
      "dir": "E"
    },
    "key": {
      "x": 0,
      "y": 0
    },
    "chest": {
      "x": 4,
      "y": 0
    },
    "obstacles": [
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 1,
        "y": 2
      }
    ],
    "authoringSeed": 1300427,
    "solution": [
      "left",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      "left",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "shortestCommandCount": 17,
    "loopAvailable": false
  },
  {
    "id": 14,
    "title": "Dua Bagian Rencana",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "SD 1",
    "group": "SD 1",
    "groupIndex": 3,
    "difficulty": 14,
    "lesson": "Prediksi, rute alternatif, dan memperbaiki satu kesalahan.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 5,
    "height": 4,
    "start": {
      "x": 4,
      "y": 0,
      "dir": "E"
    },
    "key": {
      "x": 0,
      "y": 3
    },
    "chest": {
      "x": 0,
      "y": 0
    },
    "obstacles": [
      {
        "x": 1,
        "y": 0
      },
      {
        "x": 3,
        "y": 0
      },
      {
        "x": 4,
        "y": 3
      }
    ],
    "authoringSeed": 1400721,
    "solution": [
      "right",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      "right",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "shortestCommandCount": 17,
    "loopAvailable": false
  },
  {
    "id": 15,
    "title": "Sudut yang Berbeda",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "SD 1",
    "group": "SD 1",
    "groupIndex": 3,
    "difficulty": 15,
    "lesson": "Prediksi, rute alternatif, dan memperbaiki satu kesalahan.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 5,
    "height": 4,
    "start": {
      "x": 0,
      "y": 0,
      "dir": "N"
    },
    "key": {
      "x": 4,
      "y": 3
    },
    "chest": {
      "x": 0,
      "y": 3
    },
    "obstacles": [
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 3,
        "y": 1
      }
    ],
    "authoringSeed": 1500142,
    "solution": [
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "right",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "right",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "shortestCommandCount": 16,
    "loopAvailable": false
  },
  {
    "id": 16,
    "title": "Jangan Lewat Batu",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "SD 1",
    "group": "SD 1",
    "groupIndex": 3,
    "difficulty": 16,
    "lesson": "Prediksi, rute alternatif, dan memperbaiki satu kesalahan.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 5,
    "height": 5,
    "start": {
      "x": 0,
      "y": 4,
      "dir": "E"
    },
    "key": {
      "x": 4,
      "y": 0
    },
    "chest": {
      "x": 4,
      "y": 4
    },
    "obstacles": [
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 2,
        "y": 4
      }
    ],
    "authoringSeed": 1600533,
    "solution": [
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "shortestCommandCount": 19,
    "loopAvailable": false
  },
  {
    "id": 17,
    "title": "Prediksi Satu Putaran",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "SD 1",
    "group": "SD 1",
    "groupIndex": 3,
    "difficulty": 17,
    "lesson": "Prediksi, rute alternatif, dan memperbaiki satu kesalahan.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 5,
    "height": 5,
    "start": {
      "x": 4,
      "y": 4,
      "dir": "E"
    },
    "key": {
      "x": 0,
      "y": 0
    },
    "chest": {
      "x": 4,
      "y": 0
    },
    "obstacles": [
      {
        "x": 3,
        "y": 2
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 3,
        "y": 3
      },
      {
        "x": 1,
        "y": 4
      }
    ],
    "authoringSeed": 1700439,
    "solution": [
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "shortestCommandCount": 18,
    "loopAvailable": false
  },
  {
    "id": 18,
    "title": "Perbaiki Rute Kita",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "SD 1",
    "group": "SD 1",
    "groupIndex": 3,
    "difficulty": 18,
    "lesson": "Prediksi, rute alternatif, dan memperbaiki satu kesalahan.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 5,
    "height": 5,
    "start": {
      "x": 4,
      "y": 0,
      "dir": "N"
    },
    "key": {
      "x": 0,
      "y": 4
    },
    "chest": {
      "x": 0,
      "y": 0
    },
    "obstacles": [
      {
        "x": 4,
        "y": 1
      },
      {
        "x": 1,
        "y": 2
      },
      {
        "x": 4,
        "y": 2
      },
      {
        "x": 1,
        "y": 4
      },
      {
        "x": 4,
        "y": 4
      }
    ],
    "authoringSeed": 1800248,
    "solution": [
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "shortestCommandCount": 18,
    "loopAvailable": false
  },
  {
    "id": 19,
    "title": "Ke Kunci Lalu ke Peti",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "SD 2",
    "group": "SD 2",
    "groupIndex": 4,
    "difficulty": 19,
    "lesson": "Membagi rute menjadi bagian sebelum dan sesudah mengambil kunci.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 5,
    "height": 5,
    "start": {
      "x": 0,
      "y": 0,
      "dir": "N"
    },
    "key": {
      "x": 4,
      "y": 4
    },
    "chest": {
      "x": 0,
      "y": 4
    },
    "obstacles": [
      {
        "x": 2,
        "y": 2
      },
      {
        "x": 1,
        "y": 3
      },
      {
        "x": 3,
        "y": 3
      },
      {
        "x": 4,
        "y": 3
      }
    ],
    "authoringSeed": 1900542,
    "solution": [
      "left",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      "left",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "shortestCommandCount": 19,
    "loopAvailable": false
  },
  {
    "id": 20,
    "title": "Peta dari Selatan",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "SD 2",
    "group": "SD 2",
    "groupIndex": 4,
    "difficulty": 20,
    "lesson": "Membagi rute menjadi bagian sebelum dan sesudah mengambil kunci.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 5,
    "height": 5,
    "start": {
      "x": 0,
      "y": 4,
      "dir": "N"
    },
    "key": {
      "x": 4,
      "y": 0
    },
    "chest": {
      "x": 4,
      "y": 4
    },
    "obstacles": [
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 2,
        "y": 2
      },
      {
        "x": 0,
        "y": 3
      }
    ],
    "authoringSeed": 2000060,
    "solution": [
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "shortestCommandCount": 18,
    "loopAvailable": false
  },
  {
    "id": 21,
    "title": "Rencanakan Persinggahan",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "SD 2",
    "group": "SD 2",
    "groupIndex": 4,
    "difficulty": 21,
    "lesson": "Membagi rute menjadi bagian sebelum dan sesudah mengambil kunci.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 5,
    "height": 5,
    "start": {
      "x": 4,
      "y": 4,
      "dir": "E"
    },
    "key": {
      "x": 0,
      "y": 0
    },
    "chest": {
      "x": 4,
      "y": 0
    },
    "obstacles": [
      {
        "x": 1,
        "y": 0
      },
      {
        "x": 1,
        "y": 2
      },
      {
        "x": 3,
        "y": 3
      },
      {
        "x": 0,
        "y": 4
      },
      {
        "x": 1,
        "y": 4
      }
    ],
    "authoringSeed": 2100063,
    "solution": [
      "left",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "open"
    ],
    "programSolution": [
      "left",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "open"
    ],
    "shortestCommandCount": 23,
    "loopAvailable": false
  },
  {
    "id": 22,
    "title": "Dari Sudut ke Sudut",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "SD 2",
    "group": "SD 2",
    "groupIndex": 4,
    "difficulty": 22,
    "lesson": "Membagi rute menjadi bagian sebelum dan sesudah mengambil kunci.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 6,
    "height": 5,
    "start": {
      "x": 5,
      "y": 0,
      "dir": "E"
    },
    "key": {
      "x": 0,
      "y": 4
    },
    "chest": {
      "x": 0,
      "y": 0
    },
    "obstacles": [
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 3,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 2,
        "y": 2
      },
      {
        "x": 4,
        "y": 2
      }
    ],
    "authoringSeed": 2200357,
    "solution": [
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "open"
    ],
    "programSolution": [
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "open"
    ],
    "shortestCommandCount": 23,
    "loopAvailable": false
  },
  {
    "id": 23,
    "title": "Balik Arah dengan Tenang",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "SD 2",
    "group": "SD 2",
    "groupIndex": 4,
    "difficulty": 23,
    "lesson": "Membagi rute menjadi bagian sebelum dan sesudah mengambil kunci.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 6,
    "height": 5,
    "start": {
      "x": 0,
      "y": 0,
      "dir": "N"
    },
    "key": {
      "x": 5,
      "y": 4
    },
    "chest": {
      "x": 0,
      "y": 4
    },
    "obstacles": [
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 5,
        "y": 1
      },
      {
        "x": 3,
        "y": 4
      }
    ],
    "authoringSeed": 2300166,
    "solution": [
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "left",
      "take",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "open"
    ],
    "programSolution": [
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "left",
      "take",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "open"
    ],
    "shortestCommandCount": 24,
    "loopAvailable": false
  },
  {
    "id": 24,
    "title": "Cek Setiap Bagian",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "SD 2",
    "group": "SD 2",
    "groupIndex": 4,
    "difficulty": 24,
    "lesson": "Membagi rute menjadi bagian sebelum dan sesudah mengambil kunci.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 6,
    "height": 5,
    "start": {
      "x": 0,
      "y": 4,
      "dir": "E"
    },
    "key": {
      "x": 5,
      "y": 0
    },
    "chest": {
      "x": 5,
      "y": 4
    },
    "obstacles": [
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 3,
        "y": 1
      },
      {
        "x": 5,
        "y": 1
      },
      {
        "x": 3,
        "y": 2
      },
      {
        "x": 5,
        "y": 2
      },
      {
        "x": 3,
        "y": 3
      },
      {
        "x": 5,
        "y": 3
      }
    ],
    "authoringSeed": 2400557,
    "solution": [
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "open"
    ],
    "programSolution": [
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "open"
    ],
    "shortestCommandCount": 23,
    "loopAvailable": false
  },
  {
    "id": 25,
    "title": "Pilih Jalur Efisien",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "SD 3",
    "group": "SD 3",
    "groupIndex": 5,
    "difficulty": 25,
    "lesson": "Membandingkan jalur dan menghitung langkah serta putaran.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 6,
    "height": 5,
    "start": {
      "x": 5,
      "y": 4,
      "dir": "E"
    },
    "key": {
      "x": 0,
      "y": 0
    },
    "chest": {
      "x": 5,
      "y": 0
    },
    "obstacles": [
      {
        "x": 3,
        "y": 1
      },
      {
        "x": 1,
        "y": 2
      },
      {
        "x": 0,
        "y": 3
      },
      {
        "x": 1,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 3,
        "y": 3
      },
      {
        "x": 5,
        "y": 3
      }
    ],
    "authoringSeed": 2500463,
    "solution": [
      "left",
      "left",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      "left",
      "left",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "shortestCommandCount": 22,
    "loopAvailable": false
  },
  {
    "id": 26,
    "title": "Hitung Langkah dan Putar",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "SD 3",
    "group": "SD 3",
    "groupIndex": 5,
    "difficulty": 26,
    "lesson": "Membandingkan jalur dan menghitung langkah serta putaran.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 6,
    "height": 5,
    "start": {
      "x": 5,
      "y": 0,
      "dir": "E"
    },
    "key": {
      "x": 0,
      "y": 4
    },
    "chest": {
      "x": 0,
      "y": 0
    },
    "obstacles": [
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 0,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      }
    ],
    "authoringSeed": 2601145,
    "solution": [
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "right",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "right",
      "forward",
      "forward",
      "open"
    ],
    "shortestCommandCount": 24,
    "loopAvailable": false
  },
  {
    "id": 27,
    "title": "Rute Sama Cara Berbeda",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "SD 3",
    "group": "SD 3",
    "groupIndex": 5,
    "difficulty": 27,
    "lesson": "Membandingkan jalur dan menghitung langkah serta putaran.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 6,
    "height": 5,
    "start": {
      "x": 0,
      "y": 0,
      "dir": "W"
    },
    "key": {
      "x": 5,
      "y": 4
    },
    "chest": {
      "x": 0,
      "y": 4
    },
    "obstacles": [
      {
        "x": 5,
        "y": 0
      },
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 4,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 1,
        "y": 2
      }
    ],
    "authoringSeed": 2700081,
    "solution": [
      "left",
      "left",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      "left",
      "left",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "shortestCommandCount": 22,
    "loopAvailable": false
  },
  {
    "id": 28,
    "title": "Cari Putaran yang Hemat",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "SD 3",
    "group": "SD 3",
    "groupIndex": 5,
    "difficulty": 28,
    "lesson": "Membandingkan jalur dan menghitung langkah serta putaran.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 6,
    "height": 6,
    "start": {
      "x": 0,
      "y": 5,
      "dir": "N"
    },
    "key": {
      "x": 5,
      "y": 0
    },
    "chest": {
      "x": 5,
      "y": 5
    },
    "obstacles": [
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 4,
        "y": 1
      },
      {
        "x": 1,
        "y": 2
      },
      {
        "x": 2,
        "y": 2
      },
      {
        "x": 1,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 3,
        "y": 3
      },
      {
        "x": 5,
        "y": 3
      },
      {
        "x": 1,
        "y": 5
      },
      {
        "x": 2,
        "y": 5
      },
      {
        "x": 4,
        "y": 5
      }
    ],
    "authoringSeed": 2800084,
    "solution": [
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "take",
      "forward",
      "forward",
      "right",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "right",
      "forward",
      "open"
    ],
    "programSolution": [
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "take",
      "forward",
      "forward",
      "right",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "right",
      "forward",
      "open"
    ],
    "shortestCommandCount": 25,
    "loopAvailable": false
  },
  {
    "id": 29,
    "title": "Bandingkan Dua Rencana",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "SD 3",
    "group": "SD 3",
    "groupIndex": 5,
    "difficulty": 29,
    "lesson": "Membandingkan jalur dan menghitung langkah serta putaran.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 6,
    "height": 6,
    "start": {
      "x": 5,
      "y": 5,
      "dir": "S"
    },
    "key": {
      "x": 0,
      "y": 0
    },
    "chest": {
      "x": 5,
      "y": 0
    },
    "obstacles": [
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 3,
        "y": 1
      },
      {
        "x": 5,
        "y": 1
      },
      {
        "x": 5,
        "y": 2
      },
      {
        "x": 4,
        "y": 3
      },
      {
        "x": 5,
        "y": 3
      },
      {
        "x": 3,
        "y": 4
      },
      {
        "x": 4,
        "y": 4
      }
    ],
    "authoringSeed": 2900572,
    "solution": [
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "right",
      "forward",
      "open"
    ],
    "programSolution": [
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "right",
      "forward",
      "open"
    ],
    "shortestCommandCount": 28,
    "loopAvailable": false
  },
  {
    "id": 30,
    "title": "Uji Dugaan Kita",
    "subtitle": "Susun langkah, ambil kunci, lalu buka peti.",
    "grade": "SD 3",
    "group": "SD 3",
    "groupIndex": 5,
    "difficulty": 30,
    "lesson": "Membandingkan jalur dan menghitung langkah serta putaran.",
    "hints": [
      "Cari posisi awal dan arah hidung robot.",
      "Rencanakan jalan ke kunci, lalu ke peti.",
      "Putar hanya mengubah arah; maju memindahkan satu petak."
    ],
    "width": 6,
    "height": 6,
    "start": {
      "x": 5,
      "y": 0,
      "dir": "E"
    },
    "key": {
      "x": 0,
      "y": 5
    },
    "chest": {
      "x": 0,
      "y": 0
    },
    "obstacles": [
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 3,
        "y": 2
      },
      {
        "x": 4,
        "y": 2
      },
      {
        "x": 4,
        "y": 3
      },
      {
        "x": 5,
        "y": 3
      },
      {
        "x": 2,
        "y": 4
      },
      {
        "x": 5,
        "y": 5
      }
    ],
    "authoringSeed": 3001157,
    "solution": [
      "left",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "open"
    ],
    "programSolution": [
      "left",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "open"
    ],
    "shortestCommandCount": 27,
    "loopAvailable": false
  },
  {
    "id": 31,
    "title": "Tangga Berulang",
    "subtitle": "Cari pola, ambil kunci, lalu buka peti.",
    "grade": "SD 4",
    "group": "SD 4",
    "groupIndex": 6,
    "difficulty": 31,
    "lesson": "Mengenali pola dan memakai blok Ulangi 2–4 kali tanpa loop bersarang.",
    "hints": [
      "Baca satu badan Ulangi lebih dahulu.",
      "Hitung posisi dan arah setelah setiap ulangan.",
      "Ambil kunci harus berada tepat di petaknya."
    ],
    "width": 6,
    "height": 6,
    "start": {
      "x": 0,
      "y": 5,
      "dir": "E"
    },
    "key": {
      "x": 0,
      "y": 5
    },
    "chest": {
      "x": 3,
      "y": 2
    },
    "obstacles": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 1,
        "y": 0
      },
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 3,
        "y": 0
      },
      {
        "x": 4,
        "y": 0
      },
      {
        "x": 5,
        "y": 0
      },
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 3,
        "y": 1
      },
      {
        "x": 4,
        "y": 1
      },
      {
        "x": 5,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 1,
        "y": 2
      },
      {
        "x": 2,
        "y": 2
      },
      {
        "x": 4,
        "y": 2
      },
      {
        "x": 5,
        "y": 2
      },
      {
        "x": 0,
        "y": 3
      },
      {
        "x": 1,
        "y": 3
      },
      {
        "x": 4,
        "y": 3
      },
      {
        "x": 5,
        "y": 3
      },
      {
        "x": 0,
        "y": 4
      },
      {
        "x": 3,
        "y": 4
      },
      {
        "x": 4,
        "y": 4
      },
      {
        "x": 5,
        "y": 4
      },
      {
        "x": 2,
        "y": 5
      },
      {
        "x": 3,
        "y": 5
      },
      {
        "x": 4,
        "y": 5
      },
      {
        "x": 5,
        "y": 5
      }
    ],
    "solution": [
      "take",
      "forward",
      "left",
      "forward",
      "right",
      "forward",
      "left",
      "forward",
      "right",
      "forward",
      "left",
      "forward",
      "open"
    ],
    "programSolution": [
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
    ],
    "shortestCommandCount": 13,
    "loopAvailable": true
  },
  {
    "id": 32,
    "title": "Tangga dari Sisi Lain",
    "subtitle": "Cari pola, ambil kunci, lalu buka peti.",
    "grade": "SD 4",
    "group": "SD 4",
    "groupIndex": 6,
    "difficulty": 32,
    "lesson": "Mengenali pola dan memakai blok Ulangi 2–4 kali tanpa loop bersarang.",
    "hints": [
      "Baca satu badan Ulangi lebih dahulu.",
      "Hitung posisi dan arah setelah setiap ulangan.",
      "Ambil kunci harus berada tepat di petaknya."
    ],
    "width": 6,
    "height": 6,
    "start": {
      "x": 5,
      "y": 0,
      "dir": "W"
    },
    "key": {
      "x": 5,
      "y": 0
    },
    "chest": {
      "x": 1,
      "y": 4
    },
    "obstacles": [
      {
        "x": 5,
        "y": 5
      },
      {
        "x": 4,
        "y": 5
      },
      {
        "x": 3,
        "y": 5
      },
      {
        "x": 2,
        "y": 5
      },
      {
        "x": 1,
        "y": 5
      },
      {
        "x": 0,
        "y": 5
      },
      {
        "x": 5,
        "y": 4
      },
      {
        "x": 4,
        "y": 4
      },
      {
        "x": 3,
        "y": 4
      },
      {
        "x": 2,
        "y": 4
      },
      {
        "x": 0,
        "y": 4
      },
      {
        "x": 5,
        "y": 3
      },
      {
        "x": 4,
        "y": 3
      },
      {
        "x": 3,
        "y": 3
      },
      {
        "x": 0,
        "y": 3
      },
      {
        "x": 5,
        "y": 2
      },
      {
        "x": 4,
        "y": 2
      },
      {
        "x": 1,
        "y": 2
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 5,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 3,
        "y": 0
      },
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 1,
        "y": 0
      },
      {
        "x": 0,
        "y": 0
      }
    ],
    "solution": [
      "take",
      "forward",
      "left",
      "forward",
      "right",
      "forward",
      "left",
      "forward",
      "right",
      "forward",
      "left",
      "forward",
      "right",
      "forward",
      "left",
      "forward",
      "open"
    ],
    "programSolution": [
      "take",
      {
        "repeat": 3,
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
    ],
    "shortestCommandCount": 17,
    "loopAvailable": true
  },
  {
    "id": 33,
    "title": "Dua Baris Berulang",
    "subtitle": "Cari pola, ambil kunci, lalu buka peti.",
    "grade": "SD 4",
    "group": "SD 4",
    "groupIndex": 6,
    "difficulty": 33,
    "lesson": "Mengenali pola dan memakai blok Ulangi 2–4 kali tanpa loop bersarang.",
    "hints": [
      "Baca satu badan Ulangi lebih dahulu.",
      "Hitung posisi dan arah setelah setiap ulangan.",
      "Ambil kunci harus berada tepat di petaknya."
    ],
    "width": 7,
    "height": 5,
    "start": {
      "x": 0,
      "y": 4,
      "dir": "E"
    },
    "key": {
      "x": 0,
      "y": 4
    },
    "chest": {
      "x": 6,
      "y": 1
    },
    "obstacles": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 1,
        "y": 0
      },
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 3,
        "y": 0
      },
      {
        "x": 4,
        "y": 0
      },
      {
        "x": 5,
        "y": 0
      },
      {
        "x": 6,
        "y": 0
      },
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 3,
        "y": 1
      },
      {
        "x": 4,
        "y": 1
      },
      {
        "x": 5,
        "y": 1
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 1,
        "y": 2
      },
      {
        "x": 2,
        "y": 2
      },
      {
        "x": 3,
        "y": 2
      },
      {
        "x": 0,
        "y": 3
      },
      {
        "x": 1,
        "y": 3
      },
      {
        "x": 5,
        "y": 3
      },
      {
        "x": 6,
        "y": 3
      },
      {
        "x": 3,
        "y": 4
      },
      {
        "x": 4,
        "y": 4
      },
      {
        "x": 5,
        "y": 4
      },
      {
        "x": 6,
        "y": 4
      }
    ],
    "solution": [
      "take",
      "forward",
      "forward",
      "left",
      "forward",
      "right",
      "forward",
      "forward",
      "left",
      "forward",
      "right",
      "forward",
      "forward",
      "left",
      "forward",
      "open"
    ],
    "programSolution": [
      "take",
      {
        "repeat": 2,
        "commands": [
          "forward",
          "forward",
          "left",
          "forward",
          "right"
        ]
      },
      "forward",
      "forward",
      "left",
      "forward",
      "open"
    ],
    "shortestCommandCount": 16,
    "loopAvailable": true
  },
  {
    "id": 34,
    "title": "Pola Berbalik Arah",
    "subtitle": "Cari pola, ambil kunci, lalu buka peti.",
    "grade": "SD 4",
    "group": "SD 4",
    "groupIndex": 6,
    "difficulty": 34,
    "lesson": "Mengenali pola dan memakai blok Ulangi 2–4 kali tanpa loop bersarang.",
    "hints": [
      "Baca satu badan Ulangi lebih dahulu.",
      "Hitung posisi dan arah setelah setiap ulangan.",
      "Ambil kunci harus berada tepat di petaknya."
    ],
    "width": 7,
    "height": 5,
    "start": {
      "x": 6,
      "y": 0,
      "dir": "W"
    },
    "key": {
      "x": 6,
      "y": 0
    },
    "chest": {
      "x": 0,
      "y": 3
    },
    "obstacles": [
      {
        "x": 6,
        "y": 4
      },
      {
        "x": 5,
        "y": 4
      },
      {
        "x": 4,
        "y": 4
      },
      {
        "x": 3,
        "y": 4
      },
      {
        "x": 2,
        "y": 4
      },
      {
        "x": 1,
        "y": 4
      },
      {
        "x": 0,
        "y": 4
      },
      {
        "x": 6,
        "y": 3
      },
      {
        "x": 5,
        "y": 3
      },
      {
        "x": 4,
        "y": 3
      },
      {
        "x": 3,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 1,
        "y": 3
      },
      {
        "x": 6,
        "y": 2
      },
      {
        "x": 5,
        "y": 2
      },
      {
        "x": 4,
        "y": 2
      },
      {
        "x": 3,
        "y": 2
      },
      {
        "x": 6,
        "y": 1
      },
      {
        "x": 5,
        "y": 1
      },
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 3,
        "y": 0
      },
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 1,
        "y": 0
      },
      {
        "x": 0,
        "y": 0
      }
    ],
    "solution": [
      "take",
      "forward",
      "forward",
      "left",
      "forward",
      "right",
      "forward",
      "forward",
      "left",
      "forward",
      "right",
      "forward",
      "forward",
      "left",
      "forward",
      "open"
    ],
    "programSolution": [
      "take",
      {
        "repeat": 2,
        "commands": [
          "forward",
          "forward",
          "left",
          "forward",
          "right"
        ]
      },
      "forward",
      "forward",
      "left",
      "forward",
      "open"
    ],
    "shortestCommandCount": 16,
    "loopAvailable": true
  },
  {
    "id": 35,
    "title": "Ulangi Lalu Ambil",
    "subtitle": "Cari pola, ambil kunci, lalu buka peti.",
    "grade": "SD 4",
    "group": "SD 4",
    "groupIndex": 6,
    "difficulty": 35,
    "lesson": "Mengenali pola dan memakai blok Ulangi 2–4 kali tanpa loop bersarang.",
    "hints": [
      "Baca satu badan Ulangi lebih dahulu.",
      "Hitung posisi dan arah setelah setiap ulangan.",
      "Ambil kunci harus berada tepat di petaknya."
    ],
    "width": 5,
    "height": 6,
    "start": {
      "x": 0,
      "y": 0,
      "dir": "E"
    },
    "key": {
      "x": 4,
      "y": 1
    },
    "chest": {
      "x": 4,
      "y": 4
    },
    "obstacles": [
      {
        "x": 0,
        "y": 5
      },
      {
        "x": 1,
        "y": 5
      },
      {
        "x": 2,
        "y": 5
      },
      {
        "x": 3,
        "y": 5
      },
      {
        "x": 4,
        "y": 5
      },
      {
        "x": 1,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 3,
        "y": 3
      },
      {
        "x": 4,
        "y": 3
      },
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 3,
        "y": 1
      }
    ],
    "solution": [
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "take",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      {
        "repeat": 4,
        "commands": [
          "forward"
        ]
      },
      "right",
      "forward",
      "take",
      "forward",
      "right",
      {
        "repeat": 2,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "forward",
          "left"
        ]
      },
      {
        "repeat": 4,
        "commands": [
          "forward"
        ]
      },
      "open"
    ],
    "shortestCommandCount": 22,
    "loopAvailable": true
  },
  {
    "id": 36,
    "title": "Pola yang Lebih Panjang",
    "subtitle": "Cari pola, ambil kunci, lalu buka peti.",
    "grade": "SD 4",
    "group": "SD 4",
    "groupIndex": 6,
    "difficulty": 36,
    "lesson": "Mengenali pola dan memakai blok Ulangi 2–4 kali tanpa loop bersarang.",
    "hints": [
      "Baca satu badan Ulangi lebih dahulu.",
      "Hitung posisi dan arah setelah setiap ulangan.",
      "Ambil kunci harus berada tepat di petaknya."
    ],
    "width": 4,
    "height": 7,
    "start": {
      "x": 0,
      "y": 6,
      "dir": "E"
    },
    "key": {
      "x": 0,
      "y": 6
    },
    "chest": {
      "x": 0,
      "y": 0
    },
    "obstacles": [
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 1,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 3,
        "y": 3
      },
      {
        "x": 0,
        "y": 5
      },
      {
        "x": 1,
        "y": 5
      },
      {
        "x": 2,
        "y": 5
      }
    ],
    "solution": [
      "take",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      "take",
      {
        "repeat": 3,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "left",
          "forward",
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "right",
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "forward",
          "left"
        ]
      },
      {
        "repeat": 3,
        "commands": [
          "forward"
        ]
      },
      "open"
    ],
    "shortestCommandCount": 26,
    "loopAvailable": true
  },
  {
    "id": 37,
    "title": "Baris Panjang Bersama",
    "subtitle": "Cari pola, ambil kunci, lalu buka peti.",
    "grade": "SD 5",
    "group": "SD 5",
    "groupIndex": 7,
    "difficulty": 37,
    "lesson": "Menggabungkan pengulangan dengan syarat kunci dan perjalanan kembali.",
    "hints": [
      "Baca satu badan Ulangi lebih dahulu.",
      "Hitung posisi dan arah setelah setiap ulangan.",
      "Ambil kunci harus berada tepat di petaknya."
    ],
    "width": 7,
    "height": 6,
    "start": {
      "x": 0,
      "y": 5,
      "dir": "E"
    },
    "key": {
      "x": 6,
      "y": 5
    },
    "chest": {
      "x": 6,
      "y": 1
    },
    "obstacles": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 1,
        "y": 0
      },
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 3,
        "y": 0
      },
      {
        "x": 4,
        "y": 0
      },
      {
        "x": 5,
        "y": 0
      },
      {
        "x": 6,
        "y": 0
      },
      {
        "x": 1,
        "y": 2
      },
      {
        "x": 2,
        "y": 2
      },
      {
        "x": 3,
        "y": 2
      },
      {
        "x": 4,
        "y": 2
      },
      {
        "x": 5,
        "y": 2
      },
      {
        "x": 6,
        "y": 2
      },
      {
        "x": 0,
        "y": 4
      },
      {
        "x": 1,
        "y": 4
      },
      {
        "x": 2,
        "y": 4
      },
      {
        "x": 3,
        "y": 4
      },
      {
        "x": 4,
        "y": 4
      },
      {
        "x": 5,
        "y": 4
      }
    ],
    "solution": [
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "take",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      "left",
      "take",
      {
        "repeat": 2,
        "commands": [
          "forward"
        ]
      },
      "left",
      {
        "repeat": 4,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "forward",
          "right"
        ]
      },
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      "open"
    ],
    "shortestCommandCount": 28,
    "loopAvailable": true
  },
  {
    "id": 38,
    "title": "Pola dari Timur",
    "subtitle": "Cari pola, ambil kunci, lalu buka peti.",
    "grade": "SD 5",
    "group": "SD 5",
    "groupIndex": 7,
    "difficulty": 38,
    "lesson": "Menggabungkan pengulangan dengan syarat kunci dan perjalanan kembali.",
    "hints": [
      "Baca satu badan Ulangi lebih dahulu.",
      "Hitung posisi dan arah setelah setiap ulangan.",
      "Ambil kunci harus berada tepat di petaknya."
    ],
    "width": 7,
    "height": 6,
    "start": {
      "x": 6,
      "y": 5,
      "dir": "W"
    },
    "key": {
      "x": 1,
      "y": 3
    },
    "chest": {
      "x": 0,
      "y": 1
    },
    "obstacles": [
      {
        "x": 6,
        "y": 0
      },
      {
        "x": 5,
        "y": 0
      },
      {
        "x": 4,
        "y": 0
      },
      {
        "x": 3,
        "y": 0
      },
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 1,
        "y": 0
      },
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 5,
        "y": 2
      },
      {
        "x": 4,
        "y": 2
      },
      {
        "x": 3,
        "y": 2
      },
      {
        "x": 2,
        "y": 2
      },
      {
        "x": 1,
        "y": 2
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 6,
        "y": 4
      },
      {
        "x": 5,
        "y": 4
      },
      {
        "x": 4,
        "y": 4
      },
      {
        "x": 3,
        "y": 4
      },
      {
        "x": 2,
        "y": 4
      },
      {
        "x": 1,
        "y": 4
      }
    ],
    "solution": [
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "right",
      "forward",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      "forward",
      {
        "repeat": 4,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "right",
          "forward"
        ]
      },
      "take",
      {
        "repeat": 3,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "forward",
          "left"
        ]
      },
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      "open"
    ],
    "shortestCommandCount": 28,
    "loopAvailable": true
  },
  {
    "id": 39,
    "title": "Kunci di Tengah Pola",
    "subtitle": "Cari pola, ambil kunci, lalu buka peti.",
    "grade": "SD 5",
    "group": "SD 5",
    "groupIndex": 7,
    "difficulty": 39,
    "lesson": "Menggabungkan pengulangan dengan syarat kunci dan perjalanan kembali.",
    "hints": [
      "Baca satu badan Ulangi lebih dahulu.",
      "Hitung posisi dan arah setelah setiap ulangan.",
      "Ambil kunci harus berada tepat di petaknya."
    ],
    "width": 7,
    "height": 6,
    "start": {
      "x": 0,
      "y": 0,
      "dir": "E"
    },
    "key": {
      "x": 0,
      "y": 3
    },
    "chest": {
      "x": 6,
      "y": 4
    },
    "obstacles": [
      {
        "x": 0,
        "y": 5
      },
      {
        "x": 1,
        "y": 5
      },
      {
        "x": 2,
        "y": 5
      },
      {
        "x": 3,
        "y": 5
      },
      {
        "x": 4,
        "y": 5
      },
      {
        "x": 5,
        "y": 5
      },
      {
        "x": 6,
        "y": 5
      },
      {
        "x": 1,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 3,
        "y": 3
      },
      {
        "x": 4,
        "y": 3
      },
      {
        "x": 5,
        "y": 3
      },
      {
        "x": 6,
        "y": 3
      },
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 3,
        "y": 1
      },
      {
        "x": 4,
        "y": 1
      },
      {
        "x": 5,
        "y": 1
      }
    ],
    "solution": [
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "take",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      {
        "repeat": 4,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "forward",
          "right"
        ]
      },
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      "left",
      "forward",
      "take",
      "forward",
      "left",
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      "open"
    ],
    "shortestCommandCount": 28,
    "loopAvailable": true
  },
  {
    "id": 40,
    "title": "Empat Baris Terencana",
    "subtitle": "Cari pola, ambil kunci, lalu buka peti.",
    "grade": "SD 5",
    "group": "SD 5",
    "groupIndex": 7,
    "difficulty": 40,
    "lesson": "Menggabungkan pengulangan dengan syarat kunci dan perjalanan kembali.",
    "hints": [
      "Baca satu badan Ulangi lebih dahulu.",
      "Hitung posisi dan arah setelah setiap ulangan.",
      "Ambil kunci harus berada tepat di petaknya."
    ],
    "width": 7,
    "height": 7,
    "start": {
      "x": 0,
      "y": 6,
      "dir": "E"
    },
    "key": {
      "x": 5,
      "y": 4
    },
    "chest": {
      "x": 0,
      "y": 0
    },
    "obstacles": [
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 3,
        "y": 1
      },
      {
        "x": 4,
        "y": 1
      },
      {
        "x": 5,
        "y": 1
      },
      {
        "x": 1,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 3,
        "y": 3
      },
      {
        "x": 4,
        "y": 3
      },
      {
        "x": 5,
        "y": 3
      },
      {
        "x": 6,
        "y": 3
      },
      {
        "x": 0,
        "y": 5
      },
      {
        "x": 1,
        "y": 5
      },
      {
        "x": 2,
        "y": 5
      },
      {
        "x": 3,
        "y": 5
      },
      {
        "x": 4,
        "y": 5
      },
      {
        "x": 5,
        "y": 5
      }
    ],
    "solution": [
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      "forward",
      {
        "repeat": 4,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "left",
          "forward"
        ]
      },
      "take",
      {
        "repeat": 3,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "forward",
          "right"
        ]
      },
      {
        "repeat": 4,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "forward",
          "left"
        ]
      },
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      "open"
    ],
    "shortestCommandCount": 38,
    "loopAvailable": true
  },
  {
    "id": 41,
    "title": "Jelajah Lalu Kembali",
    "subtitle": "Cari pola, ambil kunci, lalu buka peti.",
    "grade": "SD 5",
    "group": "SD 5",
    "groupIndex": 7,
    "difficulty": 41,
    "lesson": "Menggabungkan pengulangan dengan syarat kunci dan perjalanan kembali.",
    "hints": [
      "Baca satu badan Ulangi lebih dahulu.",
      "Hitung posisi dan arah setelah setiap ulangan.",
      "Ambil kunci harus berada tepat di petaknya."
    ],
    "width": 7,
    "height": 7,
    "start": {
      "x": 6,
      "y": 6,
      "dir": "W"
    },
    "key": {
      "x": 6,
      "y": 0
    },
    "chest": {
      "x": 0,
      "y": 2
    },
    "obstacles": [
      {
        "x": 6,
        "y": 1
      },
      {
        "x": 5,
        "y": 1
      },
      {
        "x": 4,
        "y": 1
      },
      {
        "x": 3,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 5,
        "y": 3
      },
      {
        "x": 4,
        "y": 3
      },
      {
        "x": 3,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 1,
        "y": 3
      },
      {
        "x": 0,
        "y": 3
      },
      {
        "x": 6,
        "y": 5
      },
      {
        "x": 5,
        "y": 5
      },
      {
        "x": 4,
        "y": 5
      },
      {
        "x": 3,
        "y": 5
      },
      {
        "x": 2,
        "y": 5
      },
      {
        "x": 1,
        "y": 5
      }
    ],
    "solution": [
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      {
        "repeat": 4,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "forward",
          "right"
        ]
      },
      {
        "repeat": 4,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "forward",
          "left"
        ]
      },
      {
        "repeat": 4,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "forward",
          "right"
        ]
      },
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "left"
        ]
      },
      "take",
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      "left",
      {
        "repeat": 2,
        "commands": [
          "forward"
        ]
      },
      "open"
    ],
    "shortestCommandCount": 49,
    "loopAvailable": true
  },
  {
    "id": 42,
    "title": "Potong Awal Rute",
    "subtitle": "Cari pola, ambil kunci, lalu buka peti.",
    "grade": "SD 5",
    "group": "SD 5",
    "groupIndex": 7,
    "difficulty": 42,
    "lesson": "Menggabungkan pengulangan dengan syarat kunci dan perjalanan kembali.",
    "hints": [
      "Baca satu badan Ulangi lebih dahulu.",
      "Hitung posisi dan arah setelah setiap ulangan.",
      "Ambil kunci harus berada tepat di petaknya."
    ],
    "width": 7,
    "height": 7,
    "start": {
      "x": 4,
      "y": 0,
      "dir": "E"
    },
    "key": {
      "x": 6,
      "y": 6
    },
    "chest": {
      "x": 0,
      "y": 6
    },
    "obstacles": [
      {
        "x": 0,
        "y": 5
      },
      {
        "x": 1,
        "y": 5
      },
      {
        "x": 2,
        "y": 5
      },
      {
        "x": 3,
        "y": 5
      },
      {
        "x": 4,
        "y": 5
      },
      {
        "x": 5,
        "y": 5
      },
      {
        "x": 1,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 3,
        "y": 3
      },
      {
        "x": 4,
        "y": 3
      },
      {
        "x": 5,
        "y": 3
      },
      {
        "x": 6,
        "y": 3
      },
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 3,
        "y": 1
      },
      {
        "x": 4,
        "y": 1
      },
      {
        "x": 5,
        "y": 1
      }
    ],
    "solution": [
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "right",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      {
        "repeat": 2,
        "commands": [
          "forward",
          "forward",
          "right"
        ]
      },
      {
        "repeat": 4,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "forward",
          "left"
        ]
      },
      {
        "repeat": 4,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "forward",
          "right"
        ]
      },
      "take",
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      "open"
    ],
    "shortestCommandCount": 34,
    "loopAvailable": true
  },
  {
    "id": 43,
    "title": "Pola dan Persinggahan",
    "subtitle": "Cari pola, ambil kunci, lalu buka peti.",
    "grade": "SD 5",
    "group": "SD 5",
    "groupIndex": 7,
    "difficulty": 43,
    "lesson": "Menggabungkan pengulangan dengan syarat kunci dan perjalanan kembali.",
    "hints": [
      "Baca satu badan Ulangi lebih dahulu.",
      "Hitung posisi dan arah setelah setiap ulangan.",
      "Ambil kunci harus berada tepat di petaknya."
    ],
    "width": 7,
    "height": 7,
    "start": {
      "x": 4,
      "y": 0,
      "dir": "W"
    },
    "key": {
      "x": 4,
      "y": 4
    },
    "chest": {
      "x": 6,
      "y": 6
    },
    "obstacles": [
      {
        "x": 6,
        "y": 5
      },
      {
        "x": 5,
        "y": 5
      },
      {
        "x": 4,
        "y": 5
      },
      {
        "x": 3,
        "y": 5
      },
      {
        "x": 2,
        "y": 5
      },
      {
        "x": 1,
        "y": 5
      },
      {
        "x": 5,
        "y": 3
      },
      {
        "x": 4,
        "y": 3
      },
      {
        "x": 3,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 1,
        "y": 3
      },
      {
        "x": 0,
        "y": 3
      },
      {
        "x": 6,
        "y": 1
      },
      {
        "x": 5,
        "y": 1
      },
      {
        "x": 4,
        "y": 1
      },
      {
        "x": 3,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 1,
        "y": 1
      }
    ],
    "solution": [
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      {
        "repeat": 2,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "forward",
          "left"
        ]
      },
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "right",
          "forward",
          "forward"
        ]
      },
      "take",
      {
        "repeat": 2,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "forward",
          "left"
        ]
      },
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      "open"
    ],
    "shortestCommandCount": 36,
    "loopAvailable": true
  },
  {
    "id": 44,
    "title": "Susun Rencana Besar",
    "subtitle": "Cari pola, ambil kunci, lalu buka peti.",
    "grade": "SD 6",
    "group": "SD 6",
    "groupIndex": 8,
    "difficulty": 44,
    "lesson": "Merencanakan, menelusuri, dan menyederhanakan algoritma yang lebih panjang.",
    "hints": [
      "Baca satu badan Ulangi lebih dahulu.",
      "Hitung posisi dan arah setelah setiap ulangan.",
      "Ambil kunci harus berada tepat di petaknya."
    ],
    "width": 8,
    "height": 8,
    "start": {
      "x": 0,
      "y": 7,
      "dir": "E"
    },
    "key": {
      "x": 0,
      "y": 5
    },
    "chest": {
      "x": 0,
      "y": 1
    },
    "obstacles": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 1,
        "y": 0
      },
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 3,
        "y": 0
      },
      {
        "x": 4,
        "y": 0
      },
      {
        "x": 5,
        "y": 0
      },
      {
        "x": 6,
        "y": 0
      },
      {
        "x": 7,
        "y": 0
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 1,
        "y": 2
      },
      {
        "x": 2,
        "y": 2
      },
      {
        "x": 3,
        "y": 2
      },
      {
        "x": 4,
        "y": 2
      },
      {
        "x": 5,
        "y": 2
      },
      {
        "x": 6,
        "y": 2
      },
      {
        "x": 1,
        "y": 4
      },
      {
        "x": 2,
        "y": 4
      },
      {
        "x": 3,
        "y": 4
      },
      {
        "x": 4,
        "y": 4
      },
      {
        "x": 5,
        "y": 4
      },
      {
        "x": 6,
        "y": 4
      },
      {
        "x": 7,
        "y": 4
      },
      {
        "x": 0,
        "y": 6
      },
      {
        "x": 1,
        "y": 6
      },
      {
        "x": 2,
        "y": 6
      },
      {
        "x": 3,
        "y": 6
      },
      {
        "x": 4,
        "y": 6
      },
      {
        "x": 5,
        "y": 6
      },
      {
        "x": 6,
        "y": 6
      }
    ],
    "solution": [
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "take",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "left",
          "forward"
        ]
      },
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      "right",
      "take",
      {
        "repeat": 2,
        "commands": [
          "forward"
        ]
      },
      "right",
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "left",
          "forward"
        ]
      },
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      "open"
    ],
    "shortestCommandCount": 42,
    "loopAvailable": true
  },
  {
    "id": 45,
    "title": "Mulai dari Tengah",
    "subtitle": "Cari pola, ambil kunci, lalu buka peti.",
    "grade": "SD 6",
    "group": "SD 6",
    "groupIndex": 8,
    "difficulty": 45,
    "lesson": "Merencanakan, menelusuri, dan menyederhanakan algoritma yang lebih panjang.",
    "hints": [
      "Baca satu badan Ulangi lebih dahulu.",
      "Hitung posisi dan arah setelah setiap ulangan.",
      "Ambil kunci harus berada tepat di petaknya."
    ],
    "width": 8,
    "height": 8,
    "start": {
      "x": 3,
      "y": 7,
      "dir": "W"
    },
    "key": {
      "x": 7,
      "y": 1
    },
    "chest": {
      "x": 7,
      "y": 1
    },
    "obstacles": [
      {
        "x": 7,
        "y": 0
      },
      {
        "x": 6,
        "y": 0
      },
      {
        "x": 5,
        "y": 0
      },
      {
        "x": 4,
        "y": 0
      },
      {
        "x": 3,
        "y": 0
      },
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 1,
        "y": 0
      },
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 7,
        "y": 2
      },
      {
        "x": 6,
        "y": 2
      },
      {
        "x": 5,
        "y": 2
      },
      {
        "x": 4,
        "y": 2
      },
      {
        "x": 3,
        "y": 2
      },
      {
        "x": 2,
        "y": 2
      },
      {
        "x": 1,
        "y": 2
      },
      {
        "x": 6,
        "y": 4
      },
      {
        "x": 5,
        "y": 4
      },
      {
        "x": 4,
        "y": 4
      },
      {
        "x": 3,
        "y": 4
      },
      {
        "x": 2,
        "y": 4
      },
      {
        "x": 1,
        "y": 4
      },
      {
        "x": 0,
        "y": 4
      },
      {
        "x": 7,
        "y": 6
      },
      {
        "x": 6,
        "y": 6
      },
      {
        "x": 5,
        "y": 6
      },
      {
        "x": 4,
        "y": 6
      },
      {
        "x": 3,
        "y": 6
      },
      {
        "x": 2,
        "y": 6
      },
      {
        "x": 1,
        "y": 6
      }
    ],
    "solution": [
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "take",
      "open"
    ],
    "programSolution": [
      {
        "repeat": 2,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "right",
          "forward"
        ]
      },
      {
        "repeat": 4,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "forward",
          "left"
        ]
      },
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "right",
          "forward"
        ]
      },
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      "take",
      "open"
    ],
    "shortestCommandCount": 38,
    "loopAvailable": true
  },
  {
    "id": 46,
    "title": "Ambil Lalu Kembali",
    "subtitle": "Cari pola, ambil kunci, lalu buka peti.",
    "grade": "SD 6",
    "group": "SD 6",
    "groupIndex": 8,
    "difficulty": 46,
    "lesson": "Merencanakan, menelusuri, dan menyederhanakan algoritma yang lebih panjang.",
    "hints": [
      "Baca satu badan Ulangi lebih dahulu.",
      "Hitung posisi dan arah setelah setiap ulangan.",
      "Ambil kunci harus berada tepat di petaknya."
    ],
    "width": 8,
    "height": 8,
    "start": {
      "x": 5,
      "y": 0,
      "dir": "E"
    },
    "key": {
      "x": 0,
      "y": 6
    },
    "chest": {
      "x": 5,
      "y": 4
    },
    "obstacles": [
      {
        "x": 0,
        "y": 7
      },
      {
        "x": 1,
        "y": 7
      },
      {
        "x": 2,
        "y": 7
      },
      {
        "x": 3,
        "y": 7
      },
      {
        "x": 4,
        "y": 7
      },
      {
        "x": 5,
        "y": 7
      },
      {
        "x": 6,
        "y": 7
      },
      {
        "x": 7,
        "y": 7
      },
      {
        "x": 0,
        "y": 5
      },
      {
        "x": 1,
        "y": 5
      },
      {
        "x": 2,
        "y": 5
      },
      {
        "x": 3,
        "y": 5
      },
      {
        "x": 4,
        "y": 5
      },
      {
        "x": 5,
        "y": 5
      },
      {
        "x": 6,
        "y": 5
      },
      {
        "x": 1,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 3,
        "y": 3
      },
      {
        "x": 4,
        "y": 3
      },
      {
        "x": 5,
        "y": 3
      },
      {
        "x": 6,
        "y": 3
      },
      {
        "x": 7,
        "y": 3
      },
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 3,
        "y": 1
      },
      {
        "x": 4,
        "y": 1
      },
      {
        "x": 5,
        "y": 1
      },
      {
        "x": 6,
        "y": 1
      }
    ],
    "solution": [
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      "forward",
      {
        "repeat": 2,
        "commands": [
          "forward",
          "right",
          "forward"
        ]
      },
      {
        "repeat": 4,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "forward",
          "left"
        ]
      },
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "right",
          "forward"
        ]
      },
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "left"
        ]
      },
      "take",
      "forward",
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "left",
          "forward",
          "forward"
        ]
      },
      "open"
    ],
    "shortestCommandCount": 52,
    "loopAvailable": true
  },
  {
    "id": 47,
    "title": "Baca Peta Terbalik",
    "subtitle": "Cari pola, ambil kunci, lalu buka peti.",
    "grade": "SD 6",
    "group": "SD 6",
    "groupIndex": 8,
    "difficulty": 47,
    "lesson": "Merencanakan, menelusuri, dan menyederhanakan algoritma yang lebih panjang.",
    "hints": [
      "Baca satu badan Ulangi lebih dahulu.",
      "Hitung posisi dan arah setelah setiap ulangan.",
      "Ambil kunci harus berada tepat di petaknya."
    ],
    "width": 8,
    "height": 8,
    "start": {
      "x": 5,
      "y": 0,
      "dir": "W"
    },
    "key": {
      "x": 4,
      "y": 4
    },
    "chest": {
      "x": 7,
      "y": 6
    },
    "obstacles": [
      {
        "x": 7,
        "y": 7
      },
      {
        "x": 6,
        "y": 7
      },
      {
        "x": 5,
        "y": 7
      },
      {
        "x": 4,
        "y": 7
      },
      {
        "x": 3,
        "y": 7
      },
      {
        "x": 2,
        "y": 7
      },
      {
        "x": 1,
        "y": 7
      },
      {
        "x": 0,
        "y": 7
      },
      {
        "x": 7,
        "y": 5
      },
      {
        "x": 6,
        "y": 5
      },
      {
        "x": 5,
        "y": 5
      },
      {
        "x": 4,
        "y": 5
      },
      {
        "x": 3,
        "y": 5
      },
      {
        "x": 2,
        "y": 5
      },
      {
        "x": 1,
        "y": 5
      },
      {
        "x": 6,
        "y": 3
      },
      {
        "x": 5,
        "y": 3
      },
      {
        "x": 4,
        "y": 3
      },
      {
        "x": 3,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 1,
        "y": 3
      },
      {
        "x": 0,
        "y": 3
      },
      {
        "x": 7,
        "y": 1
      },
      {
        "x": 6,
        "y": 1
      },
      {
        "x": 5,
        "y": 1
      },
      {
        "x": 4,
        "y": 1
      },
      {
        "x": 3,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 1,
        "y": 1
      }
    ],
    "solution": [
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      {
        "repeat": 3,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "forward",
          "left"
        ]
      },
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "right",
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward"
        ]
      },
      "take",
      {
        "repeat": 3,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "left",
          "forward"
        ]
      },
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      "open"
    ],
    "shortestCommandCount": 40,
    "loopAvailable": true
  },
  {
    "id": 48,
    "title": "Telusuri Setiap Ulangan",
    "subtitle": "Cari pola, ambil kunci, lalu buka peti.",
    "grade": "SD 6",
    "group": "SD 6",
    "groupIndex": 8,
    "difficulty": 48,
    "lesson": "Merencanakan, menelusuri, dan menyederhanakan algoritma yang lebih panjang.",
    "hints": [
      "Baca satu badan Ulangi lebih dahulu.",
      "Hitung posisi dan arah setelah setiap ulangan.",
      "Ambil kunci harus berada tepat di petaknya."
    ],
    "width": 8,
    "height": 7,
    "start": {
      "x": 0,
      "y": 6,
      "dir": "E"
    },
    "key": {
      "x": 0,
      "y": 0
    },
    "chest": {
      "x": 7,
      "y": 1
    },
    "obstacles": [
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 3,
        "y": 1
      },
      {
        "x": 4,
        "y": 1
      },
      {
        "x": 5,
        "y": 1
      },
      {
        "x": 6,
        "y": 1
      },
      {
        "x": 1,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 3,
        "y": 3
      },
      {
        "x": 4,
        "y": 3
      },
      {
        "x": 5,
        "y": 3
      },
      {
        "x": 6,
        "y": 3
      },
      {
        "x": 7,
        "y": 3
      },
      {
        "x": 0,
        "y": 5
      },
      {
        "x": 1,
        "y": 5
      },
      {
        "x": 2,
        "y": 5
      },
      {
        "x": 3,
        "y": 5
      },
      {
        "x": 4,
        "y": 5
      },
      {
        "x": 5,
        "y": 5
      },
      {
        "x": 6,
        "y": 5
      }
    ],
    "solution": [
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "open"
    ],
    "programSolution": [
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "left",
          "forward"
        ]
      },
      {
        "repeat": 4,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "forward",
          "right"
        ]
      },
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "left",
          "forward"
        ]
      },
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "left"
        ]
      },
      "take",
      "forward",
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      "right",
      "forward",
      "open"
    ],
    "shortestCommandCount": 53,
    "loopAvailable": true
  },
  {
    "id": 49,
    "title": "Rencanakan Jalan Pulang",
    "subtitle": "Cari pola, ambil kunci, lalu buka peti.",
    "grade": "SD 6",
    "group": "SD 6",
    "groupIndex": 8,
    "difficulty": 49,
    "lesson": "Merencanakan, menelusuri, dan menyederhanakan algoritma yang lebih panjang.",
    "hints": [
      "Baca satu badan Ulangi lebih dahulu.",
      "Hitung posisi dan arah setelah setiap ulangan.",
      "Ambil kunci harus berada tepat di petaknya."
    ],
    "width": 8,
    "height": 7,
    "start": {
      "x": 4,
      "y": 6,
      "dir": "W"
    },
    "key": {
      "x": 3,
      "y": 0
    },
    "chest": {
      "x": 7,
      "y": 2
    },
    "obstacles": [
      {
        "x": 7,
        "y": 1
      },
      {
        "x": 6,
        "y": 1
      },
      {
        "x": 5,
        "y": 1
      },
      {
        "x": 4,
        "y": 1
      },
      {
        "x": 3,
        "y": 1
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 6,
        "y": 3
      },
      {
        "x": 5,
        "y": 3
      },
      {
        "x": 4,
        "y": 3
      },
      {
        "x": 3,
        "y": 3
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 1,
        "y": 3
      },
      {
        "x": 0,
        "y": 3
      },
      {
        "x": 7,
        "y": 5
      },
      {
        "x": 6,
        "y": 5
      },
      {
        "x": 5,
        "y": 5
      },
      {
        "x": 4,
        "y": 5
      },
      {
        "x": 3,
        "y": 5
      },
      {
        "x": 2,
        "y": 5
      },
      {
        "x": 1,
        "y": 5
      }
    ],
    "solution": [
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      {
        "repeat": 2,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "forward",
          "right"
        ]
      },
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "left",
          "forward"
        ]
      },
      {
        "repeat": 4,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "forward",
          "right"
        ]
      },
      {
        "repeat": 3,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "left"
        ]
      },
      "take",
      {
        "repeat": 2,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "left",
          "forward"
        ]
      },
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      "open"
    ],
    "shortestCommandCount": 51,
    "loopAvailable": true
  },
  {
    "id": 50,
    "title": "Misi Algoritma Bersama",
    "subtitle": "Cari pola, ambil kunci, lalu buka peti.",
    "grade": "SD 6",
    "group": "SD 6",
    "groupIndex": 8,
    "difficulty": 50,
    "lesson": "Merencanakan, menelusuri, dan menyederhanakan algoritma yang lebih panjang.",
    "hints": [
      "Baca satu badan Ulangi lebih dahulu.",
      "Hitung posisi dan arah setelah setiap ulangan.",
      "Ambil kunci harus berada tepat di petaknya."
    ],
    "width": 8,
    "height": 8,
    "start": {
      "x": 0,
      "y": 7,
      "dir": "E"
    },
    "key": {
      "x": 0,
      "y": 1
    },
    "chest": {
      "x": 5,
      "y": 3
    },
    "obstacles": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 1,
        "y": 0
      },
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 3,
        "y": 0
      },
      {
        "x": 4,
        "y": 0
      },
      {
        "x": 5,
        "y": 0
      },
      {
        "x": 6,
        "y": 0
      },
      {
        "x": 7,
        "y": 0
      },
      {
        "x": 0,
        "y": 2
      },
      {
        "x": 1,
        "y": 2
      },
      {
        "x": 2,
        "y": 2
      },
      {
        "x": 3,
        "y": 2
      },
      {
        "x": 4,
        "y": 2
      },
      {
        "x": 5,
        "y": 2
      },
      {
        "x": 6,
        "y": 2
      },
      {
        "x": 1,
        "y": 4
      },
      {
        "x": 2,
        "y": 4
      },
      {
        "x": 3,
        "y": 4
      },
      {
        "x": 4,
        "y": 4
      },
      {
        "x": 5,
        "y": 4
      },
      {
        "x": 6,
        "y": 4
      },
      {
        "x": 7,
        "y": 4
      },
      {
        "x": 0,
        "y": 6
      },
      {
        "x": 1,
        "y": 6
      },
      {
        "x": 2,
        "y": 6
      },
      {
        "x": 3,
        "y": 6
      },
      {
        "x": 4,
        "y": 6
      },
      {
        "x": 5,
        "y": 6
      },
      {
        "x": 6,
        "y": 6
      }
    ],
    "solution": [
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "left",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "left",
      "left",
      "take",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "right",
      "forward",
      "forward",
      "open"
    ],
    "programSolution": [
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "left",
          "forward"
        ]
      },
      {
        "repeat": 4,
        "commands": [
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "forward",
          "right"
        ]
      },
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "forward",
          "left",
          "forward"
        ]
      },
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "left"
        ]
      },
      "take",
      "forward",
      {
        "repeat": 3,
        "commands": [
          "forward",
          "forward"
        ]
      },
      {
        "repeat": 2,
        "commands": [
          "right",
          "forward",
          "forward"
        ]
      },
      "open"
    ],
    "shortestCommandCount": 57,
    "loopAvailable": true
  }
]);
