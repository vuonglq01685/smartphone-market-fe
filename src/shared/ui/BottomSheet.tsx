import { useEffect, type ReactNode } from "react";

export function BottomSheet({
                                open,
                                title,
                                onClose,
                                children,
                            }: {
    open: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
}) {
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* overlay */}
            <button
                aria-label="close"
                className="absolute inset-0 bg-black/35"
                onClick={onClose}
            />

            {/* panel */}
            <div className="absolute left-0 right-0 bottom-0 mx-auto max-w-[720px]">
                <div className="rounded-t-3xl bg-white border border-ct-line shadow-ct">
                    <div className="px-4 pt-3 pb-2">
                        <div className="mx-auto h-1 w-10 rounded-full bg-gray-300" />
                        <div className="mt-2 flex items-center">
                            <div className="text-[15px] font-extrabold">{title}</div>
                            <button
                                className="ml-auto rounded-xl bg-ct-chip border border-ct-line px-3 py-1.5 text-[13px] font-semibold"
                                onClick={onClose}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>

                    <div className="px-4 pb-4 max-h-[70vh] overflow-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
