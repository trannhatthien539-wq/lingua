/**
 * Logo biểu tượng ứng dụng: Chiếc Lông Vũ Tri Thức & Sách (The Celestial Feather & Book).
 * Sử dụng icon squircle 192x192 với 4 góc trong suốt, hiển thị sắc nét và mượt mà trên mọi thiết bị.
 */
const APP_ICON_SRC = `${import.meta.env.BASE_URL}icons/icon-192.png`

export default function AppMark({ className = 'h-10 w-10', alt = 'Lingua' }) {
  return (
    <img
      src={APP_ICON_SRC}
      alt={alt}
      className={`${className} shrink-0 select-none object-contain`}
      draggable="false"
    />
  )
}
