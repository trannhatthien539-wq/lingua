/**
 * Sổ tay VSTEP: cấu trúc đề, cách tính điểm, mẹo từng kỹ năng và checklist ngày thi.
 * Nội dung tự biên soạn theo format đề thi VSTEP; ngưỡng điểm nằm ở `bands.js`.
 */
export const vstepIntro = `VSTEP (Vietnamese Standardized Test of English Proficiency) là kỳ thi đánh giá năng lực tiếng Anh theo Khung năng lực ngoại ngữ 6 bậc dùng cho Việt Nam. Bài thi gồm 4 kỹ năng: Nghe, Nói, Đọc, Viết. Mỗi kỹ năng được chấm trên thang 0–10; kết quả tổng là trung bình cộng của 4 kỹ năng và được quy về bậc năng lực (B1 – bậc 3, B2 – bậc 4, C1 – bậc 5).`;

export const vstepLevels = [
  { id: 'B1', name: 'Bậc 3 · B1', desc: 'Hiểu và dùng được tiếng Anh trong các tình huống quen thuộc, giao tiếp được khi đi du lịch, viết được email và đoạn văn ngắn có liên kết.' },
  { id: 'B2', name: 'Bậc 4 · B2', desc: 'Hiểu ý chính của văn bản phức tạp, tranh luận được về nhiều chủ đề, viết luận rõ ràng và nói khá trôi chảy.' },
  { id: 'C1', name: 'Bậc 5 · C1', desc: 'Sử dụng tiếng Anh linh hoạt, hiệu quả cho học thuật và công việc; hiểu văn bản dài, hàm ý và sắc thái nghĩa.' },
];

export const vstepSkills = [
  {
    id: 'listening',
    name: 'Nghe (Listening)',
    minutes: 40,
    questions: '35 câu · 3 phần',
    parts: [
      { name: 'Part 1 · Thông báo ngắn', questions: '8 câu', note: 'Thông báo ở nơi công cộng, tin nhắn, chỉ dẫn. Mỗi băng chỉ có một câu hỏi.' },
      { name: 'Part 2 · Hội thoại', questions: '12 câu', note: '2–3 đoạn hội thoại về đời sống, công việc, học tập.' },
      { name: 'Part 3 · Bài nói / bài giảng', questions: '15 câu', note: '2 bài nói dài hơn, có lập luận và số liệu; câu hỏi về ý chính, chi tiết, thái độ.' },
    ],
    tips: [
      'Đọc trước câu hỏi và các lựa chọn trong thời gian chờ — bạn sẽ biết mình cần nghe thông tin gì.',
      'Bám vào từ khoá trong câu hỏi, đừng cố dịch từng từ; bỏ qua từ lạ và tiếp tục theo mạch.',
      'Cẩn thận với số liệu và tên riêng: đề rất hay đổi đơn vị, giờ, giá, số tầng, cổng, bến.',
      'Nghe từ nối (however, actually, on the other hand) vì câu trả lời thường nằm sau một chỗ "bẻ lái".',
      'Nếu lỡ mất một câu, hãy chọn đáp án hợp lý nhất rồi đi tiếp, không dừng lại ở câu đó.',
    ],
  },
  {
    id: 'reading',
    name: 'Đọc (Reading)',
    minutes: 60,
    questions: '40 câu · 4 phần',
    parts: [
      { name: 'Part 1 · Văn bản ngắn', questions: '10 câu', note: '10 văn bản rất ngắn: thông báo, email, quảng cáo, nhãn sản phẩm, ghi chú.' },
      { name: 'Part 2 · Bài đọc', questions: '10 câu', note: 'Một bài đọc khoảng 350–450 từ.' },
      { name: 'Part 3 · Bài đọc', questions: '10 câu', note: 'Một bài đọc dài hơn, văn phong học thuật hoặc báo chí.' },
      { name: 'Part 4 · Điền khuyết', questions: '10 câu', note: 'Đoạn văn có 10 chỗ trống, chọn từ/cụm từ phù hợp.' },
    ],
    tips: [
      'Part 1 nên làm nhanh: 10 văn bản chỉ nên chiếm khoảng 12–15 phút.',
      'Với bài dài, đọc câu hỏi trước rồi quét (scan) để tìm vị trí thông tin thay vì đọc cả bài.',
      'Câu hỏi "ý chính của đoạn 2" thường nằm ở câu đầu hoặc câu cuối đoạn đó.',
      'Part 4 kiểm tra ngữ pháp và collocation: chú ý giới từ, mạo từ, dạng của động từ sau “to V/V-ing”.',
      'Cảnh giác với đáp án đúng nhưng "quá rộng" hoặc "quá hẹp" so với nội dung bài.',
    ],
  },
  {
    id: 'writing',
    name: 'Viết (Writing)',
    minutes: 60,
    questions: '2 task',
    parts: [
      { name: 'Task 1 · Thư/email', questions: '~120 từ', note: 'Thường là email cho bạn bè/đồng nghiệp: mời, cảm ơn, xin lỗi, đề nghị, phàn nàn. Cần đủ 4 ý trong đề.' },
      { name: 'Task 2 · Luận', questions: '~250 từ', note: 'Thảo luận hai quan điểm hoặc nêu ý kiến về một vấn đề xã hội, có ví dụ và kết luận.' },
    ],
    tips: [
      'Ngân sách thời gian: 20 phút cho Task 1 và 40 phút cho Task 2 (Task 2 chiếm nhiều điểm hơn).',
      'Trước khi viết, dành 2 phút gạch 3–4 ý cho mỗi đoạn; bài có dàn ý luôn mạch lạc hơn.',
      'Task 1 phải trả lời ĐỦ 4 ý trong đề — thiếu một ý là mất điểm nội dung.',
      'Task 2 có 4 đoạn: mở bài, thân bài 1, thân bài 2, kết luận. Kết luận không nêu ý mới.',
      'Đa dạng từ nối (however, therefore, in addition, as a result) và tránh lặp một từ quá 3 lần.',
      'Dành 3 phút cuối để soát lỗi thì, số ít/số nhiều, mạo từ và chữ “s” của động từ.',
    ],
  },
  {
    id: 'speaking',
    name: 'Nói (Speaking)',
    minutes: 12,
    questions: '3 phần',
    parts: [
      { name: 'Part 1 · Tương tác xã hội', questions: '3 câu hỏi', note: 'Giám khảo hỏi về bạn, thói quen, sở thích. Trả lời 1–2 phút cho mỗi câu.' },
      { name: 'Part 2 · Thảo luận giải pháp', questions: '1 tình huống', note: 'Đưa ra một tình huống và 3 phương án; bạn so sánh ưu nhược điểm rồi chọn một.' },
      { name: 'Part 3 · Phát triển chủ đề', questions: '1 chủ đề', note: 'Trình bày quan điểm theo 3 gợi ý, sau đó trả lời 2 câu hỏi mở rộng.' },
    ],
    tips: [
      'Luôn trả lời theo cấu trúc: câu trả lời trực tiếp → lý do → ví dụ/trải nghiệm cá nhân.',
      'Với Part 2, hãy nói về CẢ BA phương án trước khi chọn — đề yêu cầu thảo luận, không phải chỉ chọn.',
      'Nhịp nói tự nhiên khoảng 110–150 từ/phút; đừng cố nói quá nhanh vì sẽ sai phát âm.',
      'Khi bí ý, dùng cụm kéo dài như “That is an interesting question…”, “Let me think about that for a second…” (xem mục Mẫu câu).',
      'Đừng học thuộc lòng cả bài; giám khảo nhận ra ngay và sẽ hỏi ngược để kiểm tra.',
    ],
  },
];

export const scoringNotes = [
  'Mỗi kỹ năng chấm 0–10; điểm tổng là trung bình cộng 4 kỹ năng (làm tròn 0.5).',
  'Nghe và Đọc chấm tự động theo số câu đúng: điểm = (số câu đúng / tổng số câu) × 10.',
  'Viết chấm theo 4 tiêu chí: hoàn thành yêu cầu, mạch lạc & từ nối, từ vựng, ngữ pháp — mỗi tiêu chí 2.5 điểm.',
  'Nói chấm theo 3 tiêu chí: trôi chảy & mạch lạc, từ vựng & ngữ pháp, hoàn thành nội dung.',
  'Bảng quy đổi bậc trong app: ≥8.5 → C1, ≥6.0 → B2, ≥4.0 → B1 (chỉnh được ở `src/data/vstep/bands.js`).',
  'Kết quả trong app là ước lượng để học tập, không phải điểm thi chính thức.',
];

export const examDayChecklist = [
  'Ngủ đủ giấc: thi Nghe – Nói trước nên sự tập trung quan trọng hơn học thêm 2 tiếng đêm trước.',
  'Mang giấy tờ tuỳ thân/CCCD và giấy báo dự thi theo yêu cầu của đơn vị tổ chức.',
  'Đến sớm 30 phút để làm thủ tục và làm quen phòng thi.',
  'Với phần Nói: thử micro và nói thầm một đoạn ngắn để làm ấm giọng.',
  'Phần Viết: viết dàn ý trước, canh thời gian 20 phút cho Task 1 và 40 phút cho Task 2.',
  'Phần Đọc: nếu một câu mất hơn 90 giây, hãy chọn đáp án tạm và quay lại sau.',
];

export const studyPlanWeeks = [
  { week: 'Tuần 1–2', focus: 'Chẩn đoán trình độ', tasks: ['Làm 1 đề đầy đủ để biết điểm xuất phát', 'Chọn bậc mục tiêu (B1/B2/C1)', 'Tạo bộ flashcard VSTEP cho 3 chủ đề yếu nhất'] },
  { week: 'Tuần 3–4', focus: 'Từ vựng & ngữ pháp', tasks: ['Học 20 từ mới/ngày theo chủ đề', 'Ôn SRS mỗi ngày, ưu tiên “từ hay quên”', 'Chữa 1 bài Writing Task 1 mỗi hai ngày'] },
  { week: 'Tuần 5–6', focus: 'Nghe & Đọc theo dạng bài', tasks: ['Luyện từng part của Nghe/Đọc ở chế độ luyện', 'Nghe lại transcript và ghi cụm từ bị mất', 'Làm 2 đề đầy đủ có đồng hồ'] },
  { week: 'Tuần 7–8', focus: 'Viết & Nói', tasks: ['Viết 4 Task 2 và nhờ AI chấm theo tiêu chí', 'Ghi âm 3 phần Nói, nghe lại và sửa', 'Luyện nói 2 phút cho mỗi câu theo mẫu câu có sẵn'] },
  { week: 'Tuần 9', focus: 'Thi thử & rà lỗi', tasks: ['Làm 2 đề đầy đủ trong điều kiện thi thật', 'Xem lại toàn bộ câu sai, ghi vào sổ lỗi', 'Ôn lại sổ tay và checklist ngày thi'] },
];
