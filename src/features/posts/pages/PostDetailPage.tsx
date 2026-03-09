import React from "react";
import { Link, useParams } from "react-router-dom";
import { usePostDetail } from "../../../hooks/usePosts";
import { formatVnd } from "../../../shared/utils/money";
import { timeAgo } from "../../../shared/utils/timeAgo";
import { Gallery } from "@/shared/components/Gallery";
import { MdAccessTime, MdLocationOn } from "react-icons/md";
// --- Helper Functions ---
const getCosmeticLabel = (v: number | null | undefined): string => {
    if (v == null) return "-";
    return v === 1 ? "<90%" : `${v}%`;
};
const getAccountLabel = (badge: string, type?: string): string =>
    badge === "verified_shop" ? "Cửa hàng uy tín" : badge === "verified" ? "Đã xác minh" : type === "shop" ? "Cửa hàng" : "Cá nhân";

// --- Reusable UI Components ---
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
    <div className={`bg-white border border-ct-line rounded-2xl shadow-ct p-3 ${className}`}>{children}</div>
);
const InfoAttribute: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="rounded-xl border border-ct-line bg-ct-chip px-3 py-2">
        <div className="text-[11px] text-ct-sub">{label}</div>
        <div className="text-[13px] font-extrabold">{value}</div>
    </div>
);
const PostNotFound: React.FC = () => (
    <div className="mx-auto max-w-[720px] px-3 py-3">
        <Card className="p-4">
            <div className="font-extrabold">Không tìm thấy tin</div>
            <Link className="text-[13px] underline text-ct-sub" to="/">
                Quay lại trang chủ
            </Link>
        </Card>
    </div>
);

export function PostDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { data: post, isLoading, isError } = usePostDetail(id);

    if (isLoading) {
        return (
            <div className="mx-auto max-w-240 px-3 py-8 flex justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-ct-yellow border-t-transparent rounded-full" />
            </div>
        );
    }

    if (isError || !post) {
        return <PostNotFound />;
    }

    const images = post.images?.length ? post.images.map((i) => i.url) : ["https://via.placeholder.com/400x400?text=Không+có+ảnh"];

    return (
        <div className="mx-auto max-w-240 px-3 py-3">
            <div className="mb-2">
                <Link to="/" className="text-[13px] font-semibold text-ct-sub underline">
                    ← Quay lại
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-[60%] w-full min-w-0">
                    <div className="bg-white border border-ct-line rounded-2xl shadow-ct overflow-hidden">
                        <Gallery images={images} />
                    </div>
                </div>

                <div className="md:w-[40%] w-full min-w-0 flex flex-col gap-3">
                    <Card>
                        <div className="mt-1 text-[18px] text-[#EF305D] font-bold">{formatVnd(post.price)}</div>
                        <div className="mt-1 text-[15px] font-extrabold">{post.brand} • {post.model} {post.storageGb}GB</div>
                        <div className="mt-2 text-[12px] text-ct-sub flex items-center gap-2">
                            <span className="flex items-center gap-1">
                                <MdLocationOn className="w-4 h-4 text-[#fbbf24]" />
                                {post.district ? `${post.district}, ` : ""}{post.province}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <MdAccessTime className="w-4 h-4 text-[#8c8c8c]" />
                                {timeAgo(post.createdAt)}
                            </span>
                        </div>
                    </Card>
                    <Card>
                        <div className="grid grid-cols-2 gap-2 text-[13px]">
                            <InfoAttribute label="Pin" value={post.batteryPercent != null ? `${post.batteryPercent}%` : "-"} />
                            <InfoAttribute label="Ngoại hình" value={getCosmeticLabel(post.cosmetic)} />
                            <InfoAttribute label="Uy tín" value={`${post.aiScore}/100`} />
                            <InfoAttribute label="Trung gian" value={post.escrowEnabled ? "Có" : "Không"} />
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-ct-chip border border-ct-line" />
                            <div className="min-w-0">
                                <div className="text-[14px] font-extrabold">Người bán</div>
                                <div className="text-[12px] text-ct-sub">{post.seller.name}</div>
                            </div>
                            <span className="ml-auto text-[11px] px-2 py-1 rounded-full bg-ct-chip border border-ct-line">
                                {getAccountLabel(post.seller.badge, post.seller.type)}
                            </span>
                        </div>
                    </Card>
                    <Card>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="rounded-2xl border border-ct-line bg-white px-3 py-3 text-[14px] font-extrabold active:scale-[.99]">Chat</button>
                            <button className="rounded-2xl bg-ct-yellow px-3 py-3 text-[14px] font-extrabold active:scale-[.99]">Gọi điện</button>
                        </div>
                        {post.escrowEnabled && (
                            <button className="mt-2 w-full rounded-2xl bg-black text-white px-3 py-3 text-[14px] font-extrabold active:scale-[.99]">
                                Mua qua trung gian
                            </button>
                        )}
                        <button className="mt-2 w-full rounded-2xl border border-ct-line bg-white px-3 py-3 text-[13px] font-semibold text-ct-sub active:scale-[.99]">
                            Báo cáo tin
                        </button>
                    </Card>
                    <Card>
                        <div className="text-[14px] font-extrabold">Mô tả</div>
                        <div className="mt-2 text-[13px] text-ct-text leading-relaxed">
                            {post.description || "Chưa có mô tả"}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}