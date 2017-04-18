import * as $ from 'jquery';
import GameSession from './GameSession';
import {latinAlphabet} from './GameSession';

interface LetterElementMap {
    [prop: string]: JQuery;
}

export default class App {
    currentGame: GameSession;
    countdown: number = 0;

    interval: any;
    intervalLap: boolean = false;

    primaryButton: JQuery = $('#nextTurnButton');
    secondaryButton: JQuery = $('#restartButton');
    currentLetter: JQuery = $('#currentLetter');
    alphabetDisplay: JQuery = $('#alphabetDisplay');
    pageTitle: JQuery = $('#pageTitle');

    letterElements: LetterElementMap = {};

    constructor() {
        this.bindEvents();
        this.initAlphabetElements();
        this.interval = setInterval(() => this.tickCountdown(), 1000);
        this.render();
    }

    // Init event handlers on buttons, etc
    bindEvents() {
        this.primaryButton.click(e => this.onPrimaryClick(e));
        this.secondaryButton.click(e => this.onSecondaryClick(e));
        $('.body').click(e => this.onPrimaryClick(e));
        $('body').on('touchmove', e => e.preventDefault());
    }

    initAlphabetElements() {
        for (let i = 0; i < latinAlphabet.length; ++i) {
            let letter = latinAlphabet[i];
            let element = $(`#letter${letter}`);
            this.letterElements[letter] = element;
        }
    }

    // Render UI based on state
    render() {
        // No game started
        if (!this.currentGame) {
            this.pageTitle.text('ABC 5 Dasar');

            this.primaryButton.text('Start');
            this.primaryButton.removeClass('disabled');
            this.primaryButton.parent().slideDown();

            this.secondaryButton.removeClass('btn-lg');
            this.secondaryButton.parent().slideUp();

            this.currentLetter.text('');

            this.alphabetDisplay.parent().slideUp();
        }

        else {
            // Show current letter (or countdown) if not yet finished
            if (!this.currentGame.isFinished()) {
                this.alphabetDisplay.parent().slideDown();
                this.pageTitle.text(`Round ${this.currentGame.getHumanFriendlyTurnNumber()}`);

                // Display the countdown or current letter
                if (this.countdown) {
                    this.primaryButton.addClass('disabled');
                    this.currentLetter.addClass('countdown');

                    if (this.intervalLap) {
                        this.currentLetter.text('');
                    }
                    else {
                        this.currentLetter.text(this.countdown);
                    }

                    // Show previous letters excluding current one
                    this.renderAlphabet();
                }
                else {
                    this.primaryButton.removeClass('disabled');
                    this.currentLetter.text(this.currentGame.getCurrentLetter());
                    this.currentLetter.removeClass('countdown');

                    // Show previous letters + current one
                    this.renderAlphabet(true);
                }
            }
            
            // Show next letter button if not the last turn, else only restart button
            if (!this.currentGame.isLastTurn() || this.countdown) {
                this.primaryButton.parent().slideDown();
                this.primaryButton.text('Next letter');

                this.secondaryButton.parent().slideDown();
                this.secondaryButton.removeClass('btn-lg');
            }
            else {
                this.primaryButton.parent().slideUp();
                this.secondaryButton.parent().show();
                this.secondaryButton.addClass('btn-lg');
            }
        }
    }

    renderAlphabet(includeCurrentLetter: boolean = false): void {
        console.log(this.letterElements);
        let usedLetters: any = {};
        this.currentGame.getPreviousLetters().forEach(letter => {
            usedLetters[letter] = true;
        });

        for (let i = 0; i < latinAlphabet.length; ++i) {
            let letter = latinAlphabet[i];
            if (usedLetters[letter]) {
                this.letterElements[letter].removeClass('current').addClass('used');
            }
            else if (includeCurrentLetter && this.currentGame.getCurrentLetter() === letter) {
                this.letterElements[letter].addClass('current').removeClass('used');
            }
            else {
                this.letterElements[letter].removeClass('used current');
            }
        }
    }

    // When the green button is tapped
    async onPrimaryClick(e: JQueryEventObject): Promise<void> {
        e.preventDefault();
        $(e.target).blur();

        // No game started
        if (!this.currentGame) {
            this.currentGame = new GameSession();
            await this.startCountdown(3);
        }
        else if (!this.currentGame.isFinished()) {
            if (!this.countdown) {
                this.currentGame.nextTurn();
                this.startCountdown(3);
            }
        }
        else {
            this.currentGame = new GameSession();
        }

        this.render();
    }

    // When the red button is tapped
    async onSecondaryClick(e: JQueryEventObject): Promise<void> {
        e.preventDefault();
        $(e.target).blur();

        this.currentGame = undefined;
        this.countdown = 0;
        this.render();
    }

    startCountdown(startNumber: number): void {
        if (this.countdown) {
            return;
        }

        this.countdown = startNumber;
        this.intervalLap = true;
        this.render();
    }

    tickCountdown(): void {
        if (this.intervalLap) {
            this.intervalLap = false;
            this.render();
            return;
        }

        if (this.countdown > 0) {
            --this.countdown;
            this.render();
        }
    }
}