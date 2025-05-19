import { useState, useEffect } from "react";
import EditorHeader from "@/components/editor/EditorHeader";
import EditorContent from "@/components/editor/EditorContent";
import EditorStatusBar from "@/components/editor/EditorStatusBar";

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
  
  func calculate(a, b) {
    let sum = a + b
    let diff = a - b
    let prod = a * b
    let quot = a / b
    return [sum, diff, prod, quot]
  }
}`);
  
  const [fileName, setFileName] = useState<string>("untitled.txt");
  const [cursorPosition, setCursorPosition] = useState<{line: number, ch: number}>({line: 0, ch: 0});
  const [lineCount, setLineCount] = useState<number>(0);

  const handleCodeChange = (value: string) => {
    setCode(value);
    // Count lines in the code
    setLineCount(value.split("\n").length);
  };
  
  const handleCursorActivity = (line: number, ch: number) => {
    setCursorPosition({ line, ch });
  };
  
  const handleNewFile = () => {
    if (window.confirm("Create a new file? Any unsaved changes will be lost.")) {
      setCode("");
      setFileName("untitled.txt");
    }
  };
  
  const handleOpenFile = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        setCode(e.target.result);
        setFileName(file.name);
      }
    };
    
    reader.readAsText(file);
  };
  
  const handleSaveFile = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  useEffect(() => {
    // Initial line count
    setLineCount(code.split("\n").length);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <EditorHeader 
        fileName={fileName} 
        cursorPosition={cursorPosition} 
        onNewFile={handleNewFile}
        onOpenFile={handleOpenFile}
        onSaveFile={handleSaveFile}
      />
      <EditorContent 
        code={code} 
        onChange={handleCodeChange} 
        onCursorActivity={handleCursorActivity} 
      />
      <EditorStatusBar lineCount={lineCount} />
    </div>
  );
}
