import { useReducer } from 'react';
import Confetti from 'react-confetti';

import { MineCell } from './components/mine-cell';
import { BOMB, DEAD, GRID_SIZE, MINES, SMILE, SUNGLASSES } from './constants';
import reducer, { initialState } from './reducers/reducer';
import { ActionType, Cell, Status } from './types';

const BOARD: Cell[][] = Array.from({ length: GRID_SIZE }, () =>
  Array.from({ length: GRID_SIZE }, () => ({ value: 0, isVisible: false, isFlagged: false }))
);

function getCellId(rowIndex: number, cellIndex: number) {
  return `${rowIndex}-${cellIndex}`;
}

function isCellInbounds(row: number, cell: number) {
  return row >= 0 && row < GRID_SIZE && cell >= 0 && cell < GRID_SIZE;
}

for (let i = 0; i < MINES; i++) {
  let randomRow = Math.floor(Math.random() * GRID_SIZE);
  let randomCell = Math.floor(Math.random() * GRID_SIZE);

  while (BOARD[randomRow][randomCell].value === BOMB) {
    randomRow = Math.floor(Math.random() * GRID_SIZE);
    randomCell = Math.floor(Math.random() * GRID_SIZE);
  }
  BOARD[randomRow][randomCell].value = BOMB;
  for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
    for (let cellOffset = -1; cellOffset <= 1; cellOffset++) {
      const row = randomRow + rowOffset;
      const cell = randomCell + cellOffset;

      if (isCellInbounds(row, cell) && BOARD[row][cell].value !== BOMB) {
        BOARD[row][cell].value = (BOARD[row][cell].value as number) + 1;
      }
    }
  }
}

const appName = 'Minesweeper';

function App() {
  const [{ board, status, lastClickedCell }, dispatch] = useReducer(reducer, { ...initialState, board: BOARD });

  function handleCellClick(row: number, cell: number) {
    dispatch({ type: ActionType.REVEAL_CELL, payload: { row, cell } });
  }

  function handleToggleFlag(row: number, cell: number) {
    dispatch({ type: ActionType.FLAG_CELL, payload: { row, cell } });
  }

  return (
    <main className="container m-auto grid min-h-screen grid-rows-[auto,1fr,auto] px-4">
      {status === Status.WON && <Confetti />}
      <header className="text-center text-xl font-bold leading-[3rem]">{appName}</header>
      <section className="flex flex-col gap-4 items-center py-8">
        <section className="flex flex-col gap-1 items-center justify-center">
          {status === Status.LOST && <p className="text-2xl text-red-500">You lost!</p>}
          {status === Status.WON && <p className="text-2xl text-green-500">You won!</p>}
          <button
            className="flex h-8 w-8 justify-center items-center bg-gray-400 hover:bg-gray-300 border-4 border-t-gray-200 border-l-gray-200 border-r-gray-500 border-b-gray-500"
            onClick={() => window.location.reload()}
          >
            {status === Status.LOST ? DEAD : status === Status.WON ? SUNGLASSES : SMILE}
          </button>
        </section>
        <section className="flex flex-col items-center">
          {board.map((row, rowIndex) => (
            <article key={rowIndex} className="flex">
              {row.map((cell, cellIndex) => (
                <MineCell
                  key={getCellId(rowIndex, cellIndex)}
                  status={status}
                  onRevealCell={handleCellClick}
                  onToggleFlag={handleToggleFlag}
                  cellSettings={{
                    row: rowIndex,
                    cell: cellIndex,
                    isLastClickedCell: lastClickedCell.row === rowIndex && lastClickedCell.cell === cellIndex,
                    ...cell
                  }}
                />
              ))}
            </article>
          ))}
        </section>
      </section>
      <footer className="text-center leading-[3rem] opacity-70">
        © {new Date().getFullYear()} {appName}
      </footer>
    </main>
  );
}

export default App;
