import { createSystem, defineConfig, defaultConfig } from "@chakra-ui/react";

export const breakpoints = {
  base: "0em", // 0px
  xm: "24em", // ~384px
  sm: "30em", // ~480px
  md: "48em", // ~768px
  lg: "62em", // ~992px
  xl: "80em", // ~1280px
  "2xl": "96em", // ~1536px
};

export const themeTokens = {
  colors: {
    text_primary: { value: 'rgba(0, 0, 0, 1)' },
    secondary: { value: 'rgba(0, 0, 0, 1)' },
    base_white: { value: 'rgba(255, 255, 255, 1)' },
    base_gray: { value: 'rgba(199, 199, 199, 1)' },
    base_black: { value: 'rgba(0, 0, 0, 1)' },
    light_gray: { value: 'rgba(230, 230, 230, 1)' },
    dark_gray: { value: 'rgba(71, 71, 71, 1)' },
    input_border: { value: 'rgba(0, 0, 0, 1)' },
    side_menu_color: { value: '#3b306d' },
  },
};

const customConfig = defineConfig({
  globalCss: {
    "*": {
      fontFamily: "InterRegular",
    },
  },
  theme: { tokens: themeTokens, breakpoints },
});

export default createSystem(defaultConfig, customConfig);