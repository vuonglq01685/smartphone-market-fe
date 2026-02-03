export type PostItem = {
    id: string;
    title: string;

    brand: string;
    price: number;

    province: string;
    district?: string;

    createdAt: string;

    accountLabel: "personal" | "shop" | "verified-shop";
    aiScore: number;
    escrowEnabled: boolean;

    // condition fields cho filter đúng
    cosmetic: "99" | "95" | "90" | "lt90";
    batteryPercent: number;
};
