import { useRef, useState } from "react";
import { useFilters } from "../../app/store/filters";
import { useQueryClient } from "@tanstack/react-query";
import { SearchSuggestions } from "./SearchSuggestions";
import { FaSearch } from "react-icons/fa";

export function SearchBar() {
    const f = useFilters();
    const [focused, setFocused] = useState(false);
    const queryClient = useQueryClient();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearch = () => {
        inputRef.current?.blur();
        setFocused(false);
        f.applySearch(); // qInput → q
        queryClient.invalidateQueries({ queryKey: ["posts"] });
    };

    return (
        <div>
            <form
                className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-ct border border-black/10"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                }}
            >
                <FaSearch size={22} className="text-gray-400 shrink-0" />
                <input
                    ref={inputRef}
                    className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-ct-sub min-w-0"
                    placeholder='Tìm "ip 13 promax 256 pin 90 hcm"...'
                    value={f.qInput ?? f.q}
                    onChange={(e) => f.set("qInput", e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => {
                        setTimeout(() => setFocused(false), 120);
                    }}
                />
                <button
                    type="submit"
                    className="rounded-xl bg-[#FFD400] px-3 py-1.5 text-[13px] font-extrabold border border-ct-line whitespace-nowrap shrink-0"
                >
                    Tìm Kiếm
                </button>
            </form>

            {focused && (
                <div className="absolute left-0 top-full w-full z-40">
                    <SearchSuggestions
                        q={f.qInput ?? f.q}
                        onPick={({ brand, model }) => {
                            f.set("brands", [brand]);
                            f.set("model", model);
                            f.set("q", model);
                            f.set("qInput", model);
                            handleSearch(); // Apply ngay khi chọn suggestion
                        }}
                    />
                </div>
            )}
        </div>
    );
}
