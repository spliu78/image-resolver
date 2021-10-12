"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageResolver = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var ffmpeg_1 = require("@ffmpeg/ffmpeg");
var image_size_1 = __importDefault(require("image-size"));
var util_1 = require("util");
var sizeOf = util_1.promisify(image_size_1.default);
var ImageResolver = /** @class */ (function () {
    function ImageResolver(image, log) {
        if (log === void 0) { log = false; }
        this.image = '';
        this.inputName = 'input';
        this.outputName = '';
        this.ext = '';
        this.ffmpeg = ffmpeg_1.createFFmpeg({
            log: log,
        });
        image && this.setImage(image);
    }
    ImageResolver.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ffmpeg.load()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ImageResolver.prototype.getSize = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sizeOf(this.image)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ImageResolver.prototype.minify = function (width, height, ext) {
        if (width === void 0) { width = -1; }
        if (height === void 0) { height = -1; }
        return __awaiter(this, void 0, void 0, function () {
            var scalConf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (ext)
                            this.ext = ext[0] === '.' ? ext : "." + ext;
                        scalConf = "scale=" + width + ":" + height;
                        // xxx.minify.ext
                        this.outputName = path_1.default.basename(this.inputName, this.ext) + ".minify" + this.ext;
                        return [4 /*yield*/, this.ffmpeg.run('-i', this.inputName, '-vf', scalConf, this.outputName)];
                    case 1:
                        _a.sent();
                        this.inputName = this.outputName;
                        return [2 /*return*/];
                }
            });
        });
    };
    ImageResolver.prototype.watermark = function (text, fontsize, fontfile, option) {
        return __awaiter(this, void 0, void 0, function () {
            var fontFileName, _a, _b, _c, defaultOption, _d, x, y, fontcolor, border, bordercolor, watermarkConf;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        fontFileName = path_1.default.basename(fontfile);
                        _b = (_a = this.ffmpeg).FS;
                        _c = ['writeFile', fontFileName];
                        return [4 /*yield*/, ffmpeg_1.fetchFile(fontfile)];
                    case 1:
                        _b.apply(_a, _c.concat([_e.sent()]));
                        defaultOption = { x: 10, y: 10, fontcolor: 'white', border: 5, bordercolor: '#A9A9A9' };
                        _d = __assign(__assign({}, defaultOption), option), x = _d.x, y = _d.y, fontcolor = _d.fontcolor, border = _d.border, bordercolor = _d.bordercolor;
                        watermarkConf = "drawtext=text='" + text + "':borderw=" + border + ":bordercolor=" + bordercolor
                            + (":x=" + x + ":y=H-th-" + y + ":fontfile=" + fontFileName + ":fontsize=" + fontsize + ":fontcolor=" + fontcolor);
                        // xxx.watermark.ext
                        this.outputName = path_1.default.basename(this.inputName, this.ext) + ".watermark" + this.ext;
                        return [4 /*yield*/, this.ffmpeg.run('-i', this.inputName, '-vf', watermarkConf, this.outputName)];
                    case 2:
                        _e.sent();
                        this.inputName = this.outputName;
                        return [2 /*return*/];
                }
            });
        });
    };
    ImageResolver.prototype.output = function (outputPath) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(path_1.default.extname(outputPath) === this.ext)) return [3 /*break*/, 2];
                        return [4 /*yield*/, fs_1.default.promises.writeFile(outputPath, this.ffmpeg.FS('readFile', this.outputName))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, fs_1.default.promises.writeFile("" + outputPath + this.ext, this.ffmpeg.FS('readFile', this.outputName))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ImageResolver.prototype.setImage = function (image) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.image = image;
                        this.ext = path_1.default.extname(image);
                        this.inputName = path_1.default.basename(image);
                        _b = (_a = this.ffmpeg).FS;
                        _c = ['writeFile', this.inputName];
                        return [4 /*yield*/, ffmpeg_1.fetchFile(this.image)];
                    case 1:
                        _b.apply(_a, _c.concat([_d.sent()]));
                        return [2 /*return*/];
                }
            });
        });
    };
    ImageResolver.prototype.getFFmpeg = function () { return this.ffmpeg; };
    return ImageResolver;
}());
exports.ImageResolver = ImageResolver;
