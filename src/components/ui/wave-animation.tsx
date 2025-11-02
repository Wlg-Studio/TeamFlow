interface WaveAnimationProps {
  duration?: number
  className?: string
  color?: 'gradient' | 'white'
}

export function WaveAnimation({
  duration = 500,
  className = "",
  color = 'gradient'
}: WaveAnimationProps) {
  const bgClass = color === 'white'
    ? 'bg-white'
    : 'bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#8b5cf6]'

  return (
    <span
      className={`absolute inset-0 -translate-x-full ${bgClass} transition-transform ease-out group-hover:translate-x-0 ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
    />
  )
}
