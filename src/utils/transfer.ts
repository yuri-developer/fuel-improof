import { Provider, Wallet, BaseAssetId, BN } from "fuels";
import { RPC_URLs } from "../constants/RPC.js";

export const transferAssets = async (
  senderPrivateKey: string,
  destinationAddress: string,
  amountToTransfer: number,
) => {
  try {
    const provider = await Provider.create(RPC_URLs.beta5);
    const sender = Wallet.fromPrivateKey(senderPrivateKey, provider);

    const { minGasPrice } = provider.getGasConfig();
    const txParams = {
      gasPrice: minGasPrice,
      gasLimit: 1000,
    };

    try {
      const response = await sender.transfer(destinationAddress, amountToTransfer * 10 ** 9, BaseAssetId, txParams);
      await response.wait();

      return true;
    } catch (transferError) {
      console.error("Error during transfer:", transferError);
      return false;
    }
  } catch (error) {
    console.error("Error setting up transfer:", error);
    return false;
  }
};