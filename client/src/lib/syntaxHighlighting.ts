import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import { EditorView } from "@codemirror/view";
import { StreamLanguage } from "@codemirror/language";

// Create a light theme
export const lightTheme = EditorView.theme({
  "&": {
    backgroundColor: "#f8f9fa",
    color: "#334155",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "14px",
    height: "100%",
  },
  ".cm-content": {
    caretColor: "#3b82f6",
    paddingTop: "10px",
    paddingBottom: "10px",
  },
  ".cm-line": {
    padding: "0 4px",
  },
  ".cm-cursor": {
    borderLeftWidth: "2px",
    borderLeftColor: "#3b82f6",
    borderLeftStyle: "solid",
  },
  ".cm-activeLine": {
    backgroundColor: "rgba(191, 219, 254, 0.2)",
  },
  ".cm-gutters": {
    backgroundColor: "#e5e7eb",
    color: "#94a3b8",
    border: "none",
    paddingRight: "10px",
  },
  ".cm-gutter.cm-lineNumbers .cm-gutterElement": {
    paddingLeft: "10px",
    paddingRight: "5px",
    userSelect: "none",
  },
  ".cm-selectionBackground": {
    backgroundColor: "#bfdbfe",
  },
  "&.cm-focused .cm-selectionBackground": {
    backgroundColor: "#bfdbfe",
  },
  ".cm-scroller": {
    fontFamily: "'JetBrains Mono', monospace",
    overflow: "auto",
  },
});

// Create our custom highlighting style
const customHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: "#d946ef", fontWeight: "bold" },        // Purple for keywords
  { tag: t.operator, color: "#f59e0b" },                           // Amber for operators
  { tag: t.function, color: "#10b981", fontWeight: "bold" },       // Green for functions
  { tag: t.string, color: "#6366f1" },                             // Indigo for strings
  { tag: t.comment, color: "#64748b", fontStyle: "italic" },       // Slate for comments
  { tag: t.variableName, color: "#334155" },                       // Dark slate for variables
  { tag: t.number, color: "#ea580c" },                             // Orange for numbers
  { tag: t.className, color: "#7c3aed", fontWeight: "bold" },      // Purple for global variables
]);

// Create syntax highlighting extension with our custom style
export const customSyntaxHighlighting = syntaxHighlighting(customHighlightStyle);

// Define our keywords, operators, and other tokens
export const keywords = ["if", "elif", "else", "func", "let", "glob", "return", "print"];
export const operators = ["+", "-", "*", "/", "=", "==", "!=", ">", "<", ">=", "<="];

// Create a custom language for syntax highlighting
export const customLanguage = StreamLanguage.define({
  token(stream, state) {
    // Handle comments
    if (stream.match("//")) {
      stream.skipToEnd();
      return "comment";
    }
    
    // Handle strings
    if (stream.match(/"/) || stream.match(/'/)) {
      const quote = stream.string.charAt(stream.pos - 1);
      while (!stream.eol()) {
        if (stream.next() === quote && stream.string.charAt(stream.pos - 2) !== "\\") break;
      }
      return "string";
    }
    
    // Handle keywords
    if (stream.match(/^(if|elif|else|func|let|glob|return|print)\b/)) {
      return "keyword";
    }
    
    // Handle function definitions
    if (stream.match(/^func\s+([a-zA-Z_][a-zA-Z0-9_]*)/)) {
      return "function";
    }
    
    // Handle numbers
    if (stream.match(/^-?\d+(\.\d+)?/)) {
      return "number";
    }
    
    // Handle operators
    if (stream.match(/[+\-*\/=<>!]=?|&&|\|\|/)) {
      return "operator";
    }
    
    // Handle variables
    if (stream.match(/^[a-zA-Z_][a-zA-Z0-9_]*/)) {
      return "variable";
    }
    
    stream.next();
    return null;
  },
  startState() {
    return {};
  }
});
