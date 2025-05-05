"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  SortAsc,
  SortDesc,
  MoreHorizontal,
} from "lucide-react"
import type { PlayerData } from "@/types/player"
import { cn } from "@/lib/utils"
import { config } from "@/lib/config"
import { DiscordSyncButton } from "./discord-sync-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableProps {
  data: PlayerData[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  onPageChange: (page: number) => void
  onSearch: (query: string) => void
  onSort: (column: string, order: "asc" | "desc") => void
  sortBy: string
  sortOrder: "asc" | "desc"
}

export function DataTable({
  data,
  totalCount,
  page,
  pageSize,
  totalPages,
  onPageChange,
  onSearch,
  onSort,
  sortBy,
  sortOrder,
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      onSort(column, sortOrder === "asc" ? "desc" : "asc")
    } else {
      onSort(column, "asc")
    }
  }

  const renderSortIcon = (column: string) => {
    if (sortBy !== column) return null
    return sortOrder === "asc" ? <SortAsc className="h-4 w-4 ml-1" /> : <SortDesc className="h-4 w-4 ml-1" />
  }

  // Dynamically determine columns from the first data item and config
  const getColumns = () => {
    if (data.length === 0) return []

    const firstItem = data[0]
    // Get all keys from the first item
    const allKeys = Object.keys(firstItem)

    // Use configured default columns if they exist in the data
    const priorityColumns = config.defaultColumns.filter((col) => allKeys.includes(col))

    // Filter out columns we don't want to display
    const excludedColumns = ["id"]

    // Sort columns: priority columns first, then alphabetically, excluding unwanted columns
    return [
      ...priorityColumns,
      ...allKeys.filter((key) => !priorityColumns.includes(key) && !excludedColumns.includes(key)).sort(),
    ]
  }

  const columns = getColumns()

  // Format cell value based on type
  const formatCellValue = (value: any, column: string) => {
    if (value === null || value === undefined) return "N/A"
    if (typeof value === "boolean") return value ? "Yes" : "No"

    // Handle date-like strings
    if (
      typeof value === "string" &&
      (column.includes("date") || column.includes("updated") || column.includes("created")) &&
      value.includes("T") &&
      !isNaN(Date.parse(value))
    ) {
      return new Date(value).toLocaleString()
    }

    return String(value)
  }

  // Limit visible columns to a reasonable number
  const visibleColumns = columns.slice(0, 8) // Show max 8 columns

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Showing {data.length} of {totalCount} players
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <Input
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button type="submit" size="icon" variant="ghost">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </form>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input type="checkbox" className="h-4 w-4" />
              </TableHead>

              {visibleColumns.map((column) => (
                <TableHead key={column} className="cursor-pointer" onClick={() => handleSort(column)}>
                  <div className="flex items-center">
                    {column.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    {renderSortIcon(column)}
                  </div>
                </TableHead>
              ))}

              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length + 2} className="text-center h-24">
                  No players found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((player, index) => (
                <TableRow key={index} className={cn(index % 2 === 0 ? "bg-muted/5" : "")}>
                  <TableCell>
                    <input type="checkbox" className="h-4 w-4" />
                  </TableCell>

                  {visibleColumns.map((column) => (
                    <TableCell key={column} className={column === visibleColumns[0] ? "font-medium" : ""}>
                      {formatCellValue(player[column], column)}
                    </TableCell>
                  ))}

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Player</DropdownMenuItem>
                        {player.discord_id && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <div className="cursor-pointer">
                                <DiscordSyncButton discordId={player.discord_id} />
                              </div>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => onPageChange(1)} disabled={page === 1}>
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">First page</span>
          </Button>
          <Button variant="outline" size="icon" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button variant="outline" size="icon" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
          <Button variant="outline" size="icon" onClick={() => onPageChange(totalPages)} disabled={page === totalPages}>
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">Last page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
