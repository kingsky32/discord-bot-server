import { Client, ClientOptions } from 'discord.js';
import { Command, Controller, ControllerConfig, Servers } from '../types';
import { REST } from '@discordjs/rest';
import { BodyInit } from 'node-fetch';
export interface DiscordBotOptions {
    clientOptions: ClientOptions;
    token: string;
    clientId: string;
    commands?: Command[];
    controllerConfig?: ControllerConfig;
    controllers?: Controller[];
}
declare class DiscordBot {
    constructor(options: DiscordBotOptions);
    options: DiscordBotOptions;
    client: Client;
    commands: BodyInit | unknown;
    helpTemplate: string;
    rest: REST;
    servers: Servers;
}
export default DiscordBot;
