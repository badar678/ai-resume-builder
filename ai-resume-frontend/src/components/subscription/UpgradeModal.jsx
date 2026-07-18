import { useState, useCallback } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import useAuthStore from '../../store/authStore'
import usePaddle from '../../hooks/usePaddle'
import toast from 'react-hot-toast'

export default function UpgradeModal({ isOpen, onClose, onSuccess }) {
  const [processing, setProcessing] = useState(false)
  const user = useAuthStore((state) => state.user)

  const handlePaddleEvent = useCallback((event) => {
    if (event.name === 'checkout.completed') {
      setProcessing(false)
      toast.success('Payment received! Activating your Pro plan...')
      onClose()
      onSuccess()
    }
    if (event.name === 'checkout.closed') {
      setProcessing(false)
    }
    if (event.name === 'checkout.error') {
      setProcessing(false)
      toast.error('Checkout failed. Please try again.')
    }
  }, [onClose, onSuccess])

  const paddle = usePaddle(handlePaddleEvent)

  const handleConfirm = () => {
    if (!paddle) {
      toast.error('Payment system is still loading. Please try again in a moment.')
      return
    }
    if (!user?.email) {
      toast.error('You must be logged in to upgrade.')
      return
    }

    setProcessing(true)

    paddle.Checkout.open({
      items: [{ priceId: import.meta.env.VITE_PADDLE_PRO_PRICE_ID, quantity: 1 }],
      customer: { email: user.email },
      customData: { userId: user.id },
      settings: { displayMode: 'overlay', theme: 'light', locale: 'en' },
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upgrade to Pro">
      <div className="space-y-5">
        <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-[12px] border border-[#E2E8F0]">
          <div>
            <p className="font-semibold text-[#0F172A]">Pro Plan</p>
            <p className="text-sm text-[#475569]">Billed monthly</p>
          </div>
          <p className="text-2xl font-bold text-[#0F172A]">
            $9<span className="text-sm font-normal text-[#475569]">/mo</span>
          </p>
        </div>

        <ul className="space-y-2">
          {[
            'Unlimited resumes',
            'AI-powered suggestions',
            'Advanced ATS scoring',
            'Premium templates',
            'Unlimited PDF downloads',
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-[#475569]">
              <span className="text-[#22C55E]">✓</span> {feature}
            </li>
          ))}
        </ul>

        <p className="text-xs text-[#94A3B8]">
          🔒 Secure checkout powered by Paddle. Sandbox mode — use test card 4242 4242 4242 4242.
        </p>

        <div className="flex items-center gap-3 justify-end pt-1">
          <Button variant="ghost" onClick={onClose} disabled={processing}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={processing || !paddle}>
            {processing ? 'Opening checkout...' : !paddle ? 'Loading...' : 'Continue to Payment'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}