import { useModels } from "@/hooks/useProducts";
import { useFormContext } from "react-hook-form";
import type { CreatePostForm } from "../schema";


export function StepModel() {
    const { watch, setValue, formState } = useFormContext<CreatePostForm>();
    const brand = watch("brand");
    const model = watch("model");

    const { data: models } = useModels(brand);
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
                {models && models.map((m: string) => (
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
