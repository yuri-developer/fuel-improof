import axios, { AxiosResponse } from 'axios';

export const dispenseTokens = async (address: string, captcha: string) => {
  const requestData = {
    address,
    captcha,
  };

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.post('https://faucet-beta-5.fuel.network/dispense', requestData, config);

    if (response.data.status === 'Success') {
      // console.log('Успешный ответ:', response.data);
    } else {
      console.error('Ошибка при отправке запроса. Неправильный ответ:', response.data);
    }

    return response;
  } catch (error) {
    throw error;
  }
};
