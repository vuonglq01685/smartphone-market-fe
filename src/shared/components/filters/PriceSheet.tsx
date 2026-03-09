import { useFilters } from "@/app/store/filters";
import { Preset } from "./FilterChips";
import { BottomSheet } from "@/shared/ui/BottomSheet";

export function PriceSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
    const f = useFilters();
    const presetUnder5 = f.minPrice == null && f.maxPrice === 5_000_000;
    const preset5to10 = f.minPrice === 5_000_000 && f.maxPrice === 10_000_000;
    const preset10to20 = f.minPrice === 10_000_000 && f.maxPrice === 20_000_000;
    const presetOver20 = f.minPrice === 20_000_000 && f.maxPrice == null;

    return (
        <BottomSheet open={open} title="Chọn khoảng giá" onClose={onClose}>
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    <Preset label="Dưới 5 triệu" active={presetUnder5} onClick={() => { f.set("minPrice", undefined); f.set("maxPrice", 5_000_000); }} />
                    <Preset label="5 - 10 triệu" active={preset5to10} onClick={() => { f.set("minPrice", 5_000_000); f.set("maxPrice", 10_000_000); }} />
                    <Preset label="10 - 20 triệu" active={preset10to20} onClick={() => { f.set("minPrice", 10_000_000); f.set("maxPrice", 20_000_000); }} />
                    <Preset label="Trên 20 triệu" active={presetOver20} onClick={() => { f.set("minPrice", 20_000_000); f.set("maxPrice", undefined); }} />
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