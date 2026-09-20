/**
 * Đề VSTEP B1 số 1 — chủ đề đời sống & học tập (nội dung gốc, viết theo đúng format đề thi).
 * Xem `docs/vstep-schema.md` để biết ý nghĩa từng field.
 */
export default {
  id: 'b1-01',
  level: 'B1',
  title: 'Đề B1 số 1 · Đời sống & học tập',
  tags: ['đời sống', 'học tập', 'B1'],

  listening: {
    minutes: 40,
    parts: [
      {
        id: 'L1',
        title: 'Part 1 · Thông báo ngắn',
        instruction: 'Bạn sẽ nghe 8 thông báo ngắn. Mỗi thông báo có một câu hỏi. Chọn đáp án đúng nhất.',
        transcript: [
          { speaker: 'Narrator', line: 'Announcement one. Attention, students. The campus library will open at seven in the morning and close at midnight during exam week, from Monday to Friday. On Saturday and Sunday the closing time stays at nine in the evening.' },
          { speaker: 'Narrator', line: 'Announcement two. The eight fifteen train to Hai Phong will now leave from platform three instead of platform one. Passengers are asked to move to platform three immediately.' },
          { speaker: 'Narrator', line: 'Announcement three. This is a message for members of the evening yoga class. The teacher is ill today, so the class will start at seven instead of six. The room is unchanged.' },
          { speaker: 'Narrator', line: 'Announcement four. Here is the weather for tomorrow. Heavy rain is expected from early morning until about four in the afternoon. Please allow extra time to travel to school.' },
          { speaker: 'Narrator', line: 'Announcement five. Visitors joining the two o’clock museum tour should wait at the main entrance, not at the ticket office. The tour lasts ninety minutes and is free.' },
          { speaker: 'Narrator', line: 'Announcement six. When using the new recycling bins, please put plastic bottles and metal cans in the green bin. Paper goes in the blue bin. Glass is not collected here.' },
          { speaker: 'Narrator', line: 'Announcement seven. The school canteen will be closed this Friday for cleaning. Sandwiches and drinks will be sold in the main hall between eleven and one.' },
          { speaker: 'Narrator', line: 'Announcement eight. Passengers on flight VN123 from Da Nang, your luggage will arrive on belt four. Please have your baggage receipt ready before leaving the hall.' },
        ],
        questions: [
          { id: 'L1-1', type: 'choice', prompt: 'What is different during exam week?', options: ['The library opens earlier', 'The library closes later', 'The library closes all weekend', 'The library moves building'], answer: 'The library closes later', explain: 'Thư viện đóng lúc nửa đêm (muộn hơn bình thường) từ thứ Hai đến thứ Sáu.' },
          { id: 'L1-2', type: 'choice', prompt: 'What should passengers do?', options: ['Wait on platform one', 'Board a later train', 'Go to platform three', 'Buy a new ticket'], answer: 'Go to platform three', explain: 'Tàu chuyển sang platform 3.' },
          { id: 'L1-3', type: 'choice', prompt: 'Why does the yoga class start later?', options: ['The room is busy', 'The teacher is ill', 'Fewer people came', 'The building is closed'], answer: 'The teacher is ill', explain: '“The teacher is ill today.”' },
          { id: 'L1-4', type: 'choice', prompt: 'What is the weather warning about?', options: ['Strong wind in the evening', 'Heavy rain from morning', 'Very cold temperatures', 'Snow on the roads'], answer: 'Heavy rain from morning', explain: 'Mưa lớn từ sáng sớm đến khoảng 4 giờ chiều.' },
          { id: 'L1-5', type: 'choice', prompt: 'Where should visitors wait for the tour?', options: ['At the ticket office', 'At the main entrance', 'Inside the café', 'At the car park'], answer: 'At the main entrance', explain: '“wait at the main entrance, not at the ticket office”.' },
          { id: 'L1-6', type: 'choice', prompt: 'What cannot be put in the new bins?', options: ['Plastic bottles', 'Metal cans', 'Paper', 'Glass'], answer: 'Glass', explain: '“Glass is not collected here.”' },
          { id: 'L1-7', type: 'choice', prompt: 'Where can students buy food on Friday?', options: ['In the canteen', 'In the main hall', 'In the library', 'Outside the school gate'], answer: 'In the main hall', explain: 'Bánh mì và đồ uống bán ở sảnh chính.' },
          { id: 'L1-8', type: 'choice', prompt: 'What should passengers have ready?', options: ['Their passport', 'Their boarding card', 'Their baggage receipt', 'Their bus ticket'], answer: 'Their baggage receipt', explain: '“have your baggage receipt ready”.' },
        ],
      },
      {
        id: 'L2',
        title: 'Part 2 · Hội thoại',
        instruction: 'Bạn sẽ nghe 2 đoạn hội thoại. Mỗi đoạn có 6 câu hỏi.',
        transcript: [
          { speaker: 'Receptionist', line: 'Good morning, City Language Centre. How can I help you?' },
          { speaker: 'Minh', line: 'Hello. I would like to ask about the evening English course that starts next month.' },
          { speaker: 'Receptionist', line: 'Certainly. We have classes on Tuesday and Thursday, from six thirty to eight thirty. The course lasts twelve weeks.' },
          { speaker: 'Minh', line: 'How many students are there in a class?' },
          { speaker: 'Receptionist', line: 'We keep it small — usually ten, and never more than twelve.' },
          { speaker: 'Minh', line: 'That sounds good. Is there a placement test?' },
          { speaker: 'Receptionist', line: 'Yes, a short test online. It takes about twenty minutes and you can do it at home before the first lesson.' },
          { speaker: 'Minh', line: 'And the fee?' },
          { speaker: 'Receptionist', line: 'It is three million dong for the whole course, or you can pay in two parts. Students get a ten per cent discount with a student card.' },
          { speaker: 'Minh', line: 'Great. Can I pay by bank transfer?' },
          { speaker: 'Receptionist', line: 'Yes, but please send us the receipt by email so we can confirm your place. Places are held for three days only.' },
          { speaker: 'Narrator', line: 'Now listen to a conversation between two students.' },
          { speaker: 'Hoa', line: 'Nam, have you started the group presentation for Friday?' },
          { speaker: 'Nam', line: 'Not really. I have read two articles but I have not taken any notes yet.' },
          { speaker: 'Hoa', line: 'We should meet tomorrow. The library is too noisy now, so how about the small room on the second floor?' },
          { speaker: 'Nam', line: 'That room is usually full. My flat is quiet and it is only ten minutes from the campus.' },
          { speaker: 'Hoa', line: 'Fine, but I have a class until four. Can we start at five?' },
          { speaker: 'Nam', line: 'Five works. Should we divide the topic?' },
          { speaker: 'Hoa', line: 'Yes. You take the causes, I will cover the solutions, and we both prepare two slides of examples.' },
          { speaker: 'Nam', line: 'Agreed. And who is speaking first?' },
          { speaker: 'Hoa', line: 'You are, because you have the background information. I will do the conclusion.' },
          { speaker: 'Nam', line: 'OK. I will send the draft slides tonight so you can comment before we meet.' },
          { speaker: 'Hoa', line: 'Perfect. Do not forget the handout — the teacher asked for one page.' },
          { speaker: 'Nam', line: 'Right, I will print fifteen copies tomorrow morning.' },
        ],
        questions: [
          { id: 'L2-1', type: 'choice', prompt: 'How long does the evening course last?', options: ['Six weeks', 'Ten weeks', 'Twelve weeks', 'Twenty weeks'], answer: 'Twelve weeks', explain: '“The course lasts twelve weeks.”' },
          { id: 'L2-2', type: 'choice', prompt: 'What is the maximum class size?', options: ['Ten students', 'Twelve students', 'Fifteen students', 'Twenty students'], answer: 'Twelve students', explain: '“never more than twelve”.' },
          { id: 'L2-3', type: 'choice', prompt: 'What does the placement test require?', options: ['Coming to the centre', 'Twenty minutes at home', 'A writing sample by post', 'An interview with a teacher'], answer: 'Twenty minutes at home', explain: 'Bài test online ~20 phút, làm ở nhà.' },
          { id: 'L2-4', type: 'choice', prompt: 'How can Minh reduce the fee?', options: ['Paying in two parts', 'Bringing a friend', 'Showing a student card', 'Paying in cash'], answer: 'Showing a student card', explain: 'Giảm 10% khi có thẻ sinh viên.' },
          { id: 'L2-5', type: 'choice', prompt: 'What must Minh do after paying by bank transfer?', options: ['Call the centre', 'Email the receipt', 'Visit the office', 'Register again online'], answer: 'Email the receipt', explain: 'Phải gửi hoá đơn qua email để xác nhận chỗ.' },
          { id: 'L2-6', type: 'fill', prompt: 'A place is held for only ___ days. (write the number)', answers: ['3', 'three'], explain: '“Places are held for three days only.”' },
          { id: 'L2-7', type: 'choice', prompt: 'Where will the two students meet?', options: ['In the library', 'In a room on the second floor', 'At Nam’s flat', 'In a café'], answer: 'At Nam’s flat', explain: 'Phòng ở thư viện thường kín nên họ chọn nhà Nam.' },
          { id: 'L2-8', type: 'choice', prompt: 'What will Nam prepare?', options: ['The conclusion', 'The causes', 'The solutions', 'The handout'], answer: 'The causes', explain: 'Nam phụ trách phần nguyên nhân.' },
          { id: 'L2-9', type: 'choice', prompt: 'Why does Nam speak first?', options: ['He has the background information', 'He is more confident', 'He prepared more slides', 'Hoa asked him to'], answer: 'He has the background information', explain: '“because you have the background information”.' },
          { id: 'L2-10', type: 'choice', prompt: 'What time will they start?', options: ['At four', 'At five', 'At six', 'At seven'], answer: 'At five', explain: 'Hoa học đến 4 giờ nên hẹn 5 giờ.' },
          { id: 'L2-11', type: 'choice', prompt: 'What will Nam send tonight?', options: ['The handout', 'The draft slides', 'A list of articles', 'The final report'], answer: 'The draft slides', explain: '“I will send the draft slides tonight.”' },
          { id: 'L2-12', type: 'fill', prompt: 'Nam will print ___ copies of the handout. (write the number)', answers: ['15', 'fifteen'], explain: '“I will print fifteen copies tomorrow morning.”' },
        ],
      },
      {
        id: 'L3',
        title: 'Part 3 · Bài nói',
        instruction: 'Bạn sẽ nghe 2 bài nói. Phần 1 có 8 câu hỏi, phần 2 có 7 câu hỏi.',
        transcript: [
          { speaker: 'Lecturer', line: 'Today I want to talk about a study method that sounds strange at first: teaching other people. In one classic experiment, students who read a text and then explained it to a partner remembered about twenty per cent more than students who simply reread the text twice.' },
          { speaker: 'Lecturer', line: 'Why does it work? When you explain something, you cannot hide behind words you do not understand. You have to choose words, give examples and answer questions. Every time you get stuck, you discover a gap in your knowledge.' },
          { speaker: 'Lecturer', line: 'The second reason is time. Rereading feels easy, so students do it for hours and believe they are learning. Explaining is harder, so most people stop after ten minutes — but those ten minutes are far more productive.' },
          { speaker: 'Lecturer', line: 'There is a practical problem, however. If your partner knows the topic better than you do, you may simply listen instead of explaining. So the rule is: the person who studied the text should talk for two thirds of the time.' },
          { speaker: 'Lecturer', line: 'A second warning: explaining does not replace practice. If you are learning to write an essay, talking about essay structure helps, but you still have to write. Use explaining as a first step, then test yourself with real exercises.' },
          { speaker: 'Lecturer', line: 'Finally, keep a record. Write down the questions your partner asked. Those questions show exactly what you did not understand, and they make a perfect revision list before an exam.' },
          { speaker: 'Narrator', line: 'Now listen to a short radio talk about bicycles on campus.' },
          { speaker: 'Presenter', line: 'Two years ago, the university in our story had a serious problem: almost every student came to class by motorbike, and at nine in the morning there were no parking spaces left. The university decided to try something different.' },
          { speaker: 'Presenter', line: 'They bought six hundred bicycles and painted them bright yellow. Any student with a valid card can take a bicycle from one of twelve stations and leave it at another. The first thirty minutes are free.' },
          { speaker: 'Presenter', line: 'In the first semester, students made about forty thousand trips. The number of motorbikes on campus fell by a third, and the university saved money because it did not have to build a second car park.' },
          { speaker: 'Presenter', line: 'There were problems too. In the beginning, bicycles were left in the wrong places, and some disappeared. The solution was simple: students now scan a code that tells them where the bicycle must be returned, and each bicycle has a small tracker.' },
          { speaker: 'Presenter', line: 'The scheme is not perfect. In the rainy season, the number of trips drops by half, and students who live far from campus still need their motorbikes. Yet eighty per cent of users say they cycle more than before.' },
          { speaker: 'Presenter', line: 'What can other universities learn? First, start small — six hundred bicycles, not six thousand. Second, make the first thirty minutes free, because short trips are the ones you want to replace. And third, count the trips publicly: visible numbers keep students interested.' },
        ],
        questions: [
          { id: 'L3-1', type: 'choice', prompt: 'What is the main topic of the lecture?', options: ['How to take better notes', 'Why explaining helps you learn', 'How to prepare an exam timetable', 'Why group work is unpopular'], answer: 'Why explaining helps you learn', explain: 'Chủ đề chính là phương pháp học bằng cách giải thích cho người khác.' },
          { id: 'L3-2', type: 'choice', prompt: 'What did the classic experiment find?', options: ['Reading twice is the best method', 'Explaining improved memory by about 20%', 'Students prefer studying alone', 'Partners learn faster than teachers'], answer: 'Explaining improved memory by about 20%', explain: 'Nhóm giải thích nhớ nhiều hơn khoảng 20%.' },
          { id: 'L3-3', type: 'choice', prompt: 'Why does explaining reveal gaps?', options: ['You must answer questions', 'You read more quickly', 'You copy your partner’s notes', 'You repeat the same words'], answer: 'You must answer questions', explain: 'Khi giải thích, bạn phải chọn từ, cho ví dụ và trả lời câu hỏi.' },
          { id: 'L3-4', type: 'choice', prompt: 'Why is rereading less effective?', options: ['It is too difficult', 'It feels easy so students overdo it', 'It needs a partner', 'It takes ten minutes only'], answer: 'It feels easy so students overdo it', explain: 'Đọc lại thấy dễ nên sinh viên làm hàng giờ mà tưởng mình đang học.' },
          { id: 'L3-5', type: 'choice', prompt: 'What rule does the lecturer give?', options: ['Explain for two thirds of the time', 'Never study with a stronger partner', 'Explain only for ten minutes', 'Always write first, talk later'], answer: 'Explain for two thirds of the time', explain: 'Người đã đọc bài phải nói 2/3 thời gian.' },
          { id: 'L3-6', type: 'choice', prompt: 'What does the lecturer say about practice?', options: ['It is unnecessary', 'It replaces explaining', 'It is still needed afterwards', 'It should come before reading'], answer: 'It is still needed afterwards', explain: 'Giải thích không thay thế việc luyện tập thật.' },
          { id: 'L3-7', type: 'choice', prompt: 'What should you note down?', options: ['Your partner’s questions', 'The length of the text', 'The teacher’s slides', 'The number of pages'], answer: 'Your partner’s questions', explain: 'Câu hỏi của bạn học cho thấy chỗ bạn chưa hiểu.' },
          { id: 'L3-8', type: 'fill', prompt: 'Explaining is useful as a first step before doing real ___. (one word)', answers: ['exercises'], explain: '“then test yourself with real exercises”.' },
          { id: 'L3-9', type: 'choice', prompt: 'What was the university’s problem?', options: ['Not enough bicycles', 'No parking spaces for motorbikes', 'Too few students', 'Expensive bus tickets'], answer: 'No parking spaces for motorbikes', explain: 'Buổi sáng hết chỗ đỗ xe máy.' },
          { id: 'L3-10', type: 'choice', prompt: 'How much does the first thirty minutes cost?', options: ['Nothing', 'One dollar', 'Half price', 'A monthly fee'], answer: 'Nothing', explain: 'Ba mươi phút đầu miễn phí.' },
          { id: 'L3-11', type: 'choice', prompt: 'What happened to the number of motorbikes?', options: ['It doubled', 'It fell by a third', 'It stayed the same', 'It fell by two thirds'], answer: 'It fell by a third', explain: 'Giảm một phần ba.' },
          { id: 'L3-12', type: 'choice', prompt: 'How were lost bicycles dealt with?', options: ['Students pay a deposit', 'A code and a tracker', 'Bicycles are locked at night', 'Guards check at the gate'], answer: 'A code and a tracker', explain: 'Quét mã để biết nơi trả xe + gắn thiết bị định vị.' },
          { id: 'L3-13', type: 'choice', prompt: 'What happens in the rainy season?', options: ['Trips fall by half', 'Bicycles are repaired', 'The scheme closes', 'Fees increase'], answer: 'Trips fall by half', explain: 'Mùa mưa số lượt đi giảm một nửa.' },
          { id: 'L3-14', type: 'choice', prompt: 'What does the presenter recommend first?', options: ['Start small', 'Buy cars instead', 'Ban motorbikes', 'Raise parking fees'], answer: 'Start small', explain: 'Bắt đầu nhỏ: 600 xe chứ không phải 6.000.' },
          { id: 'L3-15', type: 'choice', prompt: 'Why should the number of trips be public?', options: ['To attract reporters', 'To keep students interested', 'To reduce taxes', 'To compare with buses'], answer: 'To keep students interested', explain: '“visible numbers keep students interested”.' },
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
        instruction: 'Đọc 10 văn bản ngắn và chọn đáp án đúng cho mỗi câu hỏi.',
        passages: [
          {
            id: 'R1-1',
            title: 'Thông báo thư viện',
            text: 'From next Monday the study rooms on the third floor must be booked online at least one day in advance. Rooms are free for groups of three or more. A room is held for ten minutes after the booked time; after that it is given to another group.',
            questions: [
              { id: 'R1-1q', type: 'choice', prompt: 'What is the new rule?', options: ['Rooms must be booked online in advance', 'Rooms cost money', 'Only teachers can book rooms', 'Rooms open at ten'], answer: 'Rooms must be booked online in advance', explain: 'Phải đặt phòng online trước ít nhất một ngày.' },
            ],
          },
          {
            id: 'R1-2',
            title: 'Email',
            text: 'Hi Chi, I cannot come to the review session on Thursday because I have a doctor’s appointment in the afternoon. Could you send me the notes? I will go through them at the weekend and ask you about anything unclear on Monday. Thanks, Dung',
            questions: [
              { id: 'R1-2q', type: 'choice', prompt: 'Why is Dung absent?', options: ['She has a class', 'She has a medical appointment', 'She is travelling', 'She forgot the time'], answer: 'She has a medical appointment', explain: '“a doctor’s appointment in the afternoon”.' },
            ],
          },
          {
            id: 'R1-3',
            title: 'Quảng cáo',
            text: 'Learn 20 words a day with our app. The first month is free. After that, the price is 45,000 dong per month, and half price if you pay for a full year. Cancel any time before the next payment.',
            questions: [
              { id: 'R1-3q', type: 'choice', prompt: 'How can users pay less?', options: ['By studying every day', 'By paying for a year', 'By inviting a friend', 'By cancelling the trial'], answer: 'By paying for a year', explain: 'Trả cả năm được giảm một nửa.' },
            ],
          },
          {
            id: 'R1-4',
            title: 'Đánh giá lớp học',
            text: 'The speaking club helped me a lot, and the teacher was patient. However, the room was too small for thirty people, and we spent too long waiting for our turn. Please move the club to a bigger room next term.',
            questions: [
              { id: 'R1-4q', type: 'choice', prompt: 'What is the main complaint?', options: ['The teacher was impatient', 'The room was too small', 'The club was expensive', 'The topics were boring'], answer: 'The room was too small', explain: 'Phàn nàn chính là phòng quá nhỏ.' },
            ],
          },
          {
            id: 'R1-5',
            title: 'Thời khoá biểu',
            text: 'Weekend English class: Saturday 8:00–10:00 Grammar and vocabulary · Saturday 10:15–12:00 Listening practice · Sunday 8:00–10:00 Writing · Sunday 10:15–12:00 Speaking.',
            questions: [
              { id: 'R1-5q', type: 'choice', prompt: 'Which skill is practised first on Sunday?', options: ['Speaking', 'Writing', 'Listening', 'Grammar'], answer: 'Writing', explain: 'Chủ nhật 8:00–10:00 là Writing.' },
            ],
          },
          {
            id: 'R1-6',
            title: 'Ghi chú nội bộ',
            text: 'To all staff: the photocopier on the second floor is out of order until Friday. Please use the one in the library. Bring your staff card — printing is logged for each department.',
            questions: [
              { id: 'R1-6q', type: 'choice', prompt: 'Why must staff bring a card?', options: ['To open the library', 'To record printing by department', 'To pay in cash', 'To book the machine'], answer: 'To record printing by department', explain: '“printing is logged for each department”.' },
            ],
          },
          {
            id: 'R1-7',
            title: 'Nhãn sản phẩm',
            text: 'Green tea supplement — 30 capsules. Take one capsule daily with water after a meal. Do not take more than two capsules in 24 hours. Keep away from children under 12. Store below 25°C.',
            questions: [
              { id: 'R1-7q', type: 'choice', prompt: 'When should the capsule be taken?', options: ['Before breakfast', 'After a meal', 'At bedtime', 'Anytime with milk'], answer: 'After a meal', explain: '“with water after a meal”.' },
            ],
          },
          {
            id: 'R1-8',
            title: 'Lời mời',
            text: 'You are invited to the opening of the new student study centre on Friday at 4 p.m. There will be short talks, a tour of the rooms and free coffee. Please reply to Linh by Wednesday so we know how many chairs to prepare.',
            questions: [
              { id: 'R1-8q', type: 'choice', prompt: 'Why should guests reply?', options: ['To get a free gift', 'To help organisers plan seating', 'To choose a talk', 'To book a room'], answer: 'To help organisers plan seating', explain: 'Trả lời để ban tổ chức biết cần bao nhiêu ghế.' },
            ],
          },
          {
            id: 'R1-9',
            title: 'Phản hồi của giáo viên',
            text: 'Your essay has a clear structure and good linking words. Two points to improve: the second paragraph repeats the same idea three times, and your conclusion introduces a new argument, which should appear in the body instead.',
            questions: [
              { id: 'R1-9q', type: 'choice', prompt: 'What should be changed in the conclusion?', options: ['It should be longer', 'It should not add a new argument', 'It needs more examples', 'It should be deleted'], answer: 'It should not add a new argument', explain: 'Kết luận không nên đưa luận điểm mới.' },
            ],
          },
          {
            id: 'R1-10',
            title: 'Bài đăng trên diễn đàn',
            text: 'I used to study in the library every evening, but I always ended up chatting with friends. Now I study at home for two hours, then go to the library only for group work. My marks went up, and I sleep more.',
            questions: [
              { id: 'R1-10q', type: 'choice', prompt: 'What changed for the writer?', options: ['He stopped studying with others', 'He studies at home and uses the library only for group work', 'He joined a new club', 'He gave up his marks'], answer: 'He studies at home and uses the library only for group work', explain: 'Học ở nhà 2 tiếng, thư viện chỉ để làm việc nhóm.' },
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
            title: 'Teaching what you learn',
            text: `Most students revise by reading. They open a notebook, follow the words with a pen, and after an hour they feel that the material is familiar. Feeling familiar, however, is not the same as being able to use the language in a test or in a conversation.

In the 1980s, researchers in the United States compared two groups of students. One group read a passage twice. The other read it once and then explained it to a partner who had not seen the text. A week later, the second group performed better, and in later studies the difference reached twenty per cent.

Two explanations are usually given. The first is about honesty: when you explain, you cannot hide behind difficult words. You must choose simple language, give examples and answer unexpected questions, and each time you get stuck you find a gap. The second explanation is about time. Rereading is comfortable, so people continue for hours and mistake comfort for progress. Explaining is uncomfortable, so most learners stop after ten minutes — yet those ten minutes produce more results than two hours of rereading.

Teachers who use this method in class mention two practical rules. First, the person who studied the text should speak for about two thirds of the time; otherwise the explanation turns into a lecture from the stronger student. Second, explaining must be followed by real practice. Talking about how to write an essay helps, but it cannot replace writing one.

There is one more benefit that appears in almost every study: the questions. When a partner asks something you cannot answer, that question is more useful than any summary. Students who write these questions down and revise them before an exam usually find that a large share of the test problems look strangely familiar.`,
            glossary: [
              { word: 'revise', meaning: 'ôn lại' },
              { word: 'familiar', meaning: 'quen thuộc' },
              { word: 'hide behind', meaning: 'nấp sau, dựa vào' },
              { word: 'get stuck', meaning: 'bị tắc' },
              { word: 'share', meaning: 'phần, tỉ lệ' },
            ],
            questions: [
              { id: 'R2-1q1', type: 'choice', prompt: 'What is the writer’s main point?', options: ['Reading is a waste of time', 'Familiarity does not prove that you have learned', 'Students should study only in groups', 'Notebooks are necessary for revision'], answer: 'Familiarity does not prove that you have learned', explain: 'Đoạn 1: cảm giác quen thuộc không đồng nghĩa đã học được.' },
              { id: 'R2-1q2', type: 'choice', prompt: 'In the 1980s experiment, what did the second group do?', options: ['Read the passage three times', 'Wrote a summary alone', 'Explained the passage to a partner', 'Listened to a recording'], answer: 'Explained the passage to a partner', explain: 'Nhóm 2 đọc một lần rồi giảng lại cho bạn.' },
              { id: 'R2-1q3', type: 'choice', prompt: 'What does the word “honesty” refer to?', options: ['Never copying homework', 'Being unable to hide gaps in understanding', 'Telling the teacher the truth', 'Sharing notes with friends'], answer: 'Being unable to hide gaps in understanding', explain: 'Giải thích giúp bạn lộ ra chỗ chưa hiểu.' },
              { id: 'R2-1q4', type: 'choice', prompt: 'Why do learners stop explaining after ten minutes?', options: ['It is uncomfortable', 'The partner leaves', 'The teacher stops them', 'They finish the text'], answer: 'It is uncomfortable', explain: '“Explaining is uncomfortable, so most learners stop after ten minutes.”' },
              { id: 'R2-1q5', type: 'choice', prompt: 'What is the first practical rule?', options: ['Explain in English only', 'The text reader speaks for most of the time', 'The strongest student explains', 'Explain in writing'], answer: 'The text reader speaks for most of the time', explain: 'Người đọc bài phải nói khoảng 2/3 thời gian.' },
              { id: 'R2-1q6', type: 'choice', prompt: 'What does the writer say about practising?', options: ['It is optional', 'It should be replaced by explaining', 'It must follow explaining', 'It should come first'], answer: 'It must follow explaining', explain: 'Sau khi giải thích vẫn phải luyện tập thật.' },
              { id: 'R2-1q7', type: 'choice', prompt: 'Which is described as more useful than a summary?', options: ['A long list of new words', 'The partner’s questions', 'A recorded lecture', 'A corrected essay'], answer: 'The partner’s questions', explain: 'Câu hỏi bạn học đặt ra hữu ích hơn bản tóm tắt.' },
              { id: 'R2-1q8', type: 'fill', prompt: 'In later studies the difference between the two groups reached ___ per cent. (write the number)', answers: ['20', 'twenty'], explain: '“the difference reached twenty per cent”.' },
              { id: 'R2-1q9', type: 'fill', prompt: 'Explaining turns into a ___ from the stronger student if the rule is not followed. (one word)', answers: ['lecture'], explain: '“turns into a lecture from the stronger student”.' },
              { id: 'R2-1q10', type: 'choice', prompt: 'What happens to students who revise the recorded questions?', options: ['They learn fewer words', 'Many test problems look familiar', 'They need less sleep', 'They stop taking notes'], answer: 'Many test problems look familiar', explain: 'Câu cuối: nhiều câu trong đề thi trông rất quen.' },
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
            title: 'Why we postpone, and what actually helps',
            text: `Almost every student delays something. The interesting question is not whether we postpone, but what makes some tasks easy to start and others impossible.

One common explanation is that delay is caused by poor time management. Yet when researchers ask students to describe the moments they postpone, the answers are strangely similar: the task feels enormous, the first step is unclear, and the result cannot be judged for weeks. Boring tasks, on the other hand, are often completed without delay. The problem, then, is not laziness but emotion. A task that makes us feel incompetent is a task we avoid.

This has a practical consequence. Advice such as “work harder” or “plan your day in fifteen-minute blocks” does not touch the emotion, and that is why it so often fails. What does help, in experiments, is the opposite: making the task smaller and less frightening.

Three techniques have been tested repeatedly. The first is a two-minute start: students are told to open the document and do something trivial, such as writing the title. Once the document exists, the second session is easier, because the brain no longer has to invent the beginning. The second is a very rough first version: promising yourself that the first draft will be terrible removes the fear of judgement, and students who plan a rough draft finish earlier. The third is a fixed finishing time rather than a starting time. A writer who decides to stop at six in the evening works in a more concentrated way than one who plans to start at nine in the morning, because the end point is not moveable.

None of this means that planning is useless. Deadlines and calendars help, but mainly with other people’s expectations: they make our promises to colleagues and teachers visible. The internal battle, however, is decided by the size of the first step. That is why the most reliable sentence in the whole literature on delaying is also the simplest: begin badly, but begin.`,
            glossary: [
              { word: 'postpone / delay', meaning: 'trì hoãn' },
              { word: 'enormous', meaning: 'khổng lồ' },
              { word: 'incompetent', meaning: 'kém cỏi, không đủ khả năng' },
              { word: 'trivial', meaning: 'nhỏ nhặt, tầm thường' },
              { word: 'concentrated', meaning: 'tập trung cao độ' },
            ],
            questions: [
              { id: 'R3-1q1', type: 'choice', prompt: 'What is the writer most interested in?', options: ['How often students delay', 'Why some tasks are easy to start', 'Which calendars work best', 'How teachers set deadlines'], answer: 'Why some tasks are easy to start', explain: 'Mở bài nói câu hỏi thú vị là vì sao có việc dễ bắt đầu, có việc không.' },
              { id: 'R3-1q2', type: 'choice', prompt: 'What does research suggest about boring tasks?', options: ['They are always postponed', 'They are often done without delay', 'They need a partner', 'They take two minutes'], answer: 'They are often done without delay', explain: '“Boring tasks, on the other hand, are often completed without delay.”' },
              { id: 'R3-1q3', type: 'choice', prompt: 'According to the text, the real cause of delay is…', options: ['laziness', 'poor planning', 'emotion', 'a lack of time'], answer: 'emotion', explain: '“The problem, then, is not laziness but emotion.”' },
              { id: 'R3-1q4', type: 'choice', prompt: 'Why does the writer doubt advice like “work harder”?', options: ['It is rude', 'It does not change the feeling that blocks you', 'It takes too long', 'It only works for writers'], answer: 'It does not change the feeling that blocks you', explain: 'Lời khuyên đó không chạm tới cảm xúc gây trì hoãn.' },
              { id: 'R3-1q5', type: 'choice', prompt: 'What is the “two-minute start”?', options: ['Working for exactly two minutes then stopping', 'Doing something tiny to create the document', 'Planning your day in two-minute blocks', 'Reading the task twice'], answer: 'Doing something tiny to create the document', explain: 'Mở file và viết một thứ nhỏ như tiêu đề.' },
              { id: 'R3-1q6', type: 'choice', prompt: 'How does planning a rough draft help?', options: ['It improves grammar', 'It removes fear of judgement', 'It shortens the deadline', 'It attracts feedback from teachers'], answer: 'It removes fear of judgement', explain: 'Hứa rằng bản nháp sẽ rất dở → bỏ nỗi sợ bị đánh giá.' },
              { id: 'R3-1q7', type: 'choice', prompt: 'Why is a finishing time better than a starting time?', options: ['It is easier to remember', 'It cannot be moved', 'It suits writers only', 'It allows longer breaks'], answer: 'It cannot be moved', explain: 'Điểm kết thúc cố định nên khó trì hoãn.' },
              { id: 'R3-1q8', type: 'choice', prompt: 'What are deadlines useful for?', options: ['Managing your own feelings', 'Making promises to other people visible', 'Replacing calendars', 'Reducing the workload'], answer: 'Making promises to other people visible', explain: 'Hạn chót hữu ích chủ yếu với cam kết với người khác.' },
              { id: 'R3-1q9', type: 'fill', prompt: 'The most reliable sentence in the literature is “begin badly, but ___”. (one word)', answers: ['begin'], explain: '“begin badly, but begin”.' },
              { id: 'R3-1q10', type: 'choice', prompt: 'What is the writer’s tone?', options: ['Humorous and careless', 'Practical and reassuring', 'Angry at students', 'Formal and distant'], answer: 'Practical and reassuring', explain: 'Bài viết thực tế, động viên, không chỉ trích.' },
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
            title: 'Note-taking that survives the exam',
            text: `Many students take notes in a way that makes revision harder. They write long sentences, (1)___ they never read again. A better system starts with a simple rule: notes should (2)___ questions, not answers.

One popular method is the Cornell layout. You divide the page (3)___ two columns. On the right you write the main ideas (4)___ the lesson; on the left, later, you write a question for each idea. When you revise, you cover the right column and try to (5)___ the answer from the question. This turns reading into a small test.

Colour also matters, but not in the way most people think. Highlighting (6)___ feels productive, yet it usually changes very little, because choosing a colour is not the same (7)___ understanding an idea. A more useful habit is to write the reason (8)___ you marked a sentence: “definition”, “example”, “exam question”.

Finally, keep one page for the mistakes you (9)___. Before an exam, ten minutes with that page is usually worth more (10)___ an hour of rereading.`,
            questions: [
              { id: 'R4-1q1', type: 'choice', prompt: 'Chỗ (1)', options: ['which', 'who', 'whose', 'where'], answer: 'which', explain: 'Mệnh đề quan hệ thay cho “long sentences” (vật).' },
              { id: 'R4-1q2', type: 'choice', prompt: 'Chỗ (2)', options: ['contain', 'containing', 'contained', 'contains'], answer: 'contain', explain: 'Sau “should” dùng động từ nguyên thể.' },
              { id: 'R4-1q3', type: 'choice', prompt: 'Chỗ (3)', options: ['in', 'into', 'on', 'at'], answer: 'into', explain: '“divide the page into two columns”.' },
              { id: 'R4-1q4', type: 'choice', prompt: 'Chỗ (4)', options: ['from', 'of', 'at', 'with'], answer: 'of', explain: '“the main ideas of the lesson”.' },
              { id: 'R4-1q5', type: 'choice', prompt: 'Chỗ (5)', options: ['remember', 'remind', 'memorise of', 'recall to'], answer: 'remember', explain: '“remember the answer” — nhớ lại câu trả lời.' },
              { id: 'R4-1q6', type: 'choice', prompt: 'Chỗ (6)', options: ['look', 'looks', 'looking', 'to look'], answer: 'looks', explain: 'Chủ ngữ “Highlighting” (số ít) → looks.' },
              { id: 'R4-1q7', type: 'choice', prompt: 'Chỗ (7)', options: ['as', 'like', 'than', 'to'], answer: 'as', explain: '“the same as”.' },
              { id: 'R4-1q8', type: 'choice', prompt: 'Chỗ (8)', options: ['why', 'because', 'so', 'although'], answer: 'why', explain: '“the reason why you marked a sentence”.' },
              { id: 'R4-1q9', type: 'choice', prompt: 'Chỗ (9)', options: ['make', 'do', 'take', 'get'], answer: 'make', explain: '“the mistakes you make”.' },
              { id: 'R4-1q10', type: 'choice', prompt: 'Chỗ (10)', options: ['than', 'then', 'as', 'of'], answer: 'than', explain: 'So sánh hơn: “worth more than”.' },
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
        title: 'Task 1 · Email mời tham gia nhóm học',
        prompt: 'You are planning a weekly study group for the English exam. Write an email (about 120 words) to your classmate, Hoa. In your email: invite her to join, explain when and where the group will meet, say what you will prepare for the first meeting, and ask her to reply by Thursday.',
        minWords: 120,
        checklist: [
          { label: 'Có lời chào và lời kết phù hợp', hint: 'Hi Hoa, … / See you soon, Minh' },
          { label: 'Nêu rõ mục đích của email (mời tham gia nhóm học)', hint: 'I am writing to invite you to…' },
          { label: 'Có thời gian, địa điểm cụ thể', hint: 'We will meet every Sunday at 9 a.m. in the city library.' },
          { label: 'Nói bạn sẽ chuẩn bị gì cho buổi đầu', hint: 'I will bring… / I have prepared…' },
          { label: 'Có đề nghị trả lời trước thứ Năm', hint: 'Could you let me know by Thursday?' },
          { label: 'Đủ số từ (~120) và dùng ít nhất 3 từ nối', hint: 'however, because, so, in addition' },
        ],
        tips: [
          'Email VSTEP Task 1 cần đủ 4 ý trong đề; thiếu một ý sẽ mất điểm nội dung.',
          'Dùng câu ngắn, rõ; tránh viết quá dài rồi sai ngữ pháp.',
          'Nên có 1 câu hỏi thân thiện ở cuối để thể hiện sự tương tác.',
        ],
        model: `Hi Hoa,

How are you? I hope your week is going well. I am writing to invite you to join a small study group for the English exam next month.

We are planning to meet every Sunday from 9 a.m. to 11 a.m. in the group study room on the third floor of the city library. The room is quiet and we can book it online in advance. There will be four of us, so we can practise speaking in pairs.

For the first meeting, I will bring a list of common topics and two short listening tasks. I have also made a simple timetable that we can change together.

Could you let me know by Thursday if you would like to join? I really hope you can come, because you always explain grammar clearly.

See you soon,
Minh`,
      },
      {
        id: 'W2',
        task: 2,
        title: 'Task 2 · Luận: học nhóm hay tự học?',
        prompt: 'Some students prefer to study alone, while others believe that studying in a group is more effective. Write an essay (about 250 words) discussing both views and giving your own opinion. Use reasons and examples to support your answer.',
        minWords: 250,
        checklist: [
          { label: 'Mở bài giới thiệu chủ đề và nêu hướng làm bài', hint: 'Many students wonder whether…' },
          { label: 'Có đoạn trình bày lợi ích của học nhóm', hint: 'On the one hand, …' },
          { label: 'Có đoạn trình bày lợi ích của tự học', hint: 'On the other hand, …' },
          { label: 'Nêu ý kiến cá nhân rõ ràng', hint: 'In my opinion, … because …' },
          { label: 'Có ít nhất 2 ví dụ/trải nghiệm cụ thể', hint: 'For example, last semester I…' },
          { label: 'Có từ nối giữa các đoạn (however, therefore, in conclusion)', hint: 'however, therefore, in conclusion' },
          { label: 'Kết luận tóm tắt lại quan điểm, không nêu ý mới', hint: 'In conclusion, …' },
          { label: 'Đủ số từ (~250)', hint: 'Kiểm tra số từ ở khung soạn thảo' },
        ],
        tips: [
          'Luận VSTEP cần cân đối: 2 đoạn thân bài cho hai quan điểm, 1 đoạn nêu ý kiến.',
          'Đừng mở bài quá dài — 2–3 câu là đủ.',
          'Lặp từ là lỗi phổ biến: dùng “benefit, advantage, positive side” để thay nhau.',
        ],
        model: `Many students wonder whether it is better to prepare for an exam alone or with classmates. Both ways have clear advantages, and the best choice often depends on the subject and on the person.

On the one hand, group study is useful because it makes learning active. When you explain a grammar rule to a friend, you quickly discover what you do not understand. In addition, a group can share materials: last semester my group divided four reading topics, and each of us summarised one topic for the others, which saved us many hours. Speaking practice is also more realistic when there is somebody to answer you.

On the other hand, studying alone gives concentration that a group cannot offer. Quiet time is necessary for memorising vocabulary and for writing a full essay from beginning to end. Moreover, some students work faster alone, because they do not have to wait for others or discuss which café to go to.

In my opinion, the two methods should be combined rather than compared. I usually read and take notes by myself during the week, and then meet my group once at the weekend to explain what I learned and to practise speaking. This combination keeps the knowledge active without losing the quiet time I need.

In conclusion, group study is excellent for explaining, testing and speaking, while private study is better for deep concentration. A learner who uses both will make progress faster than a learner who chooses only one. If I had to give one piece of advice, it would be this: read alone, then explain what you read to somebody else.`,
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
        instruction: 'Bạn sẽ nghe 3 câu hỏi về thói quen học tập. Trả lời mỗi câu 1–2 phút, nói tự nhiên như đang trò chuyện.',
        minutes: 3,
        questions: [
          { q: 'How do you usually prepare for an important English test?', sample: 'I usually start about two weeks before the exam. I make a list of the topics I need, then I spend forty minutes every evening on vocabulary and listening. At the weekend I do a full practice test to check my speed. I have learned that I remember more when I study at the same time each day, so I try to keep that routine.' },
          { q: 'Do you prefer studying at home or in a library? Why?', sample: 'I prefer the library for reading, but home is better for writing. In the library I cannot lie on my bed, so I concentrate more, and there is no one to talk to. At home, however, I have my computer and my notes, which makes writing an essay easier. So it depends on the task.' },
          { q: 'What is the most difficult skill for you, and what do you do about it?', sample: 'Listening is the most difficult for me, especially when people speak quickly and use connected speech. To improve, I listen to short news reports twice: the first time for the main idea, the second time with the transcript. I also write down the phrases I missed and review them with flashcards.' },
        ],
      },
      {
        id: 'S2',
        kind: 'solution',
        title: 'Part 2 · Thảo luận giải pháp',
        instruction: 'Bạn và một người bạn đang bàn cách giúp em trai của bạn ấy học tiếng Anh tốt hơn. Hãy thảo luận ưu điểm, nhược điểm của 3 lựa chọn rồi chọn một phương án và giải thích.',
        minutes: 4,
        situation: 'Your friend’s younger brother is fifteen and wants to improve his English, but he gets bored easily and has only a little money. Three options are suggested.',
        options: [
          'Join a weekly evening class at a language centre',
          'Study alone with a mobile app and free online lessons',
          'Go to a summer course abroad for one month',
        ],
        sample: `Let us look at the three options. The evening class at a language centre is reliable because a teacher corrects him and he must attend regularly. It also gives him classmates to speak with. However, it costs money every month, and a bored teenager may stop going after a few weeks.

The app with free online lessons is cheap and flexible, and he can study for fifteen minutes on the bus. The problem is motivation: nobody checks his progress, and it is easy to switch to a game or a video.

The summer course abroad would be the fastest way to improve, because he would hear English all day. Still, it is very expensive and only one month long, so the effect may disappear when he comes home.

If I have to choose, I would mix the first two: an evening class once a week keeps him on track, and the app fills the other days. With a class, there is a teacher and a fixed time, and the app makes daily practice possible without much money. That combination solves the motivation problem and fits the family budget.`,
      },
      {
        id: 'S3',
        kind: 'topic',
        title: 'Part 3 · Phát triển chủ đề',
        instruction: 'Trình bày quan điểm của bạn về chủ đề dưới đây (khoảng 3 phút), dựa vào 3 gợi ý. Sau đó trả lời 2 câu hỏi mở rộng.',
        minutes: 5,
        topic: 'Online learning has become common in schools and universities.',
        outline: [
          'Lợi ích của học trực tuyến',
          'Khó khăn của học trực tuyến',
          'Kinh nghiệm của bạn và lời khuyên',
        ],
        questions: [
          { q: 'Do you think online lessons can replace classroom lessons completely?', sample: 'Not completely, in my view. Online lessons are excellent for lectures and for practising listening, because you can pause and repeat. But classroom time gives something a screen cannot: immediate reactions, group work and the discipline of being in a room with other learners. I would keep both, using online lessons for input and classrooms for speaking.' },
          { q: 'What advice would you give to a student who finds it hard to concentrate at home?', sample: 'I would suggest three simple things. First, keep one small area only for studying, even if it is just a corner of the table. Second, use a timer for thirty minutes and take a five-minute break, because a clear end point makes starting easier. Third, tell a friend your plan for the day and report to them in the evening, since a promise to somebody else is stronger than a promise to yourself.' },
        ],
      },
    ],
  },
};
