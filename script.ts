class Calculator {
    private screen: HTMLElement;
    private expression: string;
    private history: string[];
    private isSecondFunction: boolean;

    constructor(screen: HTMLElement) {
        this.screen = screen;
        this.expression = "";
        this.history = Calculator.loadHistory();
        this.isSecondFunction = false;
    }

    static loadHistory(): string[] {
        return JSON.parse(localStorage.getItem("calcHistory") || "[]");
    }

    static saveHistory(history: string[]): void {
        localStorage.setItem("calcHistory", JSON.stringify(history));
    }

    updateScreen(): void {
        this.screen.innerText = this.expression || "0";
    }

    append(value: string): void {
        if (value === "π") {
            this.expression += Math.PI.toString();
        } else if (this.screen.innerText === "0" && value !== ".") {
            this.expression = value;
        } else {
            this.expression += value;
        }
        this.updateScreen();
    }

    clear(): void {
        this.expression = "";
        this.updateScreen();
    }

    delete(): void {
        this.expression = this.expression.slice(0, -1);
        this.updateScreen();
    }

    evaluate(): void {
        try {
            let result = this.expression
                .replace(/π/g, `(${Math.PI})`)
                .replace(/×/g, "*")
                .replace(/÷/g, "/")
                .replace(/π/g, Math.PI.toString())
                .replace(/e/g, Math.E.toString())
                .replace(/mod/g, "%")
                .replace(/−/g, "-");

            result = eval(result); 
            this.expression = result.toString();
            this.history.push(this.expression);
            Calculator.saveHistory(this.history);
            this.updateScreen();
        } catch {
            this.screen.innerText = "Error";
            this.expression = "";
        }
    }

    factorial(n: number): number | string {
        if (n < 0) return "Error"; // Base case for invalid input (negative numbers)
        if (n === 0) return 1; // Base case for factorial(0)
    
        const result = this.factorial(n - 1); // Recursion
        if (typeof result === "number") {
            return n * result; // Return the product of n and the recursive result if it's a number
        }
        return result; // If it's an error, return that
    }
    

    handleMathFunction(operation: string): void {
        try {
            let value = parseFloat(this.expression);
            switch (operation) {
                case "x²":
                    this.expression = Math.pow(value, 2).toString();
                    break;
                case "√x":
                    this.expression = Math.sqrt(value).toString();
                    break;
                case "xʸ":
                    this.expression += "**"; 
                    break;
                case "10ˣ":
                    this.expression = Math.pow(10, value).toString();
                    break;
                case "log":
                    this.expression = Math.log10(value).toString();
                    break;
                case "ln":
                    this.expression = Math.log(value).toString();
                    break;
            }
            this.updateScreen();
        } catch {
            this.screen.innerText = "Error";
            this.expression = "";
        }
    }

    handleSpecialOperation(operation: string): void {
        try {
            let value = parseFloat(this.expression);
            switch (operation) {
                case "1/x":
                    if (value === 0) {
                        throw new Error("Division by zero");
                    }
                    this.expression = (1 / value).toString();
                    break;
                case "|x|":
                    this.expression = Math.abs(value).toString();
                    break;
                case "n!":
                    this.expression = this.factorial(value).toString();
                    break;
            }
            this.updateScreen();
        } catch {
            this.screen.innerText = "Error";
            this.expression = "";
        }
    }

    toggleSecondFunction(): void {
        this.isSecondFunction = !this.isSecondFunction;
        document.getElementById("toggle-2nd")?.classList.toggle("active");

        document.querySelectorAll(".toggleable").forEach((button) => {
            const primary = button.getAttribute("data-primary");
            const secondary = button.getAttribute("data-secondary");
            if (primary && secondary) {
                button.textContent = this.isSecondFunction ? secondary : primary;
            }
        });
    }

    toggleTheme(): void {
        document.body.classList.toggle("dark-mode");
        document.querySelector(".calculator")?.classList.toggle("dark-mode");
    
        const themeButton = document.getElementById("toggle-theme");
        if (themeButton) {
            themeButton.innerText = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
        }
    
        localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    }

    static loadTheme(): void {
        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark-mode");
            document.querySelector(".calculator")?.classList.add("dark-mode");
            const themeButton = document.getElementById("toggle-theme");
            if (themeButton) {
                themeButton.innerText = "☀️";
            }
        }
    }
}

// Initialize calculator
document.addEventListener("DOMContentLoaded", () => {
    const screen = document.querySelector(".screen") as HTMLElement;
    const calculator = new Calculator(screen);
});


// Load stored theme
Calculator.loadTheme();

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    const screen = document.querySelector(".screen") as HTMLElement;
    const calculator = new Calculator(screen);

    document.querySelectorAll(".btn").forEach((button) => {
        const btn = button as HTMLElement;

        btn.addEventListener("click", () => {
            const value = btn.innerText;

            if (btn.id === "trig-button") {
                return;
            }

            if (btn.classList.contains("clear")) {
                calculator.clear();
            } else if (btn.classList.contains("delete")) {
                calculator.delete();
            } else if (btn.classList.contains("equal")) {
                calculator.evaluate();
            } else if (btn.id === "toggle-2nd") {
                calculator.toggleSecondFunction();
            } else if (["1/x", "|x|", "n!"].includes(value)) {
                calculator.handleSpecialOperation(value);
            } else if (["x²", "x³", "√x", "∛x", "xʸ", "ʸ√x", "10ˣ", "2ˣ", "log", "logᵧx", "ln", "eˣ", "exp", "|x|", "1/x"].includes(value)) {
                calculator.handleMathFunction(value);
            } else {
                calculator.append(value);
            }
        });
    });
});


// Keyboard Support
document.addEventListener("keydown", (event: KeyboardEvent) => {
    const key = event.key;
    const screen = document.querySelector(".screen") as HTMLElement;
    const calculator = new Calculator(screen);

    if (!isNaN(Number(key)) || "+-*/().".includes(key)) {
        calculator.append(key);
    } else if (key.toLowerCase() === "p") {
        calculator.append("π"); // Allow users to type "p" for π
    } else if (key === "Enter") {
        calculator.evaluate();
    } else if (key === "Backspace") {
        calculator.delete();
    } else if (key === "Escape") {
        calculator.clear();
    }
});

document.getElementById("toggle-theme")?.addEventListener("click", (event: MouseEvent) => {
     const screen = document.querySelector(".screen") as HTMLElement;
    const calculator = new Calculator(screen);
    event.stopPropagation(); 
    event.preventDefault(); 
    calculator.toggleTheme();
});

const calculator = document.querySelector(".calculator") as HTMLElement; // Type assertion

if (calculator) { // Check if the element exists
  calculator.addEventListener("click", (event: MouseEvent) => {
    const target = event.target as HTMLElement; // Type assertion for the target

    if (target && target.classList.contains("theme-button")) {
      return;
    }

    if (calculator && typeof (calculator as any).handleInput === 'function') { // Check if handleInput exists and is a function
      (calculator as any).handleInput(target.innerText);
    } else {
      console.error("handleInput is not defined on the calculator element.");
    }

  });
} else {
  console.error("Calculator element not found.");
}

// Assuming 'calculator' is an object with a handleInput method. For example:
interface CalculatorInterface {
  handleInput: (input: string) => void;
}

const calculatorInstance = document.querySelector(".calculator") as unknown as CalculatorInterface;

if (calculatorInstance) {
  calculatorInstance.handleInput = (input: string) => {
    // Your calculator logic here
    console.log("Input received:", input);
  };
}
