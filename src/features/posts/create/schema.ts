import { z } from "zod";

export const imageTypeEnum = z.enum(["front", "back", "edge", "imei", "battery", "other"]);
export type ImageType = z.infer<typeof imageTypeEnum>;

export const createPostSchema = z.object({
    type: z.enum(["sell", "buy"]),
    brand: z.string().min(1, "Chọn hãng"),
    model: z.string().min(1, "Chọn model"),
    storageGb: z.number().int().positive("Dung lượng phải > 0"),
    price: z.number().int().positive("Giá phải > 0"),

    location: z.object({
        province: z.string().min(1, "Chọn tỉnh/thành"),
        district: z.string(),
    }),

    condition: z.object({
        cosmetic: z.enum(["99", "95", "90", "lt90"]),
        screen: z.enum(["zin", "ep-kinh", "thay"]),
        batteryPercent: z.number().int().min(1).max(100),
        batteryOriginal: z.boolean(),
        faceId: z.boolean(),
        fingerprint: z.boolean(),
        signal: z.boolean(),
        wifi: z.boolean(),
        camera: z.boolean(),
        speaker: z.boolean(),
        origin: z.enum(["chinh-hang", "xach-tay", "dung"]),
    }),

    images: z
        .array(
            z.object({
                id: z.string(),
                type: imageTypeEnum,
                previewUrl: z.string().min(1),
                name: z.string().optional(),
                file: z.instanceof(File).optional(),
            })
        )
        .min(1),

    description: z.string().min(10, "Mô tả ít nhất 10 ký tự"),
    escrowEnabled: z.boolean(),
});

export type CreatePostForm = z.infer<typeof createPostSchema>;
