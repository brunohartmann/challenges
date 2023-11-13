import { useReducer } from 'react';
import Confetti from 'react-confetti';

import { MineCell } from './components/mine-cell';
import { DEAD, EASY, HARD, MEDIUM, SMILE, SUNGLASSES } from './constants';
import reducer, { initialState } from './reducers/reducer';
import { ActionType, Difficulty, Status } from './types';

function getCellId(rowIndex: number, cellIndex: number) {
  return `${rowIndex}-${cellIndex}`;
}

const appName = 'Minesweeper';

function App() {
  const [{ board, status, lastClickedCell }, dispatch] = useReducer(reducer, initialState);

  function handleCellClick(row: number, cell: number) {
    dispatch({ type: ActionType.REVEAL_CELL, payload: { row, cell } });
  }

  function handleToggleFlag(row: number, cell: number) {
    dispatch({ type: ActionType.FLAG_CELL, payload: { row, cell } });
  }

  function handleStartClick(difficulty: Difficulty) {
    dispatch({ type: ActionType.NEW_GAME, payload: { difficulty } });
  }

  return (
    <main className="container m-auto grid min-h-screen grid-rows-[auto,1fr,auto] px-4">
      {status === Status.WON && <Confetti />}
      <header className="text-center text-xl font-bold leading-[3rem]">{appName}</header>
      <section className="flex flex-col gap-4 items-center py-8">
        <section className="flex flex-col gap-1 items-center justify-center">
          {status !== Status.PLAYING && (
            <>
              <p className="text-lg">Start game</p>
              <section className="flex gap-1">
                <button
                  className="flex h-8 w-8 justify-center items-center bg-gray-400 hover:bg-gray-300 border-4 border-t-gray-200 border-l-gray-200 border-r-gray-500 border-b-gray-500"
                  onClick={() => handleStartClick(Difficulty.EASY)}
                >
                  {EASY}
                </button>
                <button
                  className="flex h-8 w-8 justify-center items-center bg-gray-400 hover:bg-gray-300 border-4 border-t-gray-200 border-l-gray-200 border-r-gray-500 border-b-gray-500"
                  onClick={() => handleStartClick(Difficulty.MEDIUM)}
                >
                  {MEDIUM}
                </button>
                <button
                  className="flex h-8 w-8 justify-center items-center bg-gray-400 hover:bg-gray-300 border-4 border-t-gray-200 border-l-gray-200 border-r-gray-500 border-b-gray-500"
                  onClick={() => handleStartClick(Difficulty.HARD)}
                >
                  {HARD}
                </button>
              </section>
            </>
          )}
          {status === Status.LOST && <p className="text-2xl text-red-500">You lost!</p>}
          {status === Status.WON && <p className="text-2xl text-green-500">You won!</p>}
          {status !== Status.NEW_GAME && (
            <button
              className="flex h-8 w-8 justify-center items-center bg-gray-400 hover:bg-gray-300 border-4 border-t-gray-200 border-l-gray-200 border-r-gray-500 border-b-gray-500"
              onClick={() => window.location.reload()}
            >
              {status === Status.LOST ? DEAD : status === Status.WON ? SUNGLASSES : SMILE}
            </button>
          )}
        </section>
        {status !== Status.NEW_GAME && (
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
        )}
      </section>
      <footer className="text-center leading-[3rem] opacity-70">
        © {new Date().getFullYear()} {appName}
      </footer>
    </main>
  );
}

export default App;
