export const getHeatColor = (value: number) => {
    const h = value * 240;

    return `hsl(${h}, 100%, 50%)`;
};
