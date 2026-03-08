import { useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

// images: string[]
export const Gallery = ({ images }: { images: string[] }) => {
  const [selected, setSelected] = useState(0);
  const [scrollIdx, setScrollIdx] = useState(0);
  const visibleCount = 5;

  const canPrev = scrollIdx > 0;
  const canNext = scrollIdx + visibleCount < images.length;

  // Thumbnail hiển thị
  const visibleThumbnails = images.slice(scrollIdx, scrollIdx + visibleCount);

  return (
    <div className="bg-white border border-ct-line rounded-2xl shadow-ct overflow-hidden flex flex-col">
      {/* Ảnh lớn */}
      <div className="aspect-4/4 w-full  flex items-center justify-center">
        <img
          src={images[selected]}
          alt=""
          className="w-full h-full max-h-120 object-contain "
        />
      </div>
      <div className="px-2 pb-2 pt-2 relative flex items-center">
        {canPrev && (
          <button
            className="absolute focus:outline-none left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow border border-ct-line w-8 h-8 flex items-center justify-center"
            onClick={() => setScrollIdx(scrollIdx - 1)}
          >
            <MdChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Thumbnail */}
        <div
          className={`flex gap-2 overflow-x-hidden no-scrollbar mx-auto `}
          style={{ width: `${visibleCount * 88}px` }}  // 88px ~ w-20 + gap
        >
          {visibleThumbnails.map((src, i) => {
            const realIdx = scrollIdx + i;
            return (
              <button
                key={realIdx}
                className={[
                  "h-20 w-20  border shrink-0 overflow-hidden transition focus:outline-none",
                  selected === realIdx
                    ? "border-ct-yellow ring-2 ring-ct-yellow"
                    : "border-ct-line"
                ].join(" ")}
                onClick={() => setSelected(realIdx)}
              >
                <img src={src} alt="" className="w-full h-full object-cover cursor-pointer" />
              </button>
            );
          })}
        </div>

        {/* Nút next */}
        {canNext && (
          <button
            className="absolute focus:outline-none right-2 top-1/2 cursor-pointer -translate-y-1/2 z-10 bg-white rounded-full shadow border border-ct-line w-8 h-8 flex items-center justify-center"
            onClick={() => setScrollIdx(scrollIdx + 1)}
          >
            <MdChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};