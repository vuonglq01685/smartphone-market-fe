export function Chip({ label, onClick, active }: { label: string; onClick: () => void; active?: boolean }) {
    return (
        <button
            className={[
                "transition-all",
                "rounded-full border px-5 py-2 text-[14px] font-medium  cursor-pointer",
                active
                    ? "border-orange-500 bg-orange-100 text-orange-700 shadow"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            ].join(" ")}
            onClick={onClick}
        >
            {label}
        </button>
    );
}

export function Preset({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="rounded-2xl border border-ct-line px-3 py-2 text-[13px] font-semibold bg-white active:scale-[.99]"
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