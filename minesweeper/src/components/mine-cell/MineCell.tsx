import { BOMB, FLAG } from '../../constants';
import { Cell, Status } from '../../types';

type MineCellProps = {
  status: Status;
  onRevealCell: (row: number, cell: number) => void;
  onToggleFlag: (row: number, cell: number) => void;
  cellSettings: {
    row: number;
    cell: number;
    isLastClickedCell: boolean;
    isFlagged: boolean;
    isVisible: boolean;
    value: string | number;
  };
};

function getCellValue(status: Status, cell: Partial<Cell>) {
  if ((status === Status.WON && cell.value === BOMB) || cell.isFlagged) {
    return FLAG;
  }

  return cell.value !== 0 ? cell.value : '';
}

const color = {
  1: 'text-blue-800',
  2: 'text-green-800',
  3: 'text-red-700',
  4: 'text-blue-950',
  5: 'text-orange-950',
  6: 'text-cyan-700',
  7: 'text-black',
  8: 'text-gray-700'
};

function getValueColor(value: string | number) {
  return color[value as keyof typeof color] || '';
}

function MineCell({ status, onRevealCell, onToggleFlag, cellSettings }: MineCellProps) {
  const { row, cell, isFlagged, isVisible, isLastClickedCell, value } = cellSettings;
  if (status !== Status.PLAYING || isVisible) {
    return (
      <div
        className={`flex h-8 w-8 justify-center font-bold text-xl items-center border border-gray-600 ${
          isLastClickedCell ? 'bg-red-600' : 'bg-gray-400'
        } ${getValueColor(value)}`}
      >
        {getCellValue(status, { value, isFlagged })}
      </div>
    );
  }
  return (
    <button
      className="flex h-8 w-8 justify-center items-center bg-gray-400 hover:bg-gray-300 border-4 border-t-gray-200 border-l-gray-200 border-r-gray-500 border-b-gray-500"
      onContextMenu={(e) => {
        e.preventDefault();
        onToggleFlag(row, cell);
      }}
      onClick={() => {
        status === Status.PLAYING && onRevealCell(row, cell);
      }}
    >
      {isFlagged ? FLAG : ''}
    </button>
  );
}

export default MineCell;
