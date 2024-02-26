import axios from "axios";

import { Faucet_URLs } from "../constants/faucet.js";
import { capchaKey, googleKey } from "../config.js";

export default async function solveCaptcha() {
  const pageUrl = Faucet_URLs.beta5;

  try {
    const response = await axios.post("http://2captcha.com/in.php", {
      key: capchaKey,
      method: "userrecaptcha",
      googlekey: googleKey,
      pageurl: pageUrl,
      json: 1,
    });

    const requestId: { id: number } = response.data.request;
    console.log("Запрос на решение капчи отправлен. ID запроса:", requestId);
    await new Promise((resolve) => setTimeout(resolve, 20000));

    const captchaSolution = await checkCaptchaStatus(requestId, capchaKey);

    return captchaSolution;
  } catch (error) {
    console.error("Ошибка:", error);
    throw error;
  }
}

async function checkCaptchaStatus(requestId: { id: number }, apiKey: string) {
  try {
    const resultResponse = await axios.get(
      `http://2captcha.com/res.php?key=${apiKey}&action=get&id=${requestId}&json=1`,
    );
    const result = resultResponse.data;

    if (result.status === 1) {
      console.log("Капча решена");
      return result.request;
    } else if (result.status === 0) {
      console.log("Капча еще не решена. Повторная проверка через 5 секунд...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return await checkCaptchaStatus(requestId, apiKey);
    } else {
      console.error("Произошла ошибка при решении капчи:", result.request);
      throw new Error(`Ошибка при решении капчи: ${result.request}`);
    }
  } catch (error) {
    console.error("Ошибка при проверке статуса капчи:", error);
    throw error;
  }
}
