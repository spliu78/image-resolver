import path from "path";
import { cwd } from "process";
import { ImageResolver } from "../src/ImageResolver";

(async () => {
    const ir = new ImageResolver();
    await ir.init();
    await ir.setImage(path.join(cwd(), './example/from.jpg'));
    console.log(await ir.getSize());    // { height: 2736, width: 3648, type: 'jpg' }
    await ir.minify(-1, -1, 'png');
    await ir.watermark('xiagao', 24, path.join(cwd(), './font/arial.ttf'));
    await ir.output(path.join(cwd(), './example/to.png'));
    await ir.setImage(path.join(cwd(), './example/to.png'));
    console.log(await ir.getSize());
})();