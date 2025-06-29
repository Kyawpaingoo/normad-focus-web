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

export interface ExpenseFormState {
  title: string;
  amount: number;
  category: string;
  type: string;
  currency: string;
  date: string; // ISO string
}