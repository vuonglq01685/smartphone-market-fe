import { useRef, useEffect } from "react";
import { useFilters } from "../../../app/store/filters";
import { useUrlSyncFilters } from "../../../shared/hooks/useUrlSyncFilters";
import { usePostsInfinite } from "../../../hooks/usePosts";
import { PostCard } from "./ui/PostCard";

export function FeedPage() {
    useUrlSyncFilters();
    const f = useFilters();
    const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
        usePostsInfinite(f);

    const items = data?.pages.flatMap((p) => p.items) ?? [];
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!hasNextPage || isFetchingNextPage) return;
        const el = loadMoreRef.current;
        if (!el) return;
        const ob = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) fetchNextPage();
            },
            { rootMargin: "200px" }
        );
        ob.observe(el);
        return () => ob.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) {
        return (
            <div className="mx-auto max-w-219 px-3 py-8 flex justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-ct-yellow border-t-transparent rounded-full" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mx-auto max-w-219 px-3 py-8 text-center">
                <p className="text-red-600 text-[13px] mb-2">Không tải được tin. Vui lòng thử lại.</p>
                <button
                    onClick={() => refetch()}
                    className="rounded-2xl bg-ct-yellow px-4 py-2 text-[14px] font-semibold"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-219 px-3 py-3 space-y-2">
            <div className="text-[12px] text-ct-sub">{items.length} tin</div>

            {items.map((p) => (
                <PostCard key={p.id} item={mapPostItem(p)} />
            ))}

            {items.length === 0 && (
                <div className="bg-white border border-ct-line rounded-2xl shadow-ct p-4 text-[13px] text-ct-sub">
                    Không có tin phù hợp. Thử xóa lọc hoặc chuyển sang Toàn quốc.
                </div>
            )}

            {hasNextPage && (
                <div ref={loadMoreRef} className="py-4 flex justify-center">
                    {isFetchingNextPage ? (
                        <div className="animate-spin w-6 h-6 border-2 border-ct-yellow border-t-transparent rounded-full" />
                    ) : null}
                </div>
            )}
        </div>
    );
}

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/160x160?text=No+Image";

type AccountLabel = "verified-shop" | "shop" | "personal";

function mapPostItem(p: {
    id: string;
    title: string;
    price: number;
    brand: string;
    model: string;
    province: string;
    district: string;
    thumbnailUrl?: string | null;
    createdAt: string;
    aiScore: number;
    escrowEnabled: boolean;
    seller?: { badge?: string; type?: string };
}) {
    const badge = p.seller?.badge ?? "none";
    const accountLabel: AccountLabel =
        badge === "verified_shop"
            ? "verified-shop"
            : p.seller?.type === "shop"
              ? "shop"
              : "personal";
    return {
        id: p.id,
        title: p.title,
        brand: p.brand,
        price: p.price,
        province: p.province,
        district: p.district,
        imageUrl: p.thumbnailUrl || PLACEHOLDER_IMAGE,
        createdAt: p.createdAt,
        accountLabel,
        aiScore: p.aiScore,
        escrowEnabled: p.escrowEnabled,
        cosmetic: 95,
        batteryPercent: 85,
    };
}
