import { hostOf, titleOf, type CardFx as FxKind } from '../data/games'
import { usePointerLean } from '../hooks/usePointerLean'
import { CardFx } from './CardFx'

// One card for every game grid: cover, title, creator and address.
export function GameCard({
  href,
  name,
  title = titleOf(name),
  by,
  url,
  cover,
  description,
  badge,
  fx,
}: {
  href: string
  name: string
  title?: string
  by: string | null
  url: string
  cover: string | null
  description?: string | null
  badge?: string
  fx?: FxKind
}) {
  const lean = usePointerLean()
  return (
    <li className="gc">
      <a className="gc-link" href={href} {...lean}>
        <span className="gc-art">
          {cover ? (
            <img src={cover} alt="" loading="lazy" decoding="async" width={1600} height={1000} />
          ) : (
            <span className="gc-fallback" aria-hidden="true">
              {title.charAt(0)}
            </span>
          )}
          {badge && <span className="gc-badge">{badge}</span>}
          {fx && <CardFx kind={fx} />}
        </span>
        <span className="gc-info">
          <span className="gc-title">{title}</span>
          <span className="gc-by">by {by ?? 'a creator'}</span>
          {description && <span className="gc-desc">{description}</span>}
          <span className="gc-host">{hostOf(url)}</span>
        </span>
      </a>
    </li>
  )
}
