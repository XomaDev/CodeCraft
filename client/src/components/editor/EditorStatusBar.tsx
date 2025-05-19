interface EditorStatusBarProps {
  lineCount: number;
}

export default function EditorStatusBar({ lineCount }: EditorStatusBarProps) {
  return (
    <footer className="bg-white border-t border-gray-200 px-4 py-1 text-xs text-gray-500 flex justify-between">
      <div>
        <span>{lineCount} lines</span>
      </div>
      <div className="flex space-x-4">
        <span>UTF-8</span>
        <span>LF</span>
        <span>Spaces: 2</span>
      </div>
    </footer>
  );
}
