export type UserRole = "personal" | "shop" | "admin";

export type AuthUser = {
    id: string;
    name?: string | null;
    phone?: string | null;
    role?: UserRole | string | null;
};

export type LoginResponse = {
    accessToken?: string | null;
    tokenType?: string | null;
    expiresIn: number;
    user: AuthUser;
};

export type LoginPayload = {
    phone: string;
    password: string; // 6 digits
};

export type RegisterPayload = {
    name: string;
    phone: string;
    password: string; // 6 digits
    role: "Personal" | "Shop"; // swagger enum UserRole: Personal/Shop/Admin
};
