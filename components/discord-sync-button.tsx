"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { syncDiscordUser } from "@/app/actions/discord-actions"
import { useToast } from "@/hooks/use-toast"

interface DiscordSyncButtonProps {
  discordId?: string
}

export function DiscordSyncButton({ discordId }: DiscordSyncButtonProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSync = async () => {
    if (!discordId) {
      toast({
        title: "Error",
        description: "No Discord ID provided",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const result = await syncDiscordUser(discordId)

      if (result.success) {
        toast({
          title: "Success",
          description: "Discord user data synced successfully",
        })
      } else {
        toast({
          title: "Warning",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sync Discord user",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleSync} disabled={loading || !discordId}>
      <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
      Sync Discord
    </Button>
  )
}
