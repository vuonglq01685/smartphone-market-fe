import { useFilters } from "@/app/store/filters";
import { useMemo, useState } from "react";
import { BrandSheet } from "../components/filters/BrandSheet";
import { ConditionSheet } from "../components/filters/ConditionSheet";
import { Chip } from "../components/filters/FilterChips";
import { LocationSheet } from "../components/filters/LocationSheet";
import { PriceSheet } from "../components/filters/PriceSheet";
import { SortSheet } from "../components/filters/SortSheet";
import { AiOutlineClose } from "react-icons/ai";

export function FiltersBar() {
   const f = useFilters();
   const [open, setOpen] = useState<null | "location" | "brand" | "price" | "condition" | "sort">(null);

   // Label logic
   const priceLabel = useMemo(() => {
      const has = typeof f.minPrice === "number" || typeof f.maxPrice === "number";
      if (!has) return "Giá";
      const a = typeof f.minPrice === "number" ? `${Math.round(f.minPrice / 1_000_000)}tr` : "0";
      const b = typeof f.maxPrice === "number" ? `${Math.round(f.maxPrice / 1_000_000)}tr` : "∞";
      return `${a}-${b}`;
   }, [f.minPrice, f.maxPrice]);

   const conditionLabel = useMemo(() => {
      const parts: string[] = [];
      if (f.cosmetic) parts.push(`Ngoại hình ${f.cosmetic === "lt90" ? "<90" : f.cosmetic}%`);
      if (typeof f.batteryMin === "number") parts.push(`Pin ≥${f.batteryMin}%`);
      return parts.length ? parts.join(" • ") : "Tình trạng";
   }, [f.cosmetic, f.batteryMin]);

   const locationLabel = useMemo(() => {
      if (f.province === "Toàn quốc") return "Toàn quốc";
      return f.district ? `${f.district}, ${f.province}` : f.province;
   }, [f.province, f.district]);

   const sortLabel = useMemo(() => {
      switch (f.sort) {
         case "price_asc": return "Giá ↑";
         case "price_desc": return "Giá ↓";
         case "trust": return "Uy tín";
         default: return "Mới nhất";
      }
   }, [f.sort]);

   return (
      <>
         <div className="flex items-center justify-between overflow-x-auto no-scrollbar rounded-xl px-2 py-2">
            {/* Các chip filter */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar flex-1">
               <Chip label={locationLabel} active={f.province !== "Toàn quốc" || !!f.district} onClick={() => setOpen("location")} />
               <Chip label={f.brand ?? "Hãng"} active={!!f.brand} onClick={() => setOpen("brand")} />
               <Chip label={priceLabel} active={typeof f.minPrice === "number" || typeof f.maxPrice === "number"} onClick={() => setOpen("price")} />
               <Chip label={conditionLabel} active={!!f.cosmetic || typeof f.batteryMin === "number"} onClick={() => setOpen("condition")} />
               <Chip label={sortLabel} active={f.sort !== "new"} onClick={() => setOpen("sort")} />
            </div>

            {/* Nút Xóa lọc */}
            <button
               className="ml-3 rounded-full px-5 py-2 text-[14px] font-semibold border border-red-300 bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-1"
               onClick={() => f.reset()}
            >
               <AiOutlineClose className="w-4 h-4" />
               Xóa lọc
            </button>
         </div>
         {/* SHEETS */}
         <LocationSheet open={open === "location"} onClose={() => setOpen(null)} />
         <BrandSheet open={open === "brand"} onClose={() => setOpen(null)} />
         <PriceSheet open={open === "price"} onClose={() => setOpen(null)} />
         <ConditionSheet open={open === "condition"} onClose={() => setOpen(null)} />
         <SortSheet open={open === "sort"} onClose={() => setOpen(null)} />
      </>
   );
}