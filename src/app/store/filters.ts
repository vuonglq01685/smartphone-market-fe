import { create } from "zustand";

export type SortKey = "new" | "price_asc" | "price_desc" | "trust";
export type Cosmetic = "99" | "95" | "90" | "lt90";

export type FiltersState = {
    q: string; // Applied search – only used for API when user clicks search
    qInput: string; // Draft – what user is typing (display only)
    province: string;
    district: string;

    brands: string[];
    model?: string;

    minPrice?: number;
    maxPrice?: number;

    cosmetic?: Cosmetic;
    batteryMin?: number;

    sort: SortKey;

    applySearch: () => void; // Apply qInput → q (trigger API)
    set: <K extends keyof Omit<FiltersState, "set" | "reset" | "toggleBrand" | "applySearch">>(
        key: K,
        value: FiltersState[K]
    ) => void;
    toggleBrand: (brand: string) => void;

    reset: () => void;
};

export const useFilters = create<FiltersState>((set) => ({
    q: "",
    qInput: "",
    province: "Toàn quốc",
    district: "",
    brands: [],
    model: undefined,

    minPrice: undefined,
    maxPrice: undefined,

    cosmetic: undefined,
    batteryMin: undefined,

    sort: "new",

    applySearch: () =>
        set((s) => ({ q: (s.qInput ?? "").trim() })),
    set: (key, value) => set({ [key]: value } as any),

    toggleBrand: (brand) =>
        set((s) => {
            const next = s.brands.includes(brand)
                ? s.brands.filter((b) => b !== brand)
                : [...s.brands, brand];
            return { brands: next, model: next.length ? s.model : undefined };
        }),

    reset: () =>
        set({
            q: "",
            qInput: "",
            province: "Toàn quốc",
            district: "",
            brands: [],
            model: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            cosmetic: undefined,
            batteryMin: undefined,
            sort: "new",
        }),
}));
