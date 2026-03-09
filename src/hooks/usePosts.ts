import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { FiltersState } from "@/app/store/filters";
import {
    getPosts,
    getPostById,
    type GetPostsParams,
} from "@/features/posts/services/postsApi";

export function buildGetPostsParams(f: FiltersState): GetPostsParams {
    const province = !f.province || f.province === "Toàn quốc" ? undefined : f.province;
    const brand =
        f.brands && f.brands.length > 0 ? f.brands.join(",") : undefined;
    return {
        q: f.q?.trim() || undefined,
        province,
        district: f.district || undefined,
        brand,
        model: f.model,
        minPrice: f.minPrice,
        maxPrice: f.maxPrice,
        cosmetic: f.cosmetic,
        batteryMin: f.batteryMin,
        sort: f.sort,
        limit: 20,
    };
}

export function usePostsInfinite(filters: FiltersState) {
    const params = buildGetPostsParams(filters);

    return useInfiniteQuery({
        queryKey: ["posts", params],
        queryFn: ({ pageParam }) =>
            getPosts({ ...params, cursor: pageParam as string | undefined }),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (last) => last.nextCursor || undefined,
    });
}

export function usePostDetail(id: string | undefined) {
    return useQuery({
        queryKey: ["post", id],
        queryFn: () => getPostById(id!),
        enabled: !!id,
    });
}
