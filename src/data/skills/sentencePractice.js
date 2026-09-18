/**
 * Luyện ở cấp câu: điền khuyết (cloze), sắp xếp từ thành câu, viết lại câu.
 * - cloze:   text có ___ , answers là đáp án được chấp nhận
 * - order:   words bị xáo trộn, answer là câu đúng
 * - rewrite: viết lại câu theo yêu cầu, accept là các đáp án được chấp nhận
 */
export const clozeExercises = [
  { id: 'cl1', hint: 'Hiện tại hoàn thành', text: 'She ___ (live) in Hanoi since 2019.', answers: ['has lived'], explain: '“since” → hiện tại hoàn thành.' },
  { id: 'cl2', hint: 'Bị động', text: 'This bridge ___ (build) in 1998.', answers: ['was built'], explain: 'Quá khứ đơn bị động: was + V3.' },
  { id: 'cl3', hint: 'Câu điều kiện loại 2', text: 'If I ___ (have) more time, I would join the course.', answers: ['had'], explain: 'Loại 2: if + quá khứ đơn.' },
  { id: 'cl4', hint: 'So sánh', text: 'This bag is much ___ (cheap) than that one.', answers: ['cheaper'], explain: 'Tính từ ngắn + er.' },
  { id: 'cl5', hint: 'Mệnh đề quan hệ', text: 'The man ___ helped me was a doctor.', answers: ['who', 'that'], explain: '“who” thay cho người, làm chủ ngữ.' },
  { id: 'cl6', hint: 'Danh động từ', text: 'I enjoy ___ (read) before I go to sleep.', answers: ['reading'], explain: '“enjoy” + V-ing.' },
  { id: 'cl7', hint: 'Modal verbs', text: 'You ___ (should / tell) me earlier — I could have helped.', answers: ['should have told'], explain: 'Lẽ ra nên làm trong quá khứ.' },
  { id: 'cl8', hint: 'Câu tường thuật', text: '“I will call you,” she said. → She said she ___ call me.', answers: ['would'], explain: 'will → would khi tường thuật.' },
  { id: 'cl9', hint: 'Quá khứ tiếp diễn', text: 'I ___ (watch) TV when the phone rang.', answers: ['was watching'], explain: 'Hành động đang diễn ra thì việc khác xen vào.' },
  { id: 'cl10', hint: 'Tương lai hoàn thành', text: 'By next June, they ___ (finish) the project.', answers: ['will have finished'], explain: '“by” + mốc tương lai → tương lai hoàn thành.' },
  { id: 'cl11', hint: 'Lượng từ', text: 'There is not ___ milk left in the fridge.', answers: ['much'], explain: '“milk” không đếm được → much.' },
  { id: 'cl12', hint: 'Giới từ + V-ing', text: 'She is very good ___ (cook) Vietnamese food.', answers: ['at cooking'], explain: 'Sau giới từ “at” dùng V-ing.' },
  { id: 'cl13', hint: 'So sánh nhất', text: 'It is the ___ (beautiful) beach in the country.', answers: ['most beautiful'], explain: 'Tính từ dài: the most + adj.' },
  { id: 'cl14', hint: 'Hiện tại đơn', text: 'He usually ___ (go) to work by bus.', answers: ['goes'], explain: 'Thói quen, ngôi thứ ba số ít thêm -es.' },
  { id: 'cl15', hint: 'Câu điều kiện loại 3', text: 'If we ___ (leave) earlier, we would not have missed the train.', answers: ['had left'], explain: 'Loại 3: if + had + V3.' },
]

export const orderExercises = [
  { id: 'or1', answer: 'I have been learning English for three years', explain: 'Hiện tại hoàn thành tiếp diễn: have been + V-ing + for.' },
  { id: 'or2', answer: 'She asked me if I had finished my homework', explain: 'Câu hỏi tường thuật: asked + if + S + V.' },
  { id: 'or3', answer: 'The letter was sent yesterday morning', explain: 'Bị động: was + V3.' },
  { id: 'or4', answer: 'If it rains tomorrow we will stay at home', explain: 'Điều kiện loại 1, mệnh đề if không dùng “will”.' },
  { id: 'or5', answer: 'He is not as tall as his brother', explain: 'So sánh bằng phủ định: not as + adj + as.' },
  { id: 'or6', answer: 'I am looking forward to meeting you next week', explain: '“look forward to” + V-ing.' },
  { id: 'or7', answer: 'You should have told me about the meeting', explain: 'Lẽ ra nên làm: should have + V3.' },
  { id: 'or8', answer: 'The book which I borrowed is very interesting', explain: 'Mệnh đề quan hệ “which” thay cho vật.' },
  { id: 'or9', answer: 'There are not many buses after ten in the evening', explain: '“many” + danh từ đếm được số nhiều.' },
  { id: 'or10', answer: 'I would rather stay at home than go out tonight', explain: 'Cấu trúc “would rather A than B”.' },
  { id: 'or11', answer: 'The train had left before we arrived at the station', explain: 'Quá khứ hoàn thành cho hành động xảy ra trước.' },
  { id: 'or12', answer: 'She is used to getting up early every day', explain: '“be used to” + V-ing = quen với.' },
  { id: 'or13', answer: 'We will have finished the report by Friday', explain: 'Tương lai hoàn thành với “by”.' },
  { id: 'or14', answer: 'Do you mind if I open the window', explain: 'Mẫu câu xin phép lịch sự.' },
  { id: 'or15', answer: 'He suggested going to the cinema instead of staying home', explain: '“suggest” + V-ing.' },
]

export const rewriteExercises = [
  { id: 'rw1', prompt: 'They built this school in 2005.', instruction: 'Viết lại ở dạng bị động.', accept: ['this school was built in 2005'], explain: 'Quá khứ đơn bị động: was + V3.' },
  { id: 'rw2', prompt: '“I am very tired,” Lan said.', instruction: 'Chuyển sang câu tường thuật (bắt đầu bằng: Lan said…).', accept: ['lan said she was very tired', 'lan said that she was very tired'], explain: 'Lùi thì hiện tại đơn → quá khứ đơn.' },
  { id: 'rw3', prompt: 'He is too young to drive a car.', instruction: 'Viết lại với “enough”.', accept: ['he is not old enough to drive a car'], explain: 'too young → not old enough.' },
  { id: 'rw4', prompt: 'I do not have enough money, so I cannot buy that phone.', instruction: 'Viết lại bằng câu điều kiện loại 2.', accept: ['if i had enough money i could buy that phone', 'if i had enough money, i would buy that phone'], explain: 'Điều kiện loại 2 cho tình huống không có thật ở hiện tại.' },
  { id: 'rw5', prompt: 'The last time I saw her was two years ago.', instruction: 'Viết lại với “I have not…”.', accept: ['i have not seen her for two years'], explain: 'Quá khứ đơn có mốc thời gian → hiện tại hoàn thành.' },
  { id: 'rw6', prompt: 'Nobody has used this room for years.', instruction: 'Viết lại ở dạng bị động.', accept: ['this room has not been used for years'], explain: 'Hiện tại hoàn thành bị động phủ định.' },
  { id: 'rw7', prompt: '“Where did you buy this book?” she asked me.', instruction: 'Chuyển sang câu hỏi tường thuật.', accept: ['she asked me where i had bought that book', 'she asked me where i bought that book'], explain: 'Không đảo trợ động từ, lùi thì.' },
  { id: 'rw8', prompt: 'Although it was raining, we went out.', instruction: 'Viết lại với “in spite of”.', accept: ['in spite of the rain we went out', 'in spite of the rain, we went out'], explain: 'in spite of + danh từ/V-ing.' },
  { id: 'rw9', prompt: 'She started working here in 2020.', instruction: 'Viết lại với “She has…”.', accept: ['she has worked here since 2020', 'she has been working here since 2020'], explain: 'since + mốc thời gian.' },
  { id: 'rw10', prompt: 'My brother is taller than me.', instruction: 'Viết lại với “I am not…”.', accept: ['i am not as tall as my brother'], explain: 'So sánh bằng phủ định.' },
  { id: 'rw11', prompt: 'It is a pity that I cannot speak Japanese.', instruction: 'Viết lại với “I wish…”.', accept: ['i wish i could speak japanese'], explain: '“wish + could” cho điều ước hiện tại.' },
  { id: 'rw12', prompt: 'Someone cleans this room every day.', instruction: 'Viết lại ở dạng bị động.', accept: ['this room is cleaned every day'], explain: 'Hiện tại đơn bị động: is + V3.' },
  { id: 'rw13', prompt: 'He did not study, so he failed the exam.', instruction: 'Viết lại bằng câu điều kiện loại 3.', accept: ['if he had studied he would not have failed the exam'], explain: 'Điều kiện loại 3 cho quá khứ.' },
  { id: 'rw14', prompt: 'I am sorry I did not call you yesterday.', instruction: 'Viết lại với “I should…”.', accept: ['i should have called you yesterday'], explain: 'should have + V3 = lẽ ra đã nên làm.' },
  { id: 'rw15', prompt: 'The film was so boring that I fell asleep.', instruction: 'Viết lại với “such…”.', accept: ['it was such a boring film that i fell asleep'], explain: 'such + (a/an) + adj + noun + that.' },
]

export const shuffleWords = (answer) => {
  const words = answer.split(' ')
  if (words.length < 3) return words
  const shuffled = [...words]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]]
  }
  // Tránh trường hợp xáo trộn lại ra đúng câu gốc.
  return shuffled.join(' ') === answer ? shuffleWords(answer) : shuffled
}

export const normalizeSentence = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[.,!?;:]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
