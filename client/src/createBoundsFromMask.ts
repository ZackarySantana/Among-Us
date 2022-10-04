import fs from "fs";
import PNG from "png-ts";

export const decodeImageFromFile = (
    input: string,
    output: string
) => {
    let b = fs.readFileSync(input);

    const png = PNG.load(b);
    const pixels = png.decodePixels();
    const width = png.width;

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

const mapdir = "./src/maps";

export const decodeMapBounds = () => {
    
    const fileNames = fs.readdirSync(mapdir);

    const fileProcesses: Promise<void>[] = [];
    for (const fileName of fileNames) {
        if (!fileName.endsWith(".mask.png")) {
            continue;
        }

        const filePath = `${mapdir}/${fileName}`;
        fileProcesses.push(new Promise(() => {
            decodeImageFromFile(filePath, `${mapdir}/${fileName.replace(".mask.png", "")}.ts`);
        }));
    }

    Promise.all(fileProcesses).then(() => console.log("Completed reading files!"));

    // decodeImageFromFile(
    //     2160,
    //     ".src/assets/shipmask.png",
    //     "./src/utils/mapBounds.ts"
    // );
}


decodeMapBounds();