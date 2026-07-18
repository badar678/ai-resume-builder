import { useEffect, useState } from 'react'
import { initializePaddle } from '@paddle/paddle-js'

// Paddle.js can only be initialized ONCE per page, so the actual
// initializePaddle() call is a module-level singleton. Components pass
// their own onEvent handler, which we forward through a reassignable
// global hook -- this lets multiple components use Paddle checkout
// over time without re-initializing (which would throw).
let paddlePromise = null

function getPaddleInstance() {
  if (!paddlePromise) {
    paddlePromise = initializePaddle({
      environment: import.meta.env.VITE_PADDLE_ENV || 'sandbox',
      token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
      eventCallback: (event) => {
        if (typeof window.__paddleEventHandler === 'function') {
          window.__paddleEventHandler(event)
        }
      },
    })
  }
  return paddlePromise
}

export default function usePaddle(onEvent) {
  const [paddle, setPaddle] = useState(null)

  useEffect(() => {
    getPaddleInstance().then((instance) => {
      if (instance) setPaddle(instance)
    })
  }, [])

  useEffect(() => {
    window.__paddleEventHandler = onEvent
    return () => {
      window.__paddleEventHandler = null
    }
  }, [onEvent])

  return paddle
}