import { useMemo } from "react";
import { PostCard } from "./ui/PostCard";
import { mockPosts } from "./ui/mockPosts";
import { useFilters } from "../../../app/store/filters";
import { useUrlSyncFilters } from "../../../shared/hooks/useUrlSyncFilters";
import { norm } from "../../../shared/utils/normalize";

export function FeedPage() {
    useUrlSyncFilters();
    const f = useFilters();

    const items = useMemo(() => {
        let xs = [...mockPosts];

        // search q
        if (f.q.trim()) {
            const q = norm(f.q.trim());
            xs = xs.filter((p) => norm(p.title).includes(q) || norm(p.brand).includes(q));
        }

        // location
        if (f.province !== "Toàn quốc") {
            xs = xs.filter((p) => p.province === f.province);
            if (f.district) xs = xs.filter((p) => p.district === f.district);
        }

        // brand/model
        if (f.brand) xs = xs.filter((p) => p.brand === f.brand);
        if (f.model) xs = xs.filter((p) => norm(`${p.brand} ${p.title}`).includes(norm(f.model)));

        // price
        if (typeof f.minPrice === "number") xs = xs.filter((p) => p.price >= f.minPrice!);
        if (typeof f.maxPrice === "number") xs = xs.filter((p) => p.price <= f.maxPrice!);

        // condition
        if (f.cosmetic) xs = xs.filter((p) => p.cosmetic === f.cosmetic);
        if (typeof f.batteryMin === "number") xs = xs.filter((p) => p.batteryPercent >= f.batteryMin!);

        // sort
        xs.sort((a, b) => {
            if (f.sort === "price_asc") return a.price - b.price;
            if (f.sort === "price_desc") return b.price - a.price;
            if (f.sort === "trust") return b.aiScore - a.aiScore;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        return xs;
    }, [f.q, f.province, f.district, f.brand, f.model, f.minPrice, f.maxPrice, f.cosmetic, f.batteryMin, f.sort]);

    return (
        <div className="mx-auto max-w-[720px] px-3 py-3 space-y-2">
            <div className="text-[12px] text-ct-sub">{items.length} tin</div>

            {items.map((p) => (
                <PostCard key={p.id} item={p} />
            ))}

            {items.length === 0 && (
                <div className="bg-white border border-ct-line rounded-2xl shadow-ct p-4 text-[13px] text-ct-sub">
                    Không có tin phù hợp. Thử xóa lọc hoặc chuyển sang Toàn quốc.
                </div>
            )}
        </div>
    );
}
