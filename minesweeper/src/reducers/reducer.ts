import { BOMB } from '../constants';
import { Action, ActionType, Cell, Difficulty, GameState, Status } from '../types';

export const initialState: GameState = {
  board: [],
  lastClickedCell: {
    row: null,
    col: null
  },
  status: Status.NEW_GAME,
  difficulty: Difficulty.EASY
};

const difficultyConfig = {
  [Difficulty.EASY]: {
    gridSize: 10,
    mines: 12
  },
  [Difficulty.MEDIUM]: {
    gridSize: 15,
    mines: 40
  },
  [Difficulty.HARD]: {
    gridSize: 15,
    mines: 99
  }
};

function isCellInbounds(row: number, col: number, gridSize: number) {
  return row >= 0 && row < gridSize && col >= 0 && col < gridSize;
}

function revealCell(board: Cell[][], row: number, col: number, gridSize: number) {
  if (isCellInbounds(row, col, gridSize) && !board[row][col].isVisible) {
    board[row][col].isVisible = true;
    board[row][col].isFlagged = false;
    if (board[row][col].value === 0) {
      for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++) {
          revealCell(board, row + rowOffset, col + colOffset, gridSize);
        }
      }
    }
  }
}

function createBoard(difficulty: Difficulty): Cell[][] {
  const { gridSize, mines } = difficultyConfig[difficulty];
  const board: Cell[][] = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => ({ value: 0, isVisible: false, isFlagged: false }))
  );

  for (let i = 0; i < mines; i++) {
    let randomRow = Math.floor(Math.random() * gridSize);
    let randomCol = Math.floor(Math.random() * gridSize);

    while (board[randomRow][randomCol].value === BOMB) {
      randomRow = Math.floor(Math.random() * gridSize);
      randomCol = Math.floor(Math.random() * gridSize);
    }
    board[randomRow][randomCol].value = BOMB;
    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
      for (let colOffset = -1; colOffset <= 1; colOffset++) {
        const row = randomRow + rowOffset;
        const col = randomCol + colOffset;

        if (isCellInbounds(row, col, gridSize) && board[row][col].value !== BOMB) {
          board[row][col].value = (board[row][col].value as number) + 1;
        }
      }
    }
  }
  return board;
}

function reducer(state = initialState, action: Action) {
  if (action.type === ActionType.NEW_GAME) {
    const { difficulty } = action.payload;
    const board = createBoard(difficulty);
    return {
      ...initialState,
      board,
      status: Status.PLAYING,
      difficulty
    };
  } else if (action.type === ActionType.REVEAL_CELL) {
    const board = [...state.board];
    let newStatus = state.status;
    let lastClickedCell = state.lastClickedCell;
    const { row, col } = action.payload;
    const cellValue = board[row][col].value;
    if (cellValue === BOMB) {
      lastClickedCell = {
        row,
        col
      };
      board[row][col].isFlagged = false;
      newStatus = Status.LOST;
    } else {
      const { gridSize, mines } = difficultyConfig[state.difficulty];
      revealCell(board, row, col, gridSize);
      if (board.reduce((res, row) => res + row.filter((col) => col.isVisible).length, 0) === gridSize ** 2 - mines) {
        newStatus = Status.WON;
      }
    }
    return {
      ...state,
      board,
      status: newStatus,
      lastClickedCell
    };
  } else if (action.type === ActionType.FLAG_CELL) {
    const { row, col } = action.payload;
    const board = [...state.board];
    board[row][col].isFlagged = !board[row][col].isFlagged;
    return {
      ...state,
      board
    };
  }

  return state;
}

export default reducer;
