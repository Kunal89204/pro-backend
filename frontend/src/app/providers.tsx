// app/providers.tsx
'use client'

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { store, persistor } from "@/lib/store";
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react";
import theme from './theme';


export function Providers({ children }: { children: React.ReactNode }) {

  const queryClient = new QueryClient()
  return <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          {children}

        </ChakraProvider>
      </QueryClientProvider>
    </PersistGate>
  </Provider >
}