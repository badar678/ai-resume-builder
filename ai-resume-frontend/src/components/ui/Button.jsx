const variants = {
  primary: 'bg-[#2563EB] text-white hover:bg-blue-700',
  secondary: 'bg-[#0F172A] text-white hover:bg-slate-800',
  danger: 'bg-[#EF4444] text-white hover:bg-red-600',
  outline: 'border border-[#2563EB] text-[#2563EB] hover:bg-blue-50',
  ghost: 'text-[#475569] hover:bg-[#F1F5F9]',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-xl
        transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {children}
    </button>
  )
}