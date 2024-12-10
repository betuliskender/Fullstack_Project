import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
};

const theme = extendTheme({
  config,
  styles: {
    global: {
      "html, body, #root": {
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      },
    },
  },
});

export default theme;