"use client"

import { useState, useEffect } from "react"
import { getMatchingDiscordUsers, syncDiscordUser } from "../actions/discord-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RefreshCw, ArrowLeft, Settings } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { isDiscordConfigured } from "@/lib/discord"
import { isSupabaseConfigured } from "@/lib/supabase"

interface DiscordUser {
  discord_id: string
  discord_name: string
}

export default function DiscordPage() {
  const [users, setUsers] = useState<DiscordUser[]>([])
  const [loading, setLoading] = useState(true)
  const [syncingId, setSyncingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getMatchingDiscordUsers()
      setUsers(data)
    } catch (error) {
      console.error("Error loading Discord users:", error)
      setError(error instanceof Error ? error.message : "Failed to load Discord users")
      toast({
        title: "Error",
        description: "Failed to load Discord users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async (discordId: string) => {
    setSyncingId(discordId)
    try {
      const result = await syncDiscordUser(discordId)

      if (result.success) {
        toast({
          title: "Success",
          description: "Discord user data synced successfully",
        })
        // Refresh the user list
        loadUsers()
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
      setSyncingId(null)
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Discord Integration</h1>
      </div>

      {!isSupabaseConfigured() && (
        <Alert variant="warning">
          <AlertTitle>Database Not Configured</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              Supabase is not configured. You are viewing mock data. Add the{" "}
              <code className="bg-muted-foreground/20 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="bg-muted-foreground/20 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> environment
              variables to connect to your database.
            </p>
            <Button asChild size="sm" variant="outline">
              <Link href="/setup/environment">
                <Settings className="mr-2 h-4 w-4" />
                Configure Environment
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!isDiscordConfigured() && (
        <Alert variant="destructive">
          <AlertTitle>Discord API Not Configured</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              Discord token is missing. Discord integration features will not work properly. Add the{" "}
              <code className="bg-muted-foreground/20 px-1 rounded">DISCORD_TOKEN</code> environment variable to enable
              Discord integration.
            </p>
            <Button asChild size="sm" variant="outline">
              <Link href="/setup/environment">
                <Settings className="mr-2 h-4 w-4" />
                Configure Environment
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Discord Users</CardTitle>
          <CardDescription>
            Manage Discord users linked to your database. Sync to update Discord usernames.
            {!isSupabaseConfigured() && " (Mock Data)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No Discord users found in your database.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Discord ID</TableHead>
                  <TableHead>Discord Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.discord_id}>
                    <TableCell>{user.discord_id}</TableCell>
                    <TableCell>{user.discord_name || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(user.discord_id)}
                        disabled={syncingId === user.discord_id || !isDiscordConfigured() || !isSupabaseConfigured()}
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${syncingId === user.discord_id ? "animate-spin" : ""}`} />
                        Sync
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={loadUsers} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
