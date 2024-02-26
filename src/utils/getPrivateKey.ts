import fs from "fs";

export function getPrivateKeys(): string[] {
  let privateKeys: string[] = readWallets("./data/private_keys.txt");

  return privateKeys;
}

function readWallets(filePath: string) {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const lines = fileContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");
    return lines;
  } catch (error: any) {
    console.error("Error reading the file:", error.message);
    return [];
  }
}
