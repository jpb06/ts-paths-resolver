export const keepDistinct = (self, target) => self.reduce((acc, curr, index) => {
    if (target.length > index && target[index] !== curr) {
        return [...acc, curr];
    }
    if (target.length <= index) {
        return [...acc, curr];
    }
    return acc;
}, []);
//# sourceMappingURL=keep-distinct.js.map