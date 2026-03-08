import { RouterProvider } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { router } from "./app/router.tsx";
import { AuthProvider } from "./shared/contexts/AuthContext";
export default function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
            <ToastContainer />
        </AuthProvider>
    );
}
