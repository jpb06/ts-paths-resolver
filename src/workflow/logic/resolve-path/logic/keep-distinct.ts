export const keepDistinct = (self: string[], target: string[]) =>
  self.reduce<string[]>((acc, curr, index) => {
    if (target.length > index && target[index] !== curr) {
      return [...acc, curr];
    }
    if (target.length <= index) {
      return [...acc, curr];
    }

    return acc;
  }, []);
