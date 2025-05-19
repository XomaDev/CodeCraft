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
  // Add styling for our custom syntax highlighting classes
  ".cm-math-function": { color: "#0e7490" },            // Cyan for math functions
  ".cm-builtin-function": { color: "#b45309" },         // Amber for built-in functions  
  ".cm-type-identifier": { color: "#7e22ce" },          // Purple for type identifiers
  ".cm-method-call": { color: "#166534" },              // Green for method calls
  ".cm-property-access": { color: "#0369a1" }           // Blue for property access
});

// Create our custom highlighting style with more relaxed colors
const customHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: "#5a3a94", fontWeight: "bold" },       // Muted purple for keywords
  { tag: t.operator, color: "#575e66" },                          // Dark gray for operators
  { tag: t.propertyName, color: "#327a5f" },                      // Softer green for properties
  { tag: t.string, color: "#2b6cb0" },                            // Muted blue for strings
  { tag: t.comment, color: "#6e7781", fontStyle: "italic" },      // Gray for comments
  { tag: t.variableName, color: "#24292f" },                      // Dark slate for variables
  { tag: t.number, color: "#7d4e31" },                            // Muted brown for numbers
  { tag: t.className, color: "#5a3a94" },                         // Muted purple for globals
  { tag: t.punctuation, color: "#575e66" }                        // Dark gray for punctuation
]);

// Create syntax highlighting extension with our custom style
export const customSyntaxHighlighting = syntaxHighlighting(customHighlightStyle);

// Define our keywords, operators, and other tokens
export const keywords = [
  "if", "elif", "else", "func", "let", "glob", "return", "print",
  "for", "each", "to", "by", "in", "while", "do", "break", 
  "walkAll", "color", "var", "glob", "let"
];

// First group (math functions)
export const mathFunctions = [
  "root", "abs", "neg", "log", "exp", "round", "ceil", "floor", 
  "sin", "cos", "tan", "asin", "acos", "atan", "degrees", "radians", 
  "hex", "bin", "fromHex", "fromBin"
];

// Second group (built-in function calls)
export const builtInFunctions = [
  "bin", "octal", "hexa", "randInt", "randFloat", "setRandSeed", 
  "min", "max", "avgOf", "maxOf", "minOf", "geoMeanOf", "stdDevOf", 
  "stdErrOf", "nodeOf", "mod", "rem", "quot", "aTan2", "formatDecimal", 
  "println", "openScreen", "openScreenWithValue", "controls_closeScreenWithValue", 
  "getStartValue", "closeScreen", "closeApp", "getPlainStartText", 
  "copyList", "copyDict", "makeColor", "splitColor"
];

// Third group (question/type identifiers)
export const typeIdentifiers = [
  "number", "base10", "hexa", "bin", "text", "list", "dict", 
  "emptyText", "emptyList"
];

// Fourth group (method calls)
export const methodCalls = [
  "startsWith", "contains", "containsAny", "containsAll", "split", "splitAtFirst", 
  "splitAtAny", "splitAtFirstOfAny", "segment", "replace", "replaceFrom", 
  "replaceFromLongestFirst", "add", "listContainsItem", "indexOf", "insert", 
  "remove", "appendList", "lookupInPairs", "join", "slice", "get", "set", 
  "delete", "getAtPath", "setAtPath", "containsKey", "mergeInto", "walkTree"
];

// Fifth group (property access)
export const propertyAccess = [
  "textLen", "trim", "upper", "lower", "splitAtSpaces", "reverse", 
  "csvRowToList", "csvTableToList", "listLen", "random", "reverseList", 
  "toCsvRow", "toCsvTable", "sort", "allButFirst", "allButLast", 
  "pairsToDict", "keys", "values", "dictLen", "toPairs"
];

export const operators = [
  "+", "-", "*", "/", "^", "||", "&&", "|", "&", "~",
  "==", "!=", "===", "!==", "<", "<=", ">", ">=", "<<", ">>", 
  "_", ":", "::", "(", ")", "[", "]", "{", "}", "=", ".", ",", "?", "!", "->"
];

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
    if (stream.match(/^(if|elif|else|func|let|glob|return|print|for|each|to|by|in|while|do|break|walkAll|color|var)\b/)) {
      return "keyword";
    }
    
    // Check for math functions (first group)
    if (stream.match(/^(root|abs|neg|log|exp|round|ceil|floor|sin|cos|tan|asin|acos|atan|degrees|radians|hex|bin|fromHex|fromBin)\b/)) {
      return "math-function";
    }
    
    // Check for built-in functions with parentheses (second group)
    const builtInLookahead = stream.match(/^(bin|octal|hexa|randInt|randFloat|setRandSeed|min|max|avgOf|maxOf|minOf|geoMeanOf|stdDevOf|stdErrOf|nodeOf|mod|rem|quot|aTan2|formatDecimal|println|openScreen|openScreenWithValue|controls_closeScreenWithValue|getStartValue|closeScreen|closeApp|getPlainStartText|copyList|copyDict|makeColor|splitColor)(?=\s*\()/);
    if (builtInLookahead) {
      return "builtin-function";
    }
    
    // Check for type identifiers (third group)
    if (stream.match(/^(number|base10|hexa|bin|text|list|dict|emptyText|emptyList)\b/)) {
      return "type-identifier";
    }
    
    // Check for method calls with dot notation (fourth group)
    const methodLookahead = stream.match(/\.\s*(startsWith|contains|containsAny|containsAll|split|splitAtFirst|splitAtAny|splitAtFirstOfAny|segment|replace|replaceFrom|replaceFromLongestFirst|add|listContainsItem|indexOf|insert|remove|appendList|lookupInPairs|join|slice|get|set|delete|getAtPath|setAtPath|containsKey|mergeInto|walkTree)(?=\s*\()/);
    if (methodLookahead) {
      return "method-call";
    }
    
    // Check for property access without parentheses (fifth group)
    const propertyLookahead = stream.match(/\.\s*(textLen|trim|upper|lower|splitAtSpaces|reverse|csvRowToList|csvTableToList|listLen|random|reverseList|toCsvRow|toCsvTable|sort|allButFirst|allButLast|pairsToDict|keys|values|dictLen|toPairs)(?!\s*\()/);
    if (propertyLookahead) {
      return "property-access";
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
    if (stream.match(/[+\-*\/\^=<>!&|~_:.]|===|!==|==|!=|<=|>=|<<|>>|&&|\|\||->|::|[\(\)\[\]\{\},?!]/)) {
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
