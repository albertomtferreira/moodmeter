// components/TermPickerWithPresets.tsx
"use client"
import * as React from "react"
import { format, setMonth, startOfMonth, endOfMonth } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface DateRange {
  from: Date;
  to: Date;
}

interface TermPickerProps {
  range: DateRange;
  setRange: (range: DateRange) => void;
}

export function TermPickerWithPresets({ range, setRange }: TermPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const currentYear = new Date().getFullYear();

  const getAllData = () => {
    setRange({
      from: new Date(2023, 0, 1), // Or your earliest data date
      to: new Date()
    });
    setIsOpen(false);
  };

  const getAcademicYear = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const academicYearStart = currentMonth >= 8 ? now.getFullYear() : now.getFullYear() - 1;

    setRange({
      from: new Date(academicYearStart, 8, 1), // September 1st of start year
      to: new Date() // Current date
    });
    setIsOpen(false);
  };

  const handleTermSelect = (termIndex: string) => {
    const term = academicTerms[Number(termIndex)];
    const now = new Date();
    let year = now.getFullYear();

    // If we're selecting autumn term and it's already past august, use current year
    // otherwise use previous year
    if (term.name === "Autumn Term" && now.getMonth() < 8) {
      year--;
    }
    // If we're selecting spring or summer term and it's before september, use current year
    // otherwise use next year
    else if (term.name !== "Autumn Term" && now.getMonth() >= 8) {
      year++;
    }

    setRange(term.getRange(year));
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal bg-white",
            !range && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>
            {format(range.from, "MMM yyyy")} - {format(range.to, "MMM yyyy")}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2 bg-white border shadow-md">
        <div className="grid gap-2">
          <Button
            variant="outline"
            className="bg-white hover:bg-gray-100"
            onClick={getAllData}
          >
            All Data
          </Button>
          <Button
            variant="outline"
            className="bg-white hover:bg-gray-100"
            onClick={getAcademicYear}
          >
            Academic Year
          </Button>
          <Select onValueChange={handleTermSelect}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select Term" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-lg border-gray-200 min-w-[280px]">
              {academicTerms.map((term, index) => (
                <SelectItem
                  key={term.name}
                  value={index.toString()}
                >
                  {term.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}

const academicTerms = [
  {
    name: "Autumn Term",
    getRange: (year: number) => ({
      from: new Date(year, 8, 1), // September 1st
      to: new Date(year, 11, 31) // December 31st
    })
  },
  {
    name: "Spring Term",
    getRange: (year: number) => ({
      from: new Date(year, 0, 1), // January 1st
      to: new Date(year, 2, 31) // March 31st
    })
  },
  {
    name: "Summer Term",
    getRange: (year: number) => ({
      from: new Date(year, 3, 1), // April 1st
      to: new Date(year, 6, 31) // July 31st
    })
  }
];