import { norm } from "../utils/normalize";
import { MODEL_SUGGESTIONS } from "../../features/posts/catalog/models";

export function SearchSuggestions({
                                      q,
                                      onPick,
                                  }: {
    q: string;
    onPick: (payload: { brand: string; model: string }) => void;
}) {
    const nq = norm(q);
    if (!nq || nq.length < 2) return null;

    const items = MODEL_SUGGESTIONS.filter((x) => {
        const key = norm(`${x.brand} ${x.model}`);
        if (key.includes(nq)) return true;
        return x.keywords.some((k) => norm(k).includes(nq) || nq.includes(norm(k)));
    }).slice(0, 6);

    if (items.length === 0) return null;

    return (
        <div className="mt-2 rounded-2xl border border-ct-line bg-white shadow-ct overflow-hidden">
            <div className="px-3 py-2 text-[12px] font-semibold text-ct-sub">
                Gợi ý
            </div>
            {items.map((it) => (
                <button
                    key={`${it.brand}-${it.model}`}
                    className="w-full px-3 py-3 text-left border-t border-ct-line hover:bg-ct-chip active:bg-ct-chip"
                    onClick={() => onPick({ brand: it.brand, model: it.model })}
                >
                    <div className="text-[13px] font-extrabold">{it.model}</div>
                    <div className="text-[12px] text-ct-sub">{it.brand}</div>
                </button>
            ))}
        </div>
    );
}
