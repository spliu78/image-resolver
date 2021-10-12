import fs from 'fs';
import path from 'path';
import { createFFmpeg, fetchFile, FFmpeg } from '@ffmpeg/ffmpeg';
import _sizeOf from 'image-size';
import { promisify } from 'util';
const sizeOf = promisify(_sizeOf);

export class ImageResolver {
    ffmpeg: FFmpeg;
    image = '';
    inputName = 'input';
    outputName = '';
    ext = '';
    constructor(image?: string, log = false) {
        this.ffmpeg = createFFmpeg({
            log,
        });
        image && this.setImage(image);
    }
    async init() {
        await this.ffmpeg.load();
    }
    async getSize() {
        return await sizeOf(this.image);
    }
    async minify(width: number = -1, height: number = -1, ext: string) {
        if (ext) this.ext = ext[0] === '.' ? ext : `.${ext}`;
        const scalConf = `scale=${width}:${height}`;
        // xxx.minify.ext
        this.outputName = `${path.basename(this.inputName, this.ext)}.minify${this.ext}`;
        await this.ffmpeg.run('-i', this.inputName, '-vf', scalConf, this.outputName);
        this.inputName = this.outputName;
    }
    async watermark(
        text: string, fontsize: number, fontfile: string,
        option?: {
            x?: number, y?: number, fontcolor?: string, border?: number, bordercolor?: string
        }
    ) {
        const fontFileName = path.basename(fontfile);
        this.ffmpeg.FS('writeFile', fontFileName, await fetchFile(fontfile));

        const defaultOption = { x: 10, y: 10, fontcolor: 'white', border: 5, bordercolor: '#A9A9A9' };
        const { x, y, fontcolor, border, bordercolor } = { ...defaultOption, ...option };
        const watermarkConf = `drawtext=text=\'${text}\':borderw=${border}:bordercolor=${bordercolor}`
            + `:x=${x}:y=H-th-${y}:fontfile=${fontFileName}:fontsize=${fontsize}:fontcolor=${fontcolor}`;
        // xxx.watermark.ext
        this.outputName = `${path.basename(this.inputName, this.ext)}.watermark${this.ext}`;
        await this.ffmpeg.run('-i', this.inputName, '-vf', watermarkConf, this.outputName);
        this.inputName = this.outputName;
    }
    async output(outputPath: string) {
        if (path.extname(outputPath) === this.ext) {
            await fs.promises.writeFile(outputPath, this.ffmpeg.FS('readFile', this.outputName));
        } else {
            await fs.promises.writeFile(`${outputPath}${this.ext}`, this.ffmpeg.FS('readFile', this.outputName));
        }
    }
    async setImage(image: string) {
        this.image = image;
        this.ext = path.extname(image);
        this.inputName = path.basename(image);
        this.ffmpeg.FS('writeFile', this.inputName, await fetchFile(this.image));
    }
    getFFmpeg() { return this.ffmpeg; }
}


