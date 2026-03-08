import { StepType } from "./steps/StepType";
import { StepBrand } from "./steps/StepBrand";
import { StepModel } from "./steps/StepModel";
import { StepPrice } from "./steps/StepPrice";
import { StepCondition } from "./steps/StepCondition";
import { StepImages } from "./steps/StepImages";
import { StepDescription } from "./steps/StepDescription";
import React from "react";
import type { CreatePostForm } from "./schema";
import { StepEscrow } from "./steps/StepEscrow";
// Định nghĩa cấu trúc cho một bước trong wizard
export interface WizardStep {
    id: number;
    title: string;
    component: React.FC;
    // Các trường cần được xác thực (validate) trước khi qua bước tiếp theo
    fieldsToValidate: (keyof CreatePostForm)[];
    skipValidation?: boolean;
}

// Cấu hình trung tâm cho toàn bộ wizard
// eslint-disable-next-line react-refresh/only-export-components
export const WIZARD_STEPS: WizardStep[] = [
    { id: 1, title: "Chọn loại tin", component: StepType, fieldsToValidate: ["type"] },
    { id: 2, title: "Chọn hãng", component: StepBrand, fieldsToValidate: ["brand"] },
    { id: 3, title: "Chọn model", component: StepModel, fieldsToValidate: ["model"] },
    { id: 4, title: "Giá & dung lượng", component: StepPrice, fieldsToValidate: ["price", "storageGb"] },
    { id: 5, title: "Checklist chất lượng", component: StepCondition, fieldsToValidate: ["condition"] },
    { id: 6, title: "Ảnh thật bắt buộc", component: StepImages, fieldsToValidate: ["images"] },
    {
        id: 7,
        title: "Mô tả & giao dịch",
        // Render nhiều component cho một bước
        component: () => (
            <>
                <StepEscrow />
                < StepDescription />
            </>
        ),
        fieldsToValidate: ["description", "escrowEnabled"],
        skipValidation: true,
    },
];

export const TOTAL_STEPS = WIZARD_STEPS.length;

// eslint-disable-next-line react-refresh/only-export-components
export const DEFAULT_FORM_VALUES: CreatePostForm = {
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