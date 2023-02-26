#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const meow_1 = __importDefault(require("meow"));
const _app_1 = __importDefault(require("./_app"));
(0, meow_1.default)(`
	Usage
	  $ npx housecode

	Options
		--name  Your name

	Examples
	  $ test --name=Jane
	  Hello, Jane
`, {
    flags: {
        name: {
            type: "string",
        },
    },
});
(0, ink_1.render)(react_1.default.createElement(_app_1.default, null));
