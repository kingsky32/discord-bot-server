import { Client, Guild, Interaction, Message } from 'discord.js';
export interface Command {
    name: string;
    description: string;
    action?: (interaction: Interaction) => Promise<void>;
}
export interface ControllerConfig {
    prefix?: string;
    helpTitle?: string;
}
export interface ControllerActionVariables {
    [K: string]: string | null | undefined;
}
export interface ControllerAction {
    client: Client;
    servers: Servers;
    message: Message;
    variables: ControllerActionVariables;
}
export interface Controller {
    command: string;
    description?: string;
    action?: (controllerAction: ControllerAction) => any;
}
export interface Server extends Guild {
}
export interface Servers {
    [k: string]: Server;
}
