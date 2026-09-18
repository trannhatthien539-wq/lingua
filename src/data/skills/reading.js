/**
 * Bài đọc B1: đoạn văn 180–250 từ theo chủ đề, có từ khoá và câu hỏi đọc hiểu
 * (ý chính, chi tiết, suy luận, từ vựng trong ngữ cảnh).
 */
export const readingPassages = [
  {
    id: 'working-from-home',
    level: 'B1',
    title: 'Working from home: is it here to stay?',
    topic: 'Công việc',
    minutes: 4,
    text: `Ten years ago, most office workers in big cities travelled to work five days a week. Today, millions of people do at least part of their job from home. The change began slowly, but the last few years pushed companies to try it seriously.

The advantages are easy to see. Employees save money and time on transport, and many say they feel less stressed because they can organise their own day. Companies benefit too: they need smaller offices, so their costs fall.

However, working from home is not perfect. Some people find it hard to separate work from free time, and others feel lonely without colleagues around them. New employees often learn more quickly in an office, where they can ask questions and watch how experienced staff work.

For these reasons, many companies now prefer a mix. Staff come to the office two or three days a week for meetings and training, and work at home on the other days. Surveys suggest that most workers like this arrangement, and some businesses report that they keep good employees for longer because of it.

Experts warn that the mixed model only works when managers trust their teams and when rules are clear. Without that, workers can feel they are being watched all the time, which usually makes them less productive, not more.`,
    glossary: [
      { word: 'advantages', meaning: 'ưu điểm' },
      { word: 'separate', meaning: 'tách ra' },
      { word: 'colleague', meaning: 'đồng nghiệp' },
      { word: 'arrangement', meaning: 'sự sắp xếp, thoả thuận' },
      { word: 'productive', meaning: 'năng suất, hiệu quả' },
    ],
    questions: [
      { type: 'choice', prompt: 'What is the main idea of the passage?', options: ['Home working is always better', 'A mix of home and office work is becoming common', 'Offices will disappear completely', 'Transport is the biggest problem in cities'], answer: 'A mix of home and office work is becoming common', explain: 'Cả bài nói về lợi ích, hạn chế và xu hướng làm việc kết hợp.' },
      { type: 'choice', prompt: 'According to the passage, why do companies save money?', options: ['They pay lower salaries', 'They need smaller offices', 'They use less electricity', 'They hire fewer managers'], answer: 'They need smaller offices', explain: '“they need smaller offices, so their costs fall”.' },
      { type: 'choice', prompt: 'What is one disadvantage of working from home?', options: ['People work too many hours', 'People feel lonely without colleagues', 'People cannot use the internet', 'People earn less money'], answer: 'People feel lonely without colleagues', explain: '“others feel lonely without colleagues around them”.' },
      { type: 'choice', prompt: 'In the mixed model, why do staff come to the office?', options: ['For meetings and training', 'To use faster computers', 'Because managers order them to', 'To collect their post'], answer: 'For meetings and training', explain: '“come to the office two or three days a week for meetings and training”.' },
      { type: 'choice', prompt: 'In the last paragraph, “being watched all the time” makes workers…', options: ['more careful', 'less productive', 'happier', 'faster'], answer: 'less productive', explain: 'Câu cuối: “usually makes them less productive, not more”.' },
    ],
  },
  {
    id: 'plastic-problem',
    level: 'B1',
    title: 'The plastic problem in our oceans',
    topic: 'Môi trường',
    minutes: 4,
    text: `Every minute, a lorry full of plastic rubbish is dropped into the world’s oceans. Scientists believe that at least eight million tonnes enter the sea each year, and most of it never disappears completely. Instead, sunlight and waves break it into tiny pieces called microplastics.

These pieces are dangerous because fish and sea birds mistake them for food. When people eat those fish, the plastic enters our bodies as well. Researchers have found microplastics in drinking water, in salt and even in rain.

Some countries have started to act. More than sixty governments have banned or taxed single-use plastic bags, and several cities now collect rubbish from rivers before it reaches the sea. In Rwanda, visitors are not allowed to bring plastic bags into the country at all.

Individuals can help too, but small actions are only useful if they come with bigger changes from companies. A reusable bottle saves around 150 plastic bottles a year, yet one factory can produce millions in a single day. That is why experts say the real solution is to produce less plastic in the first place, rather than to recycle more of it.`,
    glossary: [
      { word: 'tonne', meaning: 'tấn' },
      { word: 'microplastics', meaning: 'hạt vi nhựa' },
      { word: 'mistake A for B', meaning: 'nhầm A với B' },
      { word: 'ban', meaning: 'cấm' },
      { word: 'reusable', meaning: 'dùng lại được' },
    ],
    questions: [
      { type: 'choice', prompt: 'How much plastic enters the sea each year?', options: ['At least 8 million tonnes', 'At least 8 thousand tonnes', '60 million tonnes', '150 tonnes'], answer: 'At least 8 million tonnes', explain: '“at least eight million tonnes enter the sea each year”.' },
      { type: 'choice', prompt: 'Why are microplastics dangerous for sea animals?', options: ['They are sharp', 'Animals mistake them for food', 'They make water colder', 'They smell bad'], answer: 'Animals mistake them for food', explain: '“fish and sea birds mistake them for food”.' },
      { type: 'choice', prompt: 'What is special about Rwanda?', options: ['It recycles all its plastic', 'Visitors cannot bring plastic bags in', 'It has no supermarkets', 'It produces plastic bags'], answer: 'Visitors cannot bring plastic bags in', explain: '“visitors are not allowed to bring plastic bags into the country at all”.' },
      { type: 'choice', prompt: 'What do experts say is the real solution?', options: ['Recycling more', 'Producing less plastic', 'Cleaning beaches', 'Eating less fish'], answer: 'Producing less plastic', explain: 'Câu cuối nói giải pháp thật là sản xuất ít nhựa hơn ngay từ đầu.' },
      { type: 'fill', prompt: 'A reusable bottle saves around ___ plastic bottles a year. (write the number)', answers: ['150'], explain: '“saves around 150 plastic bottles a year”.' },
    ],
  },
  {
    id: 'sleep-and-study',
    level: 'B1',
    title: 'Why sleep helps you learn',
    topic: 'Học tập & sức khoẻ',
    minutes: 3,
    text: `Students often think that staying up late is the best way to prepare for an exam. Research tells a different story. During deep sleep, the brain repeats what you learned during the day and moves it into long-term memory. If you cut your sleep, you stop that process halfway.

In one experiment, two groups learned the same list of new words. The first group studied in the morning and slept normally. The second group studied the same words in the evening but slept only four hours. Two days later, the first group remembered almost twice as many words.

Sleep also affects concentration. After a poor night, people make more mistakes, react more slowly and find it harder to control their emotions. This is one reason why some schools have moved their start time later, and why several countries now recommend that teenagers begin the school day after eight thirty.

The advice from scientists is simple: study in short sessions during the day, review the material before going to bed, and then sleep well. It is less exciting than studying all night, but it works far better.`,
    glossary: [
      { word: 'long-term memory', meaning: 'trí nhớ dài hạn' },
      { word: 'concentration', meaning: 'sự tập trung' },
      { word: 'react', meaning: 'phản ứng' },
      { word: 'recommend', meaning: 'khuyến nghị' },
      { word: 'material', meaning: 'tài liệu, nội dung học' },
    ],
    questions: [
      { type: 'choice', prompt: 'What happens during deep sleep?', options: ['The brain rests completely', 'The brain moves learning into long-term memory', 'The brain forgets useless things', 'The brain grows faster'], answer: 'The brain moves learning into long-term memory', explain: 'Câu 2 của đoạn 1.' },
      { type: 'choice', prompt: 'In the experiment, how did the first group perform?', options: ['They forgot everything', 'They remembered almost twice as many words', 'They remembered the same number', 'They remembered half as many words'], answer: 'They remembered almost twice as many words', explain: '“remembered almost twice as many words”.' },
      { type: 'choice', prompt: 'What is NOT mentioned as an effect of poor sleep?', options: ['More mistakes', 'Slower reactions', 'Difficulty controlling emotions', 'Weaker eyesight'], answer: 'Weaker eyesight', explain: 'Thị lực yếu không được nhắc tới trong bài.' },
      { type: 'choice', prompt: 'What do scientists advise?', options: ['Study all night before an exam', 'Review before bed then sleep well', 'Sleep only four hours', 'Study only in the morning'], answer: 'Review before bed then sleep well', explain: 'Lời khuyên ở đoạn cuối.' },
    ],
  },
  {
    id: 'volunteering',
    level: 'B1',
    title: 'Volunteering abroad: a good idea?',
    topic: 'Xã hội',
    minutes: 4,
    text: `Every year, thousands of young people pay to spend a few weeks helping in another country. They teach English, build schools or work with animals. For many, it is the experience of a lifetime. But is it always useful?

Supporters say volunteers bring money, energy and new ideas. In small communities, a group of ten people can repair a school roof in a week, which might take local workers months. Volunteers also learn a lot: they discover how other people live, and many change their career plans afterwards.

Critics, however, point out several problems. Short visits often do not match the real needs of the community, and training local people may be more helpful than doing the work yourself. In some places, projects continue year after year without ever finishing, because new volunteers arrive and start again.

A balanced view is that volunteering works when it is planned with the community, when volunteers stay long enough to learn the local language and when their skills match what is needed. A doctor who spends three months in a clinic will probably help more than a tourist who paints a wall for a weekend.`,
    glossary: [
      { word: 'volunteer', meaning: 'tình nguyện viên' },
      { word: 'supporter', meaning: 'người ủng hộ' },
      { word: 'critic', meaning: 'người phê bình' },
      { word: 'match', meaning: 'phù hợp với' },
      { word: 'balanced view', meaning: 'cái nhìn cân bằng' },
    ],
    questions: [
      { type: 'choice', prompt: 'What do supporters say about volunteers?', options: ['They bring money, energy and new ideas', 'They always take local jobs', 'They stay too long', 'They cost the community money'], answer: 'They bring money, energy and new ideas', explain: 'Đoạn 2.' },
      { type: 'choice', prompt: 'What do critics complain about?', options: ['Volunteers are too old', 'Short visits do not match real needs', 'Volunteers speak no English', 'Projects cost too much'], answer: 'Short visits do not match real needs', explain: 'Đoạn 3.' },
      { type: 'choice', prompt: 'Why do some projects never finish?', options: ['There is no money', 'New volunteers arrive and start again', 'The weather is bad', 'Local people refuse to help'], answer: 'New volunteers arrive and start again', explain: '“because new volunteers arrive and start again”.' },
      { type: 'choice', prompt: 'Which example shows the “balanced view”?', options: ['A tourist painting a wall for a weekend', 'A doctor staying three months in a clinic', 'A group building a roof in a week', 'A student teaching English for two days'], answer: 'A doctor staying three months in a clinic', explain: 'Ví dụ này minh hoạ cho việc tình nguyện có kỹ năng và đủ thời gian.' },
    ],
  },
  {
    id: 'street-food',
    level: 'B1',
    title: 'Why street food is popular again',
    topic: 'Ẩm thực & văn hoá',
    minutes: 3,
    text: `Street food has always been part of daily life in Asia, but in the last ten years it has become popular in Europe and North America too. In London there are now more than a hundred street food markets, and similar projects have opened in Berlin, Paris and New York.

There are several reasons for this growth. The first is price: a meal from a van often costs half of what you pay in a restaurant. The second is speed, which matters in a busy city. The third is choice — because a market brings together cooks from many countries, a customer can try ten different dishes in one evening.

For the cooks, the advantages are different. Renting a van is much cheaper than opening a restaurant, so people can test their ideas with little risk. Some successful owners later open their own restaurants, using the customers they met at the market.

Not everything is positive. Food sold outdoors is harder to control, and some cities have found that popular markets make the streets too crowded for local residents. For this reason, several councils now limit the number of stalls and the hours when they can trade.`,
    glossary: [
      { word: 'street food', meaning: 'đồ ăn đường phố' },
      { word: 'van', meaning: 'xe tải nhỏ bán hàng' },
      { word: 'rent', meaning: 'thuê' },
      { word: 'resident', meaning: 'cư dân' },
      { word: 'council', meaning: 'chính quyền địa phương' },
    ],
    questions: [
      { type: 'choice', prompt: 'Which reason for the growth is mentioned first?', options: ['Price', 'Speed', 'Choice', 'Health'], answer: 'Price', explain: '“The first is price…”' },
      { type: 'choice', prompt: 'How can a customer try many dishes in one evening?', options: ['By cooking at home', 'Because markets bring together many cooks', 'By booking a restaurant', 'By ordering online'], answer: 'Because markets bring together many cooks', explain: 'Đoạn 2 nói về “choice”.' },
      { type: 'choice', prompt: 'Why is a van better than a restaurant for new cooks?', options: ['It is cheaper so the risk is smaller', 'It is easier to find staff', 'It looks more professional', 'It gets more reviews'], answer: 'It is cheaper so the risk is smaller', explain: '“Renting a van is much cheaper… with little risk.”' },
      { type: 'choice', prompt: 'What problem do some cities have?', options: ['Too many restaurants close', 'Markets make streets too crowded', 'Food is too expensive', 'Cooks refuse to pay tax'], answer: 'Markets make streets too crowded', explain: 'Đoạn cuối.' },
    ],
  },
  {
    id: 'online-learning',
    level: 'B1',
    title: 'Online courses: help or distraction?',
    topic: 'Giáo dục',
    minutes: 4,
    text: `Online learning was once seen as a cheap alternative for people who could not attend a university. Today it is part of almost every school and workplace, and thousands of free courses are available at any time of day.

The main advantage is flexibility. Learners choose when and where to study, and they can repeat a difficult lesson as many times as they like. For people who live far from a city, or who work full time, this opens doors that used to be closed. Companies also use short online courses to train staff quickly.

Yet the numbers show that finishing a course is much harder than starting one. Some platforms report that fewer than ten per cent of learners who begin a free course complete it. Students often say they feel alone, that nobody notices if they stop, and that a screen cannot answer a question as quickly as a teacher.

The most successful approach seems to combine both. A group of learners meets once a week in person or online, sets a small goal together, and checks progress. With that social pressure and clear deadlines, completion rates rise sharply.`,
    glossary: [
      { word: 'flexibility', meaning: 'sự linh hoạt' },
      { word: 'platform', meaning: 'nền tảng (học trực tuyến)' },
      { word: 'complete', meaning: 'hoàn thành' },
      { word: 'deadline', meaning: 'hạn chót' },
      { word: 'completion rate', meaning: 'tỷ lệ hoàn thành' },
    ],
    questions: [
      { type: 'choice', prompt: 'What is the main advantage of online learning?', options: ['It is always free', 'Flexibility', 'It is easier than school', 'It gives certificates'], answer: 'Flexibility', explain: '“The main advantage is flexibility.”' },
      { type: 'choice', prompt: 'What do the numbers show?', options: ['Most learners finish', 'Fewer than ten per cent of learners finish some free courses', 'Nobody starts courses', 'Courses are too expensive'], answer: 'Fewer than ten per cent of learners finish some free courses', explain: 'Đoạn 3.' },
      { type: 'choice', prompt: 'Which problem do students mention?', options: ['Lessons are too long', 'They feel alone and nobody notices if they stop', 'Teachers are too strict', 'The internet is slow'], answer: 'They feel alone and nobody notices if they stop', explain: 'Đoạn 3 liệt kê các vấn đề này.' },
      { type: 'choice', prompt: 'What helps learners finish a course?', options: ['Watching more videos', 'A small group with weekly meetings and deadlines', 'Paying a higher price', 'Studying alone at night'], answer: 'A small group with weekly meetings and deadlines', explain: 'Đoạn cuối.' },
    ],
  },
]

export const readingById = (id) => readingPassages.find((passage) => passage.id === id) || readingPassages[0]
