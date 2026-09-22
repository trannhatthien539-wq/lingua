/**
 * Bài tập viết B1 theo dạng đề thi: email/letter, nêu ý kiến, mô tả.
 * Mỗi bài có tình huống, yêu cầu, số từ tối thiểu, checklist tự chấm và bài mẫu.
 */
export const writingTasks = [
  {
    id: 'invite-friend',
    type: 'email',
    title: 'Mời bạn đi chơi cuối tuần',
    situation: 'Bạn vừa biết một hội chợ sách sẽ diễn ra ở thành phố vào cuối tuần này.',
    task: 'Viết email (100–130 từ) cho một người bạn: nói về sự kiện, mời bạn ấy đi cùng, đề xuất thời gian và nơi gặp, và hỏi bạn ấy có rảnh không.',
    minWords: 100,
    checklist: [
      { label: 'Có lời chào và lời kết', hint: 'Hi Nam, … / See you soon, Linh' },
      { label: 'Nêu rõ sự kiện và thời gian', hint: 'There is a book fair at the city centre this Saturday and Sunday.' },
      { label: 'Có lời mời', hint: 'Would you like to come with me?' },
      { label: 'Đề xuất thời gian và địa điểm gặp', hint: 'Shall we meet at 9 a.m. in front of the main gate?' },
      { label: 'Hỏi lại để xác nhận', hint: 'Let me know if that works for you.' },
      { label: 'Dùng ít nhất 2 cấu trúc tương lai', hint: 'will / be going to / shall we' },
    ],
    model: `Hi Nam,

How are you? I hope your exams went well.

I am writing because there is a book fair at the city centre this Saturday and Sunday. There will be more than fifty stalls, and some writers are going to talk about their new books. I know you enjoy history books, so I think you would like it.

Would you like to come with me on Saturday morning? Shall we meet at 9 a.m. in front of the main gate? If that is too early, we can go in the afternoon instead.

Let me know if that works for you.

See you soon,
Linh`,
    phrases: [
      { phrase: 'I am writing because…', meaning: 'tôi viết thư vì…' },
      { phrase: 'Would you like to come with me?', meaning: 'bạn có muốn đi cùng tôi không?' },
      { phrase: 'Shall we meet at…?', meaning: 'chúng ta gặp nhau lúc… nhé?' },
      { phrase: 'Let me know if that works for you', meaning: 'cho tôi biết nếu bạn sắp xếp được' },
    ],
  },
  {
    id: 'apology-late',
    type: 'email',
    title: 'Xin lỗi vì không đến được',
    situation: 'Bạn đã hẹn gặp bạn để cùng làm bài nhóm nhưng bị ốm nên không đến được.',
    task: 'Viết email (90–120 từ): xin lỗi, giải thích lý do, đề nghị một buổi khác và nói bạn sẽ làm gì để bù lại.',
    minWords: 90,
    checklist: [
      { label: 'Xin lỗi ngay đầu thư', hint: 'I am really sorry that I could not come…' },
      { label: 'Nêu lý do rõ ràng', hint: 'I caught a cold on Friday evening.' },
      { label: 'Đề xuất buổi khác', hint: 'Could we meet on Wednesday instead?' },
      { label: 'Nói cách bù lại', hint: 'I have already finished my part of the report.' },
      { label: 'Giọng điệu lịch sự, không dùng từ quá suồng sã', hint: 'I am sorry / Could we / I hope' },
    ],
    model: `Hi Hoa,

I am really sorry that I could not come to the library yesterday. I caught a cold on Friday evening and I had a high temperature, so I stayed at home and slept most of the day. I should have written to you earlier.

Could we meet on Wednesday afternoon instead? I have already finished my part of the report, so we only need to check the introduction together. If Wednesday is difficult for you, please tell me which day suits you best.

I hope you are not too annoyed with me. Thanks for your understanding.

Best wishes,
Minh`,
    phrases: [
      { phrase: 'I am really sorry that…', meaning: 'tôi rất xin lỗi vì…' },
      { phrase: 'I should have written to you earlier', meaning: 'lẽ ra tôi nên viết cho bạn sớm hơn' },
      { phrase: 'Could we meet … instead?', meaning: 'chúng ta gặp … thay được không?' },
      { phrase: 'which day suits you best', meaning: 'ngày nào tiện cho bạn nhất' },
    ],
  },
  {
    id: 'opinion-online',
    type: 'opinion',
    title: 'Học online có tốt hơn học trên lớp?',
    situation: 'Trường của bạn đang hỏi ý kiến học sinh về việc tăng số tiết học trực tuyến.',
    task: 'Viết đoạn văn nêu ý kiến (120–150 từ): nêu quan điểm, đưa 2 lý do kèm ví dụ, và kết luận.',
    minWords: 120,
    checklist: [
      { label: 'Nêu quan điểm rõ ở câu đầu', hint: 'In my opinion, online lessons should support, not replace, classroom lessons.' },
      { label: 'Có 2 lý do, mỗi lý do có ví dụ', hint: 'First… For example… Second… For instance…' },
      { label: 'Dùng từ nối', hint: 'However, In addition, As a result' },
      { label: 'Kết luận ngắn', hint: 'For these reasons, I believe…' },
      { label: 'Có ít nhất 1 câu phức', hint: 'although / because / which' },
    ],
    model: `In my opinion, online lessons are useful, but they should support classroom lessons rather than replace them.

First, studying online is flexible. Students can watch a difficult explanation again when they need it, which is impossible in a normal lesson. Last term, for example, I repeated a grammar video three times before I understood the passive voice. Second, however, learning alone at home is harder than many people expect. When we study in class, the teacher notices immediately if we are confused, and classmates can explain things in a simpler way.

For these reasons, I believe the best solution is a mix: theory and revision online, and discussion and practice in class. This gives students flexibility without losing the help and motivation of a real classroom.`,
    phrases: [
      { phrase: 'In my opinion, …', meaning: 'theo ý tôi, …' },
      { phrase: 'rather than replace them', meaning: 'thay vì thay thế chúng' },
      { phrase: 'For these reasons, I believe…', meaning: 'vì những lý do này, tôi tin rằng…' },
      { phrase: 'this gives students flexibility without losing…', meaning: 'điều này cho học sinh sự linh hoạt mà không mất…' },
    ],
  },
  {
    id: 'opinion-city',
    type: 'opinion',
    title: 'Có nên cấm xe máy trong trung tâm?',
    situation: 'Thành phố của bạn đang cân nhắc cấm xe máy ở một số tuyến phố trung tâm vào giờ cao điểm.',
    task: 'Viết đoạn văn (120–150 từ): nêu ý kiến, đưa lợi ích và bất lợi, kết luận bằng một đề xuất.',
    minWords: 120,
    checklist: [
      { label: 'Có quan điểm rõ ràng', hint: 'I partly agree with this plan.' },
      { label: 'Nêu ít nhất một lợi ích', hint: 'less noise, cleaner air, safer streets' },
      { label: 'Nêu ít nhất một bất lợi', hint: 'Many people cannot afford a car.' },
      { label: 'Đề xuất giải pháp', hint: 'The city should provide more buses first.' },
      { label: 'Dùng đúng cấu trúc câu điều kiện hoặc bị động', hint: 'If the buses were free, … / Bikes should be allowed…' },
    ],
    model: `I partly agree with the plan to ban motorbikes from the city centre during rush hour.

On one hand, the advantages are clear. The air in the centre is unhealthy, and most of the noise comes from motorbikes. If fewer motorbikes entered the centre, the streets would be quieter and safer for children and older people.

On the other hand, the plan may be unfair to people who cannot afford a car or who live far from a bus route. If they are not given another option, they will simply be late for work every day.

In my view, the ban should be introduced slowly. The city should first add more buses, keep ticket prices low and allow electric bikes. If public transport is good enough, most people will change without being forced.`,
    phrases: [
      { phrase: 'I partly agree with…', meaning: 'tôi đồng ý một phần với…' },
      { phrase: 'On one hand… On the other hand…', meaning: 'một mặt… mặt khác…' },
      { phrase: 'may be unfair to people who…', meaning: 'có thể bất công với những người…' },
      { phrase: 'should be introduced slowly', meaning: 'nên được áp dụng từ từ' },
    ],
  },
  {
    id: 'describe-place',
    type: 'describe',
    title: 'Mô tả một nơi đáng đến ở Việt Nam',
    situation: 'Một người bạn nước ngoài hỏi bạn nên đi đâu khi đến Việt Nam lần đầu.',
    task: 'Viết đoạn mô tả (110–140 từ): giới thiệu địa điểm, nói nó ở đâu, có gì đáng chú ý, và vì sao bạn giới thiệu.',
    minWords: 110,
    checklist: [
      { label: 'Giới thiệu nơi đó ở đâu', hint: 'It is in the north of Vietnam, about three hours from Hanoi.' },
      { label: 'Dùng ít nhất 3 tính từ miêu tả', hint: 'peaceful, narrow, colourful' },
      { label: 'Có chi tiết cụ thể', hint: 'old houses, a market, boats on the river' },
      { label: 'Nêu lý do giới thiệu', hint: 'That is why I would recommend…' },
      { label: 'Dùng “there is / there are” hợp lý', hint: 'There are hundreds of small boats…' },
    ],
    model: `If you are visiting Vietnam for the first time, I would recommend a small town called Ninh Binh.

It is in the north of the country, about two hours south of Hanoi, so it is easy to reach by train or bus. The landscape is the most interesting part: there are tall limestone mountains next to narrow rivers, and farmers work in the rice fields between them.

The best thing to do is to take a small wooden boat along the river. The boats are rowed by local women, often with their feet, which surprises every visitor. You can also visit the old capital and cycle through quiet villages.

I recommend it because it is peaceful but not boring, and it is much less crowded than the more famous places in Vietnam.`,
    phrases: [
      { phrase: 'If you are visiting … for the first time', meaning: 'nếu bạn đến … lần đầu' },
      { phrase: 'The landscape is the most interesting part', meaning: 'phong cảnh là phần thú vị nhất' },
      { phrase: 'The best thing to do is to…', meaning: 'điều nên làm nhất là…' },
      { phrase: 'peaceful but not boring', meaning: 'yên tĩnh nhưng không nhàm chán' },
    ],
  },
  {
    id: 'report-bad-service',
    type: 'email',
    title: 'Phàn nàn về một dịch vụ',
    situation: 'Bạn đặt một chiếc máy nghe nhạc qua mạng, nhưng nhận được hàng sai và bị hỏng.',
    task: 'Viết email (110–140 từ): nói bạn đã đặt gì, vấn đề là gì, bạn đã thử giải quyết thế nào và bạn muốn họ làm gì.',
    minWords: 110,
    checklist: [
      { label: 'Nêu rõ đơn hàng và ngày', hint: 'I ordered a music player (order number 41257) on 2 September.' },
      { label: 'Mô tả vấn đề cụ thể', hint: 'The box contained a different model, and it does not switch on.' },
      { label: 'Nói bạn đã liên hệ thế nào', hint: 'I called your office twice but nobody replied.' },
      { label: 'Yêu cầu cụ thể', hint: 'I would like a refund or a replacement.' },
      { label: 'Giữ giọng lịch sự nhưng rõ ràng', hint: 'I hope we can solve this quickly.' },
    ],
    model: `Dear Sir or Madam,

I am writing to complain about an order I received last week.

On 2 September I ordered a music player from your website (order number 41257). The parcel arrived three days later, but the box contained a different model from the one in your advertisement, and it does not switch on at all. I called your office twice on Monday, and I also sent an email, but I have not received a reply.

I would like you to either send the correct model or give me a refund of 850,000 dong. I am happy to return the wrong item by post if you send me a label.

I have been a customer for two years and I hope we can solve this quickly.

Yours faithfully,
Tuan`,
    phrases: [
      { phrase: 'I am writing to complain about…', meaning: 'tôi viết thư để phàn nàn về…' },
      { phrase: 'a different model from the one in your advertisement', meaning: 'một mẫu khác so với quảng cáo' },
      { phrase: 'I would like you to either … or …', meaning: 'tôi muốn quý công ty hoặc … hoặc …' },
      { phrase: 'Yours faithfully', meaning: 'kính thư (khi không biết tên người nhận)' },
    ],
  },
  {
    id: 'vstep-task1-letter',
    type: 'email',
    title: 'VSTEP · Task 1 – Thư hỏi thông tin khoá học',
    situation: 'Bạn muốn tham gia một khoá học tiếng Anh buổi tối và đã thấy quảng cáo của một trung tâm anh ngữ gần nhà.',
    task: 'Viết lá thư (khoảng 120 từ) cho trung tâm theo dạng VSTEP Writing Task 1: nói bạn quan tâm đến khoá học buổi tối, hỏi học phí có bao gồm giáo trình không, hỏi ngày khai giảng và sĩ số mỗi lớp, và hỏi bạn cần làm gì để đăng ký.',
    minWords: 120,
    checklist: [
      { label: 'Có lời chào và lời kết đúng thư trang trọng', hint: 'Dear Sir or Madam, … / Yours faithfully,' },
      { label: 'Nêu lý do viết thư ngay đầu thư', hint: 'I am writing to ask for some information about the evening English course.' },
      { label: 'Hỏi về học phí', hint: 'Could you tell me how much the course costs?' },
      { label: 'Hỏi về ngày khai giảng và sĩ số lớp', hint: 'I would also like to know when the next class begins and how many students there are in a group.' },
      { label: 'Hỏi cách đăng ký', hint: 'What should I do to register?' },
      { label: 'Dùng ít nhất 2 câu hỏi gián tiếp', hint: 'Could you tell me… / I would like to know… / Do you know if…' },
    ],
    model: `Dear Sir or Madam,

I am writing to ask for some information about the evening English course that I saw on your website.

I finished my English course at university two years ago, and I would like to improve my speaking before I take the VSTEP exam in September.

Could you tell me how much the course costs and whether the fee includes the course book? I would also like to know when the next class begins and how many students there are in a group. Finally, could you tell me if I need to take a placement test, and what I should do to register?

I would be grateful if you could send me these details. I am available on 0912 345 678 if it is easier to call.

Yours faithfully,
Nguyen Minh Anh`,
    phrases: [
      { phrase: 'I am writing to ask for some information about…', meaning: 'tôi viết thư để hỏi thông tin về…' },
      { phrase: 'Could you tell me how much the course costs?', meaning: 'ông/bà có thể cho tôi biết học phí không?' },
      { phrase: 'I would also like to know…', meaning: 'tôi cũng muốn biết…' },
      { phrase: 'I would be grateful if you could send me these details', meaning: 'tôi rất biết ơn nếu ông/bà gửi cho tôi những thông tin này' },
    ],
  },
  {
    id: 'vstep-task2-essay',
    type: 'opinion',
    title: 'VSTEP · Task 2 – Bài luận: học đại học hay học nghề?',
    situation: 'Nhiều học sinh lớp 12 ở Việt Nam phân vân giữa việc thi vào đại học và học một nghề sau khi tốt nghiệp.',
    task: 'Viết bài luận (khoảng 250 từ) theo dạng VSTEP Writing Task 2: nêu ý kiến của bạn về việc nên học đại học hay học nghề, đưa ít nhất hai lý do kèm ví dụ, xét một ý kiến trái chiều và kết luận.',
    minWords: 250,
    checklist: [
      { label: 'Mở bài nêu rõ quan điểm', hint: 'In my opinion, the choice should depend on the student’s abilities.' },
      { label: 'Có 2 đoạn thân bài, mỗi đoạn một lý do', hint: 'First, … Second, …' },
      { label: 'Mỗi lý do có ví dụ hoặc số liệu', hint: 'A trained mechanic can start earning within two years.' },
      { label: 'Có ít nhất một câu xét ý kiến trái chiều', hint: 'Of course, some people argue that a degree is still the safest route.' },
      { label: 'Dùng từ nối học thuật', hint: 'Moreover, Nevertheless, In contrast, For these reasons' },
      { label: 'Kết luận khẳng định lại quan điểm', hint: 'For these reasons, I firmly believe that…' },
    ],
    model: `Every year, thousands of Vietnamese students have to choose between entering a university and learning a trade. Many families treat this as an easy decision, because a degree has long been seen as the only respectable path to success. In my opinion, however, the choice should depend on the student’s abilities, and vocational training deserves far more respect than it receives today.

First, a vocational qualification often leads to work more quickly, and this matters enormously for families with limited income. University courses usually last four years, and graduates may then spend another year looking for a suitable job. A trained mechanic, chef or nurse, in contrast, can start earning within two years and can continue studying later if they wish. In Vietnam, many employers in manufacturing and tourism complain that they cannot find enough skilled workers, even while thousands of graduates are unemployed. This suggests that the labour market, not tradition, should guide the decision.

Of course, some people argue that a degree is still the safest route. Certain professions, such as medicine and law, are impossible to enter without a university education, and graduates often earn more over a lifetime. Nevertheless, a degree is not a guarantee. Many students choose subjects because their friends do, then graduate with heavy debts and no clear direction. If the same four years were spent learning a skill and gaining real experience, the results might be far better.

For these reasons, I firmly believe that universities and vocational schools should be seen as equal options. Governments should invest in high-quality training centres, and schools should give students honest information about salaries and job prospects in both paths. The best choice is the one that matches the student, not the one that sounds more impressive.`,
    phrases: [
      { phrase: 'the choice should depend on the student’s abilities', meaning: 'lựa chọn nên dựa trên năng lực của học sinh' },
      { phrase: 'a vocational qualification leads to work more quickly', meaning: 'bằng nghề giúp có việc làm nhanh hơn' },
      { phrase: 'a degree is not a guarantee', meaning: 'bằng đại học không phải là sự bảo đảm' },
      { phrase: 'invest in high-quality training centres', meaning: 'đầu tư vào các trung tâm đào tạo chất lượng cao' },
    ],
  },
]

export const writingById = (id) => writingTasks.find((task) => task.id === id) || writingTasks[0]
