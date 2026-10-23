import { Award, BookOpen, CalendarDays, GitBranch, GraduationCap, Headphones, Home, PenLine, Settings2, Trophy } from 'lucide-react'

/**
 * Danh sách tab của app.
 * `color` = màu chữ/nhãn đạt WCAG AA (≥ 4.5:1) trên nền sáng.
 * `colorDark` = biến thể sáng hơn dùng trên nền tối.
 * Màu được truyền qua style inline vì Tailwind không sinh class động.
 */
export const navigationItems = [
  { id: 'home', label: 'Trang chủ', shortLabel: 'Học', description: 'Toàn cảnh hôm nay', icon: Home, color: '#4F46E5', colorDark: '#A5B4FC' },
  { id: 'vocabulary', label: 'Từ vựng', shortLabel: 'Từ vựng', description: '1000 từ · flashcard SRS', icon: BookOpen, color: '#0369A1', colorDark: '#7DD3FC' },
  { id: 'grammar', label: 'Ngữ pháp', shortLabel: 'Ngữ pháp', description: '30 bài · 12 thì & cấu trúc', icon: GraduationCap, color: '#6D28D9', colorDark: '#C4B5FD' },
  { id: 'skills', label: 'Luyện kỹ năng', shortLabel: 'Kỹ năng', description: 'Nghe · Đọc · Nói · Viết', icon: Headphones, color: '#0E7490', colorDark: '#67E8F9' },
  { id: 'vstep', label: 'VSTEP', shortLabel: 'VSTEP', description: '10 đề thi 4 kỹ năng', icon: Award, color: '#BE123C', colorDark: '#FDA4AF' },
  { id: 'writing', label: 'Kiểm tra Writing', shortLabel: 'Writing', description: 'Chấm chữa bằng AI', icon: PenLine, color: '#B45309', colorDark: '#FCD34D' },
  { id: 'progress', label: 'Tiến độ', shortLabel: 'Tiến độ', description: 'XP · huy hiệu · mục tiêu', icon: Trophy, color: '#047857', colorDark: '#6EE7B7' },
  { id: 'planner', label: 'Todo & Lịch', shortLabel: 'Todo', description: 'Kế hoạch học', icon: CalendarDays, color: '#7E22CE', colorDark: '#D8B4FE' },
  { id: 'mindmap', label: 'Sơ đồ cây', shortLabel: 'Sơ đồ', description: 'Mindmap', icon: GitBranch, color: '#1D4ED8', colorDark: '#93C5FD' },
  { id: 'settings', label: 'Cài đặt', shortLabel: 'Cài đặt', description: 'Giao diện & dữ liệu', icon: Settings2, color: '#475569', colorDark: '#CBD5E1' },
]

export const navigationGroups = [
  { id: 'core', label: 'Học tập cốt lõi', itemIds: ['home', 'vocabulary', 'grammar', 'skills', 'vstep', 'writing'] },
  { id: 'tools', label: 'Kế hoạch & Tư duy', itemIds: ['planner', 'mindmap'] },
  { id: 'personal', label: 'Cá nhân & Cài đặt', itemIds: ['progress', 'settings'] },
]

export const navItemById = (id) => navigationItems.find((item) => item.id === id) || null

