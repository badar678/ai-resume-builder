export default function Card({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-[12px] shadow-sm border border-[#E2E8F0]
        transition-shadow duration-200 hover:shadow-md
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}