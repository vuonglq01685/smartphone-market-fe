
import { useFilters } from "@/app/store/filters";
import { SortRow } from "./FilterChips";
import { BottomSheet } from "@/shared/ui/BottomSheet";

export function SortSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
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