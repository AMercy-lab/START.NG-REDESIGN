import { useEffect, useState } from 'react'
import { SNAPSHOT_TOURNAMENT, type Tournament } from '../data/games'

type State = { tournament: Tournament; live: boolean }

// Starts from the build-time snapshot, then swaps in today's live tournament
// through the /sng proxy. If that fails, the snapshot stays and is marked as such.
export function useTournament(): State {
  const [state, setState] = useState<State>({ tournament: SNAPSHOT_TOURNAMENT, live: false })

  useEffect(() => {
    const ctrl = new AbortController()
    fetch('/sng/tournaments/current', { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((t) => {
        if (!Array.isArray(t?.games) || !t.games.length) return
        setState({
          live: true,
          tournament: {
            starts_at: t.starts_at,
            ends_at: t.ends_at,
            entrants: t.entrants ?? 0,
            games: t.games.map((g: { name: string; url: string; cover_url?: string; leaderboard?: { label: string }[] }) => ({
              name: g.name,
              url: g.url,
              cover_url: g.cover_url ?? null,
              stats: (g.leaderboard ?? []).map((s) => s.label),
            })),
          },
        })
      })
      .catch(() => {})
    return () => ctrl.abort()
  }, [])

  return state
}
