import type React from "react";
import type { sortDirection } from "../../dtos/responseDtos";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import MonthYearSelector from "./MonthYearSelector";
import { X } from "lucide-react";

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
    const handleStatusChange = (value: string) => {
        setStatus(value);
    }

    const handlePriorityChange = (value: string) => {
        setPriority(value);
    }

    const handleSortDirChange = (value: string) => {
        setSortDir(value as sortDirection);
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
        <div className="flex gap-2 flex-wrap">
            <MonthYearSelector year={year} month={month} onYearChange={setYear} onMonthChange={setMonth} />


            <div className="flex flex-col gap-1.5 min-w-[160px]">
                <Label className="text-xs">Sorting Index</Label>
                <Select
                    value={sortDir}
                    onValueChange={handleSortDirChange}
                >
                    <SelectTrigger className="h-9">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="desc">Newest First</SelectItem>
                        <SelectItem value="asc">Oldest First</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-1.5 min-w-[140px]">
                <Label className="text-xs">Status</Label>
                <Select
                    value={status}
                    onValueChange={handleStatusChange}
                >
                    <SelectTrigger className="h-9">
                        <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="To Do">To Do</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Done">Done</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-1.5 min-w-[140px]">
                <Label className="text-xs">Priority</Label>
                <Select
                    value={priority}
                    onValueChange={handlePriorityChange}
                >
                    <SelectTrigger className="h-9">
                        <SelectValue placeholder="All priorities" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {getActiveFiltersCount() > 0 && (
                <div className="flex items-end">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAllFilters}
                        className="h-9"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Clear All
                    </Button>
                </div>
            )}
        </div>
    )
}

export default TaskFilters;