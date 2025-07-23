import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton, MenuItem, Select, type SelectChangeEvent } from "@mui/material";
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

    const handleMonthChange = useCallback((event: SelectChangeEvent<number>) => {
        onMonthChange(Number(event.target.value));
    }, [onMonthChange]);

    const handleYearChange = useCallback((event: SelectChangeEvent<number>) => {
        onYearChange(Number(event.target.value));
    }, [onYearChange]);

  return (
    <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
        <IconButton onClick={handlePrevious} aria-label="Previous month">
            <ChevronLeft />
        </IconButton>
      
        <Select
            value={month}
            onChange={handleMonthChange}
            size="small"
            sx={{ minWidth: 120 }}
            aria-label="Select month"
        >
            {MONTH_OPTIONS.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
                {label}
            </MenuItem>
            ))}
        </Select>
      
        <Select
            value={year}
            onChange={handleYearChange}
            size="small"
            sx={{ minWidth: 90 }}
            aria-label="Select year"
        >
            {yearRange.map((yearValue) => (
            <MenuItem key={yearValue} value={yearValue}>
                {yearValue}
            </MenuItem>
            ))}
        </Select>
      
      <IconButton onClick={handleNext} aria-label="Next month">
        <ChevronRight />
      </IconButton>
    </Box>
  );
};

export default MonthYearSelector;