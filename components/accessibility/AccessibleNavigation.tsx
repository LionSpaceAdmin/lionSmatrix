'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
  badge?: string | number
  children?: NavItem[]
}

interface AccessibleNavigationProps {
  items: NavItem[]
  orientation?: 'horizontal' | 'vertical'
  ariaLabel?: string
}

export function AccessibleNavigation({
  items,
  orientation = 'horizontal',
  ariaLabel = 'Main navigation',
}: AccessibleNavigationProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set())

  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(href)) {
        next.delete(href)
      } else {
        next.add(href)
      }
      return next
    })
  }

  const renderNavItem = (item: NavItem, index: number) => {
    const isActive = pathname === item.href
    const isExpanded = expandedItems.has(item.href)
    const hasChildren = item.children && item.children.length > 0

    return (
      <li key={item.href} className="relative">
        {hasChildren ? (
          <button
            className={cn(
              'flex items-center w-full px-3 py-2 text-sm font-medium rounded-md',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              isActive
                ? 'bg-primary-100 text-primary-900'
                : 'text-gray-700 hover:bg-gray-100'
            )}
            onClick={() => toggleExpanded(item.href)}
            aria-expanded={isExpanded}
            aria-controls={`submenu-${index}`}
          >
            {item.icon && (
              <span className="mr-2" aria-hidden="true">
                {item.icon}
              </span>
            )}
            {item.label}
            {item.badge && (
              <span
                className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                aria-label={`${item.badge} new items`}
              >
                {item.badge}
              </span>
            )}
            <svg
              className={cn(
                'ml-2 h-4 w-4 transition-transform',
                isExpanded && 'rotate-180'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        ) : (
          <a
            href={item.href}
            className={cn(
              'flex items-center px-3 py-2 text-sm font-medium rounded-md',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              isActive
                ? 'bg-primary-100 text-primary-900'
                : 'text-gray-700 hover:bg-gray-100'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.icon && (
              <span className="mr-2" aria-hidden="true">
                {item.icon}
              </span>
            )}
            {item.label}
            {item.badge && (
              <span
                className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                aria-label={`${item.badge} new items`}
              >
                {item.badge}
              </span>
            )}
          </a>
        )}

        {hasChildren && isExpanded && (
          <ul
            id={`submenu-${index}`}
            className="mt-2 ml-4 space-y-1"
            role="group"
            aria-label={`${item.label} submenu`}
          >
            {item.children?.map((child, childIndex) => (
              <li key={child.href}>
                <a
                  href={child.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm rounded-md',
                    'transition-colors duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500',
                    pathname === child.href
                      ? 'bg-primary-50 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                  aria-current={pathname === child.href ? 'page' : undefined}
                >
                  {child.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <nav aria-label={ariaLabel} id="main-navigation">
      <ul
        className={cn(
          orientation === 'horizontal'
            ? 'flex space-x-1'
            : 'space-y-1'
        )}
      >
        {items.map((item, index) => renderNavItem(item, index))}
      </ul>
    </nav>
  )
}

// Breadcrumb Navigation
interface BreadcrumbItem {
  label: string
  href?: string
}

interface AccessibleBreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function AccessibleBreadcrumbs({ items }: AccessibleBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="mx-2 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-1"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={cn(
                    'px-1',
                    isLast ? 'text-gray-900 font-medium' : 'text-gray-500'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}