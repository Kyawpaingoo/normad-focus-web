import { Card, CardContent, Typography } from "@mui/material";
import { incomeVsExpense } from "../DummyData/expenseData";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);


const IncomeVsExpenseCard: React.FC = () => {
    const data = {
        labels: incomeVsExpense.months,
        datasets: [
            {
                data: incomeVsExpense.values,
                backgroundColor: "#E7EAEE",
                borderRadius: 8,
                borderSkipped: false,
                barThickness: 28,
            }
        ]
    }

    return (
        <Card elevation={0} sx={{borderRadius: 2, border: '1px solid #E7EAEE', maxWidth: 'md'}}>
            <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                    Income Vs Exepsne
                </Typography>

                <Typography variant="h4" sx={{fontWeight: 700, mt: 1}}>
                    ${incomeVsExpense.total.toLocaleString()}
                </Typography>

                <Typography variant="subtitle2" sx={{color: "#5CB176", mt: 0.5}}>
                    Last 6 months <span style={{color: "#5CB176"}}>+{incomeVsExpense.change}%</span>
                </Typography>

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