import { create } from 'zustand'
import api from '../services/api'
import toast from 'react-hot-toast'
import useAuthStore from './authStore'

const useSubscriptionStore = create((set, get) => ({
  subscription: null,
  isLoading: false,

  fetchSubscription: async () => {
    set({ isLoading: true })
    try {
      const res = await api.get('/subscription')
      set({ subscription: res.data, isLoading: false })
    } catch (err) {
      set({ subscription: { plan: 'free', status: 'active', expiryDate: null }, isLoading: false })
    }
  },

  upgradeToPro: async () => {
    set({ isLoading: true })
    try {
      const res = await api.post('/subscribe', { plan: 'pro' })
      set({ subscription: res.data, isLoading: false })

      // Reflect the new plan in authStore/localStorage immediately
      const { user, setUser } = useAuthStore.getState()
      if (user) setUser({ ...user, subscriptionPlan: 'pro', subscriptionStatus: 'active' })

      toast.success('Welcome to Pro! 🎉')
      return true
    } catch (err) {
      set({ isLoading: false })
      toast.error(err.response?.data?.msg || 'Upgrade failed. Please try again.')
      return false
    }
  },

  cancelSubscription: async () => {
    set({ isLoading: true })
    try {
      await api.post('/subscription/cancel')
      set({ subscription: { plan: 'free', status: 'active', expiryDate: null }, isLoading: false })

      const { user, setUser } = useAuthStore.getState()
      if (user) setUser({ ...user, subscriptionPlan: 'free', subscriptionStatus: 'free' })

      toast.success('Subscription cancelled.')
      return true
    } catch (err) {
      set({ isLoading: false })
      toast.error(err.response?.data?.msg || 'Failed to cancel subscription.')
      return false
    }
  },

  isPro: () => get().subscription?.plan === 'pro',
}))

export default useSubscriptionStore