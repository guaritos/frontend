import aptos from "@/constants/aptos";
import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";

export const aptosConfig = new AptosConfig({
    network: aptos.NETWORK,
})
export const aptosClient = new Aptos(aptosConfig);