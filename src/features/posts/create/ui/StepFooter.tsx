export function StepFooter({
    step,
    total,
    onBack,
    onNext,
    onSubmit,
    canProceed,
    previewTitle,
    isSubmitting = false,
}: {
    step: number;
    total: number;
    onBack: () => void;
    onNext: () => void;
    onSubmit: () => void;
    canProceed: boolean;
    previewTitle: string;
    isSubmitting?: boolean;
}) {
    const isLast = step === total;

    return (
        <div className="fixed left-0 right-0 z-50 bottom-[calc(64px+env(safe-area-inset-bottom))]">
            <div className="mx-auto max-w-[720px] px-3">
                <div className="bg-white border border-ct-line rounded-2xl shadow-ct p-3">
                    <div className="text-[12px] text-ct-sub line-clamp-2">{previewTitle}</div>

                    <div className="mt-2 grid grid-cols-2 gap-2">
                        <button
                            className="rounded-2xl border border-ct-line bg-white px-3 py-3 text-[14px] font-extrabold active:scale-[.99]"
                            onClick={onBack}
                            type="button"
                        >
                            Quay lại
                        </button>

                        {!isLast ? (
                            <button
                                className={[
                                    "rounded-2xl px-3 py-3 text-[14px] font-extrabold active:scale-[.99]",
                                    canProceed ? "bg-ct-yellow" : "bg-ct-yellow/40 text-black/40 cursor-not-allowed",
                                ].join(" ")}
                                onClick={onNext}
                                disabled={!canProceed}
                                type="button"
                            >
                                Tiếp tục
                            </button>
                        ) : (
                            <button
                                className={[
                                    "rounded-2xl px-3 py-3 text-[14px] font-extrabold active:scale-[.99]",
                                    canProceed && !isSubmitting ? "bg-black text-white" : "bg-black/30 text-white/60 cursor-not-allowed",
                                ].join(" ")}
                                onClick={onSubmit}
                                disabled={!canProceed || isSubmitting}
                                type="button"
                            >
                                {isSubmitting ? "Đang đăng..." : "Đăng tin"}
                            </button>
                        )}
                    </div>

                    {!canProceed ? (
                        <div className="mt-2 text-[11px] text-ct-sub">
                            Hoàn tất thông tin bắt buộc để tiếp tục.
                        </div>
                    ) : (
                        <div className="mt-2 text-[11px] text-ct-sub">&nbsp;</div>
                    )}
                </div>
            </div>
        </div>
    );
}
