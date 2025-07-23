import type React from "react";
import type { sortDirection } from "../../dtos/responseDtos";
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import MonthYearSelector from "./MonthYearSelector";
import { Clear } from "@mui/icons-material";

interface TaskFiltersProps {
    year: number;
    month: number;
    sortDir: sortDirection,
    status: string,
    priority: string,
    setYear: (year: number) => void;
    setMonth: (month: number) => void;
    setSortDir: (sortDir: sortDirection) => void;
    setStatus: (status: string) => void;
    setPriority: (priority: string) => void;
}
const TaskFilters: React.FC<TaskFiltersProps> = ({year, month, sortDir, status, priority, setYear, setMonth, setSortDir, setStatus, setPriority}) => {
    const handleStatusChange = (event: React.ChangeEvent<{value: string}>) => {
        setStatus(event.target.value);
    }

    const handlePriorityChange = (event: React.ChangeEvent<{value: string}>) => {
        setPriority(event.target.value);
    }

    const handleSortDirChange = (event: React.ChangeEvent<{value: sortDirection}>) => {
        setSortDir(event.target.value);
    }

    const clearAllFilters = () => {
        setYear(new Date().getFullYear());
        setMonth(new Date().getMonth() + 1);
        setSortDir('desc')
        setStatus('');
        setPriority('');
    }

    const getActiveFiltersCount = () => {
        let count = 0;
        if (status) count++;
        if (priority) count++;
        return count;
    };

    return(
        <Box display={'flex'} gap={2} flexWrap={'wrap'}>
            <MonthYearSelector year={year} month={month} onYearChange={setYear} onMonthChange={setMonth} />
            
            
            <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Sorting Index</InputLabel>
                <Select
                    value={sortDir}
                    label="Sorting Index"
                    onChange={handleSortDirChange}
                >
                    <MenuItem value="desc">Newest First</MenuItem>                       
                    <MenuItem value="asc">Oldest First</MenuItem>
                </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Status</InputLabel>
                <Select
                    value={status}
                    label="Status"
                    onChange={handleStatusChange}
                >
                    <MenuItem value="To Do">To Do</MenuItem>                       
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Done">Done</MenuItem>
                </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                    value={priority}
                    label="Priority"
                    onChange={handlePriorityChange}
                >
                    <MenuItem value="Low">Low</MenuItem>                       
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                </Select>
            </FormControl>

            {getActiveFiltersCount() > 0 && (
                <Button
                    startIcon={<Clear />}
                    onClick={clearAllFilters}
                    size="small"
                    variant="outlined"
                    sx={{paddingY: 0}}
                >Clear All</Button>
            )}
        </Box>
    )
}

export default TaskFilters;