import { BaseContext } from "clipanion";

export enum Letter {
  a = "a",
  b = "b",
  c = "c",
  d = "d",
  e = "e",
  f = "f",
  g = "g",
  h = "h",
  i = "i",
  j = "j",
  k = "k",
  l = "l",
  m = "m",
  n = "n",
  o = "o",
  p = "p",
  q = "q",
  r = "r",
  s = "s",
  t = "t",
  u = "u",
  v = "v",
  w = "w",
  x = "x",
  y = "y",
  z = "z",
}

export type LetterState = "Correct" | "Misplaced" | "Used" | "Normal";

export type State = {
  word: string;
  attempts: string[];
  upperStatus: string;
  lowerStatus: string;
  letters: Record<keyof typeof Letter, LetterState>;
};

export type ThemeColor = LetterState | "Wrong" | "Info";

export type Theme = Record<ThemeColor, (s: string) => string>;

export interface Renderer {
  draw: (state: State) => void;
  useTheme: (message: string, themeColor: ThemeColor) => string;
}
export abstract class BaseRenderer implements Renderer {
  protected context: BaseContext;
  protected state: State;
  protected theme: Theme;

  constructor(context: BaseContext, theme: Theme) {
    this.context = context;
    this.theme = theme;
  }

  abstract useTheme(message: string, theme: ThemeColor): string;
  abstract draw(state: State): void;
}
