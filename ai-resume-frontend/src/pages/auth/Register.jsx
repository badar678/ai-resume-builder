import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import AuthLayout from '../../components/layout/AuthLayout'
import Button from '../../components/ui/Button'
import api from '../../services/api'
import toast from 'react-hot-toast'


export default function Register() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
  setLoading(true)
  setServerError('')
  try {
    await api.post('/register', {
      name: data.name,
      email: data.email,
      password: data.password,
    })
    toast.success('Account created! Please log in.')
    navigate('/login')
  } catch (err) {
    setServerError(err.response?.data?.msg || 'Registration failed. Try again.')
  } finally {
    setLoading(false)
  }
}

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start building your perfect resume today"
    >
      <div className="space-y-5">

        {/* Server Error */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-[#EF4444] text-sm px-4 py-3 rounded-xl">
            {serverError}
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            placeholder="John Doe"
            {...register('name', {
              required: 'Full name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
            })}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#0F172A]
              placeholder-[#94A3B8] outline-none transition-all
              focus:ring-2 focus:ring-[#2563EB] focus:border-transparent
              ${errors.name ? 'border-[#EF4444] bg-red-50' : 'border-[#E2E8F0] bg-white'}`}
          />
          {errors.name && (
            <p className="text-[#EF4444] text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

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
          <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
            Password
          </label>
          <input
            type="password"
            placeholder="Minimum 6 characters"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
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

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Re-enter your password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === password || 'Passwords do not match',
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

        {/* Terms */}
        

        {/* Submit */}
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
          onClick={handleSubmit(onSubmit)}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>

        {/* Divider */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E2E8F0]" />
          </div>
          <div className="relative flex justify-center text-xs text-[#94A3B8] bg-white px-3">
            Already have an account?
          </div>
        </div>

        {/* Login Link */}
        <Link to="/login">
          <Button variant="outline" className="w-full">
            Sign In Instead
          </Button>
        </Link>

      </div>
    </AuthLayout>
  )
}