import { forwardRef, ComponentPropsWithoutRef } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, FolderOpenIcon, SaveIcon } from "lucide-react";

export interface FileButtonProps extends ComponentPropsWithoutRef<"button"> {
  icon: "new" | "open" | "save";
  onAction: () => void;
}

const FileButton = forwardRef<HTMLButtonElement, FileButtonProps>(
  ({ className, icon, onAction, ...props }, ref) => {
    const iconMap = {
      new: <PlusIcon className="h-5 w-5" />,
      open: <FolderOpenIcon className="h-5 w-5" />,
      save: <SaveIcon className="h-5 w-5" />,
    };

    const titleMap = {
      new: "New File",
      open: "Open File",
      save: "Save File",
    };

    return (
      <Button
        variant="ghost"
        size="icon"
        title={titleMap[icon]}
        onClick={onAction}
        ref={ref}
        className="p-1.5 rounded hover:bg-gray-100"
        {...props}
      >
        {iconMap[icon]}
      </Button>
    );
  }
);

FileButton.displayName = "FileButton";

export { FileButton };
