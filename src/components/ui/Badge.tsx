import { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-purple-500 text-white',
        outline:
          'border-white/10 text-white hover:bg-white/5',
        success:
          'border-transparent bg-green-500 text-white',
        warning:
          'border-transparent bg-yellow-500 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}
