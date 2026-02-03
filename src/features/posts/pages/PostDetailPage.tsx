import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { getMockPostById } from "../data/mockRepo";
import { formatVnd } from "../../../shared/utils/money";
import { timeAgo } from "../../../shared/utils/timeAgo";

export function PostDetailPage() {
    const { id } = useParams();
    const post = useMemo(() => (id ? getMockPostById(id) : undefined), [id]);

    if (!post) {
        return (
            <div className="mx-auto max-w-[720px] px-3 py-3">
                <div className="bg-white border border-ct-line rounded-2xl shadow-ct p-4">
                    <div className="font-extrabold">Không tìm thấy tin</div>
                    <Link className="text-[13px] underline text-ct-sub" to="/">
                        Quay lại trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    const cosmeticLabel = post.cosmetic === "lt90" ? "<90%" : `${post.cosmetic}%`;

    return (
        <div className="mx-auto max-w-[960px] px-3 py-3">
            {/* back row */}
            <div className="mb-2">
                <Link to="/" className="text-[13px] font-semibold text-ct-sub underline">
                    ← Quay lại
                </Link>
            </div>

            {/* layout: mobile stack, desktop 2 cols */}
            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_.8fr] gap-3">
                {/* LEFT: gallery */}
                <div className="bg-white border border-ct-line rounded-2xl shadow-ct overflow-hidden">
                    <div className="aspect-[4/3] bg-ct-chip">
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                    </div>
                    <div className="p-3">
                        <div className="flex gap-2 overflow-x-auto no-scrollbar">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-16 w-16 rounded-xl border border-ct-line bg-ct-chip shrink-0"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT: info */}
                <div className="space-y-3">
                    <div className="bg-white border border-ct-line rounded-2xl shadow-ct p-3">
                        <div className="text-[18px] font-extrabold">{formatVnd(post.price)}</div>
                        <div className="mt-1 text-[15px] font-extrabold">
                            {post.brand} • {post.title}
                        </div>

                        <div className="mt-2 text-[12px] text-ct-sub flex items-center gap-2">
              <span>
                {post.district ? `${post.district}, ` : ""}
                  {post.province}
              </span>
                            <span>•</span>
                            <span>{timeAgo(post.createdAt)}</span>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-[13px]">
                            <Info label="Pin" value={`${post.batteryPercent}%`} />
                            <Info label="Ngoại hình" value={cosmeticLabel} />
                            <Info label="Uy tín" value={`${post.aiScore}/100`} />
                            <Info label="Trung gian" value={post.escrowEnabled ? "Có" : "Không"} />
                        </div>
                    </div>

                    {/* seller card */}
                    <div className="bg-white border border-ct-line rounded-2xl shadow-ct p-3">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-ct-chip border border-ct-line" />
                            <div className="min-w-0">
                                <div className="text-[14px] font-extrabold">Người bán</div>
                                <div className="text-[12px] text-ct-sub">Tỷ lệ phản hồi: 90% • 12 tin</div>
                            </div>
                            <span className="ml-auto text-[11px] px-2 py-1 rounded-full bg-ct-chip border border-ct-line">
                {post.accountLabel === "verified-shop"
                    ? "Cửa hàng uy tín"
                    : post.accountLabel === "shop"
                        ? "Cửa hàng"
                        : "Cá nhân"}
              </span>
                        </div>
                    </div>

                    {/* CTA like Chợ Tốt */}
                    <div className="bg-white border border-ct-line rounded-2xl shadow-ct p-3">
                        <div className="grid grid-cols-2 gap-2">
                            <button className="rounded-2xl border border-ct-line bg-white px-3 py-3 text-[14px] font-extrabold active:scale-[.99]">
                                Chat
                            </button>
                            <button className="rounded-2xl bg-ct-yellow px-3 py-3 text-[14px] font-extrabold active:scale-[.99]">
                                Gọi điện
                            </button>
                        </div>

                        {post.escrowEnabled && (
                            <button className="mt-2 w-full rounded-2xl bg-black text-white px-3 py-3 text-[14px] font-extrabold active:scale-[.99]">
                                Mua qua trung gian
                            </button>
                        )}

                        <button className="mt-2 w-full rounded-2xl border border-ct-line bg-white px-3 py-3 text-[13px] font-semibold text-ct-sub active:scale-[.99]">
                            Báo cáo tin
                        </button>
                    </div>

                    {/* description */}
                    <div className="bg-white border border-ct-line rounded-2xl shadow-ct p-3">
                        <div className="text-[14px] font-extrabold">Mô tả</div>
                        <div className="mt-2 text-[13px] text-ct-text leading-relaxed">
                            Máy zin, dùng kỹ. Giao dịch trực tiếp. Có thể test thoải mái.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Info({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-ct-line bg-ct-chip px-3 py-2">
            <div className="text-[11px] text-ct-sub">{label}</div>
            <div className="text-[13px] font-extrabold">{value}</div>
        </div>
    );
}
