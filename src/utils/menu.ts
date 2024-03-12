import inquirer from 'inquirer';

export const entryPoint = async () => {
  const questions = [
    {
      name: 'choice',
      type: 'list',
      message: 'Действие:',
      choices: [
        {
          name: 'Create New Wallets',
          value: 'createWallets',
        },
        {
          name: 'Faucet',
          value: 'faucet',
        },
        {
          name: 'Check balance',
          value: 'balance',
        },
        {
          name: 'Tranfers to your wallet',
          value: 'transferToYourself',
        },
        {
          name: 'Transfers to a random wallet',
          value: 'transferToRandom',
        },
      ],
      loop: false,
    },
  ];

  const answers = await inquirer.prompt(questions);
  return answers.choice;
};
