import { useMemo, useState } from "react";
import { useFilters } from "../../app/store/filters";
import { BottomSheet } from "../ui/BottomSheet";

const BRANDS = ["Apple", "Samsung", "Xiaomi", "OPPO", "vivo", "realme", "Google", "Huawei"];
const PROVINCES = ["Toàn quốc", "TP.HCM", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Bình Dương"];
const DISTRICTS_HCM = ["Q.1", "Q.3", "Q.7", "Thủ Đức", "Bình Thạnh"];

export function FiltersBar() {
    const f = useFilters();
    const [open, setOpen] = useState<null | "location" | "brand" | "price" | "condition" | "sort">(null);

    const priceLabel = useMemo(() => {
        const has = typeof f.minPrice === "number" || typeof f.maxPrice === "number";
        if (!has) return "Giá";
        const a = typeof f.minPrice === "number" ? `${Math.round(f.minPrice / 1_000_000)}tr` : "0";
        const b = typeof f.maxPrice === "number" ? `${Math.round(f.maxPrice / 1_000_000)}tr` : "∞";
        return `${a}-${b}`;
    }, [f.minPrice, f.maxPrice]);

    const conditionLabel = useMemo(() => {
        const parts: string[] = [];
        if (f.cosmetic) parts.push(`Ngoại hình ${f.cosmetic === "lt90" ? "<90" : f.cosmetic}%`);
        if (typeof f.batteryMin === "number") parts.push(`Pin ≥${f.batteryMin}%`);
        return parts.length ? parts.join(" • ") : "Tình trạng";
    }, [f.cosmetic, f.batteryMin]);

    const locationLabel = useMemo(() => {
        if (f.province === "Toàn quốc") return "Toàn quốc";
        return f.district ? `${f.district}, ${f.province}` : f.province;
    }, [f.province, f.district]);

    const sortLabel = useMemo(() => {
        switch (f.sort) {
            case "price_asc": return "Giá ↑";
            case "price_desc": return "Giá ↓";
            case "trust": return "Uy tín";
            default: return "Mới nhất";
        }
    }, [f.sort]);

    return (
        <>
            <div className="bg-white border-b border-ct-line">
                <div className="mx-auto max-w-[720px] px-3 py-2">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        <Chip label={locationLabel} active={f.province !== "Toàn quốc" || !!f.district} onClick={() => setOpen("location")} />
                        <Chip label={f.brand ?? "Hãng"} active={!!f.brand} onClick={() => setOpen("brand")} />
                        <Chip label={priceLabel} active={typeof f.minPrice === "number" || typeof f.maxPrice === "number"} onClick={() => setOpen("price")} />
                        <Chip label={conditionLabel} active={!!f.cosmetic || typeof f.batteryMin === "number"} onClick={() => setOpen("condition")} />
                        <Chip label={sortLabel} active={f.sort !== "new"} onClick={() => setOpen("sort")} />

                        <button
                            className="shrink-0 rounded-full px-3 py-2 text-[13px] font-extrabold border border-ct-line bg-white active:scale-[.99]"
                            onClick={() => f.reset()}
                        >
                            Xóa lọc
                        </button>
                    </div>
                </div>
            </div>

            {/* SHEETS */}
            <LocationSheet open={open === "location"} onClose={() => setOpen(null)} />
            <BrandSheet open={open === "brand"} onClose={() => setOpen(null)} />
            <PriceSheet open={open === "price"} onClose={() => setOpen(null)} />
            <ConditionSheet open={open === "condition"} onClose={() => setOpen(null)} />
            <SortSheet open={open === "sort"} onClose={() => setOpen(null)} />
        </>
    );
}

function Chip({ label, onClick, active }: { label: string; onClick: () => void; active?: boolean }) {
    return (
        <button
            onClick={onClick}
            className={[
                "shrink-0 rounded-full px-3 py-2 text-[13px] font-extrabold shadow-ct border active:scale-[.99]",
                active ? "bg-ct-yellow/25 border-ct-yellow" : "bg-ct-chip border-ct-line",
            ].join(" ")}
        >
            {label}
        </button>
    );
}

function LocationSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
    const f = useFilters();
    return (
        <BottomSheet open={open} title="Chọn khu vực" onClose={onClose}>
            <div className="space-y-2">
                <div className="text-[12px] text-ct-sub">Tỉnh/Thành</div>
                <div className="grid grid-cols-2 gap-2">
                    {PROVINCES.map((p) => (
                        <button
                            key={p}
                            className={[
                                "rounded-2xl border px-3 py-2 text-[13px] font-semibold",
                                f.province === p ? "border-ct-yellow bg-ct-yellow/20" : "border-ct-line bg-white",
                            ].join(" ")}
                            onClick={() => {
                                f.set("province", p);
                                f.set("district", "");
                            }}
                        >
                            {p}
                        </button>
                    ))}
                </div>

                {f.province === "TP.HCM" && (
                    <>
                        <div className="mt-4 text-[12px] text-ct-sub">Quận/Huyện</div>
                        <div className="grid grid-cols-2 gap-2">
                            {["", ...DISTRICTS_HCM].map((d) => (
                                <button
                                    key={d || "all"}
                                    className={[
                                        "rounded-2xl border px-3 py-2 text-[13px] font-semibold",
                                        f.district === d ? "border-ct-yellow bg-ct-yellow/20" : "border-ct-line bg-white",
                                    ].join(" ")}
                                    onClick={() => f.set("district", d)}
                                >
                                    {d ? d : "Tất cả quận"}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                <button
                    className="mt-3 w-full rounded-2xl bg-ct-yellow px-3 py-3 text-[14px] font-extrabold active:scale-[.99]"
                    onClick={onClose}
                >
                    Xong
                </button>
            </div>
        </BottomSheet>
    );
}

function BrandSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
    const f = useFilters();
    return (
        <BottomSheet open={open} title="Chọn hãng" onClose={onClose}>
            <div className="grid grid-cols-2 gap-2">
                <button
                    className="rounded-2xl border border-ct-line px-3 py-2 text-[13px] font-semibold bg-white"
                    onClick={() => f.set("brand", undefined)}
                >
                    Tất cả hãng
                </button>
                {BRANDS.map((b) => (
                    <button
                        key={b}
                        className={[
                            "rounded-2xl border px-3 py-2 text-[13px] font-semibold",
                            f.brand === b ? "border-ct-yellow bg-ct-yellow/20" : "border-ct-line bg-white",
                        ].join(" ")}
                        onClick={() => f.set("brand", b)}
                    >
                        {b}
                    </button>
                ))}
            </div>

            <button
                className="mt-3 w-full rounded-2xl bg-ct-yellow px-3 py-3 text-[14px] font-extrabold active:scale-[.99]"
                onClick={onClose}
            >
                Xong
            </button>
        </BottomSheet>
    );
}

function PriceSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
    const f = useFilters();
    return (
        <BottomSheet open={open} title="Chọn khoảng giá" onClose={onClose}>
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    <Preset label="Dưới 5 triệu" onClick={() => { f.set("minPrice", undefined); f.set("maxPrice", 5_000_000); }} />
                    <Preset label="5 - 10 triệu" onClick={() => { f.set("minPrice", 5_000_000); f.set("maxPrice", 10_000_000); }} />
                    <Preset label="10 - 20 triệu" onClick={() => { f.set("minPrice", 10_000_000); f.set("maxPrice", 20_000_000); }} />
                    <Preset label="Trên 20 triệu" onClick={() => { f.set("minPrice", 20_000_000); f.set("maxPrice", undefined); }} />
                </div>

                <div className="rounded-2xl border border-ct-line p-3 bg-white">
                    <div className="text-[12px] text-ct-sub mb-2">Tùy chọn (nhập số)</div>
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            className="rounded-xl border border-ct-line px-3 py-2 text-[13px] outline-none"
                            placeholder="Giá từ"
                            inputMode="numeric"
                            value={f.minPrice ?? ""}
                            onChange={(e) => f.set("minPrice", e.target.value ? Number(e.target.value) : undefined)}
                        />
                        <input
                            className="rounded-xl border border-ct-line px-3 py-2 text-[13px] outline-none"
                            placeholder="Giá đến"
                            inputMode="numeric"
                            value={f.maxPrice ?? ""}
                            onChange={(e) => f.set("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
                        />
                    </div>
                    <div className="mt-2 text-[11px] text-ct-sub">VD: 15000000</div>
                </div>

                <button
                    className="w-full rounded-2xl bg-ct-yellow px-3 py-3 text-[14px] font-extrabold active:scale-[.99]"
                    onClick={onClose}
                >
                    Áp dụng
                </button>
            </div>
        </BottomSheet>
    );
}

function ConditionSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
    const f = useFilters();
    return (
        <BottomSheet open={open} title="Tình trạng máy" onClose={onClose}>
            <div className="space-y-3">
                <div>
                    <div className="text-[12px] text-ct-sub mb-2">Ngoại hình</div>
                    <div className="grid grid-cols-2 gap-2">
                        <Preset label="Tất cả" onClick={() => f.set("cosmetic", undefined)} />
                        {(["99", "95", "90", "lt90"] as const).map((c) => (
                            <button
                                key={c}
                                className={[
                                    "rounded-2xl border px-3 py-2 text-[13px] font-semibold",
                                    f.cosmetic === c ? "border-ct-yellow bg-ct-yellow/20" : "border-ct-line bg-white",
                                ].join(" ")}
                                onClick={() => f.set("cosmetic", c)}
                            >
                                {c === "lt90" ? "<90%" : `${c}%`}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-ct-line p-3 bg-white">
                    <div className="text-[12px] text-ct-sub mb-2">Pin tối thiểu</div>
                    <div className="grid grid-cols-3 gap-2">
                        <Preset label="Tất cả" onClick={() => f.set("batteryMin", undefined)} />
                        {[80, 85, 90].map((x) => (
                            <button
                                key={x}
                                className={[
                                    "rounded-2xl border px-3 py-2 text-[13px] font-semibold",
                                    f.batteryMin === x ? "border-ct-yellow bg-ct-yellow/20" : "border-ct-line bg-white",
                                ].join(" ")}
                                onClick={() => f.set("batteryMin", x)}
                            >
                                ≥ {x}%
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    className="w-full rounded-2xl bg-ct-yellow px-3 py-3 text-[14px] font-extrabold active:scale-[.99]"
                    onClick={onClose}
                >
                    Áp dụng
                </button>
            </div>
        </BottomSheet>
    );
}

function SortSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
    const f = useFilters();
    return (
        <BottomSheet open={open} title="Sắp xếp" onClose={onClose}>
            <div className="space-y-2">
                <SortRow label="Mới nhất" active={f.sort === "new"} onClick={() => f.set("sort", "new")} />
                <SortRow label="Giá thấp → cao" active={f.sort === "price_asc"} onClick={() => f.set("sort", "price_asc")} />
                <SortRow label="Giá cao → thấp" active={f.sort === "price_desc"} onClick={() => f.set("sort", "price_desc")} />
                <SortRow label="Tin uy tín" active={f.sort === "trust"} onClick={() => f.set("sort", "trust")} />
            </div>

            <button
                className="mt-3 w-full rounded-2xl bg-ct-yellow px-3 py-3 text-[14px] font-extrabold active:scale-[.99]"
                onClick={onClose}
            >
                Xong
            </button>
        </BottomSheet>
    );
}

function Preset({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="rounded-2xl border border-ct-line px-3 py-2 text-[13px] font-semibold bg-white active:scale-[.99]"
        >
            {label}
        </button>
    );
}

function SortRow({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={[
                "w-full flex items-center justify-between rounded-2xl border px-3 py-3 text-[14px] font-semibold active:scale-[.99]",
                active ? "border-ct-yellow bg-ct-yellow/20" : "border-ct-line bg-white",
            ].join(" ")}
        >
            <span>{label}</span>
            <span className="h-4 w-4 rounded-full border border-ct-line bg-white flex items-center justify-center">
        {active ? <span className="block h-2.5 w-2.5 rounded-full bg-ct-yellow" /> : null}
      </span>
        </button>
    );
}
