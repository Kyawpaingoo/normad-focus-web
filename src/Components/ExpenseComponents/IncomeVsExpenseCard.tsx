import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import type { IncomeVSExpenseDto } from "../../dtos/expenseDtos";
import { Card, CardContent } from "@/components/ui/card";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface IncomeVsExpenseProps {
    incomeVsExpense: IncomeVSExpenseDto | null
}

const IncomeVsExpenseCard: React.FC<IncomeVsExpenseProps> = ({incomeVsExpense}) => {
    const data = {
        labels: incomeVsExpense?.months,
        datasets: [
            {
                data: incomeVsExpense?.values,
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
                    Income Vs Expense
                </p>

                <h2 className="text-3xl font-bold mt-2">
                    ${incomeVsExpense?.total.toLocaleString()}
                </h2>

                <p className="text-sm text-[#5CB176] mt-1">
                    Last 6 months <span className="text-[#5CB176]">+{incomeVsExpense?.change}%</span>
                </p>

                <Bar
                    data={data}
                    options={{
                        plugins: {legend: {display: false}},
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

export default IncomeVsExpenseCard;