import { frameworkType } from "../types";

export default class YusrDefaultCss {
  public static getDefaultCss(framework: frameworkType): string {
    if (framework === "Vite (React)") return this._getViteCustomCss();

    return this._getNextCustomCss();
  }
  private static _getViteCustomCss(): string {
    return `
        /* --- Yusr Auto Generated CSS Styles --- */
        @import "tailwindcss";
        @import "tw-animate-css";
        @import "shadcn/tailwind.css";
        @import "@fontsource/ibm-plex-sans-arabic/100.css";
        @import "@fontsource/ibm-plex-sans-arabic/400.css";
        @import "@fontsource/ibm-plex-sans-arabic/700.css";
        @import "@yusr_systems/ui/style.css";
        @source "../node_modules/@yusr_systems/ui/dist/yusr-ui.js";
        `;
  }

  private static _getNextCustomCss(): string {
    return `
        /* --- Yusr Auto Generated CSS Styles --- */
        @import "tailwindcss";
        @import "shadcn/tailwind.css";
        @import "@fontsource/ibm-plex-sans-arabic/100.css";
        @import "@fontsource/ibm-plex-sans-arabic/400.css";
        @import "@fontsource/ibm-plex-sans-arabic/700.css";
        @import "@yusr_systems/ui/style.css";
        @source "../node_modules/@yusr_systems/ui/dist/yusr-ui.js";
        `;
  }
}
