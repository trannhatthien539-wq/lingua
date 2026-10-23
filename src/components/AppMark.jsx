/**
 * Logo linh vật của app: Chiếc Lông Vũ Tri Thức (The Celestial Quill Feather) nghệ thuật vẽ tay.
 * Sử dụng trực tiếp file SVG trong `public/icons` với nền trong suốt (transparent) để hiển thị sắc nét,
 * hoàn toàn không bị lộ viền trắng khi bật nền tối trên điện thoại và máy tính.
 */
const APP_ICON_SRC = `${import.meta.env.BASE_URL}icons/tree.svg`

export default function AppMark({ className = 'h-10 w-10', alt = 'Lingua' }) {
  return <img src={APP_ICON_SRC} alt={alt} className={`${className} shrink-0 select-none object-contain`} draggable="false" />
}
