import { Client, ClientOptions, Interaction, Message } from 'discord.js';
import { REST } from '@discordjs/rest';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Routes } from 'discord-api-types/v9';
import { Command, Controller, ControllerAction, ControllerConfig } from '../types';

export interface CreateDiscordBotConfig {
  clientOptions: ClientOptions;
  token: string;
  clientId: string;
  commands?: Command[];
  controllerConfig?: ControllerConfig;
  controllers?: Controller[];
}

export const createDiscordBot = async (config: CreateDiscordBotConfig): Promise<void> => {
  const client = new Client(config?.clientOptions);
  const commands = config.commands?.map((command: Command) =>
    new SlashCommandBuilder()
      .setName(command.name)
      .setDescription(command.description ?? '')
      .toJSON(),
  );

  let helpTemplate: string = config.controllerConfig?.helpTitle ?? '';
  config.controllers?.forEach((controller: Controller): void => {
    helpTemplate += `\n ${config.controllerConfig?.prefix ?? ''}${controller.command} - ${controller.description}`;
  });

  const rest: REST = new REST({ version: '9' }).setToken(config.token);

  client.on('ready', (client: Client): void => {
    client.guilds.cache.forEach(async ({ id }) => {
      await rest.put(Routes.applicationGuildCommands(config.clientId, id), {
        body: commands,
      });
    });
  });

  client.on('interactionCreate', async (interaction: Interaction): Promise<void> => {
    if (!interaction.isCommand()) return;

    const actionCommand: Command | undefined = config.commands?.find(
      (command: Command) => command.name === interaction.commandName,
    );

    if (actionCommand?.action) {
      await actionCommand.action(interaction);
    }
  });

  client.on('message', (message: Message): void => {
    if (message.author.bot) return;

    const helpCommand = `${config.controllerConfig?.prefix ?? ''}help`;

    if (message.content === helpCommand) {
      message.channel.send(helpTemplate);
    }

    config.controllers?.forEach((controller: Controller) => {
      const literalRegex = /[{}]/g;
      const [literal, literalVariable] = controller.command.split(literalRegex).filter(Boolean);
      const command = `${config.controllerConfig?.prefix ?? ''}${literal}`.trim();
      const splitContent = message.content.split(' ');

      if (command.split(' ').every((v, i) => splitContent[i] === v)) {
        controller.action?.({
          message,
          client,
          variables: {
            [literalVariable]: message.content.replace(command, '').trim(),
          },
        } as ControllerAction);
      }
    });
  });

  await client.login(config.token);
};

export default createDiscordBot;
