import React from 'react'
import type { AdditionalData } from '../../dtos/expenseDtos';
import ExpenseBreakdownCard from './ExpenseBreakdownCard';
import IncomeVsExpenseCard from './IncomeVsExpenseCard';

interface ExpenseStatsCardsProps {
  additionalData: AdditionalData | null
}

const ExpenseStatsCards : React.FC<ExpenseStatsCardsProps> = ({additionalData}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-4 text-center">
                <ExpenseBreakdownCard expenseBreakdown={additionalData?.expenseBreakdown ?? null} />
            </div>
            <div className="bg-white p-4 text-center">
                <IncomeVsExpenseCard incomeVsExpense={additionalData?.incomeVsExpense ?? null} />
            </div>
        </div>
    )
}

export default ExpenseStatsCards