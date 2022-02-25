"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DiscordBot_1 = __importDefault(require("./DiscordBot"));
const createDiscordBot = (discordBotOptions) => new DiscordBot_1.default(discordBotOptions);
exports.default = createDiscordBot;
