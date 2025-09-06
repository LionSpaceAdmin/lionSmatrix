/**
 * Terminal UI Component System Types
 * Unified type definitions for TailwindUI-based terminal components
 */

import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from 'react'

// Terminal color variants
export type TerminalColor = 'cyan' | 'gold' | 'green' | 'red' | 'white' | 'muted'

// Terminal component sizes
export type TerminalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// Terminal component variants
export type TerminalVariant = 'solid' | 'outline' | 'ghost' | 'glow' | 'pulse'

// Status types for terminal components
export type TerminalStatus = 'online' | 'offline' | 'warning' | 'error' | 'processing'

// Priority levels for terminal components
export type TerminalPriority = 'low' | 'medium' | 'high' | 'critical'

// Base terminal component props (without extending HTMLAttributes to avoid conflicts)
export interface TerminalComponentProps {
  variant?: TerminalVariant
  size?: TerminalSize
  color?: TerminalColor
  animate?: boolean
  glow?: boolean
  scanline?: boolean
}

// Terminal button props
export interface TerminalButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>, TerminalComponentProps {
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

// Terminal input props
export interface TerminalInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'color' | 'size'>, TerminalComponentProps {
  label?: string
  error?: string
  helper?: string
  icon?: ReactNode
  showCursor?: boolean
}

// Terminal card props
export interface TerminalCardProps extends TerminalComponentProps {
  title?: string
  subtitle?: string
  header?: ReactNode
  footer?: ReactNode
  bordered?: boolean
  elevated?: boolean
  children?: ReactNode
  className?: string
}

// Terminal alert props
export interface TerminalAlertProps extends TerminalComponentProps {
  title: string
  description?: string
  icon?: ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  status?: TerminalStatus
  className?: string
}

// Terminal badge props
export interface TerminalBadgeProps extends TerminalComponentProps {
  label: string
  dot?: boolean
  pulse?: boolean
  status?: TerminalStatus
  className?: string
}

// Terminal navigation props
export interface TerminalNavItem {
  id: string
  label: string
  href?: string
  icon?: ReactNode
  badge?: string | number
  active?: boolean
  disabled?: boolean
  children?: TerminalNavItem[]
}

// Terminal form field props
export interface TerminalFieldProps {
  name: string
  label?: string
  required?: boolean
  disabled?: boolean
  error?: string
  helper?: string
}

// Terminal modal props
export interface TerminalModalProps extends TerminalComponentProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  footer?: ReactNode
  closeOnOverlay?: boolean
  closeOnEscape?: boolean
  children?: ReactNode
  className?: string
}

// Terminal table props
export interface TerminalTableColumn<T = unknown> {
  id: string
  header: string
  accessor: keyof T | ((row: T) => unknown)
  sortable?: boolean
  width?: string | number
  align?: 'left' | 'center' | 'right'
  render?: (value: unknown, row: T) => ReactNode
}

export interface TerminalTableProps<T = unknown> extends TerminalComponentProps {
  data: T[]
  columns: TerminalTableColumn<T>[]
  loading?: boolean
  empty?: ReactNode
  onRowClick?: (row: T) => void
  selectable?: boolean
  selectedRows?: T[]
  onSelectionChange?: (rows: T[]) => void
}

// Terminal toast notification props
export interface TerminalToastProps extends TerminalAlertProps {
  duration?: number
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
}

// Terminal metric card props
export interface TerminalMetricProps extends TerminalCardProps {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

// Terminal progress props
export interface TerminalProgressProps extends TerminalComponentProps {
  value: number
  max?: number
  label?: string
  showValue?: boolean
  indeterminate?: boolean
}

// Terminal skeleton props
export interface TerminalSkeletonProps extends TerminalComponentProps {
  width?: string | number
  height?: string | number
  rounded?: boolean
  lines?: number
}