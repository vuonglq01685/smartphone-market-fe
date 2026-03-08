import { FaMobileAlt } from "react-icons/fa";
import { useFilters } from "../../app/store/filters";
import { LocationPill } from "../ui/LocationPill";
import { SearchBar } from "../ui/SearchBar";
import { FiltersBar } from "./FiltersBar";

export function TopBar() {
    const f = useFilters();

    return (
        <header className="sticky top-0 z-30 bg-ct-yellow border-b shadow-sm">
            {/* Thanh trên */}
            <div className="bg-ct-yellow">
                <div className="max-w-5xl mx-auto flex items-center gap-4 px-4 py-2">
                    {/* Logo */}
                    <div className="flex items-center gap-1 text-2xl font-extrabold text-orange-500">
                        <FaMobileAlt className="text-orange-500" size={28} />
                        <span>Chợ Tốt</span>
                    </div>

                    {/* Thanh tìm kiếm */}
                    <div className="relative flex-1 mx-4">
                        <SearchBar />
                    </div>
                </div>
            </div>
            {/* Thanh dưới: Vị trí + bộ lọc */}
            <div className="bg-white">
                <div className="max-w-5xl mx-auto flex items-center gap-4 px-4 py-2 justify-center">
                    <LocationPill
                        label={f.province === "Toàn quốc" ? "Toàn quốc" : f.province}
                    />
                    <FiltersBar />
                </div>
            </div>
        </header>
    );
}