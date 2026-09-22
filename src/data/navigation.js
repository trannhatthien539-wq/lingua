import { Award, BookOpen, CalendarDays, GitBranch, GraduationCap, Headphones, Home, PenLine, Settings2, Trophy } from 'lucide-react'

/**
 * Danh sách tab của app.
 * `color` = màu nhận diện của tab, dùng cho icon nhiều màu kiểu Duolingo
 * (Sidebar, bottom nav, trang chủ). Tailwind không sinh class động nên màu
 * được truyền qua style inline.
 */
export const navigationItems = [
  { id: 'home', label: 'Trang chủ', shortLabel: 'Học', description: 'Toàn cảnh hôm nay', icon: Home, color: '#58cc02' },
  { id: 'vocabulary', label: 'Từ vựng', shortLabel: 'Từ vựng', description: '1000 từ · flashcard SRS', icon: BookOpen, color: '#1cb0f6' },
  { id: 'grammar', label: 'Ngữ pháp', shortLabel: 'Ngữ pháp', description: '30 bài · 12 thì & cấu trúc', icon: GraduationCap, color: '#ce82ff' },
  { id: 'skills', label: 'Luyện kỹ năng', shortLabel: 'Kỹ năng', description: 'Nghe · Đọc · Nói · Viết', icon: Headphones, color: '#14d4f4' },
  { id: 'vstep', label: 'VSTEP', shortLabel: 'VSTEP', description: '10 đề thi 4 kỹ năng', icon: Award, color: '#ff4b4b' },
  { id: 'writing', label: 'Kiểm tra Writing', shortLabel: 'Writing', description: 'Chấm chữa bằng AI', icon: PenLine, color: '#ff9600' },
  { id: 'progress', label: 'Tiến độ', shortLabel: 'Tiến độ', description: 'XP · huy hiệu · mục tiêu', icon: Trophy, color: '#ffc800' },
  { id: 'planner', label: 'Todo & Lịch', shortLabel: 'Todo', description: 'Kế hoạch học', icon: CalendarDays, color: '#ff86d0' },
  { id: 'mindmap', label: 'Sơ đồ cây', shortLabel: 'Sơ đồ', description: 'Mindmap', icon: GitBranch, color: '#2b70c9' },
  { id: 'settings', label: 'Cài đặt', shortLabel: 'Cài đặt', description: 'Giao diện & dữ liệu', icon: Settings2, color: '#8a9aa3' },
]

export const navItemById = (id) => navigationItems.find((item) => item.id === id) || null

