"use client";

import { useState, useRef, useEffect } from "react";
import type { Server } from "../../types/server";

interface ColorCodedDropdownProps {
  servers: Server[];
  selectedServer: Server | null;
  onServerSelect: (server: Server | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ColorCodedDropdown({
  servers,
  selectedServer,
  onServerSelect,
  placeholder = "Select a server...",
  disabled = false,
}: ColorCodedDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleServerClick = (server: Server) => {
    onServerSelect(server);
    setIsOpen(false);
  };

  const handleClearSelection = () => {
    onServerSelect(null);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`border-input focus:ring-primary focus:border-primary bg-background text-foreground flex w-full items-center justify-between rounded-md border px-3 py-2 text-left shadow-sm focus:ring-2 focus:outline-none ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-accent cursor-pointer"
        }`}
      >
        <span className="truncate">
          {selectedServer ? (
            <span className="flex items-center gap-2">
              {selectedServer.color && (
                <span
                  className="h-3 w-3 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: selectedServer.color }}
                />
              )}
              {selectedServer.name} ({selectedServer.ip}) -{" "}
              {selectedServer.user}
            </span>
          ) : (
            placeholder
          )}
        </span>
        <svg
          className={`h-4 w-4 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="bg-card border-border absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border shadow-lg">
          {/* Clear Selection Option */}
          <button
            type="button"
            onClick={handleClearSelection}
            className="text-muted-foreground hover:bg-accent hover:text-foreground w-full px-3 py-2 text-left text-sm transition-colors"
          >
            {placeholder}
          </button>

          {/* Server Options */}
          {servers
            .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
            .map((server) => (
              <button
                key={server.id}
                type="button"
                onClick={() => handleServerClick(server)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                  selectedServer?.id === server.id
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {server.color && (
                  <span
                    className="h-3 w-3 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: server.color }}
                  />
                )}
                <span className="truncate">
                  {server.name} ({server.ip}) - {server.user}
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
