import DiscordBot, { DiscordBotOptions } from './DiscordBot';

const createDiscordBot: (discordBotOptions: DiscordBotOptions) => Promise<DiscordBot> = async (
  discordBotOptions: DiscordBotOptions,
): Promise<DiscordBot> => {
  const discordBot = new DiscordBot(discordBotOptions);
  await discordBot.client.login(discordBotOptions.token);

  return discordBot;
};

export default createDiscordBot;
