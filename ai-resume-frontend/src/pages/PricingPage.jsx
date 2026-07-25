import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import ConfirmModal from '../components/ui/ConfirmModal'
import UpgradeModal from '../components/subscription/UpgradeModal'
import useSubscriptionStore from '../store/subscriptionStore'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: ['1 resume', 'Basic template', 'Limited ATS check', 'No AI suggestions'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9,
    features: [
      'Unlimited resumes',
      'AI-powered suggestions',
      'Advanced ATS scoring',
      'Premium templates',
      'Unlimited PDF downloads',
    ],
    highlighted: true,
  },
]

export default function PricingPage() {
  const navigate = useNavigate()
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [showDowngrade, setShowDowngrade] = useState(false)
  const [showResumeConfirm, setShowResumeConfirm] = useState(false)
  const [downgrading, setDowngrading] = useState(false)
  const [resuming, setResuming] = useState(false)

  const { subscription, fetchSubscription, cancelSubscription, resumeSubscription } = useSubscriptionStore()

  useEffect(() => {
    fetchSubscription()
  }, [])

  const currentPlan = subscription?.plan || 'free'
  const cancelAtPeriodEnd = !!subscription?.cancelAtPeriodEnd
  const expiryDate = subscription?.expiryDate
    ? new Date(subscription.expiryDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
    : null

  const handleDowngrade = async () => {
    setDowngrading(true)
    await cancelSubscription()
    setDowngrading(false)
    setShowDowngrade(false)
  }

  const handleResume = async () => {
    setResuming(true)
    await resumeSubscription()
    setResuming(false)
    setShowResumeConfirm(false)
  }

  return (
    <AppLayout title="Pricing">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#0F172A]">Simple, transparent pricing</h2>
          <p className="text-sm text-[#475569] mt-1">
            Start free. Upgrade when you're ready to land more interviews.
          </p>
        </div>

        {cancelAtPeriodEnd && (
          <div className="mb-6 bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-sm rounded-xl px-4 py-3 text-center">
            Your subscription won't renew. You'll keep Pro access until <strong>{expiryDate || 'your period ends'}</strong>.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => {
            const isCurrent = currentPlan === plan.id
            const isProCancelling = plan.id === 'pro' && isCurrent && cancelAtPeriodEnd
            return (
              <Card
                key={plan.id}
                className={`p-8 relative ${plan.highlighted ? 'border-[#2563EB] border-2' : ''}`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2563EB] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                )}

                <h3 className="text-lg font-semibold text-[#0F172A]">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[#0F172A]">${plan.price}</span>
                  <span className="text-sm text-[#475569]">/month</span>
                </div>

                <ul className="mt-6 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-[#475569]">
                      <span className="text-[#22C55E]">✓</span> {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={isCurrent ? 'outline' : plan.highlighted ? 'primary' : 'secondary'}
                  disabled={isCurrent && !isProCancelling}
                  className="w-full mt-8"
                  onClick={() => {
                    if (isProCancelling) setShowResumeConfirm(true)
                    else if (plan.id === 'pro') setShowUpgrade(true)
                    else setShowDowngrade(true)
                  }}
                >
                  {isProCancelling
                    ? 'Renew Subscription'
                    : isCurrent
                      ? 'Current Plan'
                      : plan.id === 'pro' ? 'Upgrade to Pro' : 'Switch to Free'}
                </Button>

                {/* Explicit cancel action for an active Pro subscriber —
                    without this, the only way to cancel was the unrelated
                    "Switch to Free" button on the other card, which isn't
                    obvious. */}
                {plan.id === 'pro' && isCurrent && !isProCancelling && (
                  <button
                    onClick={() => setShowDowngrade(true)}
                    className="w-full mt-2 text-xs text-[#94A3B8] hover:text-[#EF4444] transition-colors cursor-pointer"
                  >
                    Cancel Subscription
                  </button>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        onSuccess={() => navigate('/payment-success')}
      />

      <ConfirmModal
        isOpen={showDowngrade}
        onClose={() => setShowDowngrade(false)}
        onConfirm={handleDowngrade}
        title="Cancel your Pro subscription?"
        message={`Your card won't be charged again. You'll keep unlimited resumes, AI suggestions, and premium templates until${expiryDate ? ` ${expiryDate}` : ' the end of your current billing period'} — then your account moves to the Free plan.`}
        confirmText="Cancel Subscription"
        loading={downgrading}
      />

      <ConfirmModal
        isOpen={showResumeConfirm}
        onClose={() => setShowResumeConfirm(false)}
        onConfirm={handleResume}
        title="Renew your Pro subscription?"
        message={`Your card will be charged again as normal on${expiryDate ? ` ${expiryDate}` : ' your next billing date'}, and Pro access will continue uninterrupted.`}
        confirmText="Renew Subscription"
        loading={resuming}
      />
    </AppLayout>
  )
}