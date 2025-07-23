import type { sortDirection } from "../dtos/responseDtos";


export const SORT_OPTIONS: {value: sortDirection, label: string}[] = [
    { value: 'desc', label: 'Newest First' },
    { value: 'asc', label: 'Oldest First' },
]