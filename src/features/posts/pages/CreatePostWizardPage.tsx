import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema, type CreatePostForm } from "../create/schema";
import { StepHeader } from "../create/ui/StepHeader";
import { StepFooter } from "../create/ui/StepFooter";
import { StepType } from "../create/steps/StepType";
import { StepBrand } from "../create/steps/StepBrand";
import { StepModel } from "../create/steps/StepModel";
import { StepPrice } from "../create/steps/StepPrice";
import { StepCondition } from "../create/steps/StepCondition";
import { StepImages } from "../create/steps/StepImages";
import { StepDescription } from "../create/steps/StepDescription";
import { StepEscrow } from "../create/steps/StepEscrow";
import { validateStep } from "../create/validateStep";

const TOTAL_STEPS = 7;

const defaultValues: CreatePostForm = {
    type: "sell",
    brand: "",
    model: "",
    storageGb: 128,
    price: 1,

    location: { province: "Toàn quốc", district: "" },

    condition: {
        cosmetic: "95",
        screen: "zin",
        batteryPercent: 85,
        batteryOriginal: true,
        faceId: true,
        fingerprint: false,
        signal: true,
        wifi: true,
        camera: true,
        speaker: true,
        origin: "chinh-hang",
    },

    images: [],
    description: "",
    escrowEnabled: false,
};

function requiredImageTypes(brand: string) {
    const base = ["front", "back", "edge", "imei"];
    if (brand === "Apple") base.push("battery");
    return base;
}

export function CreatePostWizardPage() {
    const nav = useNavigate();
    const [step, setStep] = useState(1);
    const [stepError, setStepError] = useState<string>("");

    const methods = useForm<CreatePostForm>({
        resolver: zodResolver(createPostSchema),
        mode: "onChange",
        defaultValues,
    });

    const v = useWatch({ control: methods.control });

    const title = useMemo(() => {
        const map: Record<number, string> = {
            1: "Chọn loại tin",
            2: "Chọn hãng",
            3: "Chọn model",
            4: "Giá & dung lượng",
            5: "Checklist chất lượng",
            6: "Ảnh thật bắt buộc",
            7: "Mô tả & giao dịch",
        };
        return map[step] ?? "Đăng tin";
    }, [step]);

    const canProceed = useMemo(() => {
        if (step === 1) return true;
        if (step === 2) return !!v.brand;
        if (step === 3) return !!v.brand && !!v.model;
        if (step === 4) return v.storageGb != null && Number.isFinite(v.storageGb) && v.storageGb > 0 && v.price != null && Number.isFinite(v.price) && v.price > 0;
        if (step === 5) {
            const bp = v.condition?.batteryPercent ?? 0;
            return bp >= 1 && bp <= 100;
        }
        if (step === 6) {
            const req = requiredImageTypes(v.brand || "");
            return req.every((t) => v.images?.some((x) => x.type === t));
        }
        if (step === 7) return (v.description ?? "").trim().length >= 10;
        return true;
    }, [step, v.brand, v.model, v.storageGb, v.price, v.condition, v.images, v.description]);

    const onBack = () => {
        setStepError("");
        if (step === 1) nav("/");
        else setStep((s) => s - 1);
    };

    const onNext = async () => {
        setStepError("");
        const res = await validateStep(step, methods);
        if (!res.ok) {
            setStepError(res.message || "Vui lòng hoàn tất thông tin bắt buộc.");
            return;
        }
        setStep((s) => Math.min(TOTAL_STEPS, s + 1));
    };

    const onSubmit = async () => {
        setStepError("");
        const res = await validateStep(step, methods);
        if (!res.ok) {
            setStepError(res.message || "Vui lòng hoàn tất thông tin bắt buộc.");
            return;
        }

        const ok = await methods.trigger();
        if (!ok) {
            setStepError("Vui lòng kiểm tra lại thông tin.");
            return;
        }

        // ✅ Không render JSON bên dưới. Prototype: chỉ thông báo đơn giản.
        alert("Đăng tin (prototype) thành công!");
        nav("/");
    };

    return (
        <div className="mx-auto max-w-[720px] px-3 py-3 pb-40">
            <div className="mb-2">
                <Link to="/" className="text-[13px] font-semibold text-ct-sub underline">
                    ← Quay lại
                </Link>
            </div>

            <div className="bg-white border border-ct-line rounded-2xl shadow-ct overflow-hidden">
                <StepHeader step={step} total={TOTAL_STEPS} title={title} />

                {stepError ? (
                    <div className="px-3 pt-3">
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-[13px] font-semibold text-red-700">
                            {stepError}
                        </div>
                    </div>
                ) : null}

                <div className="p-3">
                    <FormProvider {...methods}>
                        {step === 1 && <StepType />}
                        {step === 2 && <StepBrand />}
                        {step === 3 && <StepModel />}
                        {step === 4 && <StepPrice />}
                        {step === 5 && <StepCondition />}
                        {step === 6 && <StepImages />}
                        {step === 7 && <StepEscrow />}
                        {step === 7 && <StepDescription />}
                    </FormProvider>
                </div>
            </div>

            <StepFooter
                step={step}
                total={TOTAL_STEPS}
                onBack={onBack}
                onNext={onNext}
                onSubmit={onSubmit}
                canProceed={canProceed}
                previewTitle={v.brand && v.model ? `${v.brand} ${v.model}` : "Chưa chọn máy"}
            />
        </div>
    );
}
