import { Route, Routes, Navigate } from "react-router-dom";
import Register from "../pages/auth/RegisterPage";
import Login from "../pages/auth/LoginPage";
import { useAuth } from "../hooks/UseAuth";
import Home from "../pages/home/Home";
import PrivateRoute from "./PrivateRoutes";
import ManagerSupplier from "../pages/Supplier/ManageSupplier";
import UpdateSupplier from "../pages/Supplier/UpdateSupplier";
import CreateSupplier from "../pages/Supplier/CreateSupplier";
import ManagerItem from "../pages/Item/ManagerItem";
import UpdateItem from "../pages/Item/UpdateItem";
import CreateItem from "../pages/Item/CreateItem";


export default function AppRoutes() {

    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route
                path="/register"
                element={
                    isAuthenticated ? <Navigate to="/home" /> : <Register />
                }
            />

            <Route
                path="/login"
                element={
                    isAuthenticated ? <Navigate to="/home" /> : <Login />
                }
            />

            <Route
                path="/home"
                element={
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                }
            />

            <Route
                path="/manager/supplier"
                element={
                    <PrivateRoute>
                        <ManagerSupplier />
                    </PrivateRoute>
                }
            />

            <Route
                path="/update/supplier/:id"
                element={
                    <PrivateRoute>
                        <UpdateSupplier />
                    </PrivateRoute>
                }
            />

            <Route
                path="/create/supplier"
                element={
                    <PrivateRoute>
                        <CreateSupplier />
                    </PrivateRoute>
                }
            />

            <Route
                path="/manager/item"
                element={
                    <PrivateRoute>
                        <ManagerItem />
                    </PrivateRoute>
                }
            />

            <Route
                path="/update/item/:id"
                element={
                    <PrivateRoute>
                        <UpdateItem />
                    </PrivateRoute>
                }
            />

            <Route
                path="/create/item"
                element={
                    <PrivateRoute>
                        <CreateItem />
                    </PrivateRoute>
                }
            />

            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    )
}