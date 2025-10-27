export const getRandomPrice = () => {
    const price = Math.random() * (2000 - 1500) + 1500;
    return Math.round(price * 100) / 100;
};
