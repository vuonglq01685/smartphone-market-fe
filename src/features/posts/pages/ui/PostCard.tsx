import { Link } from "react-router-dom";
import type { PostItem } from "./types";
import {timeAgo} from "../../../../shared/utils/timeAgo";
import {formatVnd} from "../../../../shared/utils/money";

export function PostCard({ item }: { item: PostItem }) {
    const badge =
        item.accountLabel === "verified-shop"
            ? "Cửa hàng uy tín"
            : item.accountLabel === "shop"
                ? "Cửa hàng"
                : "Cá nhân";

    const cosmeticLabel = item.cosmetic === "lt90" ? "<90%" : `${item.cosmetic}%`;

    return (
        <Link to={`/posts/${item.id}`} className="block">
            <div className="bg-white border border-ct-line rounded-2xl shadow-ct overflow-hidden active:scale-[.997]">
                <div className="flex">
                    <div className="w-28 h-28 bg-ct-chip shrink-0">
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                    </div>

                    <div className="p-3 flex-1 min-w-0">
                        <div className="text-[14px] font-semibold line-clamp-2">
                            {item.brand} • {item.title}
                        </div>

                        <div className="mt-1 text-[15px] font-extrabold">
                            {formatVnd(item.price)}
                        </div>

                        <div className="mt-1 text-[12px] text-ct-sub flex items-center gap-2">
              <span>
                {item.district ? `${item.district}, ` : ""}
                  {item.province}
              </span>
                            <span>•</span>
                            <span>{timeAgo(item.createdAt)}</span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-[11px] px-2 py-1 rounded-full bg-ct-chip border border-ct-line">
                {badge}
              </span>
                            <span className="text-[11px] px-2 py-1 rounded-full bg-ct-chip border border-ct-line">
                Uy tín {item.aiScore}/100
              </span>

                            <span className="text-[11px] px-2 py-1 rounded-full bg-ct-chip border border-ct-line">
                Pin {item.batteryPercent}%
              </span>
                            <span className="text-[11px] px-2 py-1 rounded-full bg-ct-chip border border-ct-line">
                Ngoại hình {cosmeticLabel}
              </span>

                            {item.escrowEnabled && (
                                <span className="text-[11px] px-2 py-1 rounded-full bg-ct-yellow/25 border border-ct-yellow">
                  Trung gian
                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
