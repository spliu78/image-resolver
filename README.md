# image-resolver
minify &amp; watermark with ffmpeg.wasm

```
Usage: ir [options] <image>

Arguments:
  image                          image path

Options:
  -o, --output <outputPath>      output path
  -s, --getsize                  get image size
  -c, --convert <extensionType>  convert extension
  -m, --minify <option>          minify images base on it's size, [ w / w,h / per% ]
  -w, --watermark [options...]   add text watermark to image, $1: text, $2: fontSize (24 as default)
  --wm-conf <options>            set watermark conf using JSON format: '{text: string, fontsize: number, fontfile: string, option ?: { x?: number, y?: number, fontcolor?: string, border?: number, bordercolor?: string}}'
  --debug                        debugger mode, set ffmpeg's log option to true
  -h, --help                     display help for command


Example :
# get size:
$ ir example/from.jpg -s

# convert extension:
$ ir example/from.jpg -c webp

# convert extension & minify & watermark
$ ir example/from.jpg -o example -c webp -m 10% -w watermark --debug

# watermark with json config
$ ir example/from.jpg -o example/ --wm-conf '{"text":"xiagao","fontsize":48,"fontfile":"./font/arial.ttf"}' --debug

```