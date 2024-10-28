// components/WeekPickerWithPresets.tsx
"use client"

import * as React from "react"
import { addWeeks, startOfWeek, endOfWeek, format, isSameWeek } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface WeekPickerProps {
  date: Date
  setDate: (date: Date) => void
}

export function WeekPickerWithPresets({ date, setDate }: WeekPickerProps) {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 }) // Start week on Monday
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 })

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal bg-white",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>
            {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2 bg-white border shadow-md">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 bg-white hover:bg-gray-100"
            onClick={() => setDate(new Date())}
          >
            This Week
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-white hover:bg-gray-100"
            onClick={() => setDate(addWeeks(new Date(), -1))}
          >
            Last Week
          </Button>
        </div>
        <div className="rounded-md border bg-white">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => date && setDate(date)}
            initialFocus
            className="bg-white"
            modifiers={{
              selected: (date) => isSameWeek(date, weekStart, { weekStartsOn: 1 }),
            }}
            modifiersStyles={{
              selected: {
                backgroundColor: 'rgb(229, 231, 235)',
                color: 'black',
              }
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}