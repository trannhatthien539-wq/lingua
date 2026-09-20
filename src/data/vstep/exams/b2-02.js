/**
 * Đề VSTEP B2 số 2 — chủ đề môi trường & đô thị (nội dung gốc, viết theo đúng format đề thi).
 * Xem `docs/vstep-schema.md` để biết ý nghĩa từng field.
 */
export default {
  id: 'b2-02',
  level: 'B2',
  title: 'Đề B2 số 2 · Môi trường & đô thị',
  tags: ['môi trường', 'đô thị', 'B2'],

  listening: {
    minutes: 40,
    parts: [
      {
        id: 'L1',
        title: 'Part 1 · Thông báo ngắn',
        instruction: 'Bạn sẽ nghe 8 thông báo ngắn. Mỗi thông báo có một câu hỏi. Chọn đáp án đúng nhất.',
        transcript: [
          { speaker: 'Narrator', line: 'Announcement one. Please note that household rubbish in streets beginning with the letter A to M will now be collected on Thursday instead of Tuesday. Bins must be placed outside the gate before seven in the morning, because the truck cannot return to the same street twice.' },
          { speaker: 'Narrator', line: 'Announcement two. Under the current water restrictions, gardens may be watered only before eight in the morning or after seven in the evening. Washing cars with a hosepipe is not permitted at any time, although a bucket is acceptable.' },
          { speaker: 'Narrator', line: 'Announcement three. The city will give away two thousand young trees this weekend as part of the Green Streets programme. Saplings are free, but residents must register online and collect them in person, because the council cannot deliver them to private addresses.' },
          { speaker: 'Narrator', line: 'Announcement four. The old bridge on Mill Road will be closed for repairs for three weeks from Monday. Bus number twenty-one will be diverted through the industrial estate, so passengers should allow an extra fifteen minutes for their journey.' },
          { speaker: 'Narrator', line: 'Announcement five. Air quality in the city centre is expected to be poor this afternoon, because there is very little wind. Residents with breathing difficulties, young children and older people are advised to avoid energetic outdoor exercise until the evening.' },
          { speaker: 'Narrator', line: 'Announcement six. Six new bicycle-sharing stations have opened near the university hospital. An annual pass now costs half a million dong, and the first thirty minutes of every journey remain free of charge.' },
          { speaker: 'Narrator', line: 'Announcement seven. Plots in the community garden behind the sports centre are now available for the coming season. Because demand is high, there is a waiting list, and priority will be given to families living within one kilometre of the garden.' },
          { speaker: 'Narrator', line: 'Announcement eight. Volunteers joining Saturday’s beach clean-up should meet at the main car park at half past seven. Gloves and bags are provided, and a shuttle bus will take everybody to the northern end of the beach.' },
        ],
        questions: [
          { id: 'L1-1', type: 'choice', prompt: 'What has changed for residents in streets A to M?', options: ['The collection day', 'The time the truck arrives', 'The type of bin they use', 'The cost of collection'], answer: 'The collection day', explain: 'Ngày thu gom đổi từ thứ Ba sang thứ Năm.' },
          { id: 'L1-2', type: 'choice', prompt: 'What is never allowed under the restrictions?', options: ['Washing a car with a hosepipe', 'Watering a garden in the evening', 'Using a bucket', 'Watering before eight in the morning'], answer: 'Washing a car with a hosepipe', explain: 'Dùng vòi nước rửa xe bị cấm hoàn toàn.' },
          { id: 'L1-3', type: 'choice', prompt: 'Why must residents collect the trees themselves?', options: ['The council cannot deliver them', 'The trees are too valuable', 'There are only two thousand', 'Delivery costs too much'], answer: 'The council cannot deliver them', explain: 'Hội đồng không thể giao cây tới nhà riêng.' },
          { id: 'L1-4', type: 'choice', prompt: 'What should bus passengers do?', options: ['Allow extra travel time', 'Change to another route', 'Board at the industrial estate', 'Buy a new ticket'], answer: 'Allow extra travel time', explain: 'Xe buýt 21 đổi lộ trình nên cần thêm khoảng 15 phút.' },
          { id: 'L1-5', type: 'choice', prompt: 'Who is advised to avoid outdoor exercise?', options: ['People with breathing difficulties', 'Everyone in the city', 'People who work outside', 'Children under five only'], answer: 'People with breathing difficulties', explain: 'Người khó thở, trẻ nhỏ và người lớn tuổi nên tránh vận động mạnh ngoài trời.' },
          { id: 'L1-6', type: 'choice', prompt: 'What is still free for bicycle users?', options: ['The first thirty minutes of a journey', 'The annual pass', 'All journeys at weekends', 'The first month'], answer: 'The first thirty minutes of a journey', explain: '30 phút đầu của mỗi chuyến vẫn miễn phí.' },
          { id: 'L1-7', type: 'choice', prompt: 'Who has priority for a garden plot?', options: ['Families living very close by', 'People who applied first', 'Families with young children', 'Members of the sports centre'], answer: 'Families living very close by', explain: 'Ưu tiên hộ sống trong bán kính 1 km.' },
          { id: 'L1-8', type: 'choice', prompt: 'What is provided to volunteers?', options: ['Gloves and bags', 'Food and water', 'Transport home', 'Sun cream'], answer: 'Gloves and bags', explain: 'Ban tổ chức phát găng tay và túi đựng rác.' },
        ],
      },
      {
        id: 'L2',
        title: 'Part 2 · Hội thoại',
        instruction: 'Bạn sẽ nghe 2 đoạn hội thoại. Mỗi đoạn có 6 câu hỏi.',
        transcript: [
          { speaker: 'Planner', line: 'Thank you for coming, Mr Hai. I understand you have some concerns about the proposed bus lane on Nguyen Trai Street.' },
          { speaker: 'Hai', line: 'Concerns is a polite word for it. If you remove one lane from that street, the traffic will simply move into the side roads, where my neighbours park their cars.' },
          { speaker: 'Planner', line: 'That is a fair point, and it is why the design includes two measures you may not have seen. The side streets will become one-way in alternating directions, and residents will receive permits for on-street parking.' },
          { speaker: 'Hai', line: 'Permits for how many cars? My building alone has fourteen flats.' },
          { speaker: 'Planner', line: 'Every registered resident gets one permit. Additional cars would need to use the new multi-storey car park at the market, which will charge a daily rate rather than an hourly one.' },
          { speaker: 'Hai', line: 'And the bus lane itself — how many buses will actually use it? At the moment the 34 comes every twenty minutes and it is always half empty.' },
          { speaker: 'Planner', line: 'That is the part I am most confident about. The frequency will increase to every eight minutes in the peak, and we are adding a route that connects the hospital with the two largest schools.' },
          { speaker: 'Hai', line: 'So how long before I can judge whether it worked?' },
          { speaker: 'Planner', line: 'We will publish traffic counts every three months for two years. If the side streets get worse, we will adjust the one-way system. That is a formal commitment, and it is written into the council decision.' },
          { speaker: 'Hai', line: 'Fine. Then I would ask for one more thing: a crossing near the market. At present, people run across four lanes to reach the bus stop.' },
          { speaker: 'Planner', line: 'I will add it to the consultation document today. May I also invite you to join the residents’ committee? We meet on the first Tuesday of the month.' },
          { speaker: 'Hai', line: 'I will think about it. Send me the documents by email and I will read them properly before I answer.' },
          { speaker: 'Narrator', line: 'Now listen to a conversation between two colleagues at an office.' },
          { speaker: 'Trang', line: 'Khoa, did you see the waste audit report? Our floor sends almost everything to landfill.' },
          { speaker: 'Khoa', line: 'I did. Ninety per cent of what we throw away is paper, food packaging and coffee cups. The coffee cups are the worst part.' },
          { speaker: 'Trang', line: 'Why? They look like paper.' },
          { speaker: 'Khoa', line: 'They are lined with a thin layer of plastic, so most recycling plants cannot process them. The cafe downstairs has started selling a reusable cup for sixty thousand dong.' },
          { speaker: 'Trang', line: 'That is a good idea, but people will forget to bring it. What about the canteen? They use disposable boxes for takeaway lunches.' },
          { speaker: 'Khoa', line: 'The manager told me they would switch to containers you pay a deposit for. You get the deposit back when you return the box.' },
          { speaker: 'Trang', line: 'That could work. And the printers — I noticed the default setting is single-sided.' },
          { speaker: 'Khoa', line: 'Changing the default to double-sided takes five minutes and would cut our paper use by about forty per cent. I have already asked IT.' },
          { speaker: 'Trang', line: 'Should we put bins with clearer labels on each floor? I still see plastic in the paper bin.' },
          { speaker: 'Khoa', line: 'Labels help a little, but what changed behaviour in other offices was putting the bins next to the desks rather than in the corridor. People sort correctly when the bin is within reach.' },
          { speaker: 'Trang', line: 'Then let us do a one-month trial on this floor and count the bags. If the landfill bags drop, we can ask management to fund it for the whole building.' },
          { speaker: 'Khoa', line: 'Agreed. I will write the proposal this afternoon and send it to you for comments.' },
        ],
        questions: [
          { id: 'L2-1', type: 'choice', prompt: 'What is Mr Hai worried about?', options: ['Traffic moving into the side streets', 'Losing his parking space', 'The cost of the bus lane', 'Noise from the buses'], answer: 'Traffic moving into the side streets', explain: 'Ông Hai lo xe sẽ tràn vào các đường nhánh.' },
          { id: 'L2-2', type: 'choice', prompt: 'What will happen to the side streets?', options: ['They will become one-way in alternating directions', 'They will be closed to cars', 'They will be widened', 'They will be reserved for buses'], answer: 'They will become one-way in alternating directions', explain: 'Đường nhánh sẽ thành một chiều, đổi hướng luân phiên.' },
          { id: 'L2-3', type: 'choice', prompt: 'How many parking permits does each flat receive?', options: ['One', 'Two', 'As many as it owns', 'None'], answer: 'One', explain: 'Mỗi hộ đăng ký được một giấy phép đỗ xe.' },
          { id: 'L2-4', type: 'choice', prompt: 'What will change about the bus service?', options: ['It will run much more often', 'It will be free', 'It will stop at the market only', 'It will use smaller buses'], answer: 'It will run much more often', explain: 'Tần suất tăng lên 8 phút/chuyến vào giờ cao điểm.' },
          { id: 'L2-5', type: 'choice', prompt: 'How will the council check whether the scheme works?', options: ['By publishing traffic counts every three months', 'By holding a public vote', 'By asking bus drivers', 'By counting passengers only'], answer: 'By publishing traffic counts every three months', explain: 'Công bố số liệu giao thông mỗi 3 tháng trong 2 năm.' },
          { id: 'L2-6', type: 'fill', prompt: 'Mr Hai also asks for a ___ near the market. (one word)', answers: ['crossing'], explain: '“a crossing near the market”.' },
          { id: 'L2-7', type: 'choice', prompt: 'Why are coffee cups a problem?', options: ['They have a plastic lining', 'They are made of glass', 'They are too large', 'They contain food waste'], answer: 'They have a plastic lining', explain: 'Cốc giấy có lớp nhựa mỏng nên khó tái chế.' },
          { id: 'L2-8', type: 'choice', prompt: 'What will the canteen introduce?', options: ['Containers with a refundable deposit', 'Cheaper paper boxes', 'A ban on takeaway food', 'Reusable plates only indoors'], answer: 'Containers with a refundable deposit', explain: 'Hộp đựng phải đặt cọc, trả hộp thì lấy lại tiền cọc.' },
          { id: 'L2-9', type: 'choice', prompt: 'What would cut paper use by about forty per cent?', options: ['Changing the printer default to double-sided', 'Removing the printers', 'Printing fewer reports', 'Buying smaller paper'], answer: 'Changing the printer default to double-sided', explain: 'Đổi mặc định sang in hai mặt giảm khoảng 40% giấy.' },
          { id: 'L2-10', type: 'choice', prompt: 'What changed behaviour in other offices?', options: ['Putting the bins next to the desks', 'Adding clearer labels', 'Holding training sessions', 'Sending reminder emails'], answer: 'Putting the bins next to the desks', explain: 'Đặt thùng ngay cạnh bàn hiệu quả hơn dán nhãn.' },
          { id: 'L2-11', type: 'choice', prompt: 'What will they do before asking for funding?', options: ['Run a one-month trial and count the bags', 'Ask the manager to decide', 'Survey all employees', 'Buy new bins'], answer: 'Run a one-month trial and count the bags', explain: 'Thử nghiệm một tháng và đếm số túi rác.' },
          { id: 'L2-12', type: 'fill', prompt: 'Khoa will write the proposal this ___ . (one word)', answers: ['afternoon'], explain: '“I will write the proposal this afternoon.”' },
        ],
      },
      {
        id: 'L3',
        title: 'Part 3 · Bài nói',
        instruction: 'Bạn sẽ nghe 2 bài nói. Phần 1 có 8 câu hỏi, phần 2 có 7 câu hỏi.',
        transcript: [
          { speaker: 'Lecturer', line: 'This morning I want to discuss something you can measure simply by walking across a city on a hot afternoon: the temperature is often five or six degrees higher in the centre than in a suburb ten kilometres away. This is the urban heat island, and it is not caused by global warming alone.' },
          { speaker: 'Lecturer', line: 'The causes are not mysterious. Dark surfaces such as asphalt and concrete absorb solar radiation during the day and release it slowly at night. Tall buildings trap that heat near the ground, and the removal of vegetation eliminates both the shade and the cooling effect of water evaporating from leaves. A mature tree, for example, cools the air around it as effectively as several small air conditioners — and it does so without using electricity.' },
          { speaker: 'Lecturer', line: 'The health consequences are unevenly distributed. Heat exhaustion and heart problems increase, but those most at risk are rarely the people who caused the problem: elderly residents, outdoor workers and families living in rented flats without air conditioning. In one city, researchers found a difference of four degrees between the wealthiest and the poorest districts, and that difference was a difference in planting, not in climate.' },
          { speaker: 'Lecturer', line: 'So what can be done? The most effective measures are also the cheapest, though they take time to work. Planting trees along streets and in school playgrounds is the classic example. Painting roofs white or fitting reflective coatings helps immediately, especially on large flat roofs. Replacing asphalt in parking areas with permeable surfaces lets rainwater soak away, so the ground stays cooler and drains better during storms.' },
          { speaker: 'Lecturer', line: 'Air conditioning, by contrast, is a partial solution that can make the problem worse. It cools one room while releasing heat into the street, so it works for the individual and fails for the neighbourhood.' },
          { speaker: 'Lecturer', line: 'There is also a planning dimension. Cities designed around cars have large areas of unshaded asphalt and very little space for trees, whereas cities that keep narrow streets and courtyards, as many older Mediterranean towns do, are measurably cooler at the same latitude.' },
          { speaker: 'Lecturer', line: 'Finally, be careful about measurement. Official weather stations are often placed in parks or at airports, so the temperature reported on the news may be three degrees lower than what you experience on a shopping street at two o’clock. Local measurements, collected by residents themselves, are now being used by several city governments to decide where to plant first.' },
          { speaker: 'Lecturer', line: 'So the lesson is this: heat in cities is largely a design problem, and therefore it has a design solution. The cheapest tool we have is a tree, and the most expensive is a hospital bed.' },
          { speaker: 'Narrator', line: 'Now listen to a short radio talk about congestion charging.' },
          { speaker: 'Presenter', line: 'Fifteen years ago, the centre of our city was famous for two things: beautiful old streets and traffic that hardly moved. On an average weekday, cars crawled through the historic quarter at about eleven kilometres an hour, and the buses were slower still.' },
          { speaker: 'Presenter', line: 'In 2011 the council introduced a congestion charge. Drivers entering the central zone between seven in the morning and six in the evening pay a fee, while residents and night-time delivery vehicles are exempt. By law, the money cannot go into the general budget: it must be spent on public transport and cycle lanes.' },
          { speaker: 'Presenter', line: 'The predictions were gloomy. Shopkeepers warned that customers would abandon the centre for out-of-town retail parks. Motoring groups argued that the charge was simply a tax on people who had no alternative.' },
          { speaker: 'Presenter', line: 'The results after fifteen years are more interesting than either side expected. Traffic entering the zone fell by about a quarter, and it has stayed at that level. Bus journey times inside the centre dropped by almost a third, which made the bus genuinely competitive for the first time.' },
          { speaker: 'Presenter', line: 'Retail did not collapse. Turnover in the central zone rose slightly, but the mix of shops changed: small food shops and services gained, while some furniture and electrical stores moved out, because a customer who is buying a sofa would rather drive. The council had not predicted that at all.' },
          { speaker: 'Presenter', line: 'The biggest surprise concerned air quality. Nitrogen dioxide fell faster than expected, but the improvement was concentrated on the streets where the charge applied. On the ring road, where traffic increased, pollution actually rose. The scheme moved the problem as well as reducing it.' },
          { speaker: 'Presenter', line: 'So what would the council do differently? Two things. It would introduce the charge with a much better bus service on day one rather than in year three, and it would have planned for the boundary streets, which are now the most congested roads in the city.' },
        ],
        questions: [
          { id: 'L3-1', type: 'choice', prompt: 'What is the urban heat island?', options: ['Cities are hotter than the areas around them', 'Cities have more storms than the countryside', 'Cities cool down faster at night', 'Cities have less rain than suburbs'], answer: 'Cities are hotter than the areas around them', explain: 'Trung tâm thành phố nóng hơn vùng ngoại ô 5–6 độ C.' },
          { id: 'L3-2', type: 'choice', prompt: 'What is one of the main causes?', options: ['Dark surfaces absorb and release heat', 'Too many trees in the centre', 'Electric cars on the roads', 'Underground railways'], answer: 'Dark surfaces absorb and release heat', explain: 'Bê tông và nhựa đường hấp thụ nhiệt rồi nhả ra chậm.' },
          { id: 'L3-3', type: 'choice', prompt: 'What is special about the cooling from a mature tree?', options: ['It uses no electricity', 'It only works at night', 'It needs watering', 'It cools buildings only'], answer: 'It uses no electricity', explain: 'Cây trưởng thành làm mát hiệu quả như vài máy điều hoà nhưng không tốn điện.' },
          { id: 'L3-4', type: 'choice', prompt: 'What did the researchers find between rich and poor districts?', options: ['A four-degree difference caused by planting', 'A difference caused by wind', 'No measurable difference', 'A difference only in winter'], answer: 'A four-degree difference caused by planting', explain: 'Chênh 4 độ giữa khu giàu và khu nghèo, do cây xanh chứ không do khí hậu.' },
          { id: 'L3-5', type: 'choice', prompt: 'Which measure does the lecturer call the classic cheapest example?', options: ['Planting trees', 'Painting roofs', 'Using air conditioning', 'Building taller buildings'], answer: 'Planting trees', explain: 'Trồng cây là ví dụ kinh điển, rẻ nhất nhưng cần thời gian.' },
          { id: 'L3-6', type: 'choice', prompt: 'Why is air conditioning only a partial solution?', options: ['It releases heat into the street', 'It is too expensive to buy', 'It breaks down in summer', 'It uses too much water'], answer: 'It releases heat into the street', explain: 'Làm mát một phòng nhưng đẩy nhiệt ra đường.' },
          { id: 'L3-7', type: 'fill', prompt: 'Reported temperatures may be lower because official weather stations are often in parks or at ___ . (one word)', answers: ['airports'], explain: '“often placed in parks or at airports”.' },
          { id: 'L3-8', type: 'choice', prompt: 'What is the lecturer’s main conclusion?', options: ['Heat in cities is a design problem with a design solution', 'Cities should buy more air conditioners', 'Global warming is the only cause', 'Nothing can be done about urban heat'], answer: 'Heat in cities is a design problem with a design solution', explain: 'Kết luận: nhiệt độ đô thị là vấn đề thiết kế nên có giải pháp thiết kế.' },
          { id: 'L3-9', type: 'choice', prompt: 'How fast did cars move before the charge?', options: ['About eleven kilometres an hour', 'About twenty kilometres an hour', 'About five kilometres an hour', 'About thirty kilometres an hour'], answer: 'About eleven kilometres an hour', explain: '“at about eleven kilometres an hour”.' },
          { id: 'L3-10', type: 'choice', prompt: 'What must the charge money be spent on?', options: ['Public transport and cycle lanes', 'Road widening', 'Police services', 'The general budget'], answer: 'Public transport and cycle lanes', explain: 'Theo luật, tiền phí chỉ được dùng cho giao thông công cộng và làn xe đạp.' },
          { id: 'L3-11', type: 'choice', prompt: 'What did shopkeepers predict?', options: ['Customers would shop out of town', 'Rents would fall immediately', 'Tourists would stop coming', 'Delivery costs would double'], answer: 'Customers would shop out of town', explain: 'Chủ cửa hàng lo khách sẽ chuyển ra các trung tâm mua sắm ngoại thành.' },
          { id: 'L3-12', type: 'fill', prompt: 'Traffic entering the zone fell by about a ___ . (one word)', answers: ['quarter'], explain: '“fell by about a quarter”.' },
          { id: 'L3-13', type: 'choice', prompt: 'What happened to turnover in the centre?', options: ['It rose slightly', 'It fell sharply', 'It stayed exactly the same', 'It doubled'], answer: 'It rose slightly', explain: 'Doanh thu trung tâm tăng nhẹ, nhưng cơ cấu cửa hàng thay đổi.' },
          { id: 'L3-14', type: 'choice', prompt: 'What was the biggest surprise about air quality?', options: ['Pollution rose on the ring road', 'It did not improve at all', 'It improved everywhere equally', 'It improved only at weekends'], answer: 'Pollution rose on the ring road', explain: 'Ô nhiễm tăng ở đường vành đai — vấn đề bị dịch chuyển chứ không mất đi.' },
          { id: 'L3-15', type: 'choice', prompt: 'What would the council do differently?', options: ['Improve buses from the first day', 'Charge a higher fee', 'Exempt all residents', 'Start the scheme in winter'], answer: 'Improve buses from the first day', explain: 'Lẽ ra phải nâng cấp xe buýt ngay từ đầu, không phải đến năm thứ ba.' },
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
            title: 'Thông báo thu gom rác',
            text: 'From 1 October, glass will be collected on the first Wednesday of each month only. Please rinse jars and remove metal lids. Broken drinking glasses and mirrors cannot be recycled because they melt at a different temperature from bottles.',
            questions: [
              { id: 'R1-1q', type: 'choice', prompt: 'Which item cannot be recycled with bottles?', options: ['Broken drinking glasses', 'Glass jars', 'Metal lids', 'Rinsed bottles'], answer: 'Broken drinking glasses', explain: 'Ly vỡ và gương không tái chế cùng chai vì nhiệt độ nóng chảy khác.' },
            ],
          },
          {
            id: 'R1-2',
            title: 'Email',
            text: 'Dear residents, Thank you for attending the meeting about the new cycle path. The plans are now available in the library and online. Please send any comments before 15 May; after that date the design will be finalised and work will begin in June.',
            questions: [
              { id: 'R1-2q', type: 'choice', prompt: 'What happens after 15 May?', options: ['The design is finalised', 'Work begins immediately', 'Another meeting is held', 'The plans are published'], answer: 'The design is finalised', explain: 'Sau 15/5 thiết kế được chốt, tháng Sáu mới khởi công.' },
            ],
          },
          {
            id: 'R1-3',
            title: 'Quảng cáo',
            text: 'Solar panels for your roof — free survey and a ten-year guarantee. Average households cut their electricity bill by 40 per cent. Payment can be spread over five years, and the first three months cost nothing while your system is being monitored.',
            questions: [
              { id: 'R1-3q', type: 'choice', prompt: 'What is free for the first three months?', options: ['The payments', 'The survey', 'The monitoring equipment', 'The installation'], answer: 'The payments', explain: 'Ba tháng đầu không phải trả tiền trong khi hệ thống được theo dõi.' },
            ],
          },
          {
            id: 'R1-4',
            title: 'Đánh giá dịch vụ',
            text: 'The new bus route has halved my journey to work, and the vehicles are clean and quiet. My only complaint is the timetable: the last bus leaves the city centre at nine, which makes it useless for anyone working in a restaurant or a cinema.',
            questions: [
              { id: 'R1-4q', type: 'choice', prompt: 'What is the complaint?', options: ['The last bus leaves too early', 'The buses are dirty', 'The route is too long', 'The drivers are unfriendly'], answer: 'The last bus leaves too early', explain: 'Chuyến cuối rời trung tâm lúc 9 giờ — quá sớm cho người làm ca tối.' },
            ],
          },
          {
            id: 'R1-5',
            title: 'Trung tâm tái chế',
            text: 'Household Recycling Centre · Monday to Friday 8:00–17:00 · Saturday 9:00–13:00 · Closed Sunday. Commercial vehicles must book a slot. Garden waste is accepted in the northern yard only, and plastic bags are not permitted for any material.',
            questions: [
              { id: 'R1-5q', type: 'choice', prompt: 'Where is garden waste accepted?', options: ['In the northern yard', 'At the main gate', 'In the booking office', 'Nowhere on weekdays'], answer: 'In the northern yard', explain: 'Rác vườn chỉ nhận ở sân phía bắc.' },
            ],
          },
          {
            id: 'R1-6',
            title: 'Ghi chú nội bộ',
            text: 'To all staff: from next month, the office will no longer provide bottles of drinking water for meetings. Filtered water is available in the kitchen, and glasses are stacked beside the sink. Please wash your own glass after use.',
            questions: [
              { id: 'R1-6q', type: 'choice', prompt: 'What is the main change?', options: ['Bottled water will not be provided', 'The kitchen will close', 'Staff must bring their own glasses', 'Meetings will move rooms'], answer: 'Bottled water will not be provided', explain: 'Văn phòng không cung cấp nước đóng chai cho cuộc họp nữa.' },
            ],
          },
          {
            id: 'R1-7',
            title: 'Hướng dẫn làm phân hữu cơ',
            text: 'Home composting guide — add fruit and vegetable waste, tea leaves, grass cuttings and paper. Do not add meat, fish, dairy products or cooked food, as these attract rats. Turn the mixture once a week and keep it as damp as a squeezed sponge.',
            questions: [
              { id: 'R1-7q', type: 'choice', prompt: 'What should not be put in the compost?', options: ['Cooked food and meat', 'Grass cuttings', 'Tea leaves', 'Paper'], answer: 'Cooked food and meat', explain: 'Thịt, cá, sữa và đồ chín thu hút chuột nên không được cho vào.' },
            ],
          },
          {
            id: 'R1-8',
            title: 'Lời mời',
            text: 'Join us for Clean-up Sunday at Riverside Park. We meet at 8 a.m. near the boathouse; equipment is supplied by the council. Children under 12 must be accompanied by an adult. Refreshments will be served at 11 a.m. for all volunteers.',
            questions: [
              { id: 'R1-8q', type: 'choice', prompt: 'What is the rule for children under 12?', options: ['They must come with an adult', 'They cannot take part', 'They start at 11 a.m.', 'They must bring equipment'], answer: 'They must come with an adult', explain: 'Trẻ dưới 12 tuổi phải có người lớn đi cùng.' },
            ],
          },
          {
            id: 'R1-9',
            title: 'Ý kiến của chuyên gia',
            text: 'The proposal to widen the road would reduce congestion for perhaps four years. Traffic research consistently shows that new capacity attracts new journeys, so the queues return. A tram line carries three times as many people per metre of street and keeps that advantage permanently.',
            questions: [
              { id: 'R1-9q', type: 'choice', prompt: 'Why does the writer oppose widening the road?', options: ['New capacity attracts new traffic', 'It is too expensive to build', 'It would damage houses', 'Trams are more comfortable'], answer: 'New capacity attracts new traffic', explain: 'Mở rộng đường tạo thêm nhu cầu đi lại nên tắc lại quay về.' },
            ],
          },
          {
            id: 'R1-10',
            title: 'Bài đăng trên diễn đàn',
            text: 'I cycled to work for a year and then stopped, because there was nowhere safe to leave the bike at my office. A rack and a camera would have cost the company less than one parking space. Infrastructure is not only about roads.',
            questions: [
              { id: 'R1-10q', type: 'choice', prompt: 'Why did the writer stop cycling?', options: ['There was no safe place to park the bike', 'The journey was too long', 'The weather was bad', 'The bike was stolen'], answer: 'There was no safe place to park the bike', explain: 'Không có chỗ để xe an toàn ở cơ quan.' },
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
            title: 'Getting people out of their cars',
            text: `Ask a city planner what stops people from cycling and the answer is usually the weather or the hills. Both matter, but neither explains why a flat, mild city such as Amsterdam or Copenhagen has so many more cyclists than a city with a similar climate and twice the population. The explanation lies in infrastructure, and more precisely in one detail: whether the cycle lane is protected by a physical barrier or merely painted on the road.

The distinction sounds trivial. It is not. A painted lane communicates a request: please share this space politely. A protected lane, separated by a kerb, a row of parked cars or a raised strip of grass, communicates a fact: this space belongs to bicycles. Studies that compare the two consistently find that painted lanes increase cycling by a few per cent, while protected ones can triple it.

The reason is psychological rather than athletic. Surveys of people who do not cycle rarely mention fitness or speed. They mention fear, and they describe that fear precisely: it is not the busy main road that worries them, but the junction where the lane ends and the cyclist must merge with turning traffic. A network that is protected for ninety per cent of its length therefore still feels unsafe, because the remaining ten per cent contains almost all of the risk.

This has an uncomfortable implication for city budgets. Painting a hundred kilometres of lane is cheaper than building ten kilometres of protected track, and it produces a photograph that a mayor can present before an election. Yet the evidence suggests that the hundred kilometres may change almost nothing, while the ten kilometres — if they connect the places people actually travel between — will change a great deal.

Two further conditions are usually mentioned. The first is storage: people will not buy a bicycle if they must carry it up three flights of stairs, so secure parking at stations and in residential blocks matters as much as the route itself. The second is coherence. A single excellent route is a pleasant facility; a connected network is a transport system.

None of this means that cycling is suitable for every journey or every city. It does mean that the question “will people cycle here?” has less to do with the population than with the streets that have been built for them.`,
            glossary: [
              { word: 'infrastructure', meaning: 'hạ tầng' },
              { word: 'barrier', meaning: 'rào chắn, vật ngăn' },
              { word: 'trivial', meaning: 'nhỏ nhặt, không quan trọng' },
              { word: 'merge', meaning: 'hoà vào dòng xe' },
              { word: 'implication', meaning: 'hệ quả, ẩn ý' },
              { word: 'coherence', meaning: 'tính liên kết, mạch lạc' },
            ],
            questions: [
              { id: 'R2-1q1', type: 'choice', prompt: 'What is the writer’s main claim?', options: ['Infrastructure explains cycling levels better than climate', 'Weather is the only real obstacle to cycling', 'Hills make cycling impossible', 'Cycling suits only small cities'], answer: 'Infrastructure explains cycling levels better than climate', explain: 'Thời tiết và địa hình không giải thích được khác biệt; hạ tầng mới là câu trả lời.' },
              { id: 'R2-1q2', type: 'choice', prompt: 'Why does the weather explanation fail?', options: ['Cities with similar climates differ enormously', 'Nobody has ever studied the weather', 'Cyclists enjoy rain', 'The climate is the same everywhere'], answer: 'Cities with similar climates differ enormously', explain: 'Hai thành phố khí hậu giống nhau nhưng lượng người đi xe đạp rất khác.' },
              { id: 'R2-1q3', type: 'choice', prompt: 'Why does the difference between painted and protected lanes matter?', options: ['Only one of them changes behaviour on a large scale', 'One of them costs nothing', 'Painted lanes are dangerous for cars', 'Protected lanes are illegal in some cities'], answer: 'Only one of them changes behaviour on a large scale', explain: 'Làn sơn chỉ tăng vài phần trăm, làn có rào chắn có thể tăng gấp ba.' },
              { id: 'R2-1q4', type: 'choice', prompt: 'What do non-cyclists say worries them most?', options: ['Junctions where they must mix with traffic', 'The speed of other cyclists', 'Riding uphill', 'Carrying luggage'], answer: 'Junctions where they must mix with traffic', explain: 'Nỗi sợ tập trung ở giao lộ — nơi làn xe kết thúc.' },
              { id: 'R2-1q5', type: 'choice', prompt: 'Why can a network protected for 90% of its length still feel unsafe?', options: ['All the risk is concentrated in the remaining 10%', 'Cyclists cannot see the barrier', 'Drivers ignore the law', 'The last section is uphill'], answer: 'All the risk is concentrated in the remaining 10%', explain: 'Mười phần trăm còn lại chứa gần hết rủi ro.' },
              { id: 'R2-1q6', type: 'fill', prompt: 'Painting a hundred kilometres of lane is cheaper than building ten kilometres of protected ___ . (one word)', answers: ['track'], explain: '“ten kilometres of protected track”.' },
              { id: 'R2-1q7', type: 'choice', prompt: 'What does the writer suggest about painted lanes and politicians?', options: ['They are attractive because they are cheap and visible', 'They are supported by cyclists', 'They are banned in most cities', 'They are technically difficult to build'], answer: 'They are attractive because they are cheap and visible', explain: 'Rẻ và có ảnh đẹp để trình bày trước bầu cử.' },
              { id: 'R2-1q8', type: 'choice', prompt: 'What is the second condition mentioned?', options: ['The routes must form a connected network', 'Lanes must be painted in bright colours', 'Cycling must be free of charge', 'Bikes must be provided by the city'], answer: 'The routes must form a connected network', explain: 'Một tuyến tốt chỉ là tiện ích; mạng lưới liên kết mới là hệ thống giao thông.' },
              { id: 'R2-1q9', type: 'fill', prompt: 'People will not buy a bicycle if they must carry it up three flights of ___ . (one word)', answers: ['stairs'], explain: '“carry it up three flights of stairs”.' },
              { id: 'R2-1q10', type: 'choice', prompt: 'What is the writer’s attitude towards painted lanes?', options: ['Sceptical about how much they achieve', 'Enthusiastic about their low cost', 'Angry that they are unsafe', 'Uninterested in the debate'], answer: 'Sceptical about how much they achieve', explain: 'Tác giả hoài nghi: làn sơn có thể “change almost nothing”.' },
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
            title: 'Bringing nature back into the city',
            text: `When a city replaces a derelict railway yard with a park, residents usually describe the result in terms of beauty. Public health researchers describe something else: a measurable change in how often people walk, how well they sleep and how many of them report feeling isolated.

The evidence for a link between green space and health is now substantial, although the size of the effect is easy to exaggerate. Studies in several European countries have found that residents living within three hundred metres of a park are more likely to walk for thirty minutes a day, and less likely to report high levels of stress. The differences are real but moderate, and they are largest among people who were previously inactive.

What is less well understood is why. Three explanations compete. The first is simply space: a park provides somewhere to exercise, and exercise improves health. The second is social: parks create opportunities for casual contact, and even brief greetings reduce loneliness, which is itself a recognised risk factor for illness. The third is attention: natural environments appear to restore the ability to concentrate, which is why a walk among trees can feel easier than the same distance along a main road.

These explanations have different consequences for policy, and this is where the argument becomes practical. If space is the main reason, a large sports field will do. If social contact matters, then benches, paved paths and small cafés matter, because these are what bring people together. If attention restoration is the key, it is the quality of the greenery — trees, water, variety — rather than the size of the area that counts.

Unfortunately, most cities measure green space with a single indicator: square metres per inhabitant. This figure is convenient and almost useless. A hectare of grass that nobody visits satisfies the statistic while changing nothing. A narrow but well-used strip of trees along a canal may improve a neighbourhood far more.

A further difficulty is displacement. When a derelict area becomes attractive, rents in the surrounding streets tend to rise, and the residents who would have benefited most from the new park are often the first to be priced out of the area. Several cities now require new parks to be accompanied by housing policies that protect existing tenants.

So the honest conclusion is that green space is a genuine but conditional medicine. It works when it is close, safe, well designed and actually used — and it can fail on every one of those conditions.`,
            glossary: [
              { word: 'derelict', meaning: 'bị bỏ hoang, xuống cấp' },
              { word: 'moderate', meaning: 'vừa phải, khiêm tốn' },
              { word: 'restore', meaning: 'phục hồi' },
              { word: 'indicator', meaning: 'chỉ số' },
              { word: 'displacement', meaning: 'sự dịch chuyển dân cư' },
              { word: 'tenant', meaning: 'người thuê nhà' },
            ],
            questions: [
              { id: 'R3-1q1', type: 'choice', prompt: 'What do health researchers notice in a new park?', options: ['Changes in behaviour and wellbeing', 'A fall in property prices', 'More traffic in the area', 'Fewer shops nearby'], answer: 'Changes in behaviour and wellbeing', explain: 'Họ đo được thay đổi về vận động, giấc ngủ và cảm giác cô đơn.' },
              { id: 'R3-1q2', type: 'choice', prompt: 'How does the writer describe the size of the health effect?', options: ['Real but easy to exaggerate', 'Enormous and undeniable', 'Too small to matter', 'Impossible to measure'], answer: 'Real but easy to exaggerate', explain: 'Bằng chứng vững nhưng mức độ ảnh hưởng dễ bị phóng đại.' },
              { id: 'R3-1q3', type: 'choice', prompt: 'Among whom is the effect largest?', options: ['People who were previously inactive', 'Professional athletes', 'Children under five', 'People who live far from the park'], answer: 'People who were previously inactive', explain: '“largest among people who were previously inactive”.' },
              { id: 'R3-1q4', type: 'choice', prompt: 'Which explanation is linked to concentration?', options: ['Attention restoration', 'The space explanation', 'The social explanation', 'The economic explanation'], answer: 'Attention restoration', explain: 'Giải thích thứ ba: thiên nhiên phục hồi khả năng tập trung.' },
              { id: 'R3-1q5', type: 'choice', prompt: 'Why do benches and cafés matter in the social explanation?', options: ['They encourage people to meet', 'They raise the value of the park', 'They provide shade', 'They reduce litter'], answer: 'They encourage people to meet', explain: 'Ghế và quán nhỏ tạo cơ hội gặp gỡ, giảm cô đơn.' },
              { id: 'R3-1q6', type: 'fill', prompt: 'If attention restoration is the key, the ___ of the greenery matters more than the area. (one word)', answers: ['quality'], explain: '“it is the quality of the greenery … rather than the size”.' },
              { id: 'R3-1q7', type: 'choice', prompt: 'Why does the writer criticise square metres per inhabitant?', options: ['It says nothing about whether the space is used', 'It is difficult to calculate', 'It favours rich districts', 'It ignores water features'], answer: 'It says nothing about whether the space is used', explain: 'Một hecta cỏ không ai tới vẫn đạt chỉ số nhưng chẳng thay đổi gì.' },
              { id: 'R3-1q8', type: 'fill', prompt: 'A hectare of grass that nobody ___ satisfies the statistic while changing nothing. (one word)', answers: ['visits'], explain: '“A hectare of grass that nobody visits”.' },
              { id: 'R3-1q9', type: 'choice', prompt: 'What is the displacement problem?', options: ['Rising rents push out the residents who need the park most', 'Wild animals move into the park', 'The park is built in the wrong place', 'Traffic is displaced to side streets'], answer: 'Rising rents push out the residents who need the park most', explain: 'Khu đất đẹp lên thì giá thuê tăng, đẩy người thuê cũ ra ngoài.' },
              { id: 'R3-1q10', type: 'choice', prompt: 'What is the writer’s conclusion?', options: ['Green space helps only under certain conditions', 'Green space is always good for health', 'Parks should be replaced by sports fields', 'Health effects have been proved false'], answer: 'Green space helps only under certain conditions', explain: 'Không gian xanh là “liều thuốc có điều kiện”: gần, an toàn, thiết kế tốt và được dùng.' },
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
            title: 'Where your plastic actually goes',
            text: `(1)___ most households now sort their rubbish carefully, they assume that a plastic bottle placed in the right bin will be recycled. The reality is considerably less tidy.

Recycling works only when three conditions are met: the material can be processed, somebody wants to buy the processed material, and there is a market price (2)___ covers the cost. When any of the three fails, collected plastic is stored, burned or buried — (3)___ it was carefully separated at home.

Contamination is the most common practical problem. A container that still holds food cannot be processed cheaply, and a single greasy pizza box can spoil (4)___ entire batch. For this reason, many centres now (5)___ heavily on automated sorting, using magnets, air jets and optical sensors rather than human hands.

Technology, however, cannot solve the economics. Recycled plastic must compete (6)___ new plastic made from oil, and when oil is cheap, virgin plastic is cheaper. Governments have therefore begun to intervene, either by taxing virgin plastic (7)___ by requiring manufacturers to use a minimum percentage of recycled material.

Consumers can help, but they should be realistic about how much. Rinsing a bottle takes a few seconds and genuinely improves the value of the material, and buying a refillable bottle reduces the problem at its (8)___. What does not help is “wishcycling” — putting doubtful items into the recycling bin in the hope that somebody else will deal with them. That hope is usually (9)___, and it lowers the quality of everything around it.

The most useful habit, surprisingly, is to read the label before buying the container, because the cheapest moment to avoid plastic waste is the moment (10)___ it enters your home.`,
            questions: [
              { id: 'R4-1q1', type: 'choice', prompt: 'Chỗ (1)', options: ['Because', 'Although', 'Unless', 'Despite'], answer: 'Because', explain: 'Vì các hộ dân phân loại kỹ nên họ mới tin là được tái chế → quan hệ nguyên nhân.' },
              { id: 'R4-1q2', type: 'choice', prompt: 'Chỗ (2)', options: ['which', 'who', 'whose', 'what'], answer: 'which', explain: 'Mệnh đề quan hệ thay cho “a market price” (vật).' },
              { id: 'R4-1q3', type: 'choice', prompt: 'Chỗ (3)', options: ['even though', 'so that', 'in order to', 'as if'], answer: 'even though', explain: 'Tương phản: bị chôn/đốt dù đã được phân loại kỹ ở nhà.' },
              { id: 'R4-1q4', type: 'choice', prompt: 'Chỗ (4)', options: ['an', 'a', 'the', 'some'], answer: 'an', explain: '“an entire batch” — entire bắt đầu bằng nguyên âm.' },
              { id: 'R4-1q5', type: 'choice', prompt: 'Chỗ (5)', options: ['rely', 'relies', 'relying', 'reliance'], answer: 'rely', explain: 'Chủ ngữ số nhiều “many centres” + trạng từ “now” → rely.' },
              { id: 'R4-1q6', type: 'choice', prompt: 'Chỗ (6)', options: ['with', 'to', 'among', 'across'], answer: 'with', explain: '“compete with” = cạnh tranh với.' },
              { id: 'R4-1q7', type: 'choice', prompt: 'Chỗ (7)', options: ['or', 'and', 'nor', 'but'], answer: 'or', explain: 'Cấu trúc “either … or …”.' },
              { id: 'R4-1q8', type: 'choice', prompt: 'Chỗ (8)', options: ['source', 'sauce', 'resource', 'purpose'], answer: 'source', explain: '“at its source” = ngay tại nguồn.' },
              { id: 'R4-1q9', type: 'choice', prompt: 'Chỗ (9)', options: ['misplaced', 'misplacing', 'misplace', 'misplacement'], answer: 'misplaced', explain: 'Sau “is” cần tính từ: hope is misplaced (niềm hy vọng đặt sai chỗ).' },
              { id: 'R4-1q10', type: 'choice', prompt: 'Chỗ (10)', options: ['when', 'which', 'where', 'whose'], answer: 'when', explain: '“the moment when it enters your home” — mệnh đề quan hệ chỉ thời gian.' },
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
        title: 'Task 1 · Email đề xuất chiến dịch giảm rác thải nhựa',
        prompt: 'Your neighbourhood association is planning its activities for the coming year. Write an email (about 120 words) to the chairperson, Mr Long. In your email: explain why you are writing, describe the plastic waste problem in the area, suggest two practical actions, and ask whether you can present your idea at the next meeting.',
        minWords: 120,
        checklist: [
          { label: 'Có lời chào và lời kết trang trọng', hint: 'Dear Mr Long, … / Yours sincerely,' },
          { label: 'Nêu rõ mục đích của email', hint: 'I am writing to suggest…' },
          { label: 'Mô tả vấn đề rác thải nhựa trong khu phố', hint: 'In recent months, I have noticed that…' },
          { label: 'Đề xuất 2 hành động cụ thể', hint: 'First, we could… Second, it would help to…' },
          { label: 'Nói rõ lợi ích của đề xuất', hint: 'This would reduce… / It would cost very little because…' },
          { label: 'Hỏi xem có thể trình bày tại buổi họp tới không', hint: 'Would it be possible for me to…?' },
          { label: 'Đủ số từ (~120) và dùng giọng điệu lịch sự, không ra lệnh', hint: 'Dùng “could”, “would”, “might” thay vì “must”, “have to”' },
        ],
        tips: [
          'Task 1 B2 cần 4 ý; hãy dành khoảng 20 phút và luôn đọc lại để kiểm tra thì và mạo từ.',
          'Đề xuất nên kèm lợi ích hoặc chi phí cụ thể, vì điều này thể hiện tư duy thuyết phục.',
          'Tránh mở đầu bằng “I am writing to you because I want…” — dài dòng; dùng “I am writing to suggest…” gọn hơn.',
        ],
        model: `Dear Mr Long,

I am writing to suggest an activity for our association’s programme next year. In recent months I have noticed that the area around the market is full of plastic bags and drink containers, especially on Monday mornings after the weekend.

The problem is not only untidiness. The drains near the market become blocked, and after heavy rain the water stays on the pavement for days, which is unpleasant for the traders as well as the residents.

I would like to propose two practical actions. First, we could ask three local shops to offer a small discount to customers who bring their own bags. Second, the association could organise one clean-up morning each month with volunteers from the two apartment blocks, as the council will supply gloves and bags free of charge.

Would it be possible for me to present this idea at the next meeting? I am happy to prepare a one-page summary with approximate costs.

Thank you for your time.

Yours sincerely,
Trang`,
      },
      {
        id: 'W2',
        task: 2,
        title: 'Task 2 · Luận: có nên cấm xe cá nhân vào trung tâm?',
        prompt: 'Some people believe that private cars should be banned from city centres in order to reduce pollution and congestion. Others argue that such a ban would damage local businesses and inconvenience residents. Discuss both views and give your own opinion. Write an essay of about 250 words.',
        minWords: 250,
        checklist: [
          { label: 'Mở bài giới thiệu tranh luận và hướng làm bài', hint: 'The question of whether… has divided…' },
          { label: 'Đoạn thân bài 1: lợi ích của việc cấm xe', hint: 'Those who support a ban argue that…' },
          { label: 'Đoạn thân bài 2: bất lợi và lo ngại của người phản đối', hint: 'Opponents, by contrast, maintain that…' },
          { label: 'Nêu quan điểm cá nhân rõ ràng', hint: 'In my opinion, a complete ban is…' },
          { label: 'Có ít nhất 2 ví dụ cụ thể (thành phố, nghiên cứu, trải nghiệm)', hint: 'For instance, in… / In one survey…' },
          { label: 'Dùng từ nối học thuật giữa các đoạn', hint: 'Nevertheless, consequently, moreover, whereas' },
          { label: 'Có ít nhất 1 câu bị động hoặc câu điều kiện (cấu trúc B2)', hint: 'If cars were excluded… / Shops are often blamed…' },
          { label: 'Có 1 giải pháp trung dung ở phần ý kiến', hint: 'A gradual approach, such as a charge or a time limit, would…' },
          { label: 'Kết luận tóm tắt, không nêu ý mới', hint: 'In conclusion, …' },
          { label: 'Đủ số từ (~250)', hint: 'Kiểm tra số từ trong khung soạn thảo' },
        ],
        tips: [
          'Đừng biến bài thành “tôi thích/không thích xe hơi”; hãy tranh luận bằng lợi ích và chi phí của chính sách.',
          'Dùng số liệu hoặc ví dụ thành phố cụ thể (London, Singapore, Copenhagen) để tăng tính thuyết phục.',
          'Phần ý kiến cá nhân nên có mức độ: “a complete ban is too blunt; a charge plus better buses is fairer” — tránh cực đoan.',
          'Kiểm tra kỹ chủ ngữ số ít/số nhiều khi dùng các danh từ trừu tượng như congestion, pollution, traffic.',
        ],
        model: `The question of whether private cars should be excluded from city centres has divided residents, planners and shopkeepers for decades. Supporters point to cleaner air and faster journeys, while opponents warn of empty shops and inconvenience for those who need a car.

Those who support a ban argue that the centre of a city is a shared space and that private cars use it inefficiently. A single car carrying one person occupies space that could carry thirty passengers on a bus, and it produces pollution exactly where the greatest number of people breathe. Where restrictions have been introduced, the results are often striking: in one European city, traffic entering the central zone fell by about a quarter, and bus journey times dropped by nearly a third.

Opponents, by contrast, maintain that a ban is unfair to people who have no realistic alternative. Many residents work shifts that finish after the last bus, and small traders depend on customers who come by car with heavy shopping. Furthermore, evidence from several cities suggests that a ban does not remove the problem but moves it: pollution and congestion may simply increase on the roads just outside the restricted area. Shopkeepers in particular fear that their regular customers will drive to out-of-town centres instead.

In my opinion, a complete ban is too blunt an instrument, but doing nothing is worse. The fairest approach combines three elements: a charge rather than a prohibition, so that a driver who genuinely needs to enter the centre may do so; a reliable bus or tram service introduced on the same day as the charge; and secure parking at the edge of the city, so that the car can be left behind at a reasonable cost.

In conclusion, banning private cars would improve air quality and traffic flow, but it would also place a heavy burden on residents and traders who have no alternative. A charge supported by better public transport achieves most of the benefit without most of the injustice.`,
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
        instruction: 'Bạn sẽ nghe 3 câu hỏi về môi trường và đời sống đô thị. Trả lời mỗi câu 1–2 phút, nói tự nhiên như đang trò chuyện.',
        minutes: 3,
        questions: [
          { q: 'What do you like most about living in your area?', sample: 'The best thing is probably the market two streets away. I can buy fresh vegetables in five minutes, and the sellers know me, so it feels friendly. There is also a small park where I run in the morning. The disadvantage is the traffic on the main road, especially between five and seven in the evening, when the air smells strongly of exhaust.' },
          { q: 'How do you try to reduce waste in your daily life?', sample: 'I do three simple things. I always carry a cloth bag, so I rarely take plastic bags from shops. I keep a bottle on my desk and refill it instead of buying water. And I collect paper and cans separately, because our building has bins for them. I would like to compost food waste, but I live in a flat, so there is nowhere to put a bin.' },
          { q: 'Do you prefer travelling around the city by bus, by motorbike or on foot? Why?', sample: 'It depends on the distance. For anything under two kilometres I walk, because it takes about the same time as waiting for a bus. For longer journeys I take the bus if it is not rush hour, since I can read on the way. I use a motorbike only when I am carrying something heavy or when I am late, because parking in the centre is difficult and expensive.' },
        ],
      },
      {
        id: 'S2',
        kind: 'solution',
        title: 'Part 2 · Thảo luận giải pháp',
        instruction: 'Bạn và một người bạn đang bàn cách giải quyết tình trạng rác thải quanh khu chợ trong khu phố. Hãy thảo luận ưu điểm, nhược điểm của 3 lựa chọn rồi chọn một phương án và giải thích.',
        minutes: 4,
        situation: 'Your neighbourhood market produces a large amount of litter every evening, and the drains nearby are often blocked. The residents’ association has a small budget and can support only one of three proposals.',
        options: [
          'Install ten extra rubbish bins around the market and empty them daily',
          'Pay two cleaners to sweep the market area every evening',
          'Run an education campaign with traders and shoppers for six months',
        ],
        sample: `Let me consider the three proposals. Extra bins would make the problem visible and would work immediately, because most people will use a bin if there is one within a few metres. The difficulty is maintenance: bins that are not emptied attract flies and smell, and the daily cost continues for ever.

Paying two cleaners would guarantee that the area is clean every evening, which is exactly what residents want. However, it treats the symptom rather than the cause. If people continue to drop litter, the street will simply become dirty again a few hours later, and the association would be paying wages with no end date.

An education campaign with traders and shoppers is the only option that changes behaviour, which makes it the most durable. Traders are also the people most likely to influence their own customers, especially if they are given a stake in the project. The drawback is that results appear slowly, and a six-month campaign may show almost nothing in the first two months.

If I have to choose, I would combine the second and third options in a smaller form. I would hire one cleaner for the first three months, so residents see an immediate improvement, and use the remaining money to work with the traders on a simple rule: each stall keeps its own area clean and is responsible for the waste it produces. In that way the street looks better straight away while the underlying habit is being changed.`,
      },
      {
        id: 'S3',
        kind: 'topic',
        title: 'Part 3 · Phát triển chủ đề',
        instruction: 'Trình bày quan điểm của bạn về chủ đề dưới đây (khoảng 3 phút), dựa vào 3 gợi ý. Sau đó trả lời 2 câu hỏi mở rộng.',
        minutes: 5,
        topic: 'Cities should spend more money on public transport than on building new roads.',
        outline: [
          'Vì sao nên ưu tiên giao thông công cộng',
          'Vì sao vẫn cần một số tuyến đường mới',
          'Quan điểm của bạn và ví dụ từ nơi bạn sống',
        ],
        questions: [
          { q: 'Would you support a charge for drivers entering the centre of your city?', sample: 'I would support it, but only if two conditions were met first. The money would have to be spent on buses and cycle lanes rather than on the general budget, and the bus service would have to improve before the charge begins, not three years later. Otherwise the charge simply punishes people who have no alternative. If those two conditions were respected, I think it would work, because the revenue would fund the very service that makes driving unnecessary.' },
          { q: 'What can ordinary residents do to make their city greener?', sample: 'Small habits matter more than grand gestures, in my view. Walking or cycling for short journeys reduces both pollution and noise, and it is free. Sorting waste properly and rinsing containers genuinely improves recycling, because contamination is the biggest practical problem. Residents can also do something that is often forgotten: attend the public consultations. City plans are usually decided in rooms where very few people are present, so showing up, even once, has more influence than people expect.' },
        ],
      },
    ],
  },
};
