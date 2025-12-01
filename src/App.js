import { useState, useEffect } from "react";
import "./styles/App.css";

function App() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");

  const inputNumber = (num) => {
    if (display === "0" || display === "Error") {
      setDisplay(String(num));
      setExpression(String(num));
    } else {
      const lastChar = display[display.length - 1];
      if (isOperator(lastChar)) {
        setDisplay(display + num);
        setExpression(expression + num);
      } else {
        setDisplay(display + num);
        setExpression(expression + num);
      }
    }
  };

  const inputDecimal = () => {
    const lastChar = display[display.length - 1];
    if (isOperator(lastChar) || display === "0" || display === "Error") {
      setDisplay(display === "0" || display === "Error" ? "0." : display + "0.");
      setExpression(expression === "" || expression === "0" ? "0." : expression + "0.");
    } else if (!display.includes(".") || isOperator(lastChar)) {
      const lastNumber = getLastNumber(display);
      if (!lastNumber.includes(".")) {
        setDisplay(display + ".");
        setExpression(expression + ".");
      }
    }
  };

  const isOperator = (char) => {
    return char === "+" || char === "−" || char === "×" || char === "÷";
  };

  const getLastNumber = (str) => {
    const operators = ["+", "−", "×", "÷"];
    for (let i = str.length - 1; i >= 0; i--) {
      if (operators.includes(str[i])) {
        return str.substring(i + 1);
      }
    }
    return str;
  };

  const clear = () => {
    setDisplay("0");
    setExpression("");
  };

  const performOperation = (operator) => {
    if (display === "Error") {
      setDisplay("0");
      setExpression("");
      return;
    }

    const lastChar = display[display.length - 1];
    
    if (isOperator(lastChar)) {
      // Substitui o operador anterior
      setDisplay(display.slice(0, -1) + operator);
      setExpression(expression.slice(0, -1) + getOperatorSymbol(operator));
    } else {
      // Adiciona o novo operador
      setDisplay(display + operator);
      setExpression(expression + getOperatorSymbol(operator));
    }
  };

  const getOperatorSymbol = (operator) => {
    const symbolMap = {
      "+": "+",
      "−": "-",
      "×": "*",
      "÷": "/"
    };
    return symbolMap[operator] || operator;
  };

  const handleEquals = () => {
    if (display === "Error" || expression === "") {
      return;
    }

    const lastChar = display[display.length - 1];
    if (isOperator(lastChar)) {
      return;
    }

    try {
      // Converte os símbolos visuais para operadores JavaScript
      let calcExpression = expression
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/−/g, "-");

      // eslint-disable-next-line
      const result = eval(calcExpression);
      
      if (isNaN(result) || !isFinite(result)) {
        setDisplay("Error");
        setExpression("");
      } else {
        setDisplay(String(result));
        setExpression(String(result));
      }
    } catch (error) {
      setDisplay("Error");
      setExpression("");
    }
  };

  const handleDelete = () => {
    if (display === "Error" || display === "0") {
      setDisplay("0");
      setExpression("");
    } else if (display.length > 1) {
      const newDisplay = display.slice(0, -1);
      setDisplay(newDisplay);
      
      // Atualiza expression removendo o último caractere
      const lastChar = display[display.length - 1];
      if (isOperator(lastChar)) {
        // Se era um operador, remove o símbolo correto da expression
        setExpression(expression.slice(0, -1));
      } else {
        setExpression(expression.slice(0, -1));
      }
    } else {
      setDisplay("0");
      setExpression("");
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
          <div className="display">{display}</div>
        </div>

        <div className="buttons">
          <button className="button function" onClick={clear}>
            AC
          </button>
          <button className="button function" onClick={handleDelete}>
            ⌫
          </button>
          <button className="button operator" onClick={() => performOperation("/")}>
            ÷
          </button>
          <button className="button operator" onClick={() => performOperation("*")}>
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
          <button className="button operator" onClick={() => performOperation("-")}>
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
