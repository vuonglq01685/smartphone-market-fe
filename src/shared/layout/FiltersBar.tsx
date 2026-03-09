import { useFilters } from "@/app/store/filters";
import { useMemo, useState } from "react";
import { BrandSheet } from "../components/filters/BrandSheet";
import { ConditionSheet } from "../components/filters/ConditionSheet";
import { Chip, RemovableTag } from "../components/filters/FilterChips";
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

   const hasAnyFilter =
      f.province !== "Toàn quốc" ||
      !!f.district ||
      (f.brands?.length ?? 0) > 0 ||
      typeof f.minPrice === "number" ||
      typeof f.maxPrice === "number" ||
      !!f.cosmetic ||
      typeof f.batteryMin === "number" ||
      f.sort !== "new";

   const brandLabel =
      !f.brands?.length ? "Hãng" : f.brands.length === 1 ? f.brands[0] : `${f.brands.length} hãng`;

   const activeFilterTags = useMemo(() => {
      const tags: { key: string; label: string; onRemove: () => void }[] = [];
      f.brands?.forEach((b) => tags.push({ key: `brand-${b}`, label: b, onRemove: () => f.toggleBrand(b) }));
      if (f.province !== "Toàn quốc" || !!f.district) {
         const loc = f.district ? `${f.district}, ${f.province}` : f.province;
         tags.push({
            key: "location",
            label: loc,
            onRemove: () => { f.set("province", "Toàn quốc"); f.set("district", ""); },
         });
      }
      if (typeof f.minPrice === "number" || typeof f.maxPrice === "number") {
         const a = typeof f.minPrice === "number" ? `${Math.round(f.minPrice / 1_000_000)}tr` : "0";
         const b = typeof f.maxPrice === "number" ? `${Math.round(f.maxPrice / 1_000_000)}tr` : "∞";
         tags.push({
            key: "price",
            label: `${a}-${b}`,
            onRemove: () => { f.set("minPrice", undefined); f.set("maxPrice", undefined); },
         });
      }
      if (f.cosmetic) {
         tags.push({
            key: "cosmetic",
            label: `Ngoại hình ${f.cosmetic === "lt90" ? "<90" : f.cosmetic}%`,
            onRemove: () => f.set("cosmetic", undefined),
         });
      }
      if (typeof f.batteryMin === "number") {
         tags.push({
            key: "battery",
            label: `Pin ≥${f.batteryMin}%`,
            onRemove: () => f.set("batteryMin", undefined),
         });
      }
      if (f.sort !== "new") {
         const sortLabels: Record<string, string> = { price_asc: "Giá ↑", price_desc: "Giá ↓", trust: "Uy tín" };
         tags.push({
            key: "sort",
            label: sortLabels[f.sort] ?? f.sort,
            onRemove: () => f.set("sort", "new"),
         });
      }
      return tags;
   }, [f.brands, f.province, f.district, f.minPrice, f.maxPrice, f.cosmetic, f.batteryMin, f.sort]);

   return (
      <>
         <div className="flex flex-col gap-2 py-2">
            {/* Tất cả filter đang chọn – hiển thị rõ, có thể xóa từng cái */}
            {activeFilterTags.length > 0 && (
               <div className="flex flex-wrap items-center gap-2 px-2">
                  {activeFilterTags.map((t) => (
                     <RemovableTag key={t.key} label={t.label} onRemove={t.onRemove} />
                  ))}
               </div>
            )}
            {/* Các chip filter - căn giữa, có thể scroll ngang trên mobile */}
            <div className="flex justify-center items-center gap-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full scroll-smooth">
               <Chip label={locationLabel} active={f.province !== "Toàn quốc" || !!f.district} onClick={() => setOpen("location")} />
               <Chip label={brandLabel} active={(f.brands?.length ?? 0) > 0} onClick={() => setOpen("brand")} />
               <Chip label={priceLabel} active={typeof f.minPrice === "number" || typeof f.maxPrice === "number"} onClick={() => setOpen("price")} />
               <Chip label={conditionLabel} active={!!f.cosmetic || typeof f.batteryMin === "number"} onClick={() => setOpen("condition")} />
               <Chip label={sortLabel} active={f.sort !== "new"} onClick={() => setOpen("sort")} />
               {/* Nút Xóa lọc - chỉ hiển thị khi có ít nhất 1 filter, nằm cùng hàng chip */}
               {hasAnyFilter && (
                  <button
                     className="shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold border border-red-300 bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-1.5"
                     onClick={() => f.reset()}
                  >
                     <AiOutlineClose className="w-3.5 h-3.5" />
                     Xóa lọc
                  </button>
               )}
            </div>
            </div>
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