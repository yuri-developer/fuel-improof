import { Provider, Wallet } from "fuels";
import { RPC_URLs } from "../constants/RPC.js";

const getBalance = async (privateKey: string) => {
  try {
    const provider = await Provider.create(RPC_URLs.beta5);
    const myWallet = Wallet.fromPrivateKey(privateKey, provider);
    const balance = await myWallet.getBalances();

    return balance;
  } catch (error) {
    console.error(`Unable to get wallet balance`, error);
  }

  return [];
};

export default getBalance;
