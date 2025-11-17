import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import React,  { useMemo, useCallback } from "react";
import { MONTH_OPTIONS } from "../../Ultils/monthData";

interface MonthYearSelectorProps {
    year: number;
    month: number;
    onYearChange: (year: number) => void;
    onMonthChange: (month: number) => void;
}
const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({
    year,
    month,
    onYearChange,
    onMonthChange,
}) => {
    const currentYear = new Date().getFullYear();

    const yearRange = useMemo(
        () => Array.from({ length: 11 }, (_, i) => currentYear - 5 + i),
        [currentYear]
    );

    const handlePrevious = useCallback(() => {
        if (month === 1) {
            onMonthChange(12);
            onYearChange(year - 1);
        } else {
            onMonthChange(month - 1);
        }
    }, [month, year, onMonthChange, onYearChange]);

    const handleNext = useCallback(() => {
        if (month === 12) {
        onMonthChange(1);
        onYearChange(year + 1);
        } else {
        onMonthChange(month + 1);
        }
    }, [month, year, onMonthChange, onYearChange]);

    const handleMonthChange = useCallback((value: string) => {
        onMonthChange(Number(value));
    }, [onMonthChange]);

    const handleYearChange = useCallback((value: string) => {
        onYearChange(Number(value));
    }, [onYearChange]);

  return (
    <div className="flex items-center gap-2 mb-2">
        <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            aria-label="Previous month"
        >
            <ChevronLeft className="h-4 w-4" />
        </Button>

        <Select
            value={month.toString()}
            onValueChange={handleMonthChange}
        >
            <SelectTrigger className="w-[120px]" aria-label="Select month">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {MONTH_OPTIONS.map(({ value, label }) => (
                    <SelectItem key={value} value={value.toString()}>
                        {label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>

        <Select
            value={year.toString()}
            onValueChange={handleYearChange}
        >
            <SelectTrigger className="w-[90px]" aria-label="Select year">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {yearRange.map((yearValue) => (
                    <SelectItem key={yearValue} value={yearValue.toString()}>
                        {yearValue}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>

      <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            aria-label="Next month"
        >
            <ChevronRight className="h-4 w-4" />
        </Button>
    </div>
  );
};

export default MonthYearSelector;