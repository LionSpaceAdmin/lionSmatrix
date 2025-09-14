'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { ScreenReaderOnly } from './ScreenReaderOnly'

interface AccessibleInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helpText?: string
  hideLabel?: boolean
  required?: boolean
}

export const AccessibleInput = React.forwardRef<
  HTMLInputElement,
  AccessibleInputProps
>(({
  className,
  label,
  error,
  helpText,
  hideLabel = false,
  required = false,
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`
  const errorId = `${inputId}-error`
  const helpId = `${inputId}-help`

  return (
    <div className="mb-4">
      <label
        htmlFor={inputId}
        className={cn(
          'block text-sm font-medium text-gray-700 mb-1',
          hideLabel && 'sr-only'
        )}
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">*</span>
        )}
      </label>
      
      <input
        ref={ref}
        id={inputId}
        type={type}
        className={cn(
          'block w-full rounded-md border-gray-300',
          'px-3 py-2 text-gray-900',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={
          [error && errorId, helpText && helpId].filter(Boolean).join(' ') || undefined
        }
        aria-required={required}
        {...props}
      />
      
      {helpText && !error && (
        <p id={helpId} className="mt-1 text-sm text-gray-600">
          {helpText}
        </p>
      )}
      
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})

AccessibleInput.displayName = 'AccessibleInput'

// Accessible Select Component
interface AccessibleSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: Array<{ value: string; label: string }>
  error?: string
  helpText?: string
  hideLabel?: boolean
}

export const AccessibleSelect = React.forwardRef<
  HTMLSelectElement,
  AccessibleSelectProps
>(({
  className,
  label,
  options,
  error,
  helpText,
  hideLabel = false,
  required = false,
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`
  const errorId = `${selectId}-error`
  const helpId = `${selectId}-help`

  return (
    <div className="mb-4">
      <label
        htmlFor={selectId}
        className={cn(
          'block text-sm font-medium text-gray-700 mb-1',
          hideLabel && 'sr-only'
        )}
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">*</span>
        )}
      </label>
      
      <select
        ref={ref}
        id={selectId}
        className={cn(
          'block w-full rounded-md border-gray-300',
          'px-3 py-2 text-gray-900',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={
          [error && errorId, helpText && helpId].filter(Boolean).join(' ') || undefined
        }
        aria-required={required}
        {...props}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {helpText && !error && (
        <p id={helpId} className="mt-1 text-sm text-gray-600">
          {helpText}
        </p>
      )}
      
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})

AccessibleSelect.displayName = 'AccessibleSelect'

// Accessible Checkbox Component
interface AccessibleCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helpText?: string
}

export const AccessibleCheckbox = React.forwardRef<
  HTMLInputElement,
  AccessibleCheckboxProps
>(({
  className,
  label,
  error,
  helpText,
  id,
  ...props
}, ref) => {
  const checkboxId = id || `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}`
  const errorId = `${checkboxId}-error`
  const helpId = `${checkboxId}-help`

  return (
    <div className="mb-4">
      <div className="flex items-start">
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          className={cn(
            'mt-1 h-4 w-4 rounded border-gray-300',
            'text-primary-600 focus:ring-primary-500',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={
            [error && errorId, helpText && helpId].filter(Boolean).join(' ') || undefined
          }
          {...props}
        />
        <label
          htmlFor={checkboxId}
          className="ml-2 block text-sm text-gray-900"
        >
          {label}
        </label>
      </div>
      
      {helpText && !error && (
        <p id={helpId} className="mt-1 ml-6 text-sm text-gray-600">
          {helpText}
        </p>
      )}
      
      {error && (
        <p id={errorId} className="mt-1 ml-6 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})

AccessibleCheckbox.displayName = 'AccessibleCheckbox'

// Form Fieldset for grouping related fields
interface AccessibleFieldsetProps {
  legend: string
  children: React.ReactNode
  error?: string
  required?: boolean
}

export function AccessibleFieldset({
  legend,
  children,
  error,
  required,
}: AccessibleFieldsetProps) {
  return (
    <fieldset className="mb-6 border border-gray-300 rounded-md p-4">
      <legend className="text-base font-medium text-gray-900 px-2">
        {legend}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">*</span>
        )}
      </legend>
      {children}
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  )
}