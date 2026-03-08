import { norm } from "../utils/normalize";
import { MODEL_SUGGESTIONS } from "../../features/posts/catalog/models";
import { FaSearch } from "react-icons/fa";

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
        <div className="
      mt-2
      w-full
      bg-white
      rounded-2xl
      shadow-[0_8px_32px_rgba(0,0,0,0.12)]
      border border-gray-200
      overflow-hidden
      max-h-[350px]
      z-50
      animate-fadeIn
    ">
            <div className="px-4 py-3 text-sm font-semibold text-gray-400 border-b">
                Tìm kiếm từ khoá "<span className="text-black">{q}</span>"
            </div>
            {items.map((it) => (
                <button
                    key={`${it.brand}-${it.model}`}
                    className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 transition"
                    onMouseDown={() => onPick({ brand: it.brand, model: it.model })}
                >
                    <FaSearch className="text-gray-300" size={18} />
                    <div className="flex flex-col flex-1">
                        <span className="text-base font-semibold text-gray-800">{it.model}</span>
                        <span className="text-xs text-gray-400">{it.brand}</span>
                    </div>
                    <span className="text-gray-300"><svg width="14" height="14" fill="none"><path d="M3 7h8m0 0l-3-3m3 3l-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                </button>
            ))}
        </div>
    );
}
