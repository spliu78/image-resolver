#!/usr/bin/env node --experimental-wasm-threads --experimental-wasm-bulk-memory
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ImageResolver_1 = require("./ImageResolver");
var commander_1 = require("commander");
var process_1 = require("process");
var path_1 = __importDefault(require("path"));
// convert: ir a.jpg --convert png 
// minify: ir a.jpg --minify [x/x,y/xx%]
// watermark: ir a.jpg --watermark {text,[fontsize,fontfile,x,y,fontcolor,border,bordercolor]}
var watermarkFormatHint = "{text: string, fontsize: number, fontfile: string, option ?: { x?: number, y?: number, fontcolor?: string, border?: number, bordercolor?: string}}";
commander_1.program
    .argument('<image>', 'image path')
    .option('-o, --output <outputPath>', 'output path')
    .option('-s, --getsize ', 'get image size')
    .option('-c, --convert <extensionType>', 'convert extension')
    .option('-m, --minify <option>', 'minify images base on it\'s size, [ w / w,h / per% ]')
    .option('-w, --watermark [options...]', "add text watermark to image, $1: text, $2: fontSize (24 as default)")
    .option('--wm-conf <options>', "set watermark conf using JSON format: '" + watermarkFormatHint + "'")
    .option('--debug', 'debugger mode, set ffmpeg\'s log option to true')
    .addHelpText('after', "\n\nExample :\n# get size:\n$ ir example/from.jpg -s\n\n# convert extension:\n$ ir example/from.jpg -c webp\n\n# convert extension & minify & watermark\n$ ir example/from.jpg -o example -c webp -m 10% -w watermark --debug\n\n# watermark with json config\n$ ir example/from.jpg -o example/ --wm-conf '{\"text\":\"xiagao\",\"fontsize\":48,\"fontfile\":\"./font/arial.ttf\"}' --debug\n  ")
    .action(function (image) { return __awaiter(void 0, void 0, void 0, function () {
    var options, _a, output, _b, convert, minify, watermark, wmConf, _c, debug, getsize, inputName, outputName, ir, _d, _e, resize, size, ratio, _f, text, fontsize, fontfile, option;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                options = commander_1.program.opts();
                _a = options.output, output = _a === void 0 ? '.' : _a, _b = options.convert, convert = _b === void 0 ? path_1.default.extname(image) : _b, minify = options.minify, watermark = options.watermark, wmConf = options.wmConf, _c = options.debug, debug = _c === void 0 ? false : _c, getsize = options.getsize;
                debug && console.log(options);
                inputName = path_1.default.resolve(path_1.default.join(process_1.cwd(), image));
                outputName = path_1.default.resolve(path_1.default.join(process_1.cwd(), output, path_1.default.basename(image, path_1.default.extname(image)) + ".ir" + (convert[0] === '.' ? convert : '.' + convert)));
                ir = new ImageResolver_1.ImageResolver('', debug);
                return [4 /*yield*/, ir.init()];
            case 1:
                _g.sent();
                return [4 /*yield*/, ir.setImage(inputName)];
            case 2:
                _g.sent();
                if (!getsize) return [3 /*break*/, 4];
                _e = (_d = console).log;
                return [4 /*yield*/, ir.getSize()];
            case 3:
                _e.apply(_d, [_g.sent()]);
                return [2 /*return*/];
            case 4:
                resize = [-1, -1];
                if (!minify) return [3 /*break*/, 8];
                if (!minify.includes(',')) return [3 /*break*/, 5];
                resize = [Number(minify.split(',')[0]) || -1, Number(minify.split(',')[1]) || -1];
                return [3 /*break*/, 8];
            case 5:
                if (!minify.includes('%')) return [3 /*break*/, 7];
                return [4 /*yield*/, ir.getSize()];
            case 6:
                size = _g.sent();
                ratio = Number(minify.split('%')[0]) / 100 || 1;
                if ((size === null || size === void 0 ? void 0 : size.width) && ratio !== 1)
                    resize = [size.width * ratio, -1];
                return [3 /*break*/, 8];
            case 7:
                resize = [Number(minify) || -1, -1];
                _g.label = 8;
            case 8:
                if (!(minify || options.convert)) return [3 /*break*/, 10];
                return [4 /*yield*/, ir.minify.apply(ir, __spreadArrays(resize, [convert || path_1.default.extname(image)]))];
            case 9:
                _g.sent();
                _g.label = 10;
            case 10:
                if (!(watermark === null || watermark === void 0 ? void 0 : watermark.length)) return [3 /*break*/, 12];
                //     await ir.watermark('xiagao', 24, path.join(__dirname, '../src/assets/arial.ttf'));
                return [4 /*yield*/, ir.watermark(watermark[0], Number(watermark[1]) || 24, path_1.default.join(__dirname, '../../font/arial.ttf'))];
            case 11:
                //     await ir.watermark('xiagao', 24, path.join(__dirname, '../src/assets/arial.ttf'));
                _g.sent();
                return [3 /*break*/, 14];
            case 12:
                if (!wmConf) return [3 /*break*/, 14];
                _f = JSON.parse(wmConf), text = _f.text, fontsize = _f.fontsize, fontfile = _f.fontfile, option = _f.option;
                console.log(JSON.parse(wmConf));
                return [4 /*yield*/, ir.watermark(text, fontsize, fontfile, option)];
            case 13:
                _g.sent();
                _g.label = 14;
            case 14: return [4 /*yield*/, ir.output(outputName)];
            case 15:
                _g.sent();
                return [2 /*return*/];
        }
    });
}); });
commander_1.program.parse(process.argv);
