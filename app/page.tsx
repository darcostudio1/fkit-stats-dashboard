"use client"

import { useEffect, useState } from "react"
import { getPlayers, getPlayerStats } from "./actions/player-actions"
import { DataTable } from "@/components/data-table"
import { StatsCard } from "@/components/stats-card"
import type { PlayerData, PlayerStats } from "@/types/player"
import { Users, Castle, Shield, Activity, Settings, MessageSquare } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { isSupabaseConfigured } from "@/lib/supabase"
import { isDiscordConfigured } from "@/lib/discord"

export default function PlayersPage() {
  const [players, setPlayers] = useState<PlayerData[]>([])
  const [stats, setStats] = useState<PlayerStats>({
    total_players: 0,
    players_today: 0,
    alliances: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tableName, setTableName] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState("last_updated")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [searchQuery, setSearchQuery] = useState("")
  const [showDiscordWarning, setShowDiscordWarning] = useState(!isDiscordConfigured())
  const [showSupabaseWarning, setShowSupabaseWarning] = useState(!isSupabaseConfigured())

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(null)
      try {
        const [playersData, statsData] = await Promise.all([
          getPlayers({ page, pageSize, sortBy, sortOrder, searchQuery, tableName }),
          getPlayerStats(tableName),
        ])

        setPlayers(playersData.players)
        setTotalCount(playersData.totalCount)
        setTotalPages(playersData.totalPages)
        setStats(statsData)
        setTableName(playersData.tableName || statsData.tableName)
      } catch (error) {
        console.error("Error loading data:", error)
        setError(error instanceof Error ? error.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [page, pageSize, sortBy, sortOrder, searchQuery, tableName])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(1)
  }

  const handleSort = (column: string, order: "asc" | "desc") => {
    setSortBy(column)
    setSortOrder(order)
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <Alert variant="destructive">
          <AlertTitle>Error Loading Data</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>{error}</p>
            <div className="flex gap-4 pt-2">
              <Button asChild>
                <Link href="/setup">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure Table
                </Link>
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {showSupabaseWarning && (
        <Alert variant="warning" className="mb-4">
          <AlertTitle>Database Not Configured</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              Supabase is not configured. You are viewing mock data. Add the{" "}
              <code className="bg-muted-foreground/20 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="bg-muted-foreground/20 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> environment
              variables to connect to your database.
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/setup/environment">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure Environment
                </Link>
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowSupabaseWarning(false)}>
                Dismiss
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {showDiscordWarning && (
        <Alert variant="warning" className="mb-4">
          <AlertTitle>Discord Integration Not Configured</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              Discord token is missing. Discord-related features will be limited. Add the{" "}
              <code className="bg-muted-foreground/20 px-1 rounded">DISCORD_TOKEN</code> environment variable to enable
              full Discord integration.
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/setup/environment">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure Environment
                </Link>
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowDiscordWarning(false)}>
                Dismiss
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Player Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and view all player data from your Discord bot
            {tableName && (
              <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                Table: {tableName}
                {!isSupabaseConfigured() && " (Mock Data)"}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/discord">
              <MessageSquare className="mr-2 h-4 w-4" />
              Discord
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/setup">
              <Settings className="mr-2 h-4 w-4" />
              Configure
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Players"
          value={stats.total_players.toLocaleString()}
          icon={Users}
          subValue={stats.growth_percentage ? `+${stats.growth_percentage}% from last month` : undefined}
        />
        <StatsCard title="Players Today" value={stats.players_today.toLocaleString()} icon={Activity} />
        <StatsCard title="Alliances" value={stats.alliances.toLocaleString()} icon={Shield} />
        <StatsCard
          title="Avg Keep Level"
          value={
            players.length > 0 && players.some((p) => p.keep_level !== undefined)
              ? (
                  players.reduce((sum, player) => sum + (player.keep_level || 0), 0) /
                  players.filter((p) => p.keep_level !== undefined).length
                ).toFixed(1)
              : "N/A"
          }
          icon={Castle}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DataTable
          data={players}
          totalCount={totalCount}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      )}
    </div>
  )
}
