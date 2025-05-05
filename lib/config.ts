// Update this configuration with your actual table name
export const config = {
  // The name of your table in Supabase
  tableName: "player_stats", // This is the correct table name from your database

  // Default columns to display (in order)
  defaultColumns: [
    "discord_name",
    "alliance",
    "keep_name",
    "keep_level",
    "dragon_level",
    "troop_level",
    "last_updated",
  ],
}
