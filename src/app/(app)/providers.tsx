"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect } from "react";

interface Props extends React.PropsWithChildren {
}

export const Providers: React.FC<Props> = ({ children, ...props }) => {
    const { connect, connected } = useWallet();

    useEffect(() => {
        if (!connected) {
            if (!connected) {
                connect("Petra");
            }
        }
    }, [connected, connect]);
    
    return (
        <>
            {children}
        </>
    );
};