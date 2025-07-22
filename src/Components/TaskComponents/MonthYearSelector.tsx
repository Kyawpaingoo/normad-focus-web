import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton, MenuItem, Select } from "@mui/material";
import type React from "react";
import { useMemo } from "react";
import { monthOptions } from "../../Ultils/monthData";

interface MonthYearSelectorProps {
    year: number;
    month: number;
    setYear: (year: number) => void;
    setMonth: (month: number) => void;
}
const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({year, month, setYear, setMonth}) => {
    const currentYear = new Date().getFullYear();
    const yearRange = useMemo(()=> Array.from({length: 11}, (_,i)=> currentYear - 5 + i), [currentYear]);

    const handlePrev = () => {
        if (month === 1) {
        setMonth(12);
        setYear(year - 1);
        } else {
        setMonth(month - 1);
        }
    };

    const handleNext = () => {
        if (month === 12) {
        setMonth(1);
        setYear(year + 1);
        } else {
        setMonth(month + 1);
        }
    };

    const handleMonthChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setMonth(Number(event.target.value));
    };

    const handleYearChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setYear(Number(event.target.value));
    };

    return (
        <Box display={'flex'} alignItems={'center'} gap={2} sx={{mb: 2}}>
            <IconButton onClick={handlePrev}>
                <ChevronLeft />
            </IconButton>
            <Select
                value={month}
                onChange={handleMonthChange}
                size="small"
                sx={{ minWidth: 120 }}
            >
                {monthOptions.map(({value, label})=> (
                    <MenuItem key={value} value={value}>{label}</MenuItem>
                ))}
            </Select>
            <Select
                value={year}
                onChange={handleYearChange}
                size="small"
                sx={{ minWidth: 90 }}
            >
                {yearRange.map((y) => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
            </Select>
            <IconButton onClick={handleNext}>
                <ChevronRight />
            </IconButton>
        </Box>
    )
}

export default MonthYearSelector;