export type upsertExpenseRequestDto = {
    id: number,
    userId: number,
    title: string | null,
    amount: number | null,
    category: string | null,
    type: string | null,
    currency: string
    expense_date: Date,
    note: string | null
};

export type ExpenseDto = {
    id: number;
    user_id: number;
    title: string | null;
    category: string | null;
    type: string | null;
    amount: number | null;
    currency: string | null;
    note: string | null;
    expense_date: Date | null;
    created_at: Date | null;
    is_deleted: boolean | null;
}

export type ExpenseBreakdownDto = {
  total: number;
    change: number;
    categories: CategoryDto[];
}

export type CategoryDto = {
    label: string | null;
    value: number;
}

export type IncomeVSExpenseDto = {
  total: number;
  change: number;
  months: string[];
  values: number[];
}

export type AdditionalData = {
  expenseBreakdown: ExpenseBreakdownDto;
  incomeVsExpense: IncomeVSExpenseDto;
}

export type deleteData = {
    id: number,
    userId: number
}

export interface ExpenseFormState {
  title: string;
  amount: number;
  category: string;
  type: string;
  currency: string;
  date: string; // ISO string
}

