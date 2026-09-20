/**
 * Đề VSTEP B1 số 3 — chủ đề du lịch & sức khoẻ (nội dung gốc, viết theo đúng format đề thi).
 * Xem `docs/vstep-schema.md` để biết ý nghĩa từng field.
 */
export default {
  id: 'b1-03',
  level: 'B1',
  title: 'Đề B1 số 3 · Du lịch & sức khoẻ',
  tags: ['du lịch', 'sức khoẻ', 'B1'],

  listening: {
    minutes: 40,
    parts: [
      {
        id: 'L1',
        title: 'Part 1 · Thông báo ngắn',
        instruction: 'Bạn sẽ nghe 8 thông báo ngắn về du lịch và sức khoẻ. Mỗi thông báo có một câu hỏi. Chọn đáp án đúng nhất.',
        transcript: [
          { speaker: 'Narrator', line: 'Announcement one. The two o’clock boat trip to the island is cancelled today because of strong wind. Passengers with tickets can join tomorrow’s trip for free, or get their money back at the ticket office.' },
          { speaker: 'Narrator', line: 'Announcement two. Attention, passengers. Flight VN245 to Hue will now board at gate twelve, not gate two. Boarding closes twenty minutes before departure, so please go to gate twelve now.' },
          { speaker: 'Narrator', line: 'Announcement three. This is a message for guests at the Blue Sea Hotel. The swimming pool will be closed this afternoon for cleaning. It will open again tomorrow at seven in the morning.' },
          { speaker: 'Narrator', line: 'Announcement four. Here is today’s health notice for visitors. Because of the hot weather, please drink water every hour and stay in the shade between eleven and three. Free drinking water is available at the visitor centre.' },
          { speaker: 'Narrator', line: 'Announcement five. The pharmacy on the ground floor of the shopping centre closes at nine in the evening from Monday to Saturday. On Sunday it closes at five in the afternoon.' },
          { speaker: 'Narrator', line: 'Announcement six. The night train to Da Nang is arriving at platform four. Passengers travelling with bicycles should use the lift at the end of the platform and not the stairs.' },
          { speaker: 'Narrator', line: 'Announcement seven. Our walking tour of the old town will start at nine fifteen, not at nine o’clock. Please wait in front of the main post office and wear comfortable shoes.' },
          { speaker: 'Narrator', line: 'Announcement eight. This is a message from the students’ health centre. Appointments for the free eye test on Friday are now full. New appointments will be available from next Monday morning.' },
        ],
        questions: [
          { id: 'L1-1', type: 'choice', prompt: 'Why is the boat trip cancelled?', options: ['There are not enough tickets', 'Strong wind', 'The boat is being repaired', 'The island is closed'], answer: 'Strong wind', explain: '“cancelled today because of strong wind”.' },
          { id: 'L1-2', type: 'choice', prompt: 'What should passengers on flight VN245 do?', options: ['Go to gate twelve', 'Wait at gate two', 'Check in again', 'Collect new tickets'], answer: 'Go to gate twelve', explain: 'Chuyến bay đổi sang cổng 12.' },
          { id: 'L1-3', type: 'choice', prompt: 'When will the swimming pool open again?', options: ['This afternoon', 'Tonight at nine', 'Tomorrow at seven in the morning', 'Tomorrow at noon'], answer: 'Tomorrow at seven in the morning', explain: 'Bể mở lại lúc 7 giờ sáng hôm sau.' },
          { id: 'L1-4', type: 'choice', prompt: 'What is the advice for visitors?', options: ['Drink water often and stay in the shade', 'Wear a hat at all times', 'Avoid travelling by bus', 'Eat only cooked food'], answer: 'Drink water often and stay in the shade', explain: 'Uống nước mỗi giờ và tránh nắng từ 11 giờ đến 3 giờ.' },
          { id: 'L1-5', type: 'choice', prompt: 'What time does the pharmacy close on Sunday?', options: ['Five in the afternoon', 'Seven in the evening', 'Nine in the evening', 'It does not open'], answer: 'Five in the afternoon', explain: 'Chủ nhật đóng cửa lúc 5 giờ chiều.' },
          { id: 'L1-6', type: 'choice', prompt: 'What should passengers with bicycles do?', options: ['Use the lift at the end of the platform', 'Use the stairs quickly', 'Leave the bicycle at the station', 'Pay an extra charge'], answer: 'Use the lift at the end of the platform', explain: 'Hành khách mang xe đạp dùng thang máy cuối sân ga.' },
          { id: 'L1-7', type: 'choice', prompt: 'Where should the tour group wait?', options: ['At the old town gate', 'In front of the main post office', 'At the walking tour office', 'In the museum'], answer: 'In front of the main post office', explain: 'Điểm hẹn là trước bưu điện chính.' },
          { id: 'L1-8', type: 'choice', prompt: 'What should students do if they want a free eye test?', options: ['Go to the health centre on Friday', 'Book again from next Monday', 'Pay for a test at the hospital', 'Ask their teacher for a form'], answer: 'Book again from next Monday', explain: 'Lịch thứ Sáu đã hết, có lịch mới từ thứ Hai tuần sau.' },
        ],
      },
      {
        id: 'L2',
        title: 'Part 2 · Hội thoại',
        instruction: 'Bạn sẽ nghe 2 đoạn hội thoại. Mỗi đoạn có 6 câu hỏi.',
        transcript: [
          { speaker: 'Agent', line: 'Good morning, Green Travel. How can I help you?' },
          { speaker: 'Linh', line: 'Hello. I would like to book a short trip to Da Lat for two people in July.' },
          { speaker: 'Agent', line: 'Certainly. We have a three-day tour and a five-day tour. The five-day one includes a boat trip on the lake and a visit to a coffee farm.' },
          { speaker: 'Linh', line: 'Five days sounds good, but my friend can only travel from the tenth of July.' },
          { speaker: 'Agent', line: 'The tour leaves on the twelfth, so that fits. It costs four million dong per person, including the hotel, breakfast and the local guide, but not the flights.' },
          { speaker: 'Linh', line: 'Is there anything cheaper?' },
          { speaker: 'Agent', line: 'If you travel on a weekday, the price drops by ten per cent. The discount is not available at weekends.' },
          { speaker: 'Linh', line: 'The twelfth is a Wednesday, so that is perfect. Does the hotel have a swimming pool?' },
          { speaker: 'Agent', line: 'The hotel in the city centre has a small pool. The one by the lake has a pretty garden but no pool.' },
          { speaker: 'Linh', line: 'We would prefer the hotel with the pool. Is the city centre very noisy?' },
          { speaker: 'Agent', line: 'It is lively in the evening, but we can ask for rooms at the back of the hotel, which are much quieter.' },
          { speaker: 'Linh', line: 'Please do that. What do you need to confirm the booking?' },
          { speaker: 'Agent', line: 'A deposit of one million dong and your friend’s full name as it appears on her identity card. You can pay the deposit by card today or by bank transfer within two days.' },
          { speaker: 'Linh', line: 'I will pay by card now. Thank you for your help.' },
          { speaker: 'Narrator', line: 'Now listen to a conversation at a student health centre.' },
          { speaker: 'Doctor', line: 'Good morning, Trang. What seems to be the problem?' },
          { speaker: 'Trang', line: 'I have been very tired for about a month, doctor. I go to bed at eleven, but I cannot fall asleep before one in the morning.' },
          { speaker: 'Doctor', line: 'How many hours do you sleep on a normal night?' },
          { speaker: 'Trang', line: 'About five, maybe five and a half.' },
          { speaker: 'Doctor', line: 'And how much coffee do you drink?' },
          { speaker: 'Trang', line: 'Three cups a day. The last one is at about four o’clock, when I study in the library.' },
          { speaker: 'Doctor', line: 'That is part of the problem. Coffee stays in the body for hours. Stop drinking it after two in the afternoon.' },
          { speaker: 'Trang', line: 'Should I take sleeping tablets?' },
          { speaker: 'Doctor', line: 'Not at the moment. Tablets help for a week and then they usually make the problem worse. Let us try three changes first.' },
          { speaker: 'Trang', line: 'What are the other two?' },
          { speaker: 'Doctor', line: 'Walk for twenty minutes in the evening, and leave your phone outside the bedroom. Screens before bed tell your brain that it is still daytime.' },
          { speaker: 'Trang', line: 'Do I need to come back?' },
          { speaker: 'Doctor', line: 'Yes, in three weeks. If you still sleep badly, we will do some tests. And do not study in bed — keep the bed for sleeping only.' },
          { speaker: 'Trang', line: 'Thank you, doctor. I will start tonight.' },
        ],
        questions: [
          { id: 'L2-1', type: 'choice', prompt: 'Which tour does Linh choose?', options: ['The three-day tour', 'The five-day tour', 'A one-week tour', 'No tour yet'], answer: 'The five-day tour', explain: 'Linh chọn tour 5 ngày vì có chuyến thuyền trên hồ và thăm nông trại cà phê.' },
          { id: 'L2-2', type: 'fill', prompt: 'The tour price does not include the ___ (transport by plane). (one word)', answers: ['flight', 'flights'], explain: '“including the hotel, breakfast and the local guide, but not the flights”.' },
          { id: 'L2-3', type: 'fill', prompt: 'The price drops by ten per cent if you travel on a ___. (one word)', answers: ['weekday'], explain: '“If you travel on a weekday, the price drops by ten per cent.”' },
          { id: 'L2-4', type: 'choice', prompt: 'Which hotel do they choose?', options: ['The hotel by the lake', 'The city centre hotel with a pool', 'A hotel near the airport', 'A guest house'], answer: 'The city centre hotel with a pool', explain: 'Họ chọn khách sạn trung tâm có bể bơi.' },
          { id: 'L2-5', type: 'choice', prompt: 'Which rooms does the agent offer?', options: ['Rooms with a lake view', 'Rooms at the back of the hotel', 'Rooms on the top floor', 'Rooms next to the pool'], answer: 'Rooms at the back of the hotel', explain: 'Phòng phía sau yên tĩnh hơn phòng mặt tiền.' },
          { id: 'L2-6', type: 'fill', prompt: 'The deposit is ___ million dong. (write the number)', answers: ['1', 'one'], explain: '“A deposit of one million dong”.' },
          { id: 'L2-7', type: 'choice', prompt: 'How long has Trang had the sleeping problem?', options: ['About a week', 'About a month', 'About a year', 'Since childhood'], answer: 'About a month', explain: '“I have been very tired for about a month.”' },
          { id: 'L2-8', type: 'choice', prompt: 'What time does Trang fall asleep?', options: ['At eleven', 'At midnight', 'At one in the morning', 'At four o’clock'], answer: 'At one in the morning', explain: 'Cô lên giường 11 giờ nhưng 1 giờ sáng mới ngủ được.' },
          { id: 'L2-9', type: 'choice', prompt: 'What is the doctor’s first piece of advice?', options: ['Stop drinking coffee after two in the afternoon', 'Go to bed at nine', 'Take sleeping tablets for a week', 'Study in the morning only'], answer: 'Stop drinking coffee after two in the afternoon', explain: 'Cà phê lưu lại trong cơ thể nhiều giờ nên không uống sau 2 giờ chiều.' },
          { id: 'L2-10', type: 'choice', prompt: 'What does the doctor say about sleeping tablets?', options: ['They are the best solution', 'They help for a week and then make the problem worse', 'They are not sold in this country', 'They should be taken every evening'], answer: 'They help for a week and then make the problem worse', explain: 'Thuốc chỉ giúp một tuần rồi thường làm vấn đề nặng hơn.' },
          { id: 'L2-11', type: 'choice', prompt: 'What should Trang do with her phone?', options: ['Charge it in the bedroom', 'Leave it outside the bedroom', 'Turn the screen brightness down', 'Use it to play soft music'], answer: 'Leave it outside the bedroom', explain: 'Màn hình trước giờ ngủ khiến não tưởng vẫn là ban ngày.' },
          { id: 'L2-12', type: 'fill', prompt: 'The doctor asks Trang to come back in ___ weeks. (write the number)', answers: ['3', 'three'], explain: '“Yes, in three weeks.”' },
        ],
      },
      {
        id: 'L3',
        title: 'Part 3 · Bài nói',
        instruction: 'Bạn sẽ nghe 2 bài nói. Phần 1 có 8 câu hỏi, phần 2 có 7 câu hỏi.',
        transcript: [
          { speaker: 'Presenter', line: 'Imagine a small town of three thousand people that receives eight hundred thousand visitors a year. That was the situation in the fishing town we visit today, and in 2019 the local council admitted that the town was being loved to death.' },
          { speaker: 'Presenter', line: 'The first problem was traffic. Tour buses arrived at nine in the morning, parked in the main square and left at six. Residents could not get to their own shops, and the narrow streets were full of people taking photographs.' },
          { speaker: 'Presenter', line: 'The second problem was water. In summer the town used four times more water than in winter, and two wells ran dry in the same year. This, more than anything else, made the council act.' },
          { speaker: 'Presenter', line: 'The plan had three parts. First, buses must now stop in a car park outside the town, and visitors either walk for eight minutes or take a small electric bus that costs one dollar. The town centre has been closed to cars since 2020.' },
          { speaker: 'Presenter', line: 'Second, entry to the old town is free before nine in the morning and after six in the evening, and costs five dollars in between. The money pays for the electric buses and for cleaning the streets.' },
          { speaker: 'Presenter', line: 'Third, the council encouraged visitors to stay for two nights instead of one, because day visitors cause the traffic but spend the least. Hotels now offer a free breakfast on the second morning.' },
          { speaker: 'Presenter', line: 'Two years later, the number of visitors has fallen by about ten per cent, but the money they spend in the town has risen by a quarter, and residents say that summer is bearable again.' },
          { speaker: 'Presenter', line: 'The lesson for other places is not to copy the five-dollar ticket. It is to find the one resource that is really under pressure — water, streets, housing — and to design the rules around it.' },
          { speaker: 'Narrator', line: 'Now listen to a short talk about walking and health.' },
          { speaker: 'Doctor', line: 'Many people believe that ten thousand steps a day is a magic number. It did not come from a laboratory; it came from a Japanese advertisement for a pedometer in the 1960s, because the character for ten thousand looks like a person walking.' },
          { speaker: 'Doctor', line: 'What does the research say? In a study of sixteen thousand older women, those who walked about four thousand four hundred steps a day had a much lower risk of serious illness than those who walked fewer than three thousand. Health improved quickly at the beginning and then more slowly.' },
          { speaker: 'Doctor', line: 'In other words, the first three thousand steps are the most valuable. A person who goes from two thousand to four thousand steps gains far more than a person who goes from eight thousand to ten thousand.' },
          { speaker: 'Doctor', line: 'There is a second finding that surprises people. Walking speed matters less than total time, and several short walks work as well as one long walk. Three walks of ten minutes have the same effect as one walk of thirty minutes.' },
          { speaker: 'Doctor', line: 'Steps are not the only measure, either. Muscle work twice a week — carrying shopping, climbing stairs, simple exercises at home — protects the bones and improves balance, and walking does not replace it.' },
          { speaker: 'Doctor', line: 'So what should a busy student do? Leave the bus one stop earlier, walk to the shop instead of ordering online, and take a five-minute walk between two hours of study. Small decisions, repeated daily, are the ones that last.' },
          { speaker: 'Doctor', line: 'And remember: the best exercise is not the one with the best numbers. It is the one you are still doing next year.' },
        ],
        questions: [
          { id: 'L3-1', type: 'choice', prompt: 'What is the report mainly about?', options: ['How a small town managed too many tourists', 'Building a new airport', 'The history of a fishing village', 'Cheap holidays in the mountains'], answer: 'How a small town managed too many tourists', explain: 'Chủ đề chính là cách thị trấn nhỏ xử lý lượng khách quá đông.' },
          { id: 'L3-2', type: 'choice', prompt: 'How many visitors came to the town each year?', options: ['Three thousand', 'Eight thousand', 'Eighty thousand', 'Eight hundred thousand'], answer: 'Eight hundred thousand', explain: '“eight hundred thousand visitors a year”.' },
          { id: 'L3-3', type: 'choice', prompt: 'What was the first problem?', options: ['Tour buses in the town centre', 'A lack of hotels', 'Broken boats', 'Too many shops'], answer: 'Tour buses in the town centre', explain: 'Xe buýt du lịch đỗ ở quảng trường chính, dân không vào được cửa hàng của mình.' },
          { id: 'L3-4', type: 'choice', prompt: 'What finally made the council act?', options: ['Complaints from hotels', 'Two wells running dry', 'A new law from the government', 'Bad weather'], answer: 'Two wells running dry', explain: 'Hai giếng cạn nước trong cùng một năm là điều khiến hội đồng hành động.' },
          { id: 'L3-5', type: 'choice', prompt: 'Where do tour buses stop now?', options: ['In the main square', 'In a car park outside the town', 'At the old market', 'Next to the hotels'], answer: 'In a car park outside the town', explain: 'Xe buýt phải đỗ ở bãi ngoài thị trấn; khách đi bộ 8 phút hoặc đi xe điện nhỏ.' },
          { id: 'L3-6', type: 'choice', prompt: 'When is entry to the old town free?', options: ['All day at weekends', 'Before nine in the morning and after six in the evening', 'Only in winter', 'For residents of the town only'], answer: 'Before nine in the morning and after six in the evening', explain: 'Miễn phí sớm và muộn, thu 5 đô la giữa ngày.' },
          { id: 'L3-7', type: 'choice', prompt: 'Why does the town want visitors to stay two nights?', options: ['Day visitors cause traffic but spend the least', 'Hotels are empty in summer', 'The airport closes at night', 'The electric buses stop early'], answer: 'Day visitors cause traffic but spend the least', explain: 'Khách trong ngày gây kẹt xe nhưng chi tiêu ít nhất.' },
          { id: 'L3-8', type: 'choice', prompt: 'What are the results after two years?', options: ['Visitors fell by ten per cent but spending rose by a quarter', 'Visitors and spending both fell', 'Visitors doubled and spending fell', 'Nothing changed at all'], answer: 'Visitors fell by ten per cent but spending rose by a quarter', explain: 'Khách giảm ~10% nhưng tiền chi tiêu trong thị trấn tăng một phần tư.' },
          { id: 'L3-9', type: 'choice', prompt: 'Where did the number ten thousand steps come from?', options: ['A university study', 'An advertisement for a pedometer', 'A government health report', 'A running club'], answer: 'An advertisement for a pedometer', explain: 'Con số xuất phát từ quảng cáo máy đếm bước chân ở Nhật những năm 1960.' },
          { id: 'L3-10', type: 'choice', prompt: 'What did the study of sixteen thousand older women show?', options: ['Walking four thousand four hundred steps was linked to lower risk of illness', 'Only ten thousand steps helped', 'Walking had no effect at all', 'Walking fast was dangerous'], answer: 'Walking four thousand four hundred steps was linked to lower risk of illness', explain: 'Người đi khoảng 4.400 bước có nguy cơ bệnh nặng thấp hơn nhiều.' },
          { id: 'L3-11', type: 'choice', prompt: 'Which steps are the most valuable?', options: ['The last ones, from eight to ten thousand', 'The first ones, up to about three thousand', 'Steps taken in the morning only', 'Steps taken on stairs'], answer: 'The first ones, up to about three thousand', explain: 'Đi từ 2.000 lên 4.000 bước có lợi hơn nhiều so với từ 8.000 lên 10.000.' },
          { id: 'L3-12', type: 'choice', prompt: 'Which factor matters less than total walking time?', options: ['Walking speed', 'The shoes you wear', 'The time of day', 'The place you walk'], answer: 'Walking speed', explain: 'Tốc độ đi ít quan trọng hơn tổng thời gian đi.' },
          { id: 'L3-13', type: 'choice', prompt: 'How do three ten-minute walks compare with one thirty-minute walk?', options: ['They are less effective', 'They have the same effect', 'They are better for the heart', 'They only help young people'], answer: 'They have the same effect', explain: 'Ba lần đi 10 phút có hiệu quả như một lần 30 phút.' },
          { id: 'L3-14', type: 'choice', prompt: 'What does walking NOT replace?', options: ['Sleep', 'Muscle work twice a week', 'Drinking water', 'Breakfast'], answer: 'Muscle work twice a week', explain: 'Vận động cơ (mang vác, leo cầu thang, bài tập tại nhà) bảo vệ xương và giữ thăng bằng.' },
          { id: 'L3-15', type: 'choice', prompt: 'What is the speaker’s final message?', options: ['The best exercise is the one you keep doing', 'Ten thousand steps is the perfect target', 'Only the gym works', 'Exercise matters less than diet'], answer: 'The best exercise is the one you keep doing', explain: '“the one you are still doing next year”.' },
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
        instruction: 'Đọc 10 văn bản ngắn về du lịch và sức khoẻ, chọn đáp án đúng cho mỗi câu hỏi.',
        passages: [
          {
            id: 'R1-1',
            title: 'Thông tin chuyến bay',
            text: 'Passengers may take one piece of hand luggage of up to seven kilograms on board. Larger bags must be checked in at least forty minutes before departure. There is a charge of 200,000 dong for each bag weighing more than fifteen kilograms.',
            questions: [
              { id: 'R1-1q', type: 'choice', prompt: 'What happens if a bag weighs more than fifteen kilograms?', options: ['It cannot fly', 'The passenger pays 200,000 dong', 'It must be sent by post', 'It travels on the next flight'], answer: 'The passenger pays 200,000 dong', explain: 'Hành lý trên 15 kg bị thu phí 200.000 đồng.' },
            ],
          },
          {
            id: 'R1-2',
            title: 'Email',
            text: 'Hi Mai, Our train reaches Hue at 6.40 in the morning, which is too early for the hotel. I have asked them to keep our bags at reception, and we can have breakfast at the café opposite the station. Do not bring the big suitcase — the streets are narrow and we will walk a lot. See you at the station, Lan.',
            questions: [
              { id: 'R1-2q', type: 'choice', prompt: 'Why should Mai leave the big suitcase at home?', options: ['The train is full', 'The hotel has no lift', 'The streets are narrow and they will walk a lot', 'The suitcase is too old'], answer: 'The streets are narrow and they will walk a lot', explain: 'Phố nhỏ và phải đi bộ nhiều nên không nên mang vali lớn.' },
            ],
          },
          {
            id: 'R1-3',
            title: 'Quảng cáo khách sạn',
            text: 'Blue Beach Hotel — rooms from 900,000 dong a night, breakfast included. Free airport bus for stays of three nights or more. Bicycles and kayaks can be hired at the desk. The hotel is a two-minute walk from the beach and ten minutes from the night market.',
            questions: [
              { id: 'R1-3q', type: 'choice', prompt: 'What is free for guests who stay three nights or more?', options: ['Breakfast', 'The airport bus', 'Kayak hire', 'Bicycle hire'], answer: 'The airport bus', explain: 'Xe buýt sân bay miễn phí khi ở từ 3 đêm; bữa sáng đã bao gồm cho mọi khách.' },
            ],
          },
          {
            id: 'R1-4',
            title: 'Đánh giá chỗ ở',
            text: 'The guest house was clean and the family who runs it was kind, but there was no air conditioning and the road outside was noisy until midnight. If you are a light sleeper, ask for a room at the back, away from the street.',
            questions: [
              { id: 'R1-4q', type: 'choice', prompt: 'What advice is given to light sleepers?', options: ['Bring earplugs', 'Ask for a room at the back', 'Choose another guest house', 'Close the window at midnight'], answer: 'Ask for a room at the back', explain: 'Người khó ngủ nên xin phòng phía sau, tránh mặt đường.' },
            ],
          },
          {
            id: 'R1-5',
            title: 'Thời khoá biểu tour',
            text: 'City walking tour — 8.30 meet at the cathedral · 9.00 old market and food street · 10.30 river bank and boats · 11.15 the temple · 12.00 finish at the city museum. The tour costs 2 dollars and the museum ticket is not included.',
            questions: [
              { id: 'R1-5q', type: 'choice', prompt: 'Where does the tour finish?', options: ['At the cathedral', 'At the old market', 'At the temple', 'At the city museum'], answer: 'At the city museum', explain: 'Tour kết thúc lúc 12 giờ tại bảo tàng thành phố.' },
            ],
          },
          {
            id: 'R1-6',
            title: 'Hướng dẫn dùng thuốc',
            text: 'Pain relief tablets — adults: one or two tablets every four to six hours, always with food. Do not take more than eight tablets in twenty-four hours. If the pain continues for more than three days, stop taking the tablets and see a doctor.',
            questions: [
              { id: 'R1-6q', type: 'choice', prompt: 'What is the maximum number of tablets in twenty-four hours?', options: ['Four', 'Six', 'Eight', 'Ten'], answer: 'Eight', explain: '“Do not take more than eight tablets in twenty-four hours.”' },
            ],
          },
          {
            id: 'R1-7',
            title: 'Điều kiện bảo hiểm du lịch',
            text: 'This policy covers medical treatment and lost luggage. It does not cover accidents that happen while you are riding a motorbike without a licence, or any activity you begin after drinking alcohol. Keep every receipt: claims without receipts cannot be paid.',
            questions: [
              { id: 'R1-7q', type: 'choice', prompt: 'Which claim cannot be paid?', options: ['Treatment in a hospital', 'A claim without receipts', 'A lost suitcase', 'A broken camera'], answer: 'A claim without receipts', explain: 'Không có hoá đơn thì không được thanh toán.' },
            ],
          },
          {
            id: 'R1-8',
            title: 'Thư mời',
            text: 'Join our five-kilometre charity run on Sunday 6 October at 7 a.m. in the city park. Entry is 100,000 dong for adults and free for students, and all the money goes to the children’s hospital. There are water stations every kilometre, and a doctor is present all morning. Families with small children are welcome to walk the route.',
            questions: [
              { id: 'R1-8q', type: 'choice', prompt: 'What happens to the entry money?', options: ['It pays for the water stations', 'It goes to the children’s hospital', 'It is given to the winners', 'It pays the doctor'], answer: 'It goes to the children’s hospital', explain: 'Toàn bộ tiền lệ phí dành cho bệnh viện nhi.' },
            ],
          },
          {
            id: 'R1-9',
            title: 'Ghi chú từ phòng khám',
            text: 'Your blood test results are normal. Continue taking the iron tablets for one more month and come back only if you feel tired again. Please eat more green vegetables and red meat, and drink tea or coffee at least one hour after a meal, because they reduce the absorption of iron.',
            questions: [
              { id: 'R1-9q', type: 'choice', prompt: 'Why should tea and coffee be drunk an hour after a meal?', options: ['They taste better then', 'They reduce the absorption of iron', 'They help digestion', 'They contain iron'], answer: 'They reduce the absorption of iron', explain: 'Trà và cà phê làm giảm hấp thu sắt nên phải uống cách bữa ăn một giờ.' },
            ],
          },
          {
            id: 'R1-10',
            title: 'Bài đăng trên diễn đàn',
            text: 'I used to take the lift to the fifth floor every day. Three months ago I started using the stairs instead, and now I arrive at my desk awake and my knees no longer hurt in the evening. It takes fifty seconds longer — that is all.',
            questions: [
              { id: 'R1-10q', type: 'choice', prompt: 'What change did the writer make?', options: ['He began cycling to work', 'He began using the stairs', 'He moved to a lower floor', 'He changed his desk'], answer: 'He began using the stairs', explain: 'Tác giả chuyển từ thang máy sang đi thang bộ.' },
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
            title: 'One city, one week: the case for slow travel',
            text: `A few years ago I joined a ten-day tour of four countries. We visited eleven cities, took more than twenty photographs a day, and at the end I could not remember which cathedral was in which country. Since then I have travelled differently, and I have learned that one city for a week can teach you more than five capitals in five days.

The first change is simple: fewer places. When I stay in one city for a week, I shop in the same market three times, and the woman who sells fruit begins to recognise me. I learn that the market is closed on Monday, that the bread arrives at seven, and that the best time to buy fish is Friday afternoon. None of this information appears in a guidebook, and that is exactly why it stays in my memory.

The second change is the speed of the day. On a fast tour, breakfast is at seven and the bus leaves at eight, so no conversation lasts longer than ten minutes. In a slow week, I often sit in the same square for an hour with a coffee. Sitting still feels like doing nothing, but it is usually when something interesting happens: a wedding, a school class on a trip, a small argument about a parking space.

There is also a practical advantage: slow travel is cheaper. A weekly room costs less per night than four single nights, train tickets bought a month early cost half the price, and eating where local people eat is a fraction of the price of restaurants near the main square.

Of course, not everybody can travel this way. If you have two weeks of holiday a year and a long list of dreams, visiting four countries may be the right choice for you. The point is not to travel slowly on principle, but to choose the speed on purpose: to know, before you go, whether you want to see many places or to understand one.

I still take photographs. But now I take about ten a day, and when I look at them I can tell you where each one was taken and what happened five minutes later.`,
            glossary: [
              { word: 'cathedral', meaning: 'nhà thờ lớn' },
              { word: 'guidebook', meaning: 'sách hướng dẫn du lịch' },
              { word: 'a fraction of', meaning: 'một phần nhỏ của' },
              { word: 'on purpose', meaning: 'có chủ đích' },
              { word: 'capital', meaning: 'thủ đô' },
            ],
            questions: [
              { id: 'R2-1q1', type: 'choice', prompt: 'Why could the writer not remember the ten-day tour?', options: ['He lost his notes', 'Too many places were visited in a short time', 'The weather was bad', 'He travelled alone'], answer: 'Too many places were visited in a short time', explain: 'Đi 11 thành phố trong 10 ngày nên cuối cùng không nhớ nổi chỗ nào.' },
              { id: 'R2-1q2', type: 'choice', prompt: 'What is the writer’s main argument?', options: ['Travel is a waste of money', 'Staying longer in one place teaches you more', 'Photographs are not useful', 'Tours should be forbidden'], answer: 'Staying longer in one place teaches you more', explain: 'Ở một thành phố một tuần dạy được nhiều hơn 5 thủ đô trong 5 ngày.' },
              { id: 'R2-1q3', type: 'choice', prompt: 'Why does the writer go to the same market three times?', options: ['The food is cheaper there', 'To learn the details of daily life there', 'Because shops are closed elsewhere', 'To practise the language'], answer: 'To learn the details of daily life there', explain: 'Đi lại nhiều lần để biết những chi tiết nhỏ của đời sống địa phương.' },
              { id: 'R2-1q4', type: 'choice', prompt: 'What does the writer say about guidebooks?', options: ['They are too expensive', 'They do not contain the small details of daily life', 'They are written for local people', 'They are better than maps'], answer: 'They do not contain the small details of daily life', explain: 'Những chi tiết như chợ đóng cửa thứ Hai không có trong sách hướng dẫn.' },
              { id: 'R2-1q5', type: 'choice', prompt: 'What happens when the writer sits in a square for an hour?', options: ['He gets bored quickly', 'He notices interesting small events', 'He meets other tourists', 'He plans the next city'], answer: 'He notices interesting small events', explain: 'Ngồi yên là lúc thấy những việc thú vị: đám cưới, lớp học đi tham quan…' },
              { id: 'R2-1q6', type: 'choice', prompt: 'Why is slow travel cheaper, according to the writer?', options: ['Hotels are free for a week', 'Weekly rooms and early train tickets cost less', 'Food is always free in markets', 'Museums are cheaper for slow travellers'], answer: 'Weekly rooms and early train tickets cost less', explain: 'Thuê theo tuần rẻ hơn theo đêm và vé tàu mua sớm giảm một nửa.' },
              { id: 'R2-1q7', type: 'choice', prompt: 'What is the writer’s view of fast tours?', options: ['They are always a mistake', 'They may be right for people with little holiday time', 'They are only for young people', 'They are cheaper than slow travel'], answer: 'They may be right for people with little holiday time', explain: 'Nếu chỉ có hai tuần nghỉ và nhiều ước mơ, đi 4 nước có thể hợp lý.' },
              { id: 'R2-1q8', type: 'choice', prompt: 'What does choosing the speed “on purpose” mean?', options: ['Booking everything in advance', 'Deciding before you go what kind of trip you want', 'Travelling without a plan', 'Following the guidebook exactly'], answer: 'Deciding before you go what kind of trip you want', explain: 'Biết trước mình muốn thấy nhiều nơi hay hiểu một nơi.' },
              { id: 'R2-1q9', type: 'fill', prompt: 'A weekly room costs less per ___ than four single nights. (one word)', answers: ['night'], explain: '“A weekly room costs less per night than four single nights.”' },
              { id: 'R2-1q10', type: 'fill', prompt: 'The writer now takes about ___ photographs a day. (write the number word)', answers: ['ten', '10'], explain: '“now I take about ten a day”.' },
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
            title: 'Sleep is not a luxury',
            text: `Every year, students tell the same story before examinations. They sleep five hours for a week, drink coffee to stay awake, and promise themselves a long sleep at the weekend. It is a plan that usually fails, and the reason is not laziness but biology.

During the night the brain does not simply rest. It stores what you learned during the day, moving information from short-term to long-term memory. This work happens mostly in deep sleep, and a good part of it happens in the last two hours of the night. A student who studies until one in the morning and gets up at six loses exactly the period that protects the new vocabulary and the grammar practised the day before.

Sleep also affects attention. After a night of five hours, reaction times become similar to those of a person who has drunk two glasses of wine. The student may feel awake, but they make more mistakes, especially with long tasks — exactly the tasks in a reading test.

There is a second problem with the coffee method. Caffeine stays in the body for about five hours, so a cup at four in the afternoon is still working at nine in the evening. Many students say they cannot fall asleep; what they usually mean is that they cannot fall asleep at eleven, when they wanted to. Their bodies are ready at one in the morning, and the next day repeats itself.

What helps, according to sleep clinics, is not one big change but a firm routine: a fixed waking time, even at the weekend; a dark, cool room; and no screens in the thirty minutes before bed. If you must study late, choose an active task such as writing answers, and leave reading — which makes the eyes heavy — for the morning.

Finally, a word about the weekend. Sleeping until midday on Saturday does not repair five short nights: the body clock moves, and Sunday night becomes difficult again. A better plan is to sleep one hour longer than usual, and to take a short nap of about twenty minutes in the afternoon if the day is long.`,
            glossary: [
              { word: 'short-term / long-term memory', meaning: 'trí nhớ ngắn hạn / dài hạn' },
              { word: 'reaction time', meaning: 'thời gian phản ứng' },
              { word: 'caffeine', meaning: 'chất cà phê in' },
              { word: 'routine', meaning: 'nếp sinh hoạt đều đặn' },
              { word: 'nap', meaning: 'giấc ngủ ngắn' },
            ],
            questions: [
              { id: 'R3-1q1', type: 'choice', prompt: 'What is the writer’s main point?', options: ['Coffee is bad for students', 'Sleep is necessary for learning and attention', 'Exams should be shorter', 'Students should study in the morning'], answer: 'Sleep is necessary for learning and attention', explain: 'Ý chính: ngủ đủ cần thiết cho việc học và sự tập trung.' },
              { id: 'R3-1q2', type: 'choice', prompt: 'What happens in deep sleep?', options: ['The brain rests completely', 'Information is moved into long-term memory', 'The body produces caffeine', 'The eyes stop moving'], answer: 'Information is moved into long-term memory', explain: 'Não chuyển thông tin từ trí nhớ ngắn hạn sang dài hạn.' },
              { id: 'R3-1q3', type: 'choice', prompt: 'Why are the last two hours of the night important?', options: ['Much of the memory work happens then', 'The room is quietest then', 'The body is coldest then', 'Dreams are longest then'], answer: 'Much of the memory work happens then', explain: 'Phần lớn công việc ghi nhớ diễn ra ở hai giờ cuối của giấc ngủ.' },
              { id: 'R3-1q4', type: 'choice', prompt: 'What does a student who sleeps from one to six lose?', options: ['The period that protects new learning', 'The chance to revise', 'Only some hours of rest', 'Nothing important'], answer: 'The period that protects new learning', explain: 'Họ mất đúng khoảng thời gian giúp ghi nhớ từ vựng và ngữ pháp mới học.' },
              { id: 'R3-1q5', type: 'choice', prompt: 'How does five hours of sleep affect a person?', options: ['They feel sleepy immediately', 'Reaction times are like those of someone who drank wine', 'They become angry', 'They cannot speak clearly'], answer: 'Reaction times are like those of someone who drank wine', explain: 'Thời gian phản ứng giống như đã uống hai ly rượu.' },
              { id: 'R3-1q6', type: 'choice', prompt: 'Which tasks do tired students do worst?', options: ['Short tasks', 'Long tasks', 'Speaking tasks', 'Tasks done in groups'], answer: 'Long tasks', explain: 'Đặc biệt là các nhiệm vụ dài — giống bài đọc trong đề thi.' },
              { id: 'R3-1q7', type: 'choice', prompt: 'Why does a cup of coffee at four in the afternoon cause a problem?', options: ['It is still in the body at nine in the evening', 'It makes you thirsty at night', 'It stops you eating dinner', 'It wakes you up at four in the morning'], answer: 'It is still in the body at nine in the evening', explain: 'Cà phê lưu trong cơ thể khoảng 5 giờ.' },
              { id: 'R3-1q8', type: 'choice', prompt: 'What does the writer say actually helps?', options: ['One big change at the weekend', 'A firm daily routine', 'Sleeping tablets', 'Studying in bed'], answer: 'A firm daily routine', explain: 'Giờ thức cố định, phòng tối và mát, không dùng màn hình trước khi ngủ.' },
              { id: 'R3-1q9', type: 'fill', prompt: 'A short afternoon nap should last about ___ minutes. (write the number word)', answers: ['twenty', '20'], explain: '“a short nap of about twenty minutes in the afternoon”.' },
              { id: 'R3-1q10', type: 'choice', prompt: 'What does the writer think about sleeping until midday on Saturday?', options: ['It repairs the whole week', 'It does not repair the short nights and makes Sunday harder', 'It should last longer', 'It is the best solution for students'], answer: 'It does not repair the short nights and makes Sunday harder', explain: 'Ngủ nướng cuối tuần làm lệch đồng hồ sinh học, tối Chủ nhật lại khó ngủ.' },
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
            title: 'How to stay well while travelling',
            text: `Travelling is good for you, but it is also the time (1)___ people sleep badly, eat too quickly and forget to drink water. A few simple habits (2)___ prevent most of the common problems.

First, before you leave, check (3)___ you need any injections or tablets. Some countries require a certificate; others simply advise medicine for malaria. Take enough of any regular medicine (4)___ your trip, in your hand luggage, not in the suitcase that goes into the hold. In a hot country, drink water before you feel (5)___, and remember that tea and coffee do not replace it.

Food is the second point. Street food is not dangerous (6)___ itself; badly washed plates and food left in the sun are. Choose stalls (7)___ are busy, because food there does not sit for hours. Peel fruit and (8)___ ice in drinks if you are not sure about the water.

Finally, do not fill every hour (9)___ activities. Jet lag makes the first two days harder, so plan a light start: walk around the neighbourhood, find out where the nearest pharmacy is, and go to bed at the local time. Your body will follow your habits faster (10)___ any pill.`,
            glossary: [
              { word: 'injection', meaning: 'mũi tiêm' },
              { word: 'malaria', meaning: 'bệnh sốt rét' },
              { word: 'jet lag', meaning: 'mệt mỏi do lệch múi giờ' },
              { word: 'pharmacy', meaning: 'hiệu thuốc' },
            ],
            questions: [
              { id: 'R4-1q1', type: 'choice', prompt: 'Chỗ (1)', options: ['when', 'which', 'who', 'whose'], answer: 'when', explain: 'Mệnh đề quan hệ chỉ thời gian: “the time when people sleep badly”.' },
              { id: 'R4-1q2', type: 'choice', prompt: 'Chỗ (2)', options: ['can', 'is', 'has', 'does'], answer: 'can', explain: '“A few simple habits can prevent most of the common problems.”' },
              { id: 'R4-1q3', type: 'choice', prompt: 'Chỗ (3)', options: ['whether', 'what', 'who', 'whose'], answer: 'whether', explain: 'Sau “check” dùng “whether” cho câu hỏi gián tiếp có/không.' },
              { id: 'R4-1q4', type: 'choice', prompt: 'Chỗ (4)', options: ['for', 'of', 'at', 'since'], answer: 'for', explain: '“enough medicine for your trip” — thuốc đủ dùng cho chuyến đi.' },
              { id: 'R4-1q5', type: 'choice', prompt: 'Chỗ (5)', options: ['thirsty', 'hungry', 'sleepy', 'angry'], answer: 'thirsty', explain: 'Uống nước trước khi thấy khát.' },
              { id: 'R4-1q6', type: 'choice', prompt: 'Chỗ (6)', options: ['in', 'by', 'for', 'on'], answer: 'in', explain: 'Cụm “in itself” = tự bản thân nó.' },
              { id: 'R4-1q7', type: 'choice', prompt: 'Chỗ (7)', options: ['that', 'who', 'where', 'what'], answer: 'that', explain: 'Mệnh đề quan hệ thay cho “stalls” (vật).' },
              { id: 'R4-1q8', type: 'choice', prompt: 'Chỗ (8)', options: ['avoid', 'avoiding', 'to avoid', 'avoids'], answer: 'avoid', explain: 'Song song với “Peel fruit” → dùng động từ nguyên thể: avoid.' },
              { id: 'R4-1q9', type: 'choice', prompt: 'Chỗ (9)', options: ['with', 'of', 'by', 'to'], answer: 'with', explain: '“fill every hour with activities”.' },
              { id: 'R4-1q10', type: 'choice', prompt: 'Chỗ (10)', options: ['than', 'then', 'as', 'of'], answer: 'than', explain: 'So sánh hơn: “faster than any pill”.' },
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
        title: 'Task 1 · Email hỏi thông tin khách sạn',
        prompt: 'You and a friend will travel to Da Nang for four nights in August. Write an email (about 120 words) to the Blue Beach Hotel. In your email: ask about the price of a double room for four nights, ask whether the hotel has a swimming pool or a gym, explain that you would like a quiet room, and say what time you will arrive.',
        minWords: 120,
        checklist: [
          { label: 'Có lời chào và lời kết phù hợp', hint: 'Dear Sir or Madam, … / Yours faithfully, / Best regards,' },
          { label: 'Nêu rõ mục đích email (hỏi thông tin và đặt phòng)', hint: 'I am writing to ask about…' },
          { label: 'Hỏi giá phòng đôi cho 4 đêm', hint: 'How much does a double room cost for four nights?' },
          { label: 'Hỏi về bể bơi hoặc phòng tập', hint: 'Could you tell me whether the hotel has…?' },
          { label: 'Đề nghị phòng yên tĩnh kèm lý do', hint: 'We would prefer a quiet room at the back, because…' },
          { label: 'Nêu rõ giờ đến', hint: 'Our flight arrives at… so we will reach the hotel at about…' },
          { label: 'Đủ số từ (~120), giọng lịch sự', hint: 'Dùng could / would / I would be grateful if…' },
        ],
        tips: [
          'Email hỏi thông tin nên có 3–4 câu hỏi rõ ràng, mỗi câu hỏi một dòng.',
          'Đừng quên phần nêu giờ đến — đây là một ý bắt buộc của đề.',
          'Kết thúc bằng lời cảm ơn và đề nghị được hồi âm sớm.',
        ],
        model: `Dear Sir or Madam,

I am writing to ask about a room at your hotel. My friend and I would like to stay with you for four nights in August, from the twelfth to the sixteenth.

Could you tell me how much a double room costs for four nights, and whether breakfast is included in the price? I would also like to know if the hotel has a swimming pool or a small gym, because we would like to keep doing some exercise during our holiday.

We would prefer a quiet room at the back of the hotel, as we are both light sleepers. Our flight arrives at three in the afternoon, so we will reach the hotel at about five o’clock.

I would be grateful if you could confirm that you have a room free. Thank you very much for your help.

Best regards,
Minh`,
      },
      {
        id: 'W2',
        task: 2,
        title: 'Task 2 · Luận: tập thể dục hay ăn uống lành mạnh?',
        prompt: 'Some people say that the best way to stay healthy is to take regular exercise, while others believe that a good diet is more important. Write an essay (about 250 words) discussing both views and giving your own opinion. Use reasons and examples to support your answer.',
        minWords: 250,
        checklist: [
          { label: 'Mở bài giới thiệu chủ đề và hướng làm bài', hint: 'People often ask whether exercise or diet matters more…' },
          { label: 'Đoạn nêu lợi ích của tập thể dục', hint: 'On the one hand, regular exercise…' },
          { label: 'Đoạn nêu lợi ích của chế độ ăn lành mạnh', hint: 'On the other hand, what we eat…' },
          { label: 'Nêu ý kiến cá nhân rõ ràng', hint: 'In my opinion, the two cannot be separated…' },
          { label: 'Có ít nhất 2 ví dụ hoặc trải nghiệm cụ thể', hint: 'For example, a friend of mine lost weight by…' },
          { label: 'Dùng từ nối giữa các đoạn', hint: 'however, moreover, in addition, in conclusion' },
          { label: 'Kết luận tóm tắt, không nêu ý mới', hint: 'In conclusion, …' },
          { label: 'Đủ số từ (~250)', hint: 'Kiểm tra số từ ở khung soạn thảo' },
        ],
        tips: [
          'Với chủ đề sức khoẻ, dùng từ vựng: balanced diet, physical activity, heart disease, energy level.',
          'Đưa ví dụ cụ thể (đi bộ 30 phút, bỏ nước ngọt) sẽ thuyết phục hơn lời khuyên chung.',
          'Nêu ý kiến ở đoạn gần cuối, và nhớ kết luận không thêm ý mới.',
        ],
        model: `People who want to live longer often ask a simple question: is exercise or diet more important? Both sides have strong arguments, and it seems to me that the two cannot really be separated.

On the one hand, regular exercise changes the body in ways that food cannot. A person who walks quickly for thirty minutes a day strengthens the heart and the muscles and usually sleeps better. Exercise also improves the mood, which is why many people say that a short walk after work is the best way to forget a difficult day. In addition, muscle work protects older people from falls, and this has nothing to do with what they eat.

On the other hand, a good diet is the base of health. Someone who exercises every evening but drinks two sweet drinks a day and eats fast food four times a week will still put on weight. Moreover, food affects the body all day long: a balanced breakfast gives energy for the morning, while a heavy lunch makes the afternoon useless. Fruit, vegetables and enough water are simple, cheap and available to almost everyone.

In my opinion, the question is a little like asking whether a car needs petrol or oil: it needs both, and in the right amounts. A friend of mine lost eight kilograms in six months not by running, but by walking to work and cooking at home instead of ordering food. That single change combined the two ideas.

In conclusion, exercise and diet support each other rather than compete. Regular movement keeps the body strong, and sensible eating keeps its weight and energy stable. A person who builds both habits will stay healthier than someone who chooses only one.`,
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
        instruction: 'Bạn sẽ nghe 3 câu hỏi về du lịch và sức khoẻ. Trả lời mỗi câu 1–2 phút, nói tự nhiên như đang trò chuyện.',
        minutes: 3,
        questions: [
          { q: 'Where did you go on your last trip, and what did you enjoy most?', sample: 'Last summer I went to Da Nang with two friends for five days. The thing I enjoyed most was not the beach but the food: every evening we walked along the river and tried a different small restaurant. One evening an old woman showed us how to wrap fish in rice paper, and we spent nearly an hour talking with her. That simple moment is what I remember, not the photographs.' },
          { q: 'What do you do to stay healthy?', sample: 'I try to keep three simple habits. First, I walk for about thirty minutes every evening, usually along a small lake near my house, because it is easier to keep a habit when the place is pleasant. Second, I go to bed before eleven on school nights. Third, I drink water instead of sweet drinks. I am not very strict about food, but these three things are now automatic.' },
          { q: 'Which is a better holiday for you: the beach or the mountains? Why?', sample: 'For a short holiday I prefer the beach, but not for sunbathing. I like walking on the sand early in the morning, swimming before breakfast and reading in the afternoon. After four days, though, I start to feel bored, so the mountains are better for a longer trip: the air is cool, the walking is more interesting, and there is usually more to see. It depends on how many days I have.' },
        ],
      },
      {
        id: 'S2',
        kind: 'solution',
        title: 'Part 2 · Thảo luận giải pháp',
        instruction: 'Bạn và một người bạn đang bàn cách giúp em họ của bạn ấy sống khoẻ hơn. Hãy thảo luận ưu điểm, nhược điểm của 3 lựa chọn rồi chọn một phương án và giải thích.',
        minutes: 4,
        situation: 'Your friend’s cousin is nineteen, studies and works part-time, and often feels tired. He says he has no time and very little money for sport. Three options are suggested.',
        options: [
          'Join a gym near his house',
          'Walk for thirty minutes every day',
          'Change his diet: cook at home and stop buying fast food',
        ],
        sample: `Let us look at the three options. A gym near his house has one clear advantage: when you pay for something, you feel that you must use it. There are also machines and an instructor to show him what to do. However, gyms cost money every month, and a tired student who finishes work at nine in the evening will not go to the gym at ten.

Walking thirty minutes every day is almost free and can be fitted into the day: he can leave the bus one stop earlier, walk to the shop instead of ordering online, or walk around the park before dinner. The weak point is motivation — with no payment and no fixed time, it is easy to say, “I will walk tomorrow.”

Changing his diet is the option that touches the real cause. Cooking at home is cheaper than fast food, and it also removes the sweet drinks that make him sleepy in the afternoon. The problem is that it needs a kitchen, some cooking skills and time for shopping, and he says he has none of these.

If I have to choose, I would combine walking and cooking at home, and start with the cheapest part: a fixed twenty-minute walk before dinner every day. When he feels better after two weeks, he will be ready to change his meals. Physical activity and healthy food support each other, and neither of them requires a monthly fee.`,
      },
      {
        id: 'S3',
        kind: 'topic',
        title: 'Part 3 · Phát triển chủ đề',
        instruction: 'Trình bày quan điểm của bạn về chủ đề dưới đây (khoảng 3 phút), dựa vào 3 gợi ý. Sau đó trả lời 2 câu hỏi mở rộng.',
        minutes: 5,
        topic: 'Tourism brings money to a small town, but it also brings problems.',
        outline: [
          'Lợi ích kinh tế mà du lịch mang lại cho thị trấn nhỏ',
          'Những vấn đề du lịch gây ra (giao thông, nước, tiếng ồn, giá cả)',
          'Giải pháp nên làm và quan điểm của bạn',
        ],
        questions: [
          { q: 'Should visitors pay a fee to enter a historic town?', sample: 'I think a small fee can be fair if the money has a clear purpose. In a town where the streets are cleaned and the old buildings are repaired for visitors, it is reasonable that visitors pay part of the cost. The important word is “small”: five dollars for the old town, free early in the morning and in the evening, respects people who live and work there. A fee is not a solution by itself, but it is a fair way to share the cost.' },
          { q: 'How can local people be involved in tourism?', sample: 'Local people should be the main beneficiaries, not the spectators. Three practical ways: families can rent one or two rooms instead of selling their houses to hotel companies; food tours can be run by local cooks rather than outside companies; and shops can sell products made in the area. When residents earn money from visitors, they protect the places that visitors come to see, because those places have become part of their income and their pride.' },
        ],
      },
    ],
  },
};
