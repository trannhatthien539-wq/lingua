import { BookOpen, CalendarDays, GitBranch, GraduationCap, PenLine, Settings2 } from 'lucide-react'

export const navigationItems = [
  { id: 'vocabulary', label: 'Từ vựng', shortLabel: 'Từ vựng', description: 'SRS Flashcard', icon: BookOpen },
  { id: 'grammar', label: 'Ngữ pháp', shortLabel: 'Ngữ pháp', description: '12 thì & cấu trúc', icon: GraduationCap },
  { id: 'writing', label: 'Kiểm tra Writing', shortLabel: 'Writing', description: 'Chấm chữa bằng AI', icon: PenLine },
  { id: 'planner', label: 'Todo & Lịch', shortLabel: 'Todo', description: 'Kế hoạch học', icon: CalendarDays },
  { id: 'mindmap', label: 'Sơ đồ cây', shortLabel: 'Sơ đồ', description: 'Mindmap', icon: GitBranch },
  { id: 'settings', label: 'Cài đặt', shortLabel: 'Cài đặt', description: 'Giao diện & dữ liệu', icon: Settings2 },
]
