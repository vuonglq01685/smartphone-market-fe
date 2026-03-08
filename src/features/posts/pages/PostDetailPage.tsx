import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { getMockPostById } from "../data/mockRepo";
import { formatVnd } from "../../../shared/utils/money";
import { timeAgo } from "../../../shared/utils/timeAgo";
import { Gallery } from "@/shared/components/Gallery";
import { MdAccessTime, MdLocationOn } from "react-icons/md";

// --- Type Definitions ---
type AccountLabel = "verified-shop" | "shop" | "personal";
type CosmeticValue = "lt90" | number;

interface Post {
    id: string;
    price: number;
    brand: string;
    title: string;
    district?: string;
    province: string;
    createdAt: string;
    batteryPercent: number;
    cosmetic: CosmeticValue;
    aiScore: number;
    escrowEnabled: boolean;
    accountLabel: AccountLabel;
    images?: string[];
}

// --- Constants ---
const ACCOUNT_TYPE_LABELS: Record<AccountLabel, string> = {
    "verified-shop": "Cửa hàng uy tín",
    shop: "Cửa hàng",
    personal: "Cá nhân",
};

// Dữ liệu hình ảnh hardcode được đưa ra ngoài component để tránh việc khởi tạo lại không cần thiết.
const MOCK_IMAGES = [
    "https://cdn.chotot.com/-pg72xer4IC0lxPzL897qTEvG2q62XPCaMhkrfOCMxU/preset:listing/plain/c697a4968cc5789be369fccf59f25f0a-2969800193885281903.jpg",
    "https://cdn.chotot.com/uBQqyJ6zBgxFjerX64acU8tZtH6YAylvZCpRF2-43bA/preset:listing/plain/bdb102c9151d63d405515b1cb3f39a74-2960596975008367621.jpg",
    "https://cdn.chotot.com/ZnqjU9sZUBFWntIyR7PsbAHpwjyniiplGyGz2tXmuIs/preset:listing/plain/04a7522bcf2389dd4a32b9f2686f3b50-2944657203469670256.jpg",
    "https://cdn.chotot.com/rE-XYILNfjh09Xy5cHvMJa7sB8KaX1Kq6llIQ7KR580/preset:listing/plain/f09d8ae8628870046eb37a29b92c4d34-2969740272985646593.jpg",
    "https://cdn.chotot.com/GO3uRvt73b0oeUN6lSRJkjUaUQ-Ws06cpUoKGscb_4I/preset:listing/plain/bc82b0a5b120eb9efdfd5e8c217a1843-2969885470081359471.jpg",
    "https://cdn.chotot.com/GO3uRvt73b0oeUN6lSRJkjUaUQ-Ws06cpUoKGscb_4I/preset:listing/plain/bc82b0a5b120eb9efdfd5e8c217a1843-2969885470081359471.jpg",
    "https://cdn.chotot.com/GO3uRvt73b0oeUN6lSRJkjUaUQ-Ws06cpUoKGscb_4I/preset:listing/plain/bc82b0a5b120eb9efdfd5e8c217a1843-2969885470081359471.jpg",
];

// --- Helper Functions ---
const getCosmeticLabel = (cosmeticValue: CosmeticValue): string =>
    cosmeticValue === "lt90" ? "<90%" : `${cosmeticValue}%`;

const getAccountLabel = (accountType: AccountLabel): string =>
    ACCOUNT_TYPE_LABELS[accountType];

// --- Reusable UI Components (Không thay đổi) ---
interface CardProps {
    children: React.ReactNode;
    className?: string;
}
const Card: React.FC<CardProps> = ({ children, className = "" }) => ( <div className={`bg-white border border-ct-line rounded-2xl shadow-ct p-3 ${className}`}>{children}</div> );
interface InfoAttributeProps { label: string; value: string | number; }
const InfoAttribute: React.FC<InfoAttributeProps> = ({ label, value }) => ( <div className="rounded-xl border border-ct-line bg-ct-chip px-3 py-2"><div className="text-[11px] text-ct-sub">{label}</div><div className="text-[13px] font-extrabold">{value}</div></div> );
const PostNotFound: React.FC = () => ( <div className="mx-auto max-w-[720px] px-3 py-3"><Card className="p-4"><div className="font-extrabold">Không tìm thấy tin</div><Link className="text-[13px] underline text-ct-sub" to="/">Quay lại trang chủ</Link></Card></div> );
interface PostRelatedProps { post: Post; }
const PostHeader: React.FC<PostRelatedProps> = ({ post }) => ( <Card><div className="mt-1 text-[18px] text-[#EF305D] font-bold">{formatVnd(post.price)}</div><div className="mt-1 text-[15px] font-extrabold">{post.brand} • {post.title}</div><div className="mt-2 text-[12px] text-ct-sub flex items-center gap-2"><span className="flex items-center gap-1"><MdLocationOn className="w-4 h-4 text-[#fbbf24]" />{post.district ? `${post.district}, ` : ""}{post.province}</span><span>•</span><span className="flex items-center gap-1"><MdAccessTime className="w-4 h-4 text-[#8c8c8c]" />{timeAgo(post.createdAt)}</span></div></Card> );
const PostAttributes: React.FC<PostRelatedProps> = ({ post }) => ( <Card><div className="grid grid-cols-2 gap-2 text-[13px]"><InfoAttribute label="Pin" value={`${post.batteryPercent}%`} /><InfoAttribute label="Ngoại hình" value={getCosmeticLabel(post.cosmetic)} /><InfoAttribute label="Uy tín" value={`${post.aiScore}/100`} /><InfoAttribute label="Trung gian" value={post.escrowEnabled ? "Có" : "Không"} /></div></Card> );
const SellerInfo: React.FC<PostRelatedProps> = ({ post }) => ( <Card><div className="flex items-center gap-3"><div className="h-12 w-12 rounded-full bg-ct-chip border border-ct-line" /><div className="min-w-0"><div className="text-[14px] font-extrabold">Người bán</div><div className="text-[12px] text-ct-sub">Tỷ lệ phản hồi: 90% • 12 tin</div></div><span className="ml-auto text-[11px] px-2 py-1 rounded-full bg-ct-chip border border-ct-line">{getAccountLabel(post.accountLabel)}</span></div></Card> );
interface CallToActionsProps { escrowEnabled: boolean; }
const CallToActions: React.FC<CallToActionsProps> = ({ escrowEnabled }) => ( <Card><div className="grid grid-cols-2 gap-2"><button className="rounded-2xl border border-ct-line bg-white px-3 py-3 text-[14px] font-extrabold active:scale-[.99]">Chat</button><button className="rounded-2xl bg-ct-yellow px-3 py-3 text-[14px] font-extrabold active:scale-[.99]">Gọi điện</button></div>{escrowEnabled && ( <button className="mt-2 w-full rounded-2xl bg-black text-white px-3 py-3 text-[14px] font-extrabold active:scale-[.99]">Mua qua trung gian</button> )}<button className="mt-2 w-full rounded-2xl border border-ct-line bg-white px-3 py-3 text-[13px] font-semibold text-ct-sub active:scale-[.99]">Báo cáo tin</button></Card> );
const PostDescription: React.FC = () => ( <Card><div className="text-[14px] font-extrabold">Mô tả</div><div className="mt-2 text-[13px] text-ct-text leading-relaxed">Máy zin, dùng kỹ. Giao dịch trực tiếp. Có thể test thoải mái.</div></Card> );


// --- Main Page Component ---

export function PostDetailPage() {
    const { id } = useParams<{ id: string }>();
    const post: Post | undefined = useMemo(() => (id ? getMockPostById(id) : undefined), [id]);

    if (!post) {
        return <PostNotFound />;
    }

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
                        {/* Sử dụng hằng số MOCK_IMAGES đã được khai báo */}
                        <Gallery images={MOCK_IMAGES} />
                    </div>
                </div>

                <div className="md:w-[40%] w-full min-w-0 flex flex-col gap-3">
                    <PostHeader post={post} />
                    <PostAttributes post={post} />
                    <SellerInfo post={post} />
                    <CallToActions escrowEnabled={post.escrowEnabled} />
                    <PostDescription />
                </div>
            </div>
        </div>
    );
}