import React from "react";
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Pagination
} from "@mui/material";
import dayjs from 'dayjs';
import type { ExpenseDto, deleteData } from "../../dtos/expenseDtos";

interface ExpenseTableProps {
    expenses: ExpenseDto[];
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onViewDetails: (expense: ExpenseDto) => void;
    onDelete: ({ id, userId }: deleteData) => void;
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, totalPages, currentPage, onPageChange, onViewDetails, onDelete }) => {
    return (
        <Paper elevation={0} sx={{borderRadius: 2, border: '1px solid #E7EAEE', p: 2}}>
             <Typography variant="h6" sx={{mb: 2, fontWeight: 700}}>
                Expense & Income
            </Typography>
            
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Currency</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {expenses.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{dayjs(row.expense_date).format('YYYY-MM-DD')}</TableCell>
                                <TableCell>{row.category}</TableCell>
                                <TableCell>{row.title}</TableCell>
                                <TableCell>{row.currency}</TableCell>
                                <TableCell>{row.amount}</TableCell>
                                <TableCell>{row.type}</TableCell>
                                <TableCell>
                                    <Button 
                                        variant="text" 
                                        color="primary" 
                                        sx={{ mr: 1 }} 
                                        onClick={() => onViewDetails(row)}
                                    >
                                        View Details
                                    </Button>
                                    |
                                    <Button 
                                        variant="text" 
                                        color="error" 
                                        sx={{ ml: 1 }}  
                                        onClick={() => onDelete({id: row.id, userId: row.user_id})}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box display='flex' justifyContent={'center'} sx={{mt: 2}}>
                <Pagination 
                    count={totalPages}
                    page={currentPage}
                    onChange={(e, value) => onPageChange(value)}
                    shape="rounded"
                    showFirstButton
                    showLastButton
                />
            </Box>
        </Paper>
    )
}

export default ExpenseTable;