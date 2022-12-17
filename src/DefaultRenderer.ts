import ansiColors from "ansi-colors";
import { BaseContext } from "clipanion";
import { BaseRenderer, State, ThemeColor } from "./types";

const EMPTY_LINE = "[ ][ ][ ][ ][ ]\n";
const QWERTY_ALPHABET = "qwertyuiop\nasdfghjkl\nzxcvbnm".split("");

class DefaultRenderer extends BaseRenderer {
  constructor(context: BaseContext) {
    let theme = {
      Correct: ansiColors.green,
      Wrong: ansiColors.red,
      Misplaced: ansiColors.yellow,
      Used: ansiColors.gray,
      Normal: (s) => s,
      Info: ansiColors.blue,
    };
    super(context, theme);
  }

  useTheme(message: string, themeColor: ThemeColor): string {
    return this.theme[themeColor](message);
  }

  draw(state: State) {
    this.state = state;

    console.clear();
    this.context.stdout.write(this.state.upperStatus);

    this.drawAttempts();
    this.drawSeparator();
    this.drawAlphabet();
    this.drawSeparator();

    this.context.stdout.write(this.state.lowerStatus);
  }

  private drawSeparator() {
    this.context.stdout.write("\n\n");
  }

  private drawLetter(letter: string, color: ThemeColor) {
    return this.theme[color]("[" + letter.toUpperCase() + "]");
  }

  private drawAlphabet() {
    QWERTY_ALPHABET.forEach((l) => {
      if (l === "\n") {
        this.context.stdout.write("\n");
      } else {
        this.context.stdout.write(this.drawLetter(l, this.state.letters[l]));
      }
    });
  }

  private drawAttemptLine(attempt: string) {
    let result = "";
    if (attempt === this.state.word) {
      attempt.split("").forEach((s) => {
        result += this.drawLetter(s, "Correct");
      });
    } else {
      attempt.split("").forEach((s, i) => {
        if (s === this.state.word[i]) {
          result += this.drawLetter(s, "Correct");
        } else {
          if (this.state.word.includes(s)) {
            result += this.drawLetter(s, "Misplaced");
          } else {
            result += this.drawLetter(s, "Used");
          }
        }
      });
    }
    return result + "\n";
  }

  private drawAttempts() {
    let count = 0;
    this.state.attempts.forEach((a) => {
      this.context.stdout.write(this.drawAttemptLine(a));
      count++;
    });
    while (count < 6) {
      this.context.stdout.write(EMPTY_LINE);
      count++;
    }
  }
}

export default DefaultRenderer;
