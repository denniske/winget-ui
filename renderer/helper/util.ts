
export function toCamelCase(key, value) {
    if (value && typeof value === 'object'){
        for (var k in value) {
            if (/^[A-Z]/.test(k) && Object.hasOwnProperty.call(value, k)) {
                value[k.charAt(0).toLowerCase() + k.substring(1)] = value[k];
                delete value[k];
            }
        }
    }
    return value;
}

export function fixPackageIcon(url: string) {
    if (!url) return;
    const httpIndex = url.indexOf('//');
    const index = url.indexOf('///');
    if (index >= 0) {
        // console.log('fixPackageIcon', url);
        return url.substr(0, httpIndex+2) + url.substr(index+3);
    }
    return url;
}
