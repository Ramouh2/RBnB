import type { MetadataRoute } from "next";
import { RBNB_SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: RBNB_SITE.title,
    short_name: RBNB_SITE.name,
    description: RBNB_SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: RBNB_SITE.themeColor,
    theme_color: RBNB_SITE.themeColor,
    lang: "fr",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
