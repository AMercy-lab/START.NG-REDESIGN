import { useEffect, useState } from 'react'

// Minutes left until `iso`, refreshed every 30s. null once it has passed.
export function useCountdown(iso: string) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(id)
  }, [])
  const ms = new Date(iso).getTime() - now
  if (!(ms > 0)) return null
  const mins = Math.floor(ms / 60_000)
  return { h: Math.floor(mins / 60), m: mins % 60 }
}

export const hoursBetween = (a: string, b: string) =>
  Math.round((new Date(b).getTime() - new Date(a).getTime()) / 3_600_000)
