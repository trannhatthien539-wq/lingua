/**
 * Đề VSTEP B1 số 2 — chủ đề công việc & giao tiếp (nội dung gốc, viết theo đúng format đề thi).
 * Xem `docs/vstep-schema.md` để biết ý nghĩa từng field.
 */
export default {
  id: 'b1-02',
  level: 'B1',
  title: 'Đề B1 số 2 · Công việc & giao tiếp',
  tags: ['công việc', 'giao tiếp', 'B1'],

  listening: {
    minutes: 40,
    parts: [
      {
        id: 'L1',
        title: 'Part 1 · Thông báo ngắn',
        instruction: 'Bạn sẽ nghe 8 thông báo ngắn trong công việc. Mỗi thông báo có một câu hỏi. Chọn đáp án đúng nhất.',
        transcript: [
          { speaker: 'Narrator', line: 'Announcement one. Good morning, everyone. The Friday team meeting will start at half past ten, not at nine, because Mr Hieu is arriving from the airport at ten. Please send your weekly updates to Hoa before Thursday afternoon.' },
          { speaker: 'Narrator', line: 'Announcement two. This is a message for all visitors. Please sign in at the front desk, collect a visitor badge and wear it while you are in the building. The badge must be returned when you leave.' },
          { speaker: 'Narrator', line: 'Announcement three. The staff kitchen on the fourth floor is closed until Wednesday because the water pipes are being repaired. Hot drinks are available at the coffee corner on the ground floor, next to the lifts.' },
          { speaker: 'Narrator', line: 'Announcement four. Free Excel training will take place on Tuesday at two in the afternoon in room 2B. There are only twelve places. If you would like to join, please email the human resources office today.' },
          { speaker: 'Narrator', line: 'Announcement five. A parcel for the sales team arrived this morning. It is at reception, and the delivery company asks us to collect it before six o’clock today.' },
          { speaker: 'Narrator', line: 'Announcement six. Our email system will be offline on Saturday morning between eight and nine o’clock while we install new software. Please save any important work on Friday evening.' },
          { speaker: 'Narrator', line: 'Announcement seven. I am happy to confirm that in March the company will move to a new office near the central bus station. The new building has a larger car park and a canteen on the ground floor.' },
          { speaker: 'Narrator', line: 'Announcement eight. This is a message for Ms Mai from Mr Brown. He is sorry, but he cannot come to the interview at three o’clock on Thursday. He would like to change it to Friday morning and asks you to confirm the exact time.' },
        ],
        questions: [
          { id: 'L1-1', type: 'choice', prompt: 'What time will the Friday meeting start?', options: ['Nine o’clock', 'Ten o’clock', 'Half past ten', 'Eleven o’clock'], answer: 'Half past ten', explain: 'Cuộc họp đổi từ 9 giờ sang 10 giờ 30.' },
          { id: 'L1-2', type: 'choice', prompt: 'What must visitors do while they are in the building?', options: ['Wear a visitor badge', 'Leave their bag at the desk', 'Sign in every hour', 'Pay a small fee'], answer: 'Wear a visitor badge', explain: 'Khách phải đeo thẻ khách trong toàn bộ thời gian ở trong toà nhà.' },
          { id: 'L1-3', type: 'choice', prompt: 'Where can staff get hot drinks this week?', options: ['In the fourth-floor kitchen', 'At the coffee corner on the ground floor', 'In the meeting room', 'At the front desk'], answer: 'At the coffee corner on the ground floor', explain: 'Bếp tầng 4 đóng để sửa ống nước, đồ uống nóng ở quầy cà phê tầng trệt.' },
          { id: 'L1-4', type: 'choice', prompt: 'How can staff join the training?', options: ['By calling room 2B', 'By signing a list at reception', 'By emailing the HR office', 'By asking their manager'], answer: 'By emailing the HR office', explain: '“please email the human resources office today”.' },
          { id: 'L1-5', type: 'choice', prompt: 'By what time should the parcel be collected?', options: ['Before four o’clock', 'Before five o’clock', 'Before six o’clock', 'Before seven o’clock'], answer: 'Before six o’clock', explain: '“collect it before six o’clock today”.' },
          { id: 'L1-6', type: 'choice', prompt: 'What should staff do on Friday evening?', options: ['Install new software', 'Save important work', 'Check the network cable', 'Delete old emails'], answer: 'Save important work', explain: 'Hệ thống email bảo trì sáng thứ Bảy nên phải lưu việc quan trọng từ tối thứ Sáu.' },
          { id: 'L1-7', type: 'choice', prompt: 'What will happen in March?', options: ['The company will move office', 'The canteen will close', 'The bus station will move', 'The car park will be rebuilt'], answer: 'The company will move office', explain: 'Công ty chuyển sang toà nhà mới gần bến xe buýt trung tâm.' },
          { id: 'L1-8', type: 'choice', prompt: 'What does Mr Brown want to change?', options: ['The place of the interview', 'The time of his interview', 'The person who interviews him', 'The documents he must send'], answer: 'The time of his interview', explain: 'Ông Brown muốn đổi buổi phỏng vấn sang sáng thứ Sáu.' },
        ],
      },
      {
        id: 'L2',
        title: 'Part 2 · Hội thoại',
        instruction: 'Bạn sẽ nghe 2 đoạn hội thoại. Mỗi đoạn có 6 câu hỏi.',
        transcript: [
          { speaker: 'Recruiter', line: 'Good afternoon, Sunrise Bookshop. How can I help you?' },
          { speaker: 'Phong', line: 'Hello. I saw your advertisement for a part-time assistant and I would like to apply.' },
          { speaker: 'Recruiter', line: 'Great. The job is in customer service, so you will help customers find books and use the till. We do not need any experience, but you must be able to work in the evenings.' },
          { speaker: 'Phong', line: 'That is fine. How many hours a week?' },
          { speaker: 'Recruiter', line: 'About twenty. You can work from five to nine in the evening, Monday to Friday, or you can take two full weekend shifts instead. Most students choose the weekends.' },
          { speaker: 'Phong', line: 'I have classes every evening, so the weekend option suits me better.' },
          { speaker: 'Recruiter', line: 'That works. The pay is thirty thousand dong an hour, and staff get a ten per cent discount in the shop.' },
          { speaker: 'Phong', line: 'When can I come for an interview?' },
          { speaker: 'Recruiter', line: 'We are interviewing on Wednesday at ten in the morning, in the office above the bank, on the second floor. Please bring your CV and your identity card.' },
          { speaker: 'Phong', line: 'Should I prepare anything else?' },
          { speaker: 'Recruiter', line: 'Just be ready to talk about your studies for five minutes. The interview itself takes about twenty minutes.' },
          { speaker: 'Phong', line: 'And if I get the job, when do I start?' },
          { speaker: 'Recruiter', line: 'Training starts on the first of next month and lasts three days. You are paid during training.' },
          { speaker: 'Phong', line: 'That sounds good. See you on Wednesday.' },
          { speaker: 'Narrator', line: 'Now listen to a conversation between two colleagues in an office.' },
          { speaker: 'Mai', line: 'Tuan, how is the report for the Green Farm client going?' },
          { speaker: 'Tuan', line: 'I have finished the first two sections, but I am still waiting for the sales numbers from the finance team.' },
          { speaker: 'Mai', line: 'The client is coming on Thursday morning, so we must send the report by Wednesday at noon.' },
          { speaker: 'Tuan', line: 'That could be a problem. Finance promised the numbers this afternoon.' },
          { speaker: 'Mai', line: 'If they are late, use last month’s figures and write a short note under the table. Do not leave it empty.' },
          { speaker: 'Tuan', line: 'OK. Should I write the summary myself?' },
          { speaker: 'Mai', line: 'Yes, but keep it to one page. Last time the client complained that our summary was four pages long.' },
          { speaker: 'Tuan', line: 'I will shorten it. Do you want the graphs in colour?' },
          { speaker: 'Mai', line: 'Black and white, please. The client prints everything before the meeting.' },
          { speaker: 'Tuan', line: 'Understood. And who will present the report?' },
          { speaker: 'Mai', line: 'You present the first part, and I will answer the questions about the budget.' },
          { speaker: 'Tuan', line: 'Can we practise together on Wednesday afternoon?' },
          { speaker: 'Mai', line: 'Yes, in the small meeting room at three. I will book it this evening.' },
          { speaker: 'Tuan', line: 'Great. I will email you the draft tomorrow morning.' },
        ],
        questions: [
          { id: 'L2-1', type: 'choice', prompt: 'What is the job?', options: ['A bookshop manager', 'A customer service assistant', 'A delivery driver', 'A cleaner'], answer: 'A customer service assistant', explain: 'Công việc là trợ lý bán hàng/chăm sóc khách hàng ở hiệu sách.' },
          { id: 'L2-2', type: 'choice', prompt: 'What experience is required for the job?', options: ['One year in a shop', 'Experience with a till only', 'No experience', 'A university degree'], answer: 'No experience', explain: '“We do not need any experience.”' },
          { id: 'L2-3', type: 'fill', prompt: 'Phong chooses the weekend shifts because he has classes every ___. (one word)', answers: ['evening', 'evenings'], explain: '“I have classes every evening, so the weekend option suits me better.”' },
          { id: 'L2-4', type: 'choice', prompt: 'How much is the pay per hour?', options: ['Twenty thousand dong', 'Thirty thousand dong', 'Forty thousand dong', 'Fifty thousand dong'], answer: 'Thirty thousand dong', explain: '“The pay is thirty thousand dong an hour.”' },
          { id: 'L2-5', type: 'choice', prompt: 'What must Phong bring to the interview?', options: ['A letter from his teacher', 'His CV and identity card', 'Two photographs', 'A bank account number'], answer: 'His CV and identity card', explain: '“Please bring your CV and your identity card.”' },
          { id: 'L2-6', type: 'fill', prompt: 'Training lasts ___ days. (write the number)', answers: ['3', 'three'], explain: '“Training starts on the first of next month and lasts three days.”' },
          { id: 'L2-7', type: 'choice', prompt: 'What is Tuan waiting for?', options: ['The client’s answer', 'Sales numbers from finance', 'A new computer', 'Mai’s comments'], answer: 'Sales numbers from finance', explain: 'Tuan còn chờ số liệu bán hàng của phòng tài chính.' },
          { id: 'L2-8', type: 'choice', prompt: 'When must the report be sent?', options: ['Tuesday afternoon', 'Wednesday at noon', 'Thursday morning', 'Friday evening'], answer: 'Wednesday at noon', explain: 'Khách đến sáng thứ Năm nên phải gửi trước 12 giờ trưa thứ Tư.' },
          { id: 'L2-9', type: 'choice', prompt: 'What should Tuan do if the figures arrive late?', options: ['Use last month’s figures with a note', 'Leave the table empty', 'Call the client for the numbers', 'Ask the finance team to wait'], answer: 'Use last month’s figures with a note', explain: 'Dùng số liệu tháng trước và ghi chú ngắn, không để bảng trống.' },
          { id: 'L2-10', type: 'choice', prompt: 'Why must the summary be short?', options: ['The client complained about a long summary last time', 'The manager has no time to read it', 'The contract limits it to one page', 'The client cannot read English'], answer: 'The client complained about a long summary last time', explain: 'Lần trước khách phàn nàn bản tóm tắt dài bốn trang.' },
          { id: 'L2-11', type: 'choice', prompt: 'What colour should the graphs be, and why?', options: ['Colour, because the client likes them', 'Black and white, because the client prints everything', 'Colour, because it is cheaper', 'Black and white, because the printer is broken'], answer: 'Black and white, because the client prints everything', explain: 'Khách in tài liệu trước cuộc họp nên cần bản đen trắng.' },
          { id: 'L2-12', type: 'fill', prompt: 'They will practise in the small meeting room at ___ o’clock. (write the number)', answers: ['3', 'three'], explain: '“in the small meeting room at three”.' },
        ],
      },
      {
        id: 'L3',
        title: 'Part 3 · Bài nói',
        instruction: 'Bạn sẽ nghe 2 bài nói. Phần 1 có 8 câu hỏi, phần 2 có 7 câu hỏi.',
        transcript: [
          { speaker: 'Lecturer', line: 'Good morning. Today I want to talk about something we do every day but rarely study: writing emails at work. In one survey of office workers in three countries, people reported spending about two and a half hours a day reading and writing messages.' },
          { speaker: 'Lecturer', line: 'Here is the first finding. Most of those emails were first read on a phone, in a lift, in a queue or between two meetings. So the first line decides whether the rest is read at all. If your first sentence is “I hope you are well”, the reader still does not know why you wrote.' },
          { speaker: 'Lecturer', line: 'The second finding is about requests. When an email contains three or four requests, the reader usually answers only one — normally the last one. So the rule we teach is simple: one email, one request.' },
          { speaker: 'Lecturer', line: 'Third, use the subject line as a label, not a title. “Invoice 402 — please approve by Friday” tells the reader what to do before opening the message. “Quick question” tells them nothing.' },
          { speaker: 'Lecturer', line: 'Fourth, be careful with phrases such as “as discussed”. They save you one line, but you are the only person who remembers the conversation. Add one sentence of context instead.' },
          { speaker: 'Lecturer', line: 'Fifth, know when to stop writing. If your explanation needs more than five lines, the topic probably needs a short call. Emails are good for decisions, not for discussions.' },
          { speaker: 'Lecturer', line: 'Finally, speed. In most jobs a reply within one working day is enough, but a reply that says “I have received your message and will answer on Thursday” is much better than silence.' },
          { speaker: 'Lecturer', line: 'So: one line that states the purpose, one request, a clear subject, a little context, and a fast answer. Nothing here is difficult; the difficulty is doing it every time.' },
          { speaker: 'Narrator', line: 'Now listen to a short radio report about a company that changed its working week.' },
          { speaker: 'Presenter', line: 'Now, a story from a small software company in our region. It has forty employees, and eighteen months ago the manager decided to try something that sounds impossible for a business: a four-day working week.' },
          { speaker: 'Presenter', line: 'The rule was simple. The office closed on Friday, salaries did not change, and the same amount of work had to be finished. To make this possible, the company first cut the number of meetings. The short daily meeting stayed; other meetings were limited to twenty minutes and needed a written reason.' },
          { speaker: 'Presenter', line: 'The results after six months surprised everybody. Productivity rose by about twelve per cent, and the number of sick days fell by a third. Staff said they slept more and planned their work better.' },
          { speaker: 'Presenter', line: 'Customers were the main worry. What happens if a client calls on Friday? The company solved it with a rota: six volunteers take turns to answer urgent calls on Friday morning, and they get a free day in the following week.' },
          { speaker: 'Presenter', line: 'Not everything worked. Three employees left, because they preferred five shorter days to four long ones, and two of them had small children. The manager now says the four-day week suits some people and not others, and new staff hear about it at the interview.' },
          { speaker: 'Presenter', line: 'After one year, the company made the change permanent. When other managers ask how to start, the answer is always the same: do not begin with the calendar, begin with the meetings. If your week is full of long meetings, cutting a day will simply move the work to the evening.' },
          { speaker: 'Presenter', line: 'One more detail: the company does not allow overtime on Friday. The whole point of the experiment, the manager says, was to make people work better, not to make them work at the weekend.' },
        ],
        questions: [
          { id: 'L3-1', type: 'choice', prompt: 'What is the talk mainly about?', options: ['Writing clearer emails at work', 'How to chair a meeting', 'Using social media in the office', 'Preparing a job interview'], answer: 'Writing clearer emails at work', explain: 'Chủ đề chính là cách viết email công việc rõ ràng hơn.' },
          { id: 'L3-2', type: 'choice', prompt: 'How long do office workers spend on email each day?', options: ['About half an hour', 'About one hour', 'About two and a half hours', 'About five hours'], answer: 'About two and a half hours', explain: '“about two and a half hours a day”.' },
          { id: 'L3-3', type: 'choice', prompt: 'Why is the first line of an email so important?', options: ['It must be polite', 'Most emails are first read on a phone', 'It is the only line managers read', 'It shows the word count'], answer: 'Most emails are first read on a phone', explain: 'Phần lớn email được đọc lần đầu trên điện thoại, giữa những việc khác.' },
          { id: 'L3-4', type: 'choice', prompt: 'What happens when an email contains several requests?', options: ['The reader answers only one, usually the last', 'The reader forwards it to a manager', 'The reader deletes it', 'The reader calls the writer'], answer: 'The reader answers only one, usually the last', explain: 'Người đọc thường chỉ trả lời một yêu cầu, thường là yêu cầu cuối.' },
          { id: 'L3-5', type: 'choice', prompt: 'What should a subject line contain?', options: ['A friendly greeting', 'The action and the deadline', 'The name of the writer', 'A summary of the whole email'], answer: 'The action and the deadline', explain: 'Dòng tiêu đề nên nói rõ cần làm gì và hạn khi nào.' },
          { id: 'L3-6', type: 'choice', prompt: 'What is the problem with phrases such as “as discussed”?', options: ['They sound rude', 'Only the writer remembers the conversation', 'They are too formal', 'They cannot be translated'], answer: 'Only the writer remembers the conversation', explain: 'Cụm “as discussed” giả định người đọc còn nhớ cuộc trao đổi.' },
          { id: 'L3-7', type: 'choice', prompt: 'When should you make a call instead?', options: ['When the explanation needs more than five lines', 'When the reader is your manager', 'When you are angry', 'When the email is longer than one page'], answer: 'When the explanation needs more than five lines', explain: 'Giải thích quá 5 dòng thì nên gọi điện.' },
          { id: 'L3-8', type: 'fill', prompt: 'In most jobs a reply within one ___ day is enough. (one word)', answers: ['working'], explain: '“a reply within one working day is enough”.' },
          { id: 'L3-9', type: 'choice', prompt: 'What did the company decide to try?', options: ['A four-day working week', 'A new software product', 'Working from home two days a week', 'Hiring forty new employees'], answer: 'A four-day working week', explain: 'Công ty thử tuần làm việc 4 ngày.' },
          { id: 'L3-10', type: 'choice', prompt: 'What happened to salaries?', options: ['They were cut by twenty per cent', 'They stayed the same', 'They rose by twelve per cent', 'They were paid every Friday'], answer: 'They stayed the same', explain: '“salaries did not change”.' },
          { id: 'L3-11', type: 'choice', prompt: 'What change was noticed after six months?', options: ['Productivity rose by about twelve per cent', 'More staff were hired', 'The number of meetings doubled', 'Profits fell'], answer: 'Productivity rose by about twelve per cent', explain: 'Năng suất tăng khoảng 12%.' },
          { id: 'L3-12', type: 'choice', prompt: 'What happened to sick days?', options: ['They rose slightly', 'They fell by a third', 'They stayed the same', 'They doubled'], answer: 'They fell by a third', explain: 'Số ngày nghỉ ốm giảm một phần ba.' },
          { id: 'L3-13', type: 'choice', prompt: 'How are urgent calls handled on Friday?', options: ['By the manager alone', 'By a rota of six members of staff', 'By an answering machine', 'By an outside company'], answer: 'By a rota of six members of staff', explain: 'Sáu người tình nguyện thay phiên trực điện thoại sáng thứ Sáu.' },
          { id: 'L3-14', type: 'choice', prompt: 'Why did three employees leave the company?', options: ['They wanted higher pay', 'They preferred five shorter days', 'They moved to another city', 'They disliked the new office'], answer: 'They preferred five shorter days', explain: 'Họ thích 5 ngày ngắn hơn là 4 ngày dài.' },
          { id: 'L3-15', type: 'choice', prompt: 'What is the manager’s advice to other companies?', options: ['Start by cutting meetings', 'Start with a short trial in winter', 'Start by hiring more people', 'Start by paying higher salaries'], answer: 'Start by cutting meetings', explain: '“do not begin with the calendar, begin with the meetings”.' },
        ],
      },
    ],
  },

  reading: {
    minutes: 60,
    parts: [
      {
        id: 'R1',
        title: 'Part 1 · Văn bản ngắn',
        instruction: 'Đọc 10 văn bản ngắn về công việc và giao tiếp, chọn đáp án đúng cho mỗi câu hỏi.',
        passages: [
          {
            id: 'R1-1',
            title: 'Thông báo nội bộ',
            text: 'From 1 June all staff must book a hot desk before coming to the office, using the company app. Desks on the fifth floor are for teams; desks on the sixth floor are for quiet work. If you do not book, you may have to work in the café area on the ground floor.',
            questions: [
              { id: 'R1-1q', type: 'choice', prompt: 'What must staff do before going to the office?', options: ['Book a hot desk on the app', 'Call the reception desk', 'Reserve a parking space', 'Ask their manager for a key'], answer: 'Book a hot desk on the app', explain: 'Nhân viên phải đặt bàn làm việc qua ứng dụng trước khi đến.' },
            ],
          },
          {
            id: 'R1-2',
            title: 'Email',
            text: 'Dear Mr Nam, Thank you for your application for the post of warehouse assistant. We would like to invite you to a first interview on Tuesday 14 May at 9.30 a.m. Please bring a copy of your degree certificate and the names of two people who can give a reference. The interview lasts about forty minutes and includes a short written task.',
            questions: [
              { id: 'R1-2q', type: 'choice', prompt: 'What should Mr Nam bring with him?', options: ['A copy of his degree certificate', 'A medical certificate', 'A reference letter from his manager', 'Two photographs'], answer: 'A copy of his degree certificate', explain: 'Ông Nam cần mang bản sao bằng cấp (và tên 2 người tham chiếu).' },
            ],
          },
          {
            id: 'R1-3',
            title: 'Quảng cáo tuyển dụng',
            text: 'Receptionist needed for a busy dental clinic. Hours: 8 a.m. to 5 p.m., Monday to Saturday, with Thursday free. Salary: 7 million dong a month. Good English and a friendly telephone voice are essential. Experience in a clinic is an advantage, but it is not a condition.',
            questions: [
              { id: 'R1-3q', type: 'choice', prompt: 'Which quality is absolutely necessary?', options: ['Experience in a clinic', 'Good English and a friendly telephone voice', 'A driving licence', 'A university degree'], answer: 'Good English and a friendly telephone voice', explain: '“are essential” = bắt buộc; kinh nghiệm chỉ là lợi thế.' },
            ],
          },
          {
            id: 'R1-4',
            title: 'Phản hồi khách hàng',
            text: 'Your delivery arrived two days late and the box was open, but the shoes inside were perfect and the size was right. I will order from you again, but please use a stronger box and tell customers when an order is delayed.',
            questions: [
              { id: 'R1-4q', type: 'choice', prompt: 'What does the customer complain about?', options: ['The size of the shoes', 'The price', 'The late delivery and the open box', 'The colour of the shoes'], answer: 'The late delivery and the open box', explain: 'Khách phàn nàn về việc giao muộn và hộp bị mở.' },
            ],
          },
          {
            id: 'R1-5',
            title: 'Lịch tập huấn',
            text: 'Staff training day — Friday: 8.30 Welcome and coffee · 9.00 The new booking system · 10.30 Break · 11.00 Dealing with difficult customers · 1.00 Lunch · 2.00 Role-play in pairs · 3.30 Questions and finish.',
            questions: [
              { id: 'R1-5q', type: 'choice', prompt: 'What happens at 2 p.m.?', options: ['Lunch', 'Role-play in pairs', 'A break', 'The new booking system'], answer: 'Role-play in pairs', explain: '14:00 là phần đóng vai theo cặp.' },
            ],
          },
          {
            id: 'R1-6',
            title: 'Ghi chú nội bộ',
            text: 'Please do not print personal documents on the office printer. Each team has a monthly limit of 500 pages, and the system records every print job by user name. If a team goes over the limit, the printer stops until the next month.',
            questions: [
              { id: 'R1-6q', type: 'choice', prompt: 'Why does the system record every print job by user name?', options: ['To check how long printing takes', 'To keep within each team’s monthly limit', 'To order more paper', 'To pay the staff'], answer: 'To keep within each team’s monthly limit', explain: 'Hệ thống ghi lại để kiểm soát hạn mức 500 trang mỗi tháng của từng nhóm.' },
            ],
          },
          {
            id: 'R1-7',
            title: 'Hướng dẫn họp trực tuyến',
            text: 'Before joining an online meeting: test your microphone, turn off notifications and write your full name so that the chair can see who is speaking. Keep your camera on during the first five minutes; after that it is your choice. Ask questions in the chat if two people start talking at the same time.',
            questions: [
              { id: 'R1-7q', type: 'choice', prompt: 'When must the camera stay on?', options: ['For the whole meeting', 'For the first five minutes', 'Only while speaking', 'Never'], answer: 'For the first five minutes', explain: 'Năm phút đầu bật camera, sau đó tuỳ bạn.' },
            ],
          },
          {
            id: 'R1-8',
            title: 'Thư mời',
            text: 'The company will celebrate its tenth anniversary on Saturday 12 October at the Riverside Restaurant, from 6 p.m. Staff may bring one guest. Please tell Ms Hoa your guest’s full name by 5 October so that we can prepare the seating plan and the name cards.',
            questions: [
              { id: 'R1-8q', type: 'choice', prompt: 'Why must staff give the guest’s name to Ms Hoa?', options: ['To get a free gift', 'To help prepare the seating plan and name cards', 'To choose the menu', 'To book a taxi'], answer: 'To help prepare the seating plan and name cards', explain: 'Cần tên để chuẩn bị sơ đồ chỗ ngồi và thẻ tên.' },
            ],
          },
          {
            id: 'R1-9',
            title: 'Nhận xét đánh giá',
            text: 'Your reports are always on time and your clients are happy, which is excellent. To move to the next level, you should speak more in team meetings and share your ideas earlier, because at the moment people often hear them only after the decision has been made.',
            questions: [
              { id: 'R1-9q', type: 'choice', prompt: 'What does the writer advise?', options: ['Writing reports faster', 'Speaking more in team meetings', 'Finding more clients', 'Working extra hours'], answer: 'Speaking more in team meetings', explain: 'Cần phát biểu nhiều hơn trong các cuộc họp nhóm.' },
            ],
          },
          {
            id: 'R1-10',
            title: 'Bài đăng trên diễn đàn',
            text: 'I worked from home for a year. I saved two hours of travelling every day and I ate better, but I missed the small conversations that solve a problem in five minutes. Now I go to the office on Tuesdays and Wednesdays and work from home on the other days.',
            questions: [
              { id: 'R1-10q', type: 'choice', prompt: 'What does the writer do now?', options: ['Works from home every day', 'Works in the office every day', 'Splits the week between the office and home', 'Has stopped working'], answer: 'Splits the week between the office and home', explain: 'Đi làm 2 ngày, làm ở nhà các ngày còn lại.' },
            ],
          },
        ],
      },
      {
        id: 'R2',
        title: 'Part 2 · Bài đọc hiểu',
        instruction: 'Đọc bài và chọn đáp án đúng cho mỗi câu hỏi.',
        passages: [
          {
            id: 'R2-1',
            title: 'New in the job: what the first week really teaches you',
            text: `When you start a new job, you usually receive a lot of information in a very short time. The contract, the password, the fire exit, the names of forty colleagues — all of this arrives in the first two days. Yet people who have worked for years in the same company often say the same thing: what you learn in the first week lasts longer than any training course.

One reason is that first impressions are practical. In a survey of two hundred new employees in the service industry, the most useful thing people remembered from week one was not the staff handbook but the name of one person they could ask a stupid question. New employees who found such a person in the first three days asked for help sooner and made fewer mistakes in their first month.

The second reason is the small rules that are never written down. Nobody tells you that the manager dislikes long email chains, or that Friday afternoon is a bad time to ask for a change of shift. These rules are learned by watching and listening. This is why an hour spent in the staff room in your first week can teach you more than an hour spent reading documents.

However, the first week can also give a wrong impression, and that impression can last. If your first task goes badly — a customer complains, a report contains an error — some colleagues will remember it for months. Managers know this, so many of them give new staff simple tasks in the first days and keep the difficult projects for later.

What should a new employee do? Keep a notebook, because the same questions come back. Ask one question at a time, and say thank you. And remember that everyone in the building was once new: most people are far more willing to help in week one than in week fifty, when the same question seems less interesting.

Finally, be patient with yourself. Being slow in the first week is normal; pretending to understand something is what causes problems later. A colleague who says “I do not know yet, could you show me?” looks professional, not weak.`,
            glossary: [
              { word: 'first impression', meaning: 'ấn tượng ban đầu' },
              { word: 'handbook', meaning: 'sổ tay hướng dẫn nội bộ' },
              { word: 'dislike', meaning: 'không thích' },
              { word: 'shift', meaning: 'ca làm việc' },
              { word: 'be patient with', meaning: 'kiên nhẫn với' },
            ],
            questions: [
              { id: 'R2-1q1', type: 'choice', prompt: 'What is the writer’s main idea?', options: ['Training courses are useless', 'What you learn in the first week has a long effect', 'New jobs are always stressful', 'Staff handbooks are badly written'], answer: 'What you learn in the first week has a long effect', explain: 'Ý chính: những gì học được trong tuần đầu ảnh hưởng lâu dài.' },
              { id: 'R2-1q2', type: 'choice', prompt: 'In the survey, what did new employees find most useful?', options: ['The staff handbook', 'The name of one person they could ask questions', 'A written list of rules', 'A map of the building'], answer: 'The name of one person they could ask questions', explain: 'Hữu ích nhất là biết tên một người có thể hỏi bất cứ điều gì.' },
              { id: 'R2-1q3', type: 'choice', prompt: 'What happened to employees who found such a person quickly?', options: ['They were paid more', 'They asked for help sooner and made fewer mistakes', 'They worked longer hours', 'They were promoted'], answer: 'They asked for help sooner and made fewer mistakes', explain: 'Họ hỏi sớm hơn và ít lỗi hơn trong tháng đầu.' },
              { id: 'R2-1q4', type: 'choice', prompt: 'What are the “small rules” in the third paragraph?', options: ['Rules printed in the handbook', 'Unwritten ways of behaving at work', 'Safety rules in the building', 'Rules about holiday pay'], answer: 'Unwritten ways of behaving at work', explain: 'Đó là những quy tắc bất thành văn, học bằng cách quan sát và lắng nghe.' },
              { id: 'R2-1q5', type: 'choice', prompt: 'Why can an hour in the staff room be useful?', options: ['The food there is free', 'You learn unwritten rules by listening', 'Managers give orders there', 'You can rest quietly'], answer: 'You learn unwritten rules by listening', explain: 'Ngồi ở phòng nhân viên để nghe và học các quy tắc ngầm.' },
              { id: 'R2-1q6', type: 'choice', prompt: 'What can happen after a bad first task?', options: ['Nothing at all', 'Colleagues may remember it for months', 'The manager changes the whole team', 'The new employee is paid less'], answer: 'Colleagues may remember it for months', explain: 'Ấn tượng xấu có thể bị nhớ nhiều tháng.' },
              { id: 'R2-1q7', type: 'choice', prompt: 'What do many managers do in the first days?', options: ['Give simple tasks first', 'Ask for a full report', 'Introduce the client list', 'Send staff on a course'], answer: 'Give simple tasks first', explain: 'Họ giao việc đơn giản trước, việc khó để sau.' },
              { id: 'R2-1q8', type: 'choice', prompt: 'Why is it easier to ask questions in week one?', options: ['Managers order colleagues to help', 'People are more willing to help a new colleague', 'New staff have fewer tasks', 'Nobody knows the answers'], answer: 'People are more willing to help a new colleague', explain: 'Mọi người sẵn lòng giúp hơn khi bạn mới đến (tuần 1 so với tuần 50).' },
              { id: 'R2-1q9', type: 'fill', prompt: 'According to the writer, you should ask ___ question at a time. (write the number word)', answers: ['one', '1'], explain: '“Ask one question at a time, and say thank you.”' },
              { id: 'R2-1q10', type: 'fill', prompt: 'The writer says that being ___ in the first week is normal. (one word)', answers: ['slow'], explain: '“Being slow in the first week is normal.”' },
            ],
          },
        ],
      },
      {
        id: 'R3',
        title: 'Part 3 · Bài đọc hiểu',
        instruction: 'Đọc bài và chọn đáp án đúng cho mỗi câu hỏi.',
        passages: [
          {
            id: 'R3-1',
            title: 'The quiet hour: interruption in the open-plan office',
            text: `Open-plan offices are popular because they are cheap and because they are supposed to make teams talk to each other. In the 1990s and 2000s many companies removed walls and corridors, and designers promised that ideas would travel faster. Twenty years later, a large number of employees say they cannot concentrate, and some companies have started to put the walls back.

The problem has a name: interruption. In an open-plan office you can see and hear everything, so the number of small interruptions rises. A quick question about a delivery, a joke between two colleagues, a phone that rings three desks away — each event seems to take thirty seconds, but the real cost is much higher.

Researchers who study attention explain why. When you switch away from a task and return to it, your brain needs time to find the point where you stopped. Studies of programmers and writers suggest that after a serious interruption a worker may need ten to fifteen minutes to return to full concentration. Five interruptions in a morning can therefore destroy almost a full day of deep work.

Companies have tried different solutions. Some introduced “quiet hours”, usually two hours in the morning when talking is not allowed and headphones are a sign that you should not disturb that person. Others built small “phone rooms” for calls. A third group simply allowed people to work from home two days a week, so that the office became a place for meetings and the home became a place for concentration.

None of these solutions is perfect. Quiet hours fail when managers continue to hold short discussions at their desks; phone rooms stay empty if they are far from the desks; and working from home is difficult for employees with small flats or poor internet.

What the experiments do show is that the problem is not open spaces by themselves but the mixture of two different activities in the same room: talking and thinking. A company that separates these two activities — by time, by room, or by day — usually reports better results than a company that simply buys more headphones.`,
            glossary: [
              { word: 'open-plan', meaning: 'không có vách ngăn' },
              { word: 'interruption', meaning: 'sự ngắt quãng, làm gián đoạn' },
              { word: 'concentration', meaning: 'sự tập trung' },
              { word: 'disturb', meaning: 'làm phiền' },
              { word: 'mixture', meaning: 'sự trộn lẫn' },
            ],
            questions: [
              { id: 'R3-1q1', type: 'choice', prompt: 'Why are open-plan offices popular, according to the text?', options: ['They look modern in photographs', 'They are cheap and are believed to encourage communication', 'They are easier to clean', 'Employees asked for them'], answer: 'They are cheap and are believed to encourage communication', explain: 'Chúng rẻ và được cho là giúp các nhóm nói chuyện với nhau.' },
              { id: 'R3-1q2', type: 'choice', prompt: 'What is the main problem described in the text?', options: ['Frequent small interruptions', 'Bad lighting', 'Slow internet', 'A lack of meeting rooms'], answer: 'Frequent small interruptions', explain: 'Vấn đề chính là vô số ngắt quãng nhỏ.' },
              { id: 'R3-1q3', type: 'choice', prompt: 'Why is the real cost of an interruption higher than thirty seconds?', options: ['It uses electricity', 'The brain needs time to find its place again', 'Colleagues start talking about it', 'It must be reported'], answer: 'The brain needs time to find its place again', explain: 'Sau khi bị ngắt quãng, não cần thời gian để tìm lại điểm đang làm.' },
              { id: 'R3-1q4', type: 'choice', prompt: 'How long may a worker need to return to full concentration?', options: ['Ten to fifteen minutes', 'One minute', 'Half an hour', 'Two hours'], answer: 'Ten to fifteen minutes', explain: '“ten to fifteen minutes to return to full concentration”.' },
              { id: 'R3-1q5', type: 'choice', prompt: 'What are “quiet hours”?', options: ['Hours when the office is closed', 'Periods when talking is not allowed', 'Times for team meetings', 'Hours with no internet'], answer: 'Periods when talking is not allowed', explain: 'Khoảng thời gian không được nói chuyện, thường 2 giờ buổi sáng.' },
              { id: 'R3-1q6', type: 'choice', prompt: 'What do headphones mean during quiet hours?', options: ['The person is listening to music', 'You should not disturb that person', 'The person has finished work', 'The room is too noisy'], answer: 'You should not disturb that person', explain: 'Tai nghe là dấu hiệu “đừng làm phiền”.' },
              { id: 'R3-1q7', type: 'choice', prompt: 'What are phone rooms for?', options: ['Making calls without disturbing others', 'Storing old documents', 'Holding team meetings', 'Taking a short sleep'], answer: 'Making calls without disturbing others', explain: 'Phòng nhỏ để gọi điện mà không làm phiền người khác.' },
              { id: 'R3-1q8', type: 'choice', prompt: 'Which solution is difficult for employees in small flats?', options: ['Quiet hours', 'Phone rooms', 'Working from home', 'Buying headphones'], answer: 'Working from home', explain: 'Nhà nhỏ hoặc internet yếu khiến làm việc ở nhà khó khăn.' },
              { id: 'R3-1q9', type: 'fill', prompt: 'The real problem is mixing two activities in one room: talking and ___. (one word)', answers: ['thinking'], explain: '“the mixture of … talking and thinking”.' },
              { id: 'R3-1q10', type: 'choice', prompt: 'What does the writer conclude?', options: ['Open spaces should be banned', 'Separating talking from thinking helps most', 'Headphones are the best solution', 'All employees should work from home'], answer: 'Separating talking from thinking helps most', explain: 'Cần tách việc nói chuyện khỏi việc suy nghĩ (theo thời gian, phòng hoặc ngày).' },
            ],
          },
        ],
      },
      {
        id: 'R4',
        title: 'Part 4 · Điền khuyết',
        instruction: 'Chọn từ đúng để điền vào mỗi chỗ trống trong đoạn văn.',
        passages: [
          {
            id: 'R4-1',
            title: 'How to make your CV easy to read',
            text: `A good CV does not list everything you have (1)___ done; it shows the reader why you are suitable for this job. Recruiters usually spend less (2)___ a minute on the first page, so the layout matters as much as the content.

Start with your name, your phone number and your email address. Use a professional email address: a nickname from your school years (3)___ not help you. Next, write a short profile of three or four lines. It should answer one question: (4)___ should we invite you?

The section (5)___ interests recruiters most is your experience. Write the name of the company, your position and the dates, (6)___ then describe what you achieved. Use numbers where you can: “served about eighty customers a day” is stronger than “responsible (7)___ customer service”. If you have little experience, include a project (8)___ your studies and explain what you learned (9)___ it.

Check the spelling twice. A CV with two or three mistakes suggests that the writer does not check their work. Finally, save the file (10)___ a PDF, because a PDF looks the same on every computer.`,
            glossary: [
              { word: 'recruiter', meaning: 'người tuyển dụng' },
              { word: 'layout', meaning: 'cách trình bày' },
              { word: 'achieve', meaning: 'đạt được' },
              { word: 'responsible for', meaning: 'phụ trách' },
            ],
            questions: [
              { id: 'R4-1q1', type: 'choice', prompt: 'Chỗ (1)', options: ['ever', 'never', 'yet', 'already'], answer: 'ever', explain: '“everything you have ever done” — trạng từ nhấn mạnh trong thì hiện tại hoàn thành.' },
              { id: 'R4-1q2', type: 'choice', prompt: 'Chỗ (2)', options: ['than', 'then', 'as', 'that'], answer: 'than', explain: 'So sánh hơn với “less”: less than a minute.' },
              { id: 'R4-1q3', type: 'choice', prompt: 'Chỗ (3)', options: ['will', 'is', 'has', 'do'], answer: 'will', explain: 'Câu dự đoán/lời khuyên: “a nickname … will not help you”.' },
              { id: 'R4-1q4', type: 'choice', prompt: 'Chỗ (4)', options: ['Why', 'What', 'When', 'Whose'], answer: 'Why', explain: 'Câu hỏi cần trả lời là “Why should we invite you?”.' },
              { id: 'R4-1q5', type: 'choice', prompt: 'Chỗ (5)', options: ['that', 'who', 'where', 'why'], answer: 'that', explain: 'Mệnh đề quan hệ thay cho “the section” (vật).' },
              { id: 'R4-1q6', type: 'choice', prompt: 'Chỗ (6)', options: ['and', 'but', 'or', 'so'], answer: 'and', explain: 'Nối hai hành động cùng hướng: viết thông tin … và mô tả thành tích.' },
              { id: 'R4-1q7', type: 'choice', prompt: 'Chỗ (7)', options: ['for', 'of', 'to', 'with'], answer: 'for', explain: 'Cụm cố định: be responsible for something.' },
              { id: 'R4-1q8', type: 'choice', prompt: 'Chỗ (8)', options: ['from', 'of', 'at', 'since'], answer: 'from', explain: '“a project from your studies” — một dự án trong quá trình học.' },
              { id: 'R4-1q9', type: 'choice', prompt: 'Chỗ (9)', options: ['during', 'from', 'since', 'by'], answer: 'during', explain: '“explain what you learned during it” — học được trong quá trình làm dự án.' },
              { id: 'R4-1q10', type: 'choice', prompt: 'Chỗ (10)', options: ['as', 'like', 'in', 'for'], answer: 'as', explain: '“save the file as a PDF” — lưu dưới định dạng PDF.' },
            ],
          },
        ],
      },
    ],
  },

  writing: {
    minutes: 60,
    tasks: [
      {
        id: 'W1',
        task: 1,
        title: 'Task 1 · Email nhận việc và hỏi thông tin',
        prompt: 'You have been offered a part-time job as a teaching assistant at a language centre. Write an email (about 120 words) to the centre manager, Ms Lan. In your email: thank her for the offer, ask about the exact working hours in your first week, explain that you have an important exam on Wednesday, and ask whether you can start one week later.',
        minWords: 120,
        checklist: [
          { label: 'Có lời chào và lời kết phù hợp', hint: 'Dear Ms Lan, … / Kind regards, Minh' },
          { label: 'Cảm ơn và xác nhận nhận việc', hint: 'Thank you very much for offering me the position…' },
          { label: 'Hỏi rõ giờ làm việc tuần đầu', hint: 'Could you tell me the exact working hours…?' },
          { label: 'Giải thích lý do (có bài kiểm tra quan trọng)', hint: 'I have an important English exam on Wednesday…' },
          { label: 'Đề nghị cụ thể (xin bắt đầu muộn một tuần)', hint: 'Would it be possible for me to start one week later?' },
          { label: 'Đủ số từ (~120) và giọng lịch sự, trang trọng', hint: 'Dùng could / would / I would like to…' },
        ],
        tips: [
          'Email công việc nên ngắn và có 4 ý rõ ràng; mỗi ý một đoạn ngắn.',
          'Khi xin đổi kế hoạch, hãy đưa lý do và một phương án cụ thể (ngày mới).',
          'Tránh viết tắt kiểu tin nhắn (u, pls) trong email công việc.',
        ],
        model: `Dear Ms Lan,

Thank you very much for offering me the position of part-time teaching assistant at your centre. I am very happy to accept it and I am looking forward to working with your team.

Before I start, I would like to ask two questions. Could you tell me the exact working hours in my first week, and which teacher I will work with? I would like to prepare some materials in advance.

I should also explain that I have an important English exam on Wednesday 12 June. Would it be possible for me to start one week later, on 19 June? After that date I am free every afternoon and I can work on Saturdays as well.

I hope these changes are not a problem for you. Please let me know what you decide.

Kind regards,
Minh`,
      },
      {
        id: 'W2',
        task: 2,
        title: 'Task 2 · Luận: làm việc ở nhà hay ở văn phòng?',
        prompt: 'Some people believe that working from home is better for employees, while others say that working in an office is better. Write an essay (about 250 words) discussing both views and giving your own opinion. Use reasons and examples to support your answer.',
        minWords: 250,
        checklist: [
          { label: 'Mở bài giới thiệu chủ đề và hướng làm bài', hint: 'There is a lively discussion about whether…' },
          { label: 'Đoạn nêu lợi ích của làm việc ở nhà', hint: 'On the one hand, working from home saves…' },
          { label: 'Đoạn nêu lợi ích của làm việc ở văn phòng', hint: 'On the other hand, an office offers…' },
          { label: 'Nêu ý kiến cá nhân rõ ràng', hint: 'In my opinion, the two should be combined…' },
          { label: 'Có ít nhất 2 ví dụ hoặc số liệu cụ thể', hint: 'For example, many people spend two hours a day travelling.' },
          { label: 'Dùng từ nối giữa các đoạn', hint: 'however, moreover, in addition, in conclusion' },
          { label: 'Kết luận tóm tắt, không nêu ý mới', hint: 'In conclusion, …' },
          { label: 'Đủ số từ (~250)', hint: 'Kiểm tra số từ ở khung soạn thảo' },
        ],
        tips: [
          'Với dạng “discuss both views”, hãy dành một đoạn cho mỗi quan điểm rồi mới nêu ý kiến.',
          'Dùng từ vựng chủ đề công việc: commute, deadline, teamwork, productivity.',
          'Số liệu cụ thể (two hours, three days) làm lập luận đáng tin hơn lời nói chung.',
        ],
        model: `Many employees now have the choice of working from home for part of the week, and there is a lively discussion about which arrangement is better. In my view, both models have clear strengths, and the best solution depends on the kind of work and on the personality of the worker.

Working from home offers two important advantages. The first is time. In big cities many people spend two hours a day travelling to the office, and that time can be used for sleep, exercise or family. The second advantage is concentration: at home there are no colleagues stopping at your desk for a quick question. A programmer or a writer can often produce more in six quiet hours at home than in eight hours in a noisy office.

On the other hand, the office gives something that a screen cannot. Problems are solved quickly because you can turn your chair and ask a colleague. New employees learn how a company really works by listening to conversations, and this is almost impossible from a kitchen table. Many people also say that the office protects their private life, because it separates work from home.

In my opinion, the two should be combined rather than compared. A model of three days in the office and two days at home keeps the advantages of both: the quiet days are used for difficult tasks, and the shared days for meetings, training and friendships. This is not only my personal preference; several companies that tried it report fewer sick days and happier teams.

In conclusion, home working is better for concentration and travelling time, while office work is better for learning and communication. A flexible week that includes both is the wisest choice for most employees.`,
      },
    ],
  },

  speaking: {
    minutes: 12,
    parts: [
      {
        id: 'S1',
        kind: 'social',
        title: 'Part 1 · Tương tác xã hội',
        instruction: 'Bạn sẽ nghe 3 câu hỏi về công việc và cách giao tiếp hằng ngày. Trả lời mỗi câu 1–2 phút, nói tự nhiên như đang trò chuyện.',
        minutes: 3,
        questions: [
          { q: 'Do you prefer working alone or in a team? Why?', sample: 'It depends on the task, but in general I prefer small teams of three or four people. When I work alone I think more carefully, but I often stop to check things I am not sure about. In a team, somebody always knows the answer, and explaining my part makes me understand it better. The only problem is that a large team can waste time on long discussions.' },
          { q: 'How do you usually communicate with your classmates or colleagues?', sample: 'Mostly by messages in a class group, but I have learned to choose the right tool. A short question goes into the group chat, anything with a deadline I send by email, and if something is complicated I call the person. I also try to answer quickly, because a short answer today is more useful than a perfect answer next week.' },
          { q: 'What job would you like to do in the future, and which skills do you need for it?', sample: 'I would like to work as a project assistant in a company that works with foreign partners. For that job I need two things. First, my English has to be good enough for meetings and emails. Second, I need to organise information well, so I am practising with simple tools like shared documents and calendars. I think patience is also important, because projects change all the time.' },
        ],
      },
      {
        id: 'S2',
        kind: 'solution',
        title: 'Part 2 · Thảo luận giải pháp',
        instruction: 'Bạn và một người bạn đang bàn cách cải thiện việc trao đổi thông tin trong lớp/lớp học của bạn. Hãy thảo luận ưu điểm, nhược điểm của 3 lựa chọn rồi chọn một phương án và giải thích.',
        minutes: 4,
        situation: 'Your class or your team keeps missing important information. Messages are sent in four different groups, and people complain that they cannot follow what is happening. Three options are suggested.',
        options: [
          'Keep one shared group chat, but use it only for urgent messages',
          'Hold a short ten-minute meeting every morning',
          'Write one weekly summary email for everybody',
        ],
        sample: `Let us look at the three options. A single group chat for urgent messages only is fast and costs nothing. The rule is the difficult part: if people continue to send funny videos and questions about homework, the group becomes noisy again and nobody reads it. Still, for a real emergency — a cancelled class, a changed deadline — nothing is quicker.

The ten-minute morning meeting is the second option. It is useful because everyone hears the same information at the same time and questions are answered immediately. However, ten minutes easily becomes twenty, and people who arrive late miss it completely. For a class that does not meet every day, it is simply impossible.

The weekly summary email is the opposite idea. It is reliable, it can be read at any time, and it gives a clear record of decisions. The weak point is speed: if something changes on Wednesday, you only hear about it on Friday.

If I have to choose, I would combine the first and the third option. The weekly email gives everybody the full picture and a written record, and the group chat stays open for the few messages that cannot wait until Friday. In that way we solve the problem of missing information without adding another meeting to a timetable that is already full.

We should also agree on one rule from the beginning: every decision made in the chat must appear in the Friday email, so that nobody can say later that they did not know about it.`, 
      },
      {
        id: 'S3',
        kind: 'topic',
        title: 'Part 3 · Phát triển chủ đề',
        instruction: 'Trình bày quan điểm của bạn về chủ đề dưới đây (khoảng 3 phút), dựa vào 3 gợi ý. Sau đó trả lời 2 câu hỏi mở rộng.',
        minutes: 5,
        topic: 'Good communication skills are as important as technical skills at work.',
        outline: [
          'Vì sao kỹ năng giao tiếp quan trọng trong công việc',
          'Những khó khăn khi giao tiếp ở nơi làm việc (email, họp, khác biệt văn hoá)',
          'Kinh nghiệm của bạn và cách luyện tập',
        ],
        questions: [
          { q: 'Do you think online communication will replace face-to-face meetings at work?', sample: 'Partly, but not completely. Online tools are excellent for information: schedules, documents and short updates can be shared in seconds, and travelling is unnecessary. But when a decision is difficult or when a team is in conflict, a video call hides too much. In a room you can see who is tired, who disagrees without speaking, and who needs more time. So I believe the future is a mix, with online tools for everyday work and real meetings for difficult conversations.' },
          { q: 'What advice would you give to someone who is shy about speaking in meetings?', sample: 'I would give three pieces of advice. First, prepare one sentence before the meeting, because it is much easier to speak when you already know the first words. Second, ask a question instead of giving an opinion, as questions feel safer and still show that you are involved. Third, choose small meetings at the beginning; three people are less frightening than fifteen. Confidence comes from the first successful sentence, not from a personality change.' },
        ],
      },
    ],
  },
};
