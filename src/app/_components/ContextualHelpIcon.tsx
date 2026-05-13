"use client";

import { useState } from "react";
import { HelpModal } from "./HelpModal";
import { HelpCircle } from "lucide-react";

interface ContextualHelpIconProps {
  section: string;
  className?: string;
  size?: "sm" | "default";
  tooltip?: string;
}

export function ContextualHelpIcon({
  section,
  className = "",
  size = "sm",
  tooltip = "Help",
}: ContextualHelpIconProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = size === "sm" ? "h-7 w-7 p-1.5" : "h-9 w-9 p-2";

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={`${sizeClasses} text-muted-foreground hover:text-foreground hover:bg-muted inline-flex cursor-pointer items-center justify-center rounded-md transition-colors ${className}`}
        title={tooltip}
      >
        <HelpCircle className="h-4 w-4" />
      </div>

      <HelpModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialSection={section}
      />
    </>
  );
}
