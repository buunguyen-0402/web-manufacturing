/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            boxShadow: {
                inner1: "0 0 4px 0 rgba(0,0,0,0.3) inset",
                level1: "0px 3px 1px -2px rgb(0 0 0 / 0.2), 0px 2px 2px 0px rgb(0 0 0 / 0.14),0px 1px 52px 0px rgb(0 0 0 / 0.12)",
                type1: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                sub: "0px 5px 5px -3px rgb(0 0 0 / 0.2), 0px 8px 10px 1px rgb(0 0 0 / 0.14), 0px 3px 14px 2px rgb(0 0 0 / 0.12)",
                main: "0px 8px 10px -6px rgb(0 0 0 / 0.2), 0px 16px 24px 2px rgb(0 0 0 / 0.14), 0px 6px 30px 5px rgb(0 0 0 / 0.12)",
            },
            lineHeight: 1.5,
        },
        colors: {
            transparent: "transparent",
            primary: {
                1: "#263F59",
                2: "#4D7EB3",
                3: "#A6BED9",
                4: "#e6f0ff",
            },
            accent: {
                1: "#FC8403",
                2: "#FECE9A",
            },
            neutron: {
                1: "#16181D",
                2: "#656A81",
                3: "#F6F6F6",
                4: "#FFFFFF",
            },
            maintenanceStatus: {
                0: "#888888",
                1: "#D24545",
                2: "#2C7865",
                3: "#FFAF45",
                4: "#387ADF",
            },
            warning: { 1: "#D83704", 2: "#FFCDD2" },
            hoverBg: "rgba(0,0,0,0.3)",
        },

        screens: {
            "3xl": { max: "1800px" },

            "2xl": { max: "1600px" },

            xl: { max: "1279px" },

            lg: { max: "1023px" },

            md: { max: "767px" },

            sm: { max: "639px" },
        },
    },
    plugins: [
        function ({ addUtilities }) {
            const newUtilities = {
                ".no-scrollbar::-webkit-scrollbar": {
                    display: "none",
                },
                ".no-scrollbar": {
                    "-ms-overflow-style": "none",
                    "scrollbar-width": "none",
                },
            }

            addUtilities(newUtilities)
        },
    ],
}
