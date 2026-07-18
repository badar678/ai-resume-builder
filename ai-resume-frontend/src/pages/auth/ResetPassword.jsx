import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import AuthLayout from '../../components/layout/AuthLayout'
import Button from '../../components/ui/Button'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')

  const onSubmit = async (data) => {
  setLoading(true)
  setServerError('')
  try {
    await api.post('/reset-password', {
      email,
      token,
      newPassword: data.password,
    })
    toast.success('Password reset successfully!')
    setSuccess(true)
    setTimeout(() => navigate('/login'), 3000)
  } catch (err) {
    setServerError(err.response?.data?.msg || 'Reset failed. Token may have expired.')
  } finally {
    setLoading(false)
  }
}

  if (!token || !email) {
    return (
      <AuthLayout title="Invalid Link" subtitle="This reset link is invalid or expired">
        <div className="text-center space-y-4">
          <p className="text-sm text-[#475569]">
            Please request a new password reset link.
          </p>
          <Link to="/forgot-password">
            <Button className="w-full">Request New Link</Button>
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your new password below"
    >
      {success ? (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">✅</span>
          </div>
          <h3 className="text-lg font-semibold text-[#0F172A]">Password reset!</h3>
          <p className="text-sm text-[#475569]">
            Your password has been updated. Redirecting to login...
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-[#EF4444] text-sm px-4 py-3 rounded-xl">
              {serverError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
              New Password
            </label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'At least 6 characters' },
              })}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#0F172A]
                placeholder-[#94A3B8] outline-none transition-all
                focus:ring-2 focus:ring-[#2563EB] focus:border-transparent
                ${errors.password ? 'border-[#EF4444] bg-red-50' : 'border-[#E2E8F0] bg-white'}`}
            />
            {errors.password && (
              <p className="text-[#EF4444] text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Re-enter new password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val) => val === password || 'Passwords do not match',
              })}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#0F172A]
                placeholder-[#94A3B8] outline-none transition-all
                focus:ring-2 focus:ring-[#2563EB] focus:border-transparent
                ${errors.confirmPassword ? 'border-[#EF4444] bg-red-50' : 'border-[#E2E8F0] bg-white'}`}
            />
            {errors.confirmPassword && (
              <p className="text-[#EF4444] text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={handleSubmit(onSubmit)}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>

          <Link to="/login">
            <Button variant="ghost" className="w-full">
              ← Back to Login
            </Button>
          </Link>
        </div>
      )}
    </AuthLayout>
  )
}