import { ClientOptions } from 'discord.js';
import { Command, Controller, ControllerConfig } from '../types';
export interface CreateDiscordBotConfig {
    clientOptions: ClientOptions;
    token: string;
    clientId: string;
    commands?: Command[];
    controllerConfig?: ControllerConfig;
    controllers?: Controller[];
}
export declare const createDiscordBot: (config: CreateDiscordBotConfig) => Promise<void>;
export default createDiscordBot;
