import { Award, BookOpen, CalendarDays, GitBranch, GraduationCap, Headphones, Home, PenLine, Settings2, Trophy } from 'lucide-react'

/**
 * Danh sách tab của app.
 * `color` = màu chữ/nhãn đạt WCAG AA (≥ 4.5:1) trên nền sáng.
 * `colorDark` = biến thể sáng hơn dùng trên nền tối.
 * Màu được truyền qua style inline vì Tailwind không sinh class động.
 */
export const navigationItems = [
  { id: 'home', label: 'Trang chủ', shortLabel: 'Học', description: 'Tổng quan hôm nay', icon: Home, color: '#4F46E5', colorDark: '#A5B4FC' },
  { id: 'vocabulary', label: 'Từ vựng', shortLabel: 'Từ vựng', description: 'Thẻ từ vựng SRS', icon: BookOpen, color: '#0369A1', colorDark: '#7DD3FC' },
  { id: 'grammar', label: 'Ngữ pháp', shortLabel: 'Ngữ pháp', description: '30 chủ điểm ngữ pháp', icon: GraduationCap, color: '#6D28D9', colorDark: '#C4B5FD' },
  { id: 'skills', label: 'Kỹ năng', shortLabel: 'Kỹ năng', description: 'Nghe · Đọc · Nói · Viết', icon: Headphones, color: '#0E7490', colorDark: '#67E8F9' },
  { id: 'vstep', label: 'VSTEP', shortLabel: 'VSTEP', description: 'Đề thi chuẩn B1–C1', icon: Award, color: '#BE123C', colorDark: '#FDA4AF' },
  { id: 'writing', label: 'Sửa bài viết', shortLabel: 'Viết', description: 'Chấm & chữa bài AI', icon: PenLine, color: '#B45309', colorDark: '#FCD34D' },
  { id: 'progress', label: 'Tiến độ', shortLabel: 'Tiến độ', description: 'Thống kê & huy hiệu', icon: Trophy, color: '#047857', colorDark: '#6EE7B7' },
  { id: 'planner', label: 'Kế hoạch', shortLabel: 'Kế hoạch', description: 'Mục tiêu & thời gian biểu', icon: CalendarDays, color: '#7E22CE', colorDark: '#D8B4FE' },
  { id: 'mindmap', label: 'Bản đồ tư duy', shortLabel: 'Sơ đồ', description: 'Sơ đồ kiến thức', icon: GitBranch, color: '#1D4ED8', colorDark: '#93C5FD' },
  { id: 'settings', label: 'Cài đặt', shortLabel: 'Cài đặt', description: 'Tài khoản & tuỳ chọn', icon: Settings2, color: '#475569', colorDark: '#CBD5E1' },
]

export const navigationGroups = [
  { id: 'core', label: 'Học tập', itemIds: ['home', 'vocabulary', 'grammar', 'skills', 'vstep', 'writing'] },
  { id: 'tools', label: 'Công cụ', itemIds: ['planner', 'mindmap'] },
  { id: 'personal', label: 'Cá nhân', itemIds: ['progress', 'settings'] },
]

export const navItemById = (id) => navigationItems.find((item) => item.id === id) || null

