import { Client, ClientOptions, Interaction, Message } from 'discord.js';
import { Command, Controller, ControllerAction, ControllerConfig, Servers } from '../types';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder } from '@discordjs/builders';
import { BodyInit } from 'node-fetch';

export interface DiscordBotOptions {
  clientOptions: ClientOptions;
  token: string;
  clientId: string;
  commands?: Command[];
  controllerConfig?: ControllerConfig;
  controllers?: Controller[];
  onInit?: (client: Client) => any;
  onReady?: (client: Client) => any;
}

class DiscordBot {
  constructor(options: DiscordBotOptions) {
    this.options = options;

    this.client = new Client(this.options.clientOptions);

    this.commands = options.commands?.map((command: Command) =>
      new SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description ?? '')
        .toJSON(),
    );

    this.helpTemplate = options.controllerConfig?.helpTitle ?? '';
    options.controllers?.forEach((controller: Controller): void => {
      this.helpTemplate += `\n ${options.controllerConfig?.prefix ?? ''}${controller.command} - ${
        controller.description
      }`;
    });

    this.rest = new REST({ version: '9' }).setToken(options.token);

    this.client.on('ready', (client: Client): void => {
      this.servers = client.guilds.cache.reduce((p, guild) => ({ ...p, [guild.id]: guild }), {});
      client.guilds.cache.forEach(async ({ id }) => {
        await this.rest.put(Routes.applicationGuildCommands(options.clientId, id), {
          body: this.commands,
        });
      });
      if (typeof this.options.onReady === 'function') this.options.onReady(client);
    });

    this.client.on('interactionCreate', async (interaction: Interaction): Promise<void> => {
      if (!interaction.isCommand()) return;

      const actionCommand: Command | undefined = options.commands?.find(
        (command: Command) => command.name === interaction.commandName,
      );

      if (actionCommand?.action) {
        await actionCommand.action(interaction);
      }
    });

    this.client.on('message', (message: Message): void => {
      if (message.author.bot) return;

      const helpCommand = `${options.controllerConfig?.prefix ?? ''}help`;

      if (message.content === helpCommand) {
        message.channel.send(this.helpTemplate);
      }

      options.controllers?.forEach((controller: Controller): void => {
        const literalRegex = /[{}]/g;
        const [literal, literalVariable] = controller.command.split(literalRegex).filter(Boolean);
        const command = `${options.controllerConfig?.prefix ?? ''}${literal}`.trim();
        const splitContent = message.content.split(' ');

        if (command.split(' ').every((v, i) => splitContent[i] === v)) {
          controller.action?.({
            message,
            client: this.client,
            servers: this.servers,
            variables: {
              [literalVariable]: message.content.replace(command, '').trim(),
            },
          } as ControllerAction);
        }
      });
    });

    if (typeof this.options.onInit === 'function') this.options.onInit(this.client);
  }

  options: DiscordBotOptions;
  client: Client;
  commands: BodyInit | unknown;
  helpTemplate: string;
  rest: REST;
  servers: Servers = {};
}

export default DiscordBot;
