"use server"

import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { getDiscordUser, isDiscordConfigured } from "@/lib/discord"
import { config } from "@/lib/config"

// Mock Discord users for when Supabase is not configured
const mockDiscordUsers = [
  {
    discord_id: "123456789012345678",
    discord_name: "MockUser#1234",
  },
  {
    discord_id: "223456789012345678",
    discord_name: "DemoUser#5678",
  },
  {
    discord_id: "323456789012345678",
    discord_name: "TestUser#9012",
  },
]

// Function to sync a Discord user with our database
export async function syncDiscordUser(discordId: string) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        message: "Supabase is not configured. Using mock data.",
        user: {
          id: discordId,
          username: "Mock Discord User",
          discriminator: "0000",
          avatar: null,
        },
      }
    }

    // Check if Discord is configured
    if (!isDiscordConfigured()) {
      return {
        success: false,
        message: "Discord API is not configured. Please add the DISCORD_TOKEN environment variable.",
        user: null,
      }
    }

    // Get the user from Discord API
    const discordUser = await getDiscordUser(discordId)

    if (!discordUser) {
      throw new Error(`Discord user with ID ${discordId} not found`)
    }

    // Check if the user exists in our database
    const { data: existingUser, error: queryError } = await supabase
      .from(config.tableName)
      .select("*")
      .eq("discord_id", discordId)
      .single()

    if (queryError && queryError.code !== "PGRST116") {
      // PGRST116 is "no rows returned"
      throw queryError
    }

    // Update the Discord name if the user exists
    if (existingUser) {
      const { error: updateError } = await supabase
        .from(config.tableName)
        .update({
          discord_name: discordUser.username,
          last_updated: new Date().toISOString(),
        })
        .eq("discord_id", discordId)

      if (updateError) throw updateError

      return { success: true, message: "Discord user updated", user: discordUser }
    }

    // Otherwise, this is a new user we don't have in our database yet
    return {
      success: false,
      message: "Discord user not found in database",
      user: discordUser,
    }
  } catch (error) {
    console.error("Error syncing Discord user:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      user: null,
    }
  }
}

// Function to get all Discord users that match our database
export async function getMatchingDiscordUsers() {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.log("Supabase not configured, returning mock Discord users")
      return mockDiscordUsers
    }

    // Get all discord_ids from our database
    const { data, error } = await supabase
      .from(config.tableName)
      .select("discord_id, discord_name")
      .filter("discord_id", "not.is", null)

    if (error) throw error

    // Filter out any null values and return
    return data.filter((item) => item.discord_id)
  } catch (error) {
    console.error("Error getting Discord users:", error)
    throw error
  }
}
