export type ApiError = {
    status?: number;
    title?: string;
    detail?: string;
};

export function getErrorMessage(error: unknown, fallback: string): string {
    if (error && typeof error === "object") {
        const apiError = error as ApiError;
        return apiError.detail || apiError.title || fallback;
    }
    return fallback;
}

