/**
 * Logo linh vật của app: cây cổ thụ (trùng với icon PWA).
 * Dùng chung một file SVG trong `public/icons` để mọi nơi hiển thị giống nhau.
 */
const TREE_SRC = `${import.meta.env.BASE_URL}icons/tree.svg`

export default function AppMark({ className = 'h-10 w-10', alt = '' }) {
  return <img src={TREE_SRC} alt={alt} className={`${className} shrink-0 select-none object-contain`} draggable="false" />
}
