export function guid(zero?: 0): string {
    if (zero === 0) {
        return '00000000-0000-0000-0000-000000000000';
    }

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
