export function customVersionSort(data, order) {

    function isNumber(v) {
        return (+v).toString() === v;
    }

    var sort = {
        asc: function (a, b) {
            var i = 0,
                l = Math.min(a.value.length, b.value.length);

            while (i < l && a.value[i] === b.value[i]) {
                i++;
            }
            if (i === l) {
                return a.value.length - b.value.length;
            }
            if (isNumber(a.value[i]) && isNumber(b.value[i])) {
                return a.value[i] - b.value[i];
            }
            return a.value[i].localeCompare(b.value[i]);
        },
        desc: function (a, b) {
            return sort.asc(b, a);
        }
    }
    var mapped = data.map(function (el, i) {
        return {
            index: i,
            value: el.split('')
        };
    });

    mapped.sort(sort[order] || sort.asc);
    return mapped.map(function (el) {
        return data[el.index];
    });
}
