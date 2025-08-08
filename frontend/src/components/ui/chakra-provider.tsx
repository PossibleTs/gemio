'use client';

import { ChakraProvider as Provider } from '@chakra-ui/react';
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode';
import theme from "@app/config/theme";

export function ChakraProvider(props: ColorModeProviderProps) {
  return (
    <ColorModeProvider forcedTheme="light" {...props}>
      <Provider value={theme}>
        {props.children}
      </Provider>
    </ColorModeProvider>
  );
}
