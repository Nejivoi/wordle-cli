import { Command } from "clipanion";
import words from "./words";
import { BaseRenderer, Letter, LetterState, State } from "./types";
import DefaultRenderer from "./DefaultRenderer";

export class WordleCommand extends Command {
  private state: State;
  private renderer: BaseRenderer;

  async checkInput(input: string) {
    const data = `${input}`.trim().toLowerCase();
    if (data.length === 5) {
      if (words.includes(data)) {
        this.state.attempts.push(data);
        this.checkLetters(data);
        this.state.upperStatus = this.renderer.useTheme(
          "\nLet's play the Wordle game!\n\n",
          "Info"
        );
        if (this.state.word === data) {
          this.state.upperStatus = this.renderer.useTheme(
            `\nYou Won!\n\n`,
            "Correct"
          );
          await this.exit();
        }
        if (this.state.attempts.length >= 6) {
          this.state.upperStatus = this.renderer.useTheme(
            `\nYou lost! Answer was: ${this.state.word}\n\n`,
            "Wrong"
          );
          await this.exit();
        }
      } else {
        this.state.upperStatus = this.renderer.useTheme(
          "\nUnknown word! Please try again.\n\n",
          "Wrong"
        );
      }
    } else {
      this.state.upperStatus = this.renderer.useTheme(
        "\nWord should be 5 letters long! Please try again.\n\n",
        "Wrong"
      );
    }
    this.renderer.draw(this.state);
  }

  checkLetters(input: string) {
    if (input === this.state.word) {
      input.split("").forEach((s) => {
        this.state.letters[s] = "Correct";
      });
    } else {
      input.split("").forEach((s, i) => {
        if (s === this.state.word[i]) {
          this.state.letters[s] = "Correct";
        } else {
          if (this.state.word.includes(s)) {
            this.state.letters[s] = "Misplaced";
          } else {
            this.state.letters[s] = "Used";
          }
        }
      });
    }
  }

  initializeLetters = (): Record<keyof typeof Letter, LetterState> => {
    const result = {} as Record<keyof typeof Letter, LetterState>;
    for (let letter in Letter) {
      result[letter] = "Normal";
    }
    return result;
  };

  async exit() {
    this.state.lowerStatus = "";
    this.context.stdin.destroy();
  }

  async execute() {
    this.renderer = new DefaultRenderer(this.context);
    this.state = {
      word: words[Math.floor(Math.random() * (words.length - 1))],
      attempts: [],
      upperStatus: this.renderer.useTheme(
        "\nLet's play the Wordle game!\n\n",
        "Info"
      ),
      lowerStatus: this.renderer.useTheme("\nType your answer:\n", "Info"),
      letters: this.initializeLetters(),
    };

    this.renderer.draw(this.state);

    this.context.stdin.on("data", this.checkInput.bind(this));
  }
}
