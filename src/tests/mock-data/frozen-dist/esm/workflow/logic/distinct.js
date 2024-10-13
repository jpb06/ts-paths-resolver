export const distinct = (array) => array
    .filter((v) => v !== undefined)
    .reduce((acc, curr) => {
    if (acc.includes(curr)) {
        return acc;
    }
    return [...acc, curr];
}, []);
//# sourceMappingURL=distinct.js.map