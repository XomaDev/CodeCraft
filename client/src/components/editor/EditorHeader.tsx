import { PlusIcon, FolderOpenIcon, SaveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface EditorHeaderProps {
  fileName: string;
  cursorPosition: { line: number; ch: number };
  onNewFile: () => void;
  onOpenFile: (files: FileList | null) => void;
  onSaveFile: () => void;
}

export default function EditorHeader({
  fileName,
  cursorPosition,
  onNewFile,
  onOpenFile,
  onSaveFile,
}: EditorHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          title="New File"
          onClick={onNewFile}
          className="p-1.5 rounded hover:bg-gray-100"
        >
          <PlusIcon className="h-5 w-5 text-gray-600" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          title="Open File"
          onClick={handleOpenFileClick}
          className="p-1.5 rounded hover:bg-gray-100 ml-2"
        >
          <FolderOpenIcon className="h-5 w-5 text-gray-600" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          title="Save File"
          onClick={onSaveFile}
          className="p-1.5 rounded hover:bg-gray-100 ml-2"
        >
          <SaveIcon className="h-5 w-5 text-gray-600" />
        </Button>
        <span className="ml-4 text-sm font-medium text-gray-600">{fileName}</span>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => onOpenFile(e.target.files)}
          accept=".txt,.js,.py,.html,.css,.json,.md,.ts,.tsx,.jsx"
        />
      </div>
      <div className="flex items-center">
        <span className="text-xs text-gray-500 mr-2">
          Line: {cursorPosition.line + 1}, Col: {cursorPosition.ch + 1}
        </span>
      </div>
    </header>
  );
}
