/**
 * Kiểm tra ngân sách kích thước bundle — chạy sau `npm run build`:
 *
 *   npm run size
 *
 * In danh sách chunk JS lớn nhất và **thoát với mã lỗi ≠ 0** nếu một trong các gói khởi động
 * (entry `index-*.js` hoặc `vendor-*.js`) vượt ngân sách. Mục đích: chặn bundle phình lại âm thầm
 * (ví dụ re-import tĩnh jszip/sql.js hay gộp vendor vào entry) ngay trên CI, không để tới lúc
 * người dùng phàn nàn về tốc độ tải trang.
 *
 * Các chunk lazy (QuizView, VstepHub, react-player, sql.js…) KHÔNG bị tính ngân sách — chúng chỉ
 * được tải khi người dùng mở tính năng tương ứng.
 */
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const DIST_DIR = fileURLToPath(new URL("../dist/assets", import.meta.url));

// Ngân sách (KB, gzip không tính — dùng byte thô như Vite báo cáo). Chừa biên ~15% để CI không
// chỗi vì mỗi lần nâng minor dependency. Đo ngày 2026-09: entry ≈ 342 KB, vendor-firebase ≈ 611 KB.
const ENTRY_BUDGET_KB = 450;
const VENDOR_BUDGET_KB = 700;

const toKb = (bytes) => bytes / 1024;

let assets;
try {
  assets = readdirSync(DIST_DIR).filter((name) => name.endsWith(".js"));
} catch {
  console.error(`Không tìm thấy ${DIST_DIR} — hãy chạy \`npm run build\` trước.`);
  process.exit(1);
}

const rows = assets
  .map((name) => ({ name, kb: toKb(statSync(join(DIST_DIR, name)).size) }))
  .sort((a, b) => b.kb - a.kb);

const totalKb = rows.reduce((sum, row) => sum + row.kb, 0);
console.log(`Tổng JS trong dist/assets: ${totalKb.toFixed(0)} KB (${rows.length} chunk)\n`);
for (const row of rows.slice(0, 15)) {
  console.log(`  ${row.kb.toFixed(1).padStart(8)} KB  ${row.name}`);
}

const failures = [];
const entry = rows.find((row) => /^index-[\w-]+\.js$/.test(row.name));
if (!entry) {
  failures.push("Không tìm thấy entry index-*.js trong dist/assets.");
} else if (entry.kb > ENTRY_BUDGET_KB) {
  failures.push(`Entry index-*.js = ${entry.kb.toFixed(0)} KB vượt ngân sách ${ENTRY_BUDGET_KB} KB.`);
}
for (const vendor of rows.filter((row) => /^vendor-[\w-]+\.js$/.test(row.name))) {
  if (vendor.kb > VENDOR_BUDGET_KB) {
    failures.push(`${vendor.name} = ${vendor.kb.toFixed(0)} KB vượt ngân sách ${VENDOR_BUDGET_KB} KB.`);
  }
}

if (failures.length) {
  console.error("\n✗ Bundle vượt ngân sách:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(`\n✓ Bundle ổn (entry ≤ ${ENTRY_BUDGET_KB} KB, vendor ≤ ${VENDOR_BUDGET_KB} KB).`);
