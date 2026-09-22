/**
 * Luyện nói B1 theo cấu trúc đề thi: Part 1 (câu hỏi ngắn), Part 2 (cue card + bài mẫu),
 * Part 3 (thảo luận) và cụm từ hữu ích. Bài mẫu đọc được bằng Web Speech API,
 * người học ghi âm lại để tự so sánh.
 */
export const speakingTopics = [
  {
    id: 'hometown',
    title: 'Quê hương & nơi ở',
    topic: 'Đời sống',
    warmUp: [
      { q: 'Where are you from?', sample: 'I am from Da Nang, a city on the coast of central Vietnam.' },
      { q: 'What do you like most about your hometown?', sample: 'The best thing is the food. There are small restaurants everywhere, and everything is fresh and cheap.' },
      { q: 'Would you like to live there in the future?', sample: 'Maybe. I enjoy my studies here, but I would like to be near my family later.' },
    ],
    cue: {
      task: 'Describe a place in your town that you often go to.',
      bullets: ['Where it is', 'How often you go there', 'What you do there', 'Why you like it'],
      model: `I would like to talk about a small park near my house. It is about five minutes away on foot, next to the river. I go there three or four times a week, usually in the evening after dinner. I normally walk around the lake and then sit on a bench and read for about half an hour. Sometimes I meet my friends there and we play badminton. I like this place because it is quiet but not empty, so I can relax and still feel part of the city. The trees also make the air cooler than in the streets nearby, which is really pleasant in summer.`,
    },
    discussion: [
      { q: 'Why do people need green spaces in cities?', sample: 'I think there are two reasons. First, they give people a place to relax and exercise without paying. Second, they make the air cleaner and the temperature lower.' },
      { q: 'Do young people and older people use public places in the same way?', sample: 'Not really. Young people often come in groups to play sport, while older people prefer to walk slowly and chat with their neighbours.' },
    ],
    phrases: [
      { phrase: 'It is about five minutes away on foot', meaning: 'cách khoảng 5 phút đi bộ' },
      { phrase: 'I go there three or four times a week', meaning: 'tôi đến đó 3–4 lần một tuần' },
      { phrase: 'the best thing is…', meaning: 'điều tuyệt nhất là…' },
      { phrase: 'I feel part of the city', meaning: 'tôi cảm thấy mình thuộc về thành phố' },
    ],
  },
  {
    id: 'free-time',
    title: 'Thời gian rảnh & sở thích',
    topic: 'Đời sống',
    warmUp: [
      { q: 'What do you usually do in your free time?', sample: 'I usually watch films or go running. Running helps me clear my head after a long day.' },
      { q: 'Do you prefer spending your free time alone or with friends?', sample: 'It depends. During the week I prefer to be alone, but at the weekend I like meeting friends for coffee.' },
    ],
    cue: {
      task: 'Describe a hobby you have had for a long time.',
      bullets: ['What it is', 'When you started', 'How you do it', 'Why you still enjoy it'],
      model: `The hobby I want to describe is photography. I started about four years ago, when my brother gave me his old camera. At first I only took pictures of my friends, but later I began to go out early in the morning to photograph streets and markets before they get busy. I usually spend an hour or two walking around, and then I choose three or four photos to edit. I still enjoy it because I notice much more about my own city now, and it is also a good reason to leave the house when I feel tired or stressed.`,
    },
    discussion: [
      { q: 'Why do some hobbies become expensive?', sample: 'Because as people get better at something, they often want better equipment. Advertising also pushes them to buy new things they do not really need.' },
      { q: 'Should schools spend more time on sports and art?', sample: 'I believe so. Those lessons teach teamwork and creativity, and many students do not have the chance to try them outside school.' },
    ],
    phrases: [
      { phrase: 'clear my head', meaning: 'thư giãn đầu óc' },
      { phrase: 'at first… but later…', meaning: 'lúc đầu… nhưng sau đó…' },
      { phrase: 'It is a good reason to…', meaning: 'đó là lý do tốt để…' },
      { phrase: 'It depends.', meaning: 'Còn tuỳ.' },
    ],
  },
  {
    id: 'technology',
    title: 'Công nghệ trong đời sống',
    topic: 'Công nghệ',
    warmUp: [
      { q: 'How much time do you spend on your phone every day?', sample: 'Probably about three hours, mostly for messages and short videos. I am trying to reduce it before bed.' },
      { q: 'What do you use your computer for?', sample: 'Mainly for studying and writing. I also take online classes twice a week.' },
    ],
    cue: {
      task: 'Describe an app or website you use often.',
      bullets: ['What it is', 'How you found it', 'How you use it', 'Why it is useful'],
      model: `I would like to talk about a vocabulary app on my phone. I found it about two years ago when I was preparing for an exam and my teacher recommended it. I use it for about fifteen minutes every evening: the app shows me words I learned before and asks me to remember their meaning, and if I forget, the word comes back sooner. What makes it useful is the timing — it brings words back just before I forget them, so I do not have to sit and read a long list. I also like that I can use it on the bus, so I study without taking extra time out of my day.`,
    },
    discussion: [
      { q: 'Do you think technology makes people lazier?', sample: 'Partly. Machines do the boring work, but that can be a good thing. The problem is when we use phones to avoid thinking or talking to people.' },
      { q: 'How can parents control children’s screen time?', sample: 'Clear rules help, for example no phones during meals, and parents should follow the same rules themselves to be believable.' },
    ],
    phrases: [
      { phrase: 'What makes it useful is…', meaning: 'điều làm nó hữu ích là…' },
      { phrase: 'I use it for about fifteen minutes', meaning: 'tôi dùng nó khoảng 15 phút' },
      { phrase: 'take extra time out of my day', meaning: 'lấy thêm thời gian trong ngày' },
      { phrase: 'follow the same rules', meaning: 'tuân theo cùng quy tắc' },
    ],
  },
  {
    id: 'study-plan',
    title: 'Học tập & kế hoạch',
    topic: 'Học tập',
    warmUp: [
      { q: 'What are you studying at the moment?', sample: 'I am studying English and business, and I hope to work in marketing later.' },
      { q: 'Do you prefer studying in the morning or at night?', sample: 'In the morning. My concentration is much better before lunch, so I do the difficult tasks first.' },
    ],
    cue: {
      task: 'Describe a goal you want to achieve in the next year.',
      bullets: ['What the goal is', 'Why you chose it', 'What you will do', 'How you will know you succeeded'],
      model: `My main goal for next year is to reach level B1 in English and pass an exam. I chose it because I need a certificate for my job application, and because my listening is much weaker than my reading. To reach it, I have made a simple plan. Every day I listen to twenty minutes of English, either a podcast or a short video with subtitles, and I write down five new phrases. Twice a week I meet a friend and we speak in English for thirty minutes. I will know I have succeeded when I can understand a podcast without subtitles and when I get at least 60 per cent in a practice test.`,
    },
    discussion: [
      { q: 'Why do many people give up on their goals?', sample: 'I think the goals are often too big and too fast. If you say “one hour a day”, you stop after three days. Small and regular works better.' },
      { q: 'Is it better to study alone or with other people?', sample: 'Both have a place. Alone is better for grammar and reading; with others is better for speaking, because you get real practice and feedback.' },
    ],
    phrases: [
      { phrase: 'My main goal is to…', meaning: 'mục tiêu chính của tôi là…' },
      { phrase: 'I have made a simple plan', meaning: 'tôi đã đặt ra một kế hoạch đơn giản' },
      { phrase: 'small and regular works better', meaning: 'ít mà đều đặn thì hiệu quả hơn' },
      { phrase: 'I will know I have succeeded when…', meaning: 'tôi sẽ biết mình thành công khi…' },
    ],
  },
  {
    id: 'food',
    title: 'Ăn uống & sức khoẻ',
    topic: 'Sức khoẻ',
    warmUp: [
      { q: 'Do you cook? How often?', sample: 'Yes, about four times a week. I learned from my mother when I moved to a new city.' },
      { q: 'What is your favourite dish?', sample: 'Fish soup with tomatoes. It is simple, cheap and it reminds me of home.' },
    ],
    cue: {
      task: 'Describe a meal you will never forget.',
      bullets: ['When it was', 'Who you were with', 'What you ate', 'Why you remember it'],
      model: `The meal I remember best was a dinner in Hoi An two years ago. I was travelling with two friends, and on our last evening it started raining heavily, so we ran into the first small restaurant we saw. We ordered four dishes to share, so I cannot remember all of them, but there was grilled fish with herbs and a bowl of soup with noodles. What made the evening special was not really the food, although it was delicious. We sat near the window, the owner told us stories about the town, and we talked for three hours without looking at our phones. That is why it stays in my memory.`,
    },
    discussion: [
      { q: 'Why is fast food so popular today?', sample: 'It is cheap and quick, and it fits a busy lifestyle. I also think advertising makes people feel it is normal to eat it often.' },
      { q: 'How can governments encourage healthier eating?', sample: 'They could tax sugary drinks, require clearer labels, and make sure school meals are healthy. Education alone is not enough.' },
    ],
    phrases: [
      { phrase: 'the first restaurant we saw', meaning: 'nhà hàng đầu tiên chúng tôi thấy' },
      { phrase: 'What made it special was…', meaning: 'điều làm nó đặc biệt là…' },
      { phrase: 'it stays in my memory', meaning: 'nó còn mãi trong ký ức của tôi' },
      { phrase: 'fits a busy lifestyle', meaning: 'phù hợp với lối sống bận rộn' },
    ],
  },
  {
    id: 'travel-topic',
    title: 'Du lịch & trải nghiệm',
    topic: 'Du lịch',
    warmUp: [
      { q: 'Do you like travelling?', sample: 'Yes, very much. I like short trips to the mountains because they are cheap and easy to plan.' },
      { q: 'What do you always take with you?', sample: 'A light rain jacket and a book. I also download a map because the signal is not always good.' },
    ],
    cue: {
      task: 'Describe a journey that did not go as planned.',
      bullets: ['Where you went', 'What went wrong', 'How you solved it', 'What you learned'],
      model: `Last summer I travelled to a mountain town with a friend, and almost nothing went as planned. We arrived late because the bus broke down, so we missed the last local bus up the hill. There was no taxi, and the hotels we called were full. In the end, a woman who was closing her shop offered to take us to a homestay run by her cousin, and we stayed there for two nights. In fact, it was better than our original plan: her family cooked for us and showed us a path that tourists never use. I learned two things — always leave some free time in a plan, and ask local people when something goes wrong.`,
    },
    discussion: [
      { q: 'Why do people enjoy travelling to other countries?', sample: 'For the new experiences, I think — new food, new languages, and the feeling of being somewhere completely different.' },
      { q: 'Are there disadvantages to tourism?', sample: 'Yes. Popular places become crowded and expensive, and local people may move away because they cannot afford to live there.' },
    ],
    phrases: [
      { phrase: 'almost nothing went as planned', meaning: 'hầu như không gì theo kế hoạch' },
      { phrase: 'In the end…', meaning: 'cuối cùng thì…' },
      { phrase: 'In fact, it was better', meaning: 'thực ra nó còn tốt hơn' },
      { phrase: 'leave some free time in a plan', meaning: 'để dư thời gian trong kế hoạch' },
    ],
  },
  {
    id: 'vstep-part1-part3-family',
    title: 'VSTEP · Part 1 & 3 – Gia đình & cuộc sống',
    topic: 'VSTEP · Nói',
    warmUp: [
      { q: 'Can you tell me a little about your family?', sample: 'Yes, there are five people in my family: my parents, my older sister, my younger brother and me. We live in a small house on the edge of the city. My parents both work, so we usually eat together in the evening.' },
      { q: 'How much time do you spend with your family every day?', sample: 'Not very much on weekdays, maybe two hours in the evening. At the weekend we are together much more, and we often visit my grandparents.' },
      { q: 'Who does most of the housework in your home?', sample: 'My mother does most of the cooking, but we all help with the cleaning. My brother and I take turns washing the dishes, and my father goes shopping on Saturdays.' },
    ],
    cue: {
      task: 'Describe a member of your family who has influenced you.',
      bullets: ['Who this person is', 'How often you see them', 'What they are like', 'Why they have influenced you'],
      model: `There are five people in my family, but the person who has influenced me most is my grandmother. She is seventy-six and she lives in the same house as us, so I see her every day. My grandmother left school at fourteen and worked in a small shop for forty years, but she still reads two newspapers a day. She is patient and extremely practical: when I panic about an exam, she simply asks me what I will do in the next hour. She has influenced me in two ways. First, she taught me to keep learning even when the conditions are not perfect. Second, she showed me that calm is a skill you can practise. Whenever I have a difficult decision, I try to think about what she would say, and I usually slow down instead of rushing.`,
    },
    discussion: [
      { q: 'Do you think family life in Vietnam has changed in the last twenty years?', sample: 'Yes, I think it has changed a lot. Families are smaller than before, and more people move to big cities for work, so grandparents are not always nearby. On the other hand, parents and children now talk about careers and feelings much more openly than they used to.' },
      { q: 'Which is more important for children: family or school?', sample: 'Both matter, but I would say the family comes first, at least in the early years. Children learn how to speak, share and manage their feelings at home, long before they go to school. School then adds knowledge and friends, but it cannot replace what a family gives.' },
    ],
    phrases: [
      { phrase: 'there are five people in my family', meaning: 'gia đình tôi có năm người' },
      { phrase: 'the person who has influenced me most is…', meaning: 'người ảnh hưởng đến tôi nhiều nhất là…' },
      { phrase: 'She taught me to keep learning', meaning: 'bà đã dạy tôi phải tiếp tục học hỏi' },
      { phrase: 'I usually slow down instead of rushing', meaning: 'tôi thường chậm lại thay vì vội vàng' },
    ],
  },
  {
    id: 'vstep-solution-tourism',
    title: 'VSTEP · Part 2 – Chọn giải pháp (Du lịch)',
    topic: 'VSTEP · Nói',
    warmUp: [
      { q: 'Do you enjoy travelling?', sample: 'Yes, I do, especially short trips to the mountains. I like places where I can walk slowly and take photographs.' },
      { q: 'What do you usually do before a trip?', sample: 'I read about the place and check the weather. I also book the bus a few days early, because tickets sell out quickly.' },
      { q: 'Would you like to work in tourism one day?', sample: 'Maybe, but not as a hotel manager. I would prefer to be a guide, because I enjoy explaining things to visitors.' },
    ],
    cue: {
      task: 'Tình huống: Một thị trấn nhỏ cạnh vườn quốc gia đón quá nhiều khách du lịch vào mùa hè, gây tắc đường và nhiều rác thải. Hội đồng địa phương cần chọn một giải pháp. Bạn chọn phương án nào?',
      bullets: ['Phương án A: Giới hạn số khách mỗi ngày và bán vé vào vườn quốc gia đắt hơn', 'Phương án B: Phát triển du lịch cộng đồng – chỉ đón nhóm nhỏ, thuê hướng dẫn viên địa phương và chia lợi nhuận cho dân', 'Phương án C: Không thay đổi gì, chỉ mở rộng bãi đỗ xe và thuê thêm nhân viên dọn rác', 'Giải thích vì sao bạn chọn phương án đó'],
      model: `I would choose option B, developing community tourism. My first reason is that it deals with the cause rather than the symptoms. If visitors come in small groups with local guides, the town can control how many people arrive without turning the park into an expensive place that only rich tourists can visit. Money then stays in the town, so families have an interest in keeping the forest and the river clean. Option A would reduce the number of visitors, but it would also keep ordinary Vietnamese families out, and the money would go to the ticket office rather than to local people. Option C is the weakest choice: more car parks and more cleaners only encourage the problem to grow. I also think option B is more realistic, because local guides already know the area, so training them costs less than building new infrastructure. For these reasons, I believe community tourism is the best solution for the town.`,
    },
    discussion: [
      { q: 'What are the benefits of tourism for a small town?', sample: 'It creates jobs in hotels, restaurants and transport, and it can pay for better roads and facilities. Local people also learn about other cultures. However, the work is often seasonal, so the town needs other jobs in the low season.' },
      { q: 'Should local people have a say in how tourism is managed?', sample: 'Definitely. They live there all year, while tourists only stay a few days, so they understand what the town can and cannot support. If they are not involved, decisions are usually made for visitors rather than for residents.' },
    ],
    phrases: [
      { phrase: 'I would choose option B because…', meaning: 'tôi sẽ chọn phương án B vì…' },
      { phrase: 'it deals with the cause rather than the symptoms', meaning: 'nó giải quyết nguyên nhân chứ không chỉ hậu quả' },
      { phrase: 'The main drawback of option A is…', meaning: 'hạn chế chính của phương án A là…' },
      { phrase: 'local people have a say', meaning: 'người dân địa phương có tiếng nói' },
    ],
  },
]

export const speakingById = (id) => speakingTopics.find((topic) => topic.id === id) || speakingTopics[0]
