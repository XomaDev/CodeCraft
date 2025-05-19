import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import { EditorView } from "@codemirror/view";

// Define custom token types for our specific language elements
const customTags = {
  keyword: t.keyword,
  operator: t.operator,
  function: t.function,
  string: t.string,
  comment: t.comment,
  variable: t.variableName,
};

// Create a light theme
export const lightTheme = EditorView.theme({
  "&": {
    backgroundColor: "#f0f0f0",
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
  {
    tag: customTags.keyword,
    color: "#d946ef", // Purple for keywords
  },
  {
    tag: customTags.operator,
    color: "#f59e0b", // Amber for operators
  },
  {
    tag: customTags.function,
    color: "#10b981", // Green for functions
  },
  {
    tag: customTags.string,
    color: "#6366f1", // Indigo for strings
  },
  {
    tag: customTags.comment,
    color: "#64748b", // Slate for comments
    fontStyle: "italic",
  },
  {
    tag: customTags.variable,
    color: "#334155", // Dark slate for variables (regular text color)
  },
]);

// Create syntax highlighting extension with our custom style
export const customSyntaxHighlighting = syntaxHighlighting(customHighlightStyle);

// Custom language specific tokens for our keywords
export const keywords = ["if", "elif", "else", "func", "let", "glob", "return"];
export const operators = ["+", "-", "*", "/", "=", "==", "!=", ">", "<", ">=", "<="];

// This would be expanded in a real implementation to do proper tokenization for our language
