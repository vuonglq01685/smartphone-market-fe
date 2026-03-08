import React from "react";
import { Link } from "react-router-dom";
import { timeAgo } from "../../../../shared/utils/timeAgo";
import { formatVnd } from "../../../../shared/utils/money";
import { MdLocationOn, MdAccessTime } from "react-icons/md";

// --- Type Definitions ---
// Giả định cấu trúc của PostItem dựa trên cách sử dụng trong component.
// Việc định nghĩa type này ở một file dùng chung (ví dụ: types.ts) là thực tiễn tốt nhất.
type AccountLabel = "verified-shop" | "shop" | "personal";
type CosmeticValue = "lt90" | number;

export interface PostItem {
    id: string;
    imageUrl: string; // Thêm imageUrl để component linh hoạt hơn
    brand: string;
    title: string;
    price: number;
    district?: string;
    province: string;
    createdAt: string;
    accountLabel: AccountLabel;
    aiScore: number;
    batteryPercent: number;
    cosmetic: CosmeticValue;
    escrowEnabled: boolean;
}

// --- Constants & Helpers ---
// Tách biệt logic và các giá trị hằng số ra khỏi JSX.
const ACCOUNT_TYPE_LABELS: Record<AccountLabel, string> = {
    "verified-shop": "Cửa hàng uy tín",
    shop: "Cửa hàng",
    personal: "Cá nhân",
};

const getAccountLabel = (accountType: AccountLabel): string => ACCOUNT_TYPE_LABELS[accountType];
const getCosmeticLabel = (cosmeticValue: CosmeticValue): string => cosmeticValue === "lt90" ? "<90%" : `${cosmeticValue}%`;

// --- Reusable Sub-components ---

/**
 * Một component nhỏ, tái sử dụng được để hiển thị các "badge" thuộc tính.
 * Tuân thủ nguyên tắc DRY (Don't Repeat Yourself).
 * @param {object} props - Props cho component.
 * @param {React.ReactNode} props.children - Nội dung hiển thị bên trong badge.
 * @param {string} [props.className] - Class CSS tùy chọn để tùy chỉnh style.
 */
const PostAttributeBadge: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = "",
}) => (
    <span
        className={`text-[11px] px-2 py-1 rounded-full bg-ct-chip border border-ct-line ${className}`}
    >
        {children}
    </span>
);

// --- Main Component ---

/**
 * Hiển thị một card tóm tắt thông tin bài đăng.
 * @param {{ item: PostItem }} props - Dữ liệu của bài đăng cần hiển thị.
 */
export function PostCard({ item }: { item: PostItem }) {
    return (
        <Link to={`/posts/${item.id}`} className="block group">
            <div className="bg-white border border-ct-line rounded-2xl shadow-ct overflow-hidden transition-transform duration-150 ease-in-out group-active:scale-[.997]">
                <div className="flex py-4 px-5">
                    {/* Image Section */}
                    <div className="bg-ct-chip shrink-0">
                        <img
                            className="w-40 h-40 rounded-xl object-cover"
                            // Trong thực tế, URL hình ảnh nên đến từ `item.imageUrl`
                            src={item.imageUrl}
                            alt={`${item.brand} ${item.title}`}
                        />
                    </div>

                    {/* Info Section */}
                    <div className="pl-3 flex-1 min-w-0">
                        <h3 className="text-[20px] font-semibold line-clamp-2" title={item.title}>
                            {item.brand} • {item.title}
                        </h3>

                        <div className="mt-1 text-[18px] text-[#EF305D] font-bold">
                            {formatVnd(item.price)}
                        </div>

                        {/* Metadata */}
                        <div className="mt-1 text-[14px] text-[#8c8c8c] flex items-center gap-2">
                            <span className="flex items-center gap-1">
                                <MdLocationOn className="w-4 h-4 text-[#fbbf24]" />
                                {item.district ? `${item.district}, ` : ""}
                                {item.province}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <MdAccessTime className="w-4 h-4 text-[#8c8c8c]" />
                                {timeAgo(item.createdAt)}
                            </span>
                        </div>

                        {/* Attributes / Badges */}
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <PostAttributeBadge>{getAccountLabel(item.accountLabel)}</PostAttributeBadge>
                            <PostAttributeBadge>Uy tín {item.aiScore}/100</PostAttributeBadge>
                            <PostAttributeBadge>Pin {item.batteryPercent}%</PostAttributeBadge>
                            <PostAttributeBadge>Ngoại hình {getCosmeticLabel(item.cosmetic)}</PostAttributeBadge>
                            {item.escrowEnabled && (
                                <PostAttributeBadge className="bg-ct-yellow/25 border-ct-yellow">
                                    Trung gian
                                </PostAttributeBadge>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}