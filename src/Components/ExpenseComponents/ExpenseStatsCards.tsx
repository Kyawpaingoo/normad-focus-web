import React from 'react'
import {Grid, Paper} from '@mui/material';
import {styled} from '@mui/material/styles';
import type { AdditionalData } from '../../dtos/expenseDtos';
import ExpenseBreakdownCard from './ExpenseBreakdownCard';
import IncomeVsExpenseCard from './IncomeVsExpenseCard';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

interface ExpenseStatsCardsProps {
  additionalData: AdditionalData | null
}

const ExpenseStatsCards : React.FC<ExpenseStatsCardsProps> = ({additionalData}) => {
    return (
        <Grid container spacing={2} sx={{mb: 2}}>
            <Grid size={4}>
                <Item>
                    <ExpenseBreakdownCard expenseBreakdown={additionalData?.expenseBreakdown} />
                </Item>
            </Grid>
            <Grid size={4}>
                <Item>
                    <IncomeVsExpenseCard incomeVsExpense={additionalData?.incomeVsExpense} />
                </Item>
            </Grid>
        </Grid>
    )
}

export default ExpenseStatsCards