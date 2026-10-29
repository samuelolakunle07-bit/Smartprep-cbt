import React, { useState } from 'react';
import { Calculator as CalcIcon, X, Delete } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const CbtCalculator: React.FC<Props> = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setMemory(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const backspace = () => {
    if (waitingForOperand) return;
    if (display.length <= 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const performOp = (nextOp: string) => {
    const inputValue = parseFloat(display);

    if (nextOp === 'sqrt') {
      if (inputValue >= 0) {
        setDisplay(String(Math.sqrt(inputValue)));
      } else {
        setDisplay('Error');
      }
      return;
    }

    if (nextOp === 'sqr') {
      setDisplay(String(inputValue * inputValue));
      return;
    }

    if (memory === null) {
      setMemory(inputValue);
    } else if (operation) {
      const currentVal = memory || 0;
      let result = 0;
      switch (operation) {
        case '+':
          result = currentVal + inputValue;
          break;
        case '-':
          result = currentVal - inputValue;
          break;
        case '×':
          result = currentVal * inputValue;
          break;
        case '÷':
          result = inputValue !== 0 ? currentVal / inputValue : 0;
          break;
        default:
          result = inputValue;
      }
      setMemory(result);
      setDisplay(String(Number(result.toFixed(6))));
    }

    setWaitingForOperand(true);
    setOperation(nextOp === '=' ? null : nextOp);
  };

  return (
    <div className="fixed inset-0 sm:inset-auto sm:top-20 sm:right-6 z-50 flex items-center justify-center sm:block p-4 sm:p-0">
      <div className="w-72 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <CalcIcon className="w-3.5 h-3.5" />
            <span>JAMB / WAEC CBT Calculator</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Display Screen */}
        <div className="p-3 bg-slate-950 text-right">
          <div className="text-[10px] text-slate-400 h-4">
            {memory !== null ? `${memory} ${operation || ''}` : ''}
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-300 truncate tracking-tight">
            {display}
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="p-2.5 grid grid-cols-4 gap-1.5 text-xs font-semibold select-none">
          <button
            onClick={clear}
            className="p-2.5 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded-lg transition active:scale-95"
          >
            C
          </button>
          <button
            onClick={() => performOp('sqrt')}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          >
            √
          </button>
          <button
            onClick={() => performOp('sqr')}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          >
            x²
          </button>
          <button
            onClick={backspace}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg flex items-center justify-center transition"
          >
            <Delete className="w-4 h-4" />
          </button>

          {/* Row 2 */}
          <button
            onClick={() => inputDigit('7')}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
          >
            7
          </button>
          <button
            onClick={() => inputDigit('8')}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
          >
            8
          </button>
          <button
            onClick={() => inputDigit('9')}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
          >
            9
          </button>
          <button
            onClick={() => performOp('÷')}
            className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
          >
            ÷
          </button>

          {/* Row 3 */}
          <button
            onClick={() => inputDigit('4')}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
          >
            4
          </button>
          <button
            onClick={() => inputDigit('5')}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
          >
            5
          </button>
          <button
            onClick={() => inputDigit('6')}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
          >
            6
          </button>
          <button
            onClick={() => performOp('×')}
            className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
          >
            ×
          </button>

          {/* Row 4 */}
          <button
            onClick={() => inputDigit('1')}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
          >
            1
          </button>
          <button
            onClick={() => inputDigit('2')}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
          >
            2
          </button>
          <button
            onClick={() => inputDigit('3')}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
          >
            3
          </button>
          <button
            onClick={() => performOp('-')}
            className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
          >
            −
          </button>

          {/* Row 5 */}
          <button
            onClick={() => inputDigit('0')}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
          >
            0
          </button>
          <button
            onClick={inputDot}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
          >
            .
          </button>
          <button
            onClick={() => performOp('=')}
            className="p-2.5 col-span-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm shadow-md"
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
};
