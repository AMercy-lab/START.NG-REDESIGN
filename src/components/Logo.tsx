// start.ng's mark (from its favicon.svg) and wordmark.
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#d8fd71" />
      <path
        className="logo-play"
        d="M26 19.5v25c0 1.6 1.7 2.5 3 1.7l19.5-12.5c1.2-.8 1.2-2.6 0-3.4L29 17.8c-1.3-.8-3 .1-3 1.7z"
        fill="#292a23"
      />
    </svg>
  )
}

export function Logo() {
  return (
    <span className="logo">
      <LogoMark />
      <span className="logo-word">
        start<span className="logo-tld">.ng</span>
      </span>
    </span>
  )
}
