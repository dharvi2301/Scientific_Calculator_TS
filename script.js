class Calculator {
    constructor(screen) {
        this.screen = screen;
        this.expression = "";
        this.history = Calculator.loadHistory();
        this.isSecondFunction = false;
    }

    static loadHistory() {
        return JSON.parse(localStorage.getItem("calcHistory")) || [];
    }

    static saveHistory(history) {
        localStorage.setItem("calcHistory", JSON.stringify(history));
    }

    updateScreen() {
        this.screen.innerText = this.expression || "0";
    }

    append(value) {
        if (value === "π") {
            this.expression += Math.PI; 
        } else if (this.screen.innerText === "0" && value !== ".") {
            this.expression = value;
        } else {
            this.expression += value;
        }
        this.updateScreen();
    }

    clear() {
        this.expression = "";
        this.updateScreen();
    }

    delete() {
        this.expression = this.expression.slice(0, -1);
        this.updateScreen();
    }

    evaluate() {
        try {
            let result = this.expression
            .replace(/π/g, `(${Math.PI})`)
                .replace(/×/g, "*")
                .replace(/÷/g, "/")
                .replace(/π/g, Math.PI)
                .replace(/e/g, Math.E)
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

    factorial(n) {
        if (n < 0) return "Error";
        return n === 0 ? 1 : n * this.factorial(n - 1);
    }

    handleMathFunction(operation) {
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

    handleSpecialOperation(operation) {
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

    handleMathFunction(operation) {
        try {
            let value = eval(this.expression); 
            switch (operation) {
                case "x²":
                    this.expression = Math.pow(value, 2).toString();
                    break;
                case "x³":
                    this.expression = Math.pow(value, 3).toString();
                    break;
                case "√x":
                    this.expression = Math.sqrt(value).toString();
                    break;
                case "∛x":
                    this.expression = Math.cbrt(value).toString();
                    break;
                case "xʸ":
                    this.expression += "**"; 
                    break;
                case "ʸ√x":
                    this.expression += "**(1/"; 
                    break;
                case "10ˣ":
                    this.expression = Math.pow(10, value).toString();
                    break;
                case "2ˣ":
                    this.expression = Math.pow(2, value).toString();
                    break;
                case "log":
                    this.expression = Math.log10(value).toString();
                    break;
                case "logᵧx":
                    this.expression += ", Math.log("; 
                    break;
                case "ln":
                    this.expression = Math.log(value).toString();
                    break;
                case "eˣ":
                    this.expression = Math.exp(value).toString();
                    break;
                case "exp":  
                    this.expression = Math.exp(value).toString();
                    break;
               
            }
            this.updateScreen();
        } catch {
            this.screen.innerText = "Error";
            this.expression = "";
        }
    }

    toggleSecondFunction() {
        this.isSecondFunction = !this.isSecondFunction;
        document.getElementById("toggle-2nd").classList.toggle("active");

        document.querySelectorAll(".toggleable").forEach(button => {
            const primary = button.getAttribute("data-primary");
            const secondary = button.getAttribute("data-secondary");
            button.textContent = this.isSecondFunction ? secondary : primary;
        });
    }

    toggleTheme() {
        document.body.classList.toggle("dark-mode");
        document.querySelector(".calculator").classList.toggle("dark-mode");
    
        // Update theme icon
        const themeButton = document.getElementById("toggle-theme");
        themeButton.innerText = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
    
        // Save the theme preference
        localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    }
    
    static loadTheme() {
        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark-mode");
            document.querySelector(".calculator").classList.add("dark-mode");
            document.getElementById("toggle-theme").innerText = "☀️";
        }
    }  
}

// Initialize calculator
const screen = document.querySelector(".screen");
const calculator = new Calculator(screen);

// Load stored theme
Calculator.loadTheme();

// Event Listeners
document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("click", () => {
        const value = button.innerText;
       
        if (button.id === "trig-button") {
            return; 
        }

        if (button.classList.contains("clear")) {
            calculator.clear();
        } else if (button.classList.contains("delete")) {
            calculator.delete();
        } else if (button.classList.contains("equal")) {
            calculator.evaluate();
        } 
        else if (button.id === "toggle-2nd") {
            calculator.toggleSecondFunction();
        } else if (["1/x", "|x|", "n!"].includes(value)) {
            calculator.handleSpecialOperation(value);
        } else if (["x²", "x³", "√x", "∛x", "xʸ", "ʸ√x", "10ˣ", "2ˣ", "log", "logᵧx", "ln", "eˣ","exp", "|x|","1/x"].includes(value)) {
            calculator.handleMathFunction(value);
        } else {
            calculator.append(value);
        }
    });
});

// Keyboard Support
document.addEventListener("keydown", event => {
    const key = event.key;

    if (!isNaN(key) || "+-*/().".includes(key)) {
        calculator.append(key);
    } 
    else if (key.toLowerCase() === "p") {
        calculator.append("π"); // Allow users to type "p" for π
    } 
    else if (key === "Enter") {
        calculator.evaluate();
    } else if (key === "Backspace") {
        calculator.delete();
    } else if (key === "Escape") {
        calculator.clear();
    }
});

document.getElementById("toggle-theme").addEventListener("click", (event) => {
    event.stopPropagation(); 
    event.preventDefault(); 
    calculator.toggleTheme();
});

document.querySelector(".calculator").addEventListener("click", (event) => {
    if (event.target.classList.contains("theme-button")) return; 
    calculator.handleInput(event.target.innerText);
});





