/**
 * Mẫu câu dùng cho phần Viết và Nói của bài thi VSTEP (tự biên soạn).
 *
 * - `writingPhrases` / `speakingPhrases`: mảng nhóm, mỗi nhóm
 *   `{ id, title, items: [{ en, vi }] }`.
 * - `commonMistakes`: lỗi thường gặp của người học Việt ở trình độ B1–C1,
 *   gồm câu sai (`wrong`), câu đúng (`right`) và giải thích ngắn (`note`).
 *
 * Quy ước chuỗi: dùng `’` (U+2019) cho dấu nháy đơn trong câu tiếng Anh.
 */

export const writingPhrases = [
  {
    id: 'open',
    title: 'Mở bài',
    items: [
      { en: 'In recent years, ... has become a topic of heated debate.', vi: 'Trong những năm gần đây, ... đã trở thành chủ đề tranh luận sôi nổi.' },
      { en: 'It is often argued that ...', vi: 'Người ta thường cho rằng ...' },
      { en: 'Nowadays, more and more people are choosing to ...', vi: 'Ngày nay, ngày càng nhiều người chọn ...' },
      { en: 'There is no doubt that ... plays an important role in ...', vi: 'Không nghi ngờ gì rằng ... đóng vai trò quan trọng trong ...' },
      { en: 'The issue of ... has attracted a great deal of public attention.', vi: 'Vấn đề ... đã thu hút nhiều sự quan tâm của công chúng.' },
      { en: 'While some people believe that ..., others take a very different view.', vi: 'Trong khi một số người tin rằng ..., những người khác lại có quan điểm rất khác.' },
      { en: 'This essay will discuss both sides of the argument before giving my opinion.', vi: 'Bài viết này sẽ bàn cả hai phía của vấn đề trước khi nêu ý kiến của tôi.' },
      { en: 'Over the past decade, the way we ... has changed dramatically.', vi: 'Trong mười năm qua, cách chúng ta ... đã thay đổi rất nhiều.' },
    ],
  },
  {
    id: 'opinion',
    title: 'Nêu ý kiến',
    items: [
      { en: 'In my view, ...', vi: 'Theo quan điểm của tôi, ...' },
      { en: 'As far as I am concerned, ...', vi: 'Đối với tôi thì ...' },
      { en: 'I firmly believe that ...', vi: 'Tôi tin chắc rằng ...' },
      { en: 'From my perspective, the benefits outweigh the drawbacks.', vi: 'Theo góc nhìn của tôi, lợi ích nhiều hơn hạn chế.' },
      { en: 'There are several reasons why I think that ...', vi: 'Có vài lý do khiến tôi nghĩ rằng ...' },
      { en: 'I would argue that ...', vi: 'Tôi cho rằng ... (kèm lập luận)' },
      { en: 'To my mind, this is a positive development.', vi: 'Theo tôi, đây là một sự phát triển tích cực.' },
      { en: 'Personally, I am strongly in favour of ...', vi: 'Cá nhân tôi rất ủng hộ ...' },
    ],
  },
  {
    id: 'example',
    title: 'Nêu ví dụ & dẫn chứng',
    items: [
      { en: 'For example, ...', vi: 'Ví dụ, ...' },
      { en: 'For instance, many students in my city ...', vi: 'Chẳng hạn, nhiều sinh viên ở thành phố tôi ...' },
      { en: 'A good illustration of this is ...', vi: 'Một minh chứng rõ cho điều này là ...' },
      { en: 'This can be seen in the case of ...', vi: 'Có thể thấy điều này qua trường hợp của ...' },
      { en: 'According to a recent survey, ...', vi: 'Theo một khảo sát gần đây, ...' },
      { en: 'Take public transport as an example.', vi: 'Lấy giao thông công cộng làm ví dụ.' },
      { en: 'In practice, this means that ...', vi: 'Trên thực tế, điều này có nghĩa là ...' },
      { en: 'A typical example from my own experience is ...', vi: 'Một ví dụ điển hình từ trải nghiệm của tôi là ...' },
    ],
  },
  {
    id: 'compare',
    title: 'So sánh & nhượng bộ',
    items: [
      { en: 'On the one hand, ... ; on the other hand, ...', vi: 'Một mặt thì ... ; mặt khác thì ...' },
      { en: 'Although the cost is high, the long-term benefits are clear.', vi: 'Mặc dù chi phí cao nhưng lợi ích lâu dài là rõ ràng.' },
      { en: 'Even though many people disagree, I still think ...', vi: 'Dù nhiều người không đồng ý, tôi vẫn nghĩ ...' },
      { en: 'In contrast to the past, young people today ...', vi: 'Trái với trước đây, người trẻ ngày nay ...' },
      { en: 'Whereas some people prefer ..., others would rather ...', vi: 'Trong khi một số người thích ... thì người khác lại muốn ...' },
      { en: 'Compared with ten years ago, ... is far more ...', vi: 'So với mười năm trước, ... thì ... hơn nhiều.' },
      { en: 'Despite the fact that ..., the situation has improved.', vi: 'Bất chấp việc ..., tình hình đã được cải thiện.' },
      { en: 'It is true that ..., but we should not ignore ...', vi: 'Đúng là ..., nhưng chúng ta không nên bỏ qua ...' },
    ],
  },
  {
    id: 'conclusion',
    title: 'Kết luận',
    items: [
      { en: 'In conclusion, ...', vi: 'Kết luận lại, ...' },
      { en: 'To sum up, ...', vi: 'Tóm lại, ...' },
      { en: 'On balance, I believe that ...', vi: 'Sau khi cân nhắc, tôi tin rằng ...' },
      { en: 'Taking everything into account, ...', vi: 'Xét mọi khía cạnh, ...' },
      { en: 'It is therefore essential that governments ...', vi: 'Vì vậy, điều thiết yếu là chính phủ ...' },
      { en: 'In short, the advantages clearly outweigh the disadvantages.', vi: 'Nói ngắn gọn, lợi ích rõ ràng nhiều hơn bất lợi.' },
      { en: 'Overall, the evidence suggests that ...', vi: 'Nhìn chung, bằng chứng cho thấy rằng ...' },
    ],
  },
  {
    id: 'email',
    title: 'Email / thư',
    items: [
      { en: 'Dear Sir or Madam,', vi: 'Kính gửi Quý ông/Quý bà (khi không biết tên người nhận).' },
      { en: 'I am writing to enquire about the course starting in June.', vi: 'Tôi viết thư để hỏi về khoá học bắt đầu vào tháng Sáu.' },
      { en: 'I am writing to apply for the position of ...', vi: 'Tôi viết thư để ứng tuyển vị trí ...' },
      { en: 'I would be grateful if you could send me further details.', vi: 'Tôi rất biết ơn nếu ngài gửi cho tôi thêm thông tin chi tiết.' },
      { en: 'Could you please let me know whether ... ?', vi: 'Ngài có thể cho tôi biết liệu ... không?' },
      { en: 'Please find attached my CV and cover letter.', vi: 'Vui lòng xem CV và thư xin việc tôi đính kèm.' },
      { en: 'I look forward to hearing from you.', vi: 'Tôi mong nhận được hồi âm của ngài.' },
      { en: 'Thank you for your time and consideration.', vi: 'Cảm ơn ngài đã dành thời gian xem xét.' },
      { en: 'Yours faithfully,', vi: 'Trân trọng (khi không biết tên người nhận).' },
      { en: 'Yours sincerely,', vi: 'Trân trọng (khi đã biết tên người nhận).' },
    ],
  },
];

export const speakingPhrases = [
  {
    id: 'part1',
    title: 'Part 1 · Trả lời câu hỏi ngắn',
    items: [
      { en: 'That is an interesting question. I would say ...', vi: 'Đó là câu hỏi thú vị. Tôi cho rằng ...' },
      { en: 'To be honest, I have never thought about that before.', vi: 'Thành thật mà nói, tôi chưa từng nghĩ về điều đó.' },
      { en: 'It depends on the situation, but generally ...', vi: 'Còn tuỳ tình huống, nhưng nhìn chung ...' },
      { en: 'Yes, definitely. The main reason is that ...', vi: 'Có, chắc chắn. Lý do chính là ...' },
      { en: 'Not really, because ...', vi: 'Không hẳn, bởi vì ...' },
      { en: 'If I had to choose, I would pick ...', vi: 'Nếu phải chọn, tôi sẽ chọn ...' },
      { en: 'Well, that is quite a common question here.', vi: 'À, đó là câu hỏi khá phổ biến ở đây.' },
      { en: 'I would say yes, simply because ...', vi: 'Tôi nghĩ là có, đơn giản vì ...' },
    ],
  },
  {
    id: 'part2',
    title: 'Part 2 · Thảo luận tình huống & giải pháp',
    items: [
      { en: 'The main problem here is that ...', vi: 'Vấn đề chính ở đây là ...' },
      { en: 'One practical solution would be to ...', vi: 'Một giải pháp thiết thực là ...' },
      { en: 'Another option is to encourage people to ...', vi: 'Một lựa chọn khác là khuyến khích mọi người ...' },
      { en: 'This would help because ...', vi: 'Điều này sẽ giúp ích vì ...' },
      { en: 'The best way to deal with this is to ...', vi: 'Cách tốt nhất để xử lý việc này là ...' },
      { en: 'I agree with your point, and I would add that ...', vi: 'Tôi đồng ý với ý của bạn, và tôi muốn nói thêm rằng ...' },
      { en: 'That is a fair point, although I am not sure it would work in practice.', vi: 'Đó là ý hợp lý, dù tôi không chắc nó hiệu quả trên thực tế.' },
      { en: 'Shall we move on to the next option?', vi: 'Chúng ta chuyển sang phương án tiếp theo nhé?' },
    ],
  },
  {
    id: 'part3',
    title: 'Part 3 · Phát triển chủ đề',
    items: [
      { en: 'In my country, this issue is quite common among young people.', vi: 'Ở nước tôi, vấn đề này khá phổ biến trong giới trẻ.' },
      { en: 'From what I have read, the trend has changed over the last ten years.', vi: 'Theo những gì tôi đọc được, xu hướng này đã thay đổi trong mười năm qua.' },
      { en: 'One example from my own experience is ...', vi: 'Một ví dụ từ trải nghiệm của chính tôi là ...' },
      { en: 'This affects not only individuals but also society as a whole.', vi: 'Điều này ảnh hưởng không chỉ cá nhân mà cả toàn xã hội.' },
      { en: 'Compared with twenty years ago, people now ...', vi: 'So với hai mươi năm trước, bây giờ mọi người ...' },
      { en: 'The government could play a bigger role by ...', vi: 'Chính phủ có thể đóng vai trò lớn hơn bằng cách ...' },
      { en: 'In the long term, this could lead to ...', vi: 'Về lâu dài, điều này có thể dẫn tới ...' },
      { en: 'It really depends on how we measure success.', vi: 'Điều đó còn tuỳ vào cách chúng ta đo lường thành công.' },
    ],
  },
  {
    id: 'extend',
    title: 'Kéo dài câu trả lời',
    items: [
      { en: 'Let me give you an example.', vi: 'Để tôi lấy một ví dụ.' },
      { en: 'The reason I say that is ...', vi: 'Lý do tôi nói vậy là ...' },
      { en: 'What I mean by that is ...', vi: 'Ý tôi là ...' },
      { en: 'Another thing worth mentioning is ...', vi: 'Một điều đáng nói nữa là ...' },
      { en: 'And on top of that, ...', vi: 'Và thêm vào đó, ...' },
      { en: 'That is why I think ...', vi: 'Đó là lý do tôi nghĩ ...' },
      { en: 'To put it another way, ...', vi: 'Nói cách khác, ...' },
    ],
  },
  {
    id: 'stall',
    title: 'Khi bí ý',
    items: [
      { en: 'That is a tricky question. Let me think for a moment.', vi: 'Câu hỏi này hơi khó. Để tôi nghĩ một chút.' },
      { en: 'I am not entirely sure, but I would guess that ...', vi: 'Tôi không chắc lắm, nhưng tôi đoán rằng ...' },
      { en: 'I have not thought about it much, but ...', vi: 'Tôi chưa nghĩ nhiều về điều đó, nhưng ...' },
      { en: 'How can I put this? I suppose ...', vi: 'Nói thế nào nhỉ? Tôi cho rằng ...' },
      { en: 'Sorry, could you repeat the question, please?', vi: 'Xin lỗi, bạn nhắc lại câu hỏi giúp tôi được không?' },
      { en: 'Let me start with the simplest point.', vi: 'Để tôi bắt đầu bằng ý đơn giản nhất.' },
      { en: 'Anyway, what I really want to say is ...', vi: 'Dù sao, điều tôi thực sự muốn nói là ...' },
    ],
  },
];

export const commonMistakes = [
  { wrong: 'I very like English.', right: 'I really like English.', note: '“Very” không đứng trước động từ; dùng “really” hoặc “like ... very much”.' },
  { wrong: 'She has 20 years old.', right: 'She is 20 years old.', note: 'Tuổi dùng động từ “be”, không dùng “have”.' },
  { wrong: 'I am living here since 2019.', right: 'I have lived here since 2019.', note: '“Since/for” đi với thì hiện tại hoàn thành.' },
  { wrong: 'Yesterday I go to the market.', right: 'Yesterday I went to the market.', note: 'Có mốc thời gian quá khứ thì động từ phải chia ở quá khứ.' },
  { wrong: 'He suggested me to take a break.', right: 'He suggested that I take a break.', note: '“Suggest” không theo cấu trúc “suggest sb to do sth”.' },
  { wrong: 'I look forward to see you.', right: 'I look forward to seeing you.', note: 'Sau “look forward to” là V-ing.' },
  { wrong: 'Despite of the rain, we went out.', right: 'Despite the rain, we went out.', note: '“Despite” không đi với “of”; chỉ “in spite of” mới có “of”.' },
  { wrong: 'The information are useful.', right: 'The information is useful.', note: '“Information” là danh từ không đếm được, chia số ít.' },
  { wrong: 'I have many homeworks.', right: 'I have a lot of homework.', note: '“Homework” không đếm được, không thêm “s”.' },
  { wrong: 'We discussed about the plan.', right: 'We discussed the plan.', note: '“Discuss” là ngoại động từ, không cần “about”.' },
  { wrong: 'He is married with a doctor.', right: 'He is married to a doctor.', note: 'Cụm cố định “be married to sb”.' },
  { wrong: 'I will arrive in Monday.', right: 'I will arrive on Monday.', note: 'Trước thứ/ngày dùng “on”, trước tháng/năm dùng “in”.' },
  { wrong: 'Please give me an advice.', right: 'Please give me some advice.', note: '“Advice” không đếm được nên không dùng “an”.' },
  { wrong: 'Although it was raining, but we played football.', right: 'Although it was raining, we played football.', note: 'Không dùng “although” và “but” trong cùng một câu.' },
  { wrong: 'My English is more better now.', right: 'My English is much better now.', note: '“Better” đã là so sánh hơn, không thêm “more”.' },
  { wrong: 'I am boring with this lesson.', right: 'I am bored with this lesson.', note: '“Bored” = cảm thấy chán; “boring” = gây chán.' },
  { wrong: 'She is interested on music.', right: 'She is interested in music.', note: 'Cụm cố định “interested in”.' },
  { wrong: 'I have been to Ha Noi last year.', right: 'I went to Ha Noi last year.', note: 'Không dùng “have been to” với mốc thời gian đã kết thúc.' },
  { wrong: 'Do more exercise is good for health.', right: 'Doing more exercise is good for your health.', note: 'Chủ ngữ là hành động thì phải dùng V-ing (danh động từ).' },
  { wrong: 'I want that you help me.', right: 'I want you to help me.', note: 'Cấu trúc đúng là “want sb to do sth”.' },
  { wrong: 'The number of students are increasing.', right: 'The number of students is increasing.', note: 'Chủ ngữ là “the number of” nên chia số ít.' },
];
