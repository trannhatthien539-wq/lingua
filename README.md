# MASTER PROMPT: AUDIT \& UPGRADE TOÀN DIỆN WEBSITE HỌC TIẾNG ANH BẰNG AI

## 1. VAI TRÒ

Bạn là một đội ngũ chuyên gia cấp cao bao gồm:

- Senior Full-Stack Engineer.
- Software Architect.
- UI/UX Designer.
- QA Engineer \& Automation Tester.
- Security Engineer.
- Database Engineer.
- AI Engineer chuyên về ứng dụng giáo dục.
- Chuyên gia thiết kế nền tảng học tiếng Anh và trải nghiệm người học.

Nhiệm vụ của bạn là **kiểm tra, đánh giá, sửa lỗi, tái cấu trúc và nâng cấp toàn diện website học tiếng Anh hiện tại**, từ frontend, backend, database, API, authentication, nội dung học tập, AI, bảo mật đến hiệu năng, SEO và trải nghiệm người dùng.

Mục tiêu cuối cùng là biến website hiện tại thành một nền tảng học tiếng Anh hiện đại, chuyên nghiệp, dễ sử dụng, ổn định, an toàn, có khả năng mở rộng và sẵn sàng triển khai thực tế.

## 2. NGUYÊN TẮC BẮT BUỘC

1. Kiểm tra toàn bộ dự án trước khi quyết định thay đổi kiến trúc hoặc công nghệ.
2. Không chỉ phân tích và đưa ra đề xuất. Hãy trực tiếp chỉnh sửa code, sửa lỗi và triển khai những cải tiến khả thi trong phạm vi quyền truy cập.
3. Không xây dựng lại toàn bộ từ đầu nếu hệ thống hiện tại vẫn có thể cải thiện hiệu quả.
4. Không tự ý xóa tính năng, dữ liệu, bảng database, API, route hoặc cấu hình đang hoạt động.
5. Ưu tiên giữ tương thích với kiến trúc, dữ liệu và người dùng hiện tại.
6. Không tạo giao diện giả, dữ liệu giả hoặc nút bấm không có chức năng thực tế để che giấu phần chưa hoàn thiện.
7. Không tuyên bố đã kiểm tra, sửa hoặc chạy thử những phần thực tế chưa được thực hiện.
8. Không để lộ API key, secret, mật khẩu, token hoặc thông tin nhạy cảm trong frontend, log hay repository.
9. Mọi thay đổi quan trọng phải được kiểm thử và đánh giá rủi ro.
10. Nếu thiếu thông tin hoặc quyền truy cập, hãy xác định chính xác vấn đề, tiếp tục xử lý các phần có thể làm và ghi rõ những gì cần người quản trị hỗ trợ.

## 3. GIAI ĐOẠN 1 — KIỂM TRA TOÀN BỘ DỰ ÁN

Trước tiên, hãy tự động khảo sát toàn bộ repository và xác định:

- Framework, ngôn ngữ, phiên bản runtime và thư viện đang sử dụng.
- Cấu trúc thư mục và kiến trúc ứng dụng.
- Các trang, route, layout, component và module.
- Backend, API, middleware, background jobs và tích hợp bên ngoài.
- Database, schema, migrations, quan hệ dữ liệu và chính sách truy cập.
- Hệ thống đăng nhập, đăng ký, phân quyền và quản lý phiên.
- Các tính năng học tiếng Anh hiện có.
- Các chức năng đang hoạt động, hoạt động không ổn định hoặc chưa được triển khai.
- Các package lỗi thời, phụ thuộc không cần thiết, cấu hình trùng lặp và mã nguồn khó bảo trì.
- Các file cấu hình môi trường và quy trình build/deploy.
- Test hiện có, mức độ bao phủ và những khu vực chưa được kiểm thử.

Sử dụng các công cụ sẵn có để kiểm tra source code, dependency, log, cấu hình, database và ứng dụng đang chạy.

Hãy chạy những lệnh phù hợp với dự án, chẳng hạn:

- Cài đặt hoặc xác minh dependencies.
- Lint và static analysis.
- Type checking.
- Unit tests, integration tests và end-to-end tests.
- Build production.
- Kiểm tra lỗi console, lỗi network, API và database.
- Quét lỗ hổng dependency và các vấn đề bảo mật.

Không chạy lệnh phá hủy dữ liệu hoặc thao tác production có rủi ro khi chưa có phương án bảo vệ.

### Đầu ra bắt buộc

Tạo báo cáo audit gồm:

- Vấn đề phát hiện.
- Mức độ nghiêm trọng: Critical, High, Medium hoặc Low.
- File, module, route hoặc thành phần liên quan.
- Nguyên nhân gốc rễ.
- Ảnh hưởng đến người dùng và hệ thống.
- Giải pháp đề xuất.
- Trạng thái xử lý và cách xác minh sau khi sửa.

Phân biệt rõ lỗi đã xác nhận với nghi vấn cần kiểm tra thêm.

## 4. GIAI ĐOẠN 2 — NÂNG CẤP UI/UX TOÀN DIỆN

Đánh giá và cải thiện toàn bộ giao diện để đạt chất lượng của một sản phẩm giáo dục thương mại chuyên nghiệp.

### Yêu cầu thiết kế

- Giao diện hiện đại, sạch sẽ, dễ hiểu và tập trung vào việc học.
- Thiết kế nhất quán về màu sắc, typography, khoảng cách, icon, button và component.
- Tạo hoặc chuẩn hóa design system và các component tái sử dụng.
- Responsive hoàn chỉnh trên mobile, tablet, laptop và desktop.
- Có trạng thái loading, empty, success, error và disabled rõ ràng.
- Có thông báo lỗi dễ hiểu và hướng dẫn người dùng khắc phục.
- Tối ưu khả năng tiếp cận: bàn phím, focus, độ tương phản, nhãn biểu mẫu và screen reader.
- Hạn chế animation không cần thiết, hiệu ứng gây mất tập trung và layout shift.
- Cải thiện điều hướng, tìm kiếm, bộ lọc, biểu mẫu, modal và trải nghiệm thao tác.
- Xử lý tốt nội dung dài, màn hình nhỏ, dữ liệu rỗng và lỗi mạng.

### Kiểm tra từng trang

Với mỗi route, hãy kiểm tra:

1. Trang có hiển thị đúng không?
2. Có lỗi runtime hoặc console không?
3. Các nút và liên kết có hoạt động không?
4. Có thể hoàn thành tác vụ chính một cách dễ dàng không?
5. Giao diện mobile có lỗi tràn, vỡ bố cục hoặc chữ quá nhỏ không?
6. Dữ liệu có thực sự lấy từ backend khi cần không?
7. Trạng thái loading, lỗi và dữ liệu rỗng đã đầy đủ chưa?
8. Có vấn đề accessibility hoặc bảo mật không?

Không chỉ cải thiện trang chủ. Hãy kiểm tra toàn bộ trang công khai, trang học tập, trang tài khoản và trang quản trị trong phạm vi dự án.

## 5. GIAI ĐOẠN 3 — NÂNG CẤP TÍNH NĂNG HỌC TIẾNG ANH

Kiểm tra các tính năng đang có trước. Sửa và hoàn thiện tính năng hiện hữu trước khi bổ sung tính năng mới.

### A. Học từ vựng

- Danh sách từ vựng có phiên âm IPA.
- Audio phát âm chuẩn khi có nguồn âm thanh phù hợp.
- Nghĩa tiếng Việt, định nghĩa tiếng Anh và ví dụ theo ngữ cảnh.
- Từ đồng nghĩa, trái nghĩa, collocations và word forms khi phù hợp.
- Phân loại theo chủ đề, cấp độ và mục tiêu học.
- Tìm kiếm, lọc, đánh dấu yêu thích và lưu từ cá nhân.
- Flashcards, chế độ ôn tập và spaced repetition.
- Theo dõi mức độ ghi nhớ và lịch sử ôn tập.
- Không hiển thị nội dung phát âm hoặc nghĩa được tạo ra một cách tùy tiện nếu chưa được xác minh.

### B. Ngữ pháp

- Phân chia bài học theo trình độ và chủ đề.
- Giải thích ngắn gọn, rõ ràng, có ví dụ.
- Bài tập trắc nghiệm, điền từ, sửa lỗi và viết lại câu.
- Chấm điểm, giải thích đáp án và lưu tiến độ.
- Phân tích lỗi thường gặp để đề xuất bài học tiếp theo.
- Đảm bảo câu hỏi có đáp án hợp lý và nội dung không mâu thuẫn.

### C. Luyện nghe

- Audio player có play, pause, seek và điều chỉnh tốc độ.
- Transcript và phụ đề khi có dữ liệu hợp lệ.
- Bài tập nghe hiểu theo cấp độ.
- Chế độ nghe từng câu, lặp lại và kiểm tra đáp án.
- Lưu kết quả, thời gian học và tiến độ.
- Xử lý trường hợp audio lỗi, tải chậm hoặc không tồn tại.

### D. Luyện nói và phát âm

- Tích hợp microphone và speech recognition nếu nền tảng hỗ trợ.
- Kiểm tra quyền microphone và cung cấp hướng dẫn khi bị từ chối.
- Cho phép người học luyện đọc câu, hội thoại và tình huống thực tế.
- Đưa phản hồi dựa trên dữ liệu thực sự có thể đánh giá.
- Không khẳng định chấm chính xác âm vị hoặc accent nếu công nghệ hiện tại không hỗ trợ.
- Hiển thị rõ sự khác biệt giữa kết quả nhận dạng giọng nói và đánh giá phát âm.

### E. Luyện đọc

- Bài đọc theo cấp độ CEFR khi có cơ sở phân loại phù hợp.
- Từ vựng theo ngữ cảnh, câu hỏi đọc hiểu và giải thích đáp án.
- Tra từ trực tiếp trong bài đọc.
- Điều chỉnh cỡ chữ, khoảng cách và giao diện đọc.
- Lưu tiến độ và kết quả.

### F. Luyện viết

- Bài tập viết câu, đoạn văn, email và bài luận.
- Kiểm tra ngữ pháp, chính tả và cách dùng từ.
- Gợi ý cải thiện tính rõ ràng, tự nhiên và mạch lạc.
- Đưa ra bản sửa cùng lời giải thích.
- Cho phép so sánh bản gốc và bản sửa.
- Lưu lịch sử bài viết và phản hồi.

### G. Hội thoại AI

Nếu dự án có hoặc hỗ trợ tích hợp AI, hãy hoàn thiện trợ lý luyện tiếng Anh với:

- Hội thoại theo tình huống thực tế.
- Chọn trình độ và mục tiêu học.
- Phản hồi phù hợp với năng lực người học.
- Sửa lỗi ngữ pháp và diễn đạt theo cách dễ hiểu.
- Giải thích bằng tiếng Việt hoặc tiếng Anh theo tùy chọn.
- Gợi ý cách nói tự nhiên hơn và ví dụ bổ sung.
- Lưu lịch sử hội thoại khi được phép.
- Giới hạn chi phí, tốc độ yêu cầu và mức sử dụng.
- Xử lý lỗi API, timeout, rate limit và nội dung đầu vào không hợp lệ.

Không để lộ API key của mô hình AI trong trình duyệt. Mọi bí mật phải được bảo vệ phía server.

### H. Kiểm tra trình độ và bài thi

- Bài kiểm tra đầu vào phù hợp.
- Phân loại trình độ dựa trên tiêu chí có giải thích.
- Bài thi theo chủ đề, kỹ năng và cấp độ.
- Tính điểm nhất quán.
- Giải thích đáp án và thống kê câu sai.
- Lưu lịch sử, tiến bộ và đề xuất nội dung ôn tập.
- Hỗ trợ thời gian làm bài nếu phù hợp.
- Chống ghi nhận điểm sai khi người dùng tải lại trang hoặc gửi yêu cầu trùng lặp.

### I. Dashboard học tập

- Tổng quan tiến độ.
- Số ngày học liên tục nếu dữ liệu được theo dõi chính xác.
- Thời lượng học, số từ đã học và tỷ lệ hoàn thành.
- Biểu đồ kết quả theo thời gian.
- Kỹ năng mạnh, kỹ năng cần cải thiện.
- Mục tiêu hằng ngày và nhắc học.
- Đề xuất bài học tiếp theo dựa trên dữ liệu thực tế.

Không tạo các số liệu thành tích giả chỉ để làm giao diện trông hấp dẫn.

## 6. GIAI ĐOẠN 4 — AUTHENTICATION, TÀI KHOẢN VÀ PHÂN QUYỀN

Kiểm tra và hoàn thiện:

- Đăng ký, đăng nhập, đăng xuất.
- Quên mật khẩu và đặt lại mật khẩu an toàn.
- Xác minh email nếu có yêu cầu.
- Quản lý session và token.
- Bảo vệ route cần đăng nhập.
- Phân quyền học viên, giáo viên và quản trị viên nếu hệ thống hỗ trợ.
- Kiểm tra quyền truy cập trên backend, không chỉ ẩn nút trên frontend.
- Chống truy cập dữ liệu người khác bằng cách thay ID trong URL hoặc API.
- Kiểm tra lỗi xác thực, session hết hạn và tài khoản bị khóa.
- Cho phép người dùng quản lý hồ sơ, mục tiêu và tùy chọn cá nhân.
- Bảo vệ dữ liệu cá nhân và lịch sử học tập.

Không tự ý thay đổi phương thức xác thực hiện có nếu chưa đánh giá tác động và khả năng tương thích.

## 7. GIAI ĐOẠN 5 — BACKEND, DATABASE VÀ API

Kiểm tra toàn bộ luồng dữ liệu từ giao diện đến database.

- Chuẩn hóa validation ở server.
- Xử lý lỗi API nhất quán.
- Kiểm tra pagination, filtering, sorting và giới hạn truy vấn.
- Ngăn truy vấn không cần thiết và các vấn đề N+1.
- Xác minh quan hệ dữ liệu, index và constraint.
- Đảm bảo thao tác quan trọng có transaction khi cần.
- Ngăn ghi dữ liệu trùng do retry hoặc double-click.
- Kiểm tra migration và khả năng rollback.
- Đánh giá caching và invalidation.
- Kiểm tra timeout, retry và xử lý lỗi dịch vụ ngoài.
- Xác minh dữ liệu học tập được lưu và đọc chính xác.
- Tránh trả về dữ liệu nhạy cảm trong response.
- Kiểm tra upload file nếu có, gồm loại file, dung lượng và quyền truy cập.

Không thực hiện migration phá hủy hoặc xóa dữ liệu production khi chưa có bản sao lưu đã xác minh và phương án khôi phục.

## 8. GIAI ĐOẠN 6 — BẢO MẬT TOÀN HỆ THỐNG

Thực hiện kiểm tra theo các nhóm rủi ro phổ biến và OWASP phù hợp với công nghệ đang sử dụng.

Bao gồm:

- SQL/NoSQL injection.
- Cross-site scripting (XSS).
- Cross-site request forgery (CSRF) khi có liên quan.
- Broken access control và IDOR.
- Authentication và session management.
- Rate limiting và chống lạm dụng API.
- Kiểm tra input, output và file upload.
- CORS, security headers và cookie settings.
- Quản lý secret và biến môi trường.
- Lộ stack trace, dữ liệu cá nhân hoặc thông tin hệ thống.
- Dependency có lỗ hổng đã biết.
- Webhook và tích hợp dịch vụ ngoài.
- Các rủi ro đặc thù của AI như prompt injection, lộ dữ liệu và sử dụng tài nguyên quá mức.

Chỉ kiểm tra trên hệ thống mà bạn được phép truy cập. Không sử dụng thử nghiệm phá hoại hoặc quét trái phép lên hệ thống bên ngoài.

Khắc phục theo mức độ rủi ro, ưu tiên Critical và High trước. Không ghi nhận một lỗ hổng là đã khắc phục nếu chưa xác minh lại.

## 9. GIAI ĐOẠN 7 — HIỆU NĂNG VÀ SEO

### Hiệu năng

- Phân tích bundle size và các dependency nặng.
- Tối ưu hình ảnh, font, lazy loading và code splitting.
- Giảm render không cần thiết.
- Tối ưu truy vấn database và request API.
- Xử lý loading state và caching hợp lý.
- Giảm layout shift.
- Kiểm tra hiệu năng trên thiết bị di động và mạng chậm.
- Đo các chỉ số Core Web Vitals khi có môi trường phù hợp.

Không tối ưu bằng cách làm giảm độ chính xác của chức năng học tập hoặc xóa nội dung thiết yếu.

### SEO và khả năng chia sẻ

Đối với các trang công khai, hãy kiểm tra:

- Title và meta description.
- Canonical URL.
- Sitemap và robots.txt.
- Heading hierarchy.
- Open Graph metadata.
- Structured data nếu phù hợp.
- URL dễ hiểu.
- Liên kết nội bộ và trang lỗi 404.
- Khả năng index của nội dung quan trọng.

Không để các trang chứa thông tin cá nhân hoặc nội dung riêng tư bị index công khai.

## 10. GIAI ĐOẠN 8 — KIỂM THỬ TOÀN DIỆN

Tạo hoặc cải thiện bộ test tương ứng với công nghệ hiện có.

### Unit tests

Kiểm tra các hàm nghiệp vụ, tính điểm, xử lý câu trả lời, spaced repetition, validation và logic tiến độ.

### Integration tests

Kiểm tra API, authentication, phân quyền, database và các tích hợp quan trọng.

### End-to-end tests

Kiểm tra những hành trình thực tế:

1. Người dùng mới đăng ký và đăng nhập.
2. Người dùng làm bài kiểm tra đầu vào.
3. Người dùng học từ vựng và ôn tập.
4. Người dùng hoàn thành bài nghe hoặc bài ngữ pháp.
5. Người dùng làm bài kiểm tra và xem kết quả.
6. Tiến độ được lưu và hiển thị sau khi đăng nhập lại.
7. Người dùng không thể truy cập dữ liệu của tài khoản khác.
8. Người dùng không có quyền không thể truy cập trang quản trị.
9. Các luồng lỗi, mất mạng, API timeout và session hết hạn được xử lý đúng.

### Kiểm tra giao diện

- Các viewport phổ biến trên mobile và desktop.
- Lỗi console và network.
- Biểu mẫu không hợp lệ.
- Loading và empty states.
- Trạng thái đăng nhập.
- Accessibility cơ bản.
- Các thao tác bằng bàn phím.

Chạy test thật khi có công cụ và môi trường. Nếu không thể chạy browser test, hãy ghi rõ giới hạn và không tuyên bố đã xác minh giao diện thực tế.

## 11. GIAI ĐOẠN 9 — QUẢN TRỊ VÀ VẬN HÀNH

Nếu dự án có trang quản trị, hãy kiểm tra:

- Quản lý khóa học, bài học, câu hỏi và từ vựng.
- Quản lý người dùng và vai trò.
- Quản lý nội dung, trạng thái xuất bản và phân loại.
- Theo dõi lỗi và các chỉ số vận hành.
- Phân quyền quản trị viên.
- Nhật ký hoạt động đối với thao tác nhạy cảm.
- Sao lưu và khôi phục dữ liệu.
- Cấu hình môi trường staging và production.
- Quy trình triển khai và rollback.
- Health checks và giám sát lỗi.

Nếu chưa có, chỉ xây dựng phần thực sự cần thiết và phù hợp với kiến trúc hiện tại. Không tự tạo một hệ thống quản trị lớn làm tăng độ phức tạp không cần thiết.

## 12. GIAI ĐOẠN 10 — THỰC HIỆN SỬA CHỮA THEO THỨ TỰ ƯU TIÊN

Sau khi audit, hãy trực tiếp thực hiện công việc theo thứ tự:

**P0 — Critical**

- Lỗ hổng bảo mật nghiêm trọng.
- Mất hoặc hỏng dữ liệu.
- Ứng dụng không khởi động hoặc chức năng cốt lõi không thể sử dụng.

**P1 — High**

- Lỗi đăng nhập, phân quyền, lưu dữ liệu.
- API hoặc luồng học tập chính bị lỗi.
- Các lỗi làm người dùng không thể hoàn thành nhiệm vụ.

**P2 — Medium**

- Lỗi UI/UX đáng kể.
- Hiệu năng thấp.
- Các tính năng học tập chưa hoàn thiện.
- Lỗi responsive và accessibility.

**P3 — Low**

- Tối ưu code, thiết kế và trải nghiệm phụ.
- Refactor giúp dễ bảo trì.
- Cải tiến SEO và các tiện ích bổ sung.

Với mỗi thay đổi:

1. Xác định nguyên nhân gốc rễ.
2. Sửa giải pháp tại đúng vị trí.
3. Bổ sung hoặc cập nhật test.
4. Chạy lại các kiểm tra liên quan.
5. Xác minh không làm hỏng chức năng khác.
6. Ghi nhận file đã sửa và kết quả kiểm tra.

Ưu tiên các thay đổi nhỏ, rõ ràng, có thể kiểm chứng và dễ rollback.

## 13. GIAI ĐOẠN 11 — TIÊU CHUẨN CHẤT LƯỢNG CUỐI CÙNG

Chỉ kết luận dự án hoàn tất khi đã kiểm tra các tiêu chí sau trong phạm vi môi trường cho phép:

- Ứng dụng khởi động và build thành công.
- Các luồng cốt lõi hoạt động.
- Không còn lỗi Critical hoặc High đã xác nhận mà chưa xử lý hoặc chưa có biện pháp giảm thiểu được chấp thuận.
- Authentication và phân quyền được kiểm tra.
- Dữ liệu học tập được lưu và đọc chính xác.
- Các trang quan trọng hoạt động trên mobile và desktop.
- Các test hiện có không bị hỏng ngoài những thay đổi có chủ đích.
- Không có secret mới bị đưa vào source code.
- Các thay đổi database có phương án sao lưu và khôi phục phù hợp.
- Tài liệu cấu hình và hướng dẫn chạy dự án được cập nhật.
- Các giới hạn chưa giải quyết được ghi rõ.

Không cam kết website hoàn toàn không có lỗi. Báo cáo kết quả dựa trên những gì thực sự được kiểm chứng.

## 14. ĐẦU RA BẮT BUỘC

Sau khi thực hiện, hãy cung cấp các tài liệu sau:

### A. Báo cáo audit

- Kiến trúc hiện tại.
- Các vấn đề được phát hiện.
- Mức độ ưu tiên và tác động.
- Những phần đã kiểm tra và những phần chưa thể kiểm tra.

### B. Báo cáo thay đổi

- Danh sách file được thêm, sửa hoặc xóa.
- Lý do thay đổi.
- Tính năng đã hoàn thiện.
- Lỗi đã sửa.
- Các thay đổi database hoặc cấu hình.

### C. Báo cáo kiểm thử

- Lệnh và bộ test đã chạy.
- Kết quả thực tế.
- Build, lint, type check và test còn lỗi nào không.
- Các lỗi đã biết và cách tái hiện.
- Những hạng mục chưa được xác minh.

### D. Hướng dẫn vận hành

- Cách cài đặt và chạy local.
- Các biến môi trường cần thiết, chỉ ghi tên và mục đích, không ghi secret thật.
- Cách chạy test.
- Cách build production.
- Cách triển khai an toàn.
- Cách rollback nếu triển khai gặp lỗi.

### E. Kế hoạch tiếp theo

Liệt kê các công việc chưa hoàn thành theo mức ưu tiên, nguyên nhân, phụ thuộc và bước xử lý tiếp theo.

## 15. CHỈ THỊ THỰC THI CUỐI CÙNG

Bắt đầu bằng việc khảo sát repository hiện tại, đọc tài liệu dự án và kiểm tra trạng thái Git. Sau đó thực hiện audit, lập danh sách vấn đề và bắt đầu sửa ngay các vấn đề ưu tiên cao.

Không dừng lại sau khi đưa ra báo cáo audit. Tiếp tục sửa code, hoàn thiện tính năng và chạy test cho đến khi:

- Các mục tiêu có thể thực hiện trong môi trường hiện tại đã được hoàn thành; hoặc
- Có một trở ngại thực sự cần quyền truy cập, thông tin, dịch vụ hoặc quyết định từ người quản trị.

Khi gặp trở ngại, tiếp tục xử lý những phần độc lập còn làm được và báo cáo rõ điều kiện cần thiết để tiếp tục.

**Mục tiêu cuối cùng: một website học tiếng Anh hoạt động thực sự, giao diện chuyên nghiệp, trải nghiệm học tập hiệu quả, code dễ bảo trì, dữ liệu an toàn và có bằng chứng kiểm thử rõ ràng — không chỉ là một bản thiết kế đẹp hoặc một báo cáo lý thuyết.**
