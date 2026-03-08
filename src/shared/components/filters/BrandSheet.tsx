import { useFilters } from "@/app/store/filters";
import { useBrands } from "@/hooks/useProducts";
import { BottomSheet } from "@/shared/ui/BottomSheet";


export function BrandSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { data } = useBrands()

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
                {data && data.map((b) => (
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