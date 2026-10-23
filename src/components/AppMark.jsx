/**
 * Logo linh vật của app: Chiếc Lông Vũ Tri Thức (The Celestial Quill Feather) nghệ thuật vẽ tay.
 * Dùng chung một file SVG trong `public/icons` để mọi nơi hiển thị sắc nét, đồng bộ.
 */
const APP_ICON_SRC = `${import.meta.env.BASE_URL}icons/icon-192.png`

export default function AppMark({ className = 'h-10 w-10', alt = '' }) {
  return <img src={APP_ICON_SRC} alt={alt} className={`${className} shrink-0 select-none object-contain`} draggable="false" />
}
