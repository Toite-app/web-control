export type TailwindColorRange =
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 950;
export type TailwindColorSet = Record<TailwindColorRange, string>;

export type ToiteConfig = {
  appName: string;
  logo: {
    svg: string;
  };
  theme: {
    colors: {
      brand: {
        primary: TailwindColorSet;
        secondary: TailwindColorSet;
      };
    };
  };
};

export const TOITE_CONFIG: ToiteConfig = {
  appName: "ToitFood",
  logo: {
    svg: "/toite.svg",
  },
  theme: {
    colors: {
      brand: {
        primary: {
          100: "#effaff",
          200: "#ddf3fe",
          300: "#b7e8fd",
          400: "#7ad7fb",
          500: "#36c1f6",
          600: "#10a8e5",
          700: "#0686c3",
          800: "#076b9e",
          900: "#0b5a82",
          950: "#0e4b6c",
        },
        secondary: {
          100: "#fdf3fc",
          200: "#fbe8fa",
          300: "#f8d0f5",
          400: "#f4aaec",
          500: "#ee76de",
          600: "#e346cc",
          700: "#ce25ad",
          800: "#b0198d",
          900: "#911774",
          950: "#791961",
        },
      },
    },
  },
};

export default TOITE_CONFIG;
