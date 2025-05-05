export interface PlayerData {
  id: string
  discord_id: string
  alliance: string
  keep_name: string
  troop_level: string
  keep_level: number
  march_size: string
  dragon_level: number
  house_level: number
  rally_cap: string
  reinforcement_capacity_vs_sop: string
  troop_type: string
  marcher_attack_vs_player_sop: string
  marcher_defense_vs_player_sop: string
  marcher_health_vs_player_sop: string
  adh_attack_vs_player_sop: string
  adh_defense_vs_player_sop: string
  adh_health_vs_player_sop: string
  last_updated: string
  discord_name: string
}

export interface PlayerStats {
  total_players: number
  players_today: number
  alliances: number
  growth_percentage?: number
  tableName?: string | null
}
