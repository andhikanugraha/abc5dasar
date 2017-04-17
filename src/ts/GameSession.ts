const latinAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Data model for a game session
export default class GameSession {
    private shuffledLetters: string;
    private turnNumber: number = 0; // starts from 0

    constructor() {
        this.shuffledLetters = this.generateShuffledAlphabet();
    }

    nextTurn(): void {
        ++this.turnNumber;
    }

    isFinished(): boolean {
        return this.turnNumber >= this.shuffledLetters.length;
    }

    isLastTurn(): boolean {
        return this.turnNumber === this.shuffledLetters.length - 1;
    }

    getCurrentLetter(): string {
        if (this.turnNumber < this.shuffledLetters.length) {
            return this.shuffledLetters[this.turnNumber];
        }
        else { // we've ran out of letters
            return undefined;
        }
    }

    private generateShuffledAlphabet(): string {
        const arr: string[] = [];

        // Convert latinAlphabet into array of chars
        for (let j = 0; j < latinAlphabet.length; ++j) {
            arr.push(latinAlphabet[j]);
        }

        // Shuffle the array of chars
        for (let i = arr.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
        }

        let shuffledAlphabet = arr.join('');

        return shuffledAlphabet;
    }
}