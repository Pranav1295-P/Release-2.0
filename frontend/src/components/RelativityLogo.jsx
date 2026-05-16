import { useState } from 'react'

/**
 * The Relativity OpenSource / Core Committee mark.
 *
 * Uses /public/relativity-logo.png if you drop one in (cropped from the
 * Core Committee image). Falls back to an inline 8-point star SVG that
 * approximates the same shape, in case the file is missing.
 */
export default function RelativityLogo({ size = 96, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (!failed) {
    return (
      <img
        src="/relativity-logo.png"
        alt="Relativity OpenSource"
        width={size}
        height={size}
        onError={() => setFailed(true)}
        className={`block object-contain ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }

  // Fallback — inline 8-point star (matches the Core Committee mark)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={`block ${className}`}
      aria-label="Relativity OpenSource"
    >
      <path
        fill="#ffffff"
        d="M50 4
           L60 30
           L86 14
           L70 40
           L96 50
           L70 60
           L86 86
           L60 70
           L50 96
           L40 70
           L14 86
           L30 60
           L4 50
           L30 40
           L14 14
           L40 30
           Z"
      />
    </svg>
  )
}
