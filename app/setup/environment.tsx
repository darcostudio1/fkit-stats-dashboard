"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { isSupabaseConfigured } from "@/lib/supabase"
import { isDiscordConfigured } from "@/lib/discord"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EnvironmentSetupPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button asChild variant="outline" size="icon">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Environment Setup</h1>
      </div>

      <Tabs defaultValue="supabase">
        <TabsList className="mb-4">
          <TabsTrigger value="supabase">Supabase</TabsTrigger>
          <TabsTrigger value="discord">Discord</TabsTrigger>
        </TabsList>

        <TabsContent value="supabase">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Supabase Configuration</CardTitle>
              <CardDescription>Set up your Supabase environment variables to connect to your database.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isSupabaseConfigured() ? (
                <Alert>
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Supabase is properly configured. Your application is connected to your database.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertTitle>Missing Configuration</AlertTitle>
                  <AlertDescription>
                    Supabase environment variables are missing. Please add the following variables:
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Required Environment Variables</h3>
                <div className="grid gap-2">
                  <div className="p-3 border rounded">
                    <div className="font-mono text-sm">NEXT_PUBLIC_SUPABASE_URL</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      The URL of your Supabase project (e.g., https://xxxxxxxxxxxx.supabase.co)
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="font-mono text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY</div>
                    <p className="text-sm text-muted-foreground mt-1">The anon/public key of your Supabase project</p>
                  </div>
                </div>

                <h3 className="text-lg font-medium mt-6">How to Set Up</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Go to your Supabase project dashboard at{" "}
                    <a
                      href="https://app.supabase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      app.supabase.com
                    </a>
                  </li>
                  <li>Select your project</li>
                  <li>Go to Project Settings &gt; API</li>
                  <li>Copy the URL and anon/public key</li>
                  <li>Add these values to your environment variables</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discord">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Discord Configuration</CardTitle>
              <CardDescription>Set up your Discord environment variables for bot integration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isDiscordConfigured() ? (
                <Alert>
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Discord API is properly configured. Your application can interact with Discord.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertTitle>Missing Configuration</AlertTitle>
                  <AlertDescription>
                    Discord token is missing. Please add the following environment variable:
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Required Environment Variable</h3>
                <div className="p-3 border rounded">
                  <div className="font-mono text-sm">DISCORD_TOKEN</div>
                  <p className="text-sm text-muted-foreground mt-1">The bot token from your Discord Developer Portal</p>
                </div>

                <h3 className="text-lg font-medium mt-6">How to Set Up</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Go to the{" "}
                    <a
                      href="https://discord.com/developers/applications"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      Discord Developer Portal
                    </a>
                  </li>
                  <li>Create a new application or select an existing one</li>
                  <li>Go to the Bot section</li>
                  <li>Click "Reset Token" if you need a new token</li>
                  <li>Copy the token</li>
                  <li>Add this token as the DISCORD_TOKEN environment variable</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button asChild variant="outline">
          <Link href="/">Back to Dashboard</Link>
        </Button>
        <Button asChild>
          <Link href="/setup">Configuration Settings</Link>
        </Button>
      </div>
    </div>
  )
}
