import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppContextProvider } from './context/context'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from "react-query"

import App from './App'

const theme = extendTheme({
  styles: {
    global: () => ({
      body: {
        bg: "blue.100",
      }
    })
  }
})

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppContextProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </QueryClientProvider>
    </AppContextProvider>
  </React.StrictMode>,
)
