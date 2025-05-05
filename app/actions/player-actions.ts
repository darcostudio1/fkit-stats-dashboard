"use server"

import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { config } from "@/lib/config"
import type { PlayerData, PlayerStats } from "@/types/player"

// Mock data for when Supabase is not configured
const mockPlayers: PlayerData[] = [
  {
    id: "mock-1",
    discord_id: "123456789012345678",
    alliance: "Mock Alliance",
    keep_name: "Mock Keep",
    troop_level: "T12",
    keep_level: 30,
    march_size: "400K",
    dragon_level: 10,
    house_level: 30,
    rally_cap: "1.2M",
    reinforcement_capacity_vs_sop: "800K",
    troop_type: "Infantry",
    marcher_attack_vs_player_sop: "300%",
    marcher_defense_vs_player_sop: "250%",
    marcher_health_vs_player_sop: "280%",
    adh_attack_vs_player_sop: "300%",
    adh_defense_vs_player_sop: "250%",
    adh_health_vs_player_sop: "280%",
    last_updated: new Date().toISOString(),
    discord_name: "Mock User",
  },
  {
    id: "mock-2",
    discord_id: "223456789012345678",
    alliance: "Demo Alliance",
    keep_name: "Demo Keep",
    troop_level: "T11",
    keep_level: 28,
    march_size: "350K",
    dragon_level: 9,
    house_level: 28,
    rally_cap: "1M",
    reinforcement_capacity_vs_sop: "700K",
    troop_type: "Cavalry",
    marcher_attack_vs_player_sop: "280%",
    marcher_defense_vs_player_sop: "230%",
    marcher_health_vs_player_sop: "260%",
    adh_attack_vs_player_sop: "280%",
    adh_defense_vs_player_sop: "230%",
    adh_health_vs_player_sop: "260%",
    last_updated: new Date().toISOString(),
    discord_name: "Demo User",
  },
]

export async function getPlayers({
  page = 1,
  pageSize = 10,
  sortBy = "last_updated",
  sortOrder = "desc",
  searchQuery = "",
  tableName = null,
}: {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
  searchQuery?: string
  tableName?: string | null
}) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.log("Supabase not configured, returning mock data")

      // Filter mock data based on search query if provided
      let filteredData = [...mockPlayers]
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filteredData = filteredData.filter(
          (player) =>
            player.discord_name?.toLowerCase().includes(query) ||
            player.keep_name?.toLowerCase().includes(query) ||
            player.alliance?.toLowerCase().includes(query),
        )
      }

      // Sort the data
      filteredData.sort((a, b) => {
        const aValue = a[sortBy as keyof PlayerData]
        const bValue = b[sortBy as keyof PlayerData]

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }

        // For numbers and other types
        return sortOrder === "asc" ? (aValue > bValue ? 1 : -1) : bValue > aValue ? 1 : -1
      })

      // Calculate pagination
      const totalCount = filteredData.length
      const totalPages = Math.ceil(totalCount / pageSize)
      const startIndex = (page - 1) * pageSize
      const paginatedData = filteredData.slice(startIndex, startIndex + pageSize)

      return {
        players: paginatedData,
        totalCount,
        page,
        pageSize,
        totalPages,
        tableName: "mock_data",
      }
    }

    // Use the correct table name from config or parameter
    const tableToUse = tableName || config.tableName

    // Calculate the range for pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    // Build the query
    let query = supabase.from(tableToUse).select("*", { count: "exact" })

    // Add search functionality if a query is provided
    if (searchQuery) {
      // Create a dynamic OR condition for searching across multiple columns
      query = query.or(
        `discord_name.ilike.%${searchQuery}%,keep_name.ilike.%${searchQuery}%,alliance.ilike.%${searchQuery}%`,
      )
    }

    // Add sorting and pagination
    const { data, error, count } = await query.order(sortBy, { ascending: sortOrder === "asc" }).range(from, to)

    if (error) throw error

    return {
      players: data as PlayerData[],
      totalCount: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
      tableName: tableToUse,
    }
  } catch (error) {
    console.error("Error fetching players:", error)
    throw error
  }
}

export async function getPlayerStats(tableName?: string | null): Promise<PlayerStats> {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.log("Supabase not configured, returning mock stats")
      return {
        total_players: mockPlayers.length,
        players_today: mockPlayers.length,
        alliances: new Set(mockPlayers.map((p) => p.alliance)).size,
        growth_percentage: 5.2,
        tableName: "mock_data",
      }
    }

    // Use the correct table name from config
    const tableToUse = tableName || config.tableName

    // Get total players
    const { count: totalPlayers } = await supabase.from(tableToUse).select("*", { count: "exact", head: true })

    // Get unique alliances count
    let alliancesCount = 0
    try {
      const { data: alliancesData } = await supabase.from(tableToUse).select("alliance")
      if (alliancesData && alliancesData.length > 0) {
        const uniqueAlliances = new Set(alliancesData.map((item) => item.alliance).filter(Boolean))
        alliancesCount = uniqueAlliances.size
      }
    } catch (error) {
      console.log("Error counting alliances:", error)
    }

    // Get players who joined today
    let playersToday = 0
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const { count: todayCount } = await supabase
        .from(tableToUse)
        .select("*", { count: "exact", head: true })
        .gte("last_updated", today.toISOString())

      playersToday = todayCount || 0
    } catch (error) {
      console.log("Error counting today's players:", error)
    }

    // Get player count from last month for growth calculation
    let growthPercentage = 0
    try {
      const lastMonth = new Date()
      lastMonth.setMonth(lastMonth.getMonth() - 1)
      const { count: lastMonthPlayers } = await supabase
        .from(tableToUse)
        .select("*", { count: "exact", head: true })
        .lte("last_updated", lastMonth.toISOString())

      // Calculate growth percentage
      if (lastMonthPlayers) {
        growthPercentage = ((totalPlayers! - lastMonthPlayers) / lastMonthPlayers) * 100
      }
    } catch (error) {
      console.log("Error calculating growth:", error)
    }

    return {
      total_players: totalPlayers || 0,
      players_today: playersToday,
      alliances: alliancesCount,
      growth_percentage: Number.parseFloat(growthPercentage.toFixed(1)),
      tableName: tableToUse,
    }
  } catch (error) {
    console.error("Error fetching player stats:", error)
    // Return mock data on error
    return {
      total_players: mockPlayers.length,
      players_today: mockPlayers.length,
      alliances: new Set(mockPlayers.map((p) => p.alliance)).size,
      growth_percentage: 5.2,
      tableName: "mock_data (error fallback)",
    }
  }
}
