/* =========================================================
   SETARA: Misi Sekolah Adil — logika game
   ========================================================= */
(() => {
  "use strict";

  const CFG = window.CONFIG || {};
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  /* ---------------- Data skenario (Mode Cerita) ---------------- */
  // v = perubahan Indeks Kesetaraan. good = +, mid = 0/kecil, bad = −
  const SCENES = [
    {
      art: "🧹", tag: "Kelas", title: "Jadwal Piket",
      text: "Wali kelas minta ketua kelas menyusun jadwal piket. Beberapa teman bilang: \"Nyapu sama ngepel biar cewek aja, cowok angkat kursi doang.\" Kamu yang pegang daftarnya…",
      choices: [
        { t: "Bikin jadwal bergilir: semua orang kebagian semua tugas.", v: 15, fb: "Adil! Menyapu, mengepel, dan mengangkat kursi adalah tugas bersama, bukan tugas \"khusus\" gender tertentu." },
        { t: "Ikuti saja usulan teman-teman biar cepat selesai.", v: -15, fb: "Kelihatannya sepele, tapi ini memperkuat anggapan bahwa pekerjaan bersih-bersih adalah \"urusan perempuan\"." },
        { t: "Biarkan tiap orang pilih tugasnya sendiri.", v: 0, fb: "Niatnya baik, tapi tanpa aturan jelas, pola lama biasanya terulang lagi. Jadwal bergilir lebih adil." }
      ],
      fact: "Merawat kebersihan adalah keterampilan hidup untuk semua orang. Anak yang terbiasa berbagi tugas sejak sekolah cenderung lebih siap berbagi peran saat dewasa."
    },
    {
      art: "🗳️", tag: "Organisasi", title: "Calon Ketua Kelas",
      text: "Nadia ingin mencalonkan diri jadi ketua kelas. Ada yang nyeletuk: \"Ketua itu harusnya cowok, cewek mah wakil atau sekretaris aja.\"",
      choices: [
        { t: "\"Siapa pun boleh jadi ketua. Yang penting visi dan kemampuannya.\"", v: 15, fb: "Tepat! Kepemimpinan dinilai dari kemampuan dan integritas, bukan dari jenis kelamin." },
        { t: "Diam saja, toh nanti juga voting.", v: -5, fb: "Diam bisa dianggap setuju. Celetukan seperti ini bisa bikin orang mundur sebelum mencoba." },
        { t: "Ikut tertawa, \"Iya juga sih, hehe.\"", v: -15, fb: "Candaan seperti ini menormalkan stereotip bahwa perempuan \"kurang pantas\" memimpin." }
      ],
      fact: "Kepemimpinan adalah keterampilan yang bisa dipelajari siapa saja. Organisasi yang pemimpinnya beragam cenderung punya sudut pandang yang lebih lengkap."
    },
    {
      art: "💃", tag: "Ekskul", title: "Bima Mau Ikut Tari",
      text: "Bima jago menari dan ingin ikut ekskul tari tradisional. Di kantin, beberapa anak mengejeknya: \"Cowok kok nari, kayak cewek!\"",
      choices: [
        { t: "Bela Bima dan ajak yang lain menonton penampilannya nanti.", v: 15, fb: "Keren! Kamu membantu menciptakan ruang aman untuk berekspresi. Banyak penari hebat dunia adalah laki-laki." },
        { t: "Bilang ke Bima, \"Mending ikut futsal aja biar nggak diejek.\"", v: -10, fb: "Niatnya melindungi, tapi justru membuat Bima menyerah pada stereotip. Masalahnya ada pada pengejek, bukan Bima." },
        { t: "Pura-pura nggak dengar.", v: -5, fb: "Bystander yang diam membuat perundungan terus berlanjut." }
      ],
      fact: "Seni dan hobi tidak punya gender. Di banyak budaya Nusantara, ada tarian tradisional yang justru dibawakan oleh penari laki-laki."
    },
    {
      art: "🤖", tag: "Lomba", title: "Tim Robotik",
      text: "Sekolah mengirim tim ke lomba robotik. Guru pembina langsung menunjuk 4 siswa laki-laki. Sari, yang nilai informatikanya tertinggi, tidak diajak.",
      choices: [
        { t: "Usulkan seleksi terbuka berbasis tes atau portofolio.", v: 15, fb: "Solusi sistemik! Seleksi terbuka memastikan yang terpilih adalah yang paling siap, siapa pun dia." },
        { t: "\"Mungkin Sari memang nggak tertarik.\"", v: -10, fb: "Asumsi seperti ini sering jadi alasan perempuan tidak pernah ditawari kesempatan sejak awal." },
        { t: "Dorong Sari untuk bicara langsung ke guru pembina.", v: 5, fb: "Bagus untuk Sari, tapi akan lebih adil kalau sistemnya diubah agar tidak bergantung pada keberanian satu orang." }
      ],
      fact: "Menurut UNESCO, perempuan masih kurang terwakili di bidang sains, teknologi, teknik, dan matematika (STEM) di banyak negara — bukan karena kurang mampu, tapi karena kurang kesempatan dan dorongan."
    },
    {
      art: "😢", tag: "Olahraga", title: "\"Cowok Kok Cengeng\"",
      text: "Tim basket kelasmu kalah di final. Raka, kaptennya, menangis di pinggir lapangan. Seseorang berteriak, \"Cowok kok cengeng!\"",
      choices: [
        { t: "Hampiri Raka, tepuk bahunya: \"Wajar kok sedih, kamu udah berjuang.\"", v: 15, fb: "Empati itu kekuatan. Semua orang boleh merasakan dan menunjukkan emosi." },
        { t: "Bilang ke Raka, \"Udah, jangan nangis, malu dilihatin.\"", v: -10, fb: "Ini mengajarkan bahwa laki-laki harus memendam perasaan — kebiasaan yang bisa berdampak buruk pada kesehatan mental." },
        { t: "Biarkan saja, nanti juga reda.", v: 0, fb: "Tidak salah, tapi dukungan kecil dari teman bisa sangat berarti saat seseorang sedang terpuruk." }
      ],
      fact: "Stereotip \"laki-laki tidak boleh menangis\" membuat banyak laki-laki enggan mencari bantuan saat mengalami masalah kesehatan mental."
    },
    {
      art: "🚨", tag: "Lorong", title: "Komentar yang Tidak Pantas",
      text: "Saat jam istirahat, sekelompok siswa bersiul dan mengomentari tubuh siswi yang lewat. Mereka bilang itu \"cuma bercanda\".",
      choices: [
        { t: "Tegur dengan tenang dan laporkan ke guru BK atau tim pencegahan kekerasan sekolah.", v: 15, fb: "Tepat! Siulan dan komentar tentang tubuh adalah pelecehan verbal, bukan candaan. Melapor adalah langkah yang benar." },
        { t: "\"Ya namanya juga cowok.\"", v: -15, fb: "Kalimat ini menormalkan pelecehan. Perilaku adalah pilihan, bukan bawaan gender." },
        { t: "Temani siswi itu menjauh dari kelompok tersebut.", v: 5, fb: "Membantu korban itu baik! Langkah berikutnya: laporkan agar tidak terulang ke orang lain." }
      ],
      fact: "Indonesia memiliki UU No. 12 Tahun 2022 tentang Tindak Pidana Kekerasan Seksual (TPKS) yang juga mengatur pelecehan nonfisik. Sekolah pun diwajibkan membentuk Tim Pencegahan dan Penanganan Kekerasan (TPPK)."
    },
    {
      art: "⚽", tag: "Fasilitas", title: "Jadwal Lapangan",
      text: "Setiap istirahat, lapangan selalu dipakai siswa laki-laki untuk futsal. Siswi yang ingin main voli atau futsal tidak pernah kebagian tempat.",
      choices: [
        { t: "Usulkan ke OSIS jadwal pemakaian lapangan bergiliran.", v: 15, fb: "Mantap! Fasilitas sekolah milik semua siswa, dan pembagian yang jelas mencegah konflik." },
        { t: "\"Cewek kan emang jarang olahraga.\"", v: -15, fb: "Jarang karena tidak kebagian tempat, bukan karena tidak mau. Ini contoh ketimpangan akses." },
        { t: "Ajak siswi main di halaman belakang saja.", v: 0, fb: "Kreatif, tapi tidak menyelesaikan masalah: akses ke fasilitas utama tetap timpang." }
      ],
      fact: "Kesetaraan bukan hanya soal sikap, tapi juga soal akses: siapa yang bisa memakai fasilitas, mendapat waktu, dan didengar."
    },
    {
      art: "🗣️", tag: "Kerja Kelompok", title: "Ide yang Dipotong",
      text: "Saat diskusi kelompok, Maya menyampaikan ide tapi terus dipotong. Lima menit kemudian, Dimas mengulang ide yang sama dan semua memujinya.",
      choices: [
        { t: "\"Eh, itu kan ide Maya tadi. Maya, lanjutin dong penjelasanmu.\"", v: 15, fb: "Kamu mengembalikan kredit ke pemiliknya. Hal kecil seperti ini membuat semua orang berani bicara." },
        { t: "Yang penting idenya dipakai, siapa yang ngomong nggak penting.", v: -5, fb: "Kalau terus terjadi, orang yang idenya selalu \"diambil\" lama-lama berhenti berpendapat." },
        { t: "Usulkan aturan: setiap anggota bicara bergiliran tanpa dipotong.", v: 10, fb: "Solusi bagus untuk ke depannya! Lebih lengkap lagi kalau kredit ide tadi juga dikembalikan ke Maya." }
      ],
      fact: "Fenomena memotong pembicaraan dan mengambil ide orang lain sering terjadi dalam diskusi. Moderator yang adil membantu semua suara terdengar."
    },
    {
      art: "📱", tag: "Media Sosial", title: "Meme di Grup Kelas",
      text: "Di grup chat kelas, seseorang membagikan meme: \"Cewek tempatnya di dapur 🤣\". Banyak yang membalas dengan emoji tertawa.",
      choices: [
        { t: "Balas sopan: \"Kurang lucu sih, ini merendahkan. Yuk bahas yang lain.\"", v: 15, fb: "Berani dan tetap santun. Satu suara yang menolak sering membuat orang lain ikut berani." },
        { t: "Ikut kirim emoji ketawa biar nggak dianggap baper.", v: -15, fb: "Candaan yang merendahkan tetap merendahkan, walau dikemas lucu. Takut dicap \"baper\" membuat stereotip terus hidup." },
        { t: "Japri si pengirim dan jelaskan kenapa meme itu nggak oke.", v: 10, fb: "Pendekatan personal bisa sangat efektif! Tidak semua orang sadar candaannya menyakiti." }
      ],
      fact: "Candaan yang merendahkan kelompok tertentu bisa membentuk cara pandang orang secara perlahan, apalagi jika terus diulang dan dianggap wajar."
    },
    {
      art: "🎓", tag: "Masa Depan", title: "Cita-Cita",
      text: "Di sesi bimbingan karier, Laras ingin jadi insinyur sipil dan Fajar ingin jadi perawat. Beberapa teman tertawa: \"Kebalik, woy!\"",
      choices: [
        { t: "\"Keren dua-duanya! Kerjaan nggak punya jenis kelamin.\"", v: 15, fb: "Betul! Insinyur perempuan dan perawat laki-laki sama-sama dibutuhkan dan sama-sama hebat." },
        { t: "\"Iya sih, agak aneh ya.\"", v: -15, fb: "Komentar seperti ini bisa membuat seseorang mengubur cita-citanya hanya karena takut dianggap \"aneh\"." },
        { t: "Diam, itu urusan mereka.", v: 0, fb: "Memang pilihan mereka, tapi dukungan teman bisa jadi bahan bakar untuk tetap mengejar mimpi." }
      ],
      fact: "Kesetaraan gender adalah Tujuan ke-5 dari Tujuan Pembangunan Berkelanjutan (SDGs) PBB: memastikan setiap orang bisa meraih potensinya tanpa dibatasi gender."
    }
  ];

  /* ---------------- Data Arcade ---------------- */
  const SHIELD_LABEL = "🔒 Perisai";
  // Pesan emas: nilai paling penting. Kumpulkan RUSH_NEED untuk memicu Golden Rush.
  // (Hindari emoji ber-U+FE0F; lihat Arcade.centerText.)
  const GOLD_ITEMS = [
    "🌟 Setara Itu Hak Semua", "👑 Kamu Berhak Bermimpi", "🏆 Pendidikan Hak Setiap Anak",
    "💎 Hargai Setiap Pilihan", "🌈 Siapa Pun Bisa Jadi Apa Pun", "🚀 Bakat Tak Kenal Gender"
  ];
  const RUSH_NEED = 4, RUSH_TIME = 8;
  const GOOD_ITEMS = [
    "⭐ Kesempatan Sama", "🤝 Saling Hormat", "🙋 Semua Boleh Memimpin", "📚 Pendidikan untuk Semua",
    "💬 Semua Suara Didengar", "⚽ Olahraga untuk Semua", "🎨 Hobi Tanpa Label", "🧹 Piket Bergilir",
    "💪 Berani Bersuara", "💖 Empati", "🎓 Mimpi Tanpa Batas", "🛑 Stop Pelecehan"
  ];
  const BAD_ITEMS = [
    "\"Cewek gak bisa mimpin\"", "\"Cowok gak boleh nangis\"", "\"Nyapu urusan cewek\"",
    "\"Cowok kok nari\"", "\"Cewek gak usah sekolah tinggi\"", "\"Namanya juga cowok\"",
    "\"Robotik buat cowok aja\"", "\"Cewek tempatnya di dapur\"", "\"Kerjaan cowok/cewek\"",
    "\"Baper amat\""
  ];

  /* ---------------- State & util ---------------- */
  const state = {
    name: "", mode: "story", soundOn: true, musicOn: true,
    story: { idx: 0, meter: 50, score: 0, history: [] },
    lastResult: null
  };

  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
    },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* abaikan */ } }
  };

  const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /* ---------------- Suara (Web Audio, tanpa file) ---------------- */
  let audioCtx = null;
  function beep(freq = 600, dur = 0.12, type = "sine", vol = 0.15, slide = 0) {
    if (!state.soundOn) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      const t = audioCtx.currentTime;
      o.type = type; o.frequency.setValueAtTime(freq, t);
      if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g).connect(audioCtx.destination); o.start(t); o.stop(t + dur);
    } catch { /* audio tidak tersedia */ }
  }
  const sfx = {
    good: () => { beep(660, .1, "triangle"); setTimeout(() => beep(990, .15, "triangle"), 80); },
    bad: () => beep(220, .3, "sawtooth", .12, -120),
    mid: () => beep(440, .15, "sine"),
    click: () => beep(800, .05, "square", .06),
    power: () => { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, .12, "triangle"), i * 60)); },
    gold: () => { [988, 1319, 1760].forEach((f, i) => setTimeout(() => beep(f, .14, "triangle", .13), i * 55)); },
    rush: () => {
      beep(180, .6, "sawtooth", .1, 900);
      [523, 659, 784, 1046, 1318, 1568].forEach((f, i) => setTimeout(() => beep(f, .16, "square", .07), 250 + i * 70));
    },
    rushEnd: () => beep(700, .4, "triangle", .1, -400),
    win: () => { [523, 659, 784, 1046, 1318].forEach((f, i) => setTimeout(() => beep(f, .18, "triangle", .12), i * 110)); }
  };

  /* ---------------- Musik latar (Web Audio, komposisi orisinal) ----------------
     Tiga lagu loop yang disusun dari not: lobi (ceria), cerita (tenang, reflektif),
     arcade (chiptune cepat; lebih kencang saat Golden Rush). Satu langkah = not 1/16. */
  const Music = (() => {
    let master = null, track = null, want = "lobby", on = true, rush = false;
    let timer = 0, step = 0, nextT = 0, noiseBuf = null;
    const mtof = (n) => 440 * Math.pow(2, (n - 69) / 12);

    function tone(n, t, dur, type, vol, attack = 0.01) {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = type; o.frequency.setValueAtTime(mtof(n), t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol, t + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(dur, attack + 0.02));
      o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.05);
    }
    function noise(t, dur, vol, hp = 6000) {
      if (!noiseBuf) {
        noiseBuf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.5, audioCtx.sampleRate);
        const d = noiseBuf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      const s = audioCtx.createBufferSource(), f = audioCtx.createBiquadFilter(), g = audioCtx.createGain();
      s.buffer = noiseBuf; f.type = "highpass"; f.frequency.value = hp;
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      s.connect(f).connect(g).connect(master); s.start(t); s.stop(t + dur + 0.02);
    }
    function kick(t, vol) {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.14);
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.connect(g).connect(master); o.start(t); o.stop(t + 0.2);
    }
    const melodyAt = (bars, bar, s) => { const hit = bars[bar].find((m) => m[0] === s); return hit && hit[1]; };

    const TRACKS = {
      // "Langkah Bersama" — C mayor, I–V–vi–IV, ceria dan ringan
      lobby: {
        bpm: 108,
        chords: [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]],
        mel: [
          [[0, 72], [4, 74], [6, 76], [10, 79], [12, 76]],
          [[0, 74], [4, 71], [8, 74], [12, 79]],
          [[0, 76], [4, 72], [6, 74], [8, 76], [12, 81]],
          [[0, 77], [4, 76], [8, 74], [12, 72]]
        ],
        play(s, bar, t, d) {
          const ch = this.chords[bar];
          if (s % 4 === 0) tone(ch[0] - 24, t, d * 3, "triangle", 0.2);
          if (s % 2 === 0) tone(ch[(s / 2) % 3] + 12, t, d * 1.6, "triangle", 0.05);
          const m = melodyAt(this.mel, bar, s);
          if (m) tone(m, t, d * 3, "sine", 0.09);
          if (s % 8 === 0) kick(t, 0.22);
          if (s % 4 === 2) noise(t, 0.04, 0.025);
        }
      },
      // "Ruang Refleksi" — F mayor, akor maj7 yang lembut, untuk berpikir
      story: {
        bpm: 76,
        chords: [[53, 57, 60, 64], [50, 53, 57, 60], [46, 50, 53, 57], [48, 52, 55, 58]],
        mel: [
          [[0, 72], [6, 69], [8, 67]],
          [[4, 69], [8, 65]],
          [[0, 70], [6, 69], [10, 65]],
          [[0, 67], [8, 64], [12, 67]]
        ],
        play(s, bar, t, d) {
          const ch = this.chords[bar];
          if (s === 0) ch.forEach((n) => tone(n + 12, t, d * 16, "sine", 0.035, 0.5));
          if (s === 0 || s === 10) tone(ch[0] - 12, t, d * 8, "sine", 0.13, 0.05);
          const m = melodyAt(this.mel, bar, s);
          if (m) { tone(m, t, d * 6, "sine", 0.07); tone(m + 12, t, d * 2, "triangle", 0.015); }
          if (s % 4 === 2) noise(t, 0.05, 0.01, 8000);
        }
      },
      // "Lari Setara" — A minor, chiptune cepat
      arcade: {
        bpm: 138,
        chords: [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]],
        mel: [
          [[0, 76], [2, 72], [4, 69], [6, 72], [8, 76], [10, 79], [12, 81], [14, 79]],
          [[0, 77], [2, 76], [4, 72], [6, 69], [8, 72], [10, 77], [12, 76], [14, 72]],
          [[0, 76], [2, 79], [4, 84], [6, 79], [8, 76], [10, 72], [12, 74], [14, 76]],
          [[0, 74], [2, 71], [4, 67], [6, 71], [8, 74], [10, 79], [12, 83], [14, 79]]
        ],
        play(s, bar, t, d) {
          const ch = this.chords[bar];
          if (s % 2 === 0) tone(ch[0] - 24 + (s % 4 === 2 ? 12 : 0), t, d * 1.5, "square", 0.05);
          const m = melodyAt(this.mel, bar, s);
          if (m) {
            tone(m, t, d * 1.4, "square", 0.04);
            if (rush) tone(m + 7, t, d * 1.4, "sawtooth", 0.025); // lapisan api Golden Rush
          }
          if (s % 4 === 0) kick(t, 0.3);
          if (s % 8 === 4) noise(t, 0.12, 0.07, 1500);
          if (rush || s % 2 === 0) noise(t, 0.03, 0.02);
        }
      }
    };

    function tick() {
      if (!track || !audioCtx) return;
      const now = audioCtx.currentTime;
      if (nextT < now - 0.2) nextT = now + 0.05; // tab sempat tertidur: jangan memutar tumpukan not
      while (nextT < now + 0.15) {
        const tr = TRACKS[track];
        const d = 60 / (tr.bpm * (track === "arcade" && rush ? 1.2 : 1)) / 4;
        const bar = Math.floor(step / 16) % tr.chords.length;
        try { tr.play(step % 16, bar, nextT, d); } catch { /* abaikan */ }
        nextT += d; step++;
      }
    }

    function start() {
      if (!audioCtx || !on || !state.soundOn || document.hidden) return;
      if (!master) { master = audioCtx.createGain(); master.connect(audioCtx.destination); }
      if (track !== want || !timer) {
        track = want; step = 0;
        nextT = audioCtx.currentTime + 0.1;
        master.gain.cancelScheduledValues(audioCtx.currentTime);
        master.gain.setValueAtTime(0.0001, audioCtx.currentTime);
        master.gain.exponentialRampToValueAtTime(0.6, audioCtx.currentTime + 0.8);
      }
      if (!timer) timer = setInterval(tick, 25);
    }
    function stop() {
      clearInterval(timer); timer = 0; track = null;
      if (master && audioCtx) {
        master.gain.cancelScheduledValues(audioCtx.currentTime);
        master.gain.setValueAtTime(master.gain.value, audioCtx.currentTime);
        master.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.15);
        // ganti master agar not yang sudah terjadwal ikut senyap
        const old = master; master = null; setTimeout(() => old.disconnect(), 300);
      }
    }

    // Browser hanya mengizinkan audio setelah interaksi pertama pengguna.
    function unlock() {
      try {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === "suspended") audioCtx.resume();
      } catch { return; }
      start();
    }
    ["pointerdown", "keydown", "touchend"].forEach((ev) => document.addEventListener(ev, unlock, { passive: true }));
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

    return {
      play(name) { if (name === want && timer) return; want = name; stop(); start(); },
      setRush(v) { rush = v; },
      setEnabled(v) { on = v; on && state.soundOn ? start() : stop(); }
    };
  })();

  /* ---------------- Navigasi layar ---------------- */
  function show(id) {
    $$(".screen").forEach((s) => s.classList.remove("active"));
    $("#screen-" + id).classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (id !== "arcade") Arcade.stop();
    Music.play(id === "story" || id === "arcade" ? id : "lobby");
  }

  function playerName() {
    const n = $("#player-name").value.trim();
    return n || "Anonim";
  }

  /* ---------------- Confetti ---------------- */
  function confetti(n = 80) {
    const layer = $("#confetti-layer");
    const colors = ["#ff5fa2", "#9b5cff", "#2ee6c5", "#ffd23f", "#26a6ff"];
    for (let i = 0; i < n; i++) {
      const c = document.createElement("i");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = pick(colors);
      c.style.animationDuration = rand(2, 4) + "s";
      c.style.animationDelay = rand(0, .6) + "s";
      c.style.transform = `rotate(${rand(0, 360)}deg)`;
      layer.appendChild(c);
      setTimeout(() => c.remove(), 5000);
    }
  }

  /* =========================================================
     MODE CERITA
     ========================================================= */
  const Story = {
    scenes: [],
    start() {
      state.mode = "story";
      state.name = playerName();
      this.scenes = shuffle(SCENES);
      state.story = { idx: 0, meter: 50, score: 0, history: [] };
      $("#progress-dots").innerHTML = this.scenes.map(() => "<i></i>").join("");
      this.updateMeter();
      show("story");
      this.render();
    },
    render() {
      const s = this.scenes[state.story.idx];
      $("#feedback-card").classList.add("hidden");
      $("#scene-art").textContent = s.art;
      $("#scene-tag").textContent = s.tag;
      $("#scene-title").textContent = s.title;
      $("#scene-text").textContent = s.text;
      const keys = ["A", "B", "C"];
      const opts = shuffle(s.choices);
      const box = $("#choices");
      box.innerHTML = "";
      opts.forEach((c, i) => {
        const b = document.createElement("button");
        b.className = "choice";
        b.innerHTML = `<span class="key">${keys[i]}</span><span>${escapeHTML(c.t)}</span>`;
        b.addEventListener("click", () => this.choose(c, b));
        box.appendChild(b);
      });
      $$("#progress-dots i").forEach((d, i) => {
        d.classList.toggle("now", i === state.story.idx);
      });
      // animasi ulang kartu
      const card = $("#scenario-card");
      card.style.animation = "none"; void card.offsetWidth; card.style.animation = "pop-in .45s cubic-bezier(.2,.9,.3,1.3)";
    },
    choose(c, btn) {
      $$("#choices .choice").forEach((b) => { b.disabled = true; if (b !== btn) b.classList.add("dim"); });
      const kind = c.v >= 10 ? "good" : c.v < 0 ? "bad" : "mid";
      btn.classList.add("picked", kind);
      sfx[kind]();

      const st = state.story;
      st.meter = Math.max(0, Math.min(100, st.meter + c.v));
      st.score += Math.max(0, c.v) * 10 + (kind === "good" ? 50 : 0);
      st.history.push(kind);
      this.updateMeter(true);

      const dot = $$("#progress-dots i")[st.idx];
      dot.classList.remove("now"); dot.classList.add(kind === "bad" ? "bad" : "done");

      const titles = { good: ["Mantap!", "Keren banget!", "Pahlawan kesetaraan!", "Tepat sekali!"], mid: ["Hmm, bisa lebih baik", "Lumayan…"], bad: ["Ups!", "Yah, kurang tepat", "Coba pikir lagi"] };
      $("#feedback-emoji").textContent = kind === "good" ? "🌟" : kind === "mid" ? "🤔" : "⚠️";
      $("#feedback-title").textContent = pick(titles[kind]);
      const d = $("#feedback-delta");
      d.textContent = (c.v > 0 ? "+" : "") + c.v;
      d.className = "delta " + (c.v > 0 ? "pos" : c.v < 0 ? "neg" : "zero");
      $("#feedback-text").textContent = c.fb;
      $("#feedback-fact").textContent = this.scenes[st.idx].fact;
      const fbCard = $("#feedback-card");
      fbCard.classList.remove("hidden");
      setTimeout(() => fbCard.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
      if (kind === "good") confetti(25);
    },
    updateMeter(bump) {
      const m = state.story.meter;
      $("#meter-value").textContent = m;
      const fill = $("#meter-fill");
      fill.style.width = m + "%";
      fill.style.backgroundPosition = (100 - m) + "% 0";
      const mood = $("#school-mood");
      mood.textContent = m >= 85 ? "🌈" : m >= 65 ? "😄" : m >= 45 ? "🙂" : m >= 25 ? "😕" : "😢";
      if (bump) { mood.classList.remove("bump"); void mood.offsetWidth; mood.classList.add("bump"); }
    },
    next() {
      sfx.click();
      state.story.idx++;
      if (state.story.idx >= this.scenes.length) return this.finish();
      this.render();
    },
    finish() {
      const st = state.story;
      const score = st.score + st.meter * 10;
      const goods = st.history.filter((h) => h === "good").length;
      let badge, rank, text;
      if (st.meter >= 90) { badge = "🏆"; rank = "Pahlawan Kesetaraan"; text = `Luar biasa! ${goods} dari ${this.scenes.length} pilihanmu membuat sekolah lebih adil. Sekolahmu kini jadi tempat di mana semua orang bisa berkembang.`; }
      else if (st.meter >= 70) { badge = "🥇"; rank = "Agen Perubahan"; text = `Hebat! Kamu peka terhadap ketidakadilan dan berani bertindak. Sedikit lagi menuju sekolah yang benar-benar setara!`; }
      else if (st.meter >= 45) { badge = "🌱"; rank = "Pejuang Pemula"; text = `Kamu sudah di jalur yang benar. Kadang diam terasa aman, tapi suara kecilmu bisa membawa perubahan besar.`; }
      else { badge = "🔍"; rank = "Penjelajah Baru"; text = `Stereotip memang sering terasa \"normal\". Coba main lagi dan baca fakta-faktanya — perubahan dimulai dari kesadaran!`; }
      showResult({ mode: "story", score, badge, rank, text });
    }
  };

  /* =========================================================
     MODE ARCADE (canvas)
     ========================================================= */
  const Arcade = {
    canvas: null, ctx: null, W: 0, H: 0, dpr: 1,
    running: false, raf: 0, last: 0,
    player: null, items: [], particles: [], floaters: [], stars: [],
    score: 0, lives: 3, time: 60, combo: 1, streak: 0, spawnT: 0, elapsed: 0, shield: 0,
    gold: 0, rush: 0, rushGlow: 0, rushFlash: 0, flames: [],
    keys: {},

    init() {
      this.canvas = $("#arcade-canvas");
      this.ctx = this.canvas.getContext("2d");
      window.addEventListener("resize", () => this.resize());
      const move = (clientX) => {
        const r = this.canvas.getBoundingClientRect();
        if (this.player) this.player.tx = clientX - r.left;
      };
      this.canvas.addEventListener("pointermove", (e) => move(e.clientX));
      this.canvas.addEventListener("pointerdown", (e) => move(e.clientX));
      this.canvas.addEventListener("touchmove", (e) => { e.preventDefault(); move(e.touches[0].clientX); }, { passive: false });
      window.addEventListener("keydown", (e) => { this.keys[e.key] = true; });
      window.addEventListener("keyup", (e) => { this.keys[e.key] = false; });
    },
    resize() {
      const r = this.canvas.getBoundingClientRect();
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.W = r.width; this.H = r.height;
      this.canvas.width = this.W * this.dpr; this.canvas.height = this.H * this.dpr;
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      if (this.player) { this.player.y = this.H - 60; this.player.x = Math.min(this.player.x, this.W); }
      this.stars = Array.from({ length: 50 }, () => ({ x: rand(0, this.W), y: rand(0, this.H), r: rand(.5, 2), s: rand(10, 40) }));
    },
    open() {
      state.mode = "arcade";
      state.name = playerName();
      show("arcade");
      $("#arcade-overlay").classList.remove("hidden");
      requestAnimationFrame(() => { this.resize(); this.reset(); this.draw(); });
    },
    reset() {
      this.player = { x: this.W / 2, tx: this.W / 2, y: this.H - 60, w: 60, h: 32, tilt: 0 };
      this.items = []; this.particles = []; this.floaters = [];
      this.score = 0; this.lives = 3; this.time = 60; this.combo = 1; this.streak = 0;
      this.spawnT = 0; this.elapsed = 0; this.shield = 0;
      this.gold = 0; this.rush = 0; this.rushGlow = 0; this.rushFlash = 0; this.flames = [];
      $(".canvas-wrap").classList.remove("rush");
      Music.setRush(false);
      this.updateHUD();
    },
    go() {
      sfx.click();
      $("#arcade-overlay").classList.add("hidden");
      this.reset();
      this.running = true;
      this.last = performance.now();
      cancelAnimationFrame(this.raf);
      this.raf = requestAnimationFrame((t) => this.loop(t));
    },
    stop() { this.running = false; cancelAnimationFrame(this.raf); },

    spawn() {
      const level = 1 + this.elapsed / 15;
      const r = Math.random();
      let type, label;
      const badP = Math.min(0.32, 0.22 + this.elapsed / 300);
      if (r < 0.06) { type = "power"; label = Math.random() < .5 ? SHIELD_LABEL : "⏰ +5 detik"; }
      else if (r < 0.10) { type = "gold"; label = pick(GOLD_ITEMS); }
      else if (r < 0.10 + badP) { type = "bad"; label = pick(BAD_ITEMS); }
      else { type = "good"; label = pick(GOOD_ITEMS); }
      const fontSize = this.W < 420 ? 13 : 15;
      this.ctx.font = `800 ${fontSize}px Nunito, sans-serif`;
      const w = this.ctx.measureText(label).width + 26;
      const h = fontSize + 18;
      // cari posisi x yang tidak menumpuk dengan item yang baru muncul
      let x = 0;
      for (let tries = 0; tries < 8; tries++) {
        const m = w / 2 + (type === "gold" ? 22 : 6);
        x = rand(m, Math.max(m + 1, this.W - m));
        const clash = this.items.some((o) => o.y < h * 3 && Math.abs(o.x - x) < (o.w + w) / 2 + 8);
        if (!clash) break;
      }
      this.items.push({
        type, label, w, h, fontSize,
        x, y: -h,
        vy: rand(90, 140) * (0.85 + level * 0.18) * (type === "bad" ? 1.05 : type === "gold" ? 1.25 : 1) * (this.rush > 0 ? 1.45 : 1),
        wob: rand(0, Math.PI * 2)
      });
    },

    loop(t) {
      if (!this.running) return;
      const dt = Math.min(0.05, (t - this.last) / 1000);
      this.last = t;
      this.update(dt);
      this.draw();
      if (this.running) this.raf = requestAnimationFrame((tt) => this.loop(tt));
    },

    update(dt) {
      this.elapsed += dt;
      this.time -= dt;
      if (this.shield > 0) this.shield -= dt;
      if (this.rush > 0) { this.rush -= dt; if (this.rush <= 0) this.endRush(); }
      this.rushGlow += ((this.rush > 0 ? 1 : 0) - this.rushGlow) * Math.min(1, dt * 4);
      if (this.rushFlash > 0) this.rushFlash = Math.max(0, this.rushFlash - dt * 1.2);
      if (this.time <= 0) { this.time = 0; return this.end("Waktu habis!"); }

      // gerak pemain
      const p = this.player;
      const spd = 520;
      if (this.keys.ArrowLeft || this.keys.a) p.tx = p.x - spd * dt * 3;
      if (this.keys.ArrowRight || this.keys.d) p.tx = p.x + spd * dt * 3;
      p.tx = Math.max(p.w / 2, Math.min(this.W - p.w / 2, p.tx));
      const prevX = p.x;
      p.x += (p.tx - p.x) * Math.min(1, dt * (this.rush > 0 ? 20 : 14));
      p.tilt = Math.max(-0.3, Math.min(0.3, (p.x - prevX) * 0.02));

      // spawn
      this.spawnT -= dt;
      if (this.spawnT <= 0) {
        this.spawn();
        this.spawnT = Math.max(0.35, 0.95 - this.elapsed / 90) * (this.rush > 0 ? 0.55 : 1);
      }

      // item
      for (let i = this.items.length - 1; i >= 0; i--) {
        const it = this.items[i];
        it.y += it.vy * dt;
        it.wob += dt * 3;
        const ix = this.wobX(it);
        const hit = Math.abs(ix - p.x) < (it.w / 2 + p.w / 2 - 14) && Math.abs(it.y - p.y) < (it.h / 2 + p.h / 2 - 6);
        if (hit) { this.collect(it, ix); this.items.splice(i, 1); continue; }
        if (it.y - it.h > this.H) {
          if (it.type === "good") { this.streak = 0; this.combo = 1; }
          this.items.splice(i, 1);
        }
      }

      // partikel
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const q = this.particles[i];
        q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 400 * dt; q.life -= dt;
        if (q.life <= 0) this.particles.splice(i, 1);
      }
      for (let i = this.floaters.length - 1; i >= 0; i--) {
        const f = this.floaters[i];
        f.y -= 50 * dt; f.life -= dt;
        if (f.life <= 0) this.floaters.splice(i, 1);
      }
      // api Golden Rush: dari bawah layar dan dari kotak pemain
      if (this.rush > 0) {
        this.flames.push({ x: rand(0, this.W), y: this.H + 6, vx: rand(-15, 15), vy: rand(-170, -90), life: rand(.3, .7), max: .7, r: rand(4, 10) });
        if (Math.random() < .6) this.flames.push({ x: p.x + rand(-p.w / 2, p.w / 2), y: p.y + p.h / 2, vx: rand(-20, 20), vy: rand(-120, -60), life: rand(.2, .4), max: .4, r: rand(3, 6) });
      }
      for (let i = this.flames.length - 1; i >= 0; i--) {
        const f = this.flames[i];
        f.x += f.vx * dt; f.y += f.vy * dt; f.life -= dt;
        if (f.life <= 0) this.flames.splice(i, 1);
      }
      const starSpd = 1 + this.rushGlow * 5;
      this.stars.forEach((s) => { s.y += s.s * starSpd * dt; if (s.y > this.H) { s.y = 0; s.x = rand(0, this.W); } });
      this.updateHUD();
    },

    collect(it, x) {
      if (it.type === "good") {
        this.streak++;
        this.combo = Math.min(5, 1 + Math.floor(this.streak / 4));
        const pts = 10 * this.combo * (this.rush > 0 ? 2 : 1);
        this.score += pts;
        this.burst(x, it.y, ["#2ee6c5", "#ffd23f", "#ffffff"]);
        this.float(x, it.y, "+" + pts, "#2ee6c5");
        sfx.good();
        if (this.streak > 0 && this.streak % 4 === 0) toast(`🔥 Combo x${this.combo}!`);
      } else if (it.type === "gold") {
        this.streak++;
        this.combo = Math.min(5, 1 + Math.floor(this.streak / 4));
        const pts = 25 * this.combo * (this.rush > 0 ? 2 : 1);
        this.score += pts;
        this.burst(x, it.y, ["#ffd23f", "#fff3b0", "#ff9f1c", "#ffffff"]);
        this.burst(x, it.y, ["#ffd23f", "#ffffff"]);
        this.float(x, it.y, "+" + pts, "#ffd23f");
        sfx.gold();
        if (this.rush > 0) { this.rush = Math.min(RUSH_TIME + 4, this.rush + 2); toast("🔥 Rush +2 detik!"); }
        else if (++this.gold >= RUSH_NEED) this.startRush();
        else toast(`✨ Pesan Emas ${this.gold}/${RUSH_NEED}`);
      } else if (it.type === "bad") {
        if (this.rush > 0) { // Golden Rush: kebal, stereotip dibakar
          const pts = 10 * 2;
          this.score += pts;
          this.burst(x, it.y, ["#ff3d1f", "#ff8a00", "#ffd23f"]);
          this.float(x, it.y, "Dibakar! +" + pts, "#ff8a00");
          sfx.mid();
          return;
        }
        if (this.shield > 0) {
          this.score += 5;
          this.burst(x, it.y, ["#ffd23f", "#ffffff"]);
          this.float(x, it.y, "Ditangkis!", "#ffd23f");
          sfx.mid();
          return;
        }
        this.lives--;
        this.streak = 0; this.combo = 1;
        if (this.gold > 0) this.gold--; // satu segmen meteran Golden Rush hilang
        this.burst(x, it.y, ["#ff5c6c", "#ff9f1c"]);
        this.float(x, it.y, "−1 💔", "#ff5c6c");
        sfx.bad();
        this.shake = 0.3;
        toast("Stereotip! " + it.label + " ✗");
        if (this.lives <= 0) this.end("Nyawa habis!");
      } else {
        sfx.power();
        if (it.label === SHIELD_LABEL) { this.shield = 8; toast("🛡️ Perisai aktif 8 detik!"); }
        else { this.time += 5; toast("⏰ +5 detik!"); }
        this.burst(x, it.y, ["#ffd23f", "#9b5cff", "#ffffff"]);
      }
    },
    // pesan emas bergoyang lebih lebar agar lebih sulit ditangkap
    wobX(it) { return it.x + Math.sin(it.wob) * (it.type === "gold" ? 22 : 6); },

    startRush() {
      this.gold = 0;
      this.rush = RUSH_TIME;
      this.rushFlash = 1;
      this.shake = 0.25;
      $(".canvas-wrap").classList.add("rush");
      Music.setRush(true);
      sfx.rush();
      toast("🔥 GOLDEN RUSH! Skor x2 & kebal!");
    },
    endRush() {
      this.rush = 0;
      $(".canvas-wrap").classList.remove("rush");
      Music.setRush(false);
      sfx.rushEnd();
      toast("Golden Rush selesai");
    },
    burst(x, y, colors) {
      for (let i = 0; i < 18; i++) {
        const a = rand(0, Math.PI * 2), s = rand(80, 260);
        this.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 120, life: rand(.4, .8), c: pick(colors), r: rand(2, 5) });
      }
    },
    float(x, y, text, color) { this.floaters.push({ x, y, text, color, life: 0.9 }); },

    updateHUD() {
      $("#arc-score").textContent = this.score;
      $("#arc-time").textContent = Math.ceil(this.time);
      $("#arc-lives").textContent = this.lives > 0 ? "❤️".repeat(this.lives) : "💔";
      $("#arc-combo").textContent = "x" + this.combo * (this.rush > 0 ? 2 : 1);
      const meter = $("#rush-meter"), on = this.rush > 0;
      meter.classList.toggle("active", on);
      $("#rush-fill").style.width = (on ? Math.min(1, this.rush / RUSH_TIME) : this.gold / RUSH_NEED) * 100 + "%";
      $("#rush-label").textContent = on ? "🔥 GOLDEN RUSH x2" : "✨ Golden Rush";
      $("#rush-count").textContent = on ? Math.ceil(this.rush) + "s" : this.gold + "/" + RUSH_NEED;
    },

    roundRect(x, y, w, h, r) {
      const c = this.ctx;
      c.beginPath();
      c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
    },

    // Safari menggeser teks canvas yang memuat emoji dengan variation selector
    // (U+FE0F, mis. "❤️", "🛡️") keluar dari posisinya. Jadi label di canvas
    // hanya pakai emoji tanpa U+FE0F, dan selector yang tersisa dibuang di sini.
    centerText(text, x, y) {
      const c = this.ctx;
      text = text.replace(/\uFE0F/g, "");
      c.textAlign = "left";
      c.fillText(text, x - c.measureText(text).width / 2, y);
    },

    draw() {
      const c = this.ctx, W = this.W, H = this.H;
      if (!W) return;
      c.save();
      if (this.shake > 0) { this.shake -= 1 / 60; c.translate(rand(-6, 6), rand(-6, 6)); }

      // latar
      const g = c.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#2a1258"); g.addColorStop(1, "#0f2a4a");
      c.fillStyle = g; c.fillRect(-10, -10, W + 20, H + 20);
      const rg = this.rushGlow;
      if (rg > 0.01) {
        const fg = c.createLinearGradient(0, 0, 0, H);
        fg.addColorStop(0, `rgba(120,20,10,${0.75 * rg})`); fg.addColorStop(0.6, `rgba(200,60,10,${0.6 * rg})`); fg.addColorStop(1, `rgba(255,150,20,${0.75 * rg})`);
        c.fillStyle = fg; c.fillRect(-10, -10, W + 20, H + 20);
      }
      if (rg > 0.05) {
        // bintang jadi garis kecepatan saat Golden Rush
        c.strokeStyle = `rgba(255,220,150,${0.35 + 0.35 * rg})`; c.lineCap = "round";
        this.stars.forEach((s) => { c.lineWidth = s.r; c.beginPath(); c.moveTo(s.x, s.y); c.lineTo(s.x, s.y - s.s * rg * 0.8); c.stroke(); });
      } else {
        c.fillStyle = "rgba(255,255,255,.6)";
        this.stars.forEach((s) => { c.beginPath(); c.arc(s.x, s.y, s.r, 0, Math.PI * 2); c.fill(); });
      }

      // gedung sekolah di bawah
      c.fillStyle = "rgba(255,255,255,.05)";
      for (let i = 0; i < 6; i++) { const bw = W / 6; c.fillRect(i * bw + 6, H - 30 - (i % 3) * 18, bw - 12, 60); }

      // item
      this.items.forEach((it) => {
        const x = this.wobX(it);
        const colors = it.type === "good" ? ["#2ee6c5", "#1a9e8a"] : it.type === "bad" ? ["#ff5c6c", "#b3263a"]
          : it.type === "gold" ? ["#fff1a8", "#e8a000"] : ["#ffd23f", "#ff9f1c"];
        c.shadowColor = it.type === "gold" ? "#ffd23f" : colors[0];
        c.shadowBlur = it.type === "gold" ? 22 + Math.sin(it.wob * 2) * 8 : 16;
        const gg = c.createLinearGradient(0, it.y - it.h / 2, 0, it.y + it.h / 2);
        gg.addColorStop(0, colors[0]); gg.addColorStop(1, colors[1]);
        c.fillStyle = gg;
        this.roundRect(x - it.w / 2, it.y - it.h / 2, it.w, it.h, it.h / 2);
        c.fill();
        c.shadowBlur = 0;
        if (it.type === "gold") { // bingkai berkilau
          c.strokeStyle = `rgba(255,255,255,${0.55 + Math.sin(it.wob * 2) * 0.35})`; c.lineWidth = 2;
          this.roundRect(x - it.w / 2 + 1, it.y - it.h / 2 + 1, it.w - 2, it.h - 2, it.h / 2 - 1); c.stroke();
        }
        if (it.type === "bad") { // ekor gelembung chat
          c.beginPath(); c.moveTo(x - 8, it.y + it.h / 2 - 1); c.lineTo(x - 16, it.y + it.h / 2 + 9); c.lineTo(x + 2, it.y + it.h / 2 - 1); c.fill();
        }
        c.fillStyle = it.type === "power" || it.type === "gold" ? "#3a1d00" : "#ffffff";
        c.font = `800 ${it.fontSize}px Nunito, sans-serif`;
        c.textBaseline = "middle";
        this.centerText(it.label, x, it.y + 1);
      });

      // api Golden Rush
      if (this.flames.length) {
        c.save(); c.globalCompositeOperation = "lighter";
        this.flames.forEach((f) => {
          const t = Math.max(0, f.life / f.max);
          c.fillStyle = t > .6 ? `rgba(255,230,120,${t * .45})` : t > .3 ? `rgba(255,140,30,${t * .55})` : `rgba(230,50,20,${t * .7})`;
          c.beginPath(); c.arc(f.x, f.y, f.r * (0.4 + t), 0, Math.PI * 2); c.fill();
        });
        c.restore();
      }

      // pemain (kotak suara)
      const p = this.player;
      if (p) {
        c.save();
        c.translate(p.x, p.y); c.rotate(p.tilt);
        if (this.shield > 0) {
          c.strokeStyle = `rgba(255,210,63,${0.5 + Math.sin(performance.now() / 100) * 0.3})`;
          c.lineWidth = 4; c.beginPath(); c.ellipse(0, 0, p.w / 2 + 16, p.h / 2 + 22, 0, 0, Math.PI * 2); c.stroke();
        }
        const pg = c.createLinearGradient(-p.w / 2, 0, p.w / 2, 0);
        if (this.rush > 0) { pg.addColorStop(0, "#ffd23f"); pg.addColorStop(1, "#ff4d1f"); }
        else { pg.addColorStop(0, "#ff5fa2"); pg.addColorStop(1, "#9b5cff"); }
        c.fillStyle = pg; c.shadowColor = this.rush > 0 ? "#ff8a00" : "#ff5fa2"; c.shadowBlur = this.rush > 0 ? 32 : 20;
        this.roundRect(-p.w / 2, -p.h / 2, p.w, p.h, 10); c.fill();
        c.shadowBlur = 0;
        c.fillStyle = "rgba(0,0,0,.35)"; this.roundRect(-p.w / 4, -p.h / 2 + 4, p.w / 2, 5, 2); c.fill();
        c.fillStyle = "#ffffff"; c.font = "16px sans-serif"; c.textBaseline = "middle";
        this.centerText("⚖", 0, 4);
        c.restore();
      }

      // partikel & teks melayang
      this.particles.forEach((q) => { c.globalAlpha = Math.max(0, q.life * 1.5); c.fillStyle = q.c; c.beginPath(); c.arc(q.x, q.y, q.r, 0, Math.PI * 2); c.fill(); });
      c.globalAlpha = 1;
      this.floaters.forEach((f) => {
        c.globalAlpha = Math.max(0, f.life); c.fillStyle = f.color;
        c.font = "800 20px Fredoka, sans-serif"; this.centerText(f.text, f.x, f.y);
      });
      c.globalAlpha = 1;

      // kilatan & judul saat Golden Rush dimulai
      if (this.rushFlash > 0) {
        const f = this.rushFlash;
        c.fillStyle = `rgba(255,200,80,${Math.max(0, f - 0.6) * 1.2})`; c.fillRect(0, 0, W, H);
        c.globalAlpha = Math.min(1, f * 2);
        c.font = `800 ${Math.round(Math.min(44, W / 8) * (1 + (1 - f) * 0.3))}px Fredoka, sans-serif`;
        c.textBaseline = "middle"; c.fillStyle = "#fff3b0"; c.shadowColor = "#ff6a00"; c.shadowBlur = 24;
        this.centerText("GOLDEN RUSH!", W / 2, H * 0.4);
        c.shadowBlur = 0; c.globalAlpha = 1;
      }
      c.restore();
    },

    end(reason) {
      this.stop();
      $(".canvas-wrap").classList.remove("rush");
      Music.setRush(false);
      sfx.win();
      const s = this.score;
      let badge, rank, text;
      if (s >= 800) { badge = "🏆"; rank = "Legenda Kesetaraan"; text = `${reason} Refleksmu luar biasa! Kamu menangkap banyak nilai kesetaraan dan tak goyah oleh stereotip.`; }
      else if (s >= 450) { badge = "🥇"; rank = "Penjaga Keadilan"; text = `${reason} Keren! Kamu jago membedakan mana nilai yang membangun dan mana stereotip yang menjatuhkan.`; }
      else if (s >= 200) { badge = "🥈"; rank = "Pejuang Setara"; text = `${reason} Mantap! Latihan lagi untuk menembus papan skor teratas.`; }
      else { badge = "🌱"; rank = "Tunas Kesetaraan"; text = `${reason} Awal yang bagus! Ingat: hindari gelembung merah, tangkap yang hijau.`; }
      setTimeout(() => showResult({ mode: "arcade", score: s, badge, rank, text }), 400);
    }
  };

  /* ---------------- Toast ---------------- */
  let toastTimer = 0;
  function toast(msg) {
    const t = $("#arcade-toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 1400);
  }

  /* ---------------- Hasil & Papan Skor ---------------- */
  function showResult(r) {
    state.lastResult = r;
    $("#result-badge").textContent = r.badge;
    $("#result-rank").textContent = r.rank;
    $("#result-text").textContent = r.text;
    show("result");
    // animasi hitung skor
    const el = $("#result-score");
    const start = performance.now(), dur = 1200;
    const tick = (t) => {
      const k = Math.min(1, (t - start) / dur);
      el.textContent = Math.round(r.score * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    confetti(120);
    if (r.mode === "story") sfx.win();

    const key = "setara_board_" + r.mode;
    const board = store.get(key, []);
    board.push({ name: state.name, score: r.score, date: Date.now() });
    board.sort((a, b) => b.score - a.score);
    store.set(key, board.slice(0, 10));
    submitGlobal(r.mode, state.name, r.score);
  }

  /* ---- Papan skor global (Google Sheets + Apps Script) ---- */
  const GLOBAL_URL = (CFG.LEADERBOARD_URL || "").trim();

  function submitGlobal(mode, name, score) {
    if (!GLOBAL_URL) return;
    // text/plain menghindari CORS preflight yang tidak didukung Apps Script
    fetch(GLOBAL_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ mode, name, score })
    }).catch(() => { /* offline: skor lokal tetap tersimpan */ });
  }

  let boardReq = 0;
  async function renderBoard(mode) {
    $$(".tab").forEach((t) => t.classList.toggle("active", t.dataset.board === mode));
    const list = $("#board-list"), hint = $("#board-hint");
    const draw = (board) => {
      list.innerHTML = board.length
        ? board.map((b) => `<li><span>${escapeHTML(b.name)}</span><b>${Number(b.score) || 0}</b></li>`).join("")
        : `<li class="empty">Belum ada skor. Ayo jadi yang pertama! 🚀</li>`;
    };
    const local = () => { draw(store.get("setara_board_" + mode, [])); hint.textContent = "Skor disimpan di perangkat ini."; };

    if (!GLOBAL_URL) return local();
    const req = ++boardReq;
    list.innerHTML = `<li class="empty">Memuat skor global… ⏳</li>`;
    hint.textContent = "";
    try {
      const res = await fetch(GLOBAL_URL + (GLOBAL_URL.includes("?") ? "&" : "?") + "mode=" + mode);
      const data = await res.json();
      if (req !== boardReq) return; // tab sudah berganti
      draw(Array.isArray(data) ? data : []);
      hint.textContent = "🌍 Skor global dari semua pemain.";
    } catch {
      if (req !== boardReq) return;
      local();
      hint.textContent = "Gagal memuat skor global — menampilkan skor di perangkat ini.";
    }
  }

  async function share() {
    const r = state.lastResult || { score: 0, rank: "" };
    const text = `Aku dapat ${r.score} poin dan gelar "${r.rank}" di game SETARA! 🌈 Yuk main dan lawan stereotip gender di sekolah!`;
    const url = location.href.split("#")[0];
    try {
      if (navigator.share) { await navigator.share({ title: "SETARA: Misi Sekolah Adil", text, url }); return; }
      await navigator.clipboard.writeText(text + " " + url);
      alert("Teks & link berhasil disalin! Tempel di WA / IG story kamu ✨");
    } catch { /* dibatalkan pengguna */ }
  }

  /* ---------------- Event tombol ---------------- */
  const actions = {
    "start-story": () => { sfx.click(); Story.start(); },
    "start-arcade": () => { sfx.click(); Arcade.open(); },
    "arcade-go": () => Arcade.go(),
    "next-scene": () => Story.next(),
    "menu": () => { sfx.click(); show("menu"); },
    "leaderboard": () => { sfx.click(); renderBoard("story"); show("leaderboard"); },
    "about": () => { sfx.click(); show("about"); },
    "replay": () => { sfx.click(); state.lastResult && state.lastResult.mode === "arcade" ? Arcade.open() : Story.start(); },
    "share": () => share(),
    "toggle-sound": () => {
      state.soundOn = !state.soundOn;
      store.set("setara_sound", state.soundOn);
      $("#btn-sound").textContent = state.soundOn ? "🔊 Suara" : "🔇 Bisu";
      Music.setEnabled(state.musicOn);
      sfx.click();
    },
    "toggle-music": () => {
      state.musicOn = !state.musicOn;
      store.set("setara_music", state.musicOn);
      $("#btn-music").textContent = state.musicOn ? "🎵 Musik" : "🎵 Mati";
      Music.setEnabled(state.musicOn);
      sfx.click();
    }
  };

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (btn && actions[btn.dataset.action]) actions[btn.dataset.action]();
    const tab = e.target.closest("[data-board]");
    if (tab) { sfx.click(); renderBoard(tab.dataset.board); }
  });

  // Pintasan keyboard A/B/C di mode cerita
  document.addEventListener("keydown", (e) => {
    if (!$("#screen-story").classList.contains("active")) return;
    const i = { a: 0, b: 1, c: 2, 1: 0, 2: 1, 3: 2 }[e.key.toLowerCase()];
    const choices = $$("#choices .choice");
    if (i !== undefined && choices[i] && !choices[i].disabled) choices[i].click();
    if (e.key === "Enter" && !$("#feedback-card").classList.contains("hidden")) Story.next();
  });

  /* ---------------- Init ---------------- */
  state.soundOn = store.get("setara_sound", true);
  $("#btn-sound").textContent = state.soundOn ? "🔊 Suara" : "🔇 Bisu";
  state.musicOn = store.get("setara_music", true);
  $("#btn-music").textContent = state.musicOn ? "🎵 Musik" : "🎵 Mati";
  Music.setEnabled(state.musicOn);
  $("#player-name").value = store.get("setara_name", "");
  $("#player-name").addEventListener("input", (e) => store.set("setara_name", e.target.value.trim()));
  Arcade.init();
})();
