import { create } from "zustand";

export type SortKey = "new" | "price_asc" | "price_desc" | "trust";
export type Cosmetic = "99" | "95" | "90" | "lt90";

export type FiltersState = {
    q: string;
    province: string;
    district: string;

    brand?: string;
    model?: string;

    minPrice?: number;
    maxPrice?: number;

    cosmetic?: Cosmetic;
    batteryMin?: number;

    sort: SortKey;

    set: <K extends keyof Omit<FiltersState, "set" | "reset">>(
        key: K,
        value: FiltersState[K]
    ) => void;

    reset: () => void;
};

export const useFilters = create<FiltersState>((set) => ({
    q: "",
    province: "Toàn quốc",
    district: "",
    brand: undefined,
    model: undefined,

    minPrice: undefined,
    maxPrice: undefined,

    cosmetic: undefined,
    batteryMin: undefined,

    sort: "new",

    set: (key, value) => set({ [key]: value } as any),

    reset: () =>
        set({
            q: "",
            province: "Toàn quốc",
            district: "",
            brand: undefined,
            model: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            cosmetic: undefined,
            batteryMin: undefined,
            sort: "new",
        }),
}));
