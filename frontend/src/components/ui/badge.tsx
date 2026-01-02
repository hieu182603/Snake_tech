import React from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'warning' | 'info' | 'success' | 'danger' | 'primary' | 'neutral'
  size?: 'sm' | 'default' | 'lg'
  dot?: boolean
  children: React.ReactNode
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'default',
  dot = false,
  children,
  className = '',
  ...props
}) => {
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'border border-border text-foreground hover:bg-muted',
    warning: 'bg-yellow-500 text-yellow-50 hover:bg-yellow-600',
    info: 'bg-blue-500 text-blue-50 hover:bg-blue-600',
    success: 'bg-green-500 text-green-50 hover:bg-green-600',
    danger: 'bg-red-500 text-red-50 hover:bg-red-600',
    primary: "bg-red-600/10 text-red-500 border-red-600/20",
    neutral: "bg-slate-500/10 text-slate-400 border-slate-500/20"
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    default: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {dot && <span className="h-1 w-1 rounded-full bg-current"></span>}
      {children}
    </span>
  )
}

export { Badge }