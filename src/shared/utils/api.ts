import { env } from "../../config/env";

function getToken() {
    return localStorage.getItem("spm_token") ?? "";
}

export async function apiFetch<T>(path: string, init?: RequestInit & { auth?: boolean }): Promise<T> {
    const auth = init?.auth ?? false;
    const headers = new Headers(init?.headers);
    headers.set("Accept", "application/json");

    if (init?.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");

    if (auth) {
        const token = getToken();
        if (token) headers.set("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(`${env.API_BASE_URL}${path}`, { ...init, headers });

    if (!res.ok) {
        let payload: any = null;
        try {
            payload = await res.json();
        } catch {
            // ignore
        }
        throw { status: res.status, title: payload?.title, detail: payload?.detail };
    }

    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
}
