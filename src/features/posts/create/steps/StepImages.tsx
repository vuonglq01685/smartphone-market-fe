import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import type { CreatePostForm, ImageType } from "../schema";

const REQUIRED_LABELS: { type: ImageType; label: string }[] = [
    { type: "front", label: "Mặt trước" },
    { type: "back", label: "Mặt sau" },
    { type: "edge", label: "Viền" },
    { type: "imei", label: "IMEI" },
    { type: "battery", label: "Pin (iPhone)" },
];

function requiredTypesByBrand(brand: string): ImageType[] {
    const base: ImageType[] = ["front", "back", "edge", "imei"];
    if (brand === "Apple") base.push("battery");
    return base;
}

export function StepImages() {
    const { watch, setValue } = useFormContext<CreatePostForm>();
    const brand = watch("brand");
    const images = watch("images");

    const requiredTypes = useMemo(() => requiredTypesByBrand(brand || ""), [brand]);

    const getByType = (t: ImageType) => images.find((x) => x.type === t);
    const hasType = (t: ImageType) => images.some((x) => x.type === t);

    const setImages = (next: CreatePostForm["images"]) =>
        setValue("images", next, { shouldDirty: true, shouldTouch: true, shouldValidate: true });

    const onAddRequired = (t: ImageType, file?: File | null) => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        const next = [
            ...images.filter((x) => x.type !== t),
            { id: crypto.randomUUID(), type: t, previewUrl: url, name: file.name, file },
        ];
        setImages(next);
    };

    const onRemoveRequired = (t: ImageType) => {
        setImages(images.filter((x) => x.type !== t));
    };

    // ✅ upload thêm ảnh khác
    const onAddOther = (files?: FileList | null) => {
        if (!files || files.length === 0) return;
        const added = Array.from(files).map((f) => ({
            id: crypto.randomUUID(),
            type: "other" as const,
            previewUrl: URL.createObjectURL(f),
            name: f.name,
            file: f,
        }));
        setImages([...images, ...added]);
    };

    const onRemoveOther = (id: string) => {
        setImages(images.filter((x) => x.id !== id));
    };

    const otherImages = images.filter((x) => x.type === "other");

    return (
        <div className="space-y-3">
            <div className="rounded-2xl border border-ct-line bg-ct-yellow/15 p-3 text-[13px]">
                <div className="font-extrabold">Ảnh thật bắt buộc</div>
                <div className="text-ct-sub text-[12px] mt-1">
                    {requiredTypes
                        .map((t) => REQUIRED_LABELS.find((x) => x.type === t)?.label)
                        .filter(Boolean)
                        .join(" • ")}
                </div>
            </div>

            {/* REQUIRED */}
            <div className="grid grid-cols-1 gap-2">
                {REQUIRED_LABELS.filter((x) => requiredTypes.includes(x.type)).map((x) => {
                    const has = hasType(x.type);
                    const item = getByType(x.type);
                    return (
                        <div
                            key={x.type}
                            className={[
                                "rounded-2xl border bg-white p-3",
                                has ? "border-ct-yellow" : "border-ct-line",
                            ].join(" ")}
                        >
                            <div className="flex items-center gap-2">
                                <div className="text-[13px] font-extrabold">{x.label}</div>
                                <div className="ml-auto">
                                    {has ? (
                                        <button
                                            type="button"
                                            className="rounded-xl border border-ct-line bg-white px-3 py-1.5 text-[12px] font-semibold active:scale-[.99]"
                                            onClick={() => onRemoveRequired(x.type)}
                                        >
                                            Xóa
                                        </button>
                                    ) : (
                                        <span className="text-[11px] font-semibold text-ct-sub">Bắt buộc</span>
                                    )}
                                </div>
                            </div>

                            <div className="mt-2 flex items-center gap-3">
                                <div className="h-20 w-20 rounded-xl border border-ct-line bg-ct-chip overflow-hidden">
                                    {has && item ? (
                                        <img src={item.previewUrl} className="h-full w-full object-cover" />
                                    ) : null}
                                </div>

                                <label className="flex-1 rounded-2xl bg-ct-yellow px-3 py-3 text-[13px] font-extrabold text-center cursor-pointer active:scale-[.99]">
                                    {has ? "Đổi ảnh" : "Tải ảnh"}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => onAddRequired(x.type, e.target.files?.[0])}
                                    />
                                </label>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* OTHER GALLERY */}
            <div className="rounded-2xl border border-ct-line bg-white p-3">
                <div className="flex items-center">
                    <div className="text-[13px] font-extrabold">Ảnh khác (không bắt buộc)</div>
                    <label className="ml-auto rounded-xl border border-ct-line bg-ct-chip px-3 py-2 text-[12px] font-extrabold cursor-pointer active:scale-[.99]">
                        + Thêm ảnh
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => onAddOther(e.target.files)}
                        />
                    </label>
                </div>

                {otherImages.length === 0 ? (
                    <div className="mt-2 text-[12px] text-ct-sub">
                        Bạn có thể thêm ảnh hộp, phụ kiện, góc khác... để tăng uy tín.
                    </div>
                ) : (
                    <div className="mt-3 grid grid-cols-4 gap-2">
                        {otherImages.map((img) => (
                            <div key={img.id} className="relative">
                                <div className="aspect-square rounded-xl border border-ct-line bg-ct-chip overflow-hidden">
                                    <img src={img.previewUrl} className="h-full w-full object-cover" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onRemoveOther(img.id)}
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-black/70 text-white text-[12px] font-extrabold"
                                    aria-label="remove"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="text-[12px] text-ct-sub">
                Ảnh rõ, thật → tăng uy tín & giảm bị đánh dấu rủi ro.
            </div>
        </div>
    );
}
