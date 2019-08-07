export function getImageData(width: number, height: number): ImageData {
    const data = new Uint8ClampedArray(width * height * 4);

    for (let i = 0; i < width * height * 4; i += 4) {
        data[i + 0] = 190; // R value
        data[i + 1] = 0; // G value
        data[i + 2] = i < width * height * 2 ? 210 : 0; // B value
        data[i + 3] = 255; // A value
    }

    return { data, width, height };
}
