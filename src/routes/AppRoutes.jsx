import { Route, Routes, Navigate } from "react-router-dom";
import Register from "../pages/auth/RegisterPage";
import Login from "../pages/auth/LoginPage";
import { useAuth } from "../hooks/UseAuth";
import Home from "../pages/home/Home";
import PrivateRoute from "./PrivateRoutes";


export default function AppRoutes(){

    const {isAuthenticated} = useAuth();

    return(
        <Routes>
            <Route
                path="/register"
                element={
                    isAuthenticated ? <Navigate  to="/home"/> : <Register/>
                }
            />

            <Route
                path="/login"
                element={
                    isAuthenticated ? <Navigate  to="/home"/> : <Login/>
                }
            />

            <Route
                path="/home"
                element={
                    <PrivateRoute>
                        <Home/>
                    </PrivateRoute>
                }
            />

            <Route path="*" element={<Navigate to="/login"/>} />
        </Routes>
    )
}