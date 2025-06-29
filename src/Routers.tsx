import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./Layout/ProtectedRout";
import MainLayout from "./Layout/MainLayout";
import AuthLayout from "./Layout/AuthLayout";
import Login from "./Pages/login";
import Register from "./Pages/register";
import Home from "./Pages/Home";
import ExpenseDashboard from "./Pages/Expense/Expense";

const router = createBrowserRouter([
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    {
                        path: '/',
                        element: <Home />
                    },
                    {
                        path: '/expense',
                        element: <ExpenseDashboard />
                    }
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