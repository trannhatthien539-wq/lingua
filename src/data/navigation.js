import { BookOpen, CalendarDays, GitBranch, GraduationCap, Headphones, PenLine, Settings2, Trophy } from 'lucide-react'

export const navigationItems = [
  { id: 'vocabulary', label: 'Từ vựng', shortLabel: 'Từ vựng', description: 'SRS Flashcard', icon: BookOpen },
  { id: 'grammar', label: 'Ngữ pháp', shortLabel: 'Ngữ pháp', description: '12 thì & cấu trúc', icon: GraduationCap },
  { id: 'skills', label: 'Luyện kỹ năng', shortLabel: 'Kỹ năng', description: 'Nghe · Đọc · Nói · Viết', icon: Headphones },
  { id: 'vstep', label: 'VSTEP', shortLabel: 'VSTEP', description: 'Đề thi 4 kỹ năng', icon: GraduationCap },
  { id: 'writing', label: 'Kiểm tra Writing', shortLabel: 'Writing', description: 'Chấm chữa bằng AI', icon: PenLine },
  { id: 'progress', label: 'Tiến độ', shortLabel: 'Tiến độ', description: 'XP, huy hiệu, mục tiêu', icon: Trophy },
  { id: 'planner', label: 'Todo & Lịch', shortLabel: 'Todo', description: 'Kế hoạch học', icon: CalendarDays },
  { id: 'mindmap', label: 'Sơ đồ cây', shortLabel: 'Sơ đồ', description: 'Mindmap', icon: GitBranch },
  { id: 'settings', label: 'Cài đặt', shortLabel: 'Cài đặt', description: 'Giao diện & dữ liệu', icon: Settings2 },
]
