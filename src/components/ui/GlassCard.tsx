import { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  gradient?: boolean
}

export function GlassCard({ className, gradient, children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass-card p-4',
        gradient && 'bg-gradient-to-b from-white/5 to-white/[0.02]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
