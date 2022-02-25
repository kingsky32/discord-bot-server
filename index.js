"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Intents = exports.createDiscrodBot = void 0;
const createDiscrodBot_1 = __importDefault(require("./lib/createDiscrodBot"));
exports.createDiscrodBot = createDiscrodBot_1.default;
const discord_js_1 = require("discord.js");
Object.defineProperty(exports, "Intents", { enumerable: true, get: function () { return discord_js_1.Intents; } });
