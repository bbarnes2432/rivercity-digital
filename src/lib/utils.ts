import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* The shadcn/ui class helper. This project isn't a shadcn install — it has no
 * components.json and its own components live in src/app/_components with
 * hand-written CSS — but components sourced from the shadcn ecosystem all
 * import `cn` from "@/lib/utils", so the path exists to let them paste in
 * unmodified.
 *
 * clsx flattens conditionals; twMerge resolves Tailwind conflicts so a caller's
 * className genuinely overrides the component's defaults rather than depending
 * on stylesheet order (`px-2` passed in beats a built-in `px-6`). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
