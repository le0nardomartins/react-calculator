import { useState, useEffect } from "react";
import "./styles/App.css";

function App() {
  const [display, setDisplay] = useState("0");
  const [accumulator, setAccumulator] = useState(0);
  const [lastOperation, setLastOperation] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const inputNumber = (num) => {
    if (waitingForNewValue || display === "0" || display === "Error") {
      setDisplay(String(num));
      setWaitingForNewValue(false);
    } else {
      setDisplay(display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForNewValue || display === "Error") {
      setDisplay("0.");
      setWaitingForNewValue(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setAccumulator(0);
    setLastOperation(null);
    setWaitingForNewValue(false);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "−":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return secondValue !== 0 ? firstValue / secondValue : 0;
      default:
        return secondValue;
    }
  };

  const performOperation = (operator) => {
    const inputValue = parseFloat(display);

    if (display === "Error" || isNaN(inputValue)) {
      setDisplay("0");
      setAccumulator(0);
      setLastOperation(null);
      setWaitingForNewValue(false);
      return;
    }

    if (lastOperation === null) {
      // Primeira operação: apenas armazena o valor
      setAccumulator(inputValue);
      setLastOperation(operator);
      setWaitingForNewValue(true);
    } else {
      // Se está esperando um novo valor, usa o valor atual do display como segundo operando
      // para a nova operação (ex: 10 ADD MULTIPLY = 10 * 10 = 100)
      if (waitingForNewValue) {
        const result = calculate(inputValue, inputValue, operator);
        setAccumulator(result);
        setDisplay(String(result));
        setLastOperation(operator);
        setWaitingForNewValue(true);
      } else {
        // Se digitou um novo número e pressiona uma nova operação,
        // primeiro calcula com a operação anterior, depois armazena a nova operação
        // Mas o critério do teste 4 diz que deve usar a NOVA operação diretamente
        // Então: quando você muda o input e pressiona uma nova operação,
        // você deve usar a NOVA operação com o accumulator e o valor atual
        const result = calculate(accumulator, inputValue, operator);
        setAccumulator(result);
        setDisplay(String(result));
        setLastOperation(operator);
        setWaitingForNewValue(true);
      }
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (lastOperation === null || display === "Error" || isNaN(inputValue)) {
      return;
    }

    const result = calculate(accumulator, inputValue, lastOperation);
    setDisplay(String(result));
    setAccumulator(result);
    setLastOperation(null);
    setWaitingForNewValue(true);
  };

  const handleDelete = () => {
    if (display === "Error" || display === "0") {
      setDisplay("0");
    } else if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;

      // Números 0-9
      if (key >= "0" && key <= "9") {
        event.preventDefault();
        inputNumber(parseInt(key));
      }
      // Ponto decimal
      else if (key === ".") {
        event.preventDefault();
        inputDecimal();
      }
      // Operadores
      else if (key === "+") {
        event.preventDefault();
        performOperation("+");
      } else if (key === "-") {
        event.preventDefault();
        performOperation("−");
      } else if (key === "*") {
        event.preventDefault();
        performOperation("×");
      } else if (key === "/") {
        event.preventDefault();
        performOperation("÷");
      }
      // Enter ou = para calcular
      else if (key === "Enter" || key === "=") {
        event.preventDefault();
        handleEquals();
      }
      // Backspace ou Delete para deletar
      else if (key === "Backspace" || key === "Delete") {
        event.preventDefault();
        handleDelete();
      }
      // Escape ou 'c' para limpar
      else if (key === "Escape" || key === "c" || key === "C") {
        event.preventDefault();
        clear();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app">
      <div className="calculator">
        <div className="calculator-header">
          <h1>Calculadora</h1>
        </div>
        
        <div className="display-container">
          <div className="accumulator-display">{accumulator !== 0 ? accumulator : ""}</div>
          <div className="display">{display}</div>
        </div>

        <div className="buttons">
          <button className="button function" onClick={clear}>
            AC
          </button>
          <button className="button function" onClick={handleDelete}>
            ⌫
          </button>
          <button className="button operator" onClick={() => performOperation("÷")}>
            ÷
          </button>
          <button className="button operator" onClick={() => performOperation("×")}>
            ×
          </button>

          <button className="button number" onClick={() => inputNumber(7)}>
            7
          </button>
          <button className="button number" onClick={() => inputNumber(8)}>
            8
          </button>
          <button className="button number" onClick={() => inputNumber(9)}>
            9
          </button>
          <button className="button operator" onClick={() => performOperation("−")}>
            −
          </button>

          <button className="button number" onClick={() => inputNumber(4)}>
            4
          </button>
          <button className="button number" onClick={() => inputNumber(5)}>
            5
          </button>
          <button className="button number" onClick={() => inputNumber(6)}>
            6
          </button>
          <button className="button operator" onClick={() => performOperation("+")}>
            +
          </button>

          <button className="button number" onClick={() => inputNumber(1)}>
            1
          </button>
          <button className="button number" onClick={() => inputNumber(2)}>
            2
          </button>
          <button className="button number" onClick={() => inputNumber(3)}>
            3
          </button>
          <button className="button equals" onClick={handleEquals}>
            =
          </button>

          <button className="button number zero" onClick={() => inputNumber(0)}>
            0
          </button>
          <button className="button number" onClick={inputDecimal}>
            .
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
