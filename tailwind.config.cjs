/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                ct: {
                    yellow: "#FFBA00",
                    yellow2: "#FFC533",
                    text: "#222222",
                    sub: "#6B7280",
                    bg: "#F5F5F5",
                    line: "#E5E7EB",
                    chip: "#F3F4F6",
                },
            },
            boxShadow: {
                ct: "0 1px 2px rgba(0,0,0,.06)",
            },
        },
    },
    plugins: [],
};
