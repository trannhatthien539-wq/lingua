/**
 * Đề VSTEP B2 số 4 — chủ đề truyền thông & xã hội (nội dung gốc, viết theo đúng format đề thi).
 * Xem `docs/vstep-schema.md` để biết ý nghĩa từng field.
 */
export default {
  id: 'b2-04',
  level: 'B2',
  title: 'Đề B2 số 4 · Truyền thông & xã hội',
  tags: ['truyền thông', 'xã hội', 'B2'],

  listening: {
    minutes: 40,
    parts: [
      {
        id: 'L1',
        title: 'Part 1 · Thông báo ngắn',
        instruction: 'Bạn sẽ nghe 8 thông báo ngắn. Mỗi thông báo có một câu hỏi. Chọn đáp án đúng nhất.',
        transcript: [
          { speaker: 'Narrator', line: 'Announcement one. Thank you for listening to Riverside Community Radio. Because of essential work on our transmitter next Monday, we will broadcast online only from six in the morning until two in the afternoon. Normal FM service returns at two.' },
          { speaker: 'Narrator', line: 'Announcement two. This is the Daily Post subscription line. Your digital subscription renews on the first of each month at nine dollars. Readers who also want the Saturday print edition pay five dollars more. Cancellations must be made three days before renewal.' },
          { speaker: 'Narrator', line: 'Announcement three. The city library is running a free workshop called “Is this story true?” on Thursday at six in the evening. Participants will practise checking photographs and statistics with simple online tools. Places are limited to twenty-five.' },
          { speaker: 'Narrator', line: 'Announcement four. A message from Connect Mobile. Your monthly plan now includes ten extra gigabytes of data at no extra cost, but the price will rise by one dollar in September. You can change to a smaller plan at any time through the app.' },
          { speaker: 'Narrator', line: 'Announcement five. Reporters wishing to cover the Northgate Film Festival should apply for accreditation before Friday. Applications must include a letter from an editor and a photograph. Late applications cannot be considered because of limited seating.' },
          { speaker: 'Narrator', line: 'Announcement six. Free public wifi is available in the central square and the market hall. Sessions end automatically after sixty minutes, and users should avoid entering bank details on public networks, as the connection is not secure.' },
          { speaker: 'Narrator', line: 'Announcement seven. Series two of the podcast “After the Headline” begins on Tuesday the fourth. New episodes appear every second Tuesday, and transcripts are published on our website on the same day for learners of English.' },
          { speaker: 'Narrator', line: 'Announcement eight. The town council is asking residents for their views on plans for a new community centre beside the sports field. The online survey closes on 30 June, and a public meeting will be held in the town hall on 12 July.' },
        ],
        questions: [
          { id: 'L1-1', type: 'choice', prompt: 'Why will the radio station broadcast online only?', options: ['There is a strike', 'There is work on the transmitter', 'The studio has moved', 'The sports coverage has ended'], answer: 'There is work on the transmitter', explain: 'Do sửa chữa cột phát sóng nên thứ Hai chỉ phát online đến 2 giờ chiều.' },
          { id: 'L1-2', type: 'choice', prompt: 'What must readers do to cancel a subscription?', options: ['Write a letter', 'Cancel three days before renewal', 'Pay an extra five dollars', 'Call before the first of the month'], answer: 'Cancel three days before renewal', explain: '“Cancellations must be made three days before renewal.”' },
          { id: 'L1-3', type: 'choice', prompt: 'What will participants do at the workshop?', options: ['Write a news report', 'Check photographs and statistics', 'Interview a journalist', 'Design a website'], answer: 'Check photographs and statistics', explain: 'Học viên thực hành kiểm tra ảnh và số liệu bằng công cụ đơn giản.' },
          { id: 'L1-4', type: 'choice', prompt: 'What is changing about the mobile plan?', options: ['It includes less data', 'The price will rise in September', 'It ends next month', 'It is free for students'], answer: 'The price will rise in September', explain: 'Thêm 10GB miễn phí nhưng từ tháng 9 giá tăng một đô la.' },
          { id: 'L1-5', type: 'choice', prompt: 'Why can late applications not be accepted?', options: ['Because of limited seating', 'Because the editor is away', 'Because of printing costs', 'Because photographs are missing'], answer: 'Because of limited seating', explain: '“Late applications cannot be considered because of limited seating.”' },
          { id: 'L1-6', type: 'choice', prompt: 'What does the speaker warn about public wifi?', options: ['It is very slow', 'It costs money after an hour', 'It is not secure for bank details', 'It only works outdoors'], answer: 'It is not secure for bank details', explain: 'Không nên nhập thông tin ngân hàng trên mạng công cộng vì không an toàn.' },
          { id: 'L1-7', type: 'choice', prompt: 'How often does the podcast publish new episodes?', options: ['Every Tuesday', 'Every second Tuesday', 'Once a month', 'Every weekday'], answer: 'Every second Tuesday', explain: '“New episodes appear every second Tuesday.”' },
          { id: 'L1-8', type: 'choice', prompt: 'What can residents do until 30 June?', options: ['Visit the community centre', 'Complete an online survey', 'Attend a public meeting', 'Use the sports field'], answer: 'Complete an online survey', explain: 'Khảo sát trực tuyến kết thúc ngày 30 tháng 6; cuộc họp công khai là 12 tháng 7.' },
        ],
      },
      {
        id: 'L2',
        title: 'Part 2 · Hội thoại',
        instruction: 'Bạn sẽ nghe 2 đoạn hội thoại. Mỗi đoạn có 6 câu hỏi.',
        transcript: [
          { speaker: 'Ravi', line: 'Khanh, you are producing the school radio programme this term. How is it going?' },
          { speaker: 'Khanh', line: 'Busy, honestly. We record on Wednesdays, but the editing takes longer than the recording itself.' },
          { speaker: 'Ravi', line: 'What has been the most difficult part?' },
          { speaker: 'Khanh', line: 'Finding people who are willing to speak on record. Two teachers agreed, and then changed their minds the day before we recorded.' },
          { speaker: 'Ravi', line: 'How long is each episode?' },
          { speaker: 'Khanh', line: 'Twelve minutes. We wanted twenty, but the head teacher prefers shorter episodes so that more classes can listen in one lesson.' },
          { speaker: 'Ravi', line: 'And how do you check a story before you broadcast it?' },
          { speaker: 'Khanh', line: 'Every claim has to be confirmed by two sources. If we quote a student, we send them the exact sentence and the context, and we ask for permission in writing.' },
          { speaker: 'Ravi', line: 'Have you made any mistakes?' },
          { speaker: 'Khanh', line: 'In episode two we gave a teacher the wrong title, which was embarrassing. We corrected it at the start of episode three, and since then one person checks names and jobs before the recording ends.' },
          { speaker: 'Ravi', line: 'What advice would you give the team next year?' },
          { speaker: 'Khanh', line: 'Two things. Record the ambient sound first, because the room and the corridor noise take time to collect. And start editing the same day, while you still remember why you chose each clip.' },
          { speaker: 'Ravi', line: 'One last question — what surprised you most?' },
          { speaker: 'Khanh', line: 'How much preparation goes into twelve minutes. We spend about nine hours on each episode, and listeners still say it sounds easy.' },
          { speaker: 'Narrator', line: 'Now listen to a conversation between a parent and a teacher about a teenager’s phone use.' },
          { speaker: 'Mr Ellis', line: 'Thank you for coming in, Mrs Dao. Thu is doing well in class, but she has seemed very tired in the mornings lately.' },
          { speaker: 'Mrs Dao', line: 'She takes her phone to bed and I know she is still on it at midnight. We argue about it every single evening.' },
          { speaker: 'Mr Ellis', line: 'How long does she spend on social media on a school day?' },
          { speaker: 'Mrs Dao', line: 'Probably three hours, and five or six hours at the weekend.' },
          { speaker: 'Mr Ellis', line: 'That is fairly typical. What have you tried so far?' },
          { speaker: 'Mrs Dao', line: 'I took the phone away for a week. She was angry for two days and then she seemed fine, but her friends stopped messaging her and she felt left out.' },
          { speaker: 'Mr Ellis', line: 'That is the difficulty. The phone is also how her class organises homework and group projects.' },
          { speaker: 'Mrs Dao', line: 'So what do other families do?' },
          { speaker: 'Mr Ellis', line: 'The families where it works usually keep the phone out of the bedroom but allow it in the living room until nine. The rule is about the place and the time, not about the phone itself.' },
          { speaker: 'Mrs Dao', line: 'And what about me? I check my email at dinner.' },
          { speaker: 'Mr Ellis', line: 'That matters more than parents expect. If the adults put their phones in a box during meals, children copy the habit much faster than they obey an instruction.' },
          { speaker: 'Mrs Dao', line: 'We could try that. Should I set a time limit on the apps as well?' },
          { speaker: 'Mr Ellis', line: 'Limits help at the beginning, but they are easy to override. A written family agreement, signed by everyone including you, works better, and we can review it together after three weeks.' },
        ],
        questions: [
          { id: 'L2-1', type: 'choice', prompt: 'Which part of the programme takes the most time?', options: ['The recording', 'The editing', 'The interviews', 'The printing'], answer: 'The editing', explain: '“the editing takes longer than the recording itself”.' },
          { id: 'L2-2', type: 'choice', prompt: 'What was difficult about the interviews?', options: ['The room was noisy', 'Finding people willing to speak on record', 'Getting enough equipment', 'Understanding accents'], answer: 'Finding people willing to speak on record', explain: 'Hai giáo viên đồng ý rồi đổi ý trước ngày ghi âm.' },
          { id: 'L2-3', type: 'choice', prompt: 'Why are episodes twelve minutes long?', options: ['The students prefer it', 'The head teacher prefers shorter episodes', 'Equipment limits the length', 'The bell interrupts recording'], answer: 'The head teacher prefers shorter episodes', explain: 'Hiệu trưởng thích tập ngắn để nhiều lớp có thể nghe trong một tiết.' },
          { id: 'L2-4', type: 'choice', prompt: 'What rule must every claim follow?', options: ['It must be recorded in the studio', 'It must be confirmed by two sources', 'It must be checked by the head teacher', 'It must be less than a minute'], answer: 'It must be confirmed by two sources', explain: 'Mọi thông tin phải được xác nhận bởi hai nguồn.' },
          { id: 'L2-5', type: 'choice', prompt: 'What mistake was made in episode two?', options: ['A teacher was given the wrong title', 'A guest never arrived', 'The music was too loud', 'A name was spelled wrongly on the website'], answer: 'A teacher was given the wrong title', explain: 'Tập 2 gọi sai chức danh của một giáo viên.' },
          { id: 'L2-6', type: 'fill', prompt: 'Since episode three, one person checks names and ___ before the recording ends. (one word)', answers: ['jobs'], explain: '“one person checks names and jobs before the recording ends”.' },
          { id: 'L2-7', type: 'choice', prompt: 'Why does Mr Ellis want to speak to Mrs Dao?', options: ['Thu has missed homework', 'Thu has seemed very tired in the mornings', 'Thu argued with a teacher', 'Thu has been absent from class'], answer: 'Thu has seemed very tired in the mornings', explain: 'Giáo viên nhận thấy Thu có vẻ rất mệt vào buổi sáng.' },
          { id: 'L2-8', type: 'choice', prompt: 'How long does Thu spend on social media on a school day?', options: ['About one hour', 'About three hours', 'Five or six hours', 'Almost all evening'], answer: 'About three hours', explain: 'Ngày đi học khoảng ba giờ, cuối tuần năm đến sáu giờ.' },
          { id: 'L2-9', type: 'choice', prompt: 'What happened when the phone was taken away for a week?', options: ['She improved her marks', 'She felt left out by her friends', 'She refused to go to school', 'She bought another phone'], answer: 'She felt left out by her friends', explain: 'Bạn bè ngừng nhắn tin nên cô bé cảm thấy bị bỏ rơi.' },
          { id: 'L2-10', type: 'choice', prompt: 'What do the families where the rule works usually do?', options: ['Keep the phone out of the bedroom', 'Remove social media apps', 'Buy a second phone', 'Ask the school to hold the phone'], answer: 'Keep the phone out of the bedroom', explain: 'Không mang điện thoại vào phòng ngủ nhưng được dùng ở phòng khách đến 9 giờ.' },
          { id: 'L2-11', type: 'choice', prompt: 'Why does the teacher mention parents’ own phone use?', options: ['Parents need more sleep', 'Children copy what adults do', 'Parents set the timetable', 'Teachers cannot control it'], answer: 'Children copy what adults do', explain: 'Trẻ bắt chước người lớn nhanh hơn là làm theo lời nhắc.' },
          { id: 'L2-12', type: 'choice', prompt: 'What does the teacher recommend instead of app limits?', options: ['A stricter time limit', 'A written family agreement', 'No phone at all', 'Extra homework'], answer: 'A written family agreement', explain: 'Giới hạn dễ bị vượt qua; bản thoả thuận gia đình có chữ ký hiệu quả hơn.' },
        ],
      },
      {
        id: 'L3',
        title: 'Part 3 · Bài nói',
        instruction: 'Bạn sẽ nghe 2 bài nói. Phần 1 có 8 câu hỏi, phần 2 có 7 câu hỏi.',
        transcript: [
          { speaker: 'Lecturer', line: 'Let us begin with an uncomfortable statistic. In a study of millions of messages on one large social platform, false stories were shared far more often than accurate ones, and they reached fifteen hundred people in about one sixth of the time. The difference was not caused by robots; humans were more likely to share the false items.' },
          { speaker: 'Lecturer', line: 'Why? The answer seems to be novelty and emotion. False stories are often surprising and deliberately designed to make readers angry or afraid. Surprising content travels, and anger travels fastest of all, because sharing it feels like doing something useful.' },
          { speaker: 'Lecturer', line: 'Notice that this is not mainly a technology problem. The design of a feed rewards attention, certainly, but the decision to forward a message is ours, and it takes about two seconds to make.' },
          { speaker: 'Lecturer', line: 'The second finding concerns corrections. When a claim is corrected, the correction usually reaches only a small part of the original audience, and people who have already shared the claim often become more confident rather than less. Simply repeating a false claim in order to deny it can make it more familiar, and familiar statements feel true.' },
          { speaker: 'Lecturer', line: 'So what works? Three approaches have evidence behind them. The first is waiting. Teaching students to pause before sharing reduces the spread of unverified stories more than telling them to check carefully, because “check carefully” is a vague instruction and “wait thirty seconds” is a clear one.' },
          { speaker: 'Lecturer', line: 'The second is lateral reading. Instead of studying a website to see whether it looks professional, open a new tab and find out what other sources say about the same organisation. Professional design is cheap; a reputation in other sources is not.' },
          { speaker: 'Lecturer', line: 'The third is prebunking, which means showing people a weak example of a manipulation technique before they meet a strong one. After a two-minute explanation, participants who had been warned about emotional language were much less likely to share a fake post six weeks later.' },
          { speaker: 'Lecturer', line: 'None of these methods requires an expert. They require a habit: slow down, look elsewhere, and know the tricks. That is a poor defence against a well-funded campaign, but it is a very good defence against the messages we forward ourselves.' },
          { speaker: 'Narrator', line: 'Now listen to a short radio report about a local newspaper.' },
          { speaker: 'Reporter', line: 'The Bredon Weekly is one hundred and thirty years old, and three years ago it nearly closed. Its circulation had fallen from nine thousand copies to under two thousand, and the family that had owned it since 1961 announced that the last edition would appear in June.' },
          { speaker: 'Reporter', line: 'What saved it was not a rich investor but a change of business model. Two of the journalists bought the title for a symbolic one pound, moved out of the town-centre office and began printing once a week instead of twice.' },
          { speaker: 'Reporter', line: 'Then they did something unusual: they asked readers what they wanted. The answers were surprising. Very few people asked for national news, which they can read for free. What they wanted was council meetings, school results, planning applications and local sport — information nobody else was collecting.' },
          { speaker: 'Reporter', line: 'The paper now employs four people instead of eleven, and two of them spend most of the week in meetings rather than at a desk. Since the relaunch, paying subscribers have grown to four thousand, and about sixty per cent of income now comes from subscriptions rather than advertising.' },
          { speaker: 'Reporter', line: 'There was a cost. Investigations take weeks and do not always produce revenue, so the paper now runs one longer investigation a month, funded by readers who pay an extra five pounds a year.' },
          { speaker: 'Reporter', line: 'What has been the effect on the town? A local paper matters most in its absence. After the closure was announced, the number of people attending council meetings fell sharply, and one councillor admitted that decisions were being taken with almost nobody watching. Attendance is now higher than before the crisis.' },
          { speaker: 'Reporter', line: 'The lesson is narrow but important. Local newspapers cannot compete on national news, and they should not try. Their value is in the boring, useful material that no website in another city will ever collect.' },
        ],
        questions: [
          { id: 'L3-1', type: 'choice', prompt: 'What did the study of millions of messages find?', options: ['Robots spread most false stories', 'False stories spread faster than accurate ones', 'False stories stay in small groups', 'Accurate stories travel furthest'], answer: 'False stories spread faster than accurate ones', explain: 'Tin sai được chia sẻ nhiều hơn và lan nhanh hơn tin đúng.' },
          { id: 'L3-2', type: 'choice', prompt: 'Who shared false stories more often?', options: ['Automated accounts', 'Humans', 'Professional journalists', 'Advertisers'], answer: 'Humans', explain: '“The difference was not caused by robots; humans were more likely to share the false items.”' },
          { id: 'L3-3', type: 'choice', prompt: 'Why does false content spread so quickly?', options: ['It is shorter', 'It is surprising and emotional', 'It is easier to read', 'It is posted more often'], answer: 'It is surprising and emotional', explain: 'Nội dung gây bất ngờ và cảm xúc, đặc biệt là giận dữ, lan nhanh nhất.' },
          { id: 'L3-4', type: 'choice', prompt: 'What does the lecturer say about technology?', options: ['It is the only cause of the problem', 'The decision to share is ours', 'Feeds do not matter at all', 'Platforms should be closed'], answer: 'The decision to share is ours', explain: 'Đây không chỉ là vấn đề công nghệ; quyết định chia sẻ là của chúng ta.' },
          { id: 'L3-5', type: 'choice', prompt: 'What usually happens to people who shared a claim and then see a correction?', options: ['They always apologise', 'They often become more confident', 'They leave the platform', 'They share the correction widely'], answer: 'They often become more confident', explain: 'Người đã chia sẻ tin sai thường càng chắc chắn hơn sau khi có đính chính.' },
          { id: 'L3-6', type: 'fill', prompt: 'Teaching students to wait ___ seconds before sharing works better than a vague instruction. (write the number)', answers: ['30', 'thirty'], explain: '“wait thirty seconds” là chỉ dẫn rõ ràng, dễ làm theo.' },
          { id: 'L3-7', type: 'choice', prompt: 'What is “lateral reading”?', options: ['Reading a page twice', 'Checking what other sources say about the organisation', 'Reading only professional-looking sites', 'Reading a text from left to right'], answer: 'Checking what other sources say about the organisation', explain: 'Mở tab mới để xem nguồn khác nói gì về tổ chức đó.' },
          { id: 'L3-8', type: 'choice', prompt: 'What is “prebunking”?', options: ['Deleting a false post', 'Showing a weak example of a technique before a strong one', 'Blocking unknown accounts', 'Reporting content to platforms'], answer: 'Showing a weak example of a technique before a strong one', explain: 'Cho xem ví dụ nhẹ về thủ thuật trước khi gặp ví dụ mạnh.' },
          { id: 'L3-9', type: 'choice', prompt: 'What almost happened to the Bredon Weekly three years ago?', options: ['It almost closed', 'It changed its name', 'It moved to another town', 'It doubled its cover price'], answer: 'It almost closed', explain: 'Số bản phát hành giảm mạnh và tờ báo suýt đóng cửa.' },
          { id: 'L3-10', type: 'choice', prompt: 'How did the two journalists buy the paper?', options: ['With a bank loan', 'For a symbolic one pound', 'By selling shares', 'With council funding'], answer: 'For a symbolic one pound', explain: 'Hai nhà báo mua lại tờ báo với giá tượng trưng một bảng Anh.' },
          { id: 'L3-11', type: 'choice', prompt: 'What did readers most want?', options: ['National news', 'Local information nobody else collected', 'Free advertising', 'Longer editions'], answer: 'Local information nobody else collected', explain: 'Họ muốn tin họp hội đồng, kết quả học tập, giấy phép xây dựng, thể thao địa phương.' },
          { id: 'L3-12', type: 'fill', prompt: 'Paying subscribers have grown to ___ thousand. (write the number)', answers: ['4', 'four'], explain: '“paying subscribers have grown to four thousand”.' },
          { id: 'L3-13', type: 'choice', prompt: 'What cost does the report mention?', options: ['Higher printing bills', 'Investigations take time and do not always make money', 'Fewer subscribers each year', 'Angry councillors'], answer: 'Investigations take time and do not always make money', explain: 'Điều tra mất nhiều tuần và không phải lúc nào cũng sinh lợi.' },
          { id: 'L3-14', type: 'choice', prompt: 'What happened after the closure was announced?', options: ['Fewer people attended council meetings', 'More people joined the council', 'Advertising increased', 'A new paper started'], answer: 'Fewer people attended council meetings', explain: 'Số người dự các cuộc họp hội đồng giảm mạnh.' },
          { id: 'L3-15', type: 'choice', prompt: 'What is the lesson from Bredon?', options: ['Local papers should report national news', 'Their value is boring but useful local material', 'Newspapers need rich owners', 'Printing should be stopped'], answer: 'Their value is boring but useful local material', explain: 'Giá trị nằm ở thông tin địa phương “nhàm chán nhưng hữu ích” mà không trang nào khác thu thập.' },
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
            title: 'Thay đổi lịch phát sóng',
            text: 'Due to live coverage of the city marathon on Sunday morning, the usual discussion programme “Ask the Council” moves to Sunday at 9 p.m. Listeners who cannot wait can hear the recording on our website from Monday morning.',
            questions: [
              { id: 'R1-1q', type: 'choice', prompt: 'Why has the programme been moved?', options: ['The presenter is unwell', 'There is live coverage of a marathon', 'The studio is being repaired', 'Listeners asked for a later time'], answer: 'There is live coverage of a marathon', explain: 'Do tường thuật trực tiếp giải marathon nên chương trình đổi giờ.' },
            ],
          },
          {
            id: 'R1-2',
            title: 'Email nhắc gia hạn',
            text: 'Hello Mrs An, your digital subscription to the Daily Post will renew on 1 July at 9 dollars. If you also want the Saturday print edition, reply YES to this email and we will add it for 5 dollars a month. You can cancel any time up to three days before renewal.',
            questions: [
              { id: 'R1-2q', type: 'choice', prompt: 'How can Mrs An add the print edition?', options: ['By calling the office', 'By replying YES to the email', 'By visiting the website', 'By paying at a newsagent'], answer: 'By replying YES to the email', explain: 'Trả lời YES vào email để thêm bản in thứ Bảy.' },
            ],
          },
          {
            id: 'R1-3',
            title: 'Quảng cáo khoá học',
            text: 'Learn to write news that people finish reading. Six online evening sessions, Tuesdays from 7 to 9 p.m. Each session is recorded. The course fee is 120 dollars, and students pay half price with a valid student card.',
            questions: [
              { id: 'R1-3q', type: 'choice', prompt: 'What is included for students?', options: ['Free equipment', 'Half-price fee', 'A printed textbook', 'Extra sessions'], answer: 'Half-price fee', explain: 'Sinh viên có thẻ được giảm một nửa học phí.' },
            ],
          },
          {
            id: 'R1-4',
            title: 'Thông báo nền tảng',
            text: 'From 15 August, accounts for users under 16 will have private profiles by default, and direct messages from adults they do not follow will be blocked. Users can change these settings, but only with a parent’s confirmation.',
            questions: [
              { id: 'R1-4q', type: 'choice', prompt: 'What is the new default for users under 16?', options: ['No account allowed', 'Private profiles', 'No photographs', 'One hour of use per day'], answer: 'Private profiles', explain: 'Tài khoản dưới 16 tuổi mặc định để chế độ riêng tư.' },
            ],
          },
          {
            id: 'R1-5',
            title: 'Thư gửi toà soạn',
            text: 'Sir, for eight months residents have asked for a safe crossing outside the primary school. Two children were nearly hit last term. The council says the work is planned for next year, but a painted crossing takes one afternoon. Please publish this letter.',
            questions: [
              { id: 'R1-5q', type: 'choice', prompt: 'What is the writer asking for?', options: ['A new school', 'A safe crossing outside the school', 'More traffic police', 'A change in the law'], answer: 'A safe crossing outside the school', explain: 'Cư dân yêu cầu một lối sang đường an toàn trước trường tiểu học.' },
            ],
          },
          {
            id: 'R1-6',
            title: 'Áp phích cộng đồng',
            text: 'Volunteers wanted at the Eastfield community library. Two hours a week is enough. We need help with shelving books and with a new session on Saturday mornings teaching older residents to use video calls. Training and tea provided.',
            questions: [
              { id: 'R1-6q', type: 'choice', prompt: 'What will Saturday volunteers do?', options: ['Shelve books', 'Teach older residents to use video calls', 'Repair computers', 'Run a book sale'], answer: 'Teach older residents to use video calls', explain: 'Buổi sáng thứ Bảy dạy người cao tuổi dùng cuộc gọi video.' },
            ],
          },
          {
            id: 'R1-7',
            title: 'Đánh giá phim tài liệu',
            text: 'The film follows three families for a year without narration, and it is the silence that makes it powerful. Some viewers will find the pace slow. Still, the final twenty minutes explain more about ordinary life than most news reports manage in a month.',
            questions: [
              { id: 'R1-7q', type: 'choice', prompt: 'What does the reviewer praise most?', options: ['The music', 'The narrator’s voice', 'The absence of narration and its effect', 'The short running time'], answer: 'The absence of narration and its effect', explain: 'Chính sự im lặng, không có lời dẫn, tạo nên sức mạnh của phim.' },
            ],
          },
          {
            id: 'R1-8',
            title: 'Quy định quay phim',
            text: 'Filming in the market hall is allowed for personal use only. Journalists and students must apply for a permit at the market office at least two working days in advance and must not film traders’ faces without permission.',
            questions: [
              { id: 'R1-8q', type: 'choice', prompt: 'What must journalists do before filming?', options: ['Pay a daily fee', 'Apply for a permit two working days in advance', 'Film only in the morning', 'Ask the police'], answer: 'Apply for a permit two working days in advance', explain: 'Phải xin giấy phép ở văn phòng chợ trước ít nhất hai ngày làm việc.' },
            ],
          },
          {
            id: 'R1-9',
            title: 'Bài đăng trên diễn đàn',
            text: 'I deleted my news app last month after realising that I read headlines all day and remembered none of them. Now I read one newspaper in the evening and listen to one podcast a week. I am better informed, and much calmer.',
            questions: [
              { id: 'R1-9q', type: 'choice', prompt: 'Why did the writer delete the news app?', options: ['It cost too much', 'He read many headlines but remembered none', 'It used too much battery', 'A friend recommended it'], answer: 'He read many headlines but remembered none', explain: 'Anh đọc tiêu đề cả ngày nhưng không nhớ được gì.' },
            ],
          },
          {
            id: 'R1-10',
            title: 'Kết quả khảo sát',
            text: 'Survey of 400 residents: 62 per cent get local news from social media groups, 21 per cent from the local newspaper, 11 per cent from the radio and 6 per cent from friends. However, 74 per cent said they trusted the local newspaper most.',
            questions: [
              { id: 'R1-10q', type: 'choice', prompt: 'What does the survey show?', options: ['Most residents use the local newspaper first', 'People use social media most but trust the newspaper most', 'Radio is the most trusted source', 'Nobody reads local news'], answer: 'People use social media most but trust the newspaper most', explain: 'Đa số lấy tin từ mạng xã hội nhưng đa số tin tờ báo địa phương nhất.' },
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
            title: 'The feed that chooses for you',
            text: `Every time you open a social platform, a machine decides what you will see first. The decision is made in a fraction of a second, and it is based on your previous behaviour: what you stopped to read, what you watched twice, what you skipped. The result feels personal, and in a narrow sense it is.

The usual criticism of these systems is that they trap users in a “filter bubble”, showing only opinions they already hold. The evidence is less dramatic than the phrase suggests. Studies that measure what people actually see find that most users encounter a wider range of views online than their friends or neighbours would provide in a week. Newspapers, after all, have always had a political position.

A more serious problem is not the range of opinions but the type of content. Feeds reward attention, and attention is cheapest to obtain with emotion: outrage, fear and amusement. A short study of engagement on one platform found that posts expressing moral indignation travelled fastest. This does not mean that users are being lied to. It means the system has learned that certain feelings keep people scrolling, and it will supply more of whatever produces those feelings.

There is a second, quieter effect: the disappearance of the ordinary. A feed is a selection of highlights, and a steady diet of highlights changes what people consider normal. Teenagers who follow hundreds of carefully edited lives may conclude that their own life is unusually dull, even though the comparison is not between like and like. Researchers call this a social comparison effect, and it appears in nearly every study of heavy platform use among young people.

Do platforms have any incentive to change? Some do, partly because criticism from governments and advertisers has become expensive. Several companies now allow users to switch from an engagement-based feed to a chronological one, and some publish reports on content moderation. These changes matter, but they transfer responsibility to the user, who must find the setting and choose it.

That is why media education is more useful than either panic or denial. A student who understands that the first item in a feed is placed there to create a feeling is in a better position than one who simply avoids the app. The skill is not loyalty to a particular platform or a particular newspaper. It is the habit of asking who arranged this page, and what they want me to do next.`,
            glossary: [
              { word: 'filter bubble', meaning: 'bong bóng lọc thông tin' },
              { word: 'engagement', meaning: 'mức độ tương tác' },
              { word: 'outrage', meaning: 'sự phẫn nộ' },
              { word: 'indignation', meaning: 'sự căm phẫn, bất bình' },
              { word: 'chronological', meaning: 'theo thứ tự thời gian' },
              { word: 'moderation', meaning: 'việc kiểm duyệt nội dung' },
            ],
            questions: [
              { id: 'R2-1q1', type: 'choice', prompt: 'What decides what you see first on a platform?', options: ['The time of day', 'A machine using your previous behaviour', 'A team of editors', 'Your friends’ messages'], answer: 'A machine using your previous behaviour', explain: 'Thuật toán quyết định dựa trên hành vi trước đó của bạn.' },
              { id: 'R2-1q2', type: 'choice', prompt: 'What does the writer say about the “filter bubble” criticism?', options: ['It is completely proved', 'The evidence is less dramatic than the phrase suggests', 'It applies only to newspapers', 'It has been abandoned by researchers'], answer: 'The evidence is less dramatic than the phrase suggests', explain: 'Bằng chứng thực tế không “kịch tính” như cách gọi đó.' },
              { id: 'R2-1q3', type: 'choice', prompt: 'What does the writer compare platforms with?', options: ['Schools', 'Newspapers, which have always had a political position', 'Libraries', 'Radio stations'], answer: 'Newspapers, which have always had a political position', explain: 'Báo chí vốn cũng luôn có lập trường chính trị.' },
              { id: 'R2-1q4', type: 'choice', prompt: 'What kind of content gains the most attention?', options: ['Careful analysis', 'Emotional content such as outrage and fear', 'Long articles', 'Content in several languages'], answer: 'Emotional content such as outrage and fear', explain: 'Nội dung cảm xúc — phẫn nộ, sợ hãi, hài hước — thu hút chú ý rẻ nhất.' },
              { id: 'R2-1q5', type: 'choice', prompt: 'What did one study of engagement show?', options: ['Posts with moral indignation travelled fastest', 'Posts about sport were most popular', 'Long posts were shared more', 'Users preferred neutral posts'], answer: 'Posts with moral indignation travelled fastest', explain: 'Bài viết thể hiện sự phẫn nộ lan nhanh nhất.' },
              { id: 'R2-1q6', type: 'choice', prompt: 'What is the “quieter effect” the writer mentions?', options: ['Higher advertising costs', 'The disappearance of the ordinary', 'Longer loading times', 'Fewer users each year'], answer: 'The disappearance of the ordinary', explain: 'Feed toàn điểm nhấn khiến người ta coi thường những gì bình thường.' },
              { id: 'R2-1q7', type: 'choice', prompt: 'What may teenagers conclude from following edited lives?', options: ['That their own life is unusually dull', 'That editing is difficult', 'That their friends are dishonest', 'That platforms are expensive'], answer: 'That their own life is unusually dull', explain: 'So sánh với “điểm nhấn” đã qua chỉnh sửa khiến họ thấy cuộc sống mình nhạt nhẽo.' },
              { id: 'R2-1q8', type: 'choice', prompt: 'Why have some platforms changed their settings?', options: ['Criticism from governments and advertisers became expensive', 'Users paid for new features', 'Advertising stopped working', 'New laws banned feeds'], answer: 'Criticism from governments and advertisers became expensive', explain: 'Chỉ trích từ chính phủ và nhà quảng cáo trở nên tốn kém.' },
              { id: 'R2-1q9', type: 'choice', prompt: 'What is the problem with the new options, according to the writer?', options: ['They cost money', 'They transfer responsibility to the user', 'They are hard to build', 'They only work for adults'], answer: 'They transfer responsibility to the user', explain: 'Thay đổi đó đẩy trách nhiệm sang người dùng, người phải tự tìm và chọn cài đặt.' },
              { id: 'R2-1q10', type: 'fill', prompt: 'The writer says media education is more useful than panic or ___. (one word)', answers: ['denial'], explain: '“more useful than either panic or denial”.' },
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
            title: 'Slow news and the economics of attention',
            text: `News has never been free, but for about twenty years it felt free to the reader. Advertising paid for the reporter, the reader paid nothing, and the arrangement seemed permanent. When advertising moved to search engines and social platforms, the money that had supported local reporting went with it, and the consequences are now visible in towns where no journalist attends a council meeting.

The usual response has been to chase attention more aggressively: more headlines, more updates, shorter items. This is a rational response to a business model based on page views, but it creates two problems. The first is that speed competes badly with platforms that do not need to verify anything before publishing. The second is that readers who are given only fragments learn less, and readers who learn less are less willing to pay.

A different strategy has emerged in several countries, and it is usually called slow news. Its rules are deliberately unfashionable. Publish less often, explain more, and cut stories that add nothing. The Correspondent, a Dutch platform, began with a promise not to report on the daily news cycle at all, and asked readers to fund it in advance. It reached its target in eight days, largely because the promise was unusual enough to be interesting.

Does slow news make money? Sometimes. Subscription income is more stable than advertising, because readers renew unless something goes wrong, and it does not depend on the mood of an advertiser. But subscriptions require something advertising does not: a reason to believe that the reporting is better than what is available for free. That reason must be demonstrated in every article, week after week.

There is also a risk of a different kind. Paying readers are, on average, older and wealthier than the population, and journalism that serves only them may miss stories that matter to people who never subscribe. Several newsrooms have tried to answer this by leaving some coverage free, especially local news, while charging for analysis and for specialist reporting.

The wider lesson is about time. Investigation is expensive precisely because it is slow: a story that requires three months of documents cannot be produced by a team that publishes ten items a day. The question newspapers must answer is not whether readers want quality, since most say they do. It is whether enough of them will pay for it before the reporting disappears.`,
            glossary: [
              { word: 'circulation', meaning: 'số lượng phát hành' },
              { word: 'in advance', meaning: 'trước, trả trước' },
              { word: 'newsroom', meaning: 'toà soạn' },
              { word: 'coverage', meaning: 'việc đưa tin' },
              { word: 'investigation', meaning: 'cuộc điều tra' },
              { word: 'unfashionable', meaning: 'không theo mốt, lỗi thời' },
            ],
            questions: [
              { id: 'R3-1q1', type: 'choice', prompt: 'What happened when advertising moved to platforms?', options: ['News became more accurate', 'The money supporting local reporting went with it', 'Newspapers started printing more', 'Readers paid more immediately'], answer: 'The money supporting local reporting went with it', explain: 'Nguồn tiền nuôi báo chí địa phương biến mất theo quảng cáo.' },
              { id: 'R3-1q2', type: 'choice', prompt: 'What has been the usual response of news organisations?', options: ['Chasing attention more aggressively', 'Reducing advertising', 'Hiring more journalists', 'Publishing less often'], answer: 'Chasing attention more aggressively', explain: 'Phản ứng thường thấy là đuổi theo sự chú ý quyết liệt hơn.' },
              { id: 'R3-1q3', type: 'choice', prompt: 'Why does speed compete badly with platforms?', options: ['Platforms are faster to read', 'Platforms do not need to verify anything before publishing', 'Platforms employ more reporters', 'Platforms pay for licences'], answer: 'Platforms do not need to verify anything before publishing', explain: 'Nền tảng không cần kiểm chứng trước khi đăng nên luôn nhanh hơn.' },
              { id: 'R3-1q4', type: 'choice', prompt: 'What is the second problem created by chasing attention?', options: ['Readers who learn less are less willing to pay', 'Printing becomes too costly', 'Reporters leave the country', 'Advertisers ask for discounts'], answer: 'Readers who learn less are less willing to pay', explain: 'Độc giả chỉ nhận mảnh vụn thì học được ít hơn và ít sẵn lòng trả tiền.' },
              { id: 'R3-1q5', type: 'choice', prompt: 'What are the rules of “slow news”?', options: ['Publish less often and explain more', 'Publish every hour', 'Avoid all local stories', 'Charge advertisers more'], answer: 'Publish less often and explain more', explain: 'Đăng ít hơn, giải thích nhiều hơn, bỏ những tin vô nghĩa.' },
              { id: 'R3-1q6', type: 'choice', prompt: 'How did The Correspondent reach its funding target?', options: ['With government money', 'By asking readers to fund it in advance', 'By selling advertising', 'By borrowing from a bank'], answer: 'By asking readers to fund it in advance', explain: 'Kêu gọi độc giả tài trợ trước và đạt mục tiêu trong tám ngày.' },
              { id: 'R3-1q7', type: 'choice', prompt: 'Why is subscription income more stable than advertising?', options: ['It is always larger', 'Readers renew unless something goes wrong', 'It avoids taxes', 'It needs no content'], answer: 'Readers renew unless something goes wrong', explain: 'Thu nhập thuê bao không phụ thuộc tâm trạng của nhà quảng cáo và tự động gia hạn.' },
              { id: 'R3-1q8', type: 'choice', prompt: 'What risk does the writer mention about paying readers?', options: ['They are usually older and wealthier than the population', 'They cancel too often', 'They demand shorter articles', 'They live abroad'], answer: 'They are usually older and wealthier than the population', explain: 'Độc giả trả tiền thường lớn tuổi và giàu hơn mặt bằng dân cư.' },
              { id: 'R3-1q9', type: 'fill', prompt: 'Some newsrooms leave local coverage ___ while charging for analysis. (one word)', answers: ['free'], explain: '“leaving some coverage free, especially local news”.' },
              { id: 'R3-1q10', type: 'choice', prompt: 'What is the main question newspapers must answer?', options: ['Whether readers want quality', 'Whether enough readers will pay for quality in time', 'Whether printing is still possible', 'Whether journalists should be older'], answer: 'Whether enough readers will pay for quality in time', explain: 'Câu cuối: liệu có đủ người trả tiền trước khi hoạt động đưa tin biến mất.' },
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
            title: 'How to write a report that people finish',
            text: `A news report is judged in the first eight seconds, (1)___ is why the first sentence matters more than the last.

Begin with the fact that is new, not with the background. Readers who are told the most important information first will (2)___, even if they stop reading after two paragraphs. Background belongs lower down, (3)___ the reader who wants it can find it.

Keep sentences short and (4)___ one idea to each. A sentence that contains three ideas is usually a sentence that will be read twice, or not at (5)___.

Attribution should be clear. Write “the council said” rather than “it is believed”, because an unattributed claim (6)___ the reader wonder who is responsible for it.

Numbers need a comparison. “The budget rose by two million” means little (7)___ the reader knows what the budget was before. Ten per cent of a small number is still small.

Finally, check the names and the figures (8)___ you publish, not afterwards. A correction costs more trust (9)___ the delay would have cost time, and trust is the only asset that (10)___ to be earned slowly.`,
            questions: [
              { id: 'R4-1q1', type: 'choice', prompt: 'Chỗ (1)', options: ['which', 'who', 'whose', 'what'], answer: 'which', explain: 'Mệnh đề quan hệ bổ nghĩa cho cả mệnh đề “A news report is judged in the first eight seconds”.' },
              { id: 'R4-1q2', type: 'choice', prompt: 'Chỗ (2)', options: ['continue', 'continues', 'continuing', 'continued'], answer: 'continue', explain: 'Sau “will” dùng động từ nguyên thể “continue”.' },
              { id: 'R4-1q3', type: 'choice', prompt: 'Chỗ (3)', options: ['where', 'which', 'that', 'what'], answer: 'where', explain: 'Trạng từ quan hệ chỉ nơi chốn: “lower down, where the reader can find it”.' },
              { id: 'R4-1q4', type: 'choice', prompt: 'Chỗ (4)', options: ['give', 'giving', 'given', 'to giving'], answer: 'give', explain: 'Hai động từ mệnh lệnh song song: “Keep sentences short and give one idea…”.' },
              { id: 'R4-1q5', type: 'choice', prompt: 'Chỗ (5)', options: ['all', 'every', 'once', 'least'], answer: 'all', explain: 'Thành ngữ “not at all” — hoàn toàn không.' },
              { id: 'R4-1q6', type: 'choice', prompt: 'Chỗ (6)', options: ['makes', 'make', 'making', 'is made'], answer: 'makes', explain: 'Chủ ngữ “an unattributed claim” số ít → makes.' },
              { id: 'R4-1q7', type: 'choice', prompt: 'Chỗ (7)', options: ['unless', 'if', 'although', 'so'], answer: 'unless', explain: '“means little unless the reader knows what the budget was before”.' },
              { id: 'R4-1q8', type: 'choice', prompt: 'Chỗ (8)', options: ['before', 'after', 'while', 'since'], answer: 'before', explain: 'Kiểm tra tên và số liệu trước khi đăng, không phải sau.' },
              { id: 'R4-1q9', type: 'choice', prompt: 'Chỗ (9)', options: ['than', 'then', 'as', 'of'], answer: 'than', explain: 'So sánh hơn: “costs more trust than the delay would have cost time”.' },
              { id: 'R4-1q10', type: 'choice', prompt: 'Chỗ (10)', options: ['have', 'has', 'having', 'is having'], answer: 'has', explain: '“the only asset” số ít → has to be earned.' },
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
        title: 'Task 1 · Email mời nhà báo đến Ngày truyền thông',
        prompt: 'Your school media club is organising a Media Day for students next month. Write an email (about 120 words) to the editor of a local newspaper, Mr Rees, inviting a journalist to speak. In your email: introduce yourself and the event, suggest a date and a topic, explain what students would gain from the talk, and ask what equipment or payment the speaker would need.',
        minWords: 120,
        checklist: [
          { label: 'Có dòng tiêu đề (Subject) rõ ràng', hint: 'Subject: Guest speaker for Media Day, 12 June' },
          { label: 'Giới thiệu bản thân và sự kiện', hint: 'I am the secretary of the media club at Ly Thuong Kiet School.' },
          { label: 'Đề xuất ngày và chủ đề cụ thể', hint: 'On 12 June at 2 p.m., on the topic of checking facts before publishing.' },
          { label: 'Nói rõ học sinh được gì', hint: 'Students would learn… / It would help us with…' },
          { label: 'Hỏi về thiết bị/chi phí (thể hiện sự chuẩn bị)', hint: 'Would you need a projector or a microphone? / Is there a fee?' },
          { label: 'Giọng điệu lịch sự, trang trọng (Dear Mr Rees / Yours sincerely)', hint: 'I would be grateful if you could…' },
        ],
        tips: [
          'Email mời B2 cần đủ 4 ý: giới thiệu, đề xuất, lợi ích, câu hỏi — thiếu ý nào cũng mất điểm nội dung.',
          'Dùng “I would like to invite…”, “Would it be possible for you to…?” để giữ giọng lịch sự, trang trọng.',
          'Đề xuất ngày cụ thể (kèm giờ) và luôn để mở một phương án khác: “or another day that suits you”.',
        ],
        model: `Subject: Guest speaker for Media Day, 12 June

Dear Mr Rees,

I am the secretary of the media club at Ly Thuong Kiet School. We are organising a Media Day for about 150 students next month, and I would like to invite a journalist from your newspaper to give a short talk.

We would be delighted if someone could join us on Thursday 12 June from 2 p.m. to 3.30 p.m. The most useful topic for our students would be how your team checks facts and photographs before publishing, since we are starting a school news website and we want to avoid the mistakes we often see online.

Students would learn how professional journalists work and would be able to ask questions about careers in journalism. We could also publish a report about the talk on our website.

Would the speaker need a projector or a microphone? Please also let me know whether there is a fee, as our budget is small but not empty.

I would be grateful for a reply before 30 May.

Yours sincerely,
Bao Nguyen`,
      },
      {
        id: 'W2',
        task: 2,
        title: 'Task 2 · Luận: mạng xã hội làm ta gần nhau hay cô đơn hơn?',
        prompt: 'Some people say that social media brings people closer together. Others believe it makes young people lonelier. Discuss both views and give your own opinion. Write an essay (about 250 words). Use reasons and examples to support your answer.',
        minWords: 250,
        checklist: [
          { label: 'Mở bài giới thiệu chủ đề và nêu hướng làm bài', hint: 'Almost every young person uses social media daily, yet its effects are debated…' },
          { label: 'Có đoạn trình bày mặt tích cực (kết nối)', hint: 'On the one hand, …' },
          { label: 'Có đoạn trình bày mặt tiêu cực (cô đơn, so sánh)', hint: 'On the other hand, …' },
          { label: 'Nêu ý kiến cá nhân rõ ràng', hint: 'In my opinion, …' },
          { label: 'Có ít nhất 2 ví dụ cụ thể', hint: 'For example, my cousin…' },
          { label: 'Dùng từ nối giữa các đoạn', hint: 'however, moreover, therefore, in conclusion' },
          { label: 'Kết luận tóm tắt quan điểm, không nêu ý mới', hint: 'In conclusion, …' },
          { label: 'Đủ số từ (~250)', hint: 'Kiểm tra số từ ở khung soạn thảo' },
        ],
        tips: [
          'Chủ đề xã hội dễ viết chung chung: hãy gắn mỗi đoạn với một ví dụ hoặc một nghiên cứu cụ thể.',
          'Tránh tuyệt đối hoá (always, never, all teenagers). Dùng “often”, “tends to”, “in many cases”.',
          'Phân biệt “connection” (số lượng liên hệ) và “closeness” (mức độ thân thiết) — đây là điểm ăn điểm của bài.',
        ],
        model: `Almost every young person now uses social media every day, and adults disagree sharply about what this does to friendships. Some argue that the platforms keep people connected; others claim that they make the young lonelier than any previous generation. In my view, both effects are real, and the difference lies in how the tools are used.

On the one hand, social media removes distance. A student who moves to another city can keep the same group of friends in a message thread, and a shy teenager can find people who share an unusual interest, which may be impossible in a small town. When my cousin moved abroad for university, she said the video calls with her old classmates were what helped her survive the first month. Cheap, instant contact is a genuine benefit.

On the other hand, contact is not the same as closeness. A feed shows edited highlights, and constant comparison with other people’s holidays and results can make ordinary life feel inadequate. Moreover, time spent scrolling is time not spent in the same room as a friend, and several studies find that heavy passive use is linked to lower wellbeing, especially at night when it replaces sleep.

In my opinion, the platform is less important than the habit. Messaging a friend to arrange a meeting reduces loneliness; watching strangers for two hours increases it. Therefore the useful question is not whether social media is good or bad, but whether we use it to make plans or to avoid them.

In conclusion, social media can connect people when it leads to real contact, and it can isolate them when it replaces it. Using it deliberately, and leaving the phone outside the bedroom, makes its benefits far easier to keep.`,
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
        instruction: 'Bạn sẽ nghe 3 câu hỏi về truyền thông và đời sống xã hội. Trả lời mỗi câu 1–2 phút, nói tự nhiên như đang trò chuyện.',
        minutes: 3,
        questions: [
          { q: 'How do you usually get your news?', sample: 'I use two sources. During the day I check one news app for headlines, but I only read two or three of them properly. In the evening I listen to a podcast while I am cooking, because it gives background that a headline cannot. I stopped relying on social media groups for news after I shared a story that turned out to be four years old.' },
          { q: 'Do you think you spend too much time on your phone? Why?', sample: 'Probably yes, though not as much as last year. I noticed that I picked up my phone about sixty times a day, mostly for no reason, so I turned off notifications for everything except messages from my family. The total went down a lot. What still costs me time is short videos in the evening, when I am tired and my judgement is weakest.' },
          { q: 'Tell me about a time you found out that something you read online was false.', sample: 'Last year a photograph appeared in my class group showing a flood in the city centre. It looked convincing, but when I searched for the same image I found it had been published in another country six years earlier. What surprised me was how quickly everyone had accepted it, including me, because the weather that week made it believable.' },
        ],
      },
      {
        id: 'S2',
        kind: 'solution',
        title: 'Part 2 · Thảo luận giải pháp',
        instruction: 'Bạn và một người bạn đang bàn cách xử lý tình trạng nhóm chat của lớp trở nên căng thẳng, với nhiều tranh cãi và tin nhắn thô lỗ vào ban đêm. Hãy thảo luận ưu điểm, nhược điểm của 3 lựa chọn rồi chọn một phương án và giải thích.',
        minutes: 4,
        situation: 'The class group chat has become stressful. There are arguments about homework, rude messages late at night, and several students have left the group. Three options are suggested.',
        options: [
          'Keep the group but agree written rules with two student admins',
          'Split into a small homework group and talk about everything else in person',
          'Close the group and use only the school email system for announcements',
        ],
        sample: `Let us look at the three options. Written rules with student admins are the least disruptive, because everybody stays in the same place. If the rules are simple — no messages after ten, no personal comments, homework questions in one thread — and two classmates enforce them fairly, the atmosphere usually improves within a week. The weakness is that rules depend on the admins being brave enough to remind their friends, which is hard at seventeen.

Splitting the group is attractive for a different reason. It separates two things that do not belong together: practical information about homework, which needs a quiet, reliable channel, and social conversation, which is better face to face anyway. The risk is that the “small” homework group slowly becomes another social group, and that students who are not invited feel excluded.

Closing the group entirely solves the rudeness, but it creates a bigger problem. Announcements sent by the school email system are often missed, and students who never check their email would lose information about deadlines.

If I have to choose, I would combine the first two ideas. I would keep one group with written rules and two admins for announcements, and move the arguments and jokes into a separate group that anyone can leave without losing homework information. That way the practical channel stays useful, the pressure to be available at midnight disappears, and nobody has to be removed. I would review the rules after two weeks, because a rule that everybody hates will simply be ignored.`,
      },
      {
        id: 'S3',
        kind: 'topic',
        title: 'Part 3 · Phát triển chủ đề',
        instruction: 'Trình bày quan điểm của bạn về chủ đề dưới đây (khoảng 3 phút), dựa vào 3 gợi ý. Sau đó trả lời 2 câu hỏi mở rộng.',
        minutes: 5,
        topic: 'Social media has changed the way young people make friends.',
        outline: [
          'Cách người trẻ kết bạn ngày nay khác trước thế nào',
          'Lợi ích và hạn chế của cách kết bạn đó',
          'Lời khuyên để dùng mạng xã hội lành mạnh',
        ],
        questions: [
          { q: 'Are online friendships as valuable as face-to-face friendships?', sample: 'They can be valuable, but they are not the same, in my opinion. An online friend can be easier to talk to about something embarrassing, because you do not have to see their reaction immediately, and for people who live far from a city that matters a lot. However, a friendship that never leaves the screen loses the small things — noticing that someone is quiet, helping them carry something, sitting together without talking. I would say online friendship is a good beginning and a poor substitute.' },
          { q: 'What advice would you give to a young person who feels left out because of what they see online?', sample: 'I would suggest three things. First, remember how the content is made: people post their best ten minutes, not their ordinary Tuesday, so the comparison is never fair. Second, change what you follow for two weeks and notice whether your mood changes, because the feed is a choice even when it does not feel like one. Third, spend that time on one real activity with one real person, like sport or a club. It is much easier to ignore an edited photo when you have something of your own happening.' },
        ],
      },
    ],
  },
};
