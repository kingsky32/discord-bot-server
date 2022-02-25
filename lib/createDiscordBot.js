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
exports.createDiscordBot = void 0;
const discord_js_1 = require("discord.js");
const rest_1 = require("@discordjs/rest");
const builders_1 = require("@discordjs/builders");
const v9_1 = require("discord-api-types/v9");
const createDiscordBot = (config) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const client = new discord_js_1.Client(config === null || config === void 0 ? void 0 : config.clientOptions);
    const commands = (_a = config.commands) === null || _a === void 0 ? void 0 : _a.map((command) => {
        var _a;
        return new builders_1.SlashCommandBuilder()
            .setName(command.name)
            .setDescription((_a = command.description) !== null && _a !== void 0 ? _a : '')
            .toJSON();
    });
    let helpTemplete = (_c = (_b = config.controllerConfig) === null || _b === void 0 ? void 0 : _b.helpTitle) !== null && _c !== void 0 ? _c : '';
    (_d = config.controllers) === null || _d === void 0 ? void 0 : _d.forEach((controller) => {
        var _a, _b;
        helpTemplete += `\n ${(_b = (_a = config.controllerConfig) === null || _a === void 0 ? void 0 : _a.prefix) !== null && _b !== void 0 ? _b : ''}${controller.command} - ${controller.description}`;
    });
    const rest = new rest_1.REST({ version: '9' }).setToken(config.token);
    client.on('ready', (client) => {
        client.guilds.cache.forEach(({ id }) => __awaiter(void 0, void 0, void 0, function* () {
            yield rest.put(v9_1.Routes.applicationGuildCommands(config.clientId, id), {
                body: commands,
            });
        }));
    });
    client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _e;
        if (!interaction.isCommand())
            return;
        const actionCommand = (_e = config.commands) === null || _e === void 0 ? void 0 : _e.find((command) => command.name === interaction.commandName);
        if (actionCommand === null || actionCommand === void 0 ? void 0 : actionCommand.action) {
            yield actionCommand.action(interaction);
        }
    }));
    client.on('message', (message) => {
        var _a, _b, _c;
        if (message.author.bot)
            return;
        const command = `${(_b = (_a = config.controllerConfig) === null || _a === void 0 ? void 0 : _a.prefix) !== null && _b !== void 0 ? _b : ''}help`;
        if (message.content === command) {
            message.channel.send(helpTemplete);
        }
        (_c = config.controllers) === null || _c === void 0 ? void 0 : _c.forEach((controller) => {
            var _a, _b, _c;
            const command = `${(_b = (_a = config.controllerConfig) === null || _a === void 0 ? void 0 : _a.prefix) !== null && _b !== void 0 ? _b : ''}${controller.command}`;
            if (command === message.content) {
                (_c = controller.action) === null || _c === void 0 ? void 0 : _c.call(controller, message);
            }
        });
    });
    yield client.login(config.token);
});
exports.createDiscordBot = createDiscordBot;
exports.default = exports.createDiscordBot;
