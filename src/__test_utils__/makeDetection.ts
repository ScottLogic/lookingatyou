export function makeDetection(x: number, y: number) {
    return { bbox: [x, y, 0, 0], info: { keypoints: [] } };
}
