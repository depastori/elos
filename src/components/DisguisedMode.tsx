import React, { useState } from 'react';
import { Calculator, Calendar, Clock, Settings, ArrowLeft } from 'lucide-react';

interface DisguisedModeProps {
  onExitDisguise: () => void;
}

const DisguisedMode: React.FC<DisguisedModeProps> = ({ onExitDisguise }) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [showExitPrompt, setShowExitPrompt] = useState(false);

  // Código secreto para sair do modo disfarce: 911911
  const SECRET_EXIT_CODE = '911911';

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
    
    // Verificar código secreto
    const newSecretCode = (waitingForOperand ? '' : secretCode) + num;
    setSecretCode(newSecretCode);
    
    if (newSecretCode.includes(SECRET_EXIT_CODE)) {
      setShowExitPrompt(true);
      setSecretCode('');
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setSecretCode('');
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const buttons = [
    { label: 'C', action: clearAll, className: 'bg-red-100 text-red-700 hover:bg-red-200' },
    { label: 'CE', action: clearEntry, className: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
    { label: '⌫', action: () => setDisplay(display.slice(0, -1) || '0'), className: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
    { label: '÷', action: () => inputOperation('÷'), className: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
    
    { label: '7', action: () => inputNumber('7'), className: 'bg-white hover:bg-gray-50' },
    { label: '8', action: () => inputNumber('8'), className: 'bg-white hover:bg-gray-50' },
    { label: '9', action: () => inputNumber('9'), className: 'bg-white hover:bg-gray-50' },
    { label: '×', action: () => inputOperation('×'), className: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
    
    { label: '4', action: () => inputNumber('4'), className: 'bg-white hover:bg-gray-50' },
    { label: '5', action: () => inputNumber('5'), className: 'bg-white hover:bg-gray-50' },
    { label: '6', action: () => inputNumber('6'), className: 'bg-white hover:bg-gray-50' },
    { label: '-', action: () => inputOperation('-'), className: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
    
    { label: '1', action: () => inputNumber('1'), className: 'bg-white hover:bg-gray-50' },
    { label: '2', action: () => inputNumber('2'), className: 'bg-white hover:bg-gray-50' },
    { label: '3', action: () => inputNumber('3'), className: 'bg-white hover:bg-gray-50' },
    { label: '+', action: () => inputOperation('+'), className: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
    
    { label: '0', action: () => inputNumber('0'), className: 'bg-white hover:bg-gray-50 col-span-2' },
    { label: '.', action: inputDecimal, className: 'bg-white hover:bg-gray-50' },
    { label: '=', action: performCalculation, className: 'bg-green-100 text-green-700 hover:bg-green-200' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Exit Prompt Modal */}
      {showExitPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sair do Modo Disfarce?</h3>
            <p className="text-gray-600 mb-6">
              Você digitou o código de saída. Deseja retornar ao aplicativo principal?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowExitPrompt(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={onExitDisguise}
                className="flex-1 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-gray-900">Calculadora</h1>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Calculator */}
      <div className="max-w-md mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Display */}
          <div className="bg-gray-900 text-white p-6">
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-1">
                {previousValue !== null && operation ? `${previousValue} ${operation}` : ''}
              </div>
              <div className="text-3xl font-light break-all">
                {display}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-1 p-4">
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={button.action}
                className={`h-16 rounded-lg font-medium text-lg transition-all duration-150 active:scale-95 ${button.className}`}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hidden Instructions */}
        <div className="mt-8 bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Calculadora Simples</h3>
            <p className="text-xs text-gray-500">
              Realize cálculos básicos de forma rápida e fácil
            </p>
          </div>
        </div>

        {/* Secret Instructions (very subtle) */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            Versão 9.1.1 • Build 911
          </p>
        </div>
      </div>

      {/* Bottom Navigation (fake) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto px-4 py-2">
          <div className="flex justify-around">
            <button className="flex flex-col items-center py-2 text-blue-500">
              <Calculator className="h-5 w-5" />
              <span className="text-xs mt-1">Calculadora</span>
            </button>
            <button className="flex flex-col items-center py-2 text-gray-400">
              <Calendar className="h-5 w-5" />
              <span className="text-xs mt-1">Calendário</span>
            </button>
            <button className="flex flex-col items-center py-2 text-gray-400">
              <Clock className="h-5 w-5" />
              <span className="text-xs mt-1">Relógio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisguisedMode;