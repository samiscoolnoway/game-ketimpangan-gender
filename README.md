# 🌈 SETARA: Misi Sekolah Adil

Game web interaktif dan edukatif tentang **kesetaraan gender di sekolah**.
Dibuat dengan HTML, CSS, dan JavaScript murni: tanpa server, tanpa instalasi, dan bisa langsung di-hosting gratis di **GitHub Pages**.

## 🎮 Mode Permainan

| Mode | Isi |
|---|---|
| 📖 **Mode Cerita** | 10 situasi nyata di sekolah (piket, ketua kelas, ekskul, pelecehan verbal, meme di grup, cita-cita, dll). Setiap pilihan mengubah **Indeks Kesetaraan Sekolah** dan disertai fakta edukatif. |
| 🌟 **Mode Arcade** | Gerakkan kotak ⚖️ untuk menangkap nilai kesetaraan (hijau) dan menghindari gelembung stereotip (merah). Ada combo, perisai 🛡️, dan bonus waktu ⏰. |

Fitur lain: papan skor (lokal atau global), tombol bagikan ke WA/IG, efek suara, confetti, dan tampilan ramah HP.

Skenario Mode Cerita ada di `game.js` (bagian `SCENES`), dan kata-kata di Mode Arcade ada di `GOOD_ITEMS` / `BAD_ITEMS`.

## 🌍 Papan Skor Global (Google Sheets, gratis)

GitHub Pages hanya bisa menyajikan file statis, jadi skor semua pemain disimpan di **Google Sheets** lewat Apps Script.
Tanpa langkah ini, skor tetap berfungsi tetapi hanya tersimpan di perangkat masing-masing.

1. Buat Google Sheet baru (misal "Skor SETARA").
2. Di Sheet itu: **Ekstensi → Apps Script**. Hapus isi editor, lalu tempel seluruh isi file `leaderboard/apps-script.gs`. Klik 💾 Simpan.
3. Klik **Deploy → New deployment** → ikon ⚙️ → pilih **Web app**.
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Klik **Deploy**, izinkan akses (Advanced → Go to … → Allow), lalu salin **Web app URL** (berakhiran `/exec`).
5. Tempel URL tersebut di `config.js`:
   ```js
   window.CONFIG = {
     LEADERBOARD_URL: "https://script.google.com/macros/s/XXXX/exec"
   };
   ```
6. Commit & push. Selesai! Skor baru akan muncul sebagai baris di Sheet.

**Moderasi:** nama yang tidak pantas atau skor palsu cukup dihapus barisnya di Google Sheet.
**Catatan:** jika kode Apps Script diubah, buat versi baru lewat **Deploy → Manage deployments → Edit → New version** agar URL tetap sama.

## 🚀 Online-kan dengan GitHub Pages

1. Buka repo di GitHub → **Settings** → **Pages**.
2. Pada **Source**, pilih **Deploy from a branch**, branch **`main`**, folder **`/ (root)`**, lalu **Save**.
3. Tunggu 1–2 menit. Game bisa diakses di `https://<username>.github.io/<nama-repo>/`

## 🧪 Coba di Komputer Sendiri

```bash
python3 -m http.server 8000
# lalu buka http://localhost:8000
```
