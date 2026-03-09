/// Removable tag for selected filter value (e.g. brand) – tap X to remove
export function RemovableTag({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <span className="inline-flex items-center gap-1.5 shrink-0 rounded-full border border-orange-400 bg-orange-50 px-3 py-1.5 text-[12px] font-semibold text-orange-800">
            {label}
            <button
                type="button"
                aria-label={`Bỏ lọc ${label}`}
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
                className="rounded-full p-0.5 hover:bg-orange-200 active:scale-95 transition"
            >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
        </span>
    );
}

export function Chip({ label, onClick, active }: { label: string; onClick: () => void; active?: boolean }) {
    return (
        <button
            className={[
                "shrink-0 transition-all",
                "rounded-full border px-4 py-2 text-[13px] font-medium cursor-pointer",
                active
                    ? "border-orange-500 bg-orange-100 text-orange-700 shadow-sm"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            ].join(" ")}
            onClick={onClick}
        >
            {label}
        </button>
    );
}

export function Preset({ label, onClick, active }: { label: string; onClick: () => void; active?: boolean }) {
    return (
        <button
            onClick={onClick}
            className={[
                "rounded-2xl border px-3 py-2 text-[13px] font-semibold active:scale-[.99]",
                active ? "border-orange-500 bg-orange-100 text-orange-700" : "border-ct-line bg-white",
            ].join(" ")}
        >
            {label}
        </button>
    );
}

export function SortRow({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={[
                "w-full flex items-center justify-between rounded-2xl border px-3 py-3 text-[14px] font-semibold active:scale-[.99]",
                active ? "border-ct-yellow bg-ct-yellow/20" : "border-ct-line bg-white",
            ].join(" ")}
        >
            <span>{label}</span>
            <span className="h-4 w-4 rounded-full border border-ct-line bg-white flex items-center justify-center">
                {active ? <span className="block h-2.5 w-2.5 rounded-full bg-ct-yellow" /> : null}
            </span>
        </button>
    );
}