import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import AuthLayout from '../../components/layout/AuthLayout'
import Button from '../../components/ui/Button'
import useAuthStore from '../../store/authStore'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

 const onSubmit = async (data) => {
  setLoading(true)
  setServerError('')
  try {
    const res = await api.post('/login', data)
    login(res.data.user, res.data.token)
    toast.success('Welcome back!')
    navigate('/dashboard')
  } catch (err) {
    setServerError(err.response?.data?.msg || 'Login failed. Try again.')
  } finally {
    setLoading(false)
  }
}

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your ResumeAI account"
    >
      <div className="space-y-5">

        {/* Server Error */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-[#EF4444] text-sm px-4 py-3 rounded-xl">
            {serverError}
          </div>
        )}

        {/* Email */}
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
              ${errors.email ? 'border-[#EF4444] bg-red-50' : 'border-[#E2E8F0] bg-white'}`}
          />
          {errors.email && (
            <p className="text-[#EF4444] text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-[#0F172A]">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-[#2563EB] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            placeholder="Enter your password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
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

        {/* Submit */}
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
          onClick={handleSubmit(onSubmit)}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        {/* Divider */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E2E8F0]" />
          </div>
          <div className="relative flex justify-center text-xs text-[#94A3B8] bg-white px-3">
            Don't have an account?
          </div>
        </div>

        {/* Register Link */}
        <Link to="/register">
          <Button variant="outline" className="w-full">
            Create an Account
          </Button>
        </Link>

      </div>
    </AuthLayout>
  )
}