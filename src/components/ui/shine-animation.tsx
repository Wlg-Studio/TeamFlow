interface ShineAnimationProps {
  duration?: number
  className?: string
}

export function ShineAnimation({
  duration = 700,
  className = ""
}: ShineAnimationProps) {
  return (
    <span
      className={`absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform ease-out group-hover:translate-x-full ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
    />
  )
}
