import fs from "fs";
import { AccountInfo } from "../interfaces/AccountInfo.js";

export const writeToCSV = (accountInfos: AccountInfo[]) => {
  const csvData = accountInfos.map(({ address, privateKey, balance }) => `${address},${privateKey},${balance}`);
  const csvContent = ["Address,PrivateKey,Balance", ...csvData].join("\n");

  fs.writeFileSync("./data/accountBalance.csv", csvContent);
  console.log(`Successful recording of the balance to the ./data/accountBalance.csv file`);
};
