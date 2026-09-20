/**
 * Đề VSTEP C1 số 1 — chủ đề khoa học & đổi mới (nội dung gốc, viết theo đúng format đề thi).
 * Bậc C1: văn bản dài hơn, lập luận chặt, từ vựng học thuật.
 */
export default {
  id: 'c1-01',
  level: 'C1',
  title: 'Đề C1 số 1 · Khoa học & đổi mới',
  tags: ['khoa học', 'đổi mới', 'C1'],

  listening: {
    minutes: 40,
    parts: [
      {
        id: 'L1',
        title: 'Part 1 · Thông báo ngắn',
        instruction: 'Bạn sẽ nghe 8 thông báo ngắn trong môi trường nghiên cứu. Mỗi thông báo có một câu hỏi. Chọn đáp án đúng nhất.',
        transcript: [
          { speaker: 'Narrator', line: 'Announcement one. This is a message from the research ethics committee. Investigators intending to begin fieldwork in the spring must submit their protocols by the fifth of next month, which is two weeks earlier than in previous years. Late submissions will be considered only in the autumn round.' },
          { speaker: 'Narrator', line: 'Announcement two. Attention, all users of the materials laboratory. The liquid nitrogen supply will be replenished on Tuesday morning, so the cryogenic store will be closed from eight until eleven. Any sample that requires topping up should be dealt with today. Please do not leave containers unattended in the corridor.' },
          { speaker: 'Narrator', line: 'Announcement three. The public lecture on quantum computing, originally scheduled for the main auditorium, will now take place in the engineering building, room E4, because the auditorium is being rewired. The time is unchanged, and the lecture will still be streamed online for those who cannot attend in person.' },
          { speaker: 'Narrator', line: 'Announcement four. Applicants to the regional innovation fund should note that, from this cycle, projects requesting more than fifty thousand dollars must show evidence of co-funding from an industrial partner. Applications below that threshold are unaffected by the new rule.' },
          { speaker: 'Narrator', line: 'Announcement five. Tonight’s open evening at the university observatory will go ahead only if the cloud cover clears by seven o’clock. A decision will be posted on our website at half past six. If the event is cancelled, ticket holders will be offered a place at the next open evening.' },
          { speaker: 'Narrator', line: 'Announcement six. Beginning with the March issue, authors submitting to this journal must include a data availability statement. Manuscripts without such a statement will be returned before peer review. The statement should indicate where the underlying data can be found, or explain why the data cannot be shared.' },
          { speaker: 'Narrator', line: 'Announcement seven. Delegates staying at the Riverside Hotel should note that the shuttle bus will leave at eight fifteen rather than eight forty, because of road works on the bridge. The return service in the evening is unchanged.' },
          { speaker: 'Narrator', line: 'Announcement eight. The pilot plant will run a continuous trial for six weeks from the first of March. During this period visitors are asked to enter through the north gate and to wear the protective clothing provided. The trial may be halted without notice if readings exceed the agreed limits.' },
        ],
        questions: [
          { id: 'L1-1', type: 'choice', prompt: 'What has changed for investigators this year?', options: ['The submission deadline is earlier', 'The committee has new members', 'Fieldwork is no longer permitted', 'Protocols must be handed in personally'], answer: 'The submission deadline is earlier', explain: 'Hạn nộp sớm hơn hai tuần so với các năm trước.' },
          { id: 'L1-2', type: 'choice', prompt: 'What should laboratory users do today?', options: ['Move all their samples', 'Top up samples that need nitrogen', 'Collect new containers', 'Reserve the store for Tuesday'], answer: 'Top up samples that need nitrogen', explain: '“Any sample that requires topping up should be dealt with today.”' },
          { id: 'L1-3', type: 'choice', prompt: 'Why has the venue changed?', options: ['The speaker is unavailable', 'The auditorium is being rewired', 'Too many people registered', 'The engineering building is larger'], answer: 'The auditorium is being rewired', explain: 'Hội trường đang được sửa lại hệ thống điện.' },
          { id: 'L1-4', type: 'choice', prompt: 'Which projects must show co-funding?', options: ['All projects', 'Those requesting over fifty thousand dollars', 'Those lasting more than a year', 'Industrial projects only'], answer: 'Those requesting over fifty thousand dollars', explain: 'Ngưỡng 50.000 đô-la là mốc bắt buộc đồng tài trợ.' },
          { id: 'L1-5', type: 'choice', prompt: 'When will the organisers announce their decision?', options: ['At half past six', 'At seven o’clock', 'The following morning', 'At the observatory gate'], answer: 'At half past six', explain: 'Quyết định được đăng lúc 6 giờ 30.' },
          { id: 'L1-6', type: 'choice', prompt: 'What happens to manuscripts without a data availability statement?', options: ['They are reviewed more slowly', 'They are returned before peer review', 'They are published as short reports', 'They are forwarded to another journal'], answer: 'They are returned before peer review', explain: '“will be returned before peer review”.' },
          { id: 'L1-7', type: 'choice', prompt: 'Why has the shuttle time changed?', options: ['More delegates registered', 'Road works on the bridge', 'The hotel altered its schedule', 'The venue opens earlier'], answer: 'Road works on the bridge', explain: 'Do công trường sửa đường trên cầu.' },
          { id: 'L1-8', type: 'choice', prompt: 'What may happen if readings exceed the agreed limits?', options: ['The plant will close permanently', 'The trial may be stopped without notice', 'Visitors will be asked to leave immediately', 'The trial will be extended'], answer: 'The trial may be stopped without notice', explain: '“may be halted without notice if readings exceed the agreed limits”.' },
        ],
      },
      {
        id: 'L2',
        title: 'Part 2 · Hội thoại',
        instruction: 'Bạn sẽ nghe 2 đoạn hội thoại học thuật. Mỗi đoạn có 6 câu hỏi.',
        transcript: [
          { speaker: 'Supervisor', line: 'So, how did the second run go?' },
          { speaker: 'Student', line: 'Worse than the first, unfortunately. The yield was about half of what we predicted, and the chromatography traces show an extra peak we cannot account for.' },
          { speaker: 'Supervisor', line: 'An extra peak suggests a side reaction, or possibly contamination in the solvent. Did you use the batch that arrived in January?' },
          { speaker: 'Student', line: 'I did, and I wondered about that. But the control run with the older solvent gave the same peak, only smaller.' },
          { speaker: 'Supervisor', line: 'Then I would stop trying to explain it from theory and design a small experiment instead. Run four reactions with different water content: dry solvent, two levels of added water, and one deliberately wet sample. If the peak grows with water, you have your answer.' },
          { speaker: 'Student', line: 'That is a sensible plan. How many replicates should I do?' },
          { speaker: 'Supervisor', line: 'Three, always three, otherwise the reviewers will ask. And keep the temperature constant; last time the variation between runs was larger than the effect we were looking for.' },
          { speaker: 'Student', line: 'Should I postpone the group presentation while I do this?' },
          { speaker: 'Supervisor', line: 'No — present what you have, including the anomaly. An unexplained peak is a perfectly respectable result to report, provided you state clearly what you intend to test next.' },
          { speaker: 'Narrator', line: 'Now listen to a conversation between a science journalist and a researcher.' },
          { speaker: 'Journalist', line: 'Your field has moved almost entirely to preprints. Is that a good thing?' },
          { speaker: 'Researcher', line: 'Mostly, yes. A preprint can be read within days instead of the year a journal sometimes takes. In a fast-moving area that matters, because three groups may otherwise repeat the same work without ever knowing.' },
          { speaker: 'Journalist', line: 'But preprints are not peer reviewed.' },
          { speaker: 'Researcher', line: 'That is true, and it is why the wording matters. A preprint is a claim, not a finding. Trouble arises when journalists, or worse, policy documents, treat it as settled. I would like every preprint to carry a plain-language note stating what has and has not been checked.' },
          { speaker: 'Journalist', line: 'Does the public understand that distinction?' },
          { speaker: 'Researcher', line: 'Rarely, and I do not blame them. If a headline says scientists have discovered something, people reasonably assume that somebody verified it. So the responsibility sits with us, and with editors.' },
          { speaker: 'Journalist', line: 'What about replication? People say nobody repeats experiments any more.' },
          { speaker: 'Researcher', line: 'It is under-rewarded rather than impossible. Replication studies are hard to publish because a confirming result is not considered news. Some funders have begun to ring-fence money for exactly this, and that has already changed behaviour in my own department.' },
          { speaker: 'Journalist', line: 'And what would you change first?' },
          { speaker: 'Researcher', line: 'The incentives. Give early-career researchers credit for careful, unexciting work — data curation, replication, negative results — and the rest will follow. Culture is downstream of funding.' },
        ],
        questions: [
          { id: 'L2-1', type: 'choice', prompt: 'What does the student report about the second run?', options: ['It gave a higher yield than expected', 'The yield was about half the predicted value', 'It failed completely', 'It matched the first run exactly'], answer: 'The yield was about half the predicted value', explain: 'Sản lượng chỉ bằng khoảng một nửa dự đoán.' },
          { id: 'L2-2', type: 'choice', prompt: 'What does the extra peak suggest to the supervisor?', options: ['A side reaction or contamination', 'A faulty detector', 'A miscalculated yield', 'An error in the notebook'], answer: 'A side reaction or contamination', explain: '“a side reaction, or possibly contamination in the solvent”.' },
          { id: 'L2-3', type: 'choice', prompt: 'What does the supervisor advise the student to do?', options: ['Repeat exactly the same run', 'Test the effect of water content', 'Change the analytical instrument', 'Wait for a new batch of solvent'], answer: 'Test the effect of water content', explain: 'Chạy 4 phản ứng với lượng nước khác nhau.' },
          { id: 'L2-4', type: 'choice', prompt: 'Why three replicates?', options: ['To save time', 'Because reviewers will ask otherwise', 'Because the machine requires it', 'To test three temperatures'], answer: 'Because reviewers will ask otherwise', explain: '“Three, always three, otherwise the reviewers will ask.”' },
          { id: 'L2-5', type: 'choice', prompt: 'What problem occurred on the previous occasion?', options: ['The temperature varied more than the effect being studied', 'The solvent ran out', 'The results were never recorded', 'The samples were lost'], answer: 'The temperature varied more than the effect being studied', explain: 'Dao động nhiệt độ lớn hơn hiệu ứng cần đo.' },
          { id: 'L2-6', type: 'choice', prompt: 'What does the supervisor say about the presentation?', options: ['Postpone it until the anomaly is explained', 'Present the results including the anomaly', 'Ask a colleague to present instead', 'Present only the successful runs'], answer: 'Present the results including the anomaly', explain: 'Cứ trình bày, kể cả điểm bất thường, miễn nói rõ bước tiếp theo.' },
          { id: 'L2-7', type: 'choice', prompt: 'Why does the researcher value preprints?', options: ['They are peer reviewed within days', 'Results can be read far sooner', 'They will replace journals', 'They are easier to write'], answer: 'Results can be read far sooner', explain: 'Có thể đọc trong vài ngày thay vì cả năm.' },
          { id: 'L2-8', type: 'choice', prompt: 'How does the researcher describe a preprint?', options: ['A settled finding', 'A claim rather than a finding', 'A final version of a paper', 'A review article'], answer: 'A claim rather than a finding', explain: '“A preprint is a claim, not a finding.”' },
          { id: 'L2-9', type: 'choice', prompt: 'What would the researcher like preprints to include?', options: ['A list of reviewers', 'A plain-language note on what has been checked', 'A funding statement', 'A longer abstract'], answer: 'A plain-language note on what has been checked', explain: 'Ghi chú ngắn gọn về điều gì đã/ chưa được kiểm chứng.' },
          { id: 'L2-10', type: 'choice', prompt: 'Who does the researcher say is responsible for the misunderstanding?', options: ['Journalists alone', 'Scientists and editors', 'The general public', 'Funding agencies'], answer: 'Scientists and editors', explain: '“the responsibility sits with us, and with editors”.' },
          { id: 'L2-11', type: 'choice', prompt: 'Why are replication studies hard to publish?', options: ['They are poorly designed', 'A confirming result is not considered news', 'They take too long to run', 'Journals refuse them outright'], answer: 'A confirming result is not considered news', explain: 'Kết quả trùng lặp không được coi là tin mới.' },
          { id: 'L2-12', type: 'choice', prompt: 'What does the researcher want changed first?', options: ['Laboratory equipment', 'The incentives that reward unexciting work', 'Peer review procedures', 'The number of preprints'], answer: 'The incentives that reward unexciting work', explain: '“Culture is downstream of funding.”' },
        ],
      },
      {
        id: 'L3',
        title: 'Part 3 · Bài nói',
        instruction: 'Bạn sẽ nghe 2 bài nói học thuật. Bài 1 có 8 câu hỏi, bài 2 có 7 câu hỏi.',
        transcript: [
          { speaker: 'Lecturer', line: 'Ten years ago, a group of researchers set out to repeat a hundred published experiments in psychology. They obtained the same result in fewer than half. That single project changed how an entire generation of students talks about evidence.' },
          { speaker: 'Lecturer', line: 'It is tempting to read that number as a story about fraud. It is not. Most of the original studies were conducted honestly; they were simply conducted in ways that made a positive result more likely — small samples, many variables, and a habit of stopping when the result looked interesting.' },
          { speaker: 'Lecturer', line: 'The remedies are unglamorous. First, decide in advance what you will measure and how many participants you need, then record that decision publicly. This is called preregistration, and it removes the temptation to keep looking until something appears.' },
          { speaker: 'Lecturer', line: 'Second, report everything. A paper stating that no difference was found is not a failed paper; it is information. Yet for decades such results went into a drawer, and the literature slowly filled with successes that nobody could reproduce.' },
          { speaker: 'Lecturer', line: 'Third, share your materials. If another group cannot obtain your questionnaire or your code, your finding cannot be examined — and unexamined findings are, in practice, opinions.' },
          { speaker: 'Lecturer', line: 'There is an obvious objection: all of this takes time, and time is precisely what young researchers do not have. I accept that. But consider the alternative. Twenty years of literature that cannot be built upon is not a saving; it is waste on an industrial scale.' },
          { speaker: 'Lecturer', line: 'So my advice to you, whatever your field, is this. Before you collect a single data point, write down what would change your mind. If nothing would, you are not running an experiment; you are writing an advertisement.' },
          { speaker: 'Narrator', line: 'Now listen to a talk about a network of low-cost air-quality sensors.' },
          { speaker: 'Presenter', line: 'Four years ago, a city of three million people had eleven official air-quality monitors. Eleven instruments for the whole city, which meant that a street two kilometres away could be badly polluted and, officially, nobody would know.' },
          { speaker: 'Presenter', line: 'A university team proposed something unusual: give the instruments to the public. They built a sensor costing about a hundred dollars that fits on a balcony, and they trained residents to install and maintain it.' },
          { speaker: 'Presenter', line: 'Within a year there were six hundred sensors. Within three years, twelve hundred. The map they produced showed what the official network could not: pollution varied enormously from street to street, and the worst readings were often beside school gates rather than on the main roads.' },
          { speaker: 'Presenter', line: 'The city changed two policies as a result. Heavy vehicles were rerouted away from two primary schools, and the number of street trees planted along those routes almost doubled.' },
          { speaker: 'Presenter', line: 'Now, the honest part. A hundred-dollar sensor is not a laboratory instrument. It drifts over time, it is affected by humidity, and it cannot measure every pollutant that matters. So the team does two things: it cross-checks every sensor against a reference station twice a year, and it publishes the uncertainty alongside each reading.' },
          { speaker: 'Presenter', line: 'That transparency changed the argument. Officials who had dismissed the network could no longer claim the numbers were invented; they had to argue about the calibration instead, which is a far more productive conversation.' },
          { speaker: 'Presenter', line: 'The lesson is not that cheap sensors replace official monitoring. It is that a network of imperfect instruments, honestly described, can move a city faster than one perfect instrument that nobody can see.' },
        ],
        questions: [
          { id: 'L3-1', type: 'choice', prompt: 'What did the reproducibility project find?', options: ['Fraud was widespread', 'Fewer than half of the results could be repeated', 'All results were confirmed', 'The studies had never been published'], answer: 'Fewer than half of the results could be repeated', explain: 'Chỉ dưới một nửa tái lập được kết quả.' },
          { id: 'L3-2', type: 'choice', prompt: 'How does the lecturer explain those failures?', options: ['Deliberate fraud', 'Honest work conducted in ways that favoured positive results', 'Inadequate training of students', 'Faulty statistical software'], answer: 'Honest work conducted in ways that favoured positive results', explain: 'Phần lớn nghiên cứu trung thực nhưng thiết kế thiên về kết quả dương.' },
          { id: 'L3-3', type: 'choice', prompt: 'What is preregistration?', options: ['Publishing before review', 'Recording your plan and sample size in advance', 'Registering a patent', 'Signing participants in at the door'], answer: 'Recording your plan and sample size in advance', explain: 'Ghi lại trước kế hoạch đo gì và cỡ mẫu bao nhiêu.' },
          { id: 'L3-4', type: 'choice', prompt: 'Why does preregistration help?', options: ['It removes the temptation to keep looking until something appears', 'It guarantees publication', 'It shortens the experiment', 'It attracts industry funding'], answer: 'It removes the temptation to keep looking until something appears', explain: 'Nó loại bỏ việc “thử mãi đến khi có kết quả”.' },
          { id: 'L3-5', type: 'choice', prompt: 'What does the lecturer say about negative results?', options: ['They should be kept private', 'They are information and should be reported', 'They prove poor design', 'They are useful only in medicine'], answer: 'They are information and should be reported', explain: '“it is information” — kết quả âm vẫn là thông tin.' },
          { id: 'L3-6', type: 'choice', prompt: 'Why should materials be shared?', options: ['To help others publish faster', 'So that the finding can be examined', 'To satisfy funders alone', 'To reduce costs'], answer: 'So that the finding can be examined', explain: 'Không chia sẻ thì kết quả không thể bị kiểm tra.' },
          { id: 'L3-7', type: 'choice', prompt: 'Which objection does the lecturer accept?', options: ['That sharing data is illegal', 'That this all takes time young researchers lack', 'That preregistration is impossible', 'That journals refuse to cooperate'], answer: 'That this all takes time young researchers lack', explain: 'Ông thừa nhận việc này tốn thời gian.' },
          { id: 'L3-8', type: 'fill', prompt: 'Before collecting data, write down what would ___ your mind. (one word)', answers: ['change'], explain: '“write down what would change your mind”.' },
          { id: 'L3-9', type: 'choice', prompt: 'What was wrong with the official monitoring network?', options: ['The monitors were broken', 'Eleven monitors served three million people', 'The data was kept secret', 'The monitors were installed abroad'], answer: 'Eleven monitors served three million people', explain: 'Chỉ có 11 trạm cho 3 triệu dân.' },
          { id: 'L3-10', type: 'choice', prompt: 'What were residents asked to do?', options: ['Install and maintain sensors', 'Fund the research', 'Analyse data in laboratories', 'Report pollution by telephone'], answer: 'Install and maintain sensors', explain: 'Cư dân được huấn luyện lắp đặt và bảo trì cảm biến.' },
          { id: 'L3-11', type: 'choice', prompt: 'What did the map reveal?', options: ['Pollution was uniform', 'Pollution varied enormously from street to street', 'The official monitors were miscalibrated', 'Schools were the cleanest locations'], answer: 'Pollution varied enormously from street to street', explain: 'Mức ô nhiễm khác biệt lớn giữa các tuyến phố.' },
          { id: 'L3-12', type: 'choice', prompt: 'What happened near the two primary schools?', options: ['Heavy vehicles were rerouted', 'The schools were relocated', 'More monitors were installed', 'Speed limits were halved'], answer: 'Heavy vehicles were rerouted', explain: 'Xe tải nặng được chuyển hướng khỏi khu vực trường.' },
          { id: 'L3-13', type: 'choice', prompt: 'Which weakness does the presenter admit?', options: ['The sensors are too expensive', 'The sensors drift and are affected by humidity', 'Residents soon lost interest', 'The data was never published'], answer: 'The sensors drift and are affected by humidity', explain: 'Cảm biến trôi theo thời gian và chịu ảnh hưởng của độ ẩm.' },
          { id: 'L3-14', type: 'choice', prompt: 'How does the team deal with that weakness?', options: ['By concealing it', 'By cross-checking against reference stations and publishing uncertainty', 'By replacing sensors every month', 'By reporting averages only'], answer: 'By cross-checking against reference stations and publishing uncertainty', explain: 'Đối chiếu với trạm chuẩn hai lần/năm và công bố độ không đảm bảo.' },
          { id: 'L3-15', type: 'choice', prompt: 'What is the presenter’s conclusion?', options: ['Cheap sensors should replace official monitoring', 'Imperfect instruments, honestly described, can change policy quickly', 'Only governments can measure pollution', 'Cities should buy more expensive monitors'], answer: 'Imperfect instruments, honestly described, can change policy quickly', explain: 'Mạng lưới cảm biến không hoàn hảo nhưng minh bạch có thể thúc đẩy chính sách.' },
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
            title: 'Thông báo phòng thí nghiệm',
            text: 'From next month the high-speed centrifuge may be booked for a maximum of ninety minutes per session. Runs longer than this must be split, because the rotor requires cooling between cycles. Users who exceed the limit twice in a term will lose booking rights for four weeks.',
            questions: [
              { id: 'R1-1q', type: 'choice', prompt: 'Why must long runs be divided?', options: ['To allow more users access', 'Because the rotor needs cooling between cycles', 'Because the software crashes', 'Because staff are unavailable'], answer: 'Because the rotor needs cooling between cycles', explain: 'Rotor cần được làm nguội giữa các chu kỳ.' },
            ],
          },
          {
            id: 'R1-2',
            title: 'Quảng cáo tuyển dụng',
            text: 'Research assistant required for a three-year project on battery materials. You will prepare samples, run electrochemical tests and maintain the group database. Essential: a master’s degree in chemistry or materials science. Desirable: experience with X-ray diffraction. Applications close on 12 June.',
            questions: [
              { id: 'R1-2q', type: 'choice', prompt: 'What is essential for applicants?', options: ['A master’s degree in a relevant subject', 'Experience with X-ray diffraction', 'A driving licence', 'Three years of industry work'], answer: 'A master’s degree in a relevant subject', explain: 'Bằng thạc sĩ là điều kiện bắt buộc; kinh nghiệm XRD chỉ là lợi thế.' },
            ],
          },
          {
            id: 'R1-3',
            title: 'Email nội bộ',
            text: 'Dear all, the shipment of reference standards has been held at customs and will arrive no earlier than Thursday. Please postpone any calibration that depends on them. Routine measurements may continue, but note the delay in your logbooks so that we can trace the affected period later.',
            questions: [
              { id: 'R1-3q', type: 'choice', prompt: 'What are staff asked to do?', options: ['Stop all measurements', 'Record the delay in their logbooks', 'Collect the shipment personally', 'Recalibrate every instrument'], answer: 'Record the delay in their logbooks', explain: 'Ghi lại sự chậm trễ trong sổ ghi chép để truy vết sau này.' },
            ],
          },
          {
            id: 'R1-4',
            title: 'Tóm tắt bài báo',
            text: 'We tested whether short bursts of bright light improve alertness in night-shift workers. Sixty volunteers wore light-emitting devices for two weeks. Alertness scores rose by twelve per cent compared with the control group, but sleep quality was unchanged. Effects disappeared within three days of stopping the intervention.',
            questions: [
              { id: 'R1-4q', type: 'choice', prompt: 'What did the study find?', options: ['Both alertness and sleep quality improved', 'Alertness improved but sleep quality did not', 'Sleep quality improved but alertness did not', 'Neither measure changed'], answer: 'Alertness improved but sleep quality did not', explain: 'Điểm tỉnh táo tăng 12% nhưng chất lượng giấc ngủ không đổi.' },
            ],
          },
          {
            id: 'R1-5',
            title: 'Thông số sản phẩm',
            text: 'Portable particulate sensor. Range: 0–1000 µg/m³. Accuracy: ±15% at 25 °C. Operating humidity: 10–80%. Battery: 30 hours of continuous logging. Data export: CSV and JSON. Note: readings above 80% humidity are not calibrated and should be discarded.',
            questions: [
              { id: 'R1-5q', type: 'choice', prompt: 'When should readings be discarded?', options: ['Above 25 °C', 'Above 80% humidity', 'Below 10 µg/m³', 'After 30 hours'], answer: 'Above 80% humidity', explain: 'Số liệu trên 80% độ ẩm chưa được hiệu chuẩn.' },
            ],
          },
          {
            id: 'R1-6',
            title: 'Lời mời phản biện',
            text: 'Dear Dr Pham, we would like to invite you to review manuscript ID 4471, which examines sediment transport in the Mekong delta. The review is due within twenty-one days. If you are unable to accept, please suggest two alternative reviewers from a different institution.',
            questions: [
              { id: 'R1-6q', type: 'choice', prompt: 'What must Dr Pham do if she declines?', options: ['Return the manuscript untouched', 'Suggest two reviewers from another institution', 'Contact the authors directly', 'Ask for an extension'], answer: 'Suggest two reviewers from another institution', explain: 'Nếu từ chối, cần gợi ý hai người phản biện khác cơ quan.' },
            ],
          },
          {
            id: 'R1-7',
            title: 'Trích quy định dữ liệu',
            text: 'Primary data underlying a publication must be retained for a minimum of five years after publication, or ten years for studies involving human participants. Storage on personal devices is not acceptable; departmental servers and the institutional archive are the only approved locations.',
            questions: [
              { id: 'R1-7q', type: 'choice', prompt: 'How long must data from human studies be kept?', options: ['Five years', 'Ten years', 'Two years', 'Indefinitely'], answer: 'Ten years', explain: 'Nghiên cứu có người tham gia: 10 năm.' },
            ],
          },
          {
            id: 'R1-8',
            title: 'Chương trình hội nghị',
            text: 'Day two: 09:00 Keynote — materials for a circular economy. 10:30 Parallel session A — catalysis. Parallel session B — data infrastructure. 13:00 Poster viewing with authors present. 15:00 Panel — funding early-career researchers. The keynote will be recorded; parallel sessions will not.',
            questions: [
              { id: 'R1-8q', type: 'choice', prompt: 'Which part of the programme will be recorded?', options: ['The keynote', 'Session A only', 'Session B only', 'The poster viewing'], answer: 'The keynote', explain: 'Chỉ bài keynote được ghi lại.' },
            ],
          },
          {
            id: 'R1-9',
            title: 'Nhận xét bản thảo',
            text: 'The dataset is impressive and the analysis is careful. My reservation concerns the discussion, which presents correlation as though it were causation. The authors should either provide a mechanism or soften their claims; as written, the conclusion is stronger than the evidence permits.',
            questions: [
              { id: 'R1-9q', type: 'choice', prompt: 'What is the reviewer’s main criticism?', options: ['The dataset is too small', 'The conclusion overstates what the evidence supports', 'The statistics are incorrect', 'The literature review is outdated'], answer: 'The conclusion overstates what the evidence supports', explain: 'Người phản biện cho rằng kết luận mạnh hơn mức bằng chứng cho phép.' },
            ],
          },
          {
            id: 'R1-10',
            title: 'Bài đăng trên diễn đàn',
            text: 'I spent eight months on a reaction that never worked. Looking back, the useful part was not the result but the failure log I kept. When I changed labs, that log saved my new group about three weeks. Publish your failures — not in a journal, just in the group archive.',
            questions: [
              { id: 'R1-10q', type: 'choice', prompt: 'What does the writer recommend?', options: ['Avoiding ambitious projects', 'Sharing failed experiments within the group', 'Publishing failures in journals', 'Working alone on difficult reactions'], answer: 'Sharing failed experiments within the group', explain: 'Khuyến khích lưu và chia sẻ thí nghiệm thất bại trong nhóm.' },
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
            title: 'Preparation and the lucky accident',
            text: `The history of science is full of discoveries that arrived by accident, and this has encouraged a comfortable belief that breakthroughs are essentially a matter of luck. The evidence, however, points elsewhere. Accidents are common; recognising them is rare.

Consider penicillin. Alexander Fleming returned from holiday in 1928 to find that a stray mould had killed the bacteria in one of his dishes. Thousands of researchers had seen contaminated plates before him and had thrown them away as spoiled experiments. What distinguished Fleming was not the accident but the fact that he had spent years studying antibacterial substances and was therefore able to see a contamination event as a possible remedy.

The sociologist Robert Merton later described the pattern as the prepared mind. His argument was not mystical. A researcher who has spent a decade in a field carries, in memory, a dense map of what is known, which is precisely what allows an unexpected observation to be classified immediately as interesting rather than as noise. Preparation does not produce luck; it converts luck into information.

This has an uncomfortable implication for the way research is organised. If discovery depends on long immersion, then constant movement between short projects is likely to be expensive in a way that never appears in a budget. A laboratory that hires researchers for eighteen-month contracts may find that nobody stays long enough to notice when something strange happens. The cost is invisible, because you cannot count the discoveries that never occurred.

There is a second, more practical implication. If recognition depends on having the right framework available, then the frameworks we teach matter enormously. Students who learn only the current dominant explanation may be well trained and yet unable to see anything that does not fit it. This is an argument not for vagueness but for breadth: reading outside your immediate specialism increases the number of categories in which an odd result can be filed.

None of this means that curiosity is sufficient on its own. Curiosity without method produces notebooks full of observations and no conclusions. The point is rather that curiosity and discipline are not rivals. Method tells you that something is wrong; curiosity is what makes you want to know why, and preparation is what eventually allows you to answer. The three together are what we call, rather carelessly, a lucky break.`,
            glossary: [
              { word: 'stray', meaning: 'lạc, rơi vào' },
              { word: 'contaminated', meaning: 'bị nhiễm khuẩn, nhiễm bẩn' },
              { word: 'immersion', meaning: 'sự đắm mình, chìm sâu' },
              { word: 'framework', meaning: 'khung lý thuyết, cách hiểu' },
              { word: 'specialism', meaning: 'chuyên ngành' },
            ],
            questions: [
              { id: 'R2-1q1', type: 'choice', prompt: 'What is the writer’s main argument?', options: ['Scientific discoveries are mainly a matter of luck', 'Preparation is what allows an accident to be recognised', 'Accidents in laboratories are rare', 'Fleming was a careless researcher'], answer: 'Preparation is what allows an accident to be recognised', explain: 'Mở bài phản đối niềm tin rằng đột phá chủ yếu nhờ may mắn.' },
              { id: 'R2-1q2', type: 'choice', prompt: 'How did Fleming differ from earlier researchers?', options: ['He worked alone', 'He had studied antibacterial substances for years', 'He kept a cleaner laboratory', 'He published more quickly'], answer: 'He had studied antibacterial substances for years', explain: 'Ông đã nghiên cứu chất kháng khuẩn nhiều năm nên nhận ra ý nghĩa sự nhiễm khuẩn.' },
              { id: 'R2-1q3', type: 'choice', prompt: 'What does “the prepared mind” mean in the passage?', options: ['A mind trained to remember facts by heart', 'A mind that can classify an unexpected observation as interesting', 'A mind free of previous theories', 'A mind that works quickly under pressure'], answer: 'A mind that can classify an unexpected observation as interesting', explain: 'Sự chuẩn bị giúp phân loại ngay quan sát bất ngờ là đáng chú ý, không phải nhiễu.' },
              { id: 'R2-1q4', type: 'choice', prompt: 'According to Merton, preparation…', options: ['creates good fortune', 'turns good fortune into usable information', 'replaces the need for method', 'slows down discovery'], answer: 'turns good fortune into usable information', explain: '“Preparation does not produce luck; it converts luck into information.”' },
              { id: 'R2-1q5', type: 'choice', prompt: 'What is the uncomfortable implication for research organisation?', options: ['Long projects are unnecessary', 'Short contracts may mean nobody notices the unexpected', 'Budgets should be increased', 'Holidays should be shorter'], answer: 'Short contracts may mean nobody notices the unexpected', explain: 'Hợp đồng ngắn khiến không ai ở đủ lâu để nhận ra điều bất thường.' },
              { id: 'R2-1q6', type: 'choice', prompt: 'Why can the cost of short projects be called invisible?', options: ['Because it is paid by funders', 'Because discoveries that never happen cannot be counted', 'Because it appears late in the accounts', 'Because researchers do not report it'], answer: 'Because discoveries that never happen cannot be counted', explain: '“you cannot count the discoveries that never occurred”.' },
              { id: 'R2-1q7', type: 'choice', prompt: 'What does the writer say about teaching only the dominant explanation?', options: ['It produces well-trained but narrow observers', 'It is the most efficient approach', 'It encourages curiosity', 'It is unavoidable in modern science'], answer: 'It produces well-trained but narrow observers', explain: 'Học sinh có thể được huấn luyện tốt nhưng không thấy được điều không khớp.' },
              { id: 'R2-1q8', type: 'choice', prompt: 'Why does reading outside your specialism help?', options: ['It shortens your project', 'It increases the categories in which an odd result can be filed', 'It improves your writing style', 'It impresses reviewers'], answer: 'It increases the categories in which an odd result can be filed', explain: 'Mở rộng “ngăn kéo” để xếp một kết quả lạ.' },
              { id: 'R2-1q9', type: 'choice', prompt: 'What does the writer say about curiosity without method?', options: ['It produces conclusions', 'It produces notebooks of observations and no conclusions', 'It is impossible', 'It is enough for a career'], answer: 'It produces notebooks of observations and no conclusions', explain: 'Tò mò mà thiếu phương pháp chỉ cho ra sổ ghi chép, không có kết luận.' },
              { id: 'R2-1q10', type: 'fill', prompt: 'The three elements together are what we rather carelessly call a lucky ___ . (one word)', answers: ['break'], explain: '“what we call, rather carelessly, a lucky break”.' },
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
            title: 'Who should own a discovery?',
            text: `When a university licenses a promising molecule to a pharmaceutical company, three claims collide at once. The researcher claims credit for the idea, the institution claims ownership of the laboratory and the equipment, and the public, which paid for the grant, claims some right to the result. Current arrangements resolve this collision in a way that few people would have designed deliberately.

The legal instrument is the patent, and its original justification was straightforward: an inventor who cannot profit from an idea will not invest in developing it. A patent grants a temporary monopoly in exchange for publishing the details. In theory, this is a bargain between private interest and public knowledge. In practice, the bargain has become increasingly one-sided.

Consider the case of a diagnostic test for a rare disease. If the test is patented broadly, a hospital laboratory that wants to adapt the method for its own population may be legally unable to do so, even though the adaptation requires no new invention. The original publication, meanwhile, is available to everyone, which gives the misleading impression that the knowledge is freely usable. Access to the text is not access to the technology.

Yet the opposite position — that discoveries should be entirely unprotected — is difficult to defend. A molecule is not a poem; turning it into a medicine costs hundreds of millions and takes a decade, and the risk of failure is high. If any competitor could copy a successful product immediately, the investment would never be made, and patients would wait longer for treatments. Critics who call for the abolition of patents are usually arguing from the point of distribution rather than production.

A more promising direction is to change the conditions attached to the monopoly rather than to remove it. Several publicly funded agencies now require that products developed with their money be priced affordably in the country of origin, or that licences be granted to manufacturers in low-income regions. These conditions are unglamorous and easy to evade, but they shift the question from who owns knowledge to what ownership must deliver.

The deeper issue, however, may be cultural. Universities measure success by patents filed and licences signed, because those numbers are visible to funders. Sharing methods, curating data and writing careful negative results are poorly rewarded, although they are the activities on which the whole system silently depends. A patent is a claim about the future; a shared dataset is an investment in it.`,
            glossary: [
              { word: 'collide', meaning: 'va chạm, xung đột' },
              { word: 'monopoly', meaning: 'độc quyền' },
              { word: 'one-sided', meaning: 'một chiều, bất lợi cho một bên' },
              { word: 'evade', meaning: 'lách, trốn tránh' },
              { word: 'curate', meaning: 'chăm chút, tổ chức dữ liệu' },
            ],
            questions: [
              { id: 'R3-1q1', type: 'choice', prompt: 'What three claims does the first paragraph describe?', options: ['Researcher, institution and public', 'Company, patient and government', 'Investor, editor and reviewer', 'Author, reviewer and publisher'], answer: 'Researcher, institution and public', explain: 'Ba bên: nhà nghiên cứu, cơ quan và công chúng.' },
              { id: 'R3-1q2', type: 'choice', prompt: 'What was the original justification for patents?', options: ['To keep inventions secret', 'To reward investment in development', 'To reduce the cost of medicine', 'To protect universities'], answer: 'To reward investment in development', explain: 'Độc quyền tạm thời để khuyến khích đầu tư phát triển.' },
              { id: 'R3-1q3', type: 'choice', prompt: 'What is the patent described as, in theory?', options: ['A bargain between private interest and public knowledge', 'A form of taxation', 'A subsidy for universities', 'A guarantee of quality'], answer: 'A bargain between private interest and public knowledge', explain: '“a bargain between private interest and public knowledge”.' },
              { id: 'R3-1q4', type: 'choice', prompt: 'In the diagnostic test example, what is the problem?', options: ['The method was never published', 'A hospital cannot adapt the method for its own population', 'The disease is too rare to study', 'The test is inaccurate'], answer: 'A hospital cannot adapt the method for its own population', explain: 'Bệnh viện có thể bị ngăn cản hợp pháp khi muốn điều chỉnh phương pháp.' },
              { id: 'R3-1q5', type: 'choice', prompt: 'What misleading impression does the writer point out?', options: ['That hospitals are uninterested in research', 'That a published text means the technology is freely usable', 'That rare diseases are unimportant', 'That patents are cheap'], answer: 'That a published text means the technology is freely usable', explain: '“Access to the text is not access to the technology.”' },
              { id: 'R3-1q6', type: 'choice', prompt: 'Why is the abolition of patents difficult to defend?', options: ['It would slow the development of treatments', 'It is illegal', 'It would confuse the public', 'It would reduce university income only'], answer: 'It would slow the development of treatments', explain: 'Không có bảo hộ thì không có đầu tư, bệnh nhân phải chờ lâu hơn.' },
              { id: 'R3-1q7', type: 'choice', prompt: 'What does the writer suggest instead of removing the monopoly?', options: ['Shortening it slightly', 'Changing the conditions attached to it', 'Giving it to universities', 'Abolishing public funding'], answer: 'Changing the conditions attached to it', explain: 'Thay đổi điều kiện kèm theo quyền độc quyền.' },
              { id: 'R3-1q8', type: 'choice', prompt: 'How does the writer judge those conditions?', options: ['Unglamorous and easy to evade, but they shift the question', 'Impossible to enforce at all', 'Perfectly designed', 'Rejected by industry'], answer: 'Unglamorous and easy to evade, but they shift the question', explain: '“unglamorous and easy to evade, but they shift the question”.' },
              { id: 'R3-1q9', type: 'choice', prompt: 'Why do universities emphasise patents?', options: ['They generate most income', 'Because such numbers are visible to funders', 'Because researchers prefer them', 'Because patents are required by law'], answer: 'Because such numbers are visible to funders', explain: 'Số liệu bằng sáng chế dễ thấy với nhà tài trợ.' },
              { id: 'R3-1q10', type: 'choice', prompt: 'What does the writer’s final contrast mean?', options: ['Patents are worthless', 'A shared dataset invests in future knowledge while a patent claims it', 'Datasets should also be patented', 'Universities should stop publishing'], answer: 'A shared dataset invests in future knowledge while a patent claims it', explain: 'Bằng sáng chế là lời tuyên bố về tương lai; dữ liệu chia sẻ là đầu tư cho tương lai.' },
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
            title: 'Why a trial needs a comparison group',
            text: `It is tempting to test a new treatment by giving it to a group of patients and recording how many improve. The problem is that some patients would (1)___ improved anyway.

This is why a controlled trial includes a comparison group. Ideally, participants are allocated at random, (2)___ ensures that the two groups differ only by chance. Randomisation protects (3)___ the temptation to give the new treatment to the patients who seem most likely to recover.

Blinding is a second safeguard. If the doctor knows which treatment a patient is (4)___, subtle decisions — when to adjust a dose, when to order an extra test — may drift in a way that favours the new drug. In a double-blind trial, (5)___ the participants nor the assessors know who received what.

Statistics then enter. Even with randomisation, the two groups will not be identical, so the analysis must ask (6)___ the observed difference is larger than could plausibly arise by chance. A result is described (7)___ statistically significant when that probability is small, though small is not the same (8)___ important.

Ethics constrain all of this. A trial is stopped early if the new treatment is clearly (9)___, because it would be wrong to continue giving the comparison group an inferior option. The design of a trial is therefore never purely technical; it is a compromise between rigour, resources and the obligations we (10)___ to the people who volunteer.`,
            questions: [
              { id: 'R4-1q1', type: 'choice', prompt: 'Chỗ (1)', options: ['have', 'be', 'get', 'do'], answer: 'have', explain: '“would have improved anyway” — điều kiện giả định ở quá khứ.' },
              { id: 'R4-1q2', type: 'choice', prompt: 'Chỗ (2)', options: ['that', 'which', 'what', 'whose'], answer: 'which', explain: 'Mệnh đề quan hệ bổ sung cho cả mệnh đề trước.' },
              { id: 'R4-1q3', type: 'choice', prompt: 'Chỗ (3)', options: ['against', 'from', 'of', 'for'], answer: 'against', explain: '“protects against the temptation”.' },
              { id: 'R4-1q4', type: 'choice', prompt: 'Chỗ (4)', options: ['receiving', 'received', 'receive', 'to receive'], answer: 'receiving', explain: 'Sau “is” cần V-ing tiếp diễn.' },
              { id: 'R4-1q5', type: 'choice', prompt: 'Chỗ (5)', options: ['either', 'neither', 'both', 'not only'], answer: 'neither', explain: '“neither … nor …”.' },
              { id: 'R4-1q6', type: 'choice', prompt: 'Chỗ (6)', options: ['whether', 'weather', 'that', 'unless'], answer: 'whether', explain: '“ask whether the observed difference is larger…”.' },
              { id: 'R4-1q7', type: 'choice', prompt: 'Chỗ (7)', options: ['as', 'like', 'so', 'such'], answer: 'as', explain: '“described as statistically significant”.' },
              { id: 'R4-1q8', type: 'choice', prompt: 'Chỗ (8)', options: ['as', 'than', 'to', 'with'], answer: 'as', explain: '“the same as important”.' },
              { id: 'R4-1q9', type: 'choice', prompt: 'Chỗ (9)', options: ['superior', 'superiority', 'superiorly', 'superiors'], answer: 'superior', explain: 'Sau “is clearly” cần tính từ.' },
              { id: 'R4-1q10', type: 'choice', prompt: 'Chỗ (10)', options: ['owe', 'own', 'lend', 'borrow'], answer: 'owe', explain: '“the obligations we owe to volunteers”.' },
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
        title: 'Task 1 · Email báo cáo sự cố thiết bị',
        prompt: 'You are a research assistant. A fault in the environmental chamber has ruined a batch of specimens, and your supervisor is abroad. Write an email (at least 150 words) to Professor Hartley in which you: describe the fault and its effect, explain what you have already done, propose how to proceed, and ask for approval of your plan.',
        minWords: 150,
        checklist: [
          { label: 'Có lời chào trang trọng và lời kết phù hợp', hint: 'Dear Professor Hartley, … / Kind regards,' },
          { label: 'Nêu rõ mục đích ngay đoạn đầu', hint: 'I am writing to inform you of…' },
          { label: 'Mô tả sự cố kèm số liệu cụ thể', hint: 'a rise of eleven degrees between 02:00 and 05:00' },
          { label: 'Trình bày việc đã làm để hạn chế thiệt hại', hint: 'I have quarantined…, photographed…, contacted…' },
          { label: 'Đề xuất phương án và nêu hệ quả (thời hạn)', hint: 'I propose to restart…, which would delay… by…' },
          { label: 'Có câu đề nghị phê duyệt và thời hạn trả lời', hint: 'Could you confirm by the end of the week?' },
          { label: 'Giọng văn trang trọng, ít nhất 150 từ', hint: 'Tránh viết tắt; dùng “I would be grateful if…”' },
        ],
        tips: [
          'Bậc C1 yêu cầu email dài hơn (≥150 từ): hãy tách 3–4 đoạn, mỗi đoạn một chức năng.',
          'Đừng chỉ kể lại sự cố — phải nêu rõ hậu quả định lượng (chậm bao lâu, mất bao nhiêu mẫu).',
          'Dùng cấu trúc lịch sự hàm ý ở bậc C1: “I would rather…”, “Should you prefer an alternative…”.',
          'Tránh lặp “problem”: thay bằng fault, malfunction, setback, disruption.',
        ],
        model: `Dear Professor Hartley,

I am writing to inform you of a fault in the environmental chamber that has affected the second stage of the polymer ageing study, and to ask for your approval of the recovery plan I have drafted.

At approximately 02:00 on Monday the chamber failed to hold its set temperature. The data logger shows a rise of eleven degrees between 02:00 and 05:00, which is well outside the tolerance of two degrees that we agreed with the funder. Sixteen specimens from batch B were exposed during that window.

I have taken three immediate steps. First, I quarantined the affected specimens and photographed the chamber display before resetting it. Second, I exported the logger file to the project archive so that the deviation is documented. Third, I asked the engineering workshop to inspect the unit; they can attend on Thursday.

Because the exposed specimens cannot be used, I propose to restart batch B on Monday, which would delay the final report by roughly three weeks. I would rather report a clean data set than explain an anomaly later, and the funder has already agreed to one extension.

Could you confirm by the end of the week? I would also be grateful for your view on whether we should reserve a second chamber as a precaution.

Kind regards,
Nguyen Thi Mai`,
      },
      {
        id: 'W2',
        task: 2,
        title: 'Task 2 · Luận: nhà nước hay doanh nghiệp nên tài trợ nghiên cứu?',
        prompt: 'Some people argue that scientific research should be funded entirely by governments rather than by private companies. To what extent do you agree or disagree with this view? Support your position with reasons and examples. Write at least 300 words.',
        minWords: 300,
        checklist: [
          { label: 'Mở bài nêu rõ mức độ đồng ý (agree / largely disagree)', hint: 'In my view, a mixed system is…' },
          { label: 'Có đoạn lập luận ủng hộ tài trợ nhà nước', hint: 'The case for public funding rests on…' },
          { label: 'Có đoạn nêu hạn chế của việc chỉ dựa vào nhà nước', hint: 'However, public budgets move with election cycles…' },
          { label: 'Có đoạn về rủi ro của tài trợ tư nhân và cách kiểm soát', hint: 'The real risk is not that it exists but that it is invisible.' },
          { label: 'Có ít nhất 2 ví dụ cụ thể (vắc-xin, nghiên cứu cơ bản, khí hậu…)', hint: 'long-term climate monitoring, vaccine development' },
          { label: 'Dùng cấu trúc học thuật bậc C1 (nhượng bộ, phản biện)', hint: 'Admittedly…, yet…, provided that…' },
          { label: 'Kết luận khẳng định lại quan điểm, không nêu ý mới', hint: 'In conclusion, …' },
          { label: 'Đủ 300 từ, câu phức đa dạng', hint: 'Kiểm tra số từ; tránh lặp “research”, “money”' },
        ],
        tips: [
          'Đề dạng “to what extent” bậc C1 cần một lập trường có mức độ, không phải “đúng/sai” tuyệt đối.',
          'Cấu trúc ăn điểm: mở bài → ủng hộ → phản biện → điều kiện để hệ thống hỗn hợp hoạt động → kết luận.',
          'Đưa ít nhất một phản ví dụ (nhà nước cũng có thể thất bại), điều này thể hiện tư duy phản biện bậc C1.',
          'Tránh tuyệt đối hoá: dùng largely, for the most part, provided that, on balance.',
        ],
        model: `Few questions in science policy divide opinion as sharply as the question of money. Some argue that research should be financed entirely by the state, on the grounds that knowledge belongs to everyone and that commercial motives distort it. Others reply that public budgets are too small and too political to carry the whole burden. In my view, a mixed system is not merely practical but intellectually healthier, although the balance must be managed deliberately.

The case for public funding rests on a straightforward observation: the most valuable research is often the least profitable. Basic mathematics, taxonomy and long-term climate monitoring produce nothing that a company can sell, yet every applied breakthrough rests on them. If only profitable questions were studied, the pipeline of ideas would gradually run dry. Public money also protects researchers from the temptation to shape findings to please a sponsor, which is precisely why independent agencies exist.

The argument that governments alone should pay, however, is difficult to sustain. Public budgets move with election cycles, whereas a drug trial or a fusion experiment may need a decade of uninterrupted funding. Private laboratories, whatever their faults, can commit to a project for as long as it remains promising, and they are usually quicker to push a discovery towards something people can actually use. Many vaccines and diagnostic tools reached clinics far sooner because a company was willing to take the commercial risk.

The real danger of private involvement is not that it exists but that it is invisible. When a funder can veto publication, or when a dataset is treated as a trade secret, the research community loses the ability to check the claim. Here the state has a role that money alone cannot replace: it can require transparency as a condition of partnership, and it can insist that publicly funded results be priced affordably.

In conclusion, I disagree with the view that governments should be the sole source of research funding. A system in which public money supports curiosity and long horizons, while private money accelerates application, is more productive — provided that openness is enforced. Funding is a means; the goal is reliable knowledge.`,
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
        instruction: 'Bạn sẽ nghe 3 câu hỏi về khoa học, công nghệ và thói quen học tập. Trả lời mỗi câu 1–2 phút, nói tự nhiên như đang trò chuyện.',
        minutes: 3,
        questions: [
          { q: 'Which scientific discovery do you think has changed everyday life the most?', sample: 'I would say the development of vaccines, though it is easy to overlook because it works invisibly. Before widespread immunisation, infectious disease shaped how families planned their lives, and life expectancy was far lower. What makes vaccination such an interesting example is that its benefit is collective: it protects people who have not been vaccinated themselves. If I compare it with something more visible, such as the smartphone, I think vaccination has changed the fundamentals of life more, even though it is much less discussed.' },
          { q: 'How do you decide whether a piece of scientific news is trustworthy?', sample: 'I try to do three things. First, I look for the original study rather than the headline, because headlines tend to simplify. Second, I check whether the study has been peer reviewed or is still a preprint, and how large the sample was. Third, I ask what the authors themselves claim — usually they are far more cautious than the article about them. If I cannot find the original, I treat the news as interesting but unconfirmed.' },
          { q: 'Would you like to work in a research laboratory? Why or why not?', sample: 'Partly, but not permanently. I enjoy the process of testing an idea, and I like that research gives you a problem that nobody has solved yet. What worries me is the uncertainty: experiments often fail, funding is competitive, and results may take years. So I would probably prefer a role that combines research with teaching or communication, where I can see progress more regularly and explain the work to people outside the field.' },
        ],
      },
      {
        id: 'S2',
        kind: 'solution',
        title: 'Part 2 · Thảo luận giải pháp',
        instruction: 'Bạn và một người bạn đang bàn cách giảm lượng rác thải nhựa trong phòng thí nghiệm của trường đại học. Hãy thảo luận ưu điểm, nhược điểm của 3 lựa chọn rồi chọn một phương án và giải thích.',
        minutes: 4,
        situation: 'A university laboratory produces a large amount of single-use plastic every week, and the department has been asked to cut it by half within a year. Three options are suggested.',
        options: [
          'Replace disposable items with glassware that must be washed and sterilised',
          'Buy a machine that recycles the laboratory’s own plastic into new trays and racks',
          'Redesign experiments so that smaller volumes and fewer containers are needed',
        ],
        sample: `Let us examine the three proposals. Switching to glassware sounds like the obvious answer, and it would remove a great deal of waste. The difficulty is the hidden cost: washing and sterilising consumes water, energy and staff time, and if the cleaning is not validated, contamination risks rise. So the environmental gain may be smaller than it looks, and the quality risk is real.

The recycling machine addresses the waste at the end of the chain, which is attractive because nothing about the experiments changes. However, laboratory plastic is often contaminated with chemical or biological material, so it cannot simply be melted down. The machine is expensive, and it works only if the whole department separates its waste correctly.

The third option is the least glamorous and, in my view, the most effective. Redesigning protocols — smaller reaction volumes, shared control samples, multi-well plates instead of individual tubes — reduces waste at the source and often saves money as well. It also requires no new equipment. The drawback is that it takes the most human effort: somebody has to review every protocol.

If I had to choose one, I would begin with the third, and combine it with glassware for the handful of items where cleaning is easy to validate. Reducing consumption is permanent, whereas recycling only reduces the damage already done.`,
      },
      {
        id: 'S3',
        kind: 'topic',
        title: 'Part 3 · Phát triển chủ đề',
        instruction: 'Trình bày quan điểm của bạn về chủ đề dưới đây (khoảng 3 phút), dựa vào 3 gợi ý. Sau đó trả lời 2 câu hỏi mở rộng.',
        minutes: 5,
        topic: 'Innovation depends more on curiosity than on money.',
        outline: [
          'Vì sao tò mò là động lực quan trọng của đổi mới',
          'Vì sao tiền vẫn cần thiết — và giới hạn của nó',
          'Điều gì tạo ra môi trường đổi mới tốt nhất',
        ],
        questions: [
          { q: 'Do you think governments should spend more on basic research or on applied research?', sample: 'I would argue for basic research, though not exclusively. Applied research usually solves problems we have already identified, so its returns are easier to justify politically. Basic research, by contrast, produces the frameworks that later make solutions possible — nobody studying bacterial genetics in the 1970s was trying to invent gene editing. The difficulty is that its value is invisible for decades, which is exactly why it needs protection from short-term funding cycles. In practice, I would want a portfolio that keeps a substantial share for curiosity-driven work.' },
          { q: 'How can schools encourage curiosity rather than simply transmit knowledge?', sample: 'I think it comes down to giving students genuine questions rather than only answers. In one of my classes we were asked to design an experiment on something we actually wondered about, and even though the results were messy, I remember that unit far better than anything I memorised. Practically, that means fewer textbook exercises and more open tasks, and teachers who are willing to say they do not know the answer. It also means rewarding the quality of the question, not just the correctness of the answer.' },
        ],
      },
    ],
  },
};
