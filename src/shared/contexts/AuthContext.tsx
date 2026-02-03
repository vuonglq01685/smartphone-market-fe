import type { ReactNode } from "react";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../utils/api";

export type UserRole = "personal" | "shop" | "admin";

export type AuthUser = {
    id: string;
    name?: string | null;
    phone?: string | null;
    role?: UserRole | string | null;
};

export type LoginPayload = { phone: string; password: string };
export type RegisterPayload = { name: string; phone: string; password: string; role: "Personal" | "Shop" };

export type AuthState = {
    user: AuthUser | null;
    token: string | null;
    isAuthed: boolean;
    isShop: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => void;
};

type LoginResponse = {
    accessToken?: string | null;
    expiresIn: number;
    user: AuthUser;
};

export const AuthContext = createContext<AuthState | null>(null);


const LS_TOKEN = "spm_token";
const LS_USER = "spm_user";

function normalizeRole(role: unknown): UserRole | string {
    const r = String(role ?? "").toLowerCase();
    if (r === "shop") return "shop";
    if (r === "personal") return "personal";
    if (r === "admin") return "admin";
    return r;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        const t = localStorage.getItem(LS_TOKEN);
        const u = localStorage.getItem(LS_USER);
        if (t) setToken(t);
        if (u) {
            try {
                setUser(JSON.parse(u));
            } catch {
                // ignore
            }
        }
    }, []);

    const isAuthed = !!token && !!user;
    const isShop = normalizeRole(user?.role) === "shop";

    const login = useCallback(async (payload: LoginPayload) => {
        const res = await apiFetch<LoginResponse>("/api/users/login", {
            method: "POST",
            body: JSON.stringify(payload),
        });

        const t = res.accessToken ?? "";
        if (!t) throw { status: 500, title: "Missing token", detail: "Login response missing accessToken" };

        const u: AuthUser = { ...res.user, role: normalizeRole(res.user?.role) };
        setToken(t);
        setUser(u);
        localStorage.setItem(LS_TOKEN, t);
        localStorage.setItem(LS_USER, JSON.stringify(u));
    }, []);

    const register = useCallback(async (payload: RegisterPayload) => {
        await apiFetch("/api/users", { method: "POST", body: JSON.stringify(payload) });
        await login({ phone: payload.phone, password: payload.password });
    }, [login]);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem(LS_TOKEN);
        localStorage.removeItem(LS_USER);
    }, []);

    const value = useMemo<AuthState>(
        () => ({ user, token, isAuthed, isShop, login, register, logout }),
        [user, token, isAuthed, isShop, login, register, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

