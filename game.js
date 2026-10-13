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
    knock: () => { beep(170, .12, "square", .07, -110); setTimeout(() => beep(1250, .05, "triangle", .05), 15); },
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
     PERJALANAN (latar Mode Arcade)
     Seorang anak perempuan tumbuh dari TK sampai bekerja saat kamu terus
     menangkap nilai kesetaraan. Tiap jenjang menambah satu pendukung yang
     menyemangatinya. Kena stereotip: ia sedih dan mundur lagi ke TK.
     ========================================================= */
  const STAGES = [
    { name: "TK", icon: "🧸", need: 3, h: 0.22, head: 0.17, shirt: "#ff9ec7", skirt: "#ff6fae", hair: "pigtails", sock: "#ffffff", shoe: "#d94f8a", bag: "#ffd23f" },
    { name: "SD", icon: "🎒", need: 4, h: 0.26, head: 0.15, shirt: "#ffffff", skirt: "#d62839", hair: "pigtails", tie: "#d62839", sock: "#ffffff", shoe: "#222222", bag: "#26a6ff" },
    { name: "SMP", icon: "📘", need: 5, h: 0.30, head: 0.14, shirt: "#ffffff", skirt: "#1d3e8a", hair: "ponytail", tie: "#1d3e8a", sock: "#ffffff", shoe: "#222222" },
    { name: "SMA", icon: "📚", need: 6, h: 0.33, head: 0.13, shirt: "#ffffff", skirt: "#8d99ae", hair: "ponytail", tie: "#8d99ae", sock: "#ffffff", shoe: "#222222", hold: "book" },
    { name: "Kuliah", icon: "🎓", need: 7, h: 0.35, head: 0.125, shirt: "#ffffff", skirt: "#3a3a5a", jacket: "#f4b400", hair: "long", shoe: "#333333", hold: "book" },
    { name: "Kerja", icon: "💼", need: 0, h: 0.36, head: 0.12, shirt: "#e8f1ff", skirt: "#2b2d42", jacket: "#2b2d42", hair: "bun", lanyard: true, shoe: "#111111", hold: "case" }
  ];
  // Pendukung ke-i bergabung saat ia naik ke jenjang i+1.
  const SUPPORTERS = [
    { role: "Ibu", body: "#ff8fab", skin: "#e0ac69", hair: "#3b2416", long: true, h: 0.25, hello: "Ibu bangga!" },
    { role: "Guru", body: "#4cc9f0", skin: "#c68642", hair: "#1b1b1b", glasses: true, h: 0.27, hello: "Terus belajar!" },
    { role: "Sahabat", body: "#80ed99", skin: "#ffdbac", hair: "#5a3825", h: 0.23, hello: "Ayo bareng!" },
    { role: "Ayah", body: "#ffb703", skin: "#8d5524", hair: "#111111", h: 0.28, hello: "Kejar mimpimu!" },
    { role: "Mentor", body: "#c77dff", skin: "#f1c27d", hair: "#6b4226", long: true, glasses: true, h: 0.27, hello: "Kamu siap!" }
  ];
  const CHEERS = ["Semangat!", "Kamu bisa!", "Ayo terus!", "Hebat!", "Jangan menyerah!", "Keren!"];
  const SLOTS = [-1.1, 1.1, -2.0, 2.0, -2.9];

  const Journey = {
    stage: 0, prog: 0, shown: 0, stepT: 0, size: 0,
    sadT: 0, cheerT: 0, popT: 0, t: 0, bubbleT: 2, bubble: null, sparks: [], crew: [],

    reset() {
      this.stage = 0; this.prog = 0; this.shown = 0; this.stepT = 0; this.size = 0;
      this.sadT = 0; this.cheerT = 0; this.popT = 0; this.bubbleT = 2; this.bubble = null; this.sparks = [];
      this.crew = SUPPORTERS.map((s, i) => ({ ...s, a: 0, phase: i * 1.7 }));
    },

    gain(n) {
      this.cheerT = 0.9;
      if (this.sadT > 0.6) this.sadT = 0.6; // tangkapan baik menghiburnya
      if (this.stage >= STAGES.length - 1) return;
      this.prog += n;
      while (this.stage < STAGES.length - 1 && this.prog >= STAGES[this.stage].need) {
        this.prog -= STAGES[this.stage].need;
        this.stage++;
        const st = STAGES[this.stage];
        toast(`${st.icon} Naik ke ${st.name}!`);
        sfx.power();
      }
      if (this.stage === STAGES.length - 1) this.prog = 0;
    },

    fail() {
      this.sadT = 2.4;
      this.cheerT = 0;
      this.bubble = null;
      if (this.stage === 0 && this.shown === 0) return;
      this.stage = 0; this.prog = 0;
      this.stepT = 0.35; // jeda sebelum mulai mundur jenjang
    },

    update(dt, H) {
      this.t += dt;
      if (this.sadT > 0) this.sadT -= dt;
      if (this.cheerT > 0) this.cheerT -= dt;
      if (this.popT > 0) this.popT = Math.max(0, this.popT - dt * 1.4);

      // tampilan jenjang menyusul logika: naik langsung (dengan efek), turun satu per satu
      if (this.shown < this.stage) { this.shown = this.stage; this.evolveFx(); }
      else if (this.shown > this.stage) {
        this.stepT -= dt;
        if (this.stepT <= 0) { this.shown--; this.stepT = 0.22; this.poofFx(); }
      }
      const target = STAGES[this.shown].h * H;
      this.size = this.size ? this.size + (target - this.size) * Math.min(1, dt * 6) : target;

      this.crew.forEach((s, i) => {
        const want = i < this.shown ? 1 : 0;
        const prev = s.a;
        s.a += (want - s.a) * Math.min(1, dt * (want ? 3 : 5));
        if (want && prev < 0.05 && s.a >= 0.05) this.bubble = { i, text: s.hello, life: 1.8 };
      });

      if (this.bubble) { this.bubble.life -= dt; if (this.bubble.life <= 0) this.bubble = null; }
      this.bubbleT -= dt;
      if (this.bubbleT <= 0 && !this.bubble && this.shown > 0 && this.sadT <= 0) {
        this.bubble = { i: Math.floor(Math.random() * this.shown), text: pick(CHEERS), life: 1.6 };
        this.bubbleT = rand(2.2, 3.5);
      }

      for (let i = this.sparks.length - 1; i >= 0; i--) {
        const q = this.sparks[i];
        q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 120 * dt; q.life -= dt;
        if (q.life <= 0) this.sparks.splice(i, 1);
      }
    },

    evolveFx() {
      this.popT = 1;
      for (let i = 0; i < 26; i++) {
        const a = rand(0, Math.PI * 2), s = rand(40, 160);
        this.sparks.push({ x: 0, y: -this.size * 0.5, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 60, life: rand(.5, 1), c: pick(["#ffd23f", "#2ee6c5", "#ffffff", "#ff9ec7"]) });
      }
    },
    poofFx() {
      for (let i = 0; i < 10; i++) {
        const a = rand(0, Math.PI * 2), s = rand(20, 70);
        this.sparks.push({ x: rand(-20, 20), y: -this.size * 0.4, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rand(.3, .6), c: "#9fb3c8" });
      }
    },

    /* ---------- gambar ---------- */
    draw(c, W, H) {
      const cx = W / 2, gy = H - 84, t = this.t; // berdiri di atas jalur kotak pemain
      if (!this.size) this.size = STAGES[this.shown].h * H;
      const sad = this.sadT > 0, cheer = this.cheerT > 0 && !sad;
      this.drawScenery(c, W, H);

      // panggung tempat ia berdiri
      c.fillStyle = "rgba(255,255,255,.07)"; Arcade.roundRect(cx - W * 0.42, gy - 2, W * 0.84, 6, 3); c.fill();

      c.save();
      c.globalAlpha = 0.5;
      // pendukung
      const gap = Math.min(W * 0.14, 80);
      this.crew.forEach((s, i) => {
        if (s.a < 0.01) return;
        const leaving = i >= this.shown;
        const sc = leaving ? s.a : 1 + Math.sin(Math.min(1, s.a) * Math.PI) * 0.25 * (1 - s.a);
        const x = cx + SLOTS[i] * gap;
        c.save();
        c.globalAlpha = 0.5 * Math.min(1, s.a);
        c.translate(x, gy + (leaving ? (1 - s.a) * 30 : 0));
        c.scale(sc, sc);
        this.drawPerson(c, s, s.h * H, t, (cheer || this.popT > 0) && !leaving, sad);
        c.restore();
      });

      // kilau saat naik jenjang
      if (this.popT > 0) {
        const rg = c.createRadialGradient(cx, gy - this.size * 0.5, 0, cx, gy - this.size * 0.5, this.size * 0.9);
        rg.addColorStop(0, `rgba(255,240,170,${0.7 * this.popT})`); rg.addColorStop(1, "rgba(255,240,170,0)");
        c.fillStyle = rg; c.fillRect(cx - this.size, gy - this.size * 1.5, this.size * 2, this.size * 1.6);
      }

      // tokoh utama
      c.save();
      c.translate(cx, gy);
      const pop = 1 + Math.sin(this.popT * Math.PI) * 0.12;
      c.scale(pop, pop);
      this.drawGirl(c, STAGES[this.shown], this.size, t, cheer, sad);
      c.restore();
      c.restore();

      // partikel latar
      this.sparks.forEach((q) => {
        c.globalAlpha = Math.max(0, Math.min(1, q.life * 1.5)) * 0.8; c.fillStyle = q.c;
        c.beginPath(); c.arc(cx + q.x, gy + q.y, 2.5, 0, Math.PI * 2); c.fill();
      });
      c.globalAlpha = 1;

      // gelembung semangat
      if (this.bubble && this.crew[this.bubble.i]) {
        const s = this.crew[this.bubble.i];
        const x = cx + SLOTS[this.bubble.i] * gap, y = gy - s.h * H - 16;
        c.globalAlpha = Math.min(1, this.bubble.life * 3) * 0.9;
        c.font = "800 12px Nunito, sans-serif";
        const tw = c.measureText(this.bubble.text).width + 16;
        const bx = Math.max(4, Math.min(W - tw - 4, x - tw / 2));
        c.fillStyle = "#ffffff";
        Arcade.roundRect(bx, y - 22, tw, 22, 11); c.fill();
        c.beginPath(); c.moveTo(x - 5, y - 1); c.lineTo(x, y + 6); c.lineTo(x + 5, y - 1); c.fill();
        c.fillStyle = "#3a1d6e"; c.textBaseline = "middle";
        Arcade.centerText(this.bubble.text, bx + tw / 2, y - 11);
        c.globalAlpha = 1;
      }

      // teks sedih
      if (sad && this.sadT > 1) {
        c.globalAlpha = Math.min(1, (this.sadT - 1) * 2) * 0.85;
        c.font = "800 13px Nunito, sans-serif"; c.fillStyle = "#cfe3ff"; c.textBaseline = "middle";
        Arcade.centerText("Yah... kembali ke TK", cx, gy - this.size - 34);
        c.globalAlpha = 1;
      }

      this.drawBadge(c);
    },

    drawBadge(c) {
      const st = STAGES[this.shown];
      const last = this.stage >= STAGES.length - 1;
      c.save();
      c.globalAlpha = 0.92;
      c.font = "800 13px Nunito, sans-serif";
      const label = `${st.icon} ${st.name}`;
      const dotsX = 18 + c.measureText(label).width + 10, bw = dotsX + STAGES.length * 7 + 6;
      c.fillStyle = "rgba(0,0,0,.35)";
      Arcade.roundRect(10, 10, bw, 38, 12); c.fill();
      c.fillStyle = "#ffffff"; c.textBaseline = "middle"; c.textAlign = "left";
      c.fillText(label, 18, 22);
      // titik jenjang
      for (let i = 0; i < STAGES.length; i++) {
        c.fillStyle = i <= this.shown ? "#ffd23f" : "rgba(255,255,255,.25)";
        c.beginPath(); c.arc(dotsX + 3 + i * 7, 22, 2.6, 0, Math.PI * 2); c.fill();
      }
      // progres ke jenjang berikutnya
      const pw = bw - 16;
      c.fillStyle = "rgba(255,255,255,.2)"; Arcade.roundRect(18, 36, pw, 5, 2.5); c.fill();
      const f = last ? 1 : this.prog / STAGES[this.stage].need;
      if (f > 0) { c.fillStyle = last ? "#ffd23f" : "#2ee6c5"; Arcade.roundRect(18, 36, pw * f, 5, 2.5); c.fill(); }
      c.restore();
    },

    drawScenery(c, W, H) {
      const s = this.shown;
      c.save();
      c.fillStyle = "rgba(255,255,255,.06)";
      if (s === 0) {
        // rumah & taman bermain
        for (let i = 0; i < 4; i++) {
          const x = i * W / 4 + 14, w = W / 4 - 28, top = H - 52;
          c.fillRect(x, top, w, 60);
          c.beginPath(); c.moveTo(x - 6, top); c.lineTo(x + w / 2, top - 22); c.lineTo(x + w + 6, top); c.fill();
        }
      } else if (s <= 3) {
        // sekolah dengan tiang bendera
        const bw = W * 0.7, x = (W - bw) / 2, top = H - 70 - s * 12;
        c.fillRect(x, top, bw, 90);
        c.beginPath(); c.moveTo(x - 10, top); c.lineTo(W / 2, top - 26); c.lineTo(x + bw + 10, top); c.fill();
        c.fillRect(x - 30, top - 50, 3, 140);
        c.fillStyle = "rgba(214,40,57,.35)"; c.fillRect(x - 27, top - 50, 22, 7);
        c.fillStyle = "rgba(255,255,255,.3)"; c.fillRect(x - 27, top - 43, 22, 7);
      } else if (s === 4) {
        // kampus berpilar
        const bw = W * 0.8, x = (W - bw) / 2, top = H - 130;
        c.fillRect(x, top + 16, bw, 140);
        c.beginPath(); c.moveTo(x - 8, top + 16); c.lineTo(W / 2, top - 22); c.lineTo(x + bw + 8, top + 16); c.fill();
        c.fillStyle = "rgba(255,255,255,.05)";
        for (let i = 0; i < 7; i++) c.fillRect(x + 12 + i * (bw - 24) / 6.5, top + 26, 8, 120);
      } else {
        // gedung kantor
        for (let i = 0; i < 5; i++) {
          const bw = W / 5, x = i * bw + 6, hh = 120 + ((i * 47) % 90);
          c.fillStyle = "rgba(255,255,255,.06)"; c.fillRect(x, H - hh, bw - 12, hh);
          c.fillStyle = "rgba(255,230,150,.08)";
          for (let r = 0; r < hh / 18 - 1; r++) for (let k = 0; k < 3; k++) c.fillRect(x + 6 + k * (bw - 24) / 3, H - hh + 8 + r * 18, 6, 8);
        }
      }
      c.restore();
    },

    limb(c, x1, y1, x2, y2, w, color) {
      c.strokeStyle = color; c.lineWidth = w; c.lineCap = "round";
      c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
    },

    // Origin di kaki (0,0), y ke atas negatif.
    drawGirl(c, st, s, t, cheer, sad) {
      const skin = "#f3c9a0", hair = "#3b2416";
      const bob = cheer ? -Math.abs(Math.sin(t * 9)) * s * 0.06 : Math.sin(t * 2) * s * 0.008;
      const r = st.head * s;
      const hipY = -s * 0.36 + bob, waistY = -s * 0.48 + bob, shY = -s * 0.70 + bob;
      const hx = 0, hy = shY - r * 0.92 + (sad ? r * 0.12 : 0);
      const bw = s * 0.24;

      // rambut belakang
      c.fillStyle = hair;
      if (st.hair === "long") { Arcade.roundRect(hx - r * 1.05, hy - r * 0.2, r * 2.1, r * 2.3, r * 0.6); c.fill(); }
      if (st.hair === "ponytail") {
        const sw = Math.sin(t * 3) * r * 0.15;
        c.beginPath(); c.ellipse(hx + r * 0.95 + sw, hy + r * 0.3, r * 0.35, r * 0.8, 0.3, 0, Math.PI * 2); c.fill();
      }
      if (st.hair === "pigtails") {
        [-1, 1].forEach((d) => { c.beginPath(); c.ellipse(hx + d * r * 1.1, hy + r * 0.25 + Math.sin(t * 4 + d) * r * 0.05, r * 0.32, r * 0.5, d * 0.3, 0, Math.PI * 2); c.fill(); });
      }
      if (st.hair === "bun") { c.beginPath(); c.arc(hx, hy - r * 1.05, r * 0.38, 0, Math.PI * 2); c.fill(); }

      // tas punggung
      if (st.bag) { c.fillStyle = st.bag; Arcade.roundRect(-bw * 0.75, shY + s * 0.02, bw * 1.5, s * 0.2, s * 0.04); c.fill(); }

      // kaki
      [-1, 1].forEach((d) => {
        this.limb(c, d * s * 0.05, hipY, d * s * 0.05, -s * 0.03, s * 0.055, skin);
        if (st.sock) this.limb(c, d * s * 0.05, -s * 0.12, d * s * 0.05, -s * 0.03, s * 0.058, st.sock);
        c.fillStyle = st.shoe; c.beginPath(); c.ellipse(d * s * 0.06, -s * 0.015, s * 0.05, s * 0.025, 0, 0, Math.PI * 2); c.fill();
      });

      // rok
      const pencil = st.name === "Kerja";
      const skB = hipY + s * 0.05, topW = bw * 0.9, botW = pencil ? bw * 0.95 : bw * 1.4;
      c.fillStyle = st.skirt;
      c.beginPath(); c.moveTo(-topW / 2, waistY); c.lineTo(topW / 2, waistY); c.lineTo(botW / 2, skB); c.lineTo(-botW / 2, skB); c.closePath(); c.fill();

      // badan
      c.fillStyle = st.shirt; Arcade.roundRect(-bw / 2, shY, bw, waistY - shY + 2, s * 0.04); c.fill();
      if (st.tie) { c.fillStyle = st.tie; c.beginPath(); c.moveTo(-s * 0.02, shY + 2); c.lineTo(s * 0.02, shY + 2); c.lineTo(0, shY + s * 0.12); c.closePath(); c.fill(); }
      if (st.jacket) {
        c.fillStyle = st.jacket;
        Arcade.roundRect(-bw / 2 - 1, shY, bw * 0.34, waistY - shY + s * 0.03, s * 0.03); c.fill();
        Arcade.roundRect(bw / 2 - bw * 0.34 + 1, shY, bw * 0.34, waistY - shY + s * 0.03, s * 0.03); c.fill();
      }
      if (st.bag) { c.strokeStyle = st.bag; c.lineWidth = s * 0.02; [-1, 1].forEach((d) => { c.beginPath(); c.moveTo(d * bw * 0.3, shY); c.lineTo(d * bw * 0.25, waistY); c.stroke(); }); }
      if (st.lanyard) {
        c.strokeStyle = "#26a6ff"; c.lineWidth = s * 0.012;
        c.beginPath(); c.moveTo(-s * 0.04, shY); c.lineTo(0, shY + s * 0.1); c.lineTo(s * 0.04, shY); c.stroke();
        c.fillStyle = "#ffffff"; c.fillRect(-s * 0.025, shY + s * 0.1, s * 0.05, s * 0.06);
      }

      // lengan
      const sleeve = st.jacket || st.shirt, armL = s * 0.27;
      [-1, 1].forEach((d) => {
        let a;
        if (cheer) a = 2.5 + Math.sin(t * 12 + d) * 0.25;
        else if (sad) a = 0.06;
        else a = 0.18 + Math.sin(t * 2 + d) * 0.05;
        const sx = d * bw * 0.45, sy = shY + s * 0.03;
        const ex = sx + d * Math.sin(a) * armL, ey = sy + Math.cos(a) * armL;
        this.limb(c, sx, sy, ex, ey, s * 0.055, sleeve);
        c.fillStyle = skin; c.beginPath(); c.arc(ex, ey, s * 0.03, 0, Math.PI * 2); c.fill();
        if (!cheer && d === 1 && st.hold === "book") { c.fillStyle = "#4361ee"; c.fillRect(ex - s * 0.02, ey - s * 0.07, s * 0.08, s * 0.1); }
        if (!cheer && d === 1 && st.hold === "case") { c.fillStyle = "#6b4226"; Arcade.roundRect(ex - s * 0.06, ey, s * 0.12, s * 0.08, s * 0.01); c.fill(); }
      });

      // kepala
      c.fillStyle = skin; c.beginPath(); c.arc(hx, hy, r, 0, Math.PI * 2); c.fill();
      c.fillStyle = hair; c.beginPath(); c.arc(hx, hy - r * 0.08, r * 1.04, Math.PI * 1.02, Math.PI * 1.98); c.closePath(); c.fill();
      c.beginPath(); c.ellipse(hx - r * 0.35, hy - r * 0.45, r * 0.55, r * 0.3, -0.4, 0, Math.PI * 2); c.fill();

      // wajah
      const ey = hy + r * 0.12;
      c.fillStyle = "#2b1a12"; c.strokeStyle = "#2b1a12"; c.lineWidth = Math.max(1.2, r * 0.09); c.lineCap = "round";
      if (cheer) {
        [-1, 1].forEach((d) => { c.beginPath(); c.arc(hx + d * r * 0.38, ey + r * 0.05, r * 0.14, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); });
      } else {
        [-1, 1].forEach((d) => { c.beginPath(); c.arc(hx + d * r * 0.38, ey, r * 0.1, 0, Math.PI * 2); c.fill(); });
      }
      if (sad) {
        [-1, 1].forEach((d) => { c.beginPath(); c.moveTo(hx + d * r * 0.2, ey - r * 0.32); c.lineTo(hx + d * r * 0.55, ey - r * 0.2); c.stroke(); });
        c.beginPath(); c.arc(hx, ey + r * 0.6, r * 0.22, Math.PI * 1.15, Math.PI * 1.85); c.stroke();
        const ty = (t * 1.6) % 1;
        c.fillStyle = "#7cc6ff";
        [-1, 1].forEach((d) => { c.beginPath(); c.ellipse(hx + d * r * 0.42, ey + r * 0.2 + ty * r * 0.7, r * 0.07, r * 0.11, 0, 0, Math.PI * 2); c.fill(); });
      } else {
        c.beginPath(); c.arc(hx, ey + r * 0.22, r * (cheer ? 0.3 : 0.24), Math.PI * 0.15, Math.PI * 0.85); c.stroke();
        c.fillStyle = "rgba(255,120,140,.45)";
        [-1, 1].forEach((d) => { c.beginPath(); c.arc(hx + d * r * 0.6, ey + r * 0.3, r * 0.13, 0, Math.PI * 2); c.fill(); });
      }
    },

    drawPerson(c, p, h, t, cheer, sad) {
      const bob = cheer ? -Math.abs(Math.sin(t * 8 + p.phase)) * h * 0.06 : Math.sin(t * 1.5 + p.phase) * h * 0.01;
      const r = h * 0.12, shY = -h * 0.72 + bob, waistY = -h * 0.4 + bob, bw = h * 0.26;
      [-1, 1].forEach((d) => this.limb(c, d * h * 0.05, waistY, d * h * 0.05, -h * 0.02, h * 0.06, "#2b2d42"));
      if (p.long) { c.fillStyle = p.hair; Arcade.roundRect(-r * 1.05, shY - r * 1.9, r * 2.1, r * 2.4, r * 0.6); c.fill(); }
      c.fillStyle = p.body; Arcade.roundRect(-bw / 2, shY, bw, waistY - shY + h * 0.04, h * 0.05); c.fill();
      [-1, 1].forEach((d) => {
        const a = cheer ? 2.6 + Math.sin(t * 11 + p.phase + d) * 0.3 : sad ? 0.05 : (d === 1 ? 0.2 + Math.max(0, Math.sin(t * 3 + p.phase)) * 1.6 : 0.15);
        const sx = d * bw * 0.45, sy = shY + h * 0.03, L = h * 0.27;
        const ex = sx + d * Math.sin(a) * L, ey = sy + Math.cos(a) * L;
        this.limb(c, sx, sy, ex, ey, h * 0.055, p.body);
        c.fillStyle = p.skin; c.beginPath(); c.arc(ex, ey, h * 0.03, 0, Math.PI * 2); c.fill();
      });
      const hy = shY - r * 0.95;
      c.fillStyle = p.skin; c.beginPath(); c.arc(0, hy, r, 0, Math.PI * 2); c.fill();
      c.fillStyle = p.hair; c.beginPath(); c.arc(0, hy - r * 0.1, r * 1.04, Math.PI * 1.02, Math.PI * 1.98); c.closePath(); c.fill();
      c.fillStyle = "#2b1a12"; c.strokeStyle = "#2b1a12"; c.lineWidth = Math.max(1, r * 0.1); c.lineCap = "round";
      [-1, 1].forEach((d) => { c.beginPath(); c.arc(d * r * 0.36, hy + r * 0.1, r * 0.09, 0, Math.PI * 2); c.fill(); });
      if (p.glasses) { c.lineWidth = Math.max(1, r * 0.07); [-1, 1].forEach((d) => { c.beginPath(); c.arc(d * r * 0.36, hy + r * 0.1, r * 0.22, 0, Math.PI * 2); c.stroke(); }); c.lineWidth = Math.max(1, r * 0.1); }
      c.beginPath();
      if (sad) c.arc(0, hy + r * 0.62, r * 0.2, Math.PI * 1.2, Math.PI * 1.8);
      else c.arc(0, hy + r * 0.25, r * (cheer ? 0.3 : 0.22), Math.PI * 0.15, Math.PI * 0.85);
      c.stroke();
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
    gold: 0, rush: 0, rushGlow: 0, rushFlash: 0, flames: [], grace: 0, impacts: [], knockSfxT: 0,
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
      this.grace = 0; this.impacts = []; this.knockSfxT = 0;
      Journey.reset();
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
        wob: rand(0, Math.PI * 2), vx: 0, sq: 0, kcd: 0
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
      if (this.grace > 0) this.grace -= dt;
      if (this.knockSfxT > 0) this.knockSfxT -= dt;
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
        it.x += it.vx * dt;
        it.vx *= Math.max(0, 1 - dt * 2.5);
        if (it.sq > 0) it.sq = Math.max(0, it.sq - dt * 4);
        if (it.kcd > 0) it.kcd -= dt;
        const half = it.w / 2 + (it.type === "gold" ? 22 : 6);
        if (it.x < half) { it.x = half; it.vx = Math.abs(it.vx) * 0.6; }
        if (it.x > this.W - half) { it.x = this.W - half; it.vx = -Math.abs(it.vx) * 0.6; }
        const ix = this.wobX(it);
        const hit = Math.abs(ix - p.x) < (it.w / 2 + p.w / 2 - 14) && Math.abs(it.y - p.y) < (it.h / 2 + p.h / 2 - 6);
        if (hit) { this.collect(it, ix); this.items.splice(i, 1); continue; }
        if (it.y - it.h > this.H) {
          if (it.type === "good") { this.streak = 0; this.combo = 1; }
          this.items.splice(i, 1);
        }
      }

      this.knockback();
      for (let i = this.impacts.length - 1; i >= 0; i--) {
        this.impacts[i].t += dt;
        if (this.impacts[i].t > 0.45) this.impacts.splice(i, 1);
      }
      Journey.update(dt, this.H);

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
        Journey.gain(this.rush > 0 ? 2 : 1);
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
        Journey.gain(this.rush > 0 ? 4 : 2);
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
        if (this.shield > 0 || this.grace > 0) {
          this.score += 5;
          this.burst(x, it.y, ["#ffd23f", "#ffffff"]);
          this.float(x, it.y, "Ditangkis!", "#ffd23f");
          sfx.mid();
          return;
        }
        this.lives--;
        this.streak = 0; this.combo = 1;
        if (this.gold > 0) this.gold--; // satu segmen meteran Golden Rush hilang
        Journey.fail();
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
    // Pesan yang saling bertabrakan tidak menumpuk: keduanya terpental.
    knockback() {
      const its = this.items;
      for (let i = 0; i < its.length; i++) {
        for (let j = i + 1; j < its.length; j++) {
          const a = its[i], b = its[j];
          const dx = this.wobX(a) - this.wobX(b), dy = a.y - b.y;
          const penX = (a.w + b.w) / 2 + 4 - Math.abs(dx), penY = (a.h + b.h) / 2 + 4 - Math.abs(dy);
          if (penX <= 0 || penY <= 0) continue;
          const dir = dx === 0 ? (Math.random() < .5 ? -1 : 1) : Math.sign(dx);
          if (penY < penX) {
            // tabrakan atas-bawah: yang di atas terdorong naik dan ikut melambat
            const up = a.y < b.y ? a : b, low = up === a ? b : a;
            up.y -= penY;
            up.vy = Math.min(up.vy, low.vy * 0.95);
          } else {
            a.x += dir * penX / 2; b.x -= dir * penX / 2;
          }
          const fresh = a.kcd <= 0 || b.kcd <= 0;
          a.vx = dir * Math.max(Math.abs(a.vx), 170); b.vx = -dir * Math.max(Math.abs(b.vx), 170);
          if (fresh) {
            a.sq = b.sq = 1; a.kcd = b.kcd = 0.35;
            const cx = (this.wobX(a) + this.wobX(b)) / 2, cy = (a.y + b.y) / 2;
            this.impacts.push({ x: cx, y: cy, t: 0, word: Math.random() < .5 ? pick(["POW!", "BAM!", "DUAK!"]) : "" });
            for (let k = 0; k < 10; k++) {
              const ang = rand(0, Math.PI * 2), sp = rand(90, 220);
              this.particles.push({ x: cx, y: cy, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 60, life: rand(.25, .5), c: pick(["#ffffff", "#fff3b0", "#9fd8ff"]), r: rand(1.5, 3.5) });
            }
            if (this.knockSfxT <= 0) { sfx.knock(); this.knockSfxT = 0.08; }
          }
        }
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
      this.grace = 3; // waktu pulih: kebal 3 detik setelah Golden Rush
      sfx.rushEnd();
      toast("✨ Rush selesai, kebal 3 detik!");
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
      $("#rush-label").textContent = on ? "🔥 GOLDEN RUSH x2" : this.grace > 0 ? "✨ Kebal " + Math.ceil(this.grace) + "s" : "✨ Golden Rush";
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

      // latar perjalanan: lingkungan, tokoh, dan para pendukungnya
      Journey.draw(c, W, H);

      // item
      this.items.forEach((it) => {
        const x = this.wobX(it);
        c.save();
        if (it.sq > 0) { // efek gepeng saat terpental
          c.translate(x, it.y); c.scale(1 + it.sq * 0.2, 1 - it.sq * 0.18); c.translate(-x, -it.y);
        }
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
        c.restore();
      });

      // efek benturan antarpesan
      this.impacts.forEach((m) => {
        const k = m.t / 0.45, a = 1 - k;
        c.strokeStyle = `rgba(255,255,255,${a})`; c.lineWidth = 3 * a + 1;
        c.beginPath(); c.arc(m.x, m.y, 6 + k * 46, 0, Math.PI * 2); c.stroke();
        c.strokeStyle = `rgba(255,243,176,${a})`; c.lineWidth = 2;
        for (let r = 0; r < 8; r++) {
          const ang = r * Math.PI / 4 + 0.3;
          c.beginPath();
          c.moveTo(m.x + Math.cos(ang) * (10 + k * 26), m.y + Math.sin(ang) * (10 + k * 26));
          c.lineTo(m.x + Math.cos(ang) * (18 + k * 44), m.y + Math.sin(ang) * (18 + k * 44));
          c.stroke();
        }
        if (m.word && k < 0.8) {
          c.save();
          c.translate(m.x, m.y - 18 - k * 12); c.rotate(-0.15); c.scale(1 + (1 - k) * 0.3, 1 + (1 - k) * 0.3);
          c.globalAlpha = a; c.font = "800 16px Fredoka, sans-serif"; c.textBaseline = "middle";
          c.lineWidth = 4; c.strokeStyle = "#ff6a00"; c.textAlign = "center";
          c.strokeText(m.word, 0, 0); c.fillStyle = "#fff3b0"; c.fillText(m.word, 0, 0);
          c.restore();
        }
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
        if (this.grace > 0 && this.shield <= 0) { // kebal sesudah Golden Rush: berkedip
          c.globalAlpha = 0.55 + 0.45 * Math.abs(Math.sin(performance.now() / 70));
          c.strokeStyle = "rgba(255,243,176,.9)"; c.lineWidth = 3; c.setLineDash([6, 5]);
          c.beginPath(); c.ellipse(0, 0, p.w / 2 + 14, p.h / 2 + 18, 0, 0, Math.PI * 2); c.stroke();
          c.setLineDash([]);
        }
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
