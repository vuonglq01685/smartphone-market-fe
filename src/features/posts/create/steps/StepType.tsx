import { useFormContext } from "react-hook-form";
import type { CreatePostForm } from "../schema";

export function StepType() {
    const { setValue, watch } = useFormContext<CreatePostForm>();
    const type = watch("type");

    return (
        <div className="space-y-2">
            <Choice
                title="Đăng tin bán"
                desc="Đăng bán điện thoại của bạn"
                active={type === "sell"}
                onClick={() => setValue("type", "sell", { shouldDirty: true, shouldTouch: true, shouldValidate: true })}
            />
            <Choice
                title="Đăng tin tìm mua"
                desc="Bạn đăng nhu cầu, người bán chủ động liên hệ"
                active={type === "buy"}
                onClick={() => setValue("type", "buy", { shouldDirty: true, shouldTouch: true, shouldValidate: true })}
            />
        </div>
    );
}

function Choice({
                    title,
                    desc,
                    active,
                    onClick,
                }: {
    title: string;
    desc: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "w-full text-left rounded-2xl border px-3 py-3 active:scale-[.99]",
                active ? "border-ct-yellow bg-ct-yellow/15" : "border-ct-line bg-white",
            ].join(" ")}
        >
            <div className="text-[14px] font-extrabold">{title}</div>
            <div className="text-[12px] text-ct-sub">{desc}</div>
        </button>
    );
}
