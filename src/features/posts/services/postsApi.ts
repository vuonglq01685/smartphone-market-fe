import { apiFetch } from "@/shared/utils/api";

export type UploadImageResult = { key?: string | null; publicUrl?: string | null };

export async function uploadImage(file: File): Promise<UploadImageResult> {
    const fd = new FormData();
    fd.append("File", file);
    return apiFetch<UploadImageResult>("/api/uploads", { method: "POST", body: fd, auth: true });
}

// --- GET Posts ---
export type GetPostsParams = {
    q?: string;
    province?: string;
    district?: string;
    brand?: string;
    model?: string;
    minPrice?: number;
    maxPrice?: number;
    cosmetic?: string;
    batteryMin?: number;
    sort?: string;
    cursor?: string;
    limit?: number;
};

export type SellerDto = { id: string; name: string; type: string; isVerified: boolean; badge: string };
export type PostListItemDto = {
    id: string;
    title: string;
    price: number;
    brand: string;
    model: string;
    storageGb: number;
    province: string;
    district: string;
    thumbnailUrl?: string;
    aiScore: number;
    escrowEnabled: boolean;
    createdAt: string;
    seller: SellerDto;
};

export type PagedResult<T> = { items: T[]; nextCursor?: string | null };

export async function getPosts(params: GetPostsParams): Promise<PagedResult<PostListItemDto>> {
    const search = new URLSearchParams();
    if (params.q) search.set("q", params.q);
    if (params.province) search.set("province", params.province);
    if (params.district) search.set("district", params.district);
    if (params.brand) search.set("brand", params.brand);
    if (params.model) search.set("model", params.model);
    if (params.minPrice != null) search.set("minPrice", String(params.minPrice));
    if (params.maxPrice != null) search.set("maxPrice", String(params.maxPrice));
    if (params.cosmetic) search.set("cosmetic", params.cosmetic);
    if (params.batteryMin != null) search.set("batteryMin", String(params.batteryMin));
    if (params.sort) search.set("sort", params.sort);
    if (params.cursor) search.set("cursor", params.cursor);
    search.set("limit", String(params.limit ?? 20));
    const qs = search.toString();
    return apiFetch<PagedResult<PostListItemDto>>(`/api/posts${qs ? `?${qs}` : ""}`);
}

// --- GET Post by ID ---
export type PostImageDto = { kind: number; url: string; sortOrder: number };
export type PostDetailDto = {
    id: string;
    brand: string;
    model: string;
    storageGb: number;
    price: number;
    province: string;
    district: string;
    cosmetic?: number | null;
    screen?: number | null;
    batteryPercent?: number | null;
    batteryStatus?: number | null;
    escrowEnabled: boolean;
    aiScore: number;
    description: string;
    createdAt: string;
    seller: SellerDto;
    images: PostImageDto[];
};

export async function getPostById(id: string): Promise<PostDetailDto | null> {
    try {
        return await apiFetch<PostDetailDto>(`/api/posts/${id}`);
    } catch (e: unknown) {
        if (e && typeof e === "object" && "status" in e && e.status === 404) return null;
        throw e;
    }
}

// --- Create Post ---
export type CreatePostImageInput = { kind: number; url: string; sortOrder: number };
export type CreatePostPayload = {
    type: number; // 1=Sell, 2=Buy
    userId: string;
    brand: string;
    model: string;
    storageGb: number;
    price: number;
    province: string;
    district?: string;
    escrowEnabled: boolean;
    description: string;
    images: CreatePostImageInput[];
    cosmetic?: number;
    screen?: number;
    batteryPercent?: number;
    batteryStatus?: number;
    biometric?: number;
    origin?: number;
};

export async function createPost(payload: CreatePostPayload): Promise<{ id: string }> {
    return apiFetch<{ id: string }>("/api/posts", { method: "POST", body: JSON.stringify(payload), auth: true });
}
