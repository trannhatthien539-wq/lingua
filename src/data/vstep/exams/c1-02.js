/**
 * Đề VSTEP C1 số 2 — chủ đề văn hoá & toàn cầu hoá (nội dung gốc, viết theo đúng format đề thi).
 * Bậc C1: văn bản dài hơn, lập luận chặt, từ vựng học thuật.
 */
export default {
  id: 'c1-02',
  level: 'C1',
  title: 'Đề C1 số 2 · Văn hoá & toàn cầu hoá',
  tags: ['văn hoá', 'toàn cầu hoá', 'C1'],

  listening: {
    minutes: 40,
    parts: [
      {
        id: 'L1',
        title: 'Part 1 · Thông báo ngắn',
        instruction: 'Bạn sẽ nghe 8 thông báo ngắn về các sự kiện văn hoá. Mỗi thông báo có một câu hỏi. Chọn đáp án đúng nhất.',
        transcript: [
          { speaker: 'Narrator', line: 'Announcement one. The city museum will close its permanent galleries on the second of April for the installation of a new exhibition on trade routes. A reduced programme of guided tours will continue in the east wing, and entry to those tours is free.' },
          { speaker: 'Narrator', line: 'Announcement two. This is a message for participants in the international food festival. Because the number of registered stalls has doubled, the organisers have extended the festival by one day. Sunday will be dedicated to street food, and the market will stay open until ten in the evening.' },
          { speaker: 'Narrator', line: 'Announcement three. The heritage walking tour scheduled for Saturday morning has been moved to the afternoon, as the old quarter will be closed to pedestrians until midday for repairs to the pavement. Ticket holders do not need to rebook.' },
          { speaker: 'Narrator', line: 'Announcement four. The language exchange evening will now take place in the community library rather than the student union, because the union is being used for examinations. Please bring something small from your own culture to share, as the first half hour will be a show-and-tell.' },
          { speaker: 'Narrator', line: 'Announcement five. Visitors to the folk music performance should note that photography is permitted, but the use of flashes is not, out of respect for the performers. Recording the whole concert is also not allowed.' },
          { speaker: 'Narrator', line: 'Announcement six. The translation workshop has been postponed by one week. The tutor is attending an international conference, and rather than replace her, the organisers have chosen to keep the group together. Everyone who registered has been sent a revised schedule by email.' },
          { speaker: 'Narrator', line: 'Announcement seven. The annual craft market is looking for volunteers to run a stall explaining traditional dyeing techniques. No previous experience is required, but volunteers must attend a two-hour training session the week before the market opens.' },
          { speaker: 'Narrator', line: 'Announcement eight. Please note that the film screening of the documentary about migration has been moved from screen four to the small auditorium, which has subtitles in three languages. The discussion with the director will follow immediately afterwards.' },
        ],
        questions: [
          { id: 'L1-1', type: 'choice', prompt: 'What will continue during the museum’s closure?', options: ['The permanent galleries', 'A reduced programme of guided tours', 'The café only', 'Nothing at all'], answer: 'A reduced programme of guided tours', explain: 'Các tour có hướng dẫn vẫn tiếp tục nhưng thu gọn.' },
          { id: 'L1-2', type: 'choice', prompt: 'Why has the food festival been extended?', options: ['The weather was poor', 'Twice as many stalls registered', 'A sponsor requested it', 'The venue became free'], answer: 'Twice as many stalls registered', explain: 'Số gian hàng đăng ký tăng gấp đôi.' },
          { id: 'L1-3', type: 'choice', prompt: 'What do ticket holders need to do?', options: ['Rebook for Sunday', 'Nothing — the change is automatic', 'Ask for a refund', 'Arrive at midday'], answer: 'Nothing — the change is automatic', explain: '“Ticket holders do not need to rebook.”' },
          { id: 'L1-4', type: 'choice', prompt: 'Why has the language exchange moved?', options: ['The library is larger', 'The union is being used for examinations', 'The union has closed permanently', 'The library requested it'], answer: 'The union is being used for examinations', explain: 'Hội sinh viên đang được dùng làm phòng thi.' },
          { id: 'L1-5', type: 'choice', prompt: 'What is not allowed at the folk music performance?', options: ['Taking photographs', 'Using flash', 'Sitting in the front row', 'Arriving late'], answer: 'Using flash', explain: 'Được chụp ảnh nhưng không dùng đèn flash.' },
          { id: 'L1-6', type: 'choice', prompt: 'Why was the translation workshop postponed?', options: ['Too few people registered', 'The tutor is at an international conference', 'The room was double-booked', 'The materials did not arrive'], answer: 'The tutor is at an international conference', explain: 'Giảng viên dự hội nghị quốc tế nên lớp lùi một tuần.' },
          { id: 'L1-7', type: 'choice', prompt: 'What is required of volunteers?', options: ['Previous experience', 'Attendance at a training session', 'Their own equipment', 'A knowledge of two languages'], answer: 'Attendance at a training session', explain: 'Phải dự buổi tập huấn hai giờ trước khi chợ mở.' },
          { id: 'L1-8', type: 'choice', prompt: 'Why has the film been moved?', options: ['More people are expected', 'The new venue has subtitles in three languages', 'The director requested it', 'Screen four is broken'], answer: 'The new venue has subtitles in three languages', explain: 'Phòng chiếu nhỏ có phụ đề ba thứ tiếng.' },
        ],
      },
      {
        id: 'L2',
        title: 'Part 2 · Hội thoại',
        instruction: 'Bạn sẽ nghe 2 đoạn hội thoại. Mỗi đoạn có 6 câu hỏi.',
        transcript: [
          { speaker: 'Curator', line: 'Thank you for coming in. As you know, we are planning an exhibition on the effects of tourism on traditional crafts, and we would like your village to take part.' },
          { speaker: 'Weaver', line: 'I am interested, but I should be honest with you. Two years ago a museum in the capital borrowed twelve of our looms. They came back damaged, and it took us eight months to repair them.' },
          { speaker: 'Curator', line: 'That is a fair concern, and I will not pretend it never happens. What I can offer is a written agreement: we insure every object, we transport them in our own crates, and we pay for any restoration work.' },
          { speaker: 'Weaver', line: 'And how long would the pieces be away?' },
          { speaker: 'Curator', line: 'Six months, with an option to extend to nine if the exhibition travels. But we could also take photographs and a video instead, if your group prefers. Frankly, the objects attract more visitors, but the images tell the story just as well.' },
          { speaker: 'Weaver', line: 'Photographs would be easier. However, our young people would gain more from coming to the city and demonstrating the technique themselves.' },
          { speaker: 'Curator', line: 'Then let us do both. We will display the photographs, and we will fund four weavers to spend a week here giving demonstrations. Would that work?' },
          { speaker: 'Weaver', line: 'It would, provided that the demonstration is described as a living practice rather than a performance.' },
          { speaker: 'Curator', line: 'Agreed, and I will put that wording in the contract. May I ask one more thing? Would your group be willing to record the names of the patterns and what they mean? Visitors always ask, and we would like the labels to come from you, not from us.' },
          { speaker: 'Weaver', line: 'That is the part I care about most. Our patterns have names that describe events, not decorations. If the labels are translated badly, the meaning disappears.' },
          { speaker: 'Narrator', line: 'Now listen to a conversation between two students preparing a presentation on globalisation.' },
          { speaker: 'Linh', line: 'I have read four articles and I still cannot decide what our main argument should be.' },
          { speaker: 'Tom', line: 'Perhaps that is the problem. We are trying to say something about globalisation as a whole, and it is too large a term.' },
          { speaker: 'Linh', line: 'What do you mean?' },
          { speaker: 'Tom', line: 'Well, my grandmother in Manchester eats the same dishes as my flatmate in Hanoi, and that is one kind of globalisation. But the fact that both of them can now find their own regional food in a supermarket is arguably the opposite process.' },
          { speaker: 'Linh', line: 'So globalisation makes things similar and also makes small differences more visible at the same time.' },
          { speaker: 'Tom', line: 'Exactly. Maybe that should be our thesis. Not “is globalisation good or bad”, which we cannot answer in ten minutes, but “why does it produce both effects at once”.' },
          { speaker: 'Linh', line: 'That is much better. Then the examples matter more than the theory. Could you find something about language?' },
          { speaker: 'Tom', line: 'I already have one: radio stations in Ireland that broadcast entirely in Irish, funded partly by a European programme designed to protect minority languages.' },
          { speaker: 'Linh', line: 'That is a good example of an international institution protecting something local. I will look for a counterexample where the same process weakens a language.' },
        ],
        questions: [
          { id: 'L2-1', type: 'choice', prompt: 'What does the curator want from the village?', options: ['A financial contribution', 'Participation in an exhibition', 'Permission to film a documentary', 'A list of tourists'], answer: 'Participation in an exhibition', explain: 'Bảo tàng mời làng tham gia triển lãm về nghề thủ công.' },
          { id: 'L2-2', type: 'choice', prompt: 'Why is the weaver cautious?', options: ['The village is too busy', 'Looms borrowed before came back damaged', 'The museum pays too little', 'The exhibition is too short'], answer: 'Looms borrowed before came back damaged', explain: 'Khung dệt cho mượn trước đây bị hỏng khi trả lại.' },
          { id: 'L2-3', type: 'choice', prompt: 'What does the curator offer?', options: ['A written agreement with insurance and transport', 'A cash payment in advance', 'Free training for weavers', 'Space in the museum shop'], answer: 'A written agreement with insurance and transport', explain: 'Bảo hiểm, vận chuyển bằng thùng riêng, trả chi phí phục chế.' },
          { id: 'L2-4', type: 'choice', prompt: 'What is the curator’s honest admission?', options: ['Objects attract more visitors than images', 'The museum has no budget', 'Photographs are not allowed', 'The exhibition may be cancelled'], answer: 'Objects attract more visitors than images', explain: '“the objects attract more visitors, but the images tell the story just as well”.' },
          { id: 'L2-5', type: 'choice', prompt: 'What does the weaver prefer, and why?', options: ['Photographs, because they are cheaper', 'Demonstrations, because young people gain more', 'Nothing at all', 'A travelling exhibition'], answer: 'Demonstrations, because young people gain more', explain: 'Người dệt muốn có người đến trình diễn vì lớp trẻ học được nhiều hơn.' },
          { id: 'L2-6', type: 'choice', prompt: 'What wording does the weaver insist on?', options: ['That the objects are described as rare', 'That the demonstration is called a living practice', 'That the village receives credit in the title', 'That the exhibition is free'], answer: 'That the demonstration is called a living practice', explain: 'Gọi đó là thực hành sống chứ không phải tiết mục trình diễn.' },
          { id: 'L2-7', type: 'choice', prompt: 'Why does Tom think their topic is too large?', options: ['They have too little time to research', 'Globalisation as a whole is too broad a term', 'Nobody is interested in the topic', 'The teacher rejected it'], answer: 'Globalisation as a whole is too broad a term', explain: 'Tom cho rằng “globalisation” quá rộng để bàn trong 10 phút.' },
          { id: 'L2-8', type: 'choice', prompt: 'What paradox does Linh identify?', options: ['Globalisation makes things both more similar and more visibly different', 'Globalisation only affects food', 'Older people reject globalisation', 'Supermarkets create local food'], answer: 'Globalisation makes things both more similar and more visibly different', explain: 'Vừa làm giống nhau, vừa làm khác biệt nhỏ trở nên rõ hơn.' },
          { id: 'L2-9', type: 'choice', prompt: 'What thesis do they settle on?', options: ['Is globalisation good or bad?', 'Why globalisation produces both effects at once', 'How to stop globalisation', 'Why food travels'], answer: 'Why globalisation produces both effects at once', explain: 'Chọn câu hỏi “vì sao cùng lúc tạo ra cả hai hiệu ứng”.' },
          { id: 'L2-10', type: 'choice', prompt: 'What example does Tom bring?', options: ['Irish-language radio partly funded by a European programme', 'A supermarket selling regional food', 'A language school in Manchester', 'A festival in Hanoi'], answer: 'Irish-language radio partly funded by a European programme', explain: 'Đài phát thanh tiếng Ireland được một chương trình châu Âu tài trợ.' },
          { id: 'L2-11', type: 'choice', prompt: 'What is the Irish example an instance of?', options: ['An international institution protecting something local', 'A local practice replacing an international one', 'A commercial success', 'A failed policy'], answer: 'An international institution protecting something local', explain: 'Tổ chức quốc tế bảo vệ yếu tố địa phương.' },
          { id: 'L2-12', type: 'choice', prompt: 'What will Linh look for?', options: ['More statistics', 'A counterexample where the same process weakens a language', 'A different presentation topic', 'A recording of Irish radio'], answer: 'A counterexample where the same process weakens a language', explain: 'Linh tìm phản ví dụ về quá trình làm suy yếu một ngôn ngữ.' },
        ],
      },
      {
        id: 'L3',
        title: 'Part 3 · Bài nói',
        instruction: 'Bạn sẽ nghe 2 bài nói. Bài 1 có 8 câu hỏi, bài 2 có 7 câu hỏi.',
        transcript: [
          { speaker: 'Lecturer', line: 'I want to begin with a question that sounds naive: when a tradition is performed for visitors, is it the same tradition? The honest answer is that it rarely is, but the reasons are more interesting than simple loss.' },
          { speaker: 'Lecturer', line: 'Consider a weaving village that I studied for three years. Before tourism, cloth was produced when it was needed, and the patterns were chosen by the weaver according to the occasion. After the road was built and visitors began to arrive, three things happened almost simultaneously.' },
          { speaker: 'Lecturer', line: 'First, production increased. Families who had woven two pieces a month began to weave twenty. Second, the patterns changed, but not in the direction people expected: the most complex designs became rarer, because a visitor who is only in the village for forty minutes buys what is immediately attractive.' },
          { speaker: 'Lecturer', line: 'Third, and this is the part usually forgotten, the status of the weavers rose. Young people who had been told that the craft was backward began to see it as a source of income and, more surprisingly, of respect. Two of the weavers I interviewed had returned from factory jobs in the city.' },
          { speaker: 'Lecturer', line: 'So what is the conclusion? I would resist saying tourism destroys culture, and I would equally resist saying it saves it. What it does is select. It rewards the visible, the quick and the photogenic, and it neglects the slow practices that carry the most meaning — the preparation of dyes, the naming of patterns, the apprenticeship that takes a decade.' },
          { speaker: 'Lecturer', line: 'If that analysis is right, then the policy question changes. Instead of asking how to protect tradition from tourists, we should ask which parts of the practice need protecting because the market will never pay for them. Dye preparation is a good example: it is invisible in a photograph, it takes two days, and it is the first thing to disappear.' },
          { speaker: 'Lecturer', line: 'Practically, that could mean funding apprenticeships rather than performances, and recording knowledge in the community’s own words rather than in a curator’s. Neither is dramatic. Both are dull, cheap and, according to the evidence, effective.' },
          { speaker: 'Narrator', line: 'Now listen to a talk about the global spread of a single word.' },
          { speaker: 'Presenter', line: 'A few years ago, a linguist counted the number of English words used in a single issue of a fashion magazine in Tokyo. She found more than four hundred, most of them describing colours, cuts and attitudes that had no Japanese equivalent at the time.' },
          { speaker: 'Presenter', line: 'The usual reaction to a story like this is a lament about loss. But the linguist noticed something stranger. Many of those words had been altered: shortened, combined, given new meanings that no speaker of English would recognise. In other words, the words were not borrowed so much as rebuilt.' },
          { speaker: 'Presenter', line: 'This is not new. English itself took thousands of words from French and Latin, and then changed their meanings beyond recognition. The interesting question is not whether languages mix — they always have — but what happens to the grammar while they do.' },
          { speaker: 'Presenter', line: 'And here the evidence is reassuring. Vocabulary travels quickly, but grammar is remarkably stubborn. A language can absorb two thousand loan words and still build sentences in the same way for centuries.' },
          { speaker: 'Presenter', line: 'What does threaten a language is not borrowing but interruption: when children stop hearing it at home. That is the finding that should worry us, because it is a process that takes a single generation and cannot easily be reversed.' },
          { speaker: 'Presenter', line: 'So the response that works is not banning foreign words, which is both unpopular and ineffective. It is making sure that a language is still spoken to children, and that there is something worth reading, singing and arguing in it. Words will take care of themselves.' },
        ],
        questions: [
          { id: 'L3-1', type: 'choice', prompt: 'What question does the lecturer begin with?', options: ['Whether tradition is performed for visitors at all', 'Whether a tradition performed for visitors is the same tradition', 'How much tourism a village can bear', 'Why weaving is disappearing'], answer: 'Whether a tradition performed for visitors is the same tradition', explain: 'Câu hỏi mở đầu: khi trình diễn cho khách, truyền thống có còn nguyên vẹn?' },
          { id: 'L3-2', type: 'choice', prompt: 'How was cloth produced before tourism?', options: ['In large workshops', 'When it was needed, with patterns chosen by the weaver', 'Only for export', 'By machine'], answer: 'When it was needed, with patterns chosen by the weaver', explain: 'Sản xuất khi cần, hoa văn do người dệt chọn theo dịp.' },
          { id: 'L3-3', type: 'choice', prompt: 'What happened to production after the road was built?', options: ['It stayed the same', 'It rose from two to twenty pieces a month', 'It fell sharply', 'It moved to the city'], answer: 'It rose from two to twenty pieces a month', explain: 'Từ hai sản phẩm lên khoảng hai mươi sản phẩm mỗi tháng.' },
          { id: 'L3-4', type: 'choice', prompt: 'How did the patterns change?', options: ['The most complex designs became rarer', 'They became more traditional', 'They stopped being used', 'They became more expensive'], answer: 'The most complex designs became rarer', explain: 'Hoa văn phức tạp nhất trở nên hiếm vì khách chỉ ở 40 phút.' },
          { id: 'L3-5', type: 'choice', prompt: 'What third change does the lecturer emphasise?', options: ['The status of the weavers rose', 'The village population fell', 'Dyes became cheaper', 'Tourists stopped coming'], answer: 'The status of the weavers rose', explain: 'Người dệt được coi trọng hơn; hai người từ thành phố trở về.' },
          { id: 'L3-6', type: 'choice', prompt: 'What does tourism do to culture, in the lecturer’s view?', options: ['It destroys it', 'It saves it', 'It selects what is rewarded', 'It has no effect'], answer: 'It selects what is rewarded', explain: 'Du lịch “chọn lọc”: thưởng cho cái nhanh, rõ, dễ chụp ảnh.' },
          { id: 'L3-7', type: 'choice', prompt: 'What does the lecturer say the market will never pay for?', options: ['Finished cloth', 'Slow practices such as dye preparation', 'Guided tours', 'Photographs'], answer: 'Slow practices such as dye preparation', explain: 'Việc chuẩn bị thuốc nhuộm tốn hai ngày và vô hình trong ảnh.' },
          { id: 'L3-8', type: 'choice', prompt: 'Which policy does the lecturer favour?', options: ['Funding performances', 'Funding apprenticeships and recording knowledge locally', 'Restricting tourist numbers', 'Building more roads'], answer: 'Funding apprenticeships and recording knowledge locally', explain: 'Tài trợ học nghề và ghi lại tri thức bằng chính lời của cộng đồng.' },
          { id: 'L3-9', type: 'choice', prompt: 'What did the linguist find in the Tokyo magazine?', options: ['No English words at all', 'Over four hundred English words', 'Only brand names', 'Fewer loan words than expected'], answer: 'Over four hundred English words', explain: 'Hơn 400 từ tiếng Anh trong một số tạp chí.' },
          { id: 'L3-10', type: 'choice', prompt: 'What was surprising about those words?', options: ['They were all misspelled', 'They had been shortened, combined and given new meanings', 'They came from French', 'They were only used by older people'], answer: 'They had been shortened, combined and given new meanings', explain: 'Từ được “tái chế” chứ không chỉ vay mượn.' },
          { id: 'L3-11', type: 'choice', prompt: 'What does the presenter say about English itself?', options: ['It has never borrowed words', 'It took thousands of words from French and Latin and changed them', 'It is a new language', 'It has no loan words'], answer: 'It took thousands of words from French and Latin and changed them', explain: 'Tiếng Anh cũng vay mượn rồi biến đổi nghĩa.' },
          { id: 'L3-12', type: 'choice', prompt: 'What does the evidence say about grammar?', options: ['It changes as fast as vocabulary', 'It is remarkably stubborn', 'It disappears first', 'It cannot be studied'], answer: 'It is remarkably stubborn', explain: 'Ngữ pháp rất bền bỉ dù từ vựng du nhập nhanh.' },
          { id: 'L3-13', type: 'choice', prompt: 'What actually threatens a language?', options: ['Borrowing foreign words', 'Children no longer hearing it at home', 'Writing it down', 'Singing in it'], answer: 'Children no longer hearing it at home', explain: 'Sự gián đoạn khi trẻ không còn nghe ngôn ngữ ở nhà.' },
          { id: 'L3-14', type: 'choice', prompt: 'Why is banning foreign words ineffective?', options: ['It is expensive', 'It is unpopular and does not address the real problem', 'It is illegal', 'It changes grammar'], answer: 'It is unpopular and does not address the real problem', explain: 'Không giải quyết nguyên nhân thực sự là thiếu môi trường sử dụng.' },
          { id: 'L3-15', type: 'fill', prompt: 'The response that works is to make sure a language is still spoken to ___. (one word)', answers: ['children'], explain: '“making sure that a language is still spoken to children”.' },
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
            title: 'Thông báo bảo tàng',
            text: 'The ethnographic collection will be rearranged this autumn. Labels will be rewritten in consultation with the communities represented, and objects that were previously described simply as “ritual” will carry the name and purpose given by their makers. Researchers wishing to consult the old labels should request access before 30 September.',
            questions: [
              { id: 'R1-1q', type: 'choice', prompt: 'What is the main change?', options: ['Objects will be sold', 'Labels will be rewritten with the communities', 'The collection will close', 'Only researchers may visit'], answer: 'Labels will be rewritten with the communities', explain: 'Nhãn hiện vật được viết lại có tham vấn cộng đồng.' },
            ],
          },
          {
            id: 'R1-2',
            title: 'Tin tuyển tình nguyện viên',
            text: 'We are looking for volunteers to help record oral histories from elderly residents in three districts. Volunteers will receive training in interviewing and in the use of our recording equipment. Knowledge of a local dialect is an advantage but is not required. Time commitment: four hours a week for ten weeks.',
            questions: [
              { id: 'R1-2q', type: 'choice', prompt: 'What is said about local dialect?', options: ['It is essential', 'It is an advantage but not required', 'It will be taught', 'It is not relevant'], answer: 'It is an advantage but not required', explain: 'Biết tiếng địa phương là lợi thế nhưng không bắt buộc.' },
            ],
          },
          {
            id: 'R1-3',
            title: 'Email',
            text: 'Dear Ms Tran, thank you for agreeing to host our exchange students. Please note that two of the six have dietary requirements, which we have listed in the attached form. We would also be grateful if you could avoid scheduling activities on the first evening, as the group will have been travelling for fourteen hours.',
            questions: [
              { id: 'R1-3q', type: 'choice', prompt: 'Why should the first evening be free?', options: ['The host is unavailable', 'The group will be exhausted after travelling', 'The students must study', 'There is a public holiday'], answer: 'The group will be exhausted after travelling', explain: 'Nhóm đã di chuyển mười bốn giờ nên cần nghỉ.' },
            ],
          },
          {
            id: 'R1-4',
            title: 'Trích bài phê bình',
            text: 'The exhibition succeeds brilliantly in its first two rooms, where it lets objects speak for themselves. It is less convincing in the final section, which attempts to summarise four centuries of cultural exchange in a single timeline. Ambition is admirable, but here it has produced a wall of dates that no visitor will read.',
            questions: [
              { id: 'R1-4q', type: 'choice', prompt: 'What is the critic’s complaint?', options: ['The exhibition is too short', 'The final section is overloaded with dates', 'The objects are poorly displayed', 'The ticket price is high'], answer: 'The final section is overloaded with dates', explain: 'Phần cuối nhồi quá nhiều mốc thời gian.' },
            ],
          },
          {
            id: 'R1-5',
            title: 'Quy định lễ hội',
            text: 'Performers must arrive ninety minutes before their slot. Traditional instruments may be amplified only if the sound engineer agrees. Groups wishing to sell recordings should register with the organisers; unregistered selling is not permitted inside the festival grounds.',
            questions: [
              { id: 'R1-5q', type: 'choice', prompt: 'When do performers need to arrive?', options: ['Thirty minutes early', 'Ninety minutes early', 'The day before', 'At the start of the festival'], answer: 'Ninety minutes early', explain: 'Phải đến trước 90 phút.' },
            ],
          },
          {
            id: 'R1-6',
            title: 'Đoạn trong sách hướng dẫn',
            text: 'Visitors to the temple should dress modestly, covering shoulders and knees. Photography is allowed in the outer courtyards but not in the inner hall. Shoes must be removed before entering the inner hall; bags may be left in the free lockers provided at the entrance.',
            questions: [
              { id: 'R1-6q', type: 'choice', prompt: 'Where is photography not allowed?', options: ['The outer courtyards', 'The inner hall', 'The entrance', 'The lockers'], answer: 'The inner hall', explain: 'Không được chụp ảnh trong chính điện.' },
            ],
          },
          {
            id: 'R1-7',
            title: 'Thông cáo của trường đại học',
            text: 'From next year, all students of languages will complete a module on translation ethics. The module examines questions such as who owns a translated text and when a translator should refuse work. It replaces the former optional course on literary translation, which will now be offered in the summer term.',
            questions: [
              { id: 'R1-7q', type: 'choice', prompt: 'What happens to the literary translation course?', options: ['It is cancelled', 'It becomes compulsory', 'It moves to the summer term', 'It becomes an ethics course'], answer: 'It moves to the summer term', explain: 'Môn dịch văn học chuyển sang học kỳ hè.' },
            ],
          },
          {
            id: 'R1-8',
            title: 'Nhãn sản phẩm',
            text: 'Hand-woven silk scarf. Dyed with natural indigo and lac. Colour may transfer slightly during the first two washes; wash separately in cold water. Each pattern corresponds to a village festival and the name of the pattern is printed on the reverse.',
            questions: [
              { id: 'R1-8q', type: 'choice', prompt: 'What is printed on the reverse of the scarf?', options: ['Washing instructions', 'The name of the pattern', 'The price', 'The dyer’s address'], answer: 'The name of the pattern', explain: 'Tên hoa văn được in ở mặt sau.' },
            ],
          },
          {
            id: 'R1-9',
            title: 'Bài đăng trên diễn đàn',
            text: 'I grew up speaking a dialect that my teachers called incorrect. When I started recording my grandmother, I realised how much vocabulary existed for plants and weather that standard Vietnamese simply does not have. I am not romanticising the past; I am saying that some knowledge disappears with the words.',
            questions: [
              { id: 'R1-9q', type: 'choice', prompt: 'What is the writer’s point?', options: ['Dialects should replace the standard language', 'Some knowledge is lost when words disappear', 'The past was better', 'Teachers are wrong about grammar'], answer: 'Some knowledge is lost when words disappear', explain: 'Tác giả nhấn mạnh tri thức mất đi cùng từ ngữ.' },
            ],
          },
          {
            id: 'R1-10',
            title: 'Thông báo toà soạn',
            text: 'Our documentary series on migration will now be broadcast with subtitles in four languages, following feedback from viewers who are deaf or hard of hearing and from those watching in areas where the programme is dubbed. The subtitles will also be available as a separate text file on our website.',
            questions: [
              { id: 'R1-10q', type: 'choice', prompt: 'Why have subtitles been added?', options: ['To reduce costs', 'Because of feedback from viewers', 'Because dubbing was banned', 'To meet a legal deadline'], answer: 'Because of feedback from viewers', explain: 'Thay đổi xuất phát từ phản hồi của khán giả.' },
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
            title: 'Everything everywhere: the myth of cultural flattening',
            text: `It has become a commonplace to say that globalisation is making the world culturally uniform. Airports look alike, the same coffee is sold on four continents, and a teenager in a provincial town may know more about a foreign pop star than about the music played at her own wedding. The observation is accurate as far as it goes, but it describes only half of the process.

The other half is easier to miss because it does not photograph well. As global media spread a small number of dominant forms, they also create markets for very specific local ones. A streaming service that needs to fill thousands of hours of programming does not only export; it commissions in dozens of languages, because a drama made in Bangkok may travel across a region more cheaply than a translation of an American series. The result is not uniformity but a rearrangement of what is visible.

Linguists have documented a similar pattern. Vocabulary travels with extraordinary speed, but grammar is stubborn: a language can absorb two thousand loan words and continue to build sentences in exactly the same way for centuries. The borrowing is real, yet it is rarely the borrowing that kills a language. What kills a language is interruption — the moment when children stop hearing it at home. That process can happen within a single generation, and once it happens, no amount of dictionaries will reverse it.

This distinction matters for policy. Governments that ban foreign words, as several have tried, usually discover that the ban is unpopular and ineffective, because it addresses a symptom. Measures that work are duller: ensuring that a language is used in schools and courts, and that there is something worth reading, singing and arguing in it. A language survives not because it is protected but because it is useful.

There is a further complication, which is that cultures are not passive. A pattern borrowed from elsewhere is rarely adopted unchanged. Fashion magazines in Tokyo contain hundreds of English words, but many have been shortened, combined or given meanings no English speaker would recognise. The words were not so much borrowed as rebuilt, which is precisely what English did with thousands of French and Latin words before them.

None of this is an argument for complacency. Small cultures can and do disappear, and the market rewards the quick and the visible while neglecting slow practices that carry the most meaning. But the metaphor of a steamroller is misleading. Globalisation is better understood as a filter that determines what gets seen, not as a force that erases what exists. If that is right, the sensible response is not to build walls around tradition, but to ask which parts of it the market will never pay for — and to pay for those.`,
            glossary: [
              { word: 'commonplace', meaning: 'điều sáo rỗng, phổ biến' },
              { word: 'uniform', meaning: 'đồng nhất, giống nhau' },
              { word: 'stubborn', meaning: 'cứng đầu, bền bỉ, khó thay đổi' },
              { word: 'interruption', meaning: 'sự gián đoạn' },
              { word: 'complacency', meaning: 'sự tự mãn, chủ quan' },
            ],
            questions: [
              { id: 'R2-1q1', type: 'choice', prompt: 'What is the writer’s central claim?', options: ['Globalisation is making cultures uniform', 'Globalisation rearranges what is visible rather than erasing difference', 'Airports are the same everywhere', 'Local cultures are unchanged by global media'], answer: 'Globalisation rearranges what is visible rather than erasing difference', explain: 'Tác giả phản đối luận điểm “đồng nhất hoá” đơn giản.' },
              { id: 'R2-1q2', type: 'choice', prompt: 'Why is the second half of the process easy to miss?', options: ['It happens slowly', 'It does not photograph well', 'It is secret', 'It concerns only elites'], answer: 'It does not photograph well', explain: '“it does not photograph well” — khó thấy bằng ảnh minh hoạ.' },
              { id: 'R2-1q3', type: 'choice', prompt: 'Why does a streaming service commission local dramas?', options: ['It is required by law', 'Local productions can travel cheaply across a region', 'They are cheaper to subtitle', 'To protect languages'], answer: 'Local productions can travel cheaply across a region', explain: 'Phim nội địa có thể lan truyền trong khu vực với chi phí thấp.' },
              { id: 'R2-1q4', type: 'choice', prompt: 'What does the writer say about grammar?', options: ['It changes faster than vocabulary', 'It is stubborn and survives heavy borrowing', 'It disappears within a generation', 'It cannot be studied'], answer: 'It is stubborn and survives heavy borrowing', explain: '“Vocabulary travels… but grammar is stubborn”.' },
              { id: 'R2-1q5', type: 'choice', prompt: 'What actually kills a language?', options: ['Borrowing foreign words', 'Children no longer hearing it at home', 'Writing it down', 'Using it in courts'], answer: 'Children no longer hearing it at home', explain: 'Sự gián đoạn khi trẻ không còn nghe ngôn ngữ trong gia đình.' },
              { id: 'R2-1q6', type: 'choice', prompt: 'Why do bans on foreign words fail?', options: ['They are too expensive', 'They treat a symptom rather than the cause', 'They are illegal', 'They are popular but weak'], answer: 'They treat a symptom rather than the cause', explain: 'Luật cấm chỉ tác động lên triệu chứng chứ không phải nguyên nhân.' },
              { id: 'R2-1q7', type: 'choice', prompt: 'What kind of measure does the writer call effective?', options: ['Dramatic symbolic gestures', 'Unspectacular ones that make a language useful', 'Complete isolation', 'Official punishment for mixing'], answer: 'Unspectacular ones that make a language useful', explain: '“Measures that work are duller… A language survives because it is useful.”' },
              { id: 'R2-1q8', type: 'choice', prompt: 'What happened to the English words in Tokyo fashion magazines?', options: ['They were used unchanged', 'They were rebuilt with new forms and meanings', 'They were banned', 'They replaced Japanese grammar'], answer: 'They were rebuilt with new forms and meanings', explain: '“were not so much borrowed as rebuilt”.' },
              { id: 'R2-1q9', type: 'choice', prompt: 'What does the writer say about small cultures?', options: ['They can and do disappear', 'They are always protected by markets', 'They never change', 'They benefit from complacency'], answer: 'They can and do disappear', explain: '“None of this is an argument for complacency. Small cultures can and do disappear.”' },
              { id: 'R2-1q10', type: 'fill', prompt: 'The writer argues globalisation is better understood as a ___ that determines what gets seen. (one word)', answers: ['filter'], explain: '“better understood as a filter”.' },
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
            title: 'Rooted cosmopolitans',
            text: `Public debate about identity tends to offer two positions. In the first, people are products of a single culture, and movement weakens them. In the second, culture is a set of options and the modern individual chooses freely among them. Both accounts are recognisable in political speeches, and both describe almost nobody.

Sociologists who study migratory lives have found something more specific. A person who moves between two cities often maintains strong ties in both: obligations to family left behind, membership of associations, and a working knowledge of two sets of conventions about politeness, timekeeping and negotiation. Such people are sometimes described as rootless, yet the evidence points to the opposite view. They are unusually skilled at reading social situations, because they have had to learn that what feels obvious at home may be rude somewhere else.

What they are not is free. The idea that individuals simply pick and choose cultural elements overlooks how much work maintenance requires. A language not used daily decays; a religious calendar is difficult to observe in a country where the holidays are different; a diet may be impossible to sustain without a specialised shop. Every element retained is retained because somebody spends effort on it.

This has a consequence for how governments think about integration. Policies that demand the abandonment of the original culture in exchange for acceptance are not only harsh, they are misinformed. Migrants rarely abandon one framework to take up another; they operate with two simultaneously, like bilinguals who do not translate but switch. What integration policies can reasonably ask is compliance with civic rules — paying tax, observing law, sending children to school — not the replacement of private habits.

There is, however, a genuine tension that romantic accounts conceal. Where two frameworks demand incompatible behaviour, something must give. A person whose religion requires a specific diet and whose employer provides only one canteen menu is not choosing between cultures in the abstract; she is dealing with a concrete conflict, usually resolved by cost and convenience rather than by principle. Studies of second-generation migrants consistently find that the framework most likely to be dropped is the one whose practice is hardest to fit into an ordinary weekday.

If that is right, then culture is less a matter of belief than of infrastructure. Languages survive where there are schools, broadcasters and shops; festivals survive where employers allow leave; recipes survive where ingredients can be bought. Debates about identity that ignore these practical conditions are, in the end, arguments about symbols rather than about lives.`,
            glossary: [
              { word: 'migratory', meaning: 'thuộc về di cư' },
              { word: 'convention', meaning: 'quy ước, tập tục' },
              { word: 'decay', meaning: 'mai một, suy tàn' },
              { word: 'compliance', meaning: 'sự tuân thủ' },
              { word: 'infrastructure', meaning: 'hạ tầng, điều kiện nền tảng' },
            ],
            questions: [
              { id: 'R3-1q1', type: 'choice', prompt: 'What is wrong with both positions in the opening paragraph?', options: ['They are politically motivated', 'They describe almost nobody', 'They are too recent', 'They contradict each other'], answer: 'They describe almost nobody', explain: '“both describe almost nobody”.' },
              { id: 'R3-1q2', type: 'choice', prompt: 'What do sociologists find about people who move between two cities?', options: ['They lose all ties', 'They maintain strong ties in both places', 'They reject both cultures', 'They adopt one culture completely'], answer: 'They maintain strong ties in both places', explain: 'Họ duy trì quan hệ mạnh ở cả hai nơi.' },
              { id: 'R3-1q3', type: 'choice', prompt: 'Why are such people good at reading social situations?', options: ['They travel frequently', 'They have learned that what feels obvious at home may be rude elsewhere', 'They speak many languages', 'They are naturally extroverted'], answer: 'They have learned that what feels obvious at home may be rude elsewhere', explain: 'Họ buộc phải học rằng điều hiển nhiên ở nhà có thể là bất lịch sự ở nơi khác.' },
              { id: 'R3-1q4', type: 'choice', prompt: 'What does the writer say about the idea of freely choosing cultural elements?', options: ['It is the best description of modern life', 'It overlooks the work that maintenance requires', 'It applies only to the rich', 'It is supported by all the evidence'], answer: 'It overlooks the work that maintenance requires', explain: 'Giữ gìn văn hoá đòi hỏi công sức, không chỉ là lựa chọn.' },
              { id: 'R3-1q5', type: 'choice', prompt: 'Which example of maintenance is given?', options: ['Buying a house', 'A language not used daily decays', 'Joining a political party', 'Learning to drive'], answer: 'A language not used daily decays', explain: 'Ngôn ngữ không dùng hằng ngày sẽ mai một.' },
              { id: 'R3-1q6', type: 'choice', prompt: 'Why are integration policies demanding cultural abandonment misinformed?', options: ['They are too expensive', 'Migrants operate with two frameworks at once', 'They are illegal', 'Migrants refuse all civic rules'], answer: 'Migrants operate with two frameworks at once', explain: 'Người di cư vận hành hai khung cùng lúc, như người song ngữ.' },
              { id: 'R3-1q7', type: 'choice', prompt: 'What can integration policies reasonably ask?', options: ['Private habits must change', 'Compliance with civic rules', 'Religious practice should stop', 'Only one language at home'], answer: 'Compliance with civic rules', explain: 'Đóng thuế, tuân thủ luật, cho con đi học.' },
              { id: 'R3-1q8', type: 'choice', prompt: 'What does the writer say happens in a genuine conflict?', options: ['People choose on principle', 'It is usually resolved by cost and convenience', 'Governments intervene', 'Nothing changes'], answer: 'It is usually resolved by cost and convenience', explain: 'Xung đột thực tế thường giải quyết theo chi phí và tiện lợi.' },
              { id: 'R3-1q9', type: 'choice', prompt: 'Which framework is most likely to be dropped?', options: ['The one with the strongest beliefs', 'The one hardest to fit into an ordinary weekday', 'The oldest one', 'The one with the fewest followers'], answer: 'The one hardest to fit into an ordinary weekday', explain: 'Thực hành khó lồng vào ngày thường dễ bị bỏ nhất.' },
              { id: 'R3-1q10', type: 'choice', prompt: 'What is the writer’s conclusion about culture?', options: ['It is mainly a matter of belief', 'It depends heavily on practical infrastructure', 'It cannot be studied', 'It should be protected by law only'], answer: 'It depends heavily on practical infrastructure', explain: '“culture is less a matter of belief than of infrastructure”.' },
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
            title: 'Translating a festival',
            text: `When a festival is presented to visitors from another country, someone has to decide what (1)___ explained and what can be left implicit.

The commonest mistake is to explain everything. A programme that glosses every gesture treats the audience as (2)___ they were unable to notice anything for themselves. Visitors, after all, (3)___ accustomed to unfamiliar settings; they read menus in languages they cannot speak and still enjoy the meal.

A second mistake is the opposite one. Organisers who insist that the festival must be experienced (4)___ explanation may be protecting its integrity, but they are also limiting (5)___ access. In practice, the most successful events combine the two: a short introduction (6)___ the visitor knows what to look for, followed by long periods of silence.

Language policy raises further questions. If everything is translated, the visitor may (7)___ the impression of watching a performance about a culture rather than of watching a culture. (8)___ the other hand, an untranslated event may be admired politely and understood not at all.

Perhaps the best approach is the one used by good museums. They do not explain the object; they describe it precisely, and they place it in a (9)___ that allows the visitor to draw conclusions. Precision, in other words, is more respectful (10)___ simplified interpretation.`,
            questions: [
              { id: 'R4-1q1', type: 'choice', prompt: 'Chỗ (1)', options: ['must be', 'must have', 'should been', 'ought be'], answer: 'must be', explain: 'Bị động với động từ khuyết thiếu: “must be explained”.' },
              { id: 'R4-1q2', type: 'choice', prompt: 'Chỗ (2)', options: ['as if', 'like', 'even if', 'so that'], answer: 'as if', explain: '“treats the audience as if they were unable…”.' },
              { id: 'R4-1q3', type: 'choice', prompt: 'Chỗ (3)', options: ['is', 'are', 'was', 'has'], answer: 'are', explain: 'Chủ ngữ “Visitors” số nhiều → are.' },
              { id: 'R4-1q4', type: 'choice', prompt: 'Chỗ (4)', options: ['without', 'with', 'despite', 'beside'], answer: 'without', explain: '“experienced without explanation” — không cần giải thích.' },
              { id: 'R4-1q5', type: 'choice', prompt: 'Chỗ (5)', options: ['its', 'it’s', 'their', 'theirs'], answer: 'its', explain: 'Sở hữu cách của “it” là “its”.' },
              { id: 'R4-1q6', type: 'choice', prompt: 'Chỗ (6)', options: ['so that', 'because', 'although', 'unless'], answer: 'so that', explain: 'Chỉ mục đích: để người xem biết cần chú ý gì.' },
              { id: 'R4-1q7', type: 'choice', prompt: 'Chỗ (7)', options: ['be left with', 'leave', 'be leaving', 'have left with'], answer: 'be left with', explain: '“may be left with the impression” — bị động.' },
              { id: 'R4-1q8', type: 'choice', prompt: 'Chỗ (8)', options: ['On', 'In', 'At', 'By'], answer: 'On', explain: '“On the other hand”.' },
              { id: 'R4-1q9', type: 'choice', prompt: 'Chỗ (9)', options: ['context', 'contest', 'content', 'contact'], answer: 'context', explain: '“place it in a context” — đặt trong bối cảnh.' },
              { id: 'R4-1q10', type: 'choice', prompt: 'Chỗ (10)', options: ['than', 'then', 'as', 'to'], answer: 'than', explain: 'So sánh hơn “more respectful than”.' },
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
        title: 'Task 1 · Email đề xuất hợp tác văn hoá',
        prompt: 'You are the coordinator of a local heritage club. A museum in another city has invited your club to contribute to an exhibition on traditional crafts. Write an email (at least 150 words) to the museum director in which you: respond to the invitation, describe what your club can offer, raise one concern and suggest how it could be resolved, and propose a date for a planning meeting.',
        minWords: 150,
        checklist: [
          { label: 'Có lời chào và lời kết trang trọng', hint: 'Dear Ms Park, … / Yours sincerely,' },
          { label: 'Phản hồi lời mời rõ ràng, tích cực nhưng không sáo rỗng', hint: 'We would be delighted to take part, provided that…' },
          { label: 'Mô tả cụ thể những gì câu lạc bộ có thể đóng góp', hint: 'we hold forty recordings, six practising weavers, a dye garden' },
          { label: 'Nêu một lo ngại thực tế', hint: 'Our main concern is… / We are anxious that…' },
          { label: 'Đề xuất cách giải quyết lo ngại đó', hint: 'This could be avoided if…' },
          { label: 'Đề nghị thời gian họp cụ thể', hint: 'Would the week of 14 October suit you?' },
          { label: 'Trang trọng, ít nhất 150 từ, ít nhất 4 từ nối', hint: 'moreover, however, therefore, in that case' },
        ],
        tips: [
          'Task 1 bậc C1 cần nêu ý kiến/ lo ngại một cách lịch sự nhưng dứt khoát — đây là điểm khác biệt so với B1.',
          'Đừng liệt kê chung chung: hãy đưa con số cụ thể để email có sức nặng.',
          'Cấu trúc hữu ích: “We would be glad to… provided that…”, “Should that not be possible, we could…”',
          'Giữ email trong 4–5 đoạn, mỗi đoạn một chức năng, không lan man.',
        ],
        model: `Dear Ms Park,

Thank you for your letter of 3 September inviting the Phu My Heritage Club to contribute to next year’s exhibition on traditional crafts. We would be delighted to take part.

The club holds a collection of forty recordings made with weavers born before 1950, together with more than a hundred pattern names and the stories attached to them. Six of our members are still practising weavers, and we maintain a small dye garden where indigo and lac are grown for demonstration purposes. We could offer the recordings for listening points in the exhibition, and two of our weavers to lead workshops for school groups.

Our main concern is attribution. In the past, similar exhibitions have described our patterns simply as decorative, which erases the fact that each one commemorates an event in the village. This could easily be avoided: we would like the labels to use the names and explanations that our members provide, subject to your editor’s approval of the English.

On a practical point, we could also lend four looms, although these would need to be insured and transported in padded crates, as two were damaged on loan in 2019.

Would the week of 14 October suit you for a planning meeting? Two of us could travel to your city, or we could meet online if that is more convenient.

Yours sincerely,
Le Quang Huy`,
      },
      {
        id: 'W2',
        task: 2,
        title: 'Task 2 · Luận: toàn cầu hoá có làm văn hoá nghèo đi?',
        prompt: 'Some people believe that globalisation is making the world’s cultures poorer by erasing local traditions. Others argue that it gives those traditions new audiences and new value. Discuss both views and give your own opinion. Write at least 300 words.',
        minWords: 300,
        checklist: [
          { label: 'Mở bài nêu hai quan điểm và hướng xử lý', hint: 'Both views have some force, but the evidence suggests…' },
          { label: 'Đoạn trình bày quan điểm “văn hoá bị nghèo đi”', hint: 'The strongest argument for this view is…' },
          { label: 'Có ví dụ cụ thể cho quan điểm thứ nhất', hint: 'complex designs becoming rarer; fast food replacing local dishes' },
          { label: 'Đoạn trình bày quan điểm “thêm khán giả, thêm giá trị”', hint: 'On the other side of the argument…' },
          { label: 'Có ví dụ cụ thể cho quan điểm thứ hai', hint: 'streaming platforms commissioning local dramas; funding for minority-language radio' },
          { label: 'Nêu ý kiến riêng rõ ràng, có mức độ', hint: 'In my view, the effect depends on which practices a market rewards.' },
          { label: 'Có ít nhất 2 cấu trúc nhượng bộ bậc C1', hint: 'Admittedly…, While it is true that…, even so' },
          { label: 'Kết luận tóm tắt, không thêm ý mới; đủ 300 từ', hint: 'In conclusion, …' },
        ],
        tips: [
          'Đề “discuss both views and give your opinion” phải có cả hai phía và một quan điểm riêng — thiếu phía nào cũng mất điểm.',
          'Bậc C1 nên có một đoạn “điều kiện” (khi nào quan điểm A đúng, khi nào quan điểm B đúng).',
          'Ví dụ không cần nổi tiếng, chỉ cần cụ thể và hợp lý; ví dụ mơ hồ làm giảm điểm lập luận.',
          'Tránh lặp “culture”: cultural practice, heritage, tradition, custom, way of life.',
        ],
        model: `Few topics produce more heated argument than the effect of globalisation on culture. One camp insists that the world is becoming uniform and that local traditions are being erased. The other replies that traditions have never been healthier, because global markets have given them audiences they could never have reached alone. Both views contain a good deal of truth, and the disagreement is largely about what each side chooses to look at.

The strongest argument for the pessimistic view is that markets reward what is quick and visible. A visitor who spends forty minutes in a weaving village will buy the scarf that is immediately attractive, not the one whose pattern took three days to prepare. The slow practices that carry the most meaning — dye preparation, apprenticeship, the naming of designs — are precisely those that no tourist will pay for, and they are the first to disappear. Something similar happens to food, where a cheap imported product can undercut a local dish that requires two hours of work.

On the other side of the argument, global distribution has genuine benefits. Minority-language broadcasters, for instance, have been kept alive partly by international funding programmes; a drama made in one country now travels across a whole region, which makes production economically viable in languages that could not support a domestic industry alone. In addition, the children of migrants often rediscover a tradition precisely because the diaspora makes it visible and shareable. A tradition with no audience is not preserved; it is merely postponed.

In my view, the outcome depends less on globalisation itself than on which practices a market happens to reward. Admittedly, exposure can destroy a fragile practice that was never commercial. Even so, the damage is not caused by foreign influence in general but by a specific gap: nobody is paying for the slow, invisible parts of a tradition. That gap is exactly what public funding, apprenticeships and community archives are able to fill.

In conclusion, globalisation does not simply impoverish culture, but it does select it. Traditions that can be sold will flourish; the rest need deliberate support, and pretending otherwise is the surest way to lose them.`,
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
        instruction: 'Bạn sẽ nghe 3 câu hỏi về văn hoá, ngôn ngữ và toàn cầu hoá. Trả lời mỗi câu 1–2 phút.',
        minutes: 3,
        questions: [
          { q: 'How important is it for young people to learn about their own culture?', sample: 'I think it matters, but not in the way it is often presented. Learning about your own culture is not about pride; it is about having a reference point. If you know why a certain dish is eaten at a certain festival, you can compare it with other people’s customs instead of assuming that yours are simply normal. In that sense it makes you more international, not less. What I would avoid is teaching culture as a list of facts to memorise, because that usually produces indifference rather than interest.' },
          { q: 'Has globalisation changed the way you celebrate festivals?', sample: 'It has, mainly through convenience. Twenty years ago, preparing for Tet meant the whole family cooking for two days, and the ingredients were only available in season. Now some of the dishes can be ordered or bought ready-made, which saves time but also means that the cooking — the part where you learn the recipe — happens less often. On the other hand, I know a lot more about how other countries celebrate than my parents did, partly because of the internet. So some things are lost and others gained.' },
          { q: 'Do you think a single global language would be a good thing?', sample: 'It would have practical advantages, and I understand why people argue for it, because a common language reduces misunderstanding in trade, science and travel. But I would not want it, for two reasons. First, language carries knowledge that does not translate: names of plants, weather conditions, cooking techniques. Second, being bilingual is a real skill, and it would be a pity to make it unnecessary. I would prefer a world where people speak a shared language in addition to their own, not instead of it.' },
        ],
      },
      {
        id: 'S2',
        kind: 'solution',
        title: 'Part 2 · Thảo luận giải pháp',
        instruction: 'Bạn và một người bạn đang bàn cách giúp một làng nghề truyền thống thu hút người trẻ tiếp tục theo nghề. Hãy thảo luận ưu điểm, nhược điểm của 3 lựa chọn rồi chọn một phương án và giải thích.',
        minutes: 4,
        situation: 'A craft village near your town is losing its weavers: most of those still working are over sixty, and young people leave for factory jobs in the city. Three options are suggested.',
        options: [
          'Offer young people paid apprenticeships with a master craftsperson',
          'Develop the village as a tourist destination with workshops and a shop',
          'Record the techniques on video and in writing before the knowledge is lost',
        ],
        sample: `Let us consider the three proposals. Paid apprenticeships attack the problem directly: young people leave because the craft cannot pay as much as a factory, so a salary would remove the main obstacle. It also keeps the skill in the hands of living practitioners. The difficulty is cost — you are paying wages for years before the apprentice becomes productive — and there is no guarantee that the apprentice will stay.

Tourism has the advantage of paying for itself. Workshops and a shop generate income immediately, and visitors bring attention, which raises the status of the craft in the eyes of young people. However, as soon as the market enters, the products change. In villages that rely on tourists, the complex patterns tend to disappear, because a visitor buys what looks attractive in a few minutes.

Recording the techniques is valuable and cheap, but on its own it is a museum solution. A video is not a practitioner. If the last weaver stops, the recording preserves information and loses the craft.

If I have to choose one, I would combine the first and the third: fund apprenticeships for a small number of young people, and pay somebody in the village to record the techniques in the community’s own words as a safeguard. Tourism could be added later, once the apprenticeship is stable, because income without practitioners simply accelerates the ending.`,
      },
      {
        id: 'S3',
        kind: 'topic',
        title: 'Part 3 · Phát triển chủ đề',
        instruction: 'Trình bày quan điểm của bạn về chủ đề dưới đây (khoảng 3 phút), dựa vào 3 gợi ý. Sau đó trả lời 2 câu hỏi mở rộng.',
        minutes: 5,
        topic: 'Cultures change when they meet, and that is not always a loss.',
        outline: [
          'Vì sao tiếp xúc văn hoá là chuyện bình thường trong lịch sử',
          'Điều gì thực sự bị mất và điều gì thực sự được thêm',
          'Bạn nghĩ nên làm gì để giảm mất mát',
        ],
        questions: [
          { q: 'Should governments spend public money protecting traditional crafts and languages?', sample: 'Yes, but selectively. I would not support blanket subsidies, because that can keep alive something nobody practises. What I would fund is the part that the market will never pay for: apprenticeships, recording knowledge in the community’s own language, and small spaces where a language is used naturally. The test I would apply is whether the money creates a practitioner or only a performance. In a country like Vietnam, where many craft villages have no successor, that distinction matters a great deal.' },
          { q: 'How can a person keep their own traditions while living abroad?', sample: 'I think it works better through habits than through symbols. Keeping a language alive is mostly about actually speaking it at home, and keeping a cuisine alive means cooking on ordinary days, not only at festivals. Practically, people also need infrastructure: a shop that sells the ingredients, a community association, and an employer who allows leave for important dates. What does not work, in my experience, is trying to preserve everything at once — families usually keep two or three practices well rather than fifteen badly.' },
        ],
      },
    ],
  },
};
