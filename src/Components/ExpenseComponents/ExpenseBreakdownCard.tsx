import type React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import type { ExpenseBreakdownDto } from "../../dtos/expenseDtos";
import { Card, CardContent } from "@/components/ui/card";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface ExpenseBreakdownProps {
    expenseBreakdown: ExpenseBreakdownDto | null
}

const ExpenseBreakdownCard: React.FC<ExpenseBreakdownProps> = ({expenseBreakdown}) => {
    const data = {
        labels: expenseBreakdown?.categories.map((category) => category.label),
        datasets:[
            {
                data: expenseBreakdown?.categories.map((category) => category.value),
                backgroundColor: "#E7EAEE",
                borderRadius: 8,
                borderSkipped: false,
                barThickness: 28,
            }
        ]
    }

    return (
        <Card className="rounded-lg border border-[#E7EAEE] max-w-md">
            <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                    Expense Breakdown
                </p>

                <h2 className="text-3xl font-bold mt-2">
                    ${expenseBreakdown?.total.toLocaleString()}
                </h2>

                <p className="text-sm text-[#5CB176] mt-1">
                    This Month <span className="text-[#5CB176]">+{expenseBreakdown?.change}%</span>
                </p>

                <Bar
                    data={data}
                    options={{
                        plugins: {legend: { display: false }},
                        scales: {
                            x: {display: true, grid: {display: false}},
                            y: {display: false, beginAtZero: true}
                        }
                    }}
                />
            </CardContent>
        </Card>
    )
}

export default ExpenseBreakdownCard;