import fs from "fs";
import PNG from "png-ts";

export const decodeImageFromFile = (
    width: number,
    input: string,
    output: string
) => {
    let b = fs.readFileSync(input);

    const pixels = PNG.load(b).decodePixels();

    const result = {} as { [key: number]: number[] };
    for (let i = 0; i < pixels.length; i += 4) {
        const row = Math.floor(i / 4 / width);
        if (pixels[i] === 0 && pixels[i + 1] === 255 && pixels[i + 2] === 0) {
            if (result[row]) {
                result[row].push((i / 4) % width);
            } else {
                result[row] = [(i / 4) % width];
            }
        }
    }

    fs.writeFileSync(
        output,
        "export const mapBounds: { [key: number]: number[] } = " +
            JSON.stringify(result)
    );
};

export const decodeMapBounds = () =>
    decodeImageFromFile(2160, "./shipmask.png", "./src/utils/mapBounds.ts");
