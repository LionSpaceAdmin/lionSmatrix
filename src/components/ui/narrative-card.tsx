import { cn } from "@/lib/utils"
import * as React from "react"

export function NarrativeCard({ className, children }: { className?: string, children?: React.ReactNode }) {
  return <div className={cn("p-4 border rounded-lg", className)}>
    <h2>Narrative Card</h2>
    {children}
  </div>;
}
