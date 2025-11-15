import { createRoot } from "react-dom/client";
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from "./App.tsx";
import "./index.css";
import { config } from './config/wagmi'

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </WagmiProvider>
);
