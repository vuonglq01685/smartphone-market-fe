import { useFormContext } from "react-hook-form";
import type { CreatePostForm } from "../schema";

export function StepEscrow() {
    const { register, watch } = useFormContext<CreatePostForm>();
    const on = watch("escrowEnabled");

    return (
        <div className="rounded-2xl border border-ct-line bg-white p-3">
            <div className="text-[14px] font-extrabold">Giao dịch có trung gian</div>
            <div className="text-[12px] text-ct-sub mt-1">
                Người mua thanh toán → hệ thống giữ tiền → kiểm tra 24–48h → chuyển cho người bán.
            </div>

            <label
                className={[
                    "mt-3 rounded-2xl border px-3 py-3 flex items-center gap-2 text-[13px] font-semibold",
                    on ? "border-ct-yellow bg-ct-yellow/15" : "border-ct-line bg-ct-chip",
                ].join(" ")}
            >
                <input type="checkbox" {...register("escrowEnabled")} />
                Bật trung gian
                <span className="ml-auto text-[12px] text-ct-sub">{on ? "Đang bật" : "Đang tắt"}</span>
            </label>
        </div>
    );
}
