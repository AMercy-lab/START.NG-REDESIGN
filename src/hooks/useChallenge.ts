import { useEffect, useState } from 'react'
import { SNAPSHOT_CHALLENGE, type Challenge } from '../data/games'

type State = { challenge: Challenge | null; live: boolean }

// Same pattern as useTournament: the build-time snapshot first, then today's
// challenge from /sng/spotlight. If that fails, the snapshot stays and is marked as such.
export function useChallenge(): State {
  const [state, setState] = useState<State>({ challenge: SNAPSHOT_CHALLENGE, live: false })

  useEffect(() => {
    const ctrl = new AbortController()
    fetch('/sng/spotlight', { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((s) => {
        const c = s?.challenge
        if (!c?.game) return
        setState({
          live: true,
          challenge: {
            day: c.day,
            game: c.game,
            title: c.game_title,
            cover_url: c.cover_url ?? null,
            stat: c.stat,
            goal: c.goal_shown ?? String(c.goal),
            ceiling: !!c.goal_is_a_ceiling,
            ends_at: c.ends_at,
          },
        })
      })
      .catch(() => {})
    return () => ctrl.abort()
  }, [])

  return state
}
