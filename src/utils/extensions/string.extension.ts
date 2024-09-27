export { };

declare global {
    interface String {
        urlFileExtension(): string;
    }
}

String.prototype.urlFileExtension = function() {
    const url = this as string;
    if (url != undefined && url != null) {
        return url!.split(/[#?]/)[0].split('.').pop()!.trim();
    } else {
        return url;
    }
};