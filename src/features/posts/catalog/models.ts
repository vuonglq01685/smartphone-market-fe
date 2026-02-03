export type ModelSuggestion = {
    brand: string;
    model: string;
    keywords: string[]; // để match không dấu
};

export const MODEL_SUGGESTIONS: ModelSuggestion[] = [
    { brand: "Apple", model: "iPhone 13 Pro Max", keywords: ["iphone 13 pro max", "ip13pm", "13pm"] },
    { brand: "Apple", model: "iPhone 13", keywords: ["iphone 13", "ip13"] },
    { brand: "Apple", model: "iPhone 12", keywords: ["iphone 12", "ip12"] },
    { brand: "Apple", model: "iPhone 15 Pro Max", keywords: ["iphone 15 pro max", "ip15pm", "15pm"] },

    { brand: "Samsung", model: "Galaxy S23 Ultra", keywords: ["s23 ultra", "galaxy s23 ultra"] },
    { brand: "Samsung", model: "Galaxy S24 Ultra", keywords: ["s24 ultra", "galaxy s24 ultra"] },

    { brand: "Xiaomi", model: "Xiaomi 13T", keywords: ["xiaomi 13t", "13t"] },
    { brand: "OPPO", model: "OPPO Reno 10", keywords: ["reno 10", "oppo reno 10"] },
];
