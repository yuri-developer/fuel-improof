import { Wallet, sleep } from "fuels";
import fs from "fs";

import { entryPoint } from "./utils/menu.js";
import solveCaptcha from "./utils/capcha.js";
import { dispenseTokens } from "./utils/getTokens.js";
import { getRandomInt, getRandomFloat, shuffle } from "./utils/random.js";
import { getPrivateKeys } from "./utils/getPrivateKey.js";
import { transferAssets } from "./utils/transfer.js";

import { isShuffleWallets, numWalletsToGenerate, pause, transactionCount, transferAmount } from "./config.js";

let privateKeys = getPrivateKeys();

if (isShuffleWallets) {
  shuffle(privateKeys);
}

const createFuelWallet = (countWallets: number) => {
  const privateKeys: string[] = [];

  for (let i = 0; i < countWallets; i++) {
    const { privateKey } = Wallet.generate();
    privateKeys.push(privateKey);
  }

  fs.appendFileSync("./data/new_private_keys.txt", privateKeys.map((key) => key + "\n").join(""));

  console.log(`Создано кошельков: ${countWallets}. Проверяй в new_private_key.txt`);
};

const FaucetModule = async () => {
  for (const private_key of privateKeys) {
    const wallet = Wallet.fromPrivateKey(private_key);

    console.log(`\nНачинаю работу с кошельком ${wallet.address}`);

    try {
      const captchaSolution = await solveCaptcha();

      console.log(`Запрашиваю кран для адреса ${wallet.address}..`);

      const response = await dispenseTokens(`${wallet.address}`, captchaSolution);

      if (response.data.status === "Success") {
        console.log(`Адрес ${wallet.address} успешно обработан. Faucet: ${response.data.status}`);
        fs.appendFileSync("./data/result_success.txt", private_key + "\n");
      } else {
        fs.appendFileSync("./data/result_fail.txt", private_key + "\n");
      }
    } catch (error) {
      console.error(
        `Ошибка обработки адреса ${wallet.address}. Ошибка при решении капчи, либо аккаунт уже запрашивал токены.`,
      );
      fs.appendFileSync("./data/result_fail.txt", private_key + "\n");
    }
  }

  console.log(`Все кошельки запросили кран`);
};

const TransferModule = async (isToYourself: boolean) => {
  for (const private_key of privateKeys) {
    const wallet = Wallet.fromPrivateKey(private_key);

    const randomTransactionCount = getRandomInt(transactionCount[0], transactionCount[1]);

    for (let i = 0; i < randomTransactionCount; i++) {
      try {
        const randomAmount = getRandomFloat(transferAmount[0], transferAmount[1]);
        let destinationAddress: string = "";

        if (isToYourself) {
          destinationAddress = wallet.address.toString();
          console.log(`Отправляю self-транзакцию ${i + 1} на адресе ${wallet.address}`);
        } else {
          destinationAddress = Wallet.generate().address.toString();
          console.log(`Отправляю транзакцию ${i + 1} на адресе ${wallet.address}`);
        }

        const transferSuccess = await transferAssets(wallet.privateKey, destinationAddress, randomAmount);

        if (transferSuccess) {
          console.log(`Транзакция на адресе ${wallet.address} успешно выполнена. Перехожу к следующему адресу.`);
        } else {
          console.error(`Ошибка трансфера на адресе ${wallet.address}`);
        }
      } catch (transferError) {
        console.error(`Ошибка трансфера на адресе ${wallet.address}:`, transferError);
      }

      const sleepTime = getRandomInt(pause[0], pause[1]);

      console.info(`Жду ${sleepTime} сек...`);
      await sleep(sleepTime * 1000);
    }
  }
};

async function startMenu() {
  let mode = await entryPoint();
  switch (mode) {
    case "createWallets":
      createFuelWallet(numWalletsToGenerate);
      break;
    case "faucet":
      await FaucetModule();
      break;
    case "transferToYourself":
      await TransferModule(true);
      break;
    case "transferToRandom":
      await TransferModule(false);
      break;
  }

  console.log("Работа окончена");
}

await startMenu();
