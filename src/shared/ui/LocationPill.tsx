export function LocationPill({ label }: { label: string }) {
    return (
        <button className="rounded-full bg-white/70 px-3 py-1.5 text-[13px] font-extrabold text-ct-text border border-black/10">
            {label}
        </button>
    );
}
