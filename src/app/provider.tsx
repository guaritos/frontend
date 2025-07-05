"use client";

import { Provider as UIProvider } from "@/components/ui/provider"

export function Provider({ children }: { children: React.ReactNode }) {
    return (
        <UIProvider>
            {children}
        </UIProvider>
    )
}

