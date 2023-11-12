export enum Status {
  PLAYING = 'playing',
  WON = 'won',
  LOST = 'lost'
}

export enum ActionType {
  REVEAL_CELL = 'reveal_cell',
  FLAG_CELL = 'flag_cell',
  NEW_GAME = 'new_game'
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
};
