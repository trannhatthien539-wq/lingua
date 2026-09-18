/**
 * Bộ từ theo chủ đề B1: dạy theo CỤM TỪ (collocation) thay vì từ đơn,
 * vì người học B1 thường mất điểm khi ghép từ sai.
 * Mỗi dòng: "cụm từ|nghĩa tiếng Việt".
 */
const deckLines = {
  work: `
apply for a job|nộp đơn xin việc
have an interview|đi phỏng vấn
work full time|đi làm toàn thời gian
work part time|đi làm bán thời gian
be responsible for|chịu trách nhiệm về
deal with customers|giải quyết/tiếp khách hàng
meet a deadline|hoàn thành đúng hạn
be on time|đúng giờ
take a day off|xin nghỉ một ngày
get a promotion|được thăng chức
earn a good salary|kiếm lương tốt
gain experience|có thêm kinh nghiệm
resign from a job|nghỉ việc
work from home|làm việc tại nhà
a team player|người làm việc nhóm tốt
have a good work-life balance|cân bằng công việc và cuộc sống
`,
  travel: `
book a flight|đặt vé máy bay
check in at the airport|làm thủ tục ở sân bay
a round trip|chuyến đi khứ hồi
a one-way ticket|vé một chiều
miss a connection|lỡ chuyến nối tiếp
a delayed flight|chuyến bay bị hoãn
travel light|đi du lịch với ít hành lý
go sightseeing|đi tham quan
a package tour|tour trọn gói
stay at a homestay|ở nhà dân
check out of a hotel|trả phòng khách sạn
get around the city|đi lại trong thành phố
a local speciality|đặc sản địa phương
off the beaten track|nơi ít khách du lịch
bargain for a lower price|mặc cả giá thấp hơn
a once-in-a-lifetime experience|trải nghiệm chỉ có một lần
`,
  health: `
stay in shape|giữ dáng
do exercise regularly|tập thể dục đều đặn
eat a balanced diet|ăn uống cân bằng
put on weight|tăng cân
lose weight|giảm cân
give up smoking|bỏ thuốc lá
be under a lot of stress|bị căng thẳng nhiều
get enough sleep|ngủ đủ giấc
catch a cold|bị cảm
have a sore throat|bị đau họng
take medicine twice a day|uống thuốc hai lần một ngày
make an appointment|đặt lịch hẹn
recover from an illness|hồi phục sau bệnh
feel under the weather|thấy trong người không khoẻ
a healthy lifestyle|lối sống lành mạnh
keep fit|giữ sức khoẻ
`,
  environment: `
protect the environment|bảo vệ môi trường
reduce waste|giảm rác thải
recycle plastic bottles|tái chế chai nhựa
save energy|tiết kiệm năng lượng
air pollution|ô nhiễm không khí
traffic congestion|ùn tắc giao thông
public transport|giao thông công cộng
green space|không gian xanh
climate change|biến đổi khí hậu
natural resources|tài nguyên thiên nhiên
throw away rubbish|vứt rác
use reusable bags|dùng túi dùng lại được
cut down on electricity|giảm tiêu thụ điện
a crowded city|thành phố đông đúc
take action|hành động (để giải quyết)
have a positive impact on|tác động tích cực tới
`,
  study: `
take notes|ghi chép
revise for an exam|ôn thi
pass an exam|đỗ kỳ thi
fail an exam|trượt kỳ thi
hand in an assignment|nộp bài tập
do research|nghiên cứu
make progress|tiến bộ
keep up with the class|theo kịp lớp
a study plan|kế hoạch học tập
concentrate on a task|tập trung vào một việc
memorise new words|ghi nhớ từ mới
learn by heart|học thuộc lòng
ask for feedback|xin nhận xét
improve your listening skills|cải thiện kỹ năng nghe
a short attention span|khả năng tập trung ngắn
study abroad|du học
`,
  daily: `
How is it going?|Dạo này thế nào?
Long time no see|lâu rồi không gặp
What do you mean?|ý bạn là gì?
It depends on…|còn tuỳ vào…
I am not sure about that|tôi không chắc về điều đó
That sounds great|nghe hay đấy
I could not agree more|tôi hoàn toàn đồng ý
Never mind|không sao đâu
Take your time|cứ từ từ
It is up to you|tuỳ bạn
I am afraid I cannot|tôi e là tôi không thể
Would you mind …?|bạn có phiền … không?
By the way|nhân tiện
As far as I know|theo như tôi biết
To be honest|thành thật mà nói
In my opinion|theo ý tôi
`,
  phrasal: `
give up|từ bỏ
look after|chăm sóc
look for|tìm kiếm
look forward to|mong chờ
put off|hoãn lại
carry on|tiếp tục
find out|tìm ra, phát hiện
turn down|từ chối, vặn nhỏ
turn up|đến, xuất hiện
get on with|hoà thuận với
get over|vượt qua (bệnh, khó khăn)
deal with|xử lý
run out of|hết (nguồn hàng)
take up|bắt đầu (sở thích)
bring up|nuôi dạy, nêu ra
come up with|nghĩ ra
set up|thành lập, thiết lập
break down|hỏng (máy), suy sụp
check out|kiểm tra, trả phòng
work out|tập thể dục, tính ra
point out|chỉ ra
sort out|giải quyết, sắp xếp
go on|tiếp tục, diễn ra
hold on|chờ một chút
`,
}

export const themeDecks = [
  { id: 'work', title: 'Cụm từ: Công việc & tuyển dụng', description: 'Cụm từ thường dùng khi nói về việc làm, phỏng vấn và đồng nghiệp.', level: 'B1', tags: ['B1', 'Work', 'Collocation'] },
  { id: 'travel', title: 'Cụm từ: Du lịch & khách sạn', description: 'Cụm từ dùng khi đi du lịch, đặt vé, ở khách sạn.', level: 'B1', tags: ['B1', 'Travel', 'Collocation'] },
  { id: 'health', title: 'Cụm từ: Sức khoẻ & lối sống', description: 'Cụm từ về sức khoẻ, tập luyện và thói quen sinh hoạt.', level: 'B1', tags: ['B1', 'Health', 'Collocation'] },
  { id: 'environment', title: 'Cụm từ: Môi trường & thành phố', description: 'Cụm từ cho chủ đề môi trường, giao thông và đô thị.', level: 'B1', tags: ['B1', 'Environment', 'Collocation'] },
  { id: 'study', title: 'Cụm từ: Học tập & thi cử', description: 'Cụm từ dùng khi nói về việc học, ôn thi và tiến bộ.', level: 'B1', tags: ['B1', 'Study', 'Collocation'] },
  { id: 'daily', title: 'Cụm từ: Giao tiếp hằng ngày', description: 'Mẫu câu tự nhiên hay dùng khi nói chuyện hằng ngày.', level: 'B1', tags: ['B1', 'Speaking', 'Collocation'] },
  { id: 'phrasal', title: 'Cụm động từ (phrasal verbs)', description: '24 cụm động từ phổ biến nhất ở trình độ B1.', level: 'B1', tags: ['B1', 'Phrasal verb'] },
]

const parseLines = (raw) =>
  raw
    .trim()
    .split('\n')
    .map((line) => {
      const [word, meaning] = line.split('|')
      return { word: (word || '').trim(), meaning: (meaning || '').trim() }
    })
    .filter((entry) => entry.word && entry.meaning)

export const themeDeckEntries = (deckId) => parseLines(deckLines[deckId] || '')

export const themeDeckMeta = (deckId) => themeDecks.find((deck) => deck.id === deckId)

/** Tạo deck + thẻ cho một bộ chủ đề (id sinh mới để không trùng giữa các lần tạo). */
export const createThemeDeck = (deckId) => {
  const meta = themeDeckMeta(deckId)
  const entries = themeDeckEntries(deckId)
  if (!meta || !entries.length) return null
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  const newDeckId = `theme-${deckId}-${stamp}`
  const now = new Date().toISOString()
  const today = now.slice(0, 10)
  return {
    deck: { id: newDeckId, title: meta.title, description: meta.description, tags: meta.tags, createdAt: now },
    cards: entries.map((entry, index) => ({
      id: `theme-card-${stamp}-${String(index + 1).padStart(3, '0')}`,
      deckId: newDeckId,
      word: entry.word,
      ipa: '',
      meaning: entry.meaning,
      example: '',
      level: meta.level,
      status: 'new',
      interval: 1,
      nextReview: now,
      nextReviewDate: today,
      repetition: 0,
      reviewDate: now,
      imageUrl: '',
      audioUrl: '',
    })),
  }
}
