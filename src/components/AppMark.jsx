/**
 * Logo linh vật của app: Chiếc Lông Vũ Tri Thức (The Celestial Quill Feather) nghệ thuật vẽ tay.
 * Dùng chung một file SVG trong `public/icons` để mọi nơi hiển thị sắc nét, đồng bộ.
 */
const TREE_SRC = `${import.meta.env.BASE_URL}icons/tree.svg`

export default function AppMark({ className = 'h-10 w-10', alt = '' }) {
  return <img src={TREE_SRC} alt={alt} className={`${className} shrink-0 select-none object-contain`} draggable="false" />
}
