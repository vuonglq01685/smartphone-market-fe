export function StepHeader({
                               step,
                               total,
                               title,
                           }: {
    step: number;
    total: number;
    title: string;
}) {
    const pct = Math.round((step / total) * 100);

    return (
        <div className="border-b border-ct-line">
            <div className="px-3 py-3">
                <div className="text-[15px] font-extrabold">{title}</div>
                <div className="mt-2 h-2 w-full rounded-full bg-ct-chip border border-ct-line overflow-hidden">
                    <div className="h-full bg-ct-yellow" style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-1 text-[12px] text-ct-sub">
                    Bước {step}/{total}
                </div>
            </div>
        </div>
    );
}
