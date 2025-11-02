interface ShineAnimationProps {
  duration?: number
  className?: string
  opacity?: number
}

export function ShineAnimation({
  duration = 700,
  className = "",
  opacity = 30
}: ShineAnimationProps) {
  return (
    <span
      className={`absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/${opacity} to-transparent transition-transform ease-out group-hover:translate-x-full ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
    />
  )
}
