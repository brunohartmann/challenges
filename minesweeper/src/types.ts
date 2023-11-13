export enum Status {
  NEW_GAME = 'new_game',
  PLAYING = 'playing',
  WON = 'won',
  LOST = 'lost'
}

export enum ActionType {
  NEW_GAME = 'new_game',
  REVEAL_CELL = 'reveal_cell',
  FLAG_CELL = 'flag_cell'
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export type Action = {
  type: ActionType;
  payload?: any;
};

export type Cell = {
  value: number | string;
  isVisible: boolean;
  isFlagged: boolean;
};

export type GameState = {
  board: Cell[][];
  status: Status;
  lastClickedCell: {
    row: number | null;
    cell: number | null;
  };
  difficulty: Difficulty;
};
