import { useState, useEffect } from "react";
import EditorContent from "@/components/editor/EditorContent";

export default function CodeEditor() {
  const [code, setCode] = useState<string>(`func main() {
  let x = 10
  let y = 20
  let result = x + y
  
  if result > 25 {
    print("Result is greater than 25")
  } elif result == 30 {
    print("Result is exactly 30")
  } else {
    print("Result is less than or equal to 25")
  }
  
  // Example of using global variables
  glob MAX_VALUE = 100
  
  // Math functions
  let radius = 5
  let area = 3.14 * radius ^ 2
  let circumference = 2 * 3.14 * radius
  
  // Using math functions
  let angle = 45
  let sinValue = sin(angle)
  let cosValue = cos(angle)
  let tanValue = tan(angle)
  let roundedValue = round(3.14159)
  
  // Example of built-in functions
  let rng = randInt(1, 100)
  let minValue = min(x, y)
  let maxValue = max(x, y)
  
  // Type identifiers
  let n = number
  let t = text
  let l = list
  
  // Method calls
  let message = "Hello, World!"
  let contains = message.contains("Hello")
  let split = message.split(",")
  
  // Property access
  let length = message.textLen
  let uppercase = message.upper
  
  func calculate(a, b) {
    let sum = a + b
    let diff = a - b
    let prod = a * b
    let quot = a / b
    return [sum, diff, prod, quot]
  }
}`);
  
  const handleCodeChange = (value: string) => {
    setCode(value);
  };
  
  const handleCursorActivity = (line: number, ch: number) => {
    // We're not displaying cursor position anymore
  };

  return (
    <div className="h-screen">
      <EditorContent 
        code={code} 
        onChange={handleCodeChange} 
        onCursorActivity={handleCursorActivity} 
      />
    </div>
  );
}
