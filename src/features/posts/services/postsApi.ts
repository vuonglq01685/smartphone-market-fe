import { apiFetch } from "@/shared/utils/api";

export type UploadImageResult = { key?: string | null; publicUrl?: string | null };

export async function uploadImage(file: File): Promise<UploadImageResult> {
    const fd = new FormData();
    fd.append("File", file);
    return apiFetch<UploadImageResult>("/api/uploads", { method: "POST", body: fd, auth: true });
}

// CreatePostCommand theo swagger (tối thiểu)
export type CreatePostImageInput = { kind: "Front" | "Back" | "Edge" | "Imei" | "Battery" | "Gallery"; url: string; sortOrder: number };
export type CreatePostPayload = {
    type: "Sell" | "Buy";
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
};

export async function createPost(payload: CreatePostPayload) {
    return apiFetch("/api/posts", { method: "POST", body: JSON.stringify(payload), auth: true });
}
