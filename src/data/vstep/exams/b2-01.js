/**
 * Đề VSTEP B2 số 1 — chủ đề giáo dục & công nghệ (nội dung gốc, viết theo đúng format đề thi).
 * Xem `docs/vstep-schema.md` để biết ý nghĩa từng field.
 */
export default {
  id: 'b2-01',
  level: 'B2',
  title: 'Đề B2 số 1 · Giáo dục & công nghệ',
  tags: ['giáo dục', 'công nghệ', 'B2'],

  listening: {
    minutes: 40,
    parts: [
      {
        id: 'L1',
        title: 'Part 1 · Thông báo ngắn',
        instruction: 'Bạn sẽ nghe 8 thông báo ngắn. Mỗi thông báo có một câu hỏi. Chọn đáp án đúng nhất.',
        transcript: [
          { speaker: 'Narrator', line: 'Announcement one. This is a message for all students using the online examination system. The portal will be unavailable on Saturday between eight in the evening and midnight while technicians install a security update. Any draft answers saved locally after seven thirty may not be transferred, so please upload your work before seven. Normal service resumes on Sunday morning.' },
          { speaker: 'Narrator', line: 'Announcement two. Professor Dalton’s lecture on machine learning, normally held in Room 214, has been moved to the Main Hall, because the number of students registered has more than doubled since last term. The time is unchanged, and a recording will be posted within twenty-four hours.' },
          { speaker: 'Narrator', line: 'Announcement three. From this term, students may borrow up to five electronic titles at the same time, an increase from three. Please note that e-books are returned automatically after fourteen days, and any title that is still open will block further downloads until the loan period ends.' },
          { speaker: 'Narrator', line: 'Announcement four. Anyone attending Thursday’s careers workshop should bring a printed copy of their curriculum vitae, because the visiting recruiters prefer to write comments by hand during the interviews. Printing is free in the student centre until Wednesday afternoon.' },
          { speaker: 'Narrator', line: 'Announcement five. The deadline for the digital literacy survey has been extended to the twentieth of this month. Students who complete the questionnaire will receive a voucher for the campus bookshop, and the results will shape next year’s training programme.' },
          { speaker: 'Narrator', line: 'Announcement six. The writing centre is now offering thirty-minute online tutorials on how to interpret a similarity report. Attendance is voluntary, but any student who has received a report this term is strongly advised to book a session before the end of the month.' },
          { speaker: 'Narrator', line: 'Announcement seven. A free laptop clinic will be held in the engineering building on Wednesday afternoon. Technicians can replace batteries, clean keyboards and install antivirus software at no cost, but they are unable to recover data from a hard drive that has already failed.' },
          { speaker: 'Narrator', line: 'Announcement eight. Please note that the campus wireless network now requires you to sign in with your student number rather than your email address. Visitors may still request a one-day access code from the reception desk in the main building.' },
        ],
        questions: [
          { id: 'L1-1', type: 'choice', prompt: 'What should students do before seven o’clock?', options: ['Upload their work', 'Register for the update', 'Email the technicians', 'Delete their saved drafts'], answer: 'Upload their work', explain: 'Bản nháp lưu sau 7h30 có thể không được chuyển, nên phải upload trước 7 giờ.' },
          { id: 'L1-2', type: 'choice', prompt: 'Why has the lecture been moved?', options: ['The room is being repaired', 'Far more students have registered', 'The equipment is broken', 'The professor is away'], answer: 'Far more students have registered', explain: 'Số sinh viên đăng ký tăng hơn gấp đôi.' },
          { id: 'L1-3', type: 'choice', prompt: 'What is the main change to e-book borrowing?', options: ['Students can borrow more titles at once', 'Loans now cost money', 'Books must be returned in person', 'Only final-year students may borrow'], answer: 'Students can borrow more titles at once', explain: 'Tăng từ 3 lên 5 tựa sách điện tử cùng lúc.' },
          { id: 'L1-4', type: 'choice', prompt: 'What must participants bring to the workshop?', options: ['A printed CV', 'A laptop', 'A student card', 'A list of questions'], answer: 'A printed CV', explain: 'Nhà tuyển dụng muốn ghi chú bằng tay nên cần bản CV in.' },
          { id: 'L1-5', type: 'choice', prompt: 'What will participants receive?', options: ['A bookshop voucher', 'Course credit', 'A free book', 'A certificate'], answer: 'A bookshop voucher', explain: 'Hoàn thành khảo sát sẽ nhận voucher nhà sách.' },
          { id: 'L1-6', type: 'choice', prompt: 'Who is strongly advised to book a tutorial?', options: ['Students who received a similarity report', 'All first-year students', 'Students who failed an exam', 'Anyone using the writing centre'], answer: 'Students who received a similarity report', explain: 'Ai đã nhận báo cáo trùng lặp nên đặt lịch tư vấn.' },
          { id: 'L1-7', type: 'choice', prompt: 'What are the technicians unable to do?', options: ['Recover data from a failed drive', 'Replace a battery', 'Clean a keyboard', 'Install antivirus software'], answer: 'Recover data from a failed drive', explain: 'Họ không thể cứu dữ liệu từ ổ cứng đã hỏng.' },
          { id: 'L1-8', type: 'choice', prompt: 'How should students now sign in to the wireless network?', options: ['With their student number', 'With their email address', 'With a one-day code', 'With a fingerprint'], answer: 'With their student number', explain: 'Đăng nhập bằng mã số sinh viên thay vì email.' },
        ],
      },
      {
        id: 'L2',
        title: 'Part 2 · Hội thoại',
        instruction: 'Bạn sẽ nghe 2 đoạn hội thoại. Mỗi đoạn có 6 câu hỏi.',
        transcript: [
          { speaker: 'Dr Byrom', line: 'Linh, how is the project on mobile vocabulary applications progressing?' },
          { speaker: 'Linh', line: 'Slowly, I am afraid. The company agreed to share data, but what they sent me was usage figures rather than test scores.' },
          { speaker: 'Dr Byrom', line: 'That is very typical. Usage tells you how often somebody opened the application; it tells you nothing about whether any learning took place.' },
          { speaker: 'Linh', line: 'So I was considering running my own experiment with first-year students instead.' },
          { speaker: 'Dr Byrom', line: 'A sensible plan. How many participants could you realistically recruit?' },
          { speaker: 'Linh', line: 'I asked two classes. About sixty students said they were interested, but I would rather finish with forty who complete the whole eight weeks.' },
          { speaker: 'Dr Byrom', line: 'Wise. Attrition is the greatest threat to a study of this kind. What will you measure?' },
          { speaker: 'Linh', line: 'A fifty-item vocabulary test before and after, plus a short interview with ten volunteers.' },
          { speaker: 'Dr Byrom', line: 'Good. One caution: do not allow the experimental group and the control group to study at different times of day, otherwise you will not know what caused any difference you find.' },
          { speaker: 'Linh', line: 'I had not thought of that. Would it be better to randomise within each class?' },
          { speaker: 'Dr Byrom', line: 'Yes, that solves the problem neatly. And Linh, write your ethics application this week rather than next month. The committee meets only twice a term.' },
          { speaker: 'Linh', line: 'I will do it tonight. Could you look at my draft questionnaire before Friday?' },
          { speaker: 'Dr Byrom', line: 'Send it to me by Wednesday and I will comment on it. Keep the items short, though — long questions confuse respondents.' },
          { speaker: 'Linh', line: 'Thank you. I will also pilot it with five friends first.' },
          { speaker: 'Narrator', line: 'Now listen to a conversation between two postgraduate students.' },
          { speaker: 'Mai', line: 'Tuan, did you watch the recording of yesterday’s seminar?' },
          { speaker: 'Tuan', line: 'Only the first twenty minutes. The sound was terrible — the microphone picked up every chair that moved.' },
          { speaker: 'Mai', line: 'I had the same problem. I emailed the department and they said new microphones are arriving next month.' },
          { speaker: 'Tuan', line: 'Until then, do you think we should keep attending in person?' },
          { speaker: 'Mai', line: 'Definitely. I take far better notes when I can see the speaker, and I ask questions at the end.' },
          { speaker: 'Tuan', line: 'True. But the recordings are useful for revision. I watched one at half speed before the last test.' },
          { speaker: 'Mai', line: 'There is another issue. Some students now skip the seminar entirely, because they know it will be posted.' },
          { speaker: 'Tuan', line: 'That is exactly why the department is considering posting recordings two weeks later, once the discussion has finished.' },
          { speaker: 'Mai', line: 'Hmm. I would prefer them to keep the recordings in the library system rather than on the open website.' },
          { speaker: 'Tuan', line: 'Why?' },
          { speaker: 'Mai', line: 'Because the seminars include personal examples taken from patients. Those should not be publicly available.' },
          { speaker: 'Tuan', line: 'I had not considered that. So what should we say in the student survey?' },
          { speaker: 'Mai', line: 'That access should be limited to enrolled students, and that the recordings should be deleted at the end of the term.' },
          { speaker: 'Tuan', line: 'Agreed. I will write the first draft tonight and you can edit it tomorrow morning.' },
        ],
        questions: [
          { id: 'L2-1', type: 'choice', prompt: 'Why is Linh’s project progressing slowly?', options: ['The company sent the wrong kind of data', 'The company refused to cooperate', 'The students lost interest', 'Her supervisor was unavailable'], answer: 'The company sent the wrong kind of data', explain: 'Công ty gửi số liệu lượt dùng thay vì điểm kiểm tra.' },
          { id: 'L2-2', type: 'choice', prompt: 'What can usage figures not show?', options: ['How often the app was opened', 'Whether any learning took place', 'How long each session lasted', 'Which words were studied'], answer: 'Whether any learning took place', explain: '“it tells you nothing about whether any learning took place”.' },
          { id: 'L2-3', type: 'fill', prompt: 'Linh would rather finish with ___ students who complete the whole eight weeks. (write the number)', answers: ['40', 'forty'], explain: '“I would rather finish with forty who complete the whole eight weeks.”' },
          { id: 'L2-4', type: 'choice', prompt: 'What does Dr Byrom call the greatest threat to the study?', options: ['Participants dropping out', 'A small sample size', 'Weak test design', 'A lack of funding'], answer: 'Participants dropping out', explain: '“Attrition is the greatest threat to a study of this kind.”' },
          { id: 'L2-5', type: 'choice', prompt: 'What mistake does Dr Byrom warn against?', options: ['Letting the two groups study at different times', 'Testing students too often', 'Using too many interview questions', 'Paying participants'], answer: 'Letting the two groups study at different times', explain: 'Nếu hai nhóm học khác thời điểm thì không biết nguyên nhân gây khác biệt.' },
          { id: 'L2-6', type: 'choice', prompt: 'Why should the ethics application be written this week?', options: ['The committee meets only twice a term', 'The deadline is tomorrow', 'Dr Byrom is travelling', 'The project starts on Monday'], answer: 'The committee meets only twice a term', explain: 'Hội đồng chỉ họp hai lần mỗi học kỳ.' },
          { id: 'L2-7', type: 'choice', prompt: 'What was wrong with the seminar recording?', options: ['It stopped halfway', 'The sound quality was poor', 'The slides were missing', 'It began late'], answer: 'The sound quality was poor', explain: 'Mic thu cả tiếng ghế dịch chuyển → âm thanh rất tệ.' },
          { id: 'L2-8', type: 'choice', prompt: 'When will new microphones arrive?', options: ['Next week', 'Next month', 'Next term', 'Next year'], answer: 'Next month', explain: '“new microphones are arriving next month”.' },
          { id: 'L2-9', type: 'choice', prompt: 'Why does Mai prefer attending in person?', options: ['She can ask questions and take better notes', 'The recordings are too short', 'She dislikes watching videos', 'Her friends attend as well'], answer: 'She can ask questions and take better notes', explain: 'Nhìn thấy người nói thì ghi chú tốt hơn và hỏi được cuối buổi.' },
          { id: 'L2-10', type: 'choice', prompt: 'Why may the department delay posting recordings?', options: ['To save storage space', 'To encourage students to attend', 'To improve the sound', 'To shorten the seminars'], answer: 'To encourage students to attend', explain: 'Nhiều sinh viên bỏ buổi học vì biết sẽ có bản ghi.' },
          { id: 'L2-11', type: 'choice', prompt: 'Why does Mai want access to be limited?', options: ['The seminars contain personal examples', 'The website is too slow', 'Recordings confuse students', 'The library requested it'], answer: 'The seminars contain personal examples', explain: 'Ví dụ cá nhân của bệnh nhân không nên công khai.' },
          { id: 'L2-12', type: 'fill', prompt: 'Tuan will write the first ___ tonight. (one word)', answers: ['draft'], explain: '“I will write the first draft tonight.”' },
        ],
      },
      {
        id: 'L3',
        title: 'Part 3 · Bài nói',
        instruction: 'Bạn sẽ nghe 2 bài nói. Phần 1 có 8 câu hỏi, phần 2 có 7 câu hỏi.',
        transcript: [
          { speaker: 'Lecturer', line: 'In today’s session I want to examine a claim that you have almost certainly heard: that taking notes by hand is better than typing them on a laptop. The evidence is more interesting than the headline.' },
          { speaker: 'Lecturer', line: 'In a widely cited experiment, students watched the same recorded lecture. Half typed their notes, half wrote them by hand. Both groups performed equally well on factual questions, such as dates and definitions. The difference appeared only on questions that required understanding.' },
          { speaker: 'Lecturer', line: 'The explanation offered was simple. Because typing is fast, students transcribe almost every word and process very little of it. Handwriting is slow, so students have to decide what matters, and that decision is itself a form of learning.' },
          { speaker: 'Lecturer', line: 'Later researchers, however, added an important condition. If typed notes are deliberately summarised rather than copied, the advantage of handwriting largely disappears. In other words, the medium matters far less than the habit.' },
          { speaker: 'Lecturer', line: 'This matters, because many institutions have moved in the opposite direction and banned laptops from lectures altogether. Such bans are blunt instruments: they punish the student who types a careful summary and do nothing about the student who writes by hand while thinking about lunch.' },
          { speaker: 'Lecturer', line: 'A more promising approach is to teach note-taking explicitly. In one programme, first-year students attended three workshops on structuring their notes. Their examination results improved noticeably, whereas simply providing better software changed nothing at all.' },
          { speaker: 'Lecturer', line: 'There is also an accessibility argument that is frequently forgotten. For a student with dyslexia or a motor disability, a laptop is not a convenience but a necessity. Any sensible policy therefore begins with permission rather than with prohibition.' },
          { speaker: 'Lecturer', line: 'So my conclusion is this. Do not ask which tool is better. Ask whether the notes you produce could be used by somebody else to reconstruct the argument — and if the answer is no, change the habit, not the keyboard.' },
          { speaker: 'Narrator', line: 'Now listen to a short radio talk about a school laptop programme.' },
          { speaker: 'Presenter', line: 'Five years ago, a secondary school in our region decided that every pupil in the first two years would receive a laptop. The plan was announced with a great deal of enthusiasm and, predictably, a great deal of criticism.' },
          { speaker: 'Presenter', line: 'The critics made two predictions. First, that lessons would be disrupted by games and social media. Second, that test scores would fall, because pupils would spend their time on screens instead of books.' },
          { speaker: 'Presenter', line: 'Neither prediction came true, but not because laptops are magical. The school had spent the previous year training teachers and, crucially, had agreed on three rules: devices stayed in the classroom, the school learning platform was the only permitted homepage, and homework could be submitted digitally.' },
          { speaker: 'Presenter', line: 'The most interesting results appeared in subjects where writing is long. Pupils in the laptop year wrote roughly thirty per cent more words in their essays, and teachers reported that pupils revised more often, because editing a digital text costs almost nothing.' },
          { speaker: 'Presenter', line: 'The results in mathematics were, however, disappointing. Pupils who used the devices for practice exercises did slightly worse than the previous year, most likely because tapping an answer encourages guessing.' },
          { speaker: 'Presenter', line: 'The programme was expensive: about two hundred and fifty dollars per pupil per year, including repairs. The school’s conclusion was pragmatic — keep the laptops for humanities and languages, and keep paper for mathematics.' },
          { speaker: 'Presenter', line: 'What can other schools learn? Two things: budget for training before hardware, and be prepared to admit that some subjects work better without a screen.' },
        ],
        questions: [
          { id: 'L3-1', type: 'choice', prompt: 'What is the lecturer mainly discussing?', options: ['How to design a lecture', 'Whether handwriting beats typing for notes', 'Why students dislike laptops', 'How to mark examination papers'], answer: 'Whether handwriting beats typing for notes', explain: 'Chủ đề chính là so sánh ghi chú tay và ghi chú bằng laptop.' },
          { id: 'L3-2', type: 'choice', prompt: 'On which questions did the two groups differ?', options: ['Questions about dates and definitions', 'Questions requiring understanding', 'Questions with pictures', 'Questions at the end of the test'], answer: 'Questions requiring understanding', explain: 'Câu hỏi sự kiện thì hai nhóm như nhau; chỉ khác ở câu hỏi hiểu.' },
          { id: 'L3-3', type: 'choice', prompt: 'Why does handwriting encourage processing?', options: ['It is slow, so students must select what matters', 'It uses a different part of the brain', 'It produces clearer letters', 'It forces students to sit still'], answer: 'It is slow, so students must select what matters', explain: 'Viết chậm nên phải chọn lọc ý — chính việc chọn là học.' },
          { id: 'L3-4', type: 'choice', prompt: 'What condition did later research add?', options: ['Summarising while typing removes the gap', 'Handwriting only helps in science', 'Tests must be written by hand', 'Laptops should be banned'], answer: 'Summarising while typing removes the gap', explain: 'Nếu gõ máy mà tóm tắt thay vì chép lại thì lợi thế biến mất.' },
          { id: 'L3-5', type: 'choice', prompt: 'What is the lecturer’s criticism of banning laptops?', options: ['It is too expensive', 'It is a blunt instrument that punishes the wrong students', 'It is popular with teachers', 'It reduces attendance'], answer: 'It is a blunt instrument that punishes the wrong students', explain: 'Lệnh cấm cứng nhắc: phạt nhầm người gõ tóm tắt.' },
          { id: 'L3-6', type: 'choice', prompt: 'What actually improved examination results?', options: ['Better software', 'Note-taking workshops', 'Longer lectures', 'Smaller classes'], answer: 'Note-taking workshops', explain: 'Ba buổi workshop về cách ghi chú giúp điểm thi tăng.' },
          { id: 'L3-7', type: 'choice', prompt: 'Why does the lecturer mention accessibility?', options: ['Some students genuinely need laptops', 'Laptops are cheaper than paper', 'Lectures are hard to hear', 'Software is often free'], answer: 'Some students genuinely need laptops', explain: 'Với người khó đọc hoặc khuyết tật vận động, laptop là nhu cầu thiết yếu.' },
          { id: 'L3-8', type: 'fill', prompt: 'A good test is whether somebody else could ___ the argument from your notes. (one word)', answers: ['reconstruct'], explain: '“could be used by somebody else to reconstruct the argument”.' },
          { id: 'L3-9', type: 'choice', prompt: 'What were critics worried about?', options: ['That lessons would be disrupted and results would drop', 'That laptops would be stolen', 'That parents would complain about the cost', 'That teachers would refuse to use them'], answer: 'That lessons would be disrupted and results would drop', explain: 'Hai dự đoán: lớp học bị xáo trộn và điểm thi giảm.' },
          { id: 'L3-10', type: 'choice', prompt: 'Why did the problems not appear?', options: ['Teachers were trained and clear rules were agreed', 'The laptops were very expensive', 'Parents supervised homework', 'Pupils were older than expected'], answer: 'Teachers were trained and clear rules were agreed', explain: 'Chuẩn bị trước một năm cho giáo viên và đặt ba quy tắc rõ ràng.' },
          { id: 'L3-11', type: 'fill', prompt: 'Pupils in the laptop year wrote about ___ per cent more words in essays. (write the number)', answers: ['30', 'thirty'], explain: '“roughly thirty per cent more words”.' },
          { id: 'L3-12', type: 'choice', prompt: 'Why did pupils revise their essays more often?', options: ['Editing a digital text costs almost nothing', 'Teachers gave extra marks', 'They had more free time', 'The platform reminded them'], answer: 'Editing a digital text costs almost nothing', explain: 'Sửa văn bản số rất rẻ và nhanh nên học sinh sửa nhiều lần.' },
          { id: 'L3-13', type: 'choice', prompt: 'What happened in mathematics?', options: ['Results improved slightly', 'Results were slightly worse than the previous year', 'Results stayed exactly the same', 'Pupils refused to use laptops'], answer: 'Results were slightly worse than the previous year', explain: 'Nhấn đáp án dễ dẫn tới đoán mò nên kết quả kém hơn chút.' },
          { id: 'L3-14', type: 'choice', prompt: 'What does the school now recommend?', options: ['Laptops for humanities, paper for mathematics', 'No laptops in any subject', 'Laptops in every lesson', 'Laptops only for homework'], answer: 'Laptops for humanities, paper for mathematics', explain: 'Kết luận thực dụng của trường: giữ laptop cho xã hội/ngoại ngữ, giữ giấy cho toán.' },
          { id: 'L3-15', type: 'choice', prompt: 'What is the presenter’s main advice?', options: ['Spend on training before equipment', 'Buy cheaper devices', 'Start with older pupils', 'Ask parents to contribute'], answer: 'Spend on training before equipment', explain: '“budget for training before hardware”.' },
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
            title: 'Nội quy thi trực tuyến',
            text: 'Before the examination begins, candidates must share their screen and keep the camera on for the whole session. A five-minute break is permitted after ninety minutes. Any attempt to open a second window will end the examination immediately.',
            questions: [
              { id: 'R1-1q', type: 'choice', prompt: 'What happens if a candidate opens a second window?', options: ['The exam ends immediately', 'They receive a warning', 'The camera turns off', 'They get extra time'], answer: 'The exam ends immediately', explain: 'Mở cửa sổ thứ hai sẽ kết thúc bài thi ngay lập tức.' },
            ],
          },
          {
            id: 'R1-2',
            title: 'Email',
            text: 'Dear Ms Pham, Thank you for your enquiry about the data analysis module. The evening group is full, but a place has become available in the Saturday morning group. Please confirm by Friday, as we hold places for forty-eight hours only. Kind regards, Admissions Office',
            questions: [
              { id: 'R1-2q', type: 'choice', prompt: 'Why must Ms Pham reply by Friday?', options: ['The course starts on Saturday', 'Places are held for 48 hours only', 'The fee increases on Friday', 'The tutor is away'], answer: 'Places are held for 48 hours only', explain: 'Chỗ chỉ được giữ 48 giờ.' },
            ],
          },
          {
            id: 'R1-3',
            title: 'Quảng cáo',
            text: 'Learn to code in twelve weeks. Live online classes twice a week, recorded so you can watch again. Students who complete all twelve assignments receive a certificate and a free month of mentoring. No previous experience required.',
            questions: [
              { id: 'R1-3q', type: 'choice', prompt: 'What do students receive after all twelve assignments?', options: ['A certificate and mentoring', 'A paid internship', 'A software licence', 'A guaranteed job'], answer: 'A certificate and mentoring', explain: 'Hoàn thành 12 bài tập → chứng chỉ + 1 tháng mentoring miễn phí.' },
            ],
          },
          {
            id: 'R1-4',
            title: 'Đánh giá ứng dụng',
            text: 'The flashcard app is fast and the offline mode is excellent on the train. Unfortunately the pronunciation recording only works on newer phones, and there is no way to export your cards. I would happily pay for that feature.',
            questions: [
              { id: 'R1-4q', type: 'choice', prompt: 'What does the reviewer dislike?', options: ['The recorded pronunciation and the lack of export', 'The speed of the app', 'The offline mode', 'The price'], answer: 'The recorded pronunciation and the lack of export', explain: 'Phàn nàn: phần thu phát âm và không xuất được thẻ.' },
            ],
          },
          {
            id: 'R1-5',
            title: 'Thời khoá biểu',
            text: 'Programming Bootcamp · Monday 18:00 Introduction to variables · Wednesday 18:00 Loops and conditions · Friday 17:30 Project clinic (optional) · Saturday 09:00 Group project work.',
            questions: [
              { id: 'R1-5q', type: 'choice', prompt: 'Which session is optional?', options: ['The project clinic on Friday', 'The Monday session', 'The Wednesday session', 'The Saturday session'], answer: 'The project clinic on Friday', explain: 'Buổi Friday 17:30 được ghi là “optional”.' },
            ],
          },
          {
            id: 'R1-6',
            title: 'Ghi chú nội bộ',
            text: 'To all teaching staff: from Monday, assignment feedback must be released within ten working days. The old system allowed three weeks. Please use the comment bank for repeated errors, but write at least one individual sentence for every student.',
            questions: [
              { id: 'R1-6q', type: 'choice', prompt: 'What is the new deadline for feedback?', options: ['Ten working days', 'Three weeks', 'One month', 'Five days'], answer: 'Ten working days', explain: 'Hạn mới là 10 ngày làm việc (trước đây 3 tuần).' },
            ],
          },
          {
            id: 'R1-7',
            title: 'Hướng dẫn thiết bị',
            text: 'Wireless headphones — press and hold the button for three seconds until the light flashes blue. If the light flashes red, the battery is below ten per cent. Charging from empty takes about ninety minutes.',
            questions: [
              { id: 'R1-7q', type: 'choice', prompt: 'What does a flashing red light mean?', options: ['The battery is almost empty', 'The headphones are pairing', 'The device is charging', 'The headphones are broken'], answer: 'The battery is almost empty', explain: 'Đèn đỏ nhấp nháy = pin dưới 10%.' },
            ],
          },
          {
            id: 'R1-8',
            title: 'Lời mời',
            text: 'You are invited to the launch of the Digital Skills Lab on Tuesday at 3 p.m. There will be demonstrations of the new editing suites, followed by refreshments. Places are limited to forty, so please register online before Monday evening.',
            questions: [
              { id: 'R1-8q', type: 'choice', prompt: 'Why should guests register?', options: ['Only forty places are available', 'There is an entry fee', 'The event is only for staff', 'Refreshments must be ordered'], answer: 'Only forty places are available', explain: 'Chỉ có 40 chỗ nên phải đăng ký trước.' },
            ],
          },
          {
            id: 'R1-9',
            title: 'Phản hồi của giáo viên',
            text: 'Your report is well organised and the data you collected is impressive. Two problems: the literature review describes each study in turn instead of comparing them, and the conclusion repeats the introduction almost word for word.',
            questions: [
              { id: 'R1-9q', type: 'choice', prompt: 'What is wrong with the literature review?', options: ['It lists studies instead of comparing them', 'It is too short', 'It uses no sources', 'It appears at the end'], answer: 'It lists studies instead of comparing them', explain: 'Cần so sánh các nghiên cứu thay vì kể lần lượt.' },
            ],
          },
          {
            id: 'R1-10',
            title: 'Bài đăng trên diễn đàn',
            text: 'I used to write my essays straight into the word processor and then edit for hours. Now I plan on paper for fifteen minutes first — headings, one line per paragraph. The writing is faster and I delete far less. It feels old-fashioned but it works.',
            questions: [
              { id: 'R1-10q', type: 'choice', prompt: 'What change did the writer make?', options: ['Planning on paper before writing on screen', 'Writing everything by hand', 'Hiring an editor', 'Using a shorter word limit'], answer: 'Planning on paper before writing on screen', explain: 'Lập dàn ý ra giấy 15 phút rồi mới viết trên máy.' },
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
            title: 'The flipped classroom: more time, or more work?',
            text: `Ask a teacher what limits learning most and the answer is usually time. There are thirty students in the room, two hours on the timetable, and a syllabus that must be finished by June. In this situation, the lesson is often spent delivering information, while the exercises that would reveal misunderstanding are pushed into homework, where nobody is watching.

The flipped classroom reverses that order. Students watch a short recorded explanation or read a text before the lesson, and the classroom is then used for the tasks that traditionally belonged to homework: solving problems, writing, discussing and asking questions.

The idea is more than a decade old, and hundreds of schools have tried it. The results, however, are more mixed than the enthusiastic articles suggest. Where flipping works well, three conditions are usually present.

The first is accountability. If nothing checks that students watched the video, the lesson turns into a lecture about the lecture. Teachers who succeed usually begin the session with a short quiz or a written question, not because they wish to punish anybody, but because the first five minutes tell everybody, the teacher included, what still needs attention.

The second condition concerns the quality of the material. A recording of a fifty-minute lecture, uploaded unchanged, is not a flipped lesson; it is simply a lecture that has been moved somewhere else. Effective materials are short, deal with one idea at a time, and are accompanied by a question that cannot be answered without thinking.

The third condition is time — teachers need it. Preparing videos, quizzes and group activities takes far longer than preparing a slide presentation, and many schools that adopted flipping quickly abandoned it when the additional hours were neither paid for nor recognised.

It is also worth asking who benefits most. Research suggests that the strongest students, who would have watched the material anyway, gain a little; average students gain more, because they finally receive individual attention while they work. Weaker students, unfortunately, are the ones most likely to arrive unprepared — and they are precisely the ones the method was supposed to help.

So the flipped classroom is neither a revolution nor a passing fashion. It is a rearrangement of attention: less listening in class, more doing. Whether that rearrangement proves profitable depends far less on the technology than on the habits and the support that surround it.`,
            glossary: [
              { word: 'syllabus', meaning: 'đề cương môn học' },
              { word: 'reverse', meaning: 'đảo ngược' },
              { word: 'accountability', meaning: 'trách nhiệm, sự kiểm tra' },
              { word: 'accompany', meaning: 'đi kèm' },
              { word: 'abandon', meaning: 'từ bỏ' },
              { word: 'rearrangement', meaning: 'sự sắp xếp lại' },
            ],
            questions: [
              { id: 'R2-1q1', type: 'choice', prompt: 'What is the writer’s main argument?', options: ['Flipping changes how class time is used, with mixed results', 'Flipping should replace all homework', 'Flipping always improves results', 'Flipping is only suitable for science'], answer: 'Flipping changes how class time is used, with mixed results', explain: 'Tác giả cho rằng flipped classroom là sự đảo lại thời gian trên lớp, kết quả không đồng nhất.' },
              { id: 'R2-1q2', type: 'choice', prompt: 'According to the first paragraph, what is the problem with ordinary lessons?', options: ['Practice happens at home where nobody watches', 'Teachers talk too quietly', 'There are too few students', 'The syllabus is too short'], answer: 'Practice happens at home where nobody watches', explain: 'Bài tập giúp phát hiện hiểu sai lại bị đẩy về nhà, không ai theo dõi.' },
              { id: 'R2-1q3', type: 'choice', prompt: 'What does the flipped classroom move outside the lesson?', options: ['First contact with the material', 'Group discussion', 'Written exercises', 'The final test'], answer: 'First contact with the material', explain: 'Học sinh xem/đọc trước ở nhà, lớp dành cho luyện tập và thảo luận.' },
              { id: 'R2-1q4', type: 'choice', prompt: 'What is the first condition for success?', options: ['Something checks that students prepared', 'Shorter lessons', 'Smaller classes', 'Cheaper software'], answer: 'Something checks that students prepared', explain: 'Điều kiện 1: phải có kiểm tra (accountability).' },
              { id: 'R2-1q5', type: 'choice', prompt: 'Why do successful teachers begin with a short quiz?', options: ['To find out what still needs attention', 'To give extra marks', 'To fill the register', 'To reduce homework'], answer: 'To find out what still needs attention', explain: 'Năm phút đầu cho thầy và trò biết phần nào còn cần ôn.' },
              { id: 'R2-1q6', type: 'choice', prompt: 'What criticism is made of uploaded lecture recordings?', options: ['They are not really flipped lessons', 'They are technically poor', 'They are too short', 'They cost money to host'], answer: 'They are not really flipped lessons', explain: 'Bản ghi 50 phút tải nguyên si chỉ là bài giảng chuyển chỗ.' },
              { id: 'R2-1q7', type: 'choice', prompt: 'Why do schools abandon flipping?', options: ['The extra work is neither paid nor recognised', 'Students refuse to watch videos', 'Exams are too difficult', 'Parents complain'], answer: 'The extra work is neither paid nor recognised', explain: 'Chuẩn bị tốn nhiều thời gian mà không được trả công hay ghi nhận.' },
              { id: 'R2-1q8', type: 'fill', prompt: 'Effective materials are short and deal with one ___ at a time. (one word)', answers: ['idea'], explain: '“deal with one idea at a time”.' },
              { id: 'R2-1q9', type: 'choice', prompt: 'Which group of students gains most?', options: ['Average students', 'The strongest students', 'The weakest students', 'Students who never attend'], answer: 'Average students', explain: 'Sinh viên trung bình hưởng lợi nhiều nhất.' },
              { id: 'R2-1q10', type: 'fill', prompt: 'The writer calls the method a rearrangement of ___, not a revolution. (one word)', answers: ['attention'], explain: '“It is a rearrangement of attention.”' },
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
            title: 'Reading on screens: what the research actually shows',
            text: `Every few years a study appears announcing that screens are destroying our ability to read deeply. The studies themselves are genuine, but the headlines built on them are usually too confident, because the same experiments reveal two very different patterns depending on what is being read and who is reading it.

The first pattern concerns the type of text. For short factual texts — a timetable, a manual, a news report — readers on screens are as accurate as readers on paper, and frequently faster. For long, complex texts with an argument to follow, the advantage moves to paper, although the difference is modest and appears mainly among weaker readers.

The second pattern concerns behaviour rather than ability. When people read on a screen they tend to move faster, skim more, and check how much text remains. This is not a defect of the eyes; it is a habit transferred from browsing. One team of researchers demonstrated it neatly by asking participants to read the same text on paper and on a device while measuring how often they jumped backwards to re-read a sentence. The screen readers re-read far less, and afterwards they recalled fewer connections between ideas.

The third pattern concerns what readers believe. In several experiments, students predicted that they would remember a text better if they read it on a screen, and their predictions were simply wrong. Confidence, it appears, is generated by speed: a fast reading feels like an easy reading, and an easy reading feels like a successful one.

None of this suggests that screens should be removed from education. A student who reads only on paper cannot search, translate or compare sources efficiently. A more useful conclusion is that the medium should match the task. Short texts, reference material and searches can be handled on a screen without loss. Arguments, literature and anything that must be remembered deserve paper — or at least a slower digital format with fewer distractions.

There is one further point that is rarely made. Almost all comparisons of paper and screen are carried out on young adults who grew up with both. We still do not know whether children who read only from screens will develop the same reading habits as those who do not, and confident statements on either side are therefore premature.`,
            glossary: [
              { word: 'genuine', meaning: 'có thật, chính danh' },
              { word: 'skim', meaning: 'đọc lướt' },
              { word: 'defect', meaning: 'khiếm khuyết' },
              { word: 'medium (số nhiều: media)', meaning: 'phương tiện' },
              { word: 'premature', meaning: 'quá sớm, vội vàng' },
            ],
            questions: [
              { id: 'R3-1q1', type: 'choice', prompt: 'What is the writer’s view of the headlines?', options: ['They are more confident than the evidence allows', 'They are completely false', 'They ignore young readers', 'They contradict each other'], answer: 'They are more confident than the evidence allows', explain: 'Nghiên cứu là thật nhưng tiêu đề quá tự tin.' },
              { id: 'R3-1q2', type: 'choice', prompt: 'For which texts do screens perform equally well?', options: ['Short factual texts', 'Long arguments', 'Literature', 'Texts that must be memorised'], answer: 'Short factual texts', explain: 'Văn bản ngắn, sự kiện: đọc màn hình chính xác như đọc giấy, thường nhanh hơn.' },
              { id: 'R3-1q3', type: 'choice', prompt: 'Where does paper show an advantage?', options: ['In long complex texts with an argument', 'In reading speed', 'In searching for sources', 'In translating'], answer: 'In long complex texts with an argument', explain: 'Văn bản dài phức tạp có lập luận thì giấy nhỉnh hơn (mức độ khiêm tốn).' },
              { id: 'R3-1q4', type: 'choice', prompt: 'What behaviour do screen readers show?', options: ['They skim more and rarely go back', 'They read more slowly', 'They re-read each sentence', 'They take more notes'], answer: 'They skim more and rarely go back', explain: 'Đọc lướt nhiều, ít quay lại đọc lại câu.' },
              { id: 'R3-1q5', type: 'fill', prompt: 'The researchers measured how often participants jumped backwards to ___ a sentence. (two words, dạng hyphen: re-read)', answers: ['re-read', 'reread', 're read'], explain: '“jumped backwards to re-read a sentence”.' },
              { id: 'R3-1q6', type: 'choice', prompt: 'What did screen readers recall less well?', options: ['Connections between ideas', 'Names of characters', 'Dates and figures', 'The title of the text'], answer: 'Connections between ideas', explain: 'Họ nhớ ít hơn các mối liên hệ giữa các ý.' },
              { id: 'R3-1q7', type: 'choice', prompt: 'What is surprising about the students’ predictions?', options: ['They expected screens to help them remember, and were wrong', 'They refused to read on screens', 'They preferred paper for short texts', 'They asked for longer tests'], answer: 'They expected screens to help them remember, and were wrong', explain: 'Họ dự đoán nhớ tốt hơn khi đọc trên màn hình, nhưng sai.' },
              { id: 'R3-1q8', type: 'choice', prompt: 'What does the writer recommend?', options: ['Matching the medium to the task', 'Banning screens in schools', 'Reading everything twice', 'Using paper for short texts'], answer: 'Matching the medium to the task', explain: 'Kết luận: chọn phương tiện phù hợp với loại văn bản.' },
              { id: 'R3-1q9', type: 'fill', prompt: 'A fast reading feels easy, and an easy reading feels like a ___ one. (one word)', answers: ['successful'], explain: '“an easy reading feels like a successful one”.' },
              { id: 'R3-1q10', type: 'choice', prompt: 'Why does the writer call statements about children premature?', options: ['Studies have only tested young adults', 'Children read too slowly', 'No data has ever been collected', 'Children dislike both formats'], answer: 'Studies have only tested young adults', explain: 'Các so sánh chỉ làm trên người trẻ lớn lên cùng cả hai phương tiện.' },
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
            title: 'Learning to judge what you find online',
            text: `A generation that grew up with the internet is often assumed to be naturally skilled at judging what it finds there. Research suggests (1)___ the opposite is true.

In one large study, secondary students were asked to evaluate a website about a medical treatment. Most judged the page by its design: clear headings and a professional photograph (2)___ taken as signs of reliability. Almost none looked (3)___ who had written the content or whether the claims could be checked elsewhere.

The skills involved are not especially difficult, but they must be taught (4)___. A useful starting point is the question of purpose: every page was created for a reason, (5)___ to inform, to sell or to persuade. Students who ask this question before reading tend to spot weak evidence much (6)___ quickly.

Another helpful habit is to trace a claim back to its source. Instead of reading five articles that all repeat the same figure, students should (7)___ the original study, if it exists, and check the size of its sample. This is slower, but it is the (8)___ difference between somebody who has an opinion and somebody who has evidence.

Finally, teachers should be careful not to make the exercise cynical. Training students to doubt everything produces paralysis, not judgement. The goal is to make them (9)___ of the difference between a source that is weak and one that is merely unfamiliar. A learner who can do that will rarely be (10)___ by a well-designed page.`,
            questions: [
              { id: 'R4-1q1', type: 'choice', prompt: 'Chỗ (1)', options: ['that', 'what', 'which', 'it'], answer: 'that', explain: '“suggests that the opposite is true” — mệnh đề danh ngữ sau “suggest”.' },
              { id: 'R4-1q2', type: 'choice', prompt: 'Chỗ (2)', options: ['were', 'was', 'is', 'has'], answer: 'were', explain: 'Chủ ngữ số nhiều “clear headings and a photograph” → were.' },
              { id: 'R4-1q3', type: 'choice', prompt: 'Chỗ (3)', options: ['at', 'for', 'into', 'after'], answer: 'at', explain: '“look at who had written the content”.' },
              { id: 'R4-1q4', type: 'choice', prompt: 'Chỗ (4)', options: ['explicitly', 'explicit', 'explicitness', 'explication'], answer: 'explicitly', explain: 'Cần trạng từ bổ nghĩa cho “taught”.' },
              { id: 'R4-1q5', type: 'choice', prompt: 'Chỗ (5)', options: ['whether', 'either', 'neither', 'both'], answer: 'whether', explain: '“whether to inform, to sell or to persuade”.' },
              { id: 'R4-1q6', type: 'choice', prompt: 'Chỗ (6)', options: ['more', 'most', 'as', 'than'], answer: 'more', explain: 'So sánh hơn với trạng từ: “much more quickly”.' },
              { id: 'R4-1q7', type: 'choice', prompt: 'Chỗ (7)', options: ['trace', 'tracing', 'traced', 'traces'], answer: 'trace', explain: 'Sau “should” dùng động từ nguyên thể.' },
              { id: 'R4-1q8', type: 'choice', prompt: 'Chỗ (8)', options: ['main', 'mainly', 'majority', 'most'], answer: 'main', explain: 'Cần tính từ trước danh từ “difference”: the main difference.' },
              { id: 'R4-1q9', type: 'choice', prompt: 'Chỗ (9)', options: ['aware', 'awareness', 'awake', 'award'], answer: 'aware', explain: '“make them aware of the difference”.' },
              { id: 'R4-1q10', type: 'choice', prompt: 'Chỗ (10)', options: ['misled', 'misleading', 'mislead', 'misleads'], answer: 'misled', explain: 'Bị động: “will rarely be misled” (bị dẫn dắt sai).' },
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
        title: 'Task 1 · Email xin tham gia dự án nghiên cứu',
        prompt: 'You are a second-year student. A lecturer, Dr Novak, is starting a research project on how students use technology for studying, and needs student volunteers. Write an email (about 120 words) to Dr Novak. In your email: introduce yourself and your course, explain why you want to join the project, describe the skills you can offer, and ask when the first meeting will take place.',
        minWords: 120,
        checklist: [
          { label: 'Có lời chào và lời kết phù hợp', hint: 'Dear Dr Novak, … / Yours sincerely, Linh' },
          { label: 'Tự giới thiệu (năm học, ngành/chuyên ngành)', hint: 'I am a second-year student in…' },
          { label: 'Nêu lý do muốn tham gia dự án', hint: 'I am writing because I am interested in…' },
          { label: 'Trình bày kỹ năng có thể đóng góp', hint: 'I am familiar with… / I have experience in…' },
          { label: 'Hỏi thời gian buổi họp đầu tiên', hint: 'Could you tell me when the first meeting…?' },
          { label: 'Giọng điệu trang trọng, không dùng từ quá thân mật', hint: 'Tránh “Hey”, “gonna”, “stuff”' },
          { label: 'Đủ số từ (~120) và có ít nhất 4 từ nối', hint: 'moreover, in addition, however, therefore' },
        ],
        tips: [
          'Task 1 B2 vẫn cần đủ 4 ý trong đề; thiếu ý sẽ mất điểm nội dung, dù viết hay.',
          'Email trang trọng nên tránh viết tắt và tiếng lóng: dùng “I would like to” thay vì “I wanna”.',
          'Kết thư nên có một câu thể hiện mong muốn nhận phản hồi, tạo thiện cảm với người đọc.',
        ],
        model: `Dear Dr Novak,

I am writing to express my interest in the research project on technology and student study habits that you announced during Tuesday’s lecture.

I am a second-year student in English Language Teaching, and I have used several vocabulary and note-taking applications over the past two years. I am particularly interested in how students judge the reliability of online material, which seems closely related to your project.

I believe I could contribute in two ways. First, I am confident with spreadsheet software and could help organise and clean the questionnaire data. In addition, I have some experience of interviewing classmates, as I collected twenty short interviews for a course assignment last semester.

Could you also tell me when the first meeting will take place? I would like to arrange my timetable in advance so that I do not miss it.

Thank you for considering my application. I look forward to hearing from you.

Yours sincerely,
Linh`,
      },
      {
        id: 'W2',
        task: 2,
        title: 'Task 2 · Luận: có nên ghi hình tất cả bài giảng?',
        prompt: 'Some people argue that all university lectures should be recorded and made freely available online. Others believe that recording lectures reduces attendance and weakens discussion. Discuss both views and give your own opinion. Write an essay of about 250 words, using reasons and examples to support your answer.',
        minWords: 250,
        checklist: [
          { label: 'Mở bài nêu vấn đề và hướng triển khai', hint: 'Whether… remains a matter of debate.' },
          { label: 'Đoạn ủng hộ việc ghi hình', hint: 'Those in favour argue that…' },
          { label: 'Đoạn phản đối việc ghi hình', hint: 'Critics, however, point out that…' },
          { label: 'Nêu quan điểm cá nhân rõ ràng', hint: 'In my view, the solution lies in…' },
          { label: 'Có ít nhất 2 ví dụ cụ thể', hint: 'For instance, when I… / In one survey…' },
          { label: 'Dùng từ nối giữa các đoạn', hint: 'Nevertheless, consequently, in contrast' },
          { label: 'Có ít nhất 1 câu điều kiện hoặc bị động (cấu trúc B2)', hint: 'If recordings were withdrawn… / Lectures are often delivered…' },
          { label: 'Kết luận tóm tắt, không mở ý mới', hint: 'In conclusion, …' },
          { label: 'Đủ số từ (~250)', hint: 'Kiểm tra số từ trong khung soạn thảo' },
        ],
        tips: [
          'Với đề “discuss both views and give your opinion”, phải thật sự có 2 đoạn thân bài cho 2 quan điểm, rồi mới tới đoạn ý kiến.',
          'Tránh tuyệt đối hoá: dùng “tends to”, “in many cases”, “is likely to” thay vì “always”, “never”.',
          'Nên nêu một giải pháp trung dung ở phần ý kiến (ví dụ: ghi hình nhưng có điều kiện) — đây là điểm cộng cho tiêu chí Task Response ở B2.',
        ],
        model: `Whether every university lecture should be recorded and published online has become a matter of debate in many institutions. Supporters emphasise access and flexibility, while critics fear that easy recordings will empty the lecture theatre.

Those in favour of recording argue that it removes unnecessary barriers. Students with part-time jobs, long journeys or caring responsibilities can study at a time that suits them, and anyone who missed a point can check it later. Recordings are also valuable for international students, who may need to hear a difficult explanation twice. In one survey at a British university, three quarters of students said that recordings helped them revise more effectively.

Critics, however, point out that convenience has a cost. When attendance falls, the lecture stops being a shared experience: questions are not asked, and the informal discussion that follows a difficult point simply disappears. Moreover, preparing a recording changes how teachers behave; some feel obliged to perform rather than to think aloud with the class. A colleague of mine teaches a course in which attendance dropped by a third in the first term after recordings were introduced.

In my view, the choice is not between abandoning recordings and embracing them without conditions. A more sensible policy is to publish them selectively. Lectures that mainly deliver information can be recorded and posted; seminars that depend on confidential examples or on group discussion should not be. If recordings were released two weeks after the session, students would still gain the revision benefit without losing the incentive to attend.

In conclusion, recordings genuinely improve access, but they can weaken the atmosphere of a class when they are used to replace attendance rather than to support it. A careful, selective policy allows universities to keep both advantages.`,
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
        instruction: 'Bạn sẽ nghe 3 câu hỏi về công nghệ trong học tập. Trả lời mỗi câu 1–2 phút, nói tự nhiên như đang trò chuyện.',
        minutes: 3,
        questions: [
          { q: 'How do you use technology in your daily studying?', sample: 'I use technology in three main ways. First, I keep my vocabulary on a flashcard application, so I can review words on the bus. Second, I write everything on a laptop, because I revise by moving sentences around. Third, I use a translation tool when I read academic articles, though I always check the result in a dictionary before I trust it.' },
          { q: 'Do you think students learn better with or without digital devices in class?', sample: 'It depends on the purpose, in my opinion. For listening practice and for searching information, a device is clearly better. For reading a long article, I concentrate more on paper, because nothing pops up on the screen. So I would not ban devices; I would teach students when to put them away.' },
          { q: 'How has technology changed the way you communicate with teachers?', sample: 'It is much faster and, in some ways, more formal. I email my teachers rather than call them, and I try to write a clear subject line so they can decide quickly whether to answer. The advantage is that I can explain a complicated question in writing. The disadvantage is that it is easy to send a message at midnight and expect an immediate answer, which is not fair.' },
        ],
      },
      {
        id: 'S2',
        kind: 'solution',
        title: 'Part 2 · Thảo luận giải pháp',
        instruction: 'Bạn và một người bạn đang bàn cách giúp trường đại học của bạn sử dụng ngân sách công nghệ còn lại một cách hợp lý. Hãy thảo luận ưu điểm, nhược điểm của 3 lựa chọn rồi chọn một phương án và giải thích.',
        minutes: 4,
        situation: 'Your university has a limited technology budget and can fund only one of three proposals. Students complain that computer rooms are crowded at the end of term, and many of them study on old personal laptops.',
        options: [
          'Buy thirty new desktop computers for the main computer room',
          'Pay for a campus licence for a study and writing platform',
          'Provide short-term loans of laptops to students who need them',
        ],
        sample: `Let us consider the three proposals in turn. Thirty new computers would solve the busiest problem immediately, because the rooms are full exactly when everyone is writing assignments. The disadvantage is that desktops cannot leave the room, so students who work late at home gain nothing, and machines of this kind become old in about four years.

A campus licence for a writing and study platform is cheap per student and available everywhere, at any hour. It also helps teachers, because they can see drafts and give feedback before the deadline. However, students who do not own a laptop still cannot use it, and such licences must be renewed every year.

Lending laptops would reach the students with the greatest need, in particular those who cannot afford a machine. The drawbacks are administrative: devices get damaged, insurance costs money, and somebody has to manage bookings and repairs.

If I had to choose one, I would choose the laptop loans, but with a small change. I would buy twenty-five laptops rather than thirty desktops, because they help the students who are actually excluded. To control the risk, the university could require a deposit, keep a waiting list, and allow borrowing only for two weeks at a time. That way the money supports the people the other two options leave behind.`,
      },
      {
        id: 'S3',
        kind: 'topic',
        title: 'Part 3 · Phát triển chủ đề',
        instruction: 'Trình bày quan điểm của bạn về chủ đề dưới đây (khoảng 3 phút), dựa vào 3 gợi ý. Sau đó trả lời 2 câu hỏi mở rộng.',
        minutes: 5,
        topic: 'Artificial intelligence is increasingly used in education, for example to mark essays or to tutor students.',
        outline: [
          'Những lợi ích rõ ràng của AI trong giáo dục',
          'Những rủi ro và lo ngại chính',
          'Bạn dùng AI như thế nào và lời khuyên của bạn',
        ],
        questions: [
          { q: 'Should teachers be allowed to use AI to mark students’ essays?', sample: 'I would allow it as an assistant, not as a judge. AI is very good at spotting repeated words, missing articles and unclear sentences, and it never gets tired at midnight. But final marks affect somebody’s future, and the machine cannot see that a student has improved a weak argument or taken a risk with a difficult idea. So my rule would be: let AI comment, let the teacher decide the mark, and tell students clearly which parts were machine-generated.' },
          { q: 'What advice would you give to students who use AI to write their assignments?', sample: 'I would say two things. First, use it at the beginning rather than at the end: ask it for questions and outline suggestions, not for finished paragraphs, because you learn nothing from text you did not create. Second, keep your own notes and drafts, so that if a teacher asks you about a sentence, you can explain it. And third, always check facts, because a confident answer is not always a correct one.' },
        ],
      },
    ],
  },
};
