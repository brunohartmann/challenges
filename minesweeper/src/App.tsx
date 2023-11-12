import { useState } from 'react';
import Confetti from 'react-confetti';

const GRID_SIZE = 10;
const MINES = 12;
const BOMB = '💣';
const FLAG = '🚩';
const SUNGLASSES = '😎';
const DEAD = '😵';
const SMILE = '🙂';

type Cell = {
  value: number | string;
  isVisible: boolean;
  isFlagged: boolean;
};

enum Status {
  PLAYING = 'playing',
  WON = 'won',
  LOST = 'lost'
}

const BOARD: Cell[][] = Array.from({ length: GRID_SIZE }, () =>
  Array.from({ length: GRID_SIZE }, () => ({ value: 0, isVisible: false, isFlagged: false }))
);

function getCellId(rowIndex: number, cellIndex: number) {
  return `${rowIndex}-${cellIndex}`;
}

function isCellInbounds(row: number, cell: number) {
  return row >= 0 && row < GRID_SIZE && cell >= 0 && cell < GRID_SIZE;
}

function getCellValue(status: Status, cell: Cell) {
  if ((status === Status.WON && cell.value === BOMB) || cell.isFlagged) {
    return FLAG;
  }

  return cell.value !== 0 ? cell.value : '';
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

function App() {
  const appName = 'Minesweeper';
  const [status, setStatus] = useState<Status>(Status.PLAYING);
  const [board, setBoard] = useState<Cell[][]>(BOARD);
  const [lastClickedCell, setLastClickedCell] = useState<string>('');

  function handleCellClick(clickedRow: number, clickedCell: number) {
    let clonedBoard = [...board];
    const cellId = getCellId(clickedRow, clickedCell);
    const cellValue = board[clickedRow][clickedCell].value;

    if (cellValue === BOMB) {
      setBoard(clonedBoard);
      setLastClickedCell(cellId);
      setStatus(Status.LOST);
    } else {
      revealCell(clonedBoard, clickedRow, clickedCell);
      setBoard(clonedBoard);
      if (
        clonedBoard.reduce((res, row) => res + row.filter((cell) => cell.isVisible).length, 0) ===
        GRID_SIZE ** 2 - MINES
      ) {
        setStatus(Status.WON);
      }
    }
  }

  function handleToggleFlag(clickedRow: number, clickedCell: number) {
    const clonedBoard = [...board];
    clonedBoard[clickedRow][clickedCell].isFlagged = true;
    setBoard(clonedBoard);
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
            className="flex h-8 w-8 justify-center items-center bg-slate-700 hover:bg-slate-800 border border-slate-200 rounded-sm"
            onClick={() => window.location.reload()}
          >
            {status === Status.LOST ? DEAD : status === Status.WON ? SUNGLASSES : SMILE}
          </button>
        </section>
        <section className="flex flex-col items-center">
          {board.map((row, rowIndex) => (
            <article key={rowIndex} className="flex">
              {row.map((cell, cellIndex) => {
                const cellId = getCellId(rowIndex, cellIndex);
                if (status !== Status.PLAYING || cell.isVisible) {
                  return (
                    <div
                      key={cellId}
                      className={`flex h-8 w-8 justify-center items-center border ${
                        cellId === lastClickedCell ? 'bg-red-600' : ''
                      }`}
                    >
                      {getCellValue(status, cell)}
                    </div>
                  );
                }
                return (
                  <button
                    key={cellId}
                    className={`flex bg-slate-${
                      cell.isFlagged ? '800' : '700'
                    } hover:bg-slate-800 h-8 w-8 justify-center items-center border`}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      handleToggleFlag(rowIndex, cellIndex);
                    }}
                    onClick={() => {
                      status === Status.PLAYING && handleCellClick(rowIndex, cellIndex);
                    }}
                  >
                    {cell.isFlagged ? FLAG : ''}
                  </button>
                );
              })}
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
