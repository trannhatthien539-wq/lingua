/**
 * Đề VSTEP C1 số 3 — chủ đề chính sách & môi trường (nội dung gốc, viết theo đúng format đề thi).
 * Bậc C1: văn bản dài hơn, lập luận chặt, từ vựng học thuật.
 */
export default {
  id: 'c1-03',
  level: 'C1',
  title: 'Đề C1 số 3 · Chính sách & môi trường',
  tags: ['chính sách', 'môi trường', 'C1'],

  listening: {
    minutes: 40,
    parts: [
      {
        id: 'L1',
        title: 'Part 1 · Thông báo ngắn',
        instruction: 'Bạn sẽ nghe 8 thông báo ngắn về các chính sách môi trường và đô thị. Mỗi thông báo có một câu hỏi. Chọn đáp án đúng nhất.',
        transcript: [
          { speaker: 'Narrator', line: 'Announcement one. From the first of next month, non-residents will pay a congestion charge to enter the historic centre between seven in the morning and seven in the evening. Deliveries made before seven will be exempt, and residents will continue to pay a reduced annual fee.' },
          { speaker: 'Narrator', line: 'Announcement two. The recycling centre on Mill Road will accept garden waste only on weekdays. At weekends the site is reserved for household items and electronic equipment, because the number of visitors has doubled since the new housing estate opened.' },
          { speaker: 'Narrator', line: 'Announcement three. A flood warning has been issued for the lower reaches of the river. Residents in the three streets nearest the bridge should move vehicles to higher ground this evening. The barrier will be closed at ten o’clock.' },
          { speaker: 'Narrator', line: 'Announcement four. The council is consulting on a proposal to plant trees along four main roads. Residents may comment online until the end of the month, and a public meeting will be held in the town hall on the nineteenth.' },
          { speaker: 'Narrator', line: 'Announcement five. Businesses installing solar panels before December can apply for a subsidy covering a quarter of the cost. Applications are processed in the order they are received, and the fund is expected to be exhausted within six weeks.' },
          { speaker: 'Narrator', line: 'Announcement six. Please note that the water quality report for the lake is now published on our website. Swimming remains discouraged until the bacterial count falls below the recommended level, which is expected within a fortnight.' },
          { speaker: 'Narrator', line: 'Announcement seven. The energy advice service will visit households in the northern district next week. Advisers will carry identity cards and will never ask for payment at the door. Appointments can be booked by telephone or online.' },
          { speaker: 'Narrator', line: 'Announcement eight. This is a reminder that from January, household waste will be collected fortnightly rather than weekly, but food waste will be collected every week. Larger bins are available on request at no extra charge.' },
        ],
        questions: [
          { id: 'L1-1', type: 'choice', prompt: 'Who will not pay the congestion charge?', options: ['Residents entering at noon', 'Deliveries made before seven', 'Non-residents in the evening', 'Visitors at weekends'], answer: 'Deliveries made before seven', explain: 'Giao hàng trước 7 giờ sáng được miễn phí.' },
          { id: 'L1-2', type: 'choice', prompt: 'Why is the weekend service restricted?', options: ['There is no staff at weekends', 'Visitor numbers have doubled', 'Garden waste is not produced then', 'Electronic items are banned'], answer: 'Visitor numbers have doubled', explain: 'Khu nhà ở mới khiến lượng khách tăng gấp đôi.' },
          { id: 'L1-3', type: 'choice', prompt: 'What should residents in the three streets do this evening?', options: ['Leave their homes', 'Move vehicles to higher ground', 'Close the barrier themselves', 'Collect sandbags'], answer: 'Move vehicles to higher ground', explain: '“move vehicles to higher ground this evening”.' },
          { id: 'L1-4', type: 'choice', prompt: 'How can residents respond to the tree proposal?', options: ['Only by attending the meeting', 'Online until the end of the month, or at the meeting', 'By writing to their councillor only', 'Through a telephone survey'], answer: 'Online until the end of the month, or at the meeting', explain: 'Có thể góp ý trực tuyến đến hết tháng hoặc tại cuộc họp.' },
          { id: 'L1-5', type: 'choice', prompt: 'What should businesses do quickly?', options: ['Wait until December', 'Apply early, because the fund will run out', 'Pay the full cost first', 'Form a group application'], answer: 'Apply early, because the fund will run out', explain: 'Quỹ dự kiến cạn trong sáu tuần, xét theo thứ tự nhận hồ sơ.' },
          { id: 'L1-6', type: 'choice', prompt: 'What is the advice about swimming?', options: ['It is safe now', 'It is discouraged until the bacterial count falls', 'It is allowed in the morning only', 'It is banned permanently'], answer: 'It is discouraged until the bacterial count falls', explain: 'Không nên bơi cho đến khi số vi khuẩn giảm.' },
          { id: 'L1-7', type: 'choice', prompt: 'What will the advisers never do?', options: ['Ask for payment at the door', 'Show an identity card', 'Visit on weekdays', 'Book appointments online'], answer: 'Ask for payment at the door', explain: '“will never ask for payment at the door”.' },
          { id: 'L1-8', type: 'choice', prompt: 'What is changing in January?', options: ['Food waste will be collected fortnightly', 'Household waste will be collected less often', 'Bins will be charged for', 'Collection will stop'], answer: 'Household waste will be collected less often', explain: 'Rác sinh hoạt thu hai tuần một lần, rác thực phẩm vẫn hằng tuần.' },
        ],
      },
      {
        id: 'L2',
        title: 'Part 2 · Hội thoại',
        instruction: 'Bạn sẽ nghe 2 đoạn hội thoại. Mỗi đoạn có 6 câu hỏi.',
        transcript: [
          { speaker: 'Chair', line: 'Before we vote, I want to be clear about what the levy is designed to do. It is not a punishment; it is a signal. If it does not change behaviour, it has failed, even if it raises money.' },
          { speaker: 'Member', line: 'I understand the principle, but I am worried about the delivery firms. They cannot switch to electric vans overnight, and the levy would fall on exactly the businesses that keep the centre alive.' },
          { speaker: 'Chair', line: 'That is why the draft exempts vehicles under three and a half tonnes until 2029, which covers most of the small traders. The charge applies to heavy goods vehicles and private cars at peak hours.' },
          { speaker: 'Member', line: 'And the revenue? I do not want it absorbed into the general budget.' },
          { speaker: 'Chair', line: 'By law it must be spent on transport. My proposal is to ring-fence it for the bus network in the outer districts, where the service was cut two years ago. That is also where the people least able to pay for a new car live.' },
          { speaker: 'Member', line: 'Then I would support it, on one condition: we publish the traffic counts every quarter, including the streets where we expect traffic to be displaced.' },
          { speaker: 'Chair', line: 'Agreed. Publishing the figures where we might be wrong is the only way to keep the argument honest.' },
          { speaker: 'Member', line: 'One last question. What happens if the counts show no effect after a year?' },
          { speaker: 'Chair', line: 'Then we review it and, if necessary, raise the charge or extend the hours. A policy with no expiry date and no measurement is just a slogan.' },
          { speaker: 'Narrator', line: 'Now listen to a conversation between a radio reporter and a farmer taking part in a rewilding scheme.' },
          { speaker: 'Reporter', line: 'You have given twelve hectares back to wetland. Why would a farmer do that?' },
          { speaker: 'Farmer', line: 'Two reasons, and I will be honest about the order. The first is money: the payments are guaranteed for ten years, and the land I gave up was the worst on the farm — it flooded every spring anyway.' },
          { speaker: 'Reporter', line: 'And the second?' },
          { speaker: 'Farmer', line: 'The second is that the flooding has changed. When I drained that field in 1998, the water went downstream faster and the village got the problem instead. I did not think about that at the time. Now the water sits on my land for three days and the village is dry.' },
          { speaker: 'Reporter', line: 'Do the payments cover the loss of production?' },
          { speaker: 'Farmer', line: 'Not entirely, but the field was unproductive, so I am close to breaking even. What worries me is what happens in year eleven, when the scheme ends. There is no guarantee of renewal, and once you rewild a field you cannot plough it again in a fortnight.' },
          { speaker: 'Reporter', line: 'What would make it work better?' },
          { speaker: 'Farmer', line: 'Two things. Longer contracts, so a young farmer can plan a working life around them. And payments for results, not just for land taken out of use — bird counts, water quality, that sort of thing. At the moment I am paid for doing nothing, which is not the same as being paid for doing something useful.' },
          { speaker: 'Reporter', line: 'Would you do it again?' },
          { speaker: 'Farmer', line: 'Yes, and I would do more of it. But I would want my neighbour doing it too, because a wetland split by a fence does not work. That is the part policy finds hardest: it pays individuals for a benefit that only exists collectively.' },
        ],
        questions: [
          { id: 'L2-1', type: 'choice', prompt: 'What does the chair say the levy is intended to do?', options: ['Raise as much money as possible', 'Change behaviour', 'Punish drivers', 'Reduce council spending'], answer: 'Change behaviour', explain: '“It is not a punishment; it is a signal.”' },
          { id: 'L2-2', type: 'choice', prompt: 'What is the member worried about?', options: ['The cost to the council', 'The effect on delivery firms', 'The number of cars', 'The legal position'], answer: 'The effect on delivery firms', explain: 'Lo ngại doanh nghiệp giao hàng không thể chuyển sang xe điện ngay.' },
          { id: 'L2-3', type: 'choice', prompt: 'Which vehicles are exempt until 2029?', options: ['All private cars', 'Vehicles under three and a half tonnes', 'Buses only', 'Electric vehicles only'], answer: 'Vehicles under three and a half tonnes', explain: 'Xe dưới 3,5 tấn được miễn đến 2029.' },
          { id: 'L2-4', type: 'choice', prompt: 'How must the revenue be spent?', options: ['On the general budget', 'On transport by law', 'On road widening', 'On street lighting'], answer: 'On transport by law', explain: '“By law it must be spent on transport.”' },
          { id: 'L2-5', type: 'choice', prompt: 'What condition does the member attach?', options: ['A public vote', 'Quarterly publication of traffic counts', 'An annual review of fares', 'A cap on the charge'], answer: 'Quarterly publication of traffic counts', explain: 'Công bố số liệu giao thông mỗi quý, kể cả nơi dự đoán có chuyển hướng.' },
          { id: 'L2-6', type: 'choice', prompt: 'What will happen if the counts show no effect after a year?', options: ['The policy ends automatically', 'It is reviewed and the charge may be raised', 'Nothing can be done', 'The council apologises'], answer: 'It is reviewed and the charge may be raised', explain: 'Xem xét lại, có thể tăng phí hoặc mở rộng khung giờ.' },
          { id: 'L2-7', type: 'choice', prompt: 'What is the farmer’s first reason for rewilding?', options: ['Personal belief', 'Money, plus the land was the worst on the farm', 'Pressure from neighbours', 'A legal requirement'], answer: 'Money, plus the land was the worst on the farm', explain: 'Thanh toán được bảo đảm mười năm và thửa đất vốn xấu nhất.' },
          { id: 'L2-8', type: 'choice', prompt: 'What did draining the field in 1998 cause?', options: ['Better crops', 'Water went downstream faster and flooded the village', 'The soil became richer', 'The river changed course'], answer: 'Water went downstream faster and flooded the village', explain: 'Nước chảy xuống nhanh hơn khiến làng bị ngập.' },
          { id: 'L2-9', type: 'choice', prompt: 'What worries the farmer about the scheme?', options: ['The payments are too low', 'Year eleven, when the scheme ends with no guarantee of renewal', 'His neighbours disapprove', 'The wetland attracts pests'], answer: 'Year eleven, when the scheme ends with no guarantee of renewal', explain: 'Hết hạn hợp đồng thì không thể cày lại ngay.' },
          { id: 'L2-10', type: 'choice', prompt: 'What change would the farmer like?', options: ['Shorter contracts and higher payments', 'Longer contracts and payments for results', 'Payments for land only', 'Free equipment'], answer: 'Longer contracts and payments for results', explain: 'Hợp đồng dài hơn và trả tiền theo kết quả (số chim, chất lượng nước).' },
          { id: 'L2-11', type: 'choice', prompt: 'Why would the farmer want his neighbour to join?', options: ['To share machinery', 'Because a wetland divided by a fence does not work', 'To reduce his payments', 'To satisfy the inspector'], answer: 'Because a wetland divided by a fence does not work', explain: 'Đất ngập nước bị chia cắt bởi hàng rào thì không phát huy tác dụng.' },
          { id: 'L2-12', type: 'fill', prompt: 'Policy finds it hardest to pay individuals for a benefit that exists ___. (one word)', answers: ['collectively'], explain: '“a benefit that only exists collectively”.' },
        ],
      },
      {
        id: 'L3',
        title: 'Part 3 · Bài nói',
        instruction: 'Bạn sẽ nghe 2 bài nói. Bài 1 có 8 câu hỏi, bài 2 có 7 câu hỏi.',
        transcript: [
          { speaker: 'Lecturer', line: 'I want to examine why sensible environmental policies are so often defeated, and I will argue that the reason is almost never a lack of evidence.' },
          { speaker: 'Lecturer', line: 'Take the congestion charge, which has now been introduced in a number of cities. The evidence is consistent: traffic falls, air quality improves, and the effect persists rather than fading. Yet in almost every city the proposal was fiercely contested before it was implemented, and in several it was rejected outright.' },
          { speaker: 'Lecturer', line: 'Why? Because the costs are concentrated and the benefits are dispersed. A driver who pays every morning knows exactly what the policy costs her. The asthma patient who breathes cleaner air, or the parent whose child walks to school more safely, receives a benefit that is real but diffuse and difficult to attribute.' },
          { speaker: 'Lecturer', line: 'This asymmetry has three consequences for policy design, and they are the substance of my argument. First, the revenue must be visibly returned to the people who paid it, which is why ring-fencing money for public transport is not a technical detail but a political necessity.' },
          { speaker: 'Lecturer', line: 'Second, the policy must be introduced with a fixed date and a clear measurement plan. Uncertainty is exploited by opponents: if a decision can be postponed, it will be. Announcing a review after two years is sensible; announcing an indefinite consultation is fatal.' },
          { speaker: 'Lecturer', line: 'Third, expect displacement, and publish the data on it. If traffic simply moves to a neighbouring street, that is a real failure and pretending otherwise destroys credibility. The cities that survived the political storm were those that admitted what had gone wrong and adjusted.' },
          { speaker: 'Lecturer', line: 'Finally, a warning about a popular alternative. Many councils prefer voluntary agreements, which are cheap, uncontroversial and, on the evidence, largely ineffective. Voluntary change works for people who were already inclined to act. The remaining majority change when the default changes — when the bus is faster, or the parking space is gone.' },
          { speaker: 'Narrator', line: 'Now listen to a talk about how one coastal town responded to flooding.' },
          { speaker: 'Presenter', line: 'In 2016 the town of Marston was flooded twice in eleven months. The obvious response was to build a higher wall along the river, and that is what the council proposed first.' },
          { speaker: 'Presenter', line: 'The proposal was rejected, and the reason is instructive. Modelling showed that a higher wall would protect the town centre but would push water into two low-income neighbourhoods on the opposite bank. The wall was not a solution; it was a transfer of risk.' },
          { speaker: 'Presenter', line: 'What the town did instead was slower and cheaper. It removed a kilometre of concrete channel upstream, reconnected the river to its floodplain, and paid eight farmers to hold water on their fields for a few days each winter.' },
          { speaker: 'Presenter', line: 'The result surprised the engineers. Peak river levels in the town fell by more than forty centimetres, at roughly a fifth of the cost of the wall. The scheme also created a wetland that now attracts birdwatchers, which the council had not predicted and certainly had not budgeted for.' },
          { speaker: 'Presenter', line: 'But I do not want to sell this as a fairy tale. The scheme took nine years, and for six of those years it looked as though it would collapse, because it depended on voluntary agreements with landowners who could withdraw. Two of the eight farmers changed their minds, and the modelling had to be redone.' },
          { speaker: 'Presenter', line: 'The lesson is about where you put the effort. The town spent far more months negotiating with landowners than it would have spent building a wall, and far less money. That trade — time and patience instead of concrete — is available to many places, but only if the people making the decision are willing to wait for the result.' },
        ],
        questions: [
          { id: 'L3-1', type: 'choice', prompt: 'What is the lecturer’s main argument?', options: ['Environmental policies fail because of poor evidence', 'Environmental policies fail for reasons other than evidence', 'Cities should not introduce congestion charges', 'Voluntary agreements are always best'], answer: 'Environmental policies fail for reasons other than evidence', explain: '“the reason is almost never a lack of evidence”.' },
          { id: 'L3-2', type: 'choice', prompt: 'What does the evidence about congestion charges show?', options: ['Traffic falls and air quality improves, and the effect persists', 'The effect fades after a year', 'Traffic increases elsewhere permanently', 'Air quality does not change'], answer: 'Traffic falls and air quality improves, and the effect persists', explain: 'Bằng chứng khá nhất quán và hiệu ứng kéo dài.' },
          { id: 'L3-3', type: 'choice', prompt: 'Why are such policies contested?', options: ['Costs are concentrated and benefits are dispersed', 'The public does not understand traffic', 'Mayors are unpopular', 'The technology is unreliable'], answer: 'Costs are concentrated and benefits are dispersed', explain: 'Chi phí tập trung vào một nhóm, lợi ích lại phân tán.' },
          { id: 'L3-4', type: 'choice', prompt: 'Why is ring-fencing revenue important?', options: ['It raises more money', 'It is a political necessity, not a technical detail', 'It reduces administration costs', 'It is required by law'], answer: 'It is a political necessity, not a technical detail', explain: 'Tiền thu được phải quay lại phục vụ người đã trả.' },
          { id: 'L3-5', type: 'choice', prompt: 'What does the lecturer say about uncertainty?', options: ['It should be avoided by delaying decisions', 'It is exploited by opponents', 'It makes policies more effective', 'It is irrelevant to politics'], answer: 'It is exploited by opponents', explain: 'Nếu có thể trì hoãn thì sẽ bị trì hoãn.' },
          { id: 'L3-6', type: 'choice', prompt: 'How should displacement be handled?', options: ['It should be denied', 'It should be expected and the data published', 'It should be ignored as minor', 'It should be prevented by law'], answer: 'It should be expected and the data published', explain: 'Nếu chỉ đẩy giao thông sang phố bên cạnh thì phải thừa nhận.' },
          { id: 'L3-7', type: 'choice', prompt: 'What does the lecturer say about voluntary agreements?', options: ['They are the most effective tool', 'They are cheap and uncontroversial but largely ineffective', 'They are illegal in most cities', 'They require new legislation'], answer: 'They are cheap and uncontroversial but largely ineffective', explain: 'Tự nguyện chỉ tác động tới nhóm vốn đã sẵn sàng thay đổi.' },
          { id: 'L3-8', type: 'choice', prompt: 'What does the lecturer say makes the majority change?', options: ['Information campaigns', 'A change in the default option', 'Higher taxes alone', 'Fear of penalties'], answer: 'A change in the default option', explain: '“The remaining majority change when the default changes.”' },
          { id: 'L3-9', type: 'choice', prompt: 'Why was the higher wall rejected in Marston?', options: ['It was too expensive', 'It would push water into two low-income neighbourhoods', 'The engineers refused', 'The land was not available'], answer: 'It would push water into two low-income neighbourhoods', explain: 'Bức tường chỉ chuyển rủi ro sang khu dân cư nghèo bên kia sông.' },
          { id: 'L3-10', type: 'choice', prompt: 'What did the town do instead?', options: ['Built a bigger dam', 'Reconnected the river to its floodplain and paid farmers to hold water', 'Moved the town centre', 'Dredged the river'], answer: 'Reconnected the river to its floodplain and paid farmers to hold water', explain: 'Bỏ một km kênh bê tông, nối lại sông với đồng ngập và trả tiền cho nông dân giữ nước.' },
          { id: 'L3-11', type: 'choice', prompt: 'What was the result?', options: ['Peak levels fell by over 40 cm at a fifth of the cost', 'The flooding moved downstream', 'Levels were unchanged', 'The scheme cost more than the wall'], answer: 'Peak levels fell by over 40 cm at a fifth of the cost', explain: 'Đỉnh lũ giảm hơn 40 cm với chi phí khoảng 1/5 so với tường.' },
          { id: 'L3-12', type: 'choice', prompt: 'Which unplanned benefit appeared?', options: ['Cheaper farmland', 'A wetland that attracts birdwatchers', 'New housing land', 'Improved water supply'], answer: 'A wetland that attracts birdwatchers', explain: 'Vùng đất ngập nước thu hút người quan sát chim.' },
          { id: 'L3-13', type: 'choice', prompt: 'What risk did the scheme run?', options: ['It depended on voluntary agreements with landowners', 'The engineers were inexperienced', 'The funding came from abroad', 'There was no monitoring'], answer: 'It depended on voluntary agreements with landowners', explain: 'Hai trong tám nông dân đổi ý, phải làm lại mô hình.' },
          { id: 'L3-14', type: 'choice', prompt: 'What was the real trade the town made?', options: ['Money for speed', 'Time and patience instead of concrete', 'Safety for beauty', 'Public land for private gain'], answer: 'Time and patience instead of concrete', explain: 'Đổi thời gian và kiên nhẫn lấy bê tông.' },
          { id: 'L3-15', type: 'fill', prompt: 'The wall was not a solution; it was a transfer of ___. (one word)', answers: ['risk'], explain: '“it was a transfer of risk”.' },
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
            title: 'Thông báo của toà thị chính',
            text: 'The draft air quality plan is open for consultation until 15 November. The plan proposes a low-emission zone in the city centre, support for electric taxis, and a monitoring station in each of the six districts. Comments received after the deadline cannot be considered in this round.',
            questions: [
              { id: 'R1-1q', type: 'choice', prompt: 'What happens to comments after 15 November?', options: ['They are published separately', 'They cannot be considered in this round', 'They are sent to the ministry', 'They replace earlier comments'], answer: 'They cannot be considered in this round', explain: 'Góp ý sau hạn không được xem xét trong đợt này.' },
            ],
          },
          {
            id: 'R1-2',
            title: 'Biên bản cuộc họp',
            text: 'The committee agreed to defer the decision on the landfill extension for one month, pending the results of the groundwater survey. Two members objected, arguing that the delay would allow the operator to continue tipping in the interim. The chair noted that tipping is permitted under the existing licence.',
            questions: [
              { id: 'R1-2q', type: 'choice', prompt: 'Why did two members object?', options: ['The survey is unnecessary', 'The delay allows tipping to continue', 'The operator is unlicensed', 'The cost is too high'], answer: 'The delay allows tipping to continue', explain: 'Hai thành viên cho rằng trì hoãn để tiếp tục đổ thải.' },
            ],
          },
          {
            id: 'R1-3',
            title: 'Nghiên cứu tóm tắt',
            text: 'We compared household energy use in two similar districts after one received free insulation and the other received an advice leaflet. Insulated households reduced consumption by eighteen per cent; advised households by two per cent. Both groups reported equally strong environmental concern.',
            questions: [
              { id: 'R1-3q', type: 'choice', prompt: 'What does the study suggest?', options: ['Advice changes behaviour more than insulation', 'Practical measures change behaviour more than information', 'Concern for the environment predicts consumption', 'Insulation is ineffective'], answer: 'Practical measures change behaviour more than information', explain: 'Cách nhiệt giảm 18% còn tờ rơi chỉ 2%, dù mức quan tâm như nhau.' },
            ],
          },
          {
            id: 'R1-4',
            title: 'Trích quy định',
            text: 'Operators must report emissions quarterly. Reports are due within thirty days of the end of each quarter. Failure to report within sixty days results in an automatic penalty, and repeated failure may lead to suspension of the operating permit.',
            questions: [
              { id: 'R1-4q', type: 'choice', prompt: 'When does an automatic penalty apply?', options: ['Immediately after the deadline', 'After sixty days without a report', 'At the end of the year', 'Only after repeated failure'], answer: 'After sixty days without a report', explain: 'Quá 60 ngày không báo cáo thì bị phạt tự động.' },
            ],
          },
          {
            id: 'R1-5',
            title: 'Quảng cáo dịch vụ',
            text: 'Our home energy survey costs 60,000 dong and takes ninety minutes. You will receive a written report identifying the three measures with the shortest payback period, plus an estimate of the savings each would produce. The fee is refunded if you commission any recommended work within six months.',
            questions: [
              { id: 'R1-5q', type: 'choice', prompt: 'When is the fee refunded?', options: ['Never', 'If you commission recommended work within six months', 'If savings are not achieved', 'If the survey takes longer than ninety minutes'], answer: 'If you commission recommended work within six months', explain: 'Phí được hoàn nếu khách đặt làm một hạng mục được khuyến nghị trong 6 tháng.' },
            ],
          },
          {
            id: 'R1-6',
            title: 'Thư của độc giả',
            text: 'Your article praised the new cycle lanes, but you did not mention that the parking spaces removed to build them have simply reappeared, illegally, on the pavement. Until the council enforces the rules it already has, new infrastructure will keep being built on top of an old problem.',
            questions: [
              { id: 'R1-6q', type: 'choice', prompt: 'What is the reader’s argument?', options: ['Cycle lanes are a bad idea', 'Existing rules should be enforced before new infrastructure', 'Parking should be free', 'The article was inaccurate about costs'], answer: 'Existing rules should be enforced before new infrastructure', explain: 'Cần thực thi quy định hiện có, không chỉ xây hạ tầng mới.' },
            ],
          },
          {
            id: 'R1-7',
            title: 'Bảng thông tin',
            text: 'District recycling rates 2025: North 41% · East 38% · Central 29% · South 26% · West 24%. Households in the North and East receive a weekly food waste collection; the Central, South and West districts receive it fortnightly.',
            questions: [
              { id: 'R1-7q', type: 'choice', prompt: 'What correlation does the table suggest?', options: ['Recycling is lower where food waste is collected weekly', 'Recycling is higher where food waste is collected weekly', 'There is no pattern', 'Recycling is highest in the West'], answer: 'Recycling is higher where food waste is collected weekly', explain: 'Bắc và Đông thu rác thực phẩm hằng tuần và có tỉ lệ tái chế cao nhất.' },
            ],
          },
          {
            id: 'R1-8',
            title: 'Hướng dẫn sử dụng',
            text: 'Rainwater butt: install on a level surface, connect to the downpipe using the diverter supplied. During frost, disconnect the butt and store it empty, as ice will split the casing. Water collected is suitable for gardens, not for drinking or for filling paddling pools.',
            questions: [
              { id: 'R1-8q', type: 'choice', prompt: 'Why should the butt be stored empty in frost?', options: ['To prevent algae', 'Because ice will split the casing', 'To reduce weight for transport', 'Because the diverter breaks'], answer: 'Because ice will split the casing', explain: 'Nước đóng băng làm vỡ vỏ bồn.' },
            ],
          },
          {
            id: 'R1-9',
            title: 'Bài phát biểu ngắn',
            text: 'We are often told that change must start with the individual. I do not accept it. An individual who cycles to work instead of driving saves perhaps a tonne of carbon a year; a single decision by a council about bus lanes can save thousands. This is not an argument against personal action, but against treating it as sufficient.',
            questions: [
              { id: 'R1-9q', type: 'choice', prompt: 'What is the speaker’s position?', options: ['Personal action is pointless', 'Personal action matters but cannot be sufficient alone', 'Only councils can reduce emissions', 'Bus lanes are unnecessary'], answer: 'Personal action matters but cannot be sufficient alone', explain: 'Không phủ nhận hành động cá nhân, chỉ phản đối coi nó là đủ.' },
            ],
          },
          {
            id: 'R1-10',
            title: 'Thông báo của trường học',
            text: 'Following the air quality report, the school will close the roadside gate at drop-off times and ask parents to use the car park on Oak Street. Children in years 3 to 6 will take part in a walking bus, supervised by staff, leaving the car park at 8:20 each morning.',
            questions: [
              { id: 'R1-10q', type: 'choice', prompt: 'What is the walking bus?', options: ['A shuttle minibus service', 'A supervised group walk from the car park', 'A cycling scheme', 'A pedestrian crossing'], answer: 'A supervised group walk from the car park', explain: 'Nhóm học sinh đi bộ có giám sát từ bãi đỗ xe.' },
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
            title: 'The quiet cost of a cheap policy',
            text: `Governments under pressure to act on the environment face a recurring temptation: choose the measure that is easiest to announce. A voluntary agreement, a public information campaign or a modest subsidy can be presented as decisive action, offends nobody, and costs little. The difficulty is that such measures frequently achieve almost nothing, and their failure is not obvious for years.

The reason is not that citizens are indifferent. Surveys in many countries show levels of environmental concern that are high and remarkably stable across income groups. What varies is not attitude but circumstance. A household that cannot afford to replace a boiler will not insulate its walls, however strongly it approves of insulation, and a commuter whose bus arrives every fifty minutes will drive whether or not she feels guilty about it.

This produces a characteristic failure mode. A campaign raises awareness; awareness produces intention; intention meets an unchanged set of practical constraints; and behaviour stays where it was. Researchers who have compared interventions consistently find that measures altering the default — a bus that runs every ten minutes, a parking permit that costs money, a boiler that comes insulated — change behaviour far more than measures appealing to conscience. In one study of two similar districts, free insulation cut household energy use by eighteen per cent while an advice leaflet in the comparison district cut it by two, even though both groups reported identical concern about climate change.

There is a second, subtler cost. When a weak policy is announced as a solution, it consumes political capital. The public reasonably concludes that the problem has been addressed, and the next, more effective, and more controversial proposal faces a harder argument. Environmental policy thus has a particular vulnerability: it can be defeated not only by opposition but by easy agreement.

None of this means that information is worthless. Advice that arrives at the right moment, when somebody is already replacing a window or moving house, is genuinely effective, and it is cheap. The mistake is in the arithmetic of expectations: treating a measure that shifts behaviour by a few per cent as though it had solved the problem, and then declaring victory.

A more honest framework would ask three questions before any measure is adopted. Does it change what people are able to do, or only what they think they should do? Is its effect measurable, and will the measurement be published even if the answer is embarrassing? And what happens when it fails — is there a mechanism for tightening it, or does the policy quietly expire while the problem remains?`,
            glossary: [
              { word: 'recurring', meaning: 'lặp đi lặp lại' },
              { word: 'indifferent', meaning: 'thờ ơ' },
              { word: 'default', meaning: 'lựa chọn mặc định' },
              { word: 'political capital', meaning: 'vốn chính trị' },
              { word: 'arithmetic of expectations', meaning: 'cách tính kỳ vọng (ẩn dụ: tính toán sai về mức độ kỳ vọng)' },
            ],
            questions: [
              { id: 'R2-1q1', type: 'choice', prompt: 'What is the writer’s main argument?', options: ['Environmental campaigns are unnecessary', 'Easy-to-announce policies often achieve little and hide the failure', 'Governments should not act on the environment', 'Public concern about the environment is falling'], answer: 'Easy-to-announce policies often achieve little and hide the failure', explain: 'Biện pháp dễ công bố thường ít hiệu quả và che giấu thất bại.' },
              { id: 'R2-1q2', type: 'choice', prompt: 'What do surveys show about concern for the environment?', options: ['It varies hugely by income', 'It is high and stable across income groups', 'It is falling', 'It is higher among the wealthy only'], answer: 'It is high and stable across income groups', explain: 'Mức quan tâm cao và ổn định giữa các nhóm thu nhập.' },
              { id: 'R2-1q3', type: 'choice', prompt: 'What does the writer say varies?', options: ['Attitudes', 'Circumstance', 'Education', 'Age'], answer: 'Circumstance', explain: '“What varies is not attitude but circumstance.”' },
              { id: 'R2-1q4', type: 'choice', prompt: 'What is the characteristic failure mode?', options: ['Awareness leads to action', 'Awareness produces intention, but practical constraints do not change', 'Campaigns are too expensive', 'Governments ignore surveys'], answer: 'Awareness produces intention, but practical constraints do not change', explain: 'Ý định tăng nhưng ràng buộc thực tế không đổi nên hành vi giữ nguyên.' },
              { id: 'R2-1q5', type: 'choice', prompt: 'What do the two districts illustrate?', options: ['Advice works as well as insulation', 'Measures altering the default change behaviour more than appeals to conscience', 'Both groups were unconcerned about climate change', 'Insulation is too expensive'], answer: 'Measures altering the default change behaviour more than appeals to conscience', explain: 'Cách nhiệt miễn phí giảm 18%, tờ rơi chỉ 2%.' },
              { id: 'R2-1q6', type: 'choice', prompt: 'What is the second, subtler cost?', options: ['It is expensive', 'It consumes political capital', 'It increases emissions', 'It confuses scientists'], answer: 'It consumes political capital', explain: 'Công bố biện pháp yếu như một giải pháp sẽ tiêu tốn vốn chính trị.' },
              { id: 'R2-1q7', type: 'choice', prompt: 'How can environmental policy be defeated, according to the writer?', options: ['Only by opposition', 'By opposition and also by easy agreement', 'By budget cuts alone', 'By international pressure'], answer: 'By opposition and also by easy agreement', explain: '“it can be defeated not only by opposition but by easy agreement”.' },
              { id: 'R2-1q8', type: 'choice', prompt: 'When is advice genuinely effective?', options: ['Never', 'When it arrives at a moment of decision, such as moving house', 'When it is repeated often', 'When it is compulsory'], answer: 'When it arrives at a moment of decision, such as moving house', explain: 'Lời khuyên đến đúng lúc có quyết định thực tế thì hiệu quả.' },
              { id: 'R2-1q9', type: 'choice', prompt: 'What is the mistake in the “arithmetic of expectations”?', options: ['Expecting no effect at all', 'Treating a small effect as though the problem were solved', 'Refusing to measure anything', 'Ignoring costs'], answer: 'Treating a small effect as though the problem were solved', explain: 'Coi biện pháp tác động vài phần trăm là đã giải quyết xong.' },
              { id: 'R2-1q10', type: 'fill', prompt: 'A more honest framework would ask whether a measure changes what people are able to do, or only what they think they should ___. (one word)', answers: ['do'], explain: '“or only what they think they should do”.' },
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
            title: 'Who pays for the water?',
            text: `Flood defence is usually discussed as an engineering question, but it is at least as much a question of distribution. Money spent upstream protects people downstream; money spent on a wall protects one bank and can raise the water on the other. Every technical choice about a river is also a decision about whose risk will be reduced and whose will not.

The standard approach has been to protect what is expensive. Where a city centre or a hospital lies in the floodplain, a barrier is built, because the cost of flooding those assets is easy to calculate. A culvert under an industrial estate and a residential street with two hundred houses may both be defended by the same scheme, yet the calculation behind it treats them differently: a house has a market value on the balance sheet, whereas the disruption of a community, the loss of a school term and the months in temporary accommodation are all but invisible to the model.

Economists have a name for this: the difference between damage that is priced and damage that is not. Because assessment methods are built on what can be valued, they systematically understate harm to people with little property. Two decades of research on flood events consistently finds that the poorest households take longest to recover, and the mechanism is unremarkable — no savings, no insurance, no second car, and often a landlord with no interest in repair.

Policy has begun, unevenly, to respond. Some agencies now weight benefits according to the deprivation of the area protected, which means a scheme defending a poorer neighbourhood can score better than one defending a richer one at equal cost. The change sounds small; in practice it reorders the entire list of projects, and that is why it is resisted by the areas that used to come first.

There is a further complication that no weighting can fix. Protection is a shared system, and individuals inside it face a private incentive to free-ride. A landowner who paves a field upstream, increasing the speed at which water arrives in the town, bears none of the cost imposed downstream. Public money then repairs the consequences, which is why some schemes now pay upstream landowners to hold water — not because they are generous, but because it is cheaper than building ever-higher walls.

The uncomfortable conclusion is that the choice is rarely between flood defence and no flood defence. It is between defending some places well and defending all places moderately, and the decision is made whether or not anybody acknowledges it. The technical reports present it as a budget question. It is a question about who, in a wet winter, will be expected to move their furniture upstairs.`,
            glossary: [
              { word: 'floodplain', meaning: 'vùng đồng bằng ngập lũ' },
              { word: 'deprivation', meaning: 'sự thiếu thốn' },
              { word: 'free-ride', meaning: 'hưởng lợi mà không chia sẻ chi phí' },
              { word: 'understate', meaning: 'nói giảm, đánh giá thấp' },
              { word: 'culvert', meaning: 'cống ngầm' },
            ],
            questions: [
              { id: 'R3-1q1', type: 'choice', prompt: 'What is the writer’s main point in the first paragraph?', options: ['Flood defence is purely technical', 'Technical choices also decide whose risk is reduced', 'Walls are always the best solution', 'Rivers cannot be managed'], answer: 'Technical choices also decide whose risk is reduced', explain: 'Mọi lựa chọn kỹ thuật cũng là quyết định về phân phối rủi ro.' },
              { id: 'R3-1q2', type: 'choice', prompt: 'Why are city centres protected first?', options: ['They have more residents', 'The cost of flooding those assets is easy to calculate', 'Councillors live there', 'They are closer to the river'], answer: 'The cost of flooding those assets is easy to calculate', explain: 'Chi phí thiệt hại ở trung tâm dễ tính toán hơn.' },
              { id: 'R3-1q3', type: 'choice', prompt: 'What does the model fail to capture?', options: ['Construction costs', 'Community disruption and long-term displacement', 'The number of houses', 'Insurance premiums'], answer: 'Community disruption and long-term displacement', explain: 'Gián đoạn cộng đồng, mất thời gian học, sống tạm trú — “invisible to the model”.' },
              { id: 'R3-1q4', type: 'choice', prompt: 'What is the “difference between damage that is priced and damage that is not”?', options: ['Insurance versus taxes', 'Assessment understates harm to people with little property', 'Public versus private land', 'Urban versus rural flooding'], answer: 'Assessment understates harm to people with little property', explain: 'Phương pháp đánh giá dựa trên giá trị tài sản nên đánh giá thấp thiệt hại của người nghèo.' },
              { id: 'R3-1q5', type: 'choice', prompt: 'Why do the poorest households recover slowest?', options: ['They live furthest away', 'No savings, no insurance, no second car and landlords with no interest in repair', 'They refuse help', 'They move away'], answer: 'No savings, no insurance, no second car and landlords with no interest in repair', explain: 'Thiếu tiết kiệm, bảo hiểm, phương tiện và chủ nhà không quan tâm sửa chữa.' },
              { id: 'R3-1q6', type: 'choice', prompt: 'What change have some agencies made?', options: ['Weighting benefits by the deprivation of the area protected', 'Building higher walls', 'Charging residents', 'Ignoring small communities'], answer: 'Weighting benefits by the deprivation of the area protected', explain: 'Trọng số theo mức thiếu thốn của khu vực được bảo vệ.' },
              { id: 'R3-1q7', type: 'choice', prompt: 'Why is that change resisted?', options: ['It is illegal', 'It reorders which projects come first', 'It costs more', 'It requires new technology'], answer: 'It reorders which projects come first', explain: 'Nó đảo thứ tự ưu tiên các dự án.' },
              { id: 'R3-1q8', type: 'choice', prompt: 'What problem does weighting not solve?', options: ['Lack of data', 'Free-riding by landowners upstream', 'Engineering limits', 'Political cycles'], answer: 'Free-riding by landowners upstream', explain: 'Người ở thượng nguồn gây chi phí nhưng không chịu chi phí.' },
              { id: 'R3-1q9', type: 'choice', prompt: 'Why do schemes pay upstream landowners to hold water?', options: ['Out of generosity', 'Because it is cheaper than building ever-higher walls', 'Because it is required by law', 'To improve farmland'], answer: 'Because it is cheaper than building ever-higher walls', explain: '“because it is cheaper than building ever-higher walls”.' },
              { id: 'R3-1q10', type: 'choice', prompt: 'What is the uncomfortable conclusion?', options: ['Flood defence should be abandoned', 'The real choice is between defending some places well and all places moderately', 'Only cities should be protected', 'Engineering can solve everything'], answer: 'The real choice is between defending some places well and all places moderately', explain: 'Câu cuối: lựa chọn thực sự là ai sẽ phải kê đồ lên gác trong mùa mưa.' },
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
            title: 'How a carbon price is supposed to work',
            text: `A carbon price is intended to make the polluter pay for damage that would otherwise be paid (1)___ somebody else. In principle, the mechanism is simple.

A government sets a limit on total emissions and issues permits (2)___ to that limit. Firms that can reduce emissions cheaply will do so and sell their surplus permits; firms (3)___ reduction is expensive will buy them. The result is that the cheapest reductions happen first, (4)___ makes the policy more efficient than a uniform rule applied to every factory.

Two problems are well documented. The first is that the limit must be tightened over time, (5)___ firms will simply keep the permits and continue as before. The second is leakage: if production moves to a country (6)___ no such price exists, total emissions may not fall at all. This is (7)___ border adjustments are increasingly discussed.

A third difficulty is political. A carbon price raises the cost of essentials such as heating and fuel, which affects poorer households (8)___ than richer ones. Ignoring that fact is not only unjust but tactically unwise, because the policy will be repealed (9)___ it is seen to be unfair — as happened in several countries.

The lesson is (10)___ an efficient instrument is not automatically a durable one. Efficiency explains how to reach a target; fairness decides whether the policy survives long enough to reach it.`,
            questions: [
              { id: 'R4-1q1', type: 'choice', prompt: 'Chỗ (1)', options: ['by', 'to', 'for', 'with'], answer: 'by', explain: '“paid by somebody else” — bị động với tác nhân.' },
              { id: 'R4-1q2', type: 'choice', prompt: 'Chỗ (2)', options: ['equal', 'equally', 'equality', 'equalise'], answer: 'equal', explain: '“permits equal to that limit” — tính từ bổ nghĩa.' },
              { id: 'R4-1q3', type: 'choice', prompt: 'Chỗ (3)', options: ['who', 'whose', 'which', 'whom'], answer: 'whose', explain: '“firms whose reduction is expensive”.' },
              { id: 'R4-1q4', type: 'choice', prompt: 'Chỗ (4)', options: ['which', 'what', 'that', 'who'], answer: 'which', explain: 'Mệnh đề quan hệ bổ nghĩa cho cả mệnh đề trước.' },
              { id: 'R4-1q5', type: 'choice', prompt: 'Chỗ (5)', options: ['or', 'otherwise', 'unless', 'although'], answer: 'or', explain: '“tightened over time, or firms will simply keep…”.' },
              { id: 'R4-1q6', type: 'choice', prompt: 'Chỗ (6)', options: ['where', 'which', 'whose', 'what'], answer: 'where', explain: '“a country where no such price exists”.' },
              { id: 'R4-1q7', type: 'choice', prompt: 'Chỗ (7)', options: ['why', 'because', 'how', 'what'], answer: 'why', explain: '“This is why border adjustments are discussed.”' },
              { id: 'R4-1q8', type: 'choice', prompt: 'Chỗ (8)', options: ['more', 'most', 'much', 'many'], answer: 'more', explain: 'So sánh hơn: “affects poorer households more than richer ones”.' },
              { id: 'R4-1q9', type: 'choice', prompt: 'Chỗ (9)', options: ['if', 'unless', 'although', 'despite'], answer: 'if', explain: '“will be repealed if it is seen to be unfair”.' },
              { id: 'R4-1q10', type: 'choice', prompt: 'Chỗ (10)', options: ['that', 'this', 'what', 'whether'], answer: 'that', explain: '“The lesson is that…” — mệnh đề bổ ngữ.' },
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
        title: 'Task 1 · Thư góp ý về kế hoạch không khí sạch',
        prompt: 'Your city council has published a draft clean air plan that includes a low-emission zone in the city centre. Write a letter (at least 150 words) to the council in which you: state your general view of the plan, explain one benefit you expect, identify one problem for a particular group of residents, and suggest a specific amendment.',
        minWords: 150,
        checklist: [
          { label: 'Có lời chào và lời kết trang trọng', hint: 'Dear Members of the Council, … / Yours faithfully,' },
          { label: 'Nêu quan điểm chung ngay đoạn đầu', hint: 'I write in support of the plan, subject to one amendment.' },
          { label: 'Trình bày một lợi ích kèm lý do hoặc số liệu', hint: 'Traffic in the affected streets fell by…' },
          { label: 'Nêu vấn đề cho một nhóm cư dân cụ thể', hint: 'residents in the outer districts, shift workers, small traders' },
          { label: 'Đề xuất sửa đổi cụ thể, khả thi', hint: 'I would ask the council to ring-fence the revenue for…' },
          { label: 'Có câu đề nghị phản hồi', hint: 'I would be grateful for a reply…' },
          { label: 'Trang trọng, ít nhất 150 từ, có ít nhất 4 từ nối', hint: 'moreover, nevertheless, in particular, for that reason' },
        ],
        tips: [
          'Task 1 bậc C1 nên thể hiện quan điểm có mức độ (“support, subject to one amendment”) thay vì chỉ mô tả.',
          'Góp ý hiệu quả phải nêu được nhóm chịu ảnh hưởng và sửa đổi cụ thể — đây là phần ăn điểm cao nhất.',
          'Dùng cấu trúc lịch sự nhưng dứt khoát: “I would ask the council to…”, “This would be avoidable if…”.',
          'Đừng quên nêu hậu quả nếu không sửa (chính sách mất ủng hộ), vì điều này thể hiện lập luận chặt chẽ.',
        ],
        model: `Dear Members of the Council,

I write regarding the draft clean air plan, and in particular the proposal for a low-emission zone in the city centre. I support the plan in principle, subject to one amendment concerning the revenue.

The case for action is clear. Monitoring data from the three streets nearest the ring road show nitrogen dioxide levels well above the recommended limit for most of the winter, and my own children attend a school on the worst of those streets. International experience suggests that charges of this kind reduce traffic by ten to twenty per cent without damaging the local economy, provided that alternatives exist.

My concern is with residents in the outer districts, where bus services were cut two years ago. For a care assistant who works night shifts, the charge may be unavoidable, because the buses simply do not run at the hours she travels. The same applies to small traders who deliver before the shops open.

For that reason, I would ask the council to ring-fence the revenue for the bus network in the outer districts, and to delay the start of charging until six in the morning rather than seven. This would be paid for by the revenue itself and would, moreover, strengthen the plan politically, since the people most affected would see a direct benefit.

Finally, I would encourage the council to publish traffic counts quarterly, including on the streets where traffic is displaced. Honest measurement is the surest way to keep public support.

I would be grateful for a reply setting out how the consultation will inform the final scheme.

Yours faithfully,
Tran Bao Long`,
      },
      {
        id: 'W2',
        task: 2,
        title: 'Task 2 · Luận: đánh thuế hay cấm hành vi gây hại môi trường?',
        prompt: 'Some people believe that environmentally harmful behaviour should be taxed, while others argue that it should be banned outright. Discuss both approaches and give your own opinion. Write at least 300 words.',
        minWords: 300,
        checklist: [
          { label: 'Mở bài nêu rõ hai cách tiếp cận và hướng làm bài', hint: 'Both instruments have a place, but they are not interchangeable.' },
          { label: 'Đoạn lập luận cho việc đánh thuế', hint: 'A tax preserves choice and finds the cheapest reductions first.' },
          { label: 'Đoạn lập luận cho việc cấm', hint: 'Where a practice is plainly harmful and no safe level exists, price signals fail.' },
          { label: 'Có ví dụ cụ thể cho mỗi phía', hint: 'congestion charges; lead in petrol, ozone-depleting gases, ivory trade' },
          { label: 'Có đoạn về tính công bằng (thuế lũy thoái)', hint: 'A carbon price affects poorer households more than richer ones.' },
          { label: 'Nêu ý kiến riêng có mức độ (kết hợp hai công cụ)', hint: 'In my view, taxes should be the default, with bans reserved for…' },
          { label: 'Có ít nhất 2 cấu trúc nhượng bộ/phản biện bậc C1', hint: 'Admittedly…, On balance…, provided that…' },
          { label: 'Kết luận khẳng định lại quan điểm; đủ 300 từ', hint: 'In conclusion, …' },
        ],
        tips: [
          'Đừng chọn một phía tuyệt đối: đề “discuss both” cần cả hai phía và một nguyên tắc lựa chọn giữa chúng.',
          'Nguyên tắc lựa chọn rõ ràng (ví dụ: khi nào giá cả không đủ để ngăn tác hại) sẽ nâng điểm lập luận lên mức C1.',
          'Ít nhất một ví dụ cho mỗi phía — ví dụ cụ thể quan trọng hơn số lượng từ.',
          'Chú ý tính công bằng: đây là lập luận phân biệt bài viết C1 với bài B2.',
        ],
        model: `Environmental policy has two main instruments, and the debate between them is older than the climate crisis. One school argues that harmful behaviour should carry a price, so that individuals and firms decide for themselves how to respond. Another insists that some practices are simply wrong and should be prohibited. In my view, the two are not interchangeable: taxation should be the default instrument, while outright bans should be reserved for cases where harm is severe, irreversible or impossible to price.

The case for a price is that it mobilises information which governments do not possess. A charge on fuel or on waste disposal does not tell a factory how to reduce its emissions; it tells the factory that reducing them is worth attention. Firms then discover the cheapest solutions, which is why economists generally prefer a levy to a uniform rule applied across an entire industry. Congestion charges in several cities illustrate the point: traffic fell, air quality improved, and — crucially — the effect persisted rather than fading once drivers became used to it.

Bans, however, have two advantages that prices cannot match. The first is that some harms have no safe threshold, so buying the right to cause them is morally odd and practically unreliable. The removal of lead from petrol and the phasing out of ozone-depleting gases are cases where prohibition, rather than a tax, produced rapid results. The second is certainty: a tax changes behaviour only if it is high enough, and governments are often reluctant to set it high enough.

Admittedly, a price has a serious drawback that its supporters sometimes underplay. It raises the cost of essentials such as heating and transport, and poorer households spend a larger share of their income on those items, so a flat levy is regressive. Ignoring that is not only unjust but tactically unwise, because such policies have been repealed in several countries after public backlash. The remedy is not to abandon pricing but to recycle the revenue — into public transport, insulation or direct payments — so that the policy is seen to be fair.

On balance, I would make a stated price the normal tool for ordinary consumption, and reserve bans for substances and practices that are dangerous at any level or that cannot be effectively measured. Funding and fairness, however, determine whether either instrument survives long enough to work. Efficiency tells you which policy reaches the target; fairness decides whether the target is ever reached.`,
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
        instruction: 'Bạn sẽ nghe 3 câu hỏi về môi trường, chính sách và đời sống đô thị. Trả lời mỗi câu 1–2 phút.',
        minutes: 3,
        questions: [
          { q: 'What environmental problem worries you most in your own area?', sample: 'Air quality, without question, though it is invisible most of the time. Where I live, traffic is heaviest in the morning, and the school near the main road keeps its windows closed on the worst days. What concerns me is not only the pollution itself but how unequal it is: the people breathing the most polluted air are usually those who cannot afford to live elsewhere. Flooding worries me too, but at least that is visible and produces pressure to act.' },
          { q: 'Whose responsibility is it to protect the environment — individuals or the government?', sample: 'Both, but not equally. I would say individuals have a responsibility to act where they have a real choice, but governments have the responsibility to create that choice. Recycling is a good example: in my building, there is nowhere to separate waste, so the decision has been made for me by the absence of a service. Where the infrastructure exists, personal habits do change quite quickly. So I would put the first responsibility on policy and the second on habits.' },
          { q: 'Have you changed any of your habits for environmental reasons?', sample: 'A few, and they are all practical rather than moral. I use a refillable bottle mainly because it saves money, and I take the bus to work because parking is impossible. When I tried to change habits purely out of principle, they usually lasted two weeks. The one thing I have kept is buying less clothing, and that was driven by a clear calculation rather than by guilt. In my experience convenience, not conscience, is what makes changes stick.' },
        ],
      },
      {
        id: 'S2',
        kind: 'solution',
        title: 'Part 2 · Thảo luận giải pháp',
        instruction: 'Bạn và một người bạn đang bàn cách giảm ùn tắc và ô nhiễm ở trung tâm thành phố. Hãy thảo luận ưu điểm, nhược điểm của 3 lựa chọn rồi chọn một phương án và giải thích.',
        minutes: 4,
        situation: 'The centre of your city suffers from heavy traffic, poor air quality and a shortage of parking. Three options are suggested.',
        options: [
          'Introduce a congestion charge for private cars in the centre',
          'Massively expand the bus network and make buses free in the centre',
          'Build a large car park outside the city and run frequent shuttles from it',
        ],
        sample: `Let us take the three options in turn. The congestion charge has the strongest evidence behind it: traffic falls, air quality improves, and the effect does not fade. It also raises money that can be spent on alternatives. The drawback is political and social. It is regressive unless the revenue is recycled, and it is easy to present as a tax on people who have no alternative, which is why several cities abandoned it after protests.

Free and expanded buses remove the main reason people drive, which is that the bus is slower and less predictable. Making them free in the centre also helps the poorest users, who are the most sensitive to fares. The difficulty is cost: a large permanent subsidy has to come from somewhere, and buses in a congested corridor can be held up by the same traffic they are meant to replace.

The park-and-ride scheme is the least controversial and usually the cheapest to start. It captures drivers who are willing to change if the transfer is easy. However, it works only for people coming from outside the city; residents inside the ring road are left in the same queues, and the site itself consumes a great deal of land.

If I had to choose one, I would start with the second, combined with bus lanes, and introduce a charge only later, once the alternative is genuinely usable. A charge applied before the bus is reliable punishes people for a choice they do not have. Sequencing, in this case, matters more than the choice of instrument.`,
      },
      {
        id: 'S3',
        kind: 'topic',
        title: 'Part 3 · Phát triển chủ đề',
        instruction: 'Trình bày quan điểm của bạn về chủ đề dưới đây (khoảng 3 phút), dựa vào 3 gợi ý. Sau đó trả lời 2 câu hỏi mở rộng.',
        minutes: 5,
        topic: 'Individual action matters less than government policy in protecting the environment.',
        outline: [
          'Vì sao hành động cá nhân vẫn có ý nghĩa',
          'Vì sao chính sách có sức mạnh lớn hơn',
          'Sự kết hợp hợp lý giữa hai yếu tố',
        ],
        questions: [
          { q: 'Do you think people would accept higher taxes if the money were spent on the environment?', sample: 'Some would, but the wording matters a great deal. When the revenue is visibly returned — better buses, cheaper insulation, money back to households — support is much higher than when it disappears into a general budget. I also think people accept charges more readily when they can see how the alternative works, because a tax on driving is bearable if the bus runs every ten minutes. So my answer is yes, conditionally: acceptance depends on transparency and on whether the money produces something the payer can use.' },
          { q: 'How could schools encourage young people to care for the environment?', sample: 'I would avoid lessons that consist mainly of warnings, because they tend to produce anxiety rather than action. What worked in my own school was a project with a measurable result: we measured the temperature in two classrooms and got the school to change the windows. That taught us that environmental work is a practical problem with solutions, not only a moral one. Practical projects, a little data, and something visible at the end seem to me far more effective than memorising statistics about the planet.' },
        ],
      },
    ],
  },
};
