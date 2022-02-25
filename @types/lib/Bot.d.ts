import { Client, ClientOptions } from 'discord.js';
import { Command, Controller, ControllerConfig } from '../types';
import { REST } from '@discordjs/rest';
import { BodyInit } from 'node-fetch';
export interface BotOptions {
    clientOptions: ClientOptions;
    token: string;
    clientId: string;
    commands?: Command[];
    controllerConfig?: ControllerConfig;
    controllers?: Controller[];
}
declare class Bot {
    constructor(options: BotOptions);
    options: BotOptions;
    client: Client;
    commands: BodyInit | unknown;
    helpTemplate: string;
    rest: REST;
}
export default Bot;
