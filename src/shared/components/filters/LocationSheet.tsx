import { useFilters } from "@/app/store/filters";
import { useLocations } from "@/hooks/useProducts";
import { BottomSheet } from "@/shared/ui/BottomSheet";

export function LocationSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
    const f = useFilters();
    const { data } = useLocations();

    const provinces = data ? ["Toàn quốc", ...data.map((item: { province: string }) => item.province)] : ["Toàn quốc"];

    const selectedProvince = data?.find((item: { province: string }) => item.province === f.province);
    const districts = selectedProvince ? ["", ...selectedProvince.districts] : [];

    return (
        <BottomSheet open={open} title="Chọn khu vực" onClose={onClose}>
            <div className="space-y-2">
                <div className="text-[12px] text-ct-sub">Tỉnh/Thành</div>
                <div className="grid grid-cols-2 gap-2">
                    {provinces.map((p) => (
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

                {f.province && f.province !== "Toàn quốc" && districts.length > 0 && (
                    <>
                        <div className="mt-4 text-[12px] text-ct-sub">Quận/Huyện</div>
                        <div className="grid grid-cols-2 gap-2">
                            {districts.map((d) => (
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