
function clear(str: string) {
    return str.replace(/[?!]/g, "");
}

export function nameof(arg: () => any) {
    const str = clear(arg.toString());
    return str.substring(str.lastIndexOf('.') + 1);
}

export namespace nameof {
    export function full(arg: () => any) {
        const str = clear(arg.toString());
        return str.substring(str.indexOf('.') + 1);
    }
}