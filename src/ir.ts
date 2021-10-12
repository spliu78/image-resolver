#!/usr/bin/env node --experimental-wasm-threads --experimental-wasm-bulk-memory
import { ImageResolver } from "./ImageResolver";
import { program } from "commander";
import { cwd } from "process";
import path from "path";

// convert: ir a.jpg --convert png 
// minify: ir a.jpg --minify [x/x,y/xx%]
// watermark: ir a.jpg --watermark {text,[fontsize,fontfile,x,y,fontcolor,border,bordercolor]}

const watermarkFormatHint = `{text: string, fontsize: number, fontfile: string, option ?: { x?: number, y?: number, fontcolor?: string, border?: number, bordercolor?: string}}`

program
    .argument('<image>', 'image path')
    .option('-o, --output <outputPath>', 'output path')
    .option('-s, --getsize ', 'get image size')
    .option('-c, --convert <extensionType>', 'convert extension')
    .option('-m, --minify <option>', 'minify images base on it\'s size, [ w / w,h / per% ]')
    .option('-w, --watermark [options...]', `add text watermark to image, $1: text, $2: fontSize (24 as default)`)
    .option('--wm-conf <options>', `set watermark conf using JSON format: '${watermarkFormatHint}'`)
    .option('--debug', 'debugger mode, set ffmpeg\'s log option to true')
    .addHelpText('after', `

Example :
# get size:
$ ir example/from.jpg -s

# convert extension:
$ ir example/from.jpg -c webp

# convert extension & minify & watermark
$ ir example/from.jpg -o example -c webp -m 10% -w watermark --debug

# watermark with json config
$ ir example/from.jpg -o example/ --wm-conf '{"text":"xiagao","fontsize":48,"fontfile":"./font/arial.ttf"}' --debug
  `)
    .action(async (image: string) => {
        const options: { output: string, convert: string, minify: string, watermark: string[], wmConf: string, debug: boolean, getsize: boolean } = program.opts();
        const { output = '.', convert = path.extname(image), minify, watermark, wmConf, debug = false, getsize } = options;
        debug && console.log(options);
        const inputName = path.resolve(path.join(cwd(), image));
        const outputName = path.resolve(path.join(cwd(), output, `${path.basename(image, path.extname(image))}.ir${convert[0] === '.' ? convert : '.' + convert}`))
        const ir = new ImageResolver('', debug);
        await ir.init();
        await ir.setImage(inputName);
        if (getsize) {
            console.log(await ir.getSize());
            return;
        }
        let resize: [number, number] = [-1, -1];
        if (minify) {
            if (minify.includes(',')) {
                resize = [Number(minify.split(',')[0]) || -1, Number(minify.split(',')[1]) || -1];
            }
            else if (minify.includes('%')) {
                const size = await ir.getSize();
                const ratio = Number(minify.split('%')[0]) / 100 || 1;
                if (size?.width && ratio !== 1) resize = [size.width * ratio, -1];
            }
            else {
                resize = [Number(minify) || -1, -1];
            }
        }
        if (minify || options.convert) {
            await ir.minify(...resize, convert || path.extname(image));
        }
        if (watermark?.length) {
            //     await ir.watermark('xiagao', 24, path.join(__dirname, '../src/assets/arial.ttf'));
            await ir.watermark(watermark[0], Number(watermark[1]) || 24, path.join(__dirname, '../../font/arial.ttf'));
        } else if (wmConf) {
            const { text, fontsize, fontfile, option } = JSON.parse(wmConf);
            console.log(JSON.parse(wmConf));
            await ir.watermark(text, fontsize, fontfile, option);
        }
        await ir.output(outputName);
    });
program.parse(process.argv);