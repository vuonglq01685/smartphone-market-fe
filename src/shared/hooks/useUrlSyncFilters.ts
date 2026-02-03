import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useFilters } from "../../app/store/filters";
import type { SortKey, Cosmetic } from "../../app/store/filters";

function toNum(v: string | null) {
    if (!v) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
}

function toSortKey(v: string | null): SortKey {
    if (v === "price_asc" || v === "price_desc" || v === "trust" || v === "new") return v;
    return "new";
}

function toCosmetic(v: string | null): Cosmetic | undefined {
    if (v === "99" || v === "95" || v === "90" || v === "lt90") return v;
    return undefined;
}

export function useUrlSyncFilters() {
    const [sp, setSp] = useSearchParams();
    const f = useFilters();

    useEffect(() => {
        f.set("q", sp.get("q") ?? "");
        f.set("province", sp.get("province") ?? "Toàn quốc");
        f.set("district", sp.get("district") ?? "");

        f.set("brand", sp.get("brand") ?? undefined);
        f.set("model", sp.get("model") ?? undefined);

        f.set("minPrice", toNum(sp.get("minPrice")));
        f.set("maxPrice", toNum(sp.get("maxPrice")));

        f.set("cosmetic", toCosmetic(sp.get("cosmetic")));
        f.set("batteryMin", toNum(sp.get("batteryMin")));

        f.set("sort", toSortKey(sp.get("sort")));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const next: Record<string, string> = {};

        if (f.q) next.q = f.q;
        if (f.province && f.province !== "Toàn quốc") next.province = f.province;
        if (f.district) next.district = f.district;

        if (f.brand) next.brand = f.brand;
        if (f.model) next.model = f.model;

        if (typeof f.minPrice === "number") next.minPrice = String(f.minPrice);
        if (typeof f.maxPrice === "number") next.maxPrice = String(f.maxPrice);

        if (f.cosmetic) next.cosmetic = f.cosmetic;
        if (typeof f.batteryMin === "number") next.batteryMin = String(f.batteryMin);

        if (f.sort && f.sort !== "new") next.sort = f.sort;

        setSp(next, { replace: true });
    }, [
        f.q,
        f.province,
        f.district,
        f.brand,
        f.model,
        f.minPrice,
        f.maxPrice,
        f.cosmetic,
        f.batteryMin,
        f.sort,
        setSp,
    ]);
}
