import { Dispatch, SetStateAction } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, isAfter, startOfDay } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DateRangePicker = ({
  className,
  date,
  setDate,
}: React.HTMLAttributes<HTMLDivElement> & {
  date: DateRange;
  setDate: Dispatch<SetStateAction<DateRange | undefined>>;
}) => {
  const handleSelectDate = (range: DateRange | undefined) => {
    if (range) {
      // Check if the 'to' date in the range is after the current date or undefined
      if (!range.to || isAfter(startOfDay(range.to), new Date())) {
        // If 'to' is in the future or undefined, reset it to 'from' date or today's date
        range.to = range.from || new Date();
      }
      // Check if 'from' is undefined, set it to today's date
      if (!range.from) {
        range.from = new Date();
      }
      // Set the date range
      setDate(range);
    } else {
      // If range is undefined, set both 'from' and 'to' to today's date
      setDate({ from: new Date(), to: new Date() });
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[325px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelectDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangePicker;
