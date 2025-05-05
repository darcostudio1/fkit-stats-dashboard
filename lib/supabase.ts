import { createClient } from "@supabase/supabase-js"

// Create a more resilient Supabase client that handles missing environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY

// Create a mock client if environment variables are missing
export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : {
        from: () => ({
          select: () => ({
            eq: () => ({
              single: () => ({ data: null, error: { message: "Supabase not configured" } }),
              range: () => ({ data: [], error: null, count: 0 }),
            }),
            filter: () => ({
              range: () => ({ data: [], error: null, count: 0 }),
            }),
            order: () => ({
              range: () => ({ data: [], error: null, count: 0 }),
            }),
            or: () => ({
              order: () => ({
                range: () => ({ data: [], error: null, count: 0 }),
              }),
            }),
            gte: () => ({ count: 0 }),
            lte: () => ({ count: 0 }),
          }),
          update: () => ({
            eq: () => ({ error: { message: "Supabase not configured" } }),
          }),
        }),
      }

// Function to check if Supabase is properly configured
export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseKey)
}
