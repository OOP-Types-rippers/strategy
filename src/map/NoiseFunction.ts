export class NoiseFunction {
    private readonly seed: number;

    constructor(seed: number) {
        this.seed = seed;
    }

    noise2D(x: number, y: number) : number {
        let n = x * 374761393 + y * 668265263 ^ this.seed;
        n = (n ^ (n >> 13)) * 1274126177;
        n = n ^ (n >> 16);

        return (n % 1000) / 500 - 1;
    }
}