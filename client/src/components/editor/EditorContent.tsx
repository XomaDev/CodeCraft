import { useEffect, useRef } from "react";
import { basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { EditorView, lineNumbers } from "@codemirror/view";
import { lightTheme, customSyntaxHighlighting, customLanguage } from "@/lib/syntaxHighlighting";

interface EditorContentProps {
  code: string;
  onChange: (value: string) => void;
  onCursorActivity: (line: number, ch: number) => void;
}

export default function EditorContent({
  code,
  onChange,
  onCursorActivity,
}: EditorContentProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (editorRef.current && !viewRef.current) {
      const startState = EditorState.create({
        doc: code,
        extensions: [
          basicSetup,
          lightTheme,
          customLanguage,
          customSyntaxHighlighting,
          lineNumbers({
            formatNumber: (lineNo) => {
              return String(lineNo);
            },
          }),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChange(update.state.doc.toString());
            }
            if (update.selectionSet) {
              const pos = update.state.selection.main.head;
              const line = update.state.doc.lineAt(pos);
              onCursorActivity(line.number - 1, pos - line.from);
            }
          }),
        ],
      });

      const view = new EditorView({
        state: startState,
        parent: editorRef.current,
      });
      
      viewRef.current = view;
      
      // Focus on the editor when it's loaded
      view.focus();
    }

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, []);

  // Update editor content if code prop changes and it's not due to internal editor changes
  useEffect(() => {
    if (viewRef.current) {
      const currentContent = viewRef.current.state.doc.toString();
      if (code !== currentContent) {
        viewRef.current.dispatch({
          changes: { from: 0, to: currentContent.length, insert: code }
        });
      }
    }
  }, [code]);

  return (
    <div className="h-full w-full bg-[#f8f9fa]">
      <div 
        className="h-full w-full"
        ref={editorRef}
      />
    </div>
  );
}
