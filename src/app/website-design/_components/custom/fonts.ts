import { Lora, Poppins } from "next/font/google";

/* Type for the Website Design page's custom look (Brandon's Nov 9, 2026 brief,
 * page 4): Lora 600 headings, Poppins body. Scoped to this page through the
 * CSS variables below, so the rest of the site keeps its own type. */
export const lora = Lora({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
  variable: "--font-lora",
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-poppins",
});
