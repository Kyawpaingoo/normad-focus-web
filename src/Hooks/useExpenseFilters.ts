import { useState } from "react";
import type { sortDirection } from "../dtos/responseDtos";

export const useExpenseFilter = () => {
    
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [year, setYear] = useState(2025);
    const [month, setMonth] = useState(6);
    const [category, setCategory] = useState<string | undefined>(undefined);
    const [type, setType] = useState<string | undefined>(undefined);
    const [sortDir, setSortDir] = useState<sortDirection>('desc');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setPage(1);
    };

    const handleYearChange = (newYear: number) => {
        setYear(newYear);
        setPage(1);
    };

    const handleMonthChange = (newMonth: number) => {
        setMonth(newMonth);
        setPage(1);
    };

    const handleCategoryChange = (newCategory: string | undefined) => {
        setCategory(newCategory);
        setPage(1);
    };

    const handleTypeChange = (newType: string | undefined) => {
        setType(newType);
        setPage(1);
    };

    const handleSortDirChange = (newSortDir: sortDirection) => {
        setSortDir(newSortDir);
        setPage(1);
    };

    const handleSearchChange = (newSearch: string) => {
        setSearchQuery(newSearch);
        setPage(1);
    };

    const clearAllFilters = () => {
        setCategory(undefined);
        setType(undefined);
        setSearchQuery('');
        setPage(1);
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (category) count++;
        if (type) count++;
        if (searchQuery) count++;
        return count;
    };

    return {
        filters: {
            page,
            pageSize,
            year,
            month,
            category,
            type,
            sortDir,
            searchQuery,
            showFilters
        },
        setters: {
            setPage,
            setShowFilters
        },
        handlers: {
            handlePageSizeChange,
            handleYearChange,
            handleMonthChange,
            handleCategoryChange,
            handleTypeChange,
            handleSortDirChange,
            handleSearchChange,
            clearAllFilters
        },
        utils: {
            getActiveFiltersCount
        }
    };
}