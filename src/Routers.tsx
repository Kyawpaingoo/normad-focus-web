import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./Layout/ProtectedRout";
import MainLayout from "./Layout/MainLayout";
import AuthLayout from "./Layout/AuthLayout";
import Login from "./Pages/login";
import Register from "./Pages/register";
import ExpenseDashboard from "./Pages/Expense/Expense";
import TaskBoard from "./Pages/TaskBoard/TaskBoard";
import MeetingSchedule from "./Pages/MeetingSchedule/MeetingSchedule";
import CountryLog from "./Pages/CountryLog/CountryLog";

const router = createBrowserRouter([
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    {
                        path: '/',
                        element: <Navigate to="/task" replace />
                    },
                    {
                        path: '/expense',
                        element: <ExpenseDashboard />
                    },
                    {
                        path: '/task',
                        element: <TaskBoard />
                    },
                    {
                        path: '/meeting',
                        element: <MeetingSchedule />
                    },
                    {
                        path: '/country-log',
                        element: <CountryLog />
                    },
                ]
            }
        ]
    },
    {
        element: <AuthLayout />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            }
        ]
    }
]);
export default router;