import { useFormContext } from "react-hook-form";
import type { CreatePostForm } from "../schema";

export function StepDescription() {
    const { register, formState } = useFormContext<CreatePostForm>();

    return (
        <div className="mt-3 rounded-2xl border border-ct-line bg-white p-3">
            <div className="text-[14px] font-extrabold">Mô tả</div>

            <textarea
                className="mt-2 w-full min-h-[120px] rounded-2xl border border-ct-line px-3 py-3 text-[13px] outline-none"
                placeholder="VD: Máy zin, pin 90%, không cấn móp, giao dịch trực tiếp..."
                {...register("description")}
            />

            {formState.errors.description?.message && (
                <div className="mt-2 text-[12px] text-red-600">
                    {formState.errors.description.message}
                </div>
            )}
        </div>
    );
}
