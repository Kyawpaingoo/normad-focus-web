import type React from "react";
import { expenseBreakdown } from "../DummyData/expenseData";
import { Card, CardContent, Typography } from "@mui/material";
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


const ExpenseBreakdownCard: React.FC = () => {
    const data = {
        labels: expenseBreakdown.categories.map((category) => category.label),
        datasets:[
            {
                data: expenseBreakdown.categories.map((category) => category.value),
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
                <Typography variant='subtitle2' color="text.secondary">
                    Expense Breakdown
                </Typography>

                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                    ${expenseBreakdown.total.toLocaleString()}
                </Typography>

                <Typography variant="subtitle2" sx={{ color: "#5CB176", mt: 0.5 }}>
                    This Month <span style={{ color: "#5CB176" }}>+{expenseBreakdown.change}%</span>
                </Typography>

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