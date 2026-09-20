/**
 * Đề VSTEP B2 số 3 — chủ đề kinh tế & tiêu dùng (nội dung gốc, viết theo đúng format đề thi).
 * Xem `docs/vstep-schema.md` để biết ý nghĩa từng field.
 */
export default {
  id: 'b2-03',
  level: 'B2',
  title: 'Đề B2 số 3 · Kinh tế & tiêu dùng',
  tags: ['kinh tế', 'tiêu dùng', 'B2'],

  listening: {
    minutes: 40,
    parts: [
      {
        id: 'L1',
        title: 'Part 1 · Thông báo ngắn',
        instruction: 'Bạn sẽ nghe 8 thông báo ngắn. Mỗi thông báo có một câu hỏi. Chọn đáp án đúng nhất.',
        transcript: [
          { speaker: 'Narrator', line: 'Customer notice one. Thank you for shopping at Hartley’s. From today, members of our loyalty scheme collect two points for every ten dollars spent, instead of one. Points can pay for up to half of any purchase, but they cannot be exchanged for cash and they expire after eighteen months.' },
          { speaker: 'Narrator', line: 'Announcement two. This is an automated message from Northbank. Your card ending four four seven one was used for a payment of eighty-nine dollars in a different city this morning. If you do not recognise this payment, press one to speak to our fraud team. Never reply to a text message that asks for your password.' },
          { speaker: 'Narrator', line: 'Delivery update three. Your parcel left our depot this morning and will arrive between two and five this afternoon. If nobody is at home, the driver will leave the parcel with a neighbour and put a card through your door. Please keep that card, because it carries the collection code.' },
          { speaker: 'Narrator', line: 'Announcement four. Attention, passengers travelling with Skyline Air. The free baggage allowance on economy fares is now one bag of twenty kilogrammes. A second bag costs forty dollars if you pay online before departure, or sixty dollars at the airport counter. Sports equipment must be booked separately.' },
          { speaker: 'Narrator', line: 'Announcement five. Kingsway supermarket now offers self-checkout between six in the morning and ten at night. Customers with more than twenty items are asked to use a staffed till, because the bagging area is small. A member of staff will help with age-restricted products.' },
          { speaker: 'Narrator', line: 'Announcement six. The free seminar “Saving for the first time” will take place in the community hall on Thursday at seven in the evening. Places are limited to forty and registration closes on Tuesday. Please bring a pen; no financial products will be sold at the event.' },
          { speaker: 'Narrator', line: 'Announcement seven. Thank you for calling Rowan Electronics. Items bought in a shop can be returned within thirty days if you bring the receipt, while items bought online can be returned within forty-five days. Opened software and earphones cannot be returned for hygiene reasons unless they are faulty.' },
          { speaker: 'Narrator', line: 'Announcement eight. The Riverside farmers’ market will run every Saturday from eight until one in the car park behind the station. Traders accept cards this year, and customers who bring their own bags receive a five per cent discount. Parking is free for the first hour.' },
        ],
        questions: [
          { id: 'L1-1', type: 'choice', prompt: 'What has changed for loyalty members?', options: ['They collect points twice as fast', 'They must pay a joining fee', 'They receive cash instead of points', 'They get free home delivery'], answer: 'They collect points twice as fast', explain: 'Hai điểm cho mỗi 10 đô la thay vì một điểm → tích điểm nhanh gấp đôi.' },
          { id: 'L1-2', type: 'choice', prompt: 'What should the customer do if the payment is unfamiliar?', options: ['Reply to the text message', 'Press one to speak to the fraud team', 'Visit a branch tomorrow', 'Send the password by email'], answer: 'Press one to speak to the fraud team', explain: '“press one to speak to our fraud team”, và tuyệt đối không trả lời tin nhắn xin mật khẩu.' },
          { id: 'L1-3', type: 'choice', prompt: 'What will happen if nobody is at home?', options: ['The parcel goes back to the depot', 'It is left with a neighbour', 'It arrives the next morning', 'It is returned to the shop'], answer: 'It is left with a neighbour', explain: 'Tài xế để hàng cho hàng xóm và bỏ thẻ ghi mã nhận hàng qua cửa.' },
          { id: 'L1-4', type: 'choice', prompt: 'How can a passenger pay less for a second bag?', options: ['By paying online before departure', 'By checking in early', 'By joining a loyalty scheme', 'By carrying it on board'], answer: 'By paying online before departure', explain: 'Trả online trước chuyến bay: 40 đô la, ở quầy sân bay: 60 đô la.' },
          { id: 'L1-5', type: 'choice', prompt: 'Who is asked to use a staffed till?', options: ['Customers with more than twenty items', 'Customers with loyalty cards', 'Customers buying alcohol', 'Customers under twenty years old'], answer: 'Customers with more than twenty items', explain: 'Khách có hơn 20 món được đề nghị dùng quầy có nhân viên.' },
          { id: 'L1-6', type: 'choice', prompt: 'What does the speaker say about the seminar?', options: ['It costs a small fee', 'No products will be sold there', 'It takes place on Tuesday', 'It is only for bank members'], answer: 'No products will be sold there', explain: '“no financial products will be sold at the event”.' },
          { id: 'L1-7', type: 'choice', prompt: 'Which items cannot be returned unless they are faulty?', options: ['Items bought online', 'Opened earphones', 'Unopened software', 'Items paid for by card'], answer: 'Opened earphones', explain: 'Tai nghe đã mở và phần mềm đã mở không được đổi vì lý do vệ sinh, trừ khi bị lỗi.' },
          { id: 'L1-8', type: 'choice', prompt: 'What earns a discount at the farmers’ market?', options: ['Arriving before eight', 'Paying in cash', 'Bringing your own bags', 'Parking for over an hour'], answer: 'Bringing your own bags', explain: 'Khách mang túi riêng được giảm 5%.' },
        ],
      },
      {
        id: 'L2',
        title: 'Part 2 · Hội thoại',
        instruction: 'Bạn sẽ nghe 2 đoạn hội thoại. Mỗi đoạn có 6 câu hỏi.',
        transcript: [
          { speaker: 'Assistant', line: 'Good afternoon, welcome to TechPoint. How can I help you today?' },
          { speaker: 'Lan', line: 'Hello. I bought this laptop here five weeks ago and the screen has started flickering. It happens about ten minutes after I switch it on.' },
          { speaker: 'Assistant', line: 'Do you have the receipt with you?' },
          { speaker: 'Lan', line: 'I have the email confirmation and the order number, but not the paper receipt. I paid by card.' },
          { speaker: 'Assistant', line: 'That is fine, we can trace the purchase through the card. Our policy is a free repair within the first year, and if the same fault appears twice you can ask for a replacement machine.' },
          { speaker: 'Lan', line: 'Honestly, I would rather have a replacement now. I use this laptop for an online course and I cannot wait two weeks without a computer.' },
          { speaker: 'Assistant', line: 'I understand. I can lend you a laptop while yours is being repaired. Would that help?' },
          { speaker: 'Lan', line: 'That would be much better, yes. How long does the repair usually take?' },
          { speaker: 'Assistant', line: 'Seven to ten working days. If it takes longer than fourteen days, we must give you a written option to exchange the machine for a new one of the same model.' },
          { speaker: 'Lan', line: 'Could you put that in writing for me?' },
          { speaker: 'Assistant', line: 'Certainly. I will print a service form with the dates and the model number. Please keep it safe, because you will need the reference number when you collect the laptop.' },
          { speaker: 'Lan', line: 'And is there any charge?' },
          { speaker: 'Assistant', line: 'No. The repair and the loan machine are free, but if the damage was caused by liquid or by a fall, there is a charge of about eighty dollars. Let me examine the machine first.' },
          { speaker: 'Narrator', line: 'Now listen to a conversation between two friends about money.' },
          { speaker: 'Mai', line: 'Peter, you look tired. Did you stay up late again?' },
          { speaker: 'Peter', line: 'No, I was calculating my spending. I earned twelve million dong last month and somehow I saved nothing at all.' },
          { speaker: 'Mai', line: 'Let me guess: rent, food, phone… and how much did you spend on deliveries?' },
          { speaker: 'Peter', line: 'Deliveries were the problem. I ordered lunch at work almost every day, about sixty thousand dong each time.' },
          { speaker: 'Mai', line: 'That is more than a million a month. My flatmate cooks on Sunday for the whole week. She says it takes two hours and saves her at least two million.' },
          { speaker: 'Peter', line: 'I tried that once. The food was fine on Monday and terrible by Thursday.' },
          { speaker: 'Mai', line: 'Then freeze half of it on Sunday evening. What about transport?' },
          { speaker: 'Peter', line: 'I take a taxi when it rains, which is most weeks in the rainy season.' },
          { speaker: 'Mai', line: 'A monthly bus pass is far cheaper, and the bus lane means the bus is often faster than a taxi in the morning.' },
          { speaker: 'Peter', line: 'I did not know that. My last taxi took fifty minutes to travel six kilometres.' },
          { speaker: 'Mai', line: 'The other thing is your phone contract. You pay for forty gigabytes but you told me you use about eight.' },
          { speaker: 'Peter', line: 'That is true. I will change to a smaller plan this week.' },
          { speaker: 'Mai', line: 'Start with one change only. If you change five things at once you will give up in ten days.' },
          { speaker: 'Peter', line: 'Good advice. I will begin with the phone plan, since that takes one phone call, and then try cooking on Sundays.' },
        ],
        questions: [
          { id: 'L2-1', type: 'choice', prompt: 'What is wrong with the laptop?', options: ['It will not switch on', 'The screen flickers', 'The battery is loose', 'The keyboard is damaged'], answer: 'The screen flickers', explain: 'Màn hình nhấp nháy khoảng 10 phút sau khi bật máy.' },
          { id: 'L2-2', type: 'choice', prompt: 'What does Lan use to prove her purchase?', options: ['The paper receipt', 'The email confirmation', 'The original box', 'The warranty card'], answer: 'The email confirmation', explain: 'Cô có email xác nhận và mã đơn hàng, trả bằng thẻ.' },
          { id: 'L2-3', type: 'choice', prompt: 'What can Lan ask for if the same fault appears twice?', options: ['A cash refund', 'A replacement machine', 'A free upgrade', 'An extended warranty'], answer: 'A replacement machine', explain: 'Lỗi xuất hiện hai lần thì được yêu cầu đổi máy mới.' },
          { id: 'L2-4', type: 'choice', prompt: 'What does the assistant offer during the repair?', options: ['A loan laptop', 'A discount on accessories', 'A free training session', 'Extra memory'], answer: 'A loan laptop', explain: 'Cửa hàng cho mượn laptop trong thời gian sửa.' },
          { id: 'L2-5', type: 'fill', prompt: 'A repair normally takes between seven and ___ working days. (write the number)', answers: ['10', 'ten'], explain: '“Seven to ten working days.”' },
          { id: 'L2-6', type: 'choice', prompt: 'What will the assistant print for Lan?', options: ['A new receipt', 'A service form with dates and model number', 'A bank statement', 'A discount voucher'], answer: 'A service form with dates and model number', explain: 'Biên bản dịch vụ ghi ngày và mã máy, kèm số tham chiếu.' },
          { id: 'L2-7', type: 'choice', prompt: 'Why is Peter tired?', options: ['He worked late', 'He was calculating his spending', 'He travelled overnight', 'He has been ill'], answer: 'He was calculating his spending', explain: 'Anh thức để tính lại chi tiêu của mình.' },
          { id: 'L2-8', type: 'choice', prompt: 'What cost Peter the most on working days?', options: ['Coffee', 'Taxi fares', 'Lunch deliveries', 'Phone data'], answer: 'Lunch deliveries', explain: 'Gần như ngày nào cũng đặt cơm trưa, hơn một triệu mỗi tháng.' },
          { id: 'L2-9', type: 'choice', prompt: 'What does Mai’s flatmate do to save money?', options: ['She cooks once a week', 'She shares taxis', 'She buys in bulk online', 'She works from home'], answer: 'She cooks once a week', explain: 'Nấu vào Chủ nhật cho cả tuần, tiết kiệm ít nhất hai triệu.' },
          { id: 'L2-10', type: 'choice', prompt: 'What does Mai suggest about the cooked food?', options: ['Eat it more quickly', 'Freeze half of it', 'Give it to a neighbour', 'Cook smaller portions'], answer: 'Freeze half of it', explain: 'Mai gợi ý trữ đông một nửa vào tối Chủ nhật.' },
          { id: 'L2-11', type: 'choice', prompt: 'Why is the bus often faster than a taxi in the morning?', options: ['It takes a shorter route', 'It uses a bus lane', 'It leaves earlier', 'It stops less often'], answer: 'It uses a bus lane', explain: 'Làn đường riêng cho xe buýt giúp đi nhanh hơn taxi giờ cao điểm.' },
          { id: 'L2-12', type: 'choice', prompt: 'What is Mai’s advice about changing habits?', options: ['Change several things at once', 'Start with one change only', 'Wait for a better salary', 'Borrow money first'], answer: 'Start with one change only', explain: 'Đổi một thứ mỗi lần, nếu đổi năm thứ cùng lúc sẽ bỏ sau mười ngày.' },
        ],
      },
      {
        id: 'L3',
        title: 'Part 3 · Bài nói',
        instruction: 'Bạn sẽ nghe 2 bài nói. Phần 1 có 8 câu hỏi, phần 2 có 7 câu hỏi.',
        transcript: [
          { speaker: 'Lecturer', line: 'Today we are going to look at one of the most powerful ideas in consumer psychology: anchoring. An anchor is simply the first number a customer sees, and that number influences the second number, even when the first one is completely irrelevant.' },
          { speaker: 'Lecturer', line: 'In a well-known experiment, shoppers in a supermarket were shown the sign “limit twelve per customer”. On other days the same sign said four. Customers who saw the number twelve bought on average twice as many tins of soup. Nobody needs forty-eight tins of soup.' },
          { speaker: 'Lecturer', line: 'The second finding is about price. Shelves rarely show one product; they show three: a cheap own-brand item, a mid-priced national brand and an expensive premium one. Most shoppers choose the middle option, and shops know this, which is why the expensive item is sometimes there partly to make the middle one look sensible.' },
          { speaker: 'Lecturer', line: 'A third effect is the word “free”. When something is free we stop calculating. Researchers offered a choice between a free ten-dollar gift card and a twenty-dollar card for seven dollars. Most people took the free one, even though the second option is clearly better value.' },
          { speaker: 'Lecturer', line: 'Does this mean customers are stupid? Not at all. These short cuts work well in ordinary life; you cannot spend two hours in a shop calculating the true value of every item. The problem is that shops design the environment and shoppers only react to it.' },
          { speaker: 'Lecturer', line: 'So what can you do? First, decide what you actually need before you enter the shop, because a number you meet inside is far more persuasive than a number you made outside. Second, convert prices into hours of work: a sixty-dollar jacket is four hours for someone earning fifteen dollars an hour, and that comparison breaks the anchor.' },
          { speaker: 'Lecturer', line: 'Third, be careful with the middle of the shelf, and fourth, use a list — not because lists save money by themselves, but because writing a limit down makes it harder to break it without noticing.' },
          { speaker: 'Lecturer', line: 'Finally, remember that none of these techniques is illegal. Supermarkets are not lying to you; they are arranging things. Your defence is not suspicion, but preparation.' },
          { speaker: 'Narrator', line: 'Now listen to a short radio report about a town that printed its own money.' },
          { speaker: 'Reporter', line: 'Six years ago the small town of Bredfield had a problem familiar to many market towns: four large supermarkets at the edge of town and a high street with eleven empty shops.' },
          { speaker: 'Reporter', line: 'A group of traders tried something unusual. They printed a local currency, the Bredfield pound, which could be used only in shops inside the town. Customers exchanged ordinary money for the notes at the town hall, at a rate of one to one.' },
          { speaker: 'Reporter', line: 'The idea was simple. Money spent in a supermarket leaves the town the next day. Money in local notes stays, because the butcher must spend it with the baker, and the baker with the electrician.' },
          { speaker: 'Reporter', line: 'Did it work? After two years, local notes worth about four hundred thousand pounds had been exchanged, and nine of the eleven empty shops were trading again. The scheme did not create new demand, but it changed where money was spent.' },
          { speaker: 'Reporter', line: 'There were complaints, of course. Some shoppers found the notes inconvenient because they could not be used online, and one in five never returned to spend what they had bought. The organisers also had to pay to print and to secure the notes, about three per cent of their value.' },
          { speaker: 'Reporter', line: 'The most surprising effect was social rather than financial. Traders began meeting once a month, and small businesses started ordering together to get lower prices on packaging. Several shops said the network, not the currency, was what saved them.' },
          { speaker: 'Reporter', line: 'Other towns have copied the scheme with mixed results. The lesson from Bredfield is that a local currency works best in a town with a strong group of traders who already know each other. Without that group, the notes circulate slowly and the printing cost is wasted.' },
        ],
        questions: [
          { id: 'L3-1', type: 'choice', prompt: 'What is an anchor, according to the lecture?', options: ['The cheapest price in a shop', 'The first number a customer sees', 'The average market price', 'A discount label'], answer: 'The first number a customer sees', explain: 'Anchor là con số đầu tiên khách nhìn thấy và nó ảnh hưởng tới con số sau.' },
          { id: 'L3-2', type: 'choice', prompt: 'What happened in the soup experiment?', options: ['Customers bought twice as much after seeing twelve', 'Customers ignored the sign', 'Customers bought fewer tins', 'The shop ran out of soup'], answer: 'Customers bought twice as much after seeing twelve', explain: 'Biển “limit twelve” khiến khách mua gấp đôi so với biển “limit four”.' },
          { id: 'L3-3', type: 'choice', prompt: 'Why do shelves often show three prices?', options: ['To hide the cheapest item', 'To make the middle option look sensible', 'To reduce waste', 'To obey the law'], answer: 'To make the middle option look sensible', explain: 'Món đắt có khi chỉ để làm món giữa trông hợp lý.' },
          { id: 'L3-4', type: 'choice', prompt: 'Why did most people choose the free gift card?', options: ['It had greater value', 'It cost nothing, so they stopped calculating', 'They disliked the shop', 'It was the only card left'], answer: 'It cost nothing, so they stopped calculating', explain: 'Khi món đồ miễn phí, ta ngừng tính toán giá trị thật.' },
          { id: 'L3-5', type: 'choice', prompt: 'What is the lecturer’s view of shoppers?', options: ['They are stupid', 'They are careless with money', 'They use useful short cuts in a designed environment', 'They should ignore advertising completely'], answer: 'They use useful short cuts in a designed environment', explain: 'Diễn giả nói khách không hề ngốc; họ dùng lối tắt hữu ích trong môi trường được thiết kế sẵn.' },
          { id: 'L3-6', type: 'choice', prompt: 'What should you decide before entering a shop?', options: ['Which brand you trust', 'What you actually need', 'How much cash you carry', 'Where you will park'], answer: 'What you actually need', explain: 'Quyết định trước khi vào cửa hàng vì con số gặp bên trong có sức thuyết phục hơn.' },
          { id: 'L3-7', type: 'fill', prompt: 'Converting a price into hours of ___ is a way to break the anchor. (one word)', answers: ['work'], explain: '“convert prices into hours of work”.' },
          { id: 'L3-8', type: 'choice', prompt: 'What is the lecturer’s final message?', options: ['Supermarkets are dishonest', 'Shoppers cannot be protected', 'Preparation, not suspicion, is the best defence', 'Prices should be controlled by law'], answer: 'Preparation, not suspicion, is the best defence', explain: '“Your defence is not suspicion, but preparation.”' },
          { id: 'L3-9', type: 'choice', prompt: 'What was Bredfield’s problem?', options: ['Too many tourists', 'Eleven empty shops on the high street', 'Very high local taxes', 'A closed bus station'], answer: 'Eleven empty shops on the high street', explain: 'Phố chính có mười một cửa hàng bỏ trống.' },
          { id: 'L3-10', type: 'choice', prompt: 'How did customers get the local notes?', options: ['At the town hall, one for one', 'Through a mobile app', 'At the supermarkets', 'By paying a monthly fee'], answer: 'At the town hall, one for one', explain: 'Đổi tiền tại toà thị chính, tỉ giá 1:1.' },
          { id: 'L3-11', type: 'choice', prompt: 'Why does money in local notes stay in the town?', options: ['The bank keeps it', 'Traders spend it with each other', 'The council invests it', 'It cannot be printed again'], answer: 'Traders spend it with each other', explain: 'Người bán thịt tiêu tiền đó ở tiệm bánh, tiệm bánh tiêu ở tiệm điện…' },
          { id: 'L3-12', type: 'choice', prompt: 'What happened to the empty shops?', options: ['They stayed empty', 'Nine of them were trading again', 'They became supermarkets', 'They were turned into flats'], answer: 'Nine of them were trading again', explain: 'Chín trong mười một cửa hàng đã mở lại.' },
          { id: 'L3-13', type: 'fill', prompt: 'Printing and securing the notes cost about three per cent of their ___. (one word)', answers: ['value'], explain: '“about three per cent of their value”.' },
          { id: 'L3-14', type: 'choice', prompt: 'What was the most surprising effect?', options: ['Higher prices in shops', 'Traders cooperating with each other', 'More tourists visiting', 'A new supermarket opening'], answer: 'Traders cooperating with each other', explain: 'Hiệu ứng bất ngờ nhất là xã hội: các tiểu thương bắt đầu họp và đặt hàng chung.' },
          { id: 'L3-15', type: 'choice', prompt: 'What does the scheme depend on?', options: ['A strong group of traders who know each other', 'Government funding', 'A very large population', 'Cheap printing'], answer: 'A strong group of traders who know each other', explain: 'Đồng tiền địa phương chỉ hiệu quả khi có nhóm tiểu thương gắn kết.' },
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
            title: 'Thông báo chi nhánh ngân hàng',
            text: 'From 1 March the Eastgate branch will close at 3 p.m. on Wednesdays for staff training. Cash machines remain open twenty-four hours, and the nearest alternative branch is at Mill Road, about twelve minutes away on foot.',
            questions: [
              { id: 'R1-1q', type: 'choice', prompt: 'Why will the branch close early on Wednesdays?', options: ['For building repairs', 'For staff training', 'Because of a public holiday', 'Because few customers come'], answer: 'For staff training', explain: '“will close at 3 p.m. on Wednesdays for staff training”.' },
            ],
          },
          {
            id: 'R1-2',
            title: 'Email về tiền hoàn',
            text: 'Dear customer, we have processed your refund of 45 dollars. It will appear on your card within five working days. Please note that delivery charges are not refunded unless the item was faulty. If the money has not arrived after seven days, contact us with your order number.',
            questions: [
              { id: 'R1-2q', type: 'choice', prompt: 'When is the delivery charge refunded?', options: ['Always', 'Only when the item was faulty', 'Within five working days', 'Only for orders over 45 dollars'], answer: 'Only when the item was faulty', explain: 'Phí giao hàng chỉ được hoàn khi món hàng bị lỗi.' },
            ],
          },
          {
            id: 'R1-3',
            title: 'Quảng cáo ứng dụng',
            text: 'Track every dollar with PocketLog. Connecting two bank accounts and one card is free. Extra accounts cost 2 dollars each per month. The first 30 days are free, and you can cancel from inside the app at any time — no phone call needed.',
            questions: [
              { id: 'R1-3q', type: 'choice', prompt: 'What costs money?', options: ['The first two bank accounts', 'Connecting extra accounts', 'The first 30 days', 'Cancelling the service'], answer: 'Connecting extra accounts', explain: 'Tài khoản thêm tính 2 đô la mỗi tháng.' },
            ],
          },
          {
            id: 'R1-4',
            title: 'Nhãn sản phẩm',
            text: 'Insulated lunch box. Keeps food hot for four hours or cold for eight. Not suitable for microwaves or dishwashers. Wash by hand with warm water. Two-year guarantee against manufacturing faults.',
            questions: [
              { id: 'R1-4q', type: 'choice', prompt: 'What is the lunch box unsuitable for?', options: ['Hand washing', 'Hot food', 'Microwaves and dishwashers', 'Outdoor use'], answer: 'Microwaves and dishwashers', explain: '“Not suitable for microwaves or dishwashers.”' },
            ],
          },
          {
            id: 'R1-5',
            title: 'Đánh giá cửa hàng',
            text: 'Good prices and helpful staff, but three of my five online orders arrived in the wrong size, and the return process takes about two weeks. I still buy basics here, though for clothes I now go to a shop and try them on.',
            questions: [
              { id: 'R1-5q', type: 'choice', prompt: 'What problem does the reviewer mention?', options: ['High prices', 'Unhelpful staff', 'Wrong sizes in online orders', 'Delayed refunds for shoes'], answer: 'Wrong sizes in online orders', explain: 'Ba trong năm đơn online giao sai cỡ.' },
            ],
          },
          {
            id: 'R1-6',
            title: 'Hình thức thanh toán',
            text: 'Please note: from next month we no longer accept cash at the ticket office. Cards and phone payments are accepted. Customers who can only pay in cash should buy tickets at the kiosk beside the main gate, which opens at 8 a.m.',
            questions: [
              { id: 'R1-6q', type: 'choice', prompt: 'What can cash customers do?', options: ['Pay at the ticket office', 'Buy tickets at the kiosk by the main gate', 'Use the card machine', 'Ask staff for an invoice'], answer: 'Buy tickets at the kiosk by the main gate', explain: 'Khách chỉ có tiền mặt mua vé ở quầy bên cổng chính.' },
            ],
          },
          {
            id: 'R1-7',
            title: 'Tin tuyển dụng',
            text: 'Part-time sales assistant, 20 hours a week, evenings and Saturdays. Experience is welcome but not essential, and training is paid. Pay starts at 12 dollars an hour, with twenty per cent extra for hours worked after 6 p.m.',
            questions: [
              { id: 'R1-7q', type: 'choice', prompt: 'What does the advert say about experience?', options: ['It is essential', 'It is welcome but not required', 'It must be in a supermarket', 'It is paid separately'], answer: 'It is welcome but not required', explain: '“Experience is welcome but not essential.”' },
            ],
          },
          {
            id: 'R1-8',
            title: 'Tin nhắn ngân hàng',
            text: 'Northbank: your monthly account fee of 3.50 will be charged on 5 June. To avoid this fee, keep a balance of at least 500 dollars, or have your salary paid into this account. Fees are listed in full on our website.',
            questions: [
              { id: 'R1-8q', type: 'choice', prompt: 'How can a customer avoid the monthly fee?', options: ['By paying in cash', 'By keeping a minimum balance or receiving a salary there', 'By closing the account', 'By using the mobile app'], answer: 'By keeping a minimum balance or receiving a salary there', explain: 'Giữ số dư tối thiểu 500 đô la hoặc nhận lương vào tài khoản.' },
            ],
          },
          {
            id: 'R1-9',
            title: 'Áp phích chợ',
            text: 'Riverside Market, Saturday 8–1. This week: a free cookery demonstration at 10 a.m., and a children’s stall where they can make their own bread. Bring your own bags for a five per cent discount.',
            questions: [
              { id: 'R1-9q', type: 'choice', prompt: 'What happens at 10 a.m.?', options: ['A bread sale', 'A cookery demonstration', 'A discount for bags', 'A children’s race'], answer: 'A cookery demonstration', explain: '10 giờ có buổi trình diễn nấu ăn miễn phí.' },
            ],
          },
          {
            id: 'R1-10',
            title: 'Bài đăng trên diễn đàn',
            text: 'I used to buy coffee twice a day and never noticed the money going out. When I finally added it up, it came to 96 dollars a month — more than my electricity bill. Now I make coffee at home on weekdays and treat myself at the weekend.',
            questions: [
              { id: 'R1-10q', type: 'choice', prompt: 'What surprised the writer?', options: ['The price of coffee at weekends', 'The monthly total of small purchases', 'The size of the electricity bill', 'The number of cafés near the office'], answer: 'The monthly total of small purchases', explain: 'Con số 96 đô la một tháng cho những khoản nhỏ khiến tác giả bất ngờ.' },
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
            title: 'The hidden price of “free” delivery',
            text: `Online shops rarely advertise delivery charges. Instead they advertise a threshold: spend thirty dollars and delivery costs nothing. Customers read this as generosity; economists read it as a pricing decision.

The first thing to notice is that delivery has not become cheaper. A parcel still needs a van, a driver and fuel. What has changed is where the cost appears on the invoice. When a shop offers free delivery, the average price of its products rises slightly, usually by less than customers notice. The customer who buys three items pays for the van; the customer who buys one small item also pays, because the product is a little more expensive than it would have been.

The threshold itself is a clever device. Once a shopper has chosen goods worth twenty-four dollars, adding a six-dollar item to reach thirty dollars feels like saving money, even if the extra item was not needed. Studies of shopping behaviour repeatedly find that customers spend more than the delivery fee would have cost, and that the items they add are often the very ones they would not have bought in a shop. The threshold does not remove a cost; it moves the cost and enlarges the basket.

Free returns create a similar pattern. Shops that offer them usually receive more orders, because the risk of choosing the wrong size seems to disappear. The same shops, however, also receive far more parcels back. Transport must be paid twice, and returned clothes must be checked, steamed and repacked, often by hand. In several European markets, handling a returned garment costs a retailer more than the profit on the original sale. That cost is recovered from the prices charged to everyone, including the customers who never send anything back.

There is also an environmental bill. Returning an item is a separate journey, sometimes in a nearly empty van, and a large share of returned goods are not resold at full price; some are destroyed. This does not mean that online shopping is always worse than driving to a shop, since one delivery van can serve dozens of homes. It means that the comparison is more complicated than the words “green” and “free” suggest.

What should a shopper do? Three habits help. First, compare the total price, delivery included, rather than the price of the item. Second, treat the free-delivery threshold as a question — do I actually want this extra item? — rather than as an opportunity. Third, if you are unsure about a size, order one item and pay the delivery charge, which is usually cheaper than adding a second size just in case. None of this requires distrust of online shops. It simply requires reading the whole price, not only the last line of it.`,
            glossary: [
              { word: 'threshold', meaning: 'ngưỡng (mức tối thiểu)' },
              { word: 'invoice', meaning: 'hoá đơn' },
              { word: 'basket', meaning: 'giỏ hàng' },
              { word: 'retailer', meaning: 'nhà bán lẻ' },
              { word: 'garment', meaning: 'quần áo, trang phục' },
              { word: 'recover a cost', meaning: 'thu hồi/bù lại chi phí' },
            ],
            questions: [
              { id: 'R2-1q1', type: 'choice', prompt: 'What is the writer’s main argument?', options: ['Delivery has become genuinely free', 'Delivery costs are moved into product prices', 'Online shops lose money on every order', 'Customers should stop shopping online'], answer: 'Delivery costs are moved into product prices', explain: 'Chi phí giao hàng không mất đi mà được đưa vào giá sản phẩm.' },
              { id: 'R2-1q2', type: 'choice', prompt: 'What happens to product prices when delivery is advertised as free?', options: ['They fall sharply', 'They rise slightly', 'They stay exactly the same', 'They double'], answer: 'They rise slightly', explain: '“the average price of its products rises slightly”.' },
              { id: 'R2-1q3', type: 'choice', prompt: 'How does the free-delivery threshold affect shoppers?', options: ['They buy only what they came for', 'They add items to reach the total', 'They pay the delivery fee separately', 'They wait for a sale'], answer: 'They add items to reach the total', explain: 'Khách thêm món để đạt ngưỡng miễn phí giao hàng.' },
              { id: 'R2-1q4', type: 'choice', prompt: 'Why do shops that offer free returns receive more orders?', options: ['Delivery is faster', 'The risk of choosing wrongly seems to disappear', 'Prices are lower', 'The products are better quality'], answer: 'The risk of choosing wrongly seems to disappear', explain: 'Khách thấy như không còn rủi ro chọn sai cỡ.' },
              { id: 'R2-1q5', type: 'choice', prompt: 'What is said about handling returned clothes?', options: ['It costs nothing', 'It can cost more than the profit on the sale', 'It is done entirely by machines', 'It is paid for by the customer who returns'], answer: 'It can cost more than the profit on the sale', explain: 'Xử lý một món hàng trả lại có thể tốn hơn lợi nhuận của đơn hàng.' },
              { id: 'R2-1q6', type: 'fill', prompt: 'The cost of returns is recovered from the prices charged to ___. (one word)', answers: ['everyone'], explain: '“recovered from the prices charged to everyone”.' },
              { id: 'R2-1q7', type: 'choice', prompt: 'What happens to some returned goods?', options: ['They are donated to charity', 'They are destroyed', 'They are sold at full price', 'They are given to drivers'], answer: 'They are destroyed', explain: '“some are destroyed”.' },
              { id: 'R2-1q8', type: 'choice', prompt: 'What does the writer say about online shopping and the environment?', options: ['It is always worse than shopping in person', 'It is always better', 'The comparison is complicated', 'It has no effect at all'], answer: 'The comparison is complicated', explain: 'So sánh phức tạp hơn hai từ “green” và “free”.' },
              { id: 'R2-1q9', type: 'choice', prompt: 'What is the third habit the writer recommends?', options: ['Always order two sizes', 'Order one item and pay the delivery charge if unsure', 'Use free returns as often as possible', 'Buy only in physical shops'], answer: 'Order one item and pay the delivery charge if unsure', explain: 'Nếu không chắc về cỡ, chỉ đặt một món và trả phí giao hàng.' },
              { id: 'R2-1q10', type: 'choice', prompt: 'What is the writer’s final advice?', options: ['Never pay for delivery', 'Read the whole price, not only the last line', 'Avoid online shopping', 'Ask shops for refunds'], answer: 'Read the whole price, not only the last line', explain: 'Câu cuối: hãy đọc toàn bộ giá, không chỉ dòng cuối.' },
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
            title: 'The small payments nobody adds up',
            text: `Twenty years ago most people paid for music, films and software item by item. Today the same services arrive as monthly subscriptions, and the change has been described as a convenience. It is also a business model, and understanding it explains a great deal about modern household budgets.

The first advantage for a company is predictability. Selling a single product produces income that rises and falls with each new release. A subscription produces roughly the same income every month, which makes planning easier and makes the company attractive to investors. This is one reason why firms that once sold software now refuse to sell it at all.

The second advantage is arithmetic. Ten dollars a month sounds like a small amount, and compared with a large one-off purchase it is. Households, however, do not experience subscriptions one at a time; they experience them together. Fifteen subscriptions at ten dollars each is one hundred and fifty dollars a month, which over five years is the price of a small car. Each individual choice feels reasonable while the total remains invisible, because no single payment ever feels significant.

The design of the payment is part of the effect. Paying automatically by card removes the moment of decision, so a subscription continues until somebody actively stops it. When free trials are offered, the customer must remember to cancel, and companies know from their own data that a proportion will not. In some countries regulators have responded by requiring shops to send a reminder before a trial ends and to allow cancellation in two clicks. Such rules change behaviour, but they do not change the arithmetic.

Defenders of subscriptions make a serious point. For the price of one album a month, a listener now has access to almost all recorded music, which is a genuine gain for people who listen widely. Subscriptions also allow small developers to earn steady income instead of depending on a single launch. The model is not a trick; it is a trade of ownership for access, and many consumers are pleased to make it.

The practical question, then, is not whether subscriptions are good or bad, but whether the customer knows what they cost. A short list, written once and checked every three months, usually surprises people. The discovery is rarely one expensive subscription; it is three cheap ones that stopped being used long ago. Access is a fine thing, but paying for access you have forgotten is simply a leak in the budget.`,
            glossary: [
              { word: 'predictability', meaning: 'tính dễ dự đoán' },
              { word: 'one-off', meaning: 'mua một lần' },
              { word: 'regulator', meaning: 'cơ quan quản lý' },
              { word: 'access', meaning: 'quyền truy cập, sử dụng' },
              { word: 'ownership', meaning: 'quyền sở hữu' },
              { word: 'leak', meaning: 'chỗ rò rỉ, thất thoát' },
            ],
            questions: [
              { id: 'R3-1q1', type: 'choice', prompt: 'What does the writer mainly want to explain?', options: ['Why music is cheaper than before', 'How the subscription model affects household budgets', 'How to cancel contracts legally', 'Why companies go out of business'], answer: 'How the subscription model affects household budgets', explain: 'Mục đích bài viết là giải thích mô hình thuê bao ảnh hưởng tới ngân sách gia đình.' },
              { id: 'R3-1q2', type: 'choice', prompt: 'Why do companies prefer subscriptions?', options: ['Income is predictable every month', 'They avoid paying tax', 'Products cost less to make', 'Customers complain less'], answer: 'Income is predictable every month', explain: 'Thu nhập ổn định hằng tháng giúp lập kế hoạch và hấp dẫn nhà đầu tư.' },
              { id: 'R3-1q3', type: 'choice', prompt: 'What is the company’s “second advantage”?', options: ['Lower production costs', 'The arithmetic of many small payments', 'Better products', 'Faster delivery'], answer: 'The arithmetic of many small payments', explain: 'Lợi thế thứ hai là “số học”: nhiều khoản nhỏ cộng lại thành khoản lớn.' },
              { id: 'R3-1q4', type: 'fill', prompt: 'Fifteen subscriptions at ten dollars a month add up to ___ dollars a month. (write the number)', answers: ['150', 'one hundred and fifty'], explain: '“Fifteen subscriptions at ten dollars each is one hundred and fifty dollars a month.”' },
              { id: 'R3-1q5', type: 'choice', prompt: 'Why does the total remain invisible?', options: ['The payments are made in cash', 'No single payment feels significant', 'Companies hide the price', 'Banks do not report them'], answer: 'No single payment feels significant', explain: 'Không khoản nào riêng lẻ đủ lớn để thấy đáng lo.' },
              { id: 'R3-1q6', type: 'choice', prompt: 'What does automatic payment by card remove?', options: ['The service itself', 'The moment of decision', 'The monthly fee', 'The free trial'], answer: 'The moment of decision', explain: 'Trả tự động bằng thẻ khiến không còn thời điểm để quyết định.' },
              { id: 'R3-1q7', type: 'choice', prompt: 'What have some regulators required?', options: ['Banning subscriptions completely', 'Sending a reminder before a trial ends', 'Fixing subscription prices', 'Closing small developers'], answer: 'Sending a reminder before a trial ends', explain: 'Yêu cầu nhắc trước khi hết hạn dùng thử và cho phép huỷ trong hai cú nhấp.' },
              { id: 'R3-1q8', type: 'choice', prompt: 'What do defenders of subscriptions say about access?', options: ['It is worse than ownership', 'It gives wide access for a low monthly price', 'It reduces choice', 'It only suits professionals'], answer: 'It gives wide access for a low monthly price', explain: 'Với giá một album mỗi tháng, người nghe có quyền truy cập gần như toàn bộ kho nhạc.' },
              { id: 'R3-1q9', type: 'choice', prompt: 'How does the writer describe the subscription model?', options: ['A trick', 'A trade of ownership for access', 'A temporary fashion', 'A form of taxation'], answer: 'A trade of ownership for access', explain: '“it is a trade of ownership for access”.' },
              { id: 'R3-1q10', type: 'choice', prompt: 'What is the practical recommendation?', options: ['Cancel all subscriptions', 'Write a list and review it every three months', 'Pay only in cash', 'Avoid all free trials'], answer: 'Write a list and review it every three months', explain: 'Viết danh sách và kiểm tra ba tháng một lần.' },
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
            title: 'A budget that survives the second week',
            text: `Most budgets fail in the second week. The reason is rarely mathematics; it is design. A plan that (1)___ no space for fun is a plan people abandon.

Start by writing down what you (2)___ spend, not what you would like to spend. Rent, transport and food come first. If the total is already (3)___ than your income, the problem is not a lack of discipline; it is the size of the gap.

Next, choose one category where you (4)___ to reduce spending, and make the change small enough to keep. Someone who (5)___ thirty dollars a week on lunches can move to twenty without much pain. (6)___ the change is too large, it will last a fortnight.

It also helps to separate money by purpose. Many people keep everything in one account, (7)___ makes saving feel like an argument with yourself. Two accounts — one for bills, one for daily spending — remove that argument, (8)___ you move the money on payday rather than at the end of the month.

Finally, review the plan once a month. A budget is not a promise (9)___ has to be broken; it is a tool that (10)___ to be adjusted.`,
            questions: [
              { id: 'R4-1q1', type: 'choice', prompt: 'Chỗ (1)', options: ['allow', 'allows', 'allowing', 'allowed'], answer: 'allows', explain: 'Chủ ngữ “A plan” số ít → allows.' },
              { id: 'R4-1q2', type: 'choice', prompt: 'Chỗ (2)', options: ['actually', 'actual', 'actuality', 'actualise'], answer: 'actually', explain: 'Cần trạng từ bổ nghĩa cho động từ “spend”.' },
              { id: 'R4-1q3', type: 'choice', prompt: 'Chỗ (3)', options: ['high', 'higher', 'highest', 'highly'], answer: 'higher', explain: 'Có “than” → dùng so sánh hơn “higher”.' },
              { id: 'R4-1q4', type: 'choice', prompt: 'Chỗ (4)', options: ['need', 'needs', 'needing', 'needed'], answer: 'need', explain: 'Chủ ngữ “you” → động từ nguyên thể không chia “need”.' },
              { id: 'R4-1q5', type: 'choice', prompt: 'Chỗ (5)', options: ['spend', 'spends', 'spending', 'to spend'], answer: 'spends', explain: '“Someone who spends…” — chủ ngữ số ít nên chia số ít.' },
              { id: 'R4-1q6', type: 'choice', prompt: 'Chỗ (6)', options: ['If', 'Unless', 'Although', 'Because'], answer: 'If', explain: 'Câu điều kiện: “If the change is too large, it will last a fortnight.”' },
              { id: 'R4-1q7', type: 'choice', prompt: 'Chỗ (7)', options: ['which', 'who', 'whose', 'what'], answer: 'which', explain: 'Mệnh đề quan hệ thay cho cả mệnh đề trước đó → “which”.' },
              { id: 'R4-1q8', type: 'choice', prompt: 'Chỗ (8)', options: ['because', 'so that', 'although', 'unless'], answer: 'because', explain: 'Nêu lý do hai tài khoản loại bỏ được “cuộc tranh cãi” đó.' },
              { id: 'R4-1q9', type: 'choice', prompt: 'Chỗ (9)', options: ['that', 'what', 'who', 'whose'], answer: 'that', explain: 'Mệnh đề quan hệ xác định cho “a promise” → “that”.' },
              { id: 'R4-1q10', type: 'choice', prompt: 'Chỗ (10)', options: ['need', 'needs', 'needing', 'needed'], answer: 'needs', explain: '“a tool that needs to be adjusted” — chủ ngữ số ít.' },
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
        title: 'Task 1 · Email khiếu nại đơn hàng online',
        prompt: 'You ordered a grey desk lamp from an online shop two weeks ago. The wrong item arrived and two emails to customer service have received no reply. Write an email (about 120 words) to the customer service manager, Ms Palmer. In your email: give your order number and describe the problem, say what you have already done, explain what you want the shop to do, and give a deadline for a reply.',
        minWords: 120,
        checklist: [
          { label: 'Có dòng tiêu đề (Subject) rõ ràng', hint: 'Subject: Wrong item received — order 88213' },
          { label: 'Nêu số đơn hàng và mô tả đúng lỗi', hint: 'I ordered a grey desk lamp but received a white wall light.' },
          { label: 'Nói rõ bạn đã làm gì để giải quyết', hint: 'I sent two emails, on 3 and 8 May, and called your helpline twice.' },
          { label: 'Nêu yêu cầu cụ thể (đổi hàng hoặc hoàn tiền)', hint: 'I would like either the correct lamp or a full refund, including delivery.' },
          { label: 'Có hạn chót cho phản hồi', hint: 'Could you reply by Friday 20 May?' },
          { label: 'Giọng điệu lịch sự nhưng dứt khoát', hint: 'I am sure this was a mistake at your warehouse, but two weeks is a long time.' },
        ],
        tips: [
          'Email khiếu nại B2 cần “lịch sự nhưng có mốc thời gian”: nêu sự việc, bằng chứng, yêu cầu, hạn chót.',
          'Đừng viết cảm xúc mạnh (angry, terrible). Dùng “disappointed”, “inconvenient”, “I would appreciate”.',
          'Ghi rõ số đơn hàng và ngày tháng — đây là chi tiết được tính vào điểm nội dung.',
        ],
        model: `Subject: Wrong item received — order 88213

Dear Ms Palmer,

I am writing about order 88213, placed on 3 May. I ordered a grey desk lamp, but the parcel contained a white wall light. The invoice in the box shows the correct model, so I believe the mistake happened in your warehouse.

I have already sent two emails to customer service, on 6 and 11 May, and both are still unanswered. I also telephoned your helpline and was told to wait.

Could you please send the correct lamp, or refund the full amount of 42 dollars including the delivery charge? I would be grateful if you could reply by Friday 20 May, as I need a lamp for my study desk. Otherwise I will have to ask my bank to reverse the payment.

Thank you for your help.

Yours sincerely,
Lan Pham`,
      },
      {
        id: 'W2',
        task: 2,
        title: 'Task 2 · Luận: quảng cáo có khiến ta mua thứ không cần?',
        prompt: 'Some people believe that advertising makes consumers buy things they do not need. Others say that advertising mainly provides information that helps people compare products. Discuss both views and give your own opinion. Write an essay (about 250 words). Use reasons and examples to support your answer.',
        minWords: 250,
        checklist: [
          { label: 'Mở bài giới thiệu chủ đề và nêu hướng làm bài', hint: 'Advertising is part of everyday life, and its purpose is debated…' },
          { label: 'Có đoạn trình bày quan điểm “quảng cáo tạo nhu cầu”', hint: 'On the one hand, …' },
          { label: 'Có đoạn trình bày quan điểm “quảng cáo cung cấp thông tin”', hint: 'On the other hand, …' },
          { label: 'Nêu ý kiến cá nhân rõ ràng', hint: 'In my opinion, … because …' },
          { label: 'Có ít nhất 2 ví dụ cụ thể', hint: 'For example, when I compared two laptops…' },
          { label: 'Dùng từ nối giữa các đoạn', hint: 'however, moreover, therefore, in conclusion' },
          { label: 'Kết luận tóm tắt quan điểm, không nêu ý mới', hint: 'In conclusion, …' },
          { label: 'Đủ số từ (~250)', hint: 'Kiểm tra số từ ở khung soạn thảo' },
        ],
        tips: [
          'Dạng “discuss both views” phải có 2 đoạn thân bài cân đối, rồi 1 đoạn ý kiến cá nhân — không được bỏ một vế.',
          'Tránh từ quá mạnh như “manipulate”, “brainwash”; dùng “encourage”, “influence”, “shape preferences”.',
          'Mỗi đoạn thân bài nên có 1 ví dụ hoặc số liệu để tránh bài viết chung chung.',
        ],
        model: `Advertising surrounds us on buses, on websites and inside mobile applications, and it clearly affects what we buy. Some people argue that it creates needs we never had, while others see it mainly as a source of information. In my view, both descriptions are partly true, but the balance depends on the product.

On the one hand, advertising certainly does more than inform. Campaigns are designed by teams who study emotion, colour and timing, and their aim is to make a product feel necessary. A common example is the free-delivery threshold: shoppers add items worth six dollars to reach a spending total, even though they did not want those items when they entered the site. Snack food advertising works in a similar way, since it is rarely aimed at people who are already hungry.

On the other hand, comparing products would be extremely slow without advertising. When I bought a laptop last year, advertisements told me the price, the weight and the battery life of six models in an afternoon. Without them, I would have had to visit several shops. Advertising also helps small producers reach customers, which can increase competition and lower prices rather than simply push people to spend.

In my opinion, the key difference is whether a product is something we already need. For a fridge or an insurance policy, advertising mostly gives information that helps us choose. For clothes, cosmetics and drinks, it often tries to create a feeling of shortage or of belonging, which is where unnecessary spending begins.

In conclusion, advertising informs and persuades at the same time. Responsible consumers should use it for facts and treat its emotional promises with care.`,
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
        instruction: 'Bạn sẽ nghe 3 câu hỏi về chi tiêu và mua sắm. Trả lời mỗi câu 1–2 phút, nói tự nhiên như đang trò chuyện.',
        minutes: 3,
        questions: [
          { q: 'How do you usually decide whether something is worth buying?', sample: 'I use two simple questions. First, would I still want this in a month? If the answer is likely yes, it is probably something I need rather than something I saw in an advertisement. Second, how many hours of work does it cost? A jacket for sixty dollars is four hours for me, and that comparison usually stops me from buying things on impulse.' },
          { q: 'Do you prefer shopping online or in a shop? Why?', sample: 'It depends on the product. For books and household items I shop online, because the price is easy to compare and delivery is convenient. For clothes and shoes I always go to a shop, since sizes differ so much between brands that ordering online often means returning parcels, which is slow and bad for the environment as well.' },
          { q: 'Tell me about a time you were disappointed with something you bought.', sample: 'Last year I bought a pair of running shoes after seeing a big discount advertisement. They were very cheap, but the sole became uncomfortable after two weeks, and repairing them cost more than the shoes. Now I read reviews from people who have used a product for several months, not just the first week.' },
        ],
      },
      {
        id: 'S2',
        kind: 'solution',
        title: 'Part 2 · Thảo luận giải pháp',
        instruction: 'Bạn và một người bạn đang bàn cách giúp em trai của bạn ấy, vừa đi làm tháng đầu, không tiêu hết lương trong mười ngày. Hãy thảo luận ưu điểm, nhược điểm của 3 lựa chọn rồi chọn một phương án và giải thích.',
        minutes: 4,
        situation: 'Your friend’s younger brother has just started his first job. He spends almost his whole salary in the first ten days of every month and then borrows money to pay for food and transport. Three options are suggested.',
        options: [
          'Set up an automatic transfer to a savings account on payday',
          'Keep a written budget and use cash envelopes for daily spending',
          'Move to a cheaper flat further from the city centre',
        ],
        sample: `Let us look at the three options. The automatic transfer is the simplest, because it happens on payday before he has a chance to spend anything. Saving becomes the first payment of the month rather than what is left at the end, which is usually nothing. The weakness is that he still has to live on the rest, so if his normal spending continues, he will simply use his card more and the transfer will feel like a punishment.

The written budget with cash envelopes attacks the same problem from the other side. It makes spending visible: when the food envelope is empty, there is no money for food. It works well for people who like structure. However, keeping cash is inconvenient in a city where almost everything is paid by phone, and the system takes discipline — most people stop after a few weeks.

Moving to a cheaper flat would reduce the largest single cost, rent, and the saving would be automatic and permanent. Still, it is a big change that affects his journey to work and his friends, and he cannot do it this month anyway.

If I have to choose, I would start with the automatic transfer, and I would set the amount low — about ten per cent of his salary — so that it does not fail in the first month. Once he is used to living on the rest, I would add a simple budget on his phone so he can see where the money goes. The third option is worth considering after six months, when he knows his real costs. The important thing is to begin with one change, because three changes at once usually lead to none.`,
      },
      {
        id: 'S3',
        kind: 'topic',
        title: 'Part 3 · Phát triển chủ đề',
        instruction: 'Trình bày quan điểm của bạn về chủ đề dưới đây (khoảng 3 phút), dựa vào 3 gợi ý. Sau đó trả lời 2 câu hỏi mở rộng.',
        minutes: 5,
        topic: 'Advertising has a strong influence on what young people buy.',
        outline: [
          'Vì sao quảng cáo ảnh hưởng mạnh tới người trẻ',
          'Tác động tích cực và tiêu cực của điều đó',
          'Lời khuyên để người trẻ chi tiêu tỉnh táo hơn',
        ],
        questions: [
          { q: 'Should advertising aimed at children be restricted?', sample: 'I think it should be restricted, though not completely forbidden. Young children cannot separate a programme from an advertisement, and they cannot judge whether a promise about a toy is true. Several countries already ban advertising during children’s programmes, and I would support a similar rule for games and social media. For teenagers, I would prefer education: if they understand the techniques, such as a limited-time offer or a free-delivery threshold, they can decide for themselves.' },
          { q: 'What advice would you give to a student who always runs out of money before the end of the month?', sample: 'I would suggest three steps. First, record everything for one month, using a phone app or just a notebook, because most people are surprised by the total of small purchases. Second, choose a single category to cut and make the cut small enough to keep. Third, move a fixed amount into a separate account on payday, so saving happens automatically instead of depending on what is left. It also helps to wait twenty-four hours before any purchase over a certain amount.' },
        ],
      },
    ],
  },
};
