/**
 * Bảng "cặp dễ lẫn" — những cặp cấu trúc người học hay dùng sai vì giống nhau.
 * `point` là cách phân biệt ngắn gọn, `example` minh hoạ cả hai.
 */
export const grammarConfusingPairs = [
  {
    id: 'pp-vs-past-simple',
    left: 'Hiện tại hoàn thành',
    right: 'Quá khứ đơn',
    point: 'Có mốc thời gian đã kết thúc (last week, in 2019, yesterday) → quá khứ đơn. Không có mốc, hoặc còn liên quan hiện tại (already, yet, since, ever) → hiện tại hoàn thành.',
    example: 'I have lost my keys. (không biết khi nào) / I lost my keys yesterday.',
  },
  {
    id: 'since-vs-for',
    left: 'since',
    right: 'for',
    point: 'since + mốc thời gian (since 2020, since Monday). for + khoảng thời gian (for three years, for a week).',
    example: 'She has lived here for five years / since 2019.',
  },
  {
    id: 'will-vs-going-to',
    left: 'will + V',
    right: 'be going to + V',
    point: 'Quyết định ngay lúc nói, lời hứa, dự đoán chung → will. Kế hoạch đã định trước hoặc dấu hiệu rõ ràng ở hiện tại → be going to.',
    example: 'The phone is ringing. I will answer it. / I am going to visit my aunt this weekend.',
  },
  {
    id: 'used-to-vs-be-used-to',
    left: 'used to + V',
    right: 'be/get used to + V-ing',
    point: 'used to + V = thói quen trong quá khứ, nay không còn. be used to + V-ing = đã quen với việc gì (không còn thấy lạ).',
    example: 'I used to get up at five. / I am used to getting up at five.',
  },
  {
    id: 'although-vs-despite',
    left: 'although / even though + mệnh đề',
    right: 'despite / in spite of + danh từ hoặc V-ing',
    point: 'Sau although là một mệnh đề đủ chủ ngữ – động từ; sau despite chỉ là cụm danh từ hoặc V-ing.',
    example: 'Although it rained, we went out. / Despite the rain, we went out.',
  },
  {
    id: 'because-vs-because-of',
    left: 'because + mệnh đề',
    right: 'because of + danh từ / V-ing',
    point: 'Cùng nghĩa “vì”, khác loại từ theo sau. Không dùng “because of + mệnh đề”.',
    example: 'He stayed home because he was ill. / because of his illness',
  },
  {
    id: 'say-vs-tell',
    left: 'say',
    right: 'tell',
    point: 'say something (không cần tân ngữ người); tell somebody something (luôn có người nhận).',
    example: 'She said she was tired. / She told me she was tired.',
  },
  {
    id: 'many-vs-much',
    left: 'many / a few',
    right: 'much / a little',
    point: 'many, a few đi với danh từ đếm được số nhiều; much, a little đi với danh từ không đếm được.',
    example: 'many friends, a few minutes / much time, a little water',
  },
  {
    id: 'enough-vs-too',
    left: 'enough (đủ)',
    right: 'too (quá)',
    point: 'Tính từ + enough + to V (đủ để làm gì); too + tính từ + to V (quá … nên không làm được).',
    example: 'He is old enough to drive. / He is too young to drive.',
  },
  {
    id: 'make-vs-do',
    left: 'make',
    right: 'do',
    point: 'make dùng với kết quả/tạo ra (make a decision, make progress); do dùng với hoạt động, công việc (do homework, do research, do the dishes).',
    example: 'She made a mistake. / She did her homework.',
  },
  {
    id: 'borrow-vs-lend',
    left: 'borrow (mượn vào)',
    right: 'lend (cho mượn)',
    point: 'borrow something from somebody = mượn của ai; lend somebody something = cho ai mượn.',
    example: 'Can I borrow your pen? / Can you lend me your pen?',
  },
  {
    id: 'advice-vs-advise',
    left: 'advice (danh từ không đếm được)',
    right: 'advise (động từ)',
    point: 'advice không có “s”, dùng a piece of advice; advise + somebody + to V.',
    example: 'She gave me some advice. / She advised me to rest.',
  },
  {
    id: 'remember-difference',
    left: 'remember to V (nhớ phải làm)',
    right: 'remember V-ing (nhớ đã làm)',
    point: 'to V = việc còn ở phía trước; V-ing = việc đã xảy ra trong quá khứ.',
    example: 'Remember to lock the door. / I remember locking the door.',
  },
  {
    id: 'stop-difference',
    left: 'stop to V (dừng lại để làm)',
    right: 'stop V-ing (ngừng hẳn việc đó)',
    point: 'stop to V = dừng việc đang làm để chuyển sang việc khác; stop V-ing = chấm dứt hành động đó.',
    example: 'He stopped to smoke. / He stopped smoking.',
  },
  {
    id: 'although-vs-but',
    left: 'although / though',
    right: 'but / however',
    point: 'Không dùng “although … but …” trong cùng một câu; chỉ chọn một trong hai cách nối.',
    example: 'Although it was late, he kept working. / It was late, but he kept working.',
  },
  {
    id: 'compare-with-vs-to',
    left: 'compare with',
    right: 'compare to',
    point: 'compare with = so sánh để tìm điểm khác biệt; compare to = ví như, so sánh giống như.',
    example: 'Compare your answer with the model. / Life is often compared to a journey.',
  },
]

export const grammarConfusingPairById = (id) => grammarConfusingPairs.find((pair) => pair.id === id) || null
