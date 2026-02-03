import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import type { CreatePostForm } from "../schema";

const MODELS: Record<string, string[]> = {
    Apple: ["iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 13 Pro Max", "iPhone 13", "iPhone 12"],
    Samsung: ["Galaxy S24 Ultra", "Galaxy S23 Ultra", "Galaxy S22 Ultra", "A54"],
    Xiaomi: ["Xiaomi 13T", "Xiaomi 13", "Redmi Note 12"],
    OPPO: ["Reno 10", "Reno 8"],
    vivo: ["V29", "Y36"],
    realme: ["realme 11", "C55"],
    Google: ["Pixel 8 Pro", "Pixel 7"],
    Huawei: ["P50", "Nova 9"],
};

export function StepModel() {
    const { watch, setValue, formState } = useFormContext<CreatePostForm>();
    const brand = watch("brand");
    const model = watch("model");

    const list = useMemo(() => MODELS[brand] ?? [], [brand]);

    if (!brand) {
        return (
            <div className="rounded-2xl border border-ct-line bg-ct-chip p-3 text-[13px] text-ct-sub">
                Bạn cần chọn hãng trước.
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
                {list.map((m) => (
                    <button
                        key={m}
                        type="button"
                        className={[
                            "rounded-2xl border px-3 py-3 text-[13px] font-extrabold active:scale-[.99]",
                            model === m ? "border-ct-yellow bg-ct-yellow/20" : "border-ct-line bg-white",
                        ].join(" ")}
                        onClick={() =>
                            setValue("model", m, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
                        }
                    >
                        {m}
                    </button>
                ))}
            </div>

            {formState.errors.model?.message && (
                <div className="mt-2 text-[12px] text-red-600">{formState.errors.model.message}</div>
            )}
        </div>
    );
}
