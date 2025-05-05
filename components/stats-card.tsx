import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  subValue?: string
  className?: string
}

export function StatsCard({ title, value, icon: Icon, subValue, className }: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6 flex items-center gap-4">
        <div className="bg-muted/20 p-3 rounded-full">
          <Icon className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold">{value}</h2>
            {subValue && (
              <span className={cn("text-xs", subValue.startsWith("+") ? "text-green-500" : "text-red-500")}>
                {subValue}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
