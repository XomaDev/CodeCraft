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
    if (stream.match(/^(if|elif|else|func|let|global|for|each|to|by|in|while|do|break|walkAll|color|local|this)\b/)) {
      return "keyword";
    }
    
    // Check for math functions (first group)
    if (stream.match(/^(root|abs|neg|log|exp|round|ceil|floor|sin|cos|tan|asin|acos|atan|degrees|radians|hex|bin|fromHex|fromBin)\b/)) {
      return "atom";  // Cyan color
    }
    
    // Check for built-in functions with parentheses (second group)
    if (stream.match(/^(bin|octal|hexa|randInt|randFloat|setRandSeed|min|max|avgOf|maxOf|minOf|geoMeanOf|stdDevOf|stdErrOf|nodeOf|mod|rem|quot|aTan2|formatDecimal|println|openScreen|openScreenWithValue|controls_closeScreenWithValue|getStartValue|closeScreen|closeApp|getPlainStartText|copyList|copyDict|makeColor|splitColor)\b/)) {
      return "atom";  // Amber color
    }
    
    // Check for type identifiers (third group)
    if (stream.match(/^(number|base10|hexa|bin|text|list|dict|emptyText|emptyList)\b/)) {
      return "tag";  // Purple color
    }
    
    // Check for method calls with dot notation (fourth group)
    const dotBefore = stream.string.slice(Math.max(0, stream.pos - 1), stream.pos) === ".";
    if (dotBefore && stream.match(/(startsWith|contains|containsAny|containsAll|split|splitAtFirst|splitAtAny|splitAtFirstOfAny|segment|replace|replaceFrom|replaceFromLongestFirst|add|listContainsItem|indexOf|insert|remove|appendList|lookupInPairs|join|slice|get|set|delete|getAtPath|setAtPath|containsKey|mergeInto|walkTree|textLen|trim|upper|lower|splitAtSpaces|reverse|csvRowToList|csvTableToList|listLen|random|reverseList|toCsvRow|toCsvTable|sort|allButFirst|allButLast|pairsToDict|keys|values|dictLen|toPairs)(?=\s*\()/)) {
      return "meta";  // Green color
    }
    
    //if (dotBefore && stream.match(/()(?!\s*\()/)) {
      //return "attribute";  // Blue color
    //}
    

    // Handle numbers
    if (stream.match(/^-?\d+(\.\d+)?/)) {
      return "number";
    }
    
    // Handle operators
    if (stream.match(/[+\-*\/\^=<>!&|~_:.]|===|!==|==|!=|<=|>=|<<|>>|&&|\|\||->|::|[\(\)\[\]\{\},?!]/)) {
      return "operator";
    }
    
    // Handle dot operator specifically (to help with method/property detection)
    if (stream.match(/\./)) {
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

// Create our custom highlighting style with more relaxed colors
const customHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: "#5a3a94", fontWeight: "bold" },       // Muted purple for keywords
  { tag: t.atom, color: "#0e7490" },                              // Cyan for math functions
  { tag: t.definition, color: "#b45309" },                        // Amber for built-in functions
  { tag: t.typeName, color: "#7e22ce" },                          // Purple for type identifiers
  { tag: t.meta, color: "#166534" },                              // Green for method calls
  { tag: t.attributeName, color: "#0369a1" },                     // Blue for property access
  { tag: t.operator, color: "#575e66" },                          // Dark gray for operators
  { tag: t.propertyName, color: "#327a5f" },                      // Softer green for properties
  { tag: t.string, color: "#2b6cb0" },                            // Muted blue for strings
  { tag: t.comment, color: "#6e7781", fontStyle: "italic" },      // Gray for comments
  { tag: t.variableName, color: "#24292f" },                      // Dark slate for variables
  { tag: t.number, color: "#7d4e31" },                            // Muted brown for numbers
]);

// Create syntax highlighting extension with our custom style
export const customSyntaxHighlighting = syntaxHighlighting(customHighlightStyle);
