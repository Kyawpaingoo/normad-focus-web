import React from 'react'
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Filter, ChevronDown, ChevronUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { sortDirection } from "../../dtos/responseDtos";
import { pageSizeOptions, categoryOptions, typeOptions } from '../../Ultils/expenseData';
import { MONTH_OPTIONS } from '../../Ultils/monthData';

interface ExpenseFiltersProps {
    filters: {
        pageSize: number;
        year: number;
        month: number;
        category: string | undefined;
        type: string | undefined;
        sortDir: sortDirection;
        searchQuery: string;
        showFilters: boolean;
    };
    handlers: {
        handlePageSizeChange: (size: number) => void;
        handleYearChange: (year: number) => void;
        handleMonthChange: (month: number) => void;
        handleCategoryChange: (category: string | undefined) => void;
        handleTypeChange: (type: string | undefined) => void;
        handleSortDirChange: (sortDir: sortDirection) => void;
        handleSearchChange: (search: string) => void;
        clearAllFilters: () => void;
    };
    setShowFilters: (show: boolean) => void;
    getActiveFiltersCount: () => number;
}

const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({filters, handlers, setShowFilters, getActiveFiltersCount}) => {
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({length: 3}, (_, i) => currentYear - i);

    return (
        <Card
            className="p-4 mb-4 rounded-xl border border-border cursor-pointer"
            onClick={() => setShowFilters(!filters.showFilters)}
        >
            <div className={cn("flex justify-between items-center", filters.showFilters && "mb-4")}>
                <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    <h2 className="text-lg font-semibold">Filters</h2>
                    {getActiveFiltersCount() > 0 && (
                        <Badge variant="default" className="h-5 min-w-5 flex items-center justify-center">
                            {getActiveFiltersCount()}
                        </Badge>
                    )}
                </div>

                <div className="flex gap-2">
                    {getActiveFiltersCount() > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                handlers.clearAllFilters();
                            }}
                        >
                            <X className="h-4 w-4 mr-1" />
                            Clear All
                        </Button>
                    )}
                    <Button variant="ghost" size="icon">
                        {filters.showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {filters.showFilters && (
                <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-3">
                            <Label htmlFor="search" className="mb-2 block text-xs">Search</Label>
                            <Input
                                id="search"
                                value={filters.searchQuery}
                                onChange={(e) => handlers.handleSearchChange(e.target.value)}
                                placeholder="Search expenses..."
                                className="h-9"
                            />
                        </div>

                        <div className="col-span-2">
                            <Label className="mb-2 block text-xs">Page Size</Label>
                            <Select
                                value={filters.pageSize.toString()}
                                onValueChange={(value) => handlers.handlePageSizeChange(Number(value))}
                            >
                                <SelectTrigger className="h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {pageSizeOptions.map(size => (
                                        <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="col-span-2">
                            <Label className="mb-2 block text-xs">Year</Label>
                            <Select
                                value={filters.year.toString()}
                                onValueChange={(value) => handlers.handleYearChange(Number(value))}
                            >
                                <SelectTrigger className="h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {yearOptions.map(yearOption => (
                                        <SelectItem key={yearOption} value={yearOption.toString()}>{yearOption}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="col-span-2">
                            <Label className="mb-2 block text-xs">Month</Label>
                            <Select
                                value={filters.month.toString()}
                                onValueChange={(value) => handlers.handleMonthChange(Number(value))}
                            >
                                <SelectTrigger className="h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {MONTH_OPTIONS.map(monthOption => (
                                        <SelectItem key={monthOption.value} value={monthOption.value.toString()}>
                                            {monthOption.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="col-span-2">
                            <Label className="mb-2 block text-xs">Category</Label>
                            <Select
                                value={filters.category || ''}
                                onValueChange={(value) => handlers.handleCategoryChange(value || undefined)}
                            >
                                <SelectTrigger className="h-9">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Categories</SelectItem>
                                    {categoryOptions.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="col-span-2">
                            <Label className="mb-2 block text-xs">Type</Label>
                            <Select
                                value={filters.type || ''}
                                onValueChange={(value) => handlers.handleTypeChange(value || undefined)}
                            >
                                <SelectTrigger className="h-9">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Types</SelectItem>
                                    {typeOptions.map(typeOption => (
                                        <SelectItem key={typeOption} value={typeOption}>{typeOption}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="col-span-2">
                            <Label className="mb-2 block text-xs">Sort</Label>
                            <Select
                                value={filters.sortDir}
                                onValueChange={(value) => handlers.handleSortDirChange(value as sortDirection)}
                            >
                                <SelectTrigger className="h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="desc">Newest First</SelectItem>
                                    <SelectItem value="asc">Oldest First</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {getActiveFiltersCount() > 0 && (
                        <div className="mt-4">
                            <p className="text-sm text-muted-foreground mb-2">
                                Active Filters:
                            </p>
                            <div className="flex flex-row gap-2 flex-wrap">
                                {filters.searchQuery && (
                                    <Badge variant="outline" className="gap-1">
                                        Search: {filters.searchQuery}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => handlers.handleSearchChange('')}
                                        />
                                    </Badge>
                                )}
                                {filters.category && (
                                    <Badge variant="outline" className="gap-1">
                                        Category: {filters.category}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => handlers.handleCategoryChange(undefined)}
                                        />
                                    </Badge>
                                )}
                                {filters.type && (
                                    <Badge variant="outline" className="gap-1">
                                        Type: {filters.type}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => handlers.handleTypeChange(undefined)}
                                        />
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Card>
    )
}

export default ExpenseFilters