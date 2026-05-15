import { BadgeCheck } from 'lucide-react'

/**
 * Renders a verified tick next to a username.
 *
 * Pass the populated `author` object (or any object with verifiedType /
 * verifiedUntil). Gold never expires; blue is only shown while
 * verifiedUntil is still in the future.
 *
 *   <VerifiedBadge user={post.author} />
 */
export default function VerifiedBadge({ user, size = 14, className = '' }) {
  if (!user) return null

  let type = user.verifiedType || null
  // Blue ticks expire — only show if still within the paid period.
  if (type === 'blue') {
    const until = user.verifiedUntil ? new Date(user.verifiedUntil).getTime() : 0
    if (until <= Date.now()) type = null
  }
  if (!type) return null

  const isGold = type === 'gold'
  const color = isGold ? '#f5c542' : '#4f6fff'
  const label = isGold ? 'Verified — official account' : 'Verified — subscriber'

  return (
    <span
      title={label}
      aria-label={label}
      className={`inline-flex items-center align-middle ${className}`}
    >
      <BadgeCheck
        size={size}
        strokeWidth={2.5}
        style={{ color }}
        fill={isGold ? 'rgba(245,197,66,0.15)' : 'rgba(79,111,255,0.15)'}
      />
    </span>
  )
}
