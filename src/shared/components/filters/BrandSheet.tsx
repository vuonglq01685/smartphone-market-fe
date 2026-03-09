import { useFilters } from "@/app/store/filters";
import { useBrands } from "@/hooks/useProducts";
import { BottomSheet } from "@/shared/ui/BottomSheet";

export function BrandSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { data } = useBrands();
    const f = useFilters();

    return (
        <BottomSheet open={open} title="Chọn hãng (có thể chọn nhiều)" onClose={onClose}>
            <div className="grid grid-cols-2 gap-2">
                <button
                    className="rounded-2xl border border-ct-line px-3 py-2 text-[13px] font-semibold bg-white"
                    onClick={() => f.set("brands", [])}
                >
                    Tất cả hãng
                </button>
                {data &&
                    data.map((b: string) => {
                        const selected = f.brands.includes(b);
                        return (
                            <button
                                key={b}
                                className={[
                                    "rounded-2xl border px-3 py-2 text-[13px] font-semibold",
                                    selected ? "border-orange-500 bg-orange-100 text-orange-700" : "border-ct-line bg-white",
                                ].join(" ")}
                                onClick={() => f.toggleBrand(b)}
                            >
                                {b}
                            </button>
                        );
                    })}
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