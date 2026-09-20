/**
 * Từ vựng VSTEP theo chủ đề.
 *
 * Mỗi dòng: word|ipa|nghĩa tiếng Việt|câu ví dụ tiếng Anh
 * - KHÔNG dùng dấu `|` trong nội dung (chỉ dùng làm dấu phân cách).
 * - `rows` là template literal, mỗi dòng bắt đầu ở đầu dòng (không thụt lề),
 *   các hàm đọc dữ liệu nên lọc dòng rỗng trước khi tách:
 *     const items = topic.rows.split('\n').map((r) => r.trim()).filter(Boolean)
 *       .map((r) => { const [word, ipa, vi, example] = r.split('|'); return { word, ipa, vi, example }; });
 * - `level` là độ khó chung của chủ đề (B1 / B2 / C1).
 *
 * Nội dung tự biên soạn cho mục đích học tập.
 */

export const vocabularyTopics = [
  {
    id: 'education',
    title: 'Giáo dục & học tập',
    level: 'B2',
    rows: `
curriculum|/kəˈrɪkjələm/|chương trình học|The school updated its curriculum last year.
lecture|/ˈlektʃə/|bài giảng|The lecture on climate change lasted two hours.
assignment|/əˈsaɪnmənt/|bài tập được giao|I finished my assignment before the weekend.
tuition|/tjuˈɪʃn/|học phí|University tuition has risen sharply in recent years.
scholarship|/ˈskɒləʃɪp/|học bổng|She won a scholarship to study abroad.
seminar|/ˈsemɪnɑː/|buổi hội thảo nhóm nhỏ|We discussed the article in a weekly seminar.
compulsory|/kəmˈpʌlsəri/|bắt buộc|English is a compulsory subject at my school.
attendance|/əˈtendəns/|sự có mặt, điểm danh|Regular attendance is required for this course.
syllabus|/ˈsɪləbəs/|đề cương môn học|The syllabus lists every topic for the term.
revise|/rɪˈvaɪz/|ôn tập lại|Students revise for exams in the library.
qualification|/ˌkwɒlɪfɪˈkeɪʃn/|bằng cấp, trình độ|A teaching qualification is needed for this post.
vocational|/vəʊˈkeɪʃənl/|thuộc hướng nghiệp|Vocational training prepares students for practical jobs.
enrolment|/ɪnˈrəʊlmənt/|sự ghi danh nhập học|Enrolment for the new term opens in August.
dissertation|/ˌdɪsəˈteɪʃn/|luận văn|He spent six months writing his dissertation.
literate|/ˈlɪtərət/|biết chữ|Most adults in the region are literate.
mentor|/ˈmentɔː/|người hướng dẫn, cố vấn|My mentor gave me useful feedback on my essay.
extracurricular|/ˌekstrəkəˈrɪkjələ/|thuộc ngoại khoá|Extracurricular activities help students build teamwork skills.
plagiarism|/ˈpleɪdʒərɪzəm/|hành vi đạo văn|Plagiarism can lead to failing the whole course.
rote learning|/ˌrəʊt ˈlɜːnɪŋ/|cách học vẹt|Rote learning does not develop critical thinking.
peer review|/ˌpɪə rɪˈvjuː/|bình duyệt của đồng nghiệp|Peer review improves the quality of academic writing.
`,
  },
  {
    id: 'work',
    title: 'Công việc & nghề nghiệp',
    level: 'B1',
    rows: `
employer|/ɪmˈplɔɪə/|người sử dụng lao động|My employer allows flexible working hours.
colleague|/ˈkɒliːɡ/|đồng nghiệp|My colleagues helped me learn the new system.
salary|/ˈsæləri/|tiền lương|The salary is paid on the last day of the month.
interview|/ˈɪntəvjuː/|buổi phỏng vấn|I have a job interview next Monday morning.
deadline|/ˈdedlaɪn/|hạn cuối phải hoàn thành|We must meet the deadline for this project.
promotion|/prəˈməʊʃn/|sự thăng chức|She got a promotion after only two years.
shift|/ʃɪft/|ca làm việc|I work the night shift twice a week.
overtime|/ˈəʊvətaɪm/|giờ làm thêm|He earns extra money by doing overtime.
contract|/ˈkɒntrækt/|hợp đồng lao động|I signed a one-year contract with the company.
apply|/əˈplaɪ/|nộp đơn, ứng tuyển|I applied for a job at the local bank.
skill|/skɪl/|kỹ năng|Communication skills are important in every job.
experience|/ɪkˈspɪəriəns/|kinh nghiệm|Two years of experience is required for this role.
responsible|/rɪˈspɒnsəbl/|chịu trách nhiệm|I am responsible for training new staff.
teamwork|/ˈtiːmwɜːk/|việc làm nhóm|Good teamwork makes the office more productive.
vacancy|/ˈveɪkənsi/|vị trí đang tuyển|There is a vacancy in the marketing department.
training|/ˈtreɪnɪŋ/|việc đào tạo|New employees receive two weeks of training.
resign|/rɪˈzaɪn/|từ chức, nghỉ việc|He decided to resign from his job.
workload|/ˈwɜːkləʊd/|khối lượng công việc|My workload increases at the end of the year.
freelance|/ˈfriːlɑːns/|làm việc tự do|She works as a freelance designer.
retire|/rɪˈtaɪə/|nghỉ hưu|My father plans to retire at sixty.
`,
  },
  {
    id: 'technology',
    title: 'Công nghệ & đổi mới',
    level: 'B2',
    rows: `
device|/dɪˈvaɪs/|thiết bị|Most students bring a mobile device to class.
software|/ˈsɒftweə/|phần mềm|The company updated its software last month.
hardware|/ˈhɑːdweə/|phần cứng|Broken hardware must be reported to the technician.
wireless|/ˈwaɪələs/|không dây|The library offers free wireless internet.
security|/sɪˈkjʊərəti/|sự bảo mật|Strong passwords improve online security.
privacy|/ˈprɪvəsi/|quyền riêng tư|Apps should protect the privacy of their users.
algorithm|/ˈælɡərɪðəm/|thuật toán|The algorithm suggests videos you may enjoy.
artificial intelligence|/ˌɑːtɪfɪʃl ɪnˈtelɪdʒəns/|trí tuệ nhân tạo|Artificial intelligence is changing many industries.
innovation|/ˌɪnəˈveɪʃn/|sự đổi mới, sáng tạo|Technological innovation creates new kinds of jobs.
update|/ˌʌpˈdeɪt/|cập nhật|Please update the app to the latest version.
download|/ˌdaʊnˈləʊd/|tải xuống|I downloaded the file in a few seconds.
install|/ɪnˈstɔːl/|cài đặt|You need to install the driver first.
digital|/ˈdɪdʒɪtl/|thuộc kỹ thuật số|Digital payments are now very common.
automate|/ˈɔːtəmeɪt/|tự động hoá|Factories automate simple tasks to save time.
data breach|/ˈdeɪtə briːtʃ/|vụ rò rỉ dữ liệu|A data breach exposed thousands of accounts.
user-friendly|/ˌjuːzəˈfrendli/|thân thiện với người dùng|The new interface is simple and user-friendly.
cybersecurity|/ˌsaɪbəsɪˈkjʊərəti/|an ninh mạng|Companies invest heavily in cybersecurity.
obsolete|/ˈɒbsəliːt/|lỗi thời, không còn dùng|This model became obsolete within three years.
virtual|/ˈvɜːtʃuəl/|ảo, trực tuyến|We held a virtual meeting with the whole team.
reliance|/rɪˈlaɪəns/|sự phụ thuộc|Our reliance on smartphones keeps growing.
`,
  },
  {
    id: 'environment',
    title: 'Môi trường & biến đổi khí hậu',
    level: 'B2',
    rows: `
pollution|/pəˈluːʃn/|sự ô nhiễm|Air pollution is a serious problem in big cities.
recycle|/ˌriːˈsaɪkl/|tái chế|We recycle paper, glass and plastic at home.
renewable|/rɪˈnjuːəbl/|có thể tái tạo|Wind is a clean and renewable source of energy.
emission|/ɪˈmɪʃn/|khí thải|Cutting emissions is essential for the planet.
deforestation|/ˌdiːˌfɒrɪˈsteɪʃn/|sự phá rừng|Deforestation destroys the habitats of many species.
biodiversity|/ˌbaɪəʊdaɪˈvɜːsəti/|đa dạng sinh học|The national park protects local biodiversity.
sustainable|/səˈsteɪnəbl/|bền vững|Sustainable farming uses less water and energy.
drought|/draʊt/|hạn hán|The long drought ruined most of the crops.
flood|/flʌd/|lũ lụt|Heavy rain caused a flood in the valley.
greenhouse gas|/ˈɡriːnhaʊs ɡæs/|khí nhà kính|Greenhouse gases trap heat in the atmosphere.
conserve|/kənˈsɜːv/|bảo tồn, tiết kiệm|We should conserve water during the dry season.
ecosystem|/ˈiːkəʊsɪstəm/|hệ sinh thái|Coral reefs are a very fragile ecosystem.
waste|/weɪst/|rác thải|Too much plastic waste ends up in the ocean.
habitat|/ˈhæbɪtæt/|môi trường sống|The wetland is an important habitat for birds.
climate change|/ˈklaɪmət tʃeɪndʒ/|biến đổi khí hậu|Climate change affects rainfall patterns worldwide.
carbon footprint|/ˈkɑːbən fʊtprɪnt/|dấu chân carbon|Cycling to work reduces your carbon footprint.
landfill|/ˈlændfɪl/|bãi chôn lấp rác|Most household rubbish goes to a landfill.
contaminate|/kənˈtæmɪneɪt/|làm nhiễm bẩn|Chemicals from the factory contaminated the river.
depletion|/dɪˈpliːʃn/|sự cạn kiệt|The depletion of natural resources worries scientists.
eco-friendly|/ˌiːkəʊˈfrendli/|thân thiện với môi trường|Many shoppers now choose eco-friendly products.
`,
  },
  {
    id: 'health',
    title: 'Sức khoẻ & lối sống',
    level: 'B1',
    rows: `
symptom|/ˈsɪmptəm/|triệu chứng|A high temperature is a common symptom of flu.
prescription|/prɪˈskrɪpʃn/|đơn thuốc|The doctor gave me a prescription for antibiotics.
appointment|/əˈpɔɪntmənt/|cuộc hẹn|I booked an appointment with the dentist.
treatment|/ˈtriːtmənt/|sự điều trị|The treatment lasted for three weeks.
diet|/ˈdaɪət/|chế độ ăn uống|A balanced diet keeps you healthy.
exercise|/ˈeksəsaɪz/|việc tập thể dục|Regular exercise improves your mood.
injury|/ˈɪndʒəri/|chấn thương|He suffered a knee injury while playing football.
recover|/rɪˈkʌvə/|hồi phục|She recovered quickly after the operation.
vaccine|/ˈvæksiːn/|vắc-xin|The vaccine protects children against measles.
infection|/ɪnˈfekʃn/|sự nhiễm trùng|Wash your hands to prevent infection.
stress|/stres/|sự căng thẳng|Too much stress can affect your sleep.
insomnia|/ɪnˈsɒmniə/|chứng mất ngủ|Insomnia is common among shift workers.
allergy|/ˈælədʒi/|chứng dị ứng|She has a serious allergy to peanuts.
nutrition|/njuˈtrɪʃn/|dinh dưỡng|Good nutrition is vital for growing children.
check-up|/ˈtʃekʌp/|buổi khám sức khoẻ định kỳ|I have a health check-up every year.
surgery|/ˈsɜːdʒəri/|ca phẫu thuật|He needed surgery on his shoulder.
immune|/ɪˈmjuːn/|thuộc miễn dịch|Enough sleep strengthens the immune system.
obesity|/əʊˈbiːsəti/|bệnh béo phì|Childhood obesity is rising in many countries.
remedy|/ˈremədi/|phương thuốc, cách chữa|Honey and lemon is a simple remedy for a cough.
sedentary|/ˈsedntri/|ít vận động|A sedentary lifestyle increases the risk of heart disease.
`,
  },
  {
    id: 'travel',
    title: 'Du lịch & giao thông',
    level: 'B1',
    rows: `
destination|/ˌdestɪˈneɪʃn/|điểm đến|Da Nang is a popular holiday destination.
luggage|/ˈlʌɡɪdʒ/|hành lý|Please keep your luggage with you at all times.
departure|/dɪˈpɑːtʃə/|sự khởi hành|Our departure time is six in the morning.
arrival|/əˈraɪvl/|sự đến nơi|The arrival of the night train was delayed.
accommodation|/əˌkɒməˈdeɪʃn/|chỗ ở|We booked cheap accommodation near the beach.
itinerary|/aɪˈtɪnərəri/|lịch trình chuyến đi|Our itinerary includes three days in Hue.
passport|/ˈpɑːspɔːt/|hộ chiếu|You must show your passport at the gate.
visa|/ˈviːzə/|thị thực|I applied for a tourist visa online.
souvenir|/ˌsuːvəˈnɪə/|quà lưu niệm|She bought a small souvenir for her sister.
guidebook|/ˈɡaɪdbʊk/|sách hướng dẫn du lịch|The guidebook lists the best local restaurants.
backpack|/ˈbækpæk/|ba lô|He travelled for a month with only a backpack.
sightseeing|/ˈsaɪtsiːɪŋ/|việc tham quan|We spent the afternoon sightseeing in the old town.
booking|/ˈbʊkɪŋ/|việc đặt chỗ|I made a booking for two nights.
delay|/dɪˈleɪ/|sự trì hoãn|The flight delay lasted nearly four hours.
transfer|/ˈtrænsfɜː/|việc chuyển tuyến|Our transfer in Singapore was very quick.
currency|/ˈkʌrənsi/|đơn vị tiền tệ|You can change currency at the airport.
customs|/ˈkʌstəmz/|hải quan|It took an hour to get through customs.
boarding pass|/ˈbɔːdɪŋ pɑːs/|thẻ lên máy bay|Keep your boarding pass ready before boarding.
excursion|/ɪkˈskɜːʃn/|chuyến đi ngắn|The hotel organises a daily excursion to the caves.
landmark|/ˈlændmɑːk/|địa danh nổi tiếng|The tower is the most famous landmark in the city.
`,
  },
  {
    id: 'media',
    title: 'Truyền thông & mạng xã hội',
    level: 'C1',
    rows: `
broadcast|/ˈbrɔːdkɑːst/|phát sóng|The final match was broadcast live to millions of viewers.
coverage|/ˈkʌvərɪdʒ/|sự đưa tin|The election received extensive media coverage.
headline|/ˈhedlaɪn/|tiêu đề bài báo|The story made headlines around the world.
bias|/ˈbaɪəs/|sự thiên vị|Readers should be aware of political bias in the press.
censorship|/ˈsensəʃɪp/|sự kiểm duyệt|Censorship limits access to independent information.
propaganda|/ˌprɒpəˈɡændə/|sự tuyên truyền|The regime used propaganda to control public opinion.
credibility|/ˌkredəˈbɪləti/|độ tin cậy|A newspaper loses credibility when it prints careless errors.
journalist|/ˈdʒɜːnəlɪst/|nhà báo|The journalist interviewed several local residents.
viral|/ˈvaɪrəl/|lan truyền rất nhanh|The video went viral within a single day.
circulation|/ˌsɜːkjəˈleɪʃn/|lượng phát hành|The circulation of printed papers has fallen sharply.
editorial|/ˌedɪˈtɔːriəl/|bài xã luận|The editorial criticised the new tax policy.
anonymous|/əˈnɒnɪməs/|ẩn danh|Many comments online are posted anonymously.
misinformation|/ˌmɪsɪnfəˈmeɪʃn/|thông tin sai lệch|Misinformation spreads faster than official corrections.
influencer|/ˈɪnfluənsə/|người có ảnh hưởng|Brands pay influencers to promote their products.
audience|/ˈɔːdiəns/|khán thính giả|The programme attracts a very young audience.
scrutiny|/ˈskruːtəni/|sự soi xét kỹ lưỡng|Public figures live under constant media scrutiny.
source|/sɔːs/|nguồn tin|Always check the original source of a claim.
subscription|/səbˈskrɪpʃn/|khoản thuê bao|The newspaper relies on digital subscriptions.
paparazzi|/ˌpæpəˈrætsi/|phóng viên săn ảnh|The singer was followed by paparazzi all week.
clickbait|/ˈklɪkbeɪt/|tiêu đề giật gân|That article is pure clickbait with no real content.
`,
  },
  {
    id: 'economy',
    title: 'Kinh tế & tiêu dùng',
    level: 'B2',
    rows: `
inflation|/ɪnˈfleɪʃn/|lạm phát|Rising inflation makes everyday goods more expensive.
recession|/rɪˈseʃn/|suy thoái kinh tế|Many small firms closed during the recession.
investment|/ɪnˈvestmənt/|sự đầu tư|Foreign investment in the region has grown steadily.
income|/ˈɪnkʌm/|thu nhập|Household income has risen slowly since 2020.
tax|/tæks/|thuế|The government cut tax for small businesses.
budget|/ˈbʌdʒɪt/|ngân sách|We must stay within our monthly budget.
consumer|/kənˈsjuːmə/|người tiêu dùng|Consumers are spending less on luxury goods.
demand|/dɪˈmɑːnd/|nhu cầu|Demand for electric cars keeps rising.
supply|/səˈplaɪ/|nguồn cung|A shortage of parts affected the supply of laptops.
profit|/ˈprɒfɪt/|lợi nhuận|The company reported a small profit this year.
debt|/det/|khoản nợ|Many students leave university with large debts.
exchange rate|/ɪksˈtʃeɪndʒ reɪt/|tỷ giá hối đoái|A weak exchange rate makes imported goods dearer.
unemployment|/ˌʌnɪmˈplɔɪmənt/|tình trạng thất nghiệp|Unemployment fell slightly last quarter.
subsidy|/ˈsʌbsədi/|khoản trợ cấp|Farmers receive a subsidy from the state.
trade|/treɪd/|thương mại|International trade supports millions of jobs.
productivity|/ˌprɒdʌkˈtɪvəti/|năng suất|Better training raises productivity in the workplace.
expenditure|/ɪkˈspendɪtʃə/|khoản chi tiêu|Public expenditure on health increased this year.
entrepreneur|/ˌɒntrəprəˈnɜː/|doanh nhân khởi nghiệp|The entrepreneur opened three shops in two years.
monopoly|/məˈnɒpəli/|thế độc quyền|A monopoly can push prices up for everyone.
affordable|/əˈfɔːdəbl/|có thể chi trả được|The city needs more affordable housing.
`,
  },
  {
    id: 'culture',
    title: 'Văn hoá & bản sắc',
    level: 'C1',
    rows: `
heritage|/ˈherɪtɪdʒ/|di sản|The old quarter is part of our cultural heritage.
tradition|/trəˈdɪʃn/|truyền thống|Family meals are an important tradition here.
ritual|/ˈrɪtʃuəl/|nghi lễ|The ceremony follows a very old ritual.
custom|/ˈkʌstəm/|phong tục|It is the custom to remove your shoes indoors.
identity|/aɪˈdentəti/|bản sắc|Language is central to cultural identity.
diversity|/daɪˈvɜːsəti/|sự đa dạng|Cultural diversity enriches a university campus.
assimilation|/əˌsɪməˈleɪʃn/|sự hoà nhập|Assimilation can gradually weaken minority languages.
stereotype|/ˈsteriətaɪp/|định kiến rập khuôn|The film relies on an outdated stereotype.
folklore|/ˈfəʊklɔː/|văn học dân gian|This story comes from local folklore.
artisan|/ˌɑːtɪˈzæn/|nghệ nhân|A skilled artisan made this lacquer painting.
indigenous|/ɪnˈdɪdʒənəs/|thuộc bản địa|Indigenous groups protect their ancestral lands.
preservation|/ˌprezəˈveɪʃn/|sự gìn giữ|The preservation of old buildings costs a great deal.
multicultural|/ˌmʌltiˈkʌltʃərəl/|mang tính đa văn hoá|The city has become truly multicultural.
norm|/nɔːm/|chuẩn mực xã hội|Social norms differ from one country to another.
festival|/ˈfestɪvl/|lễ hội|The spring festival attracts thousands of visitors.
cuisine|/kwɪˈziːn/|nền ẩm thực|Vietnamese cuisine is famous for fresh herbs.
contemporary|/kənˈtemprəri/|thuộc đương đại|The museum shows contemporary Vietnamese art.
acculturation|/əˌkʌltʃəˈreɪʃn/|sự tiếp biến văn hoá|Acculturation takes place slowly among migrants.
taboo|/təˈbuː/|điều kiêng kỵ|Discussing salary is a taboo in some cultures.
cosmopolitan|/ˌkɒzməˈpɒlɪtən/|mang tính quốc tế|The old port has always been a cosmopolitan place.
`,
  },
  {
    id: 'society',
    title: 'Xã hội & cộng đồng',
    level: 'C1',
    rows: `
inequality|/ˌɪnɪˈkwɒləti/|sự bất bình đẳng|Income inequality has widened over the past decade.
welfare|/ˈwelfeə/|phúc lợi xã hội|The welfare system supports low-income families.
community|/kəˈmjuːnəti/|cộng đồng|The whole community joined the clean-up day.
volunteer|/ˌvɒlənˈtɪə/|tình nguyện viên|Volunteers teach free English classes at weekends.
discrimination|/dɪˌskrɪmɪˈneɪʃn/|sự phân biệt đối xử|The law bans discrimination at work.
urbanisation|/ˌɜːbənaɪˈzeɪʃn/|quá trình đô thị hoá|Rapid urbanisation has created housing shortages.
generation gap|/ˌdʒenəˈreɪʃn ɡæp/|khoảng cách thế hệ|The generation gap causes tension in many families.
crime rate|/ˈkraɪm reɪt/|tỷ lệ tội phạm|The crime rate fell after street lights were installed.
poverty|/ˈpɒvəti/|tình trạng nghèo đói|Many charities work to reduce poverty in rural areas.
immigration|/ˌɪmɪˈɡreɪʃn/|sự nhập cư|Immigration has changed the country workforce.
cohesion|/kəʊˈhiːʒn/|sự gắn kết|Community projects strengthen social cohesion.
prejudice|/ˈpredʒudɪs/|thành kiến|Education can reduce prejudice against migrants.
demographic|/ˌdeməˈɡræfɪk/|thuộc dân số học|The demographic shift affects pension systems.
marginalise|/ˈmɑːdʒɪnəlaɪz/|gạt ra ngoài lề xã hội|Poor transport can marginalise rural communities.
solidarity|/ˌsɒlɪˈdærəti/|tinh thần đoàn kết|Workers showed solidarity with their colleagues.
civic|/ˈsɪvɪk/|thuộc công dân|Civic duties include voting in local elections.
segregation|/ˌseɡrɪˈɡeɪʃn/|sự tách biệt|Segregation in schools was finally banned.
philanthropist|/fɪˈlænθrəpɪst/|nhà hảo tâm|A local philanthropist funded the new library.
inclusive|/ɪnˈkluːsɪv/|mang tính hoà nhập|The school aims to be inclusive for all children.
wellbeing|/ˌwelˈbiːɪŋ/|sự an sinh, hạnh phúc|Green spaces improve the wellbeing of residents.
`,
  },
];

/** Tất cả các dòng của mọi chủ đề, đã tách thành object. */
export const vocabularyItems = vocabularyTopics.flatMap((topic) =>
  topic.rows
    .split('\n')
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row, index) => {
      const [word, ipa, vi, example] = row.split('|');
      return { id: `${topic.id}-${index + 1}`, topicId: topic.id, topic: topic.title, level: topic.level, word, ipa, vi, example };
    }),
);

export const vocabularyTopicById = (id) => vocabularyTopics.find((topic) => topic.id === id) || null;

export const vocabularyByLevel = (level) =>
  level === 'all' ? vocabularyTopics : vocabularyTopics.filter((topic) => topic.level === level);
