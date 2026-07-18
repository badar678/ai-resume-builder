import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import useSubscriptionStore from '../store/subscriptionStore'

export default function PaymentSuccessPage() {
  const navigate = useNavigate()
  const { subscription, fetchSubscription } = useSubscriptionStore()
  const [confirming, setConfirming] = useState(true)

  const isPro = subscription?.plan === 'pro'

  // Paddle's webhook lands a moment after checkout closes, so we poll
  // briefly until our backend reflects the Pro upgrade instead of assuming
  // it's instant.
  useEffect(() => {
    let attempts = 0
    const maxAttempts = 8 // ~12 seconds

    fetchSubscription()

    const interval = setInterval(async () => {
      attempts += 1
      await fetchSubscription()
      if (attempts >= maxAttempts) {
        clearInterval(interval)
        setConfirming(false)
      }
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isPro) setConfirming(false)
  }, [isPro])

  return (
    <AppLayout title="Payment Successful">
      <div className="max-w-md mx-auto mt-10">
        <Card className="p-8 text-center">
          {confirming && !isPro ? (
            <>
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⏳</span>
              </div>
              <h2 className="text-xl font-bold text-[#0F172A]">Confirming your payment...</h2>
              <p className="text-sm text-[#475569] mt-2">
                This usually takes just a few seconds.
              </p>
            </>
          ) : isPro ? (
            <>
              <div className="w-16 h-16 bg-[#22C55E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎉</span>
              </div>
              <h2 className="text-xl font-bold text-[#0F172A]">You're on Pro now!</h2>
              <p className="text-sm text-[#475569] mt-2">
                Unlimited resumes, AI suggestions, and premium templates are unlocked.
              </p>
              <Button onClick={() => navigate('/dashboard')} className="w-full mt-6">
                Go to Dashboard
              </Button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-xl font-bold text-[#0F172A]">Still processing</h2>
              <p className="text-sm text-[#475569] mt-2">
                Your payment succeeded, but activation is taking longer than usual.
                Refresh in a moment, or check the Admin Panel's Subscriptions tab
                if this persists.
              </p>
              <Button onClick={() => navigate('/dashboard')} variant="outline" className="w-full mt-6">
                Go to Dashboard
              </Button>
            </>
          )}
        </Card>
      </div>
    </AppLayout>
  )
}