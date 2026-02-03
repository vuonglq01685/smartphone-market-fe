import { useFormContext } from "react-hook-form";
import type { CreatePostForm } from "../schema";

const STORAGES = [64, 128, 256, 512, 1024];

export function StepPrice() {
    const { setValue, watch, formState, register } = useFormContext<CreatePostForm>();
    const storage = watch("storageGb");

    return (
        <div className="space-y-3">
            <div>
                <div className="text-[12px] text-ct-sub mb-2">Dung lượng</div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {STORAGES.map((s) => (
                        <button
                            key={s}
                            type="button"
                            className={[
                                "shrink-0 rounded-full border px-3 py-2 text-[13px] font-extrabold active:scale-[.99]",
                                storage === s ? "border-ct-yellow bg-ct-yellow/20" : "border-ct-line bg-ct-chip",
                            ].join(" ")}
                            onClick={() =>
                                setValue("storageGb", s, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
                            }
                        >
                            {s}GB
                        </button>
                    ))}
                </div>
            </div>

            <div className="rounded-2xl border border-ct-line p-3 bg-white">
                <div className="text-[12px] text-ct-sub mb-2">Giá</div>
                <input
                    className="w-full rounded-xl border border-ct-line px-3 py-3 text-[14px] font-semibold outline-none"
                    placeholder="VD: 15000000"
                    inputMode="numeric"
                    {...register("price", { valueAsNumber: true })}
                />
                {formState.errors.price?.message && (
                    <div className="mt-2 text-[12px] text-red-600">{formState.errors.price.message}</div>
                )}
            </div>
        </div>
    );
}
