import { Award, BookOpen, CalendarDays, GitBranch, GraduationCap, Headphones, Home, PenLine, Settings2, Trophy } from 'lucide-react'

/**
 * Danh sách tab của app.
 * `color` = màu nhận diện của tab, dùng cho icon nhiều màu kiểu Duolingo
 * (Sidebar, bottom nav, trang chủ). Tailwind không sinh class động nên màu
 * được truyền qua style inline.
 */
export const navigationItems = [
  { id: 'home', label: 'Trang chủ', shortLabel: 'Học', description: 'Toàn cảnh hôm nay', icon: Home, color: '#6366F1' },
  { id: 'vocabulary', label: 'Từ vựng', shortLabel: 'Từ vựng', description: '1000 từ · flashcard SRS', icon: BookOpen, color: '#0EA5E9' },
  { id: 'grammar', label: 'Ngữ pháp', shortLabel: 'Ngữ pháp', description: '30 bài · 12 thì & cấu trúc', icon: GraduationCap, color: '#8B5CF6' },
  { id: 'skills', label: 'Luyện kỹ năng', shortLabel: 'Kỹ năng', description: 'Nghe · Đọc · Nói · Viết', icon: Headphones, color: '#06B6D4' },
  { id: 'vstep', label: 'VSTEP', shortLabel: 'VSTEP', description: '10 đề thi 4 kỹ năng', icon: Award, color: '#F43F5E' },
  { id: 'writing', label: 'Kiểm tra Writing', shortLabel: 'Writing', description: 'Chấm chữa bằng AI', icon: PenLine, color: '#F59E0B' },
  { id: 'progress', label: 'Tiến độ', shortLabel: 'Tiến độ', description: 'XP · huy hiệu · mục tiêu', icon: Trophy, color: '#10B981' },
  { id: 'planner', label: 'Todo & Lịch', shortLabel: 'Todo', description: 'Kế hoạch học', icon: CalendarDays, color: '#A855F7' },
  { id: 'mindmap', label: 'Sơ đồ cây', shortLabel: 'Sơ đồ', description: 'Mindmap', icon: GitBranch, color: '#3B82F6' },
  { id: 'settings', label: 'Cài đặt', shortLabel: 'Cài đặt', description: 'Giao diện & dữ liệu', icon: Settings2, color: '#64748B' },
]

export const navItemById = (id) => navigationItems.find((item) => item.id === id) || null

