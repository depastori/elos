import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export function CalculatorDisguise({ onExit }) {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [secretCode, setSecretCode] = useState('')

  const inputNumber = (num) => {
    // Verificar código secreto
    const newSecretCode = secretCode + num
    setSecretCode(newSecretCode)
    
    if (newSecretCode === '911911') {
      onExit()
      return
    }
    
    // Manter apenas os últimos 6 dígitos do código secreto
    if (newSecretCode.length > 6) {
      setSecretCode(newSecretCode.slice(-6))
    }

    // Lógica normal da calculadora
    if (waitingForOperand) {
      setDisplay(String(num))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? String(num) : display + num)
    }
  }

  const inputOperation = (nextOperation) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '×':
        return firstValue * secondValue
      case '÷':
        return firstValue / secondValue
      case '=':
        return secondValue
      default:
        return secondValue
    }
  }

  const performCalculation = () => {
    const inputValue = parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const clear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
    setSecretCode('')
  }

  const clearEntry = () => {
    setDisplay('0')
    setWaitingForOperand(false)
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  const buttons = [
    ['C', 'CE', '←', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['±', '0', '.', '=']
  ]

  const handleButtonClick = (button) => {
    switch (button) {
      case 'C':
        clear()
        break
      case 'CE':
        clearEntry()
        break
      case '←':
        if (display.length > 1) {
          setDisplay(display.slice(0, -1))
        } else {
          setDisplay('0')
        }
        break
      case '±':
        if (display !== '0') {
          setDisplay(display.charAt(0) === '-' ? display.substr(1) : '-' + display)
        }
        break
      case '.':
        inputDecimal()
        break
      case '=':
        performCalculation()
        break
      case '+':
      case '-':
      case '×':
      case '÷':
        inputOperation(button)
        break
      default:
        if (!isNaN(button)) {
          inputNumber(button)
        }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-xs shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-center text-gray-800">Calculadora</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Display */}
          <div className="bg-gray-900 text-white p-4 rounded-lg text-right">
            <div className="text-2xl font-mono overflow-hidden">
              {display}
            </div>
          </div>

          {/* Botões */}
          <div className="grid grid-cols-4 gap-2">
            {buttons.flat().map((button, index) => (
              <Button
                key={index}
                onClick={() => handleButtonClick(button)}
                variant={
                  ['C', 'CE', '←'].includes(button) ? 'destructive' :
                  ['+', '-', '×', '÷', '='].includes(button) ? 'default' :
                  'outline'
                }
                className={`h-12 text-lg font-medium ${
                  button === '0' ? 'col-span-1' : ''
                } ${
                  ['C', 'CE', '←'].includes(button) ? 'bg-red-500 hover:bg-red-600 text-white' :
                  ['+', '-', '×', '÷', '='].includes(button) ? 'bg-blue-500 hover:bg-blue-600 text-white' :
                  'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                {button}
              </Button>
            ))}
          </div>

          {/* Dica secreta (só visível se houver parte do código) */}
          {secretCode.length > 0 && secretCode.length < 6 && (
            <div className="text-center">
              <div className="inline-flex items-center space-x-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < secretCode.length ? 'bg-blue-400' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Informações da calculadora */}
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>Calculadora Científica v2.1</p>
            <p>© 2024 Calculator Pro</p>
          </div>
        </CardContent>
      </Card>

      {/* Instruções invisíveis para código secreto */}
      <div className="hidden">
        {/* Para sair do modo disfarce, digite: 911911 */}
      </div>
    </div>
  )
}