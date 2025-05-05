// This is a server-side utility for Discord API interactions
// It can be used in server actions or API routes

import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v10"

const token = process.env.DISCORD_TOKEN

// Create a mock REST instance for Discord API calls when token is missing
const rest = token
  ? new REST({ version: "10" }).setToken(token)
  : {
      get: async () => {
        throw new Error("Discord token not configured")
      },
      post: async () => {
        throw new Error("Discord token not configured")
      },
    }

// Function to check if Discord is properly configured
export function isDiscordConfigured() {
  return Boolean(token)
}

// Function to fetch user data from Discord
export async function getDiscordUser(userId: string) {
  try {
    if (!token) {
      return {
        id: userId,
        username: "Discord API Not Configured",
        discriminator: "0000",
        avatar: null,
      }
    }
    return await rest.get(Routes.user(userId))
  } catch (error) {
    console.error("Error fetching Discord user:", error)
    throw error
  }
}

// Function to fetch guild (server) data
export async function getDiscordGuild(guildId: string) {
  try {
    if (!token) {
      return {
        id: guildId,
        name: "Discord API Not Configured",
        icon: null,
      }
    }
    return await rest.get(Routes.guild(guildId))
  } catch (error) {
    console.error("Error fetching Discord guild:", error)
    throw error
  }
}

// Function to send a message to a channel
export async function sendDiscordMessage(channelId: string, content: string) {
  try {
    if (!token) {
      console.log("Would send message to Discord:", { channelId, content })
      return { id: "mock-message-id", content }
    }
    return await rest.post(Routes.channelMessages(channelId), {
      body: { content },
    })
  } catch (error) {
    console.error("Error sending Discord message:", error)
    throw error
  }
}
