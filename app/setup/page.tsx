"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { config } from "@/lib/config"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { isSupabaseConfigured } from "@/lib/supabase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SetupPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button asChild variant="outline" size="icon">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Dashboard Configuration</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Database Configuration</CardTitle>
          <CardDescription>Your dashboard is configured to use the following settings.</CardDescription>
        </CardHeader>
        <CardContent>
          {!isSupabaseConfigured() && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Missing Supabase Configuration</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>Your Supabase environment variables are not configured.</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/setup/environment">Set Up Environment Variables</Link>
                </Button>
              </AlertDescription>
            </Alert>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Setting</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Table Name</TableCell>
                <TableCell>{config.tableName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Default Columns</TableCell>
                <TableCell>{config.defaultColumns.join(", ")}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/">Go to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Columns</CardTitle>
          <CardDescription>These are the columns available in your player_stats table.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <div className="p-2 border rounded">
              id <span className="text-xs text-muted-foreground ml-2">uuid</span>
            </div>
            <div className="p-2 border rounded">
              discord_id <span className="text-xs text-muted-foreground ml-2">text</span>
            </div>
            <div className="p-2 border rounded">
              alliance <span className="text-xs text-muted-foreground ml-2">text</span>
            </div>
            <div className="p-2 border rounded">
              keep_name <span className="text-xs text-muted-foreground ml-2">text</span>
            </div>
            <div className="p-2 border rounded">
              troop_level <span className="text-xs text-muted-foreground ml-2">text</span>
            </div>
            <div className="p-2 border rounded">
              keep_level <span className="text-xs text-muted-foreground ml-2">integer</span>
            </div>
            <div className="p-2 border rounded">
              march_size <span className="text-xs text-muted-foreground ml-2">text</span>
            </div>
            <div className="p-2 border rounded">
              dragon_level <span className="text-xs text-muted-foreground ml-2">integer</span>
            </div>
            <div className="p-2 border rounded">
              house_level <span className="text-xs text-muted-foreground ml-2">integer</span>
            </div>
            <div className="p-2 border rounded">
              rally_cap <span className="text-xs text-muted-foreground ml-2">text</span>
            </div>
            <div className="p-2 border rounded">
              reinforcement_capacity_vs_sop <span className="text-xs text-muted-foreground ml-2">text</span>
            </div>
            <div className="p-2 border rounded">
              troop_type <span className="text-xs text-muted-foreground ml-2">text</span>
            </div>
            <div className="p-2 border rounded">
              marcher_attack_vs_player_sop <span className="text-xs text-muted-foreground ml-2">text</span>
            </div>
            <div className="p-2 border rounded">
              marcher_defense_vs_player_sop <span className="text-xs text-muted-foreground ml-2">text</span>
            </div>
            <div className="p-2 border rounded">
              marcher_health_vs_player_sop <span className="text-xs text-muted-foreground ml-2">text</span>
            </div>
            <div className="p-2 border rounded">
              adh_attack_vs_player_sop <span className="text-xs text-muted-foreground ml-2">text</span>
            </div>
            <div className="p-2 border rounded">
              adh_defense_vs_player_sop <span className="text-xs text-muted-foreground ml-2">text</span>
            </div>
            <div className="p-2 border rounded">
              adh_health_vs_player_sop <span className="text-xs text-muted-foreground ml-2">text</span>
            </div>
            <div className="p-2 border rounded">
              last_updated <span className="text-xs text-muted-foreground ml-2">timestamp</span>
            </div>
            <div className="p-2 border rounded">
              discord_name <span className="text-xs text-muted-foreground ml-2">text</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
