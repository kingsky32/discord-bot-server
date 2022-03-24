"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const builders_1 = require("@discordjs/builders");
class DiscordBot {
    constructor(options) {
        var _a, _b, _c, _d;
        this.servers = {};
        this.options = options;
        this.client = new discord_js_1.Client(this.options.clientOptions);
        this.commands = (_a = options.commands) === null || _a === void 0 ? void 0 : _a.map((command) => new builders_1.SlashCommandBuilder().setName(command.name).setDescription(command.description).toJSON());
        this.helpTemplate = (_c = (_b = options.controllerConfig) === null || _b === void 0 ? void 0 : _b.helpTitle) !== null && _c !== void 0 ? _c : '';
        (_d = options.controllers) === null || _d === void 0 ? void 0 : _d.forEach((controller) => {
            var _a, _b;
            this.helpTemplate += `\n ${(_b = (_a = options.controllerConfig) === null || _a === void 0 ? void 0 : _a.prefix) !== null && _b !== void 0 ? _b : ''}${Array.isArray(controller.command) ? `[${controller.command.join(', ')}]` : controller.command} - ${controller.description}`;
        });
        this.rest = new rest_1.REST({ version: '9' }).setToken(options.token);
        this.client.on('ready', (client) => {
            this.servers = client.guilds.cache.reduce((p, guild) => (Object.assign(Object.assign({}, p), { [guild.id]: guild })), {});
            client.guilds.cache.forEach(({ id }) => __awaiter(this, void 0, void 0, function* () {
                yield this.rest.put(v9_1.Routes.applicationGuildCommands(options.clientId, id), {
                    body: this.commands,
                });
            }));
            if (typeof this.options.onReady === 'function')
                this.options.onReady(client);
        });
        this.client.on('interactionCreate', (interaction) => __awaiter(this, void 0, void 0, function* () {
            var _e;
            if (!interaction.isCommand())
                return;
            const actionCommand = (_e = options.commands) === null || _e === void 0 ? void 0 : _e.find((command) => command.name === interaction.commandName);
            if (actionCommand === null || actionCommand === void 0 ? void 0 : actionCommand.action) {
                yield actionCommand.action(interaction);
            }
        }));
        this.client.on('message', (message) => {
            var _a, _b, _c;
            if (message.author.bot)
                return;
            const helpCommand = `${(_b = (_a = options.controllerConfig) === null || _a === void 0 ? void 0 : _a.prefix) !== null && _b !== void 0 ? _b : ''}help`;
            if (message.content === helpCommand) {
                message.channel.send(this.helpTemplate);
            }
            (_c = options.controllers) === null || _c === void 0 ? void 0 : _c.forEach((controller) => {
                const literalRegex = /[{}]/g;
                function callback(command, client, servers) {
                    var _a, _b, _c;
                    const [literal, literalVariable] = command.split(literalRegex).filter(Boolean);
                    const _command = `${(_b = (_a = options.controllerConfig) === null || _a === void 0 ? void 0 : _a.prefix) !== null && _b !== void 0 ? _b : ''}${literal}`.trim();
                    const splitContent = message.content.split(' ');
                    if (_command.split(' ').every((v, i) => splitContent[i] === v)) {
                        (_c = controller.action) === null || _c === void 0 ? void 0 : _c.call(controller, {
                            message,
                            client,
                            servers,
                            variables: {
                                [literalVariable]: message.content.replace(_command, '').trim(),
                            },
                        });
                    }
                }
                if (Array.isArray(controller.command)) {
                    controller.command.forEach((command) => {
                        callback(command, this.client, this.servers);
                    });
                }
                else {
                    callback(controller.command, this.client, this.servers);
                }
            });
        });
        if (typeof this.options.onInit === 'function')
            this.options.onInit(this.client);
    }
}
exports.default = DiscordBot;
