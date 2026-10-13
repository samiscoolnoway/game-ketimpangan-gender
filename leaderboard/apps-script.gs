/**
 * Papan skor global untuk game SETARA.
 * Tempel kode ini di Google Sheets → Ekstensi → Apps Script, lalu deploy sebagai Web App
 * (Execute as: Me, Who has access: Anyone). Langkah lengkap ada di README.
 *
 * Kolom di sheet: Waktu | Nama | Mode | Skor
 * Hapus baris di sheet untuk menghapus nama/skor yang tidak pantas.
 */
const MAX_SCORE = 20000;
const TOP_N = 10;
const MODES = ["story", "arcade"];

function sheet_() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sh.getLastRow() === 0) sh.appendRow(["Waktu", "Nama", "Mode", "Skor"]);
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const mode = String(d.mode);
    const name = String(d.name || "Anonim").replace(/[\r\n\t]/g, " ").trim().slice(0, 16) || "Anonim";
    const score = Math.round(Number(d.score));
    if (MODES.indexOf(mode) === -1 || !isFinite(score) || score < 0 || score > MAX_SCORE) {
      return json_({ ok: false, error: "data tidak valid" });
    }
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      // awali "'" agar nama tidak dibaca sebagai rumus oleh Sheets
      sheet_().appendRow([new Date(), "'" + name, mode, score]);
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  const mode = (e && e.parameter && e.parameter.mode) || "story";
  const rows = sheet_().getDataRange().getValues().slice(1);
  const top = rows
    .filter(function (r) { return r[2] === mode && r[1] !== ""; })
    .map(function (r) { return { name: String(r[1]), score: Number(r[3]) || 0 }; })
    .sort(function (a, b) { return b.score - a.score; })
    .slice(0, TOP_N);
  return json_(top);
}
