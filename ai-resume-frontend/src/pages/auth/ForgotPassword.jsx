import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import AuthLayout from '../../components/layout/AuthLayout'
import Button from '../../components/ui/Button'
import api from '../../services/api'

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [resetLink, setResetLink] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    setServerError('')
    try {
      const res = await api.post('/forgot-password', data)
      setResetLink(res.data.resetLink || null)
      setSubmitted(true)
    } catch (err) {
      setServerError(err.response?.data?.msg || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetLinkClick = () => {
    if (resetLink) window.location.href = resetLink
  }

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="No worries, we'll generate a reset link for you"
    >
      {submitted ? (
        <div className="text-center space-y-4">

          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">📧</span>
          </div>

          <h3 className="text-lg font-semibold text-[#0F172A]">
            Reset link generated!
          </h3>

          <p className="text-sm text-[#475569]">
            In production this would be emailed to you. For now use this link:
          </p>

          {resetLink && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-left space-y-2">
              <p className="text-xs font-semibold text-[#2563EB]">
                Your reset link:
              </p>
              <p className="text-xs text-[#475569] break-all">
                {resetLink}
              </p>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={handleResetLinkClick}
              >
                Open Reset Link →
              </Button>
            </div>
          )}

          <p className="text-xs text-[#94A3B8]">
            This link expires in 1 hour.
          </p>

          <Link to="/login">
            <Button variant="outline" className="w-full">
              Back to Login
            </Button>
          </Link>

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
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Enter a valid email',
                },
              })}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#0F172A]
                placeholder-[#94A3B8] outline-none transition-all
                focus:ring-2 focus:ring-[#2563EB] focus:border-transparent
                ${errors.email
                  ? 'border-[#EF4444] bg-red-50'
                  : 'border-[#E2E8F0] bg-white'
                }`}
            />
            {errors.email && (
              <p className="text-[#EF4444] text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={handleSubmit(onSubmit)}
          >
            {loading ? 'Generating...' : 'Generate Reset Link'}
          </Button>

          <Link to="/login">
            <Button variant="ghost" className="w-full">
              Back to Login
            </Button>
          </Link>

        </div>
      )}
    </AuthLayout>
  )
}