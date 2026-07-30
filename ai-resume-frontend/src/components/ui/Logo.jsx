import { useId } from 'react'

/**
 * ResumeAI logo mark: a document with keyword lines and a green
 * "AI-verified / ATS-passed" check badge, on a blue-to-violet
 * gradient square. Matches the app's #2563EB / #7C3AED / #22C55E
 * color system.
 *
 * Usage:
 *   <Logo iconSize={36} />                          // icon + "ResumeAI" text
 *   <Logo iconSize={32} textClassName="text-lg" />   // custom text size
 *   <Logo iconSize={48} showText={false} />          // icon only
 */
export default function Logo({
  iconSize = 36,
  showText = true,
  textClassName = 'font-bold text-[#0F172A] text-lg',
  className = '',
}) {
  const gradientId = useId()

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="10" fill={`url(#${gradientId})`} />
        <rect x="12.5" y="9" width="15" height="21.5" rx="2.2" fill="#FFFFFF" />
        <rect x="15.5" y="13.2" width="9.5" height="1.6" rx="0.8" fill="#2563EB" opacity="0.85" />
        <rect x="15.5" y="16.7" width="9.5" height="1.4" rx="0.7" fill="#94A3B8" opacity="0.6" />
        <rect x="15.5" y="20" width="6.8" height="1.4" rx="0.7" fill="#94A3B8" opacity="0.6" />
        <rect x="15.5" y="23.3" width="9.5" height="1.4" rx="0.7" fill="#94A3B8" opacity="0.6" />
        <circle cx="26.5" cy="28.5" r="5.6" fill="#22C55E" />
        <path
          d="M24.1 28.5L26 30.4L29.3 26.3"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {showText && <span className={textClassName}>ResumeAI</span>}
    </div>
  )
}