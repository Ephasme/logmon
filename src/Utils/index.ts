export function filterEmptyString(arr: string[]): string[] {
    if (arr == null) {
        return [];
    }
    return arr.filter((x) => x !== null && x.length > 0);
}
