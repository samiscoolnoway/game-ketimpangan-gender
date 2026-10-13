# 🌈 SETARA: Misi Sekolah Adil

Game web interaktif bertema **kesetaraan gender di sekolah** untuk kampanye Pemira MPK & OSIS.
Dibuat dengan HTML, CSS, dan JavaScript murni: tanpa server, tanpa instalasi, dan bisa langsung di-hosting gratis di **GitHub Pages**.

## 🎮 Mode Permainan

| Mode | Isi |
|---|---|
| 📖 **Mode Cerita** | 10 situasi nyata di sekolah (piket, ketua kelas, ekskul, pelecehan verbal, meme di grup, cita-cita, dll). Setiap pilihan mengubah **Indeks Kesetaraan Sekolah** dan disertai fakta edukatif. |
| 🌟 **Mode Arcade** | Gerakkan kotak suara ⚖️ untuk menangkap nilai kesetaraan (hijau) dan menghindari gelembung stereotip (merah). Ada combo, perisai 🛡️, dan bonus waktu ⏰. |

Fitur lain: papan skor (tersimpan di perangkat), tombol bagikan ke WA/IG, efek suara, confetti, tampilan ramah HP, serta layar hasil yang menampilkan **nomor, nama, slogan, dan program kerja paslon**.

## ✏️ Ganti Data Paslon

Cukup edit file **`config.js`**:

```js
window.CONFIG = {
  nomor: "01",
  namaPaslon: "Raka & Nadia",
  slogan: "\"Sekolah Setara, Semua Berkarya\"",
  program: [ "...", "..." ]
};
```

Skenario Mode Cerita ada di `game.js` (bagian `SCENES`), dan kata-kata di Mode Arcade ada di `GOOD_ITEMS` / `BAD_ITEMS`.

## 🚀 Online-kan dengan GitHub Pages

1. Buka repo ini di GitHub → **Settings** → **Pages**.
2. Pada **Source**, pilih **Deploy from a branch**.
3. Pilih branch **`main`** dan folder **`/ (root)`**, lalu **Save**.
4. Tunggu 1–2 menit. Game bisa diakses di:
   `https://<username>.github.io/<nama-repo>/`

> Catatan: GitHub Pages pada akun gratis hanya untuk repo **public**.

## 🧪 Coba di Komputer Sendiri

Buka `index.html` langsung di browser, atau jalankan:

```bash
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

## ⚠️ Etika Kampanye

Pastikan penggunaan game ini sesuai aturan Pemira di sekolah kalian (misalnya masa kampanye dan media yang diizinkan panitia).
