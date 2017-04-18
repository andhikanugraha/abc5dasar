export const latinAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Data model for a game session
export default class GameSession {
    private shuffledLetters: string;
    private turnNumber: number = 0; // starts from 0

    constructor() {
        this.shuffledLetters = this.generateShuffledAlphabet();
    }

    getHumanFriendlyTurnNumber(): number {
        if (this.turnNumber < this.shuffledLetters.length) {
            return this.turnNumber + 1;
        }
        
        return 0;
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

    getPreviousLetters(): string[] {
        const previousLetters: string[] = [];

        for (let i = 0; (i < this.turnNumber) && (i < this.shuffledLetters.length); ++i) {
            previousLetters.push(this.shuffledLetters[i]);
        }

        return previousLetters;
    }

    getUpcomingLetters(): string[] {
        const upcomingLetters: string[] = [];

        for (let i = this.turnNumber; i < this.shuffledLetters.length - 1; ++i) {
            upcomingLetters.push(this.shuffledLetters[i]);
        }

        return upcomingLetters;
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