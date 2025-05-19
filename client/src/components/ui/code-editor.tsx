import { forwardRef, ComponentPropsWithoutRef } from "react";
import { EditorView } from "@codemirror/view";
import { cn } from "@/lib/utils";

export interface CodeEditorProps extends ComponentPropsWithoutRef<"div"> {
  onChange?: (value: string) => void;
  editorView?: EditorView | null;
}

const CodeEditor = forwardRef<HTMLDivElement, CodeEditorProps>(
  ({ className, onChange, editorView, ...props }, ref) => {
    return (
      <div
        className={cn(
          "bg-editor-bg font-mono text-sm h-full w-full outline-none",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

CodeEditor.displayName = "CodeEditor";

export { CodeEditor };
