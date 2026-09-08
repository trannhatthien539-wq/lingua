import { BookOpen, CalendarDays, GitBranch, PenLine, Settings2 } from 'lucide-react'

export const navigationItems = [
  { id: 'vocabulary', label: 'Từ vựng', description: 'SRS Flashcard', icon: BookOpen },
  { id: 'grammar', label: 'Ngữ pháp', description: 'Chấm chữa', icon: PenLine },
  { id: 'planner', label: 'Todo & Lịch', description: 'Kế hoạch học', icon: CalendarDays },
  { id: 'mindmap', label: 'Sơ đồ cây', description: 'Mindmap', icon: GitBranch },
  { id: 'settings', label: 'Cài đặt API', description: 'Kết nối dịch vụ', icon: Settings2 },
]
