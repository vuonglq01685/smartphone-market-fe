import { useState } from "react";
import { useFilters } from "../../app/store/filters";
import { SearchSuggestions } from "./SearchSuggestions";
import { FaSearch } from "react-icons/fa";

export function SearchBar() {
    const f = useFilters();
    const [focused, setFocused] = useState(false);

    return (
        <div>
            <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-ct border border-black/10">
                <FaSearch size={22} className="text-gray-400" />
                <input
                    className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-ct-sub min-w-0"
                    placeholder='Tìm "ip 13 promax 256 pin 90 hcm"...'
                    value={f.q}
                    onChange={(e) => f.set("q", e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => {
                        setTimeout(() => setFocused(false), 120);
                    }}
                />
                <button className="rounded-xl bg-[#FFD400] px-3 py-1.5 text-[13px] font-extrabold border border-ct-line whitespace-nowrap">
                    Tìm Kiếm
                </button>
            </div>

            {focused && (
                <div className="absolute left-0 top-full w-full z-40">
                    <SearchSuggestions
                        q={f.q}
                        onPick={({ brand, model }) => {
                            f.set("brand", brand);
                            f.set("model", model);
                            f.set("q", model); // giống Chợ Tốt: pick thì fill search
                        }}
                    />
                </div>
            )}
        </div>
    );
}
