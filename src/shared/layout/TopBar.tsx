import { SearchBar } from "../ui/SearchBar";
import { LocationPill } from "../ui/LocationPill";
import { FiltersBar } from "./FiltersBar";
import { useFilters } from "../../app/store/filters";

export function TopBar() {
    const f = useFilters();

    return (
        <div className="sticky top-0 z-20">
            <div className="bg-ct-yellow">
                <div className="mx-auto max-w-[720px] px-3 py-2">
                    <div className="flex items-center gap-2">
                        <div className="text-[15px] font-extrabold tracking-tight">
                            Chợ Điện Thoại
                        </div>
                        <div className="ml-auto">
                            <LocationPill
                                label={f.province === "Toàn quốc" ? "Toàn quốc" : f.province}
                            />
                        </div>
                    </div>

                    <div className="mt-2">
                        <SearchBar />
                    </div>
                </div>
            </div>

            <FiltersBar />
        </div>
    );
}
