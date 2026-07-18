import { Link } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout'
import Button from '../../components/ui/Button'

export default function EmailVerification() {
  return (
    <AuthLayout
      title="Verify your email"
      subtitle="Almost there! Check your inbox"
    >
      <div className="text-center space-y-5">

        {/* Icon */}
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
          <span className="text-4xl">✉️</span>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <p className="text-sm text-[#475569]">
            We've sent a verification link to your email address.
            Click the link in the email to activate your account.
          </p>
          <p className="text-xs text-[#94A3B8]">
            Didn't get the email? Check your spam folder or request a new one.
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-left space-y-2">
          <p className="text-xs font-semibold text-[#2563EB]">What to do next:</p>
          <ul className="text-xs text-[#475569] space-y-1">
            <li>✅ Open your email inbox</li>
            <li>✅ Find the email from ResumeAI</li>
            <li>✅ Click the "Verify Email" button</li>
            <li>✅ Come back and log in</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <Link to="/login">
            <Button className="w-full">
              Go to Login
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="ghost" className="w-full">
              ← Back to Register
            </Button>
          </Link>
        </div>

      </div>
    </AuthLayout>
  )
}