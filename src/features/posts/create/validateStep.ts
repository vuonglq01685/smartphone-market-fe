import type { UseFormReturn } from "react-hook-form";
import type { CreatePostForm } from "./schema";

type StepResult = { ok: boolean; message?: string };

function getRequiredImageTypes(brand: string) {
    const base = ["front", "back", "edge", "imei"] as const;
    return brand === "Apple" ? [...base, "battery"] : [...base];
}

export async function validateStep(
    step: number,
    methods: UseFormReturn<CreatePostForm>
): Promise<StepResult> {
    if (step === 1) return { ok: true };

    if (step === 2) {
        const ok = await methods.trigger(["brand"]);
        return ok ? { ok: true } : { ok: false, message: "Vui lòng chọn hãng." };
    }

    if (step === 3) {
        const ok = await methods.trigger(["brand", "model"]);
        return ok ? { ok: true } : { ok: false, message: "Vui lòng chọn model." };
    }

    if (step === 4) {
        const ok = await methods.trigger(["storageGb", "price"]);
        return ok ? { ok: true } : { ok: false, message: "Vui lòng nhập giá và dung lượng hợp lệ." };
    }

    if (step === 5) {
        const ok = await methods.trigger(["condition"]);
        return ok ? { ok: true } : { ok: false, message: "Vui lòng hoàn tất checklist chất lượng." };
    }

    if (step === 6) {
        const ok = await methods.trigger(["images", "brand"]);
        if (!ok) return { ok: false, message: "Vui lòng tải ảnh thật bắt buộc." };

        const v = methods.getValues();
        const required = getRequiredImageTypes(v.brand);

        const missing = required.filter((t) => !v.images.some((x) => x.type === t));
        if (missing.length) {
            const map: Record<string, string> = {
                front: "Mặt trước",
                back: "Mặt sau",
                edge: "Viền",
                imei: "IMEI",
                battery: "Pin (iPhone)",
            };
            return {
                ok: false,
                message: `Thiếu ảnh bắt buộc: ${missing.map((m) => map[m]).join(", ")}.`,
            };
        }
        return { ok: true };
    }

    if (step === 7) {
        const ok = await methods.trigger(["description", "escrowEnabled"]);
        return ok ? { ok: true } : { ok: false, message: "Vui lòng nhập mô tả (tối thiểu 10 ký tự)." };
    }

    return { ok: true };
}
