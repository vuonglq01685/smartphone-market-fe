import { useFormContext } from "react-hook-form";
import type { CreatePostForm } from "../schema";

export function StepCondition() {
    const { register, watch, setValue } = useFormContext<CreatePostForm>();
    const cosmetic = watch("condition.cosmetic");
    const screen = watch("condition.screen");
    const origin = watch("condition.origin");

    const faceId = watch("condition.faceId");
    const fingerprint = watch("condition.fingerprint");
    const signal = watch("condition.signal");
    const wifi = watch("condition.wifi");
    const camera = watch("condition.camera");
    const speaker = watch("condition.speaker");

    return (
        <div className="space-y-3">
            <Group title="Ngoại hình">
                <RowButtons
                    value={cosmetic}
                    options={[
                        { v: "99", label: "99%" },
                        { v: "95", label: "95%" },
                        { v: "90", label: "90%" },
                        { v: "lt90", label: "<90%" },
                    ]}
                    onPick={(v) =>
                        setValue("condition.cosmetic", v as any, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
                    }
                />
            </Group>

            <Group title="Màn hình">
                <RowButtons
                    value={screen}
                    options={[
                        { v: "zin", label: "Zin" },
                        { v: "ep-kinh", label: "Ép kính" },
                        { v: "thay", label: "Thay" },
                    ]}
                    onPick={(v) =>
                        setValue("condition.screen", v as any, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
                    }
                />
            </Group>

            <Group title="Pin">
                <div className="grid grid-cols-2 gap-2">
                    <input
                        className="rounded-xl border border-ct-line px-3 py-3 text-[14px] font-semibold outline-none"
                        placeholder="Pin % (1-100)"
                        inputMode="numeric"
                        {...register("condition.batteryPercent", { valueAsNumber: true })}
                    />
                    <label className={pill(watch("condition.batteryOriginal"))}>
                        <input type="checkbox" {...register("condition.batteryOriginal")} />
                        Pin zin
                    </label>
                </div>
            </Group>

            <Group title="Tính năng">
                <div className="grid grid-cols-2 gap-2">
                    <Check label="Face ID" name="condition.faceId" active={!!faceId} />
                    <Check label="Vân tay" name="condition.fingerprint" active={!!fingerprint} />
                    <Check label="Sóng" name="condition.signal" active={!!signal} />
                    <Check label="WiFi" name="condition.wifi" active={!!wifi} />
                    <Check label="Camera" name="condition.camera" active={!!camera} />
                    <Check label="Loa" name="condition.speaker" active={!!speaker} />
                </div>
            </Group>

            <Group title="Nguồn gốc">
                <RowButtons
                    value={origin}
                    options={[
                        { v: "chinh-hang", label: "Chính hãng" },
                        { v: "xach-tay", label: "Xách tay" },
                        { v: "dung", label: "Dựng" },
                    ]}
                    onPick={(v) =>
                        setValue("condition.origin", v as any, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
                    }
                />
            </Group>
        </div>
    );

    function Check({ label, name, active }: { label: string; name: any; active: boolean }) {
        return (
            <label className={pill(active)}>
                <input type="checkbox" {...register(name)} />
                {label}
            </label>
        );
    }
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-ct-line bg-white p-3">
            <div className="text-[12px] text-ct-sub mb-2 font-semibold">{title}</div>
            {children}
        </div>
    );
}

function RowButtons({
                        value,
                        options,
                        onPick,
                    }: {
    value: string;
    options: { v: string; label: string }[];
    onPick: (v: string) => void;
}) {
    return (
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {options.map((o) => (
                <button
                    key={o.v}
                    type="button"
                    onClick={() => onPick(o.v)}
                    className={[
                        "shrink-0 rounded-full border px-3 py-2 text-[13px] font-extrabold active:scale-[.99]",
                        value === o.v ? "border-ct-yellow bg-ct-yellow/20" : "border-ct-line bg-ct-chip",
                    ].join(" ")}
                >
                    {o.label}
                </button>
            ))}
        </div>
    );
}

function pill(active: boolean) {
    return [
        "rounded-xl px-3 py-3 text-[13px] font-semibold flex items-center gap-2 border",
        active ? "border-ct-yellow bg-ct-yellow/15" : "border-ct-line bg-white",
    ].join(" ");
}
