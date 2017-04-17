import * as $ from 'jquery';
import GameSession from './GameSession';

export default class App {
    currentGame: GameSession;
    countdown: number = 0;

    interval: any;
    intervalLap: boolean = false;

    primaryButton: JQuery = $('#nextTurnButton');
    secondaryButton: JQuery = $('#restartButton');
    currentLetter: JQuery = $('#currentLetter');

    constructor() {
        this.bindEvents();
        this.interval = setInterval(() => this.tickCountdown(), 1000);
        this.render();
    }

    // Init event handlers on buttons, etc
    bindEvents() {
        this.primaryButton.click(e => this.onPrimaryClick(e));
        this.secondaryButton.click(e => this.onSecondaryClick(e));
        $('.body').click(e => this.onPrimaryClick(e));
    }

    // Render UI based on state
    render() {
        // No game started
        if (!this.currentGame) {
            this.primaryButton.text('Start');
            this.primaryButton.removeClass('disabled');
            this.primaryButton.parent().slideDown();

            this.secondaryButton.removeClass('btn-lg');
            this.secondaryButton.parent().slideUp();

            this.currentLetter.text('');
        }

        else {
            // Show current letter (or countdown) if not yet finished
            if (!this.currentGame.isFinished()) {
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
                }
                else {
                    this.primaryButton.removeClass('disabled');
                    this.currentLetter.text(this.currentGame.getCurrentLetter());
                    this.currentLetter.removeClass('countdown');
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
        console.log('Tick ' + Math.floor(Date.now() / 1000));

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