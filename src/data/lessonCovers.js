/**
 * Bộ ảnh đại diện (cover images) chất lượng cao chuẩn HD cho các bài học,
 * bộ thẻ từ vựng và đề thi trong Lingua.
 *
 * Mọi ảnh đều được chọn lọc tỉ mỉ từ Unsplash CDN, tối ưu định dạng WebP,
 * tỉ lệ khung hình chuẩn và liên quan trực tiếp đến ngữ cảnh của từng bài.
 */

export const GRAMMAR_COVERS = {
  // 12 thì cơ bản
  'present-simple': 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=720&q=80', // Lịch trình, thói quen thường nhật
  'present-continuous': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=720&q=80', // Hành động đang diễn ra lúc này
  'present-perfect': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=720&q=80', // Đỉnh núi, chạm đích, kết quả hiện tại
  'present-perfect-continuous': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=720&q=80', // Chạy bộ kiên trì, nỗ lực liên tục
  'past-simple': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=720&q=80', // Đồng hồ cổ, kỷ vật quá khứ
  'past-continuous': 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=720&q=80', // Tàu hoả đang lướt đi trong hồi ức
  'past-perfect': 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=720&q=80', // Thư viện cổ, việc đã xong trước mốc xưa
  'past-perfect-continuous': 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=720&q=80', // Nghệ nhân gốm miệt mài xoay đất
  'future-simple': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=720&q=80', // Con đường mở ra chân trời tương lai
  'future-continuous': 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=720&q=80', // Tàu cao tốc rực rỡ trong đêm
  'future-perfect': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=720&q=80', // Công trình kiến trúc hoàn thành tráng lệ
  'future-perfect-continuous': 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=720&q=80', // Dải ngân hà và bầu trời sao vô tận

  // Cấu trúc B1
  'conditionals': 'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=720&q=80', // Ngã ba đường trong rừng sương sớm
  'passive-voice': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=720&q=80', // Đấu trường La Mã được xây dựng
  'relative-clauses': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=720&q=80', // Cầu treo nối liền đôi bờ
  'reported-speech': 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=720&q=80', // Micro phỏng vấn, truyền đạt lại lời nói
  'modal-verbs': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=720&q=80', // Ngọn hải đăng chỉ dẫn phương hướng
  'comparison': 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=720&q=80', // Khinh khí cầu nhiều tầng bậc cao thấp
  'gerund-infinitive': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=720&q=80', // Hoạ sĩ vẽ tranh, niềm đam mê hành động
  'articles-quantifiers': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=720&q=80', // Tiêu điểm ánh sáng đơn chiếc rõ ràng

  // Chủ điểm mở rộng
  'prepositions': 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=720&q=80', // La bàn và bản đồ định vị cổ
  'linking-words': 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=720&q=80', // Các bánh răng và mối liên kết nhịp nhàng
  'used-to': 'https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=720&q=80', // Máy hát đĩa than hoài niệm thời đã qua
  'question-tags': 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=720&q=80', // Trang sách mở ra điều cần xác nhận
  'word-formation': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=720&q=80', // Con chữ gỗ ghép thành câu từ
  'wish-causative': 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=720&q=80', // Hoa bồ công anh mang điều ước bay xa

  // Cấu trúc C1
  'cleft-sentences': 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=720&q=80', // Vệt sáng spotlight nhấn mạnh sân khấu
  'inversion': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=720&q=80', // Núi tuyết soi bóng đảo ngược trên mặt hồ
  'participle-clauses': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=720&q=80', // Vườn thiền Nhật Bản tinh gọn, hàm súc
  'nominalisation-hedging': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=720&q=80', // Toà nhà học thuật kính hiện đại trang trọng
};

export const SKILL_COVERS = {
  // Nghe (Listening)
  'coffee-shop': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=720&q=80',
  'job-interview': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=720&q=80',
  'travel-plan': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=720&q=80',
  'health-advice': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=720&q=80',
  'study-tips': 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=720&q=80',
  'city-transport': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=720&q=80',
  'vstep-announcement': 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=720&q=80',
  'vstep-lecture': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=720&q=80',

  // Đọc (Reading)
  'working-from-home': 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=720&q=80',
  'plastic-problem': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=720&q=80',
  'sleep-and-study': 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=720&q=80',
  'volunteering': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=720&q=80',
  'street-food': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=720&q=80',
  'online-learning': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=720&q=80',
  'vstep-notices': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=720&q=80',
  'vstep-academic': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=720&q=80',

  // Nói (Speaking)
  'hometown': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=720&q=80',
  'free-time': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=720&q=80',
  'technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=720&q=80',
  'study-plan': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=720&q=80',
  'food': 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=720&q=80',
  'travel-topic': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=720&q=80',
  'vstep-part1-part3-family': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=720&q=80',
  'vstep-solution-tourism': 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=720&q=80',

  // Viết (Writing)
  'invite-friend': 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=720&q=80',
  'apology-late': 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=720&q=80',
  'opinion-online': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=720&q=80',
  'opinion-city': 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=720&q=80',
  'describe-place': 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=720&q=80',
  'report-bad-service': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=720&q=80',
  'vstep-task1-letter': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=720&q=80',
  'vstep-task2-essay': 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=720&q=80',
};

export const DECK_COVERS = {
  // Ba bộ 4.000 từ tiếng Anh cốt lõi
  'essential_vocab_1': 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=720&q=80', // Thư viện sách ấm áp
  'essential_vocab_2': 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=720&q=80', // Đọc sách bên đèn vàng
  'essential_vocab_3': 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=720&q=80', // Đại sảnh thư viện cổ kính

  // Các chủ đề Collocation & từ vựng
  'work': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=720&q=80',
  'travel': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=720&q=80',
  'health': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=720&q=80',
  'environment': 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=720&q=80',
  'study': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=720&q=80',
  'daily': 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=720&q=80',
  'phrasal': 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?auto=format&fit=crop&w=720&q=80',
  'make_do': 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=720&q=80',
  'have_take': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=720&q=80',
  'give_pay_get': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=720&q=80',
  'adverbs_collocations': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=720&q=80',
  'murphy_phrasal_advanced': 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=720&q=80',
  'collocations_academic': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=720&q=80',
  'starter-pack': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=720&q=80',
};

export const VSTEP_COVERS = {
  'b1-01': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=720&q=80', // Giảng đường sinh viên
  'b1-02': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=720&q=80', // Thảo luận làm việc nhóm
  'b1-03': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=720&q=80', // Bãi biển du lịch nhiệt đới
  'b2-01': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=720&q=80', // Phòng máy tính công nghệ
  'b2-02': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=720&q=80', // Đô thị xanh hiện đại
  'b2-03': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=720&q=80', // Trung tâm tài chính kinh tế
  'b2-04': 'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?auto=format&fit=crop&w=720&q=80', // Studio truyền thông hiện đại
  'c1-01': 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=720&q=80', // Phòng thí nghiệm khoa học cao cấp
  'c1-02': 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=720&q=80', // Quả địa cầu và giao thoa văn hoá
  'c1-03': 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=720&q=80', // Hội trường nghị sự chính sách
};

const FALLBACK_PALETTE = [
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=720&q=80',
];

export function getGrammarCover(id, index = 0) {
  if (id && GRAMMAR_COVERS[id]) return GRAMMAR_COVERS[id];
  return FALLBACK_PALETTE[Math.abs(index) % FALLBACK_PALETTE.length];
}

export function getSkillCover(id, _type = '', index = 0) {
  if (id && SKILL_COVERS[id]) return SKILL_COVERS[id];
  return FALLBACK_PALETTE[Math.abs(index) % FALLBACK_PALETTE.length];
}

export function getDeckCover(deck, index = 0) {
  if (!deck) return FALLBACK_PALETTE[0];
  if (deck.themeDeckId && DECK_COVERS[deck.themeDeckId]) return DECK_COVERS[deck.themeDeckId];

  // Khớp theo tiêu đề
  const lower = String(deck.title || '').toLowerCase();
  if (lower.includes('4000') || lower.includes('4.000')) {
    if (lower.includes('phần 2') || lower.includes('part 2')) return DECK_COVERS['essential_vocab_2'];
    if (lower.includes('phần 3') || lower.includes('part 3')) return DECK_COVERS['essential_vocab_3'];
    return DECK_COVERS['essential_vocab_1'];
  }
  if (lower.includes('công việc') || lower.includes('tuyển dụng') || lower.includes('work')) return DECK_COVERS['work'];
  if (lower.includes('du lịch') || lower.includes('khách sạn') || lower.includes('travel')) return DECK_COVERS['travel'];
  if (lower.includes('sức khoẻ') || lower.includes('lối sống') || lower.includes('health')) return DECK_COVERS['health'];
  if (lower.includes('môi trường') || lower.includes('thành phố') || lower.includes('environment')) return DECK_COVERS['environment'];
  if (lower.includes('học tập') || lower.includes('thi cử') || lower.includes('study')) return DECK_COVERS['study'];
  if (lower.includes('giao tiếp') || lower.includes('daily')) return DECK_COVERS['daily'];
  if (lower.includes('phrasal')) return DECK_COVERS['phrasal'];
  if (lower.includes('khởi đầu') || lower.includes('starter') || lower.includes('cơ bản')) return DECK_COVERS['starter-pack'];

  return FALLBACK_PALETTE[Math.abs(index) % FALLBACK_PALETTE.length];
}

export function getVstepCover(examId, _level = 'B1', index = 0) {
  if (examId && VSTEP_COVERS[examId]) return VSTEP_COVERS[examId];
  return FALLBACK_PALETTE[Math.abs(index) % FALLBACK_PALETTE.length];
}
