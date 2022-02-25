import { Interaction, Message } from 'discord.js';
export interface Command {
    name: string;
    description: string;
    action?: (interaction: Interaction) => Promise<void>;
}
export interface ControllerConfig {
    prefix?: string;
    helpTitle?: string;
}
export interface Controller {
    command: string;
    description?: string;
    action?: (message: Message) => any;
}
