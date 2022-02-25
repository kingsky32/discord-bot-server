import DiscordBot, { DiscordBotOptions } from './DiscordBot';

const createDiscordBot = (discordBotOptions: DiscordBotOptions): DiscordBot => new DiscordBot(discordBotOptions);

export default createDiscordBot;
