import { useFormContext } from "react-hook-form";
import type { CreatePostForm } from "../schema";

const BRANDS = ["Apple", "Samsung", "Xiaomi", "OPPO", "vivo", "realme", "Google", "Huawei"];

export function StepBrand() {
    const { setValue, watch, formState } = useFormContext<CreatePostForm>();
    const brand = watch("brand");

    return (
        <div>
            <div className="grid grid-cols-2 gap-2">
                {BRANDS.map((b) => (
                    <button
                        key={b}
                        type="button"
                        className={[
                            "rounded-2xl border px-3 py-3 text-[13px] font-extrabold active:scale-[.99]",
                            brand === b ? "border-ct-yellow bg-ct-yellow/20" : "border-ct-line bg-white",
                        ].join(" ")}
                        onClick={() => {
                            setValue("brand", b, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
                            setValue("model", "", { shouldDirty: true, shouldTouch: true, shouldValidate: true });
                        }}
                    >
                        {b}
                    </button>
                ))}
            </div>

            {formState.errors.brand?.message && (
                <div className="mt-2 text-[12px] text-red-600">{formState.errors.brand.message}</div>
            )}
        </div>
    );
}
