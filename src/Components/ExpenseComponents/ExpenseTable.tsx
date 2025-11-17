import React from "react";
import dayjs from 'dayjs';
import type { ExpenseDto, deleteData } from "../../dtos/expenseDtos";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

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
        <div className="rounded-lg border border-[#E7EAEE] p-4">
            <h2 className="text-lg font-bold mb-4">
                Expense & Income
            </h2>

            <div className="overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Currency</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>

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
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onViewDetails(row)}
                                        >
                                            View Details
                                        </Button>
                                        <span className="text-muted-foreground">|</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => onDelete({id: row.id, userId: row.user_id})}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-center items-center gap-2 mt-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                    Page {currentPage} of {totalPages}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

export default ExpenseTable;