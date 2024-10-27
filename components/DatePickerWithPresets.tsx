// components/DatePickerWithPresets.tsx
"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date: Date
  setDate: (date: Date) => void
}

export function DatePickerWithPresets({ date, setDate }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal bg-white",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2 bg-white border shadow-md">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 bg-white hover:bg-gray-100"
            onClick={() => setDate(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-white hover:bg-gray-100"
            onClick={() => setDate(addDays(new Date(), -1))}
          >
            Yesterday
          </Button>
        </div>
        <div className="rounded-md border bg-white">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => date && setDate(date)}
            initialFocus
            className="bg-white"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}