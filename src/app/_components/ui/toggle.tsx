import * as React from "react";
import { cn } from "../../../lib/utils";

export interface ToggleProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  labelPosition?: "left" | "right";
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      className,
      checked,
      onCheckedChange,
      label,
      labelPosition = "right",
      ...props
    },
    ref,
  ) => {
    const toggleSwitch = (
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            "peer-focus:ring-primary/20 peer h-6 w-11 rounded-full border-2 border-gray-300 transition-colors duration-300 ease-in-out peer-focus:ring-4 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:shadow-md after:transition-transform after:duration-300 after:ease-in-out after:content-[''] dark:border-gray-600 dark:after:border-gray-500",
            checked
              ? "bg-blue-500 after:translate-x-full dark:bg-blue-600"
              : "bg-gray-300 dark:bg-gray-700",
            className,
          )}
        />
      </label>
    );

    return (
      <div className="flex items-center space-x-3">
        {label && labelPosition === "left" && (
          <span className="text-foreground text-sm font-medium">{label}</span>
        )}
        {toggleSwitch}
        {label && labelPosition === "right" && (
          <span className="text-foreground text-sm font-medium">{label}</span>
        )}
      </div>
    );
  },
);
Toggle.displayName = "Toggle";

export { Toggle };
