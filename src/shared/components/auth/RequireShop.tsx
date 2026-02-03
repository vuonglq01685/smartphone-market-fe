import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function RequireShop({ children }: { children: React.ReactNode }) {
    const { isAuthed, isShop } = useAuth();
    const loc = useLocation();
    const returnTo = `${loc.pathname}${loc.search}`;

    if (!isAuthed) return <Navigate to={`/login?returnTo=${encodeURIComponent(returnTo)}`} replace />;
    if (!isShop) return <Navigate to="/" replace />;
    return <>{children}</>;
}
