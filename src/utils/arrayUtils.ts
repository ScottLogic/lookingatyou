export function areElementsNotUndefined(
    array: Array<HTMLVideoElement | undefined>,
) {
    return array.every(element => element !== undefined);
}

export function areNotEqual(
    array1: Array<HTMLVideoElement | undefined>,
    array2: Array<HTMLVideoElement | undefined>,
) {
    return !(
        array1.length === array2.length &&
        array1.every(
            (element: HTMLVideoElement | undefined, index: number) =>
                element === array2[index],
        )
    );
}
