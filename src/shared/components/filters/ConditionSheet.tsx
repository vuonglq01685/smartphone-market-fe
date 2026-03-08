
import { useFilters } from "@/app/store/filters";
import { Preset } from "./FilterChips";
import { BottomSheet } from "@/shared/ui/BottomSheet";

export function ConditionSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
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