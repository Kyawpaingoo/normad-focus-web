import React from 'react'
import {
    Box,
    Button,
    Grid,
    Paper,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Chip,
    Stack,
    Collapse,
    IconButton
} from "@mui/material";
import { FilterList, ExpandMore, ExpandLess, Clear } from "@mui/icons-material";
import { styled } from '@mui/material/styles';
import type { sortDirection } from "../../dtos/responseDtos";
import { pageSizeOptions, categoryOptions, typeOptions, monthOptions } from '../../ultiData/expenseData';

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

const FilterPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginButtom: theme.spacing(2),
    borderRadius: 12,
    border: '1px solid #E7EAEE'
}))

const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({filters, handlers, setShowFilters, getActiveFiltersCount}) => {
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({length: 3}, (_, i) => currentYear - i);

    return (
        <FilterPaper elevation={0} sx={{mb:2}} onClick={() => setShowFilters(!filters.showFilters)}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={filters.showFilters ? 2 : 0}>
                <Box display="flex" alignItems="center" gap={1}>
                    <FilterList />
                    <Typography variant="h6" fontWeight={600}>
                        Filters
                    </Typography>
                    {getActiveFiltersCount() > 0 && (
                        <Chip 
                            label={getActiveFiltersCount()} 
                            size="small" 
                            color="primary"
                        />
                    )}
                </Box>
                
                <Box display="flex" gap={1}>
                    {getActiveFiltersCount() > 0 && (
                        <Button 
                            startIcon={<Clear />}
                            onClick={handlers.clearAllFilters}
                            size="small"
                            variant="outlined"
                        >
                            Clear All
                        </Button>
                    )}
                    <IconButton>
                        {filters.showFilters ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </Box>
            </Box>

            <Collapse in={filters.showFilters}>
                <Grid container spacing={2}>
                    <Grid size={3}>
                        <TextField
                            fullWidth
                            label="Search"
                            value={filters.searchQuery}
                            onChange={(e) => handlers.handleSearchChange(e.target.value)}
                            size="small"
                            placeholder="Search expenses..."
                        />
                    </Grid>

                    <Grid size={1.5}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Page Size</InputLabel>
                            <Select
                                value={filters.pageSize}
                                label="Page Size"
                                onChange={(e) => handlers.handlePageSizeChange(e.target.value as number)}
                            >
                                {pageSizeOptions.map(size => (
                                    <MenuItem key={size} value={size}>{size}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={1.5}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Year</InputLabel>
                            <Select
                                value={filters.year}
                                label="Year"
                                onChange={(e) => handlers.handleYearChange(e.target.value as number)}
                            >
                                {yearOptions.map(yearOption => (
                                    <MenuItem key={yearOption} value={yearOption}>{yearOption}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Month</InputLabel>
                            <Select
                                value={filters.month}
                                label="Month"
                                onChange={(e) => handlers.handleMonthChange(e.target.value as number)}
                            >
                                {monthOptions.map(monthOption => (
                                    <MenuItem key={monthOption.value} value={monthOption.value}>
                                        {monthOption.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={filters.category || ''}
                                label="Category"
                                onChange={(e) => handlers.handleCategoryChange(e.target.value || undefined)}
                            >
                                <MenuItem value="">All Categories</MenuItem>
                                {categoryOptions.map(cat => (
                                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={1.5}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={filters.type || ''}
                                label="Type"
                                onChange={(e) => handlers.handleTypeChange(e.target.value || undefined)}
                            >
                                <MenuItem value="">All Types</MenuItem>
                                {typeOptions.map(typeOption => (
                                    <MenuItem key={typeOption} value={typeOption}>{typeOption}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={1.5}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Sort</InputLabel>
                            <Select
                                value={filters.sortDir}
                                label="Sort"
                                onChange={(e) => handlers.handleSortDirChange(e.target.value as sortDirection)}
                            >
                                <MenuItem value="desc">Newest First</MenuItem>
                                <MenuItem value="asc">Oldest First</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {getActiveFiltersCount() > 0 && (
                    <Box mt={2}>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                            Active Filters:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            {filters.searchQuery && (
                                <Chip 
                                    label={`Search: ${filters.searchQuery}`}
                                    onDelete={() => handlers.handleSearchChange('')}
                                    size="small"
                                    variant="outlined"
                                />
                            )}
                            {filters.category && (
                                <Chip 
                                    label={`Category: ${filters.category}`}
                                    onDelete={() => handlers.handleCategoryChange(undefined)}
                                    size="small"
                                    variant="outlined"
                                />
                            )}
                            {filters.type && (
                                <Chip 
                                    label={`Type: ${filters.type}`}
                                    onDelete={() => handlers.handleTypeChange(undefined)}
                                    size="small"
                                    variant="outlined"
                                />
                            )}
                        </Stack>
                    </Box>
                )}
            </Collapse>
        </FilterPaper>
    )
}

export default ExpenseFilters