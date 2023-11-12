import { GRID_SIZE, MINES, BOMB } from '../constants';
import { Action, ActionType, Cell, GameState, Status } from '../types';

export const initialState: GameState = {
  board: [],
  lastClickedCell: {
    row: null,
    cell: null
  },
  status: Status.PLAYING
};

function isCellInbounds(row: number, cell: number) {
  return row >= 0 && row < GRID_SIZE && cell >= 0 && cell < GRID_SIZE;
}

function revealCell(board: Cell[][], row: number, cell: number) {
  if (isCellInbounds(row, cell) && !board[row][cell].isVisible) {
    board[row][cell].isVisible = true;
    board[row][cell].isFlagged = false;
    if (board[row][cell].value === 0) {
      for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let cellOffset = -1; cellOffset <= 1; cellOffset++) {
          revealCell(board, row + rowOffset, cell + cellOffset);
        }
      }
    }
  }
}

function reducer(state = initialState, action: Action) {
  if (action.type === ActionType.REVEAL_CELL) {
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
      revealCell(board, row, cell);
      if (board.reduce((res, row) => res + row.filter((cell) => cell.isVisible).length, 0) === GRID_SIZE ** 2 - MINES) {
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
