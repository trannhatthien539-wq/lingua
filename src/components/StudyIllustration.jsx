/**
 * Minh hoạ flat vector cho hero trang chủ: chồng sách, sách mở, mũ tốt nghiệp,
 * bút chì, dấu tích — vẽ bằng SVG nội tuyến nên không cần file ảnh và luôn
 * khớp màu banner xanh. Chỉ trang trí (aria-hidden).
 */
export default function StudyIllustration({ className = "" }) {
  return (
    <svg viewBox="0 0 280 220" className={`h-auto ${className}`} fill="none" aria-hidden="true">
      {/* Đĩa sáng nền */}
      <circle cx="150" cy="105" r="92" fill="rgba(255,255,255,0.14)" />

      {/* Bút chì (góc trên trái) */}
      <g transform="translate(30 58) rotate(-30)">
        <rect x="0" y="0" width="14" height="13" rx="4" fill="#ff86d0" />
        <rect x="18" y="0" width="44" height="13" fill="#ffd900" />
        <path d="M62 0 L78 6.5 L62 13 Z" fill="#f6d5ac" />
        <path d="M72 3 L78 6.5 L72 10 Z" fill="#31423a" />
      </g>

      {/* Mũ tốt nghiệp (góc trên phải) */}
      <g transform="translate(196 28) rotate(10)">
        <path d="M12 19 L12 30 C12 37 56 37 56 30 L56 19 L34 28 Z" fill="#24332c" />
        <path d="M0 14 L34 0 L68 14 L34 28 Z" fill="#31423a" />
        <circle cx="34" cy="14" r="3.5" fill="#ffd900" />
        <path d="M64 15 C64 28 68 34 66 44" stroke="#ffd900" strokeWidth="3" strokeLinecap="round" />
        <circle cx="66" cy="47" r="4" fill="#ffd900" />
      </g>

      {/* Chồng sách */}
      <rect x="78" y="162" width="148" height="22" rx="6" fill="#ffffff" />
      <path d="M84 162 h14 a6 6 0 0 1 6 6 v10 a6 6 0 0 1 -6 6 h-14 z" fill="#ffd900" />
      <rect x="86" y="138" width="132" height="22" rx="6" fill="#eaf7ff" />
      <path d="M92 138 h14 a6 6 0 0 1 6 6 v10 a6 6 0 0 1 -6 6 h-14 z" fill="#1cb0f6" />
      <rect x="82" y="114" width="140" height="22" rx="6" fill="#ffffff" />
      <path d="M196 114 h20 a6 6 0 0 1 6 6 v10 a6 6 0 0 1 -6 6 h-20 z" fill="#ce82ff" />

      {/* Sách mở trên chồng sách */}
      <path d="M152 84 C138 74 118 72 104 74 L104 104 C118 102 138 104 152 112 Z" fill="#ffffff" />
      <path d="M152 84 C166 74 186 72 200 74 L200 104 C186 102 166 104 152 112 Z" fill="#f4f7f2" />
      <path d="M152 84 L152 112" stroke="rgba(24,32,29,0.18)" strokeWidth="2.5" />
      <rect x="114" y="86" width="28" height="3" rx="1.5" fill="rgba(24,32,29,0.12)" />
      <rect x="114" y="94" width="22" height="3" rx="1.5" fill="rgba(24,32,29,0.12)" />
      <rect x="162" y="86" width="28" height="3" rx="1.5" fill="rgba(24,32,29,0.12)" />
      <rect x="162" y="94" width="22" height="3" rx="1.5" fill="rgba(24,32,29,0.12)" />

      {/* Dấu tích “đã hoàn thành” */}
      <circle cx="74" cy="100" r="14" fill="#ffffff" />
      <path d="M67 100 l5 5 9 -10" stroke="#58cc02" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* Ngôi sao lấp lánh */}
      <path d="M60 30 l3.2 8.8 8.8 3.2 -8.8 3.2 -3.2 8.8 -3.2 -8.8 -8.8 -3.2 8.8 -3.2 Z" fill="#ffffff" opacity="0.9" />
      <path d="M246 92 l2.4 6.6 6.6 2.4 -6.6 2.4 -2.4 6.6 -2.4 -6.6 -6.6 -2.4 6.6 -2.4 Z" fill="#ffffff" opacity="0.75" />
      <path d="M44 152 l2 5.5 5.5 2 -5.5 2 -2 5.5 -2 -5.5 -5.5 -2 5.5 -2 Z" fill="#ffffff" opacity="0.6" />
    </svg>
  );
}