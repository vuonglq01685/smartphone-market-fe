import { useState } from "react";
import { useFilters } from "../../app/store/filters";
import { SearchSuggestions } from "./SearchSuggestions";

export function SearchBar() {
    const f = useFilters();
    const [focused, setFocused] = useState(false);

    return (
        <div>
            <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-ct border border-black/10">
                <div className="h-4 w-4 rounded-full bg-ct-chip border border-ct-line" />
                <input
                    className="w-full bg-transparent outline-none text-[14px] placeholder:text-ct-sub"
                    placeholder='Tìm "ip 13 promax 256 pin 90 hcm"...'
                    value={f.q}
                    onChange={(e) => f.set("q", e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => {
                        // delay nhỏ để click được suggestion
                        setTimeout(() => setFocused(false), 120);
                    }}
                />
                <button className="rounded-xl bg-ct-chip px-3 py-1.5 text-[13px] font-extrabold border border-ct-line">
                    Tìm
                </button>
            </div>

            {focused && (
                <SearchSuggestions
                    q={f.q}
                    onPick={({ brand, model }) => {
                        f.set("brand", brand);
                        f.set("model", model);
                        f.set("q", model); // giống Chợ Tốt: pick thì fill search
                    }}
                />
            )}
        </div>
    );
}
