import { Client, Interaction, Message } from 'discord.js';
import { REST } from '@discordjs/rest';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Routes } from 'discord-api-types/v9';
import { CreateDiscordBotConfig, Command, Controller } from '../@types';

const createDiscrodBot = async (config: CreateDiscordBotConfig) => {
  const client = new Client(config?.clientOptions);
  const commands = config.commands?.map((command: Command) =>
    new SlashCommandBuilder()
      .setName(command.name)
      .setDescription(command.description ?? '')
      .toJSON(),
  );
  let helpTemplete = config.controllerConfig?.helpTitle ?? '';
  config.controllers?.forEach((controller: Controller) => {
    helpTemplete += `\n ${config.controllerConfig?.prefix ?? ''}${controller.command} - ${controller.description}`;
  });

  const rest = new REST({ version: '9' }).setToken(config.token);

  client.on('ready', (client: Client) => {
    client.guilds.cache.forEach(async ({ id }) => {
      await rest.put(Routes.applicationGuildCommands(config.clientId, id), {
        body: commands,
      });
    });
  });

  client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    const actionCommand: Command | undefined = config.commands?.find(
      (command: Command) => command.name === interaction.commandName,
    );

    if (actionCommand?.action) {
      await actionCommand.action(interaction);
    }
  });

  client.on('message', (message: Message) => {
    if (message.author.bot) return;

    const command = `${config.controllerConfig?.prefix ?? ''}help`;

    if (message.content === command) {
      message.channel.send(helpTemplete);
    }

    config.controllers?.forEach((controller: Controller) => {
      const command = `${config.controllerConfig?.prefix ?? ''}${controller.command}`;

      if (command === message.content) {
        controller.action?.(message);
      }
    });
  });

  await client.login(config.token);
};

export default createDiscrodBot;
