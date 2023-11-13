import { BOMB } from '../constants';
import { Action, ActionType, Cell, Difficulty, GameState, Status } from '../types';

export const initialState: GameState = {
  board: [],
  lastClickedCell: {
    row: null,
    cell: null
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

function isCellInbounds(row: number, cell: number, gridSize: number) {
  return row >= 0 && row < gridSize && cell >= 0 && cell < gridSize;
}

function revealCell(board: Cell[][], row: number, cell: number, gridSize: number) {
  if (isCellInbounds(row, cell, gridSize) && !board[row][cell].isVisible) {
    board[row][cell].isVisible = true;
    board[row][cell].isFlagged = false;
    if (board[row][cell].value === 0) {
      for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let cellOffset = -1; cellOffset <= 1; cellOffset++) {
          revealCell(board, row + rowOffset, cell + cellOffset, gridSize);
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
    let randomCell = Math.floor(Math.random() * gridSize);

    while (board[randomRow][randomCell].value === BOMB) {
      randomRow = Math.floor(Math.random() * gridSize);
      randomCell = Math.floor(Math.random() * gridSize);
    }
    board[randomRow][randomCell].value = BOMB;
    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
      for (let cellOffset = -1; cellOffset <= 1; cellOffset++) {
        const row = randomRow + rowOffset;
        const cell = randomCell + cellOffset;

        if (isCellInbounds(row, cell, gridSize) && board[row][cell].value !== BOMB) {
          board[row][cell].value = (board[row][cell].value as number) + 1;
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
    const { row, cell } = action.payload;
    const cellValue = board[row][cell].value;
    if (cellValue === BOMB) {
      lastClickedCell = {
        row,
        cell
      };
      board[row][cell].isFlagged = false;
      newStatus = Status.LOST;
    } else {
      const { gridSize, mines } = difficultyConfig[state.difficulty];
      revealCell(board, row, cell, gridSize);
      if (board.reduce((res, row) => res + row.filter((cell) => cell.isVisible).length, 0) === gridSize ** 2 - mines) {
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
    const { row, cell } = action.payload;
    const board = [...state.board];
    board[row][cell].isFlagged = !board[row][cell].isFlagged;
    return {
      ...state,
      board
    };
  }

  return state;
}

export default reducer;
