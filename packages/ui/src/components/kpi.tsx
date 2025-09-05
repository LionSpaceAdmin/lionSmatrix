import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { cn } from "../lib/utils"

interface KpiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
}

const KpiCard = React.forwardRef<HTMLDivElement, KpiCardProps>(
  ({ className, title, value, change, trend = 'neutral', ...props }, ref) => (
    <Card ref={ref} className={cn("", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={cn(
            "text-xs",
            trend === 'up' && "text-green-600",
            trend === 'down' && "text-red-600",
            trend === 'neutral' && "text-muted-foreground"
          )}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  )
)
KpiCard.displayName = "KpiCard"

const GridShell = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("grid gap-4", className)}
    {...props}
  />
))
GridShell.displayName = "GridShell"

const GridItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
GridItem.displayName = "GridItem"

export { KpiCard, GridShell, GridItem }
