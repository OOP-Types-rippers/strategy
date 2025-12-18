export class Seed {
    lastSeed: number;

    constructor(seed ?: number) {
        if (!seed) {
            this.lastSeed = this.generate();
        } else {
            this.lastSeed = seed;
        }
    }

    generate(): number {
        const digitsNumber = 12;

        let numberStr: string = '';

        numberStr += Math.floor(Math.random() * 9) + 1;

        for (let i = 0; i < digitsNumber; i++) {
            numberStr += Math.floor(Math.random() * 10);
        }

        this.lastSeed = parseInt(numberStr, 10);
        return parseInt(numberStr, 10);
    }

    getSeed() : number {
        if (this.lastSeed === null) {
            return this.generate();
        }
        return this.lastSeed;
    }

    setSeed(seed: number): void {
        this.lastSeed = seed;
    }
}