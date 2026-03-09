import { FaMobileAlt } from "react-icons/fa";
import { SearchBar } from "../ui/SearchBar";
import { FiltersBar } from "./FiltersBar";

export function TopBar() {
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
            {/* Thanh dưới: Bộ lọc - căn giữa */}
            <div className="bg-white border-t border-gray-100">
                <div className="max-w-4xl mx-auto px-4">
                    <FiltersBar />
                </div>
            </div>
        </header>
    );
}