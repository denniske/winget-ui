export function customVersionSort(data: string[], order: 'asc' | 'desc') {

    const sorted = data.sort((a, b) => {
        var a1 = a.split('.');
        var b1 = b.split('.');
        var len = Math.max(a1.length, b1.length);

        for (var i = 0; i < len; i++) {
            var _a = +a1[i] || 0;
            var _b = +b1[i] || 0;
            if (_a === _b) continue;
            else return _a > _b ? 1 : -1
        }
        return 0;
    });

    if (order === 'desc') {
        return sorted.reverse();
    }
    return sorted;
}
