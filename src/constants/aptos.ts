import { Network } from "@aptos-labs/ts-sdk";

const getNetwork = () => {
    const network = process.env.NEXT_PUBLIC_APTOS_NETWORK;
    if (network === "mainnet") {
        return Network.MAINNET;
    } else if (network === "testnet") {
        return Network.TESTNET;
    } else {
        return Network.DEVNET;
    }
};

const getApiKey = () => {
    const network = process.env.NEXT_PUBLIC_APTOS_NETWORK;
    if (network === "mainnet") {
        return process.env.NEXT_PUBLIC_APTOS_MAINNET_API_KEY || "";
    } else if (network === "testnet") {
        return process.env.NEXT_PUBLIC_APTOS_TESTNET_API_KEY || "";
    } else {
        return process.env.NEXT_PUBLIC_APTOS_DEVNET_API_KEY || "";
    }
};

export default {
    NETWORK: getNetwork(),
    API_KEY: getApiKey(),
}