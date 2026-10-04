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
  make_do: `
make a mistake|phạm sai lầm
make a decision|đưa ra quyết định
make an effort|nỗ lực, cố gắng
make progress|tiến bộ
make an appointment|hẹn gặp
make a phone call|gọi điện thoại
make an excuse|viện cớ
make money|kiếm tiền
make a difference|tạo ra sự khác biệt
make friends|kết bạn
make a complaint|khiếu nại, phàn nàn
make a suggestion|đưa ra gợi ý
do homework|làm bài tập về nhà
do housework|làm việc nhà
do your best|cố gắng hết sức
do business|kinh doanh, làm ăn
do research|làm nghiên cứu
do a favour|giúp đỡ một việc
do damage|gây thiệt hại
do exercise|tập thể dục
do an experiment|làm thí nghiệm
do someone good|có lợi cho ai đó
`,
  have_take: `
have a break|nghỉ giải lao
have a chat|trò chuyện
have fun|vui vẻ
have a look|nhìn qua, xem thử
have an argument|tranh cãi
have difficulty in|gặp khó khăn trong việc
have a shower|tắm vòi sen
have a good time|có khoảng thời gian vui vẻ
take a photo|chụp ảnh
take a seat|ngồi xuống
take a chance|nắm lấy cơ hội, liều thử
take action|hành động
take care of|chăm sóc
take part in|tham gia vào
take time|mất thời gian
take an exam|làm bài thi
take notes|ghi chép lại
take advantage of|tận dụng cơ hội/lợi thế
take responsibility|chịu trách nhiệm
take into account|tính đến, xem xét
`,
  give_pay_get: `
give advice|đưa ra lời khuyên
give a hand|giúp một tay
give a presentation|thuyết trình
give permission|cho phép
give someone a lift|cho ai đi nhờ xe
give a call|gọi điện
pay attention to|chú ý đến
pay a compliment|khen ngợi ai
pay a visit|đến thăm
pay in cash|trả bằng tiền mặt
pay respect to|bày tỏ sự kính trọng
get permission|xin phép
get a job|tìm được việc làm
get married|kết hôn
get lost|bị lạc đường
get ready|chuẩn bị sẵn sàng
get in touch with|liên lạc với
get angry|trở nên tức giận
`,
  adverbs_collocations: `
highly likely|rất có khả năng
highly recommended|rất được khuyến nghị
deeply concerned|vô cùng lo lắng, quan ngại
deeply affected|bị ảnh hưởng sâu sắc
bitterly disappointed|vô cùng thất vọng
bitterly cold|lạnh buốt, lạnh thấu xương
strongly agree|hoàn toàn đồng ý
strongly advise|khuyên chân thành
strictly forbidden|nghiêm cấm tuyệt đối
widely accepted|được công nhận rộng rãi
fully aware of|nhận thức đầy đủ về
utterly ridiculous|hoàn toàn vô lý, lố bịch
vital importance|tầm quan trọng sống còn
crystal clear|rõ như ban ngày, cực kỳ rõ
fast asleep|ngủ say sưa
heavy rain|mưa to, mưa như trút
`,
  essential_vocab_1: `
approach|tiếp cận, phương pháp
create|tạo ra, sáng tạo
identify|nhận diện, xác định
issue|vấn đề, phát hành
policy|chính sách
require|yêu cầu, đòi hỏi
source|nguồn, xuất xứ
theory|lý thuyết, học thuyết
benefit|lợi ích, đem lại lợi ích
evident|rõ ràng, hiển nhiên
indicate|chỉ ra, biểu thị
interpret|diễn giải, thông dịch
major|chính, chủ yếu, ngành học
occur|xảy ra, xuất hiện
period|khoảng thời gian, tiết học
principle|nguyên tắc, đạo lý
process|quá trình, xử lý
significant|đáng kể, quan trọng
specific|cụ thể, riêng biệt
structure|cấu trúc, tổ chức
`,
  essential_vocab_2: `
achieve|đạt được, hoàn thành
acquire|thu nhận, giành được
affect|ảnh hưởng đến, tác động
aspect|khía cạnh
assist|hỗ trợ, giúp đỡ
conclude|kết luận, kết thúc
conduct|tiến hành, hành vi
consequence|hậu quả, hệ quả
distinction|sự khác biệt, nét đặc sắc
element|yếu tố, thành phần
evaluate|đánh giá, ước lượng
impact|tác động, ảnh hưởng mạnh
maintain|duy trì, bảo dưỡng
obtain|đạt được, kiếm được
potential|tiềm năng, khả năng
previous|trước đó, tiền nhiệm
primary|chính, hàng đầu, tiểu học
relevant|có liên quan, thích hợp
reside|cư trú, trú ngụ
transfer|chuyển giao, di chuyển
`,
  murphy_phrasal_advanced: `
bring about|gây ra, mang lại (thay đổi)
call off|hủy bỏ (cuộc họp, sự kiện)
come across|tình cờ gặp, tình cờ thấy
count on|trông cậy vào, tin tưởng vào
drop out of|bỏ học giữa chừng
face up to|dũng cảm đối mặt với (sự thật, khó khăn)
look down on|coi thường, khinh thường
look up to|ngưỡng mộ, kính trọng
put up with|chịu đựng, nhẫn nhịn
see someone off|tiễn ai đó (ở sân bay/nhà ga)
turn out|hóa ra là, thành ra
stand for|viết tắt cho, đại diện cho
figure out|hiểu ra, tìm ra cách
give away|cho đi miễn phí, tiết lộ bí mật
pull through|vượt qua (cơn bạo bệnh, hiểm nghèo)
take after|giống ai đó (tính cách, ngoại hình)
talk into|thuyết phục ai làm gì
wear off|mất dần tác dụng, nhạt dần
make up for|đền bù cho, bù đắp cho
get away with|thoát tội, không bị trừng phạt
`,
  collocations_academic: `
conduct research|tiến hành nghiên cứu
draw a conclusion|rút ra kết luận
bridge the gap|thu hẹp khoảng cách
highly qualified|có trình độ chuyên môn cao
fiercely competitive|cạnh tranh khốc liệt
achieve an objective|đạt được mục tiêu
pose a threat to|gây ra mối đe dọa cho
play a crucial role|đóng vai trò quan trọng
reach a consensus|đạt được sự đồng thuận
raise awareness|nâng cao nhận thức
exert pressure on|gây áp lực lên
address an issue|giải quyết một vấn đề
take for granted|coi điều gì là hiển nhiên
bear resemblance to|có điểm tương đồng với
substantially increase|tăng lên đáng kể
shed light on|làm sáng tỏ điều gì
`,
  essential_vocab_3: `
advocate|ủng hộ, người biện hộ
comprehensive|toàn diện, bao quát
coherent|mạch lạc, chặt chẽ
empirical|thực nghiệm, dựa trên thực tế
inevitable|không thể tránh khỏi, chắc chắn xảy ra
mitigate|giảm nhẹ, làm dịu bớt
perceive|nhận thức, cảm nhận
subtle|tinh tế, khó nhận thấy
ambiguous|mơ hồ, nước đôi
vulnerable|dễ bị tổn thương
trigger|kích hoạt, khơi mào
intrinsic|thuộc về bản chất, nội tại
preliminary|sơ bộ, chuẩn bị
compile|biên soạn, thu thập
controversy|cuộc tranh cãi nảy lửa
deviate|chệch hướng, sai lệch
integrity|sự chính trực, tính toàn vẹn
innovate|đổi mới, cách tân
fluctuate|dao động, biến động
finite|có hạn, có hạn định
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
  { id: 'make_do', title: 'Collocation: Make & Do', description: 'Phân biệt và ghi nhớ trọn bộ kết hợp từ với Make và Do (English Collocations in Use).', level: 'B1', tags: ['Collocation', 'Cambridge', 'Make/Do'] },
  { id: 'have_take', title: 'Collocation: Have & Take', description: 'Các cụm từ cố định tự nhiên nhất với Have và Take.', level: 'B1', tags: ['Collocation', 'Cambridge', 'Have/Take'] },
  { id: 'give_pay_get', title: 'Collocation: Give, Pay & Get', description: 'Cụm từ diễn đạt hàng ngày với Give, Pay và Get.', level: 'B1', tags: ['Collocation', 'Cambridge', 'Verbs'] },
  { id: 'adverbs_collocations', title: 'Collocation: Trạng từ & Tính từ nhấn mạnh', description: 'Intensifying adverbs giúp văn phong nói và viết tự nhiên như người bản xứ.', level: 'B2', tags: ['Collocation', 'Advanced', 'B2'] },
  { id: 'murphy_phrasal_advanced', title: 'Phrasal Verbs nâng cao (Raymond Murphy)', description: '20 cụm động từ thường gặp nhất trong đề thi B2-C1 và giao tiếp đời sống.', level: 'B2', tags: ['Phrasal verb', 'Cambridge', 'Murphy'] },
  { id: 'collocations_academic', title: 'Collocation: Học thuật & Công sở', description: 'Các cụm từ cố định chuẩn Cambridge nâng band nói và viết học thuật.', level: 'B2-C1', tags: ['Collocation', 'Academic', 'Cambridge'] },
  { id: 'essential_vocab_1', title: '4000 Essential Words: Nền tảng (Phần 1)', description: 'Bộ từ vựng cốt lõi học thuật và giao tiếp theo Paul Nation.', level: 'A2-B1', tags: ['4000 Words', 'Core', 'Paul Nation'] },
  { id: 'essential_vocab_2', title: '4000 Essential Words: Nâng cao (Phần 2)', description: 'Bộ từ vựng học thuật quan trọng để nâng band đọc hiểu và viết.', level: 'B1-B2', tags: ['4000 Words', 'Academic', 'Paul Nation'] },
  { id: 'essential_vocab_3', title: '4000 Essential Words: Chuyên sâu (Phần 3)', description: 'Từ vựng học thuật đỉnh cao theo Paul Nation giúp đột phá điểm đọc viết.', level: 'B2-C1', tags: ['4000 Words', 'Advanced', 'Paul Nation'] },
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
