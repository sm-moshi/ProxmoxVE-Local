"use client";

import { Button } from "./ui/button";
import { StatusBadge } from "./Badge";
import { getContrastColor } from "../../lib/colorUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";

interface InstalledScript {
  id: number;
  script_name: string;
  script_path: string;
  container_id: string | null;
  server_id: number | null;
  server_name: string | null;
  server_ip: string | null;
  server_user: string | null;
  server_password: string | null;
  server_auth_type: string | null;
  server_ssh_key: string | null;
  server_ssh_key_passphrase: string | null;
  server_ssh_port: number | null;
  server_color: string | null;
  installation_date: string;
  status: "in_progress" | "success" | "failed";
  output_log: string | null;
  execution_mode: "local" | "ssh";
  container_status?: "running" | "stopped" | "unknown";
  web_ui_ip: string | null;
  web_ui_port: number | null;
  is_vm?: boolean;
}

interface ScriptInstallationCardProps {
  script: InstalledScript;
  isEditing: boolean;
  editFormData: {
    script_name: string;
    container_id: string;
    web_ui_ip: string;
    web_ui_port: string;
  };
  onInputChange: (
    field: "script_name" | "container_id" | "web_ui_ip" | "web_ui_port",
    value: string,
  ) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onUpdate: () => void;
  onBackup?: () => void;
  onClone?: () => void;
  onShell: () => void;
  onDelete: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
  // New container control props
  containerStatus?: "running" | "stopped" | "unknown";
  onStartStop: (action: "start" | "stop") => void;
  onDestroy: () => void;
  isControlling: boolean;
  // Web UI props
  onOpenWebUI: () => void;
  onAutoDetectWebUI: () => void;
  isAutoDetecting: boolean;
}

export function ScriptInstallationCard({
  script,
  isEditing,
  editFormData,
  onInputChange,
  onEdit,
  onSave,
  onCancel,
  onUpdate,
  onBackup,
  onClone,
  onShell,
  onDelete,
  isUpdating,
  isDeleting,
  containerStatus,
  onStartStop,
  onDestroy,
  isControlling,
  onOpenWebUI,
  onAutoDetectWebUI,
  isAutoDetecting,
}: ScriptInstallationCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Helper function to check if a script has any actions available
  const hasActions = (script: InstalledScript) => {
    if (script.container_id && script.execution_mode === "ssh") return true;
    if (script.web_ui_ip != null) return true;
    if (!script.container_id || script.execution_mode !== "ssh") return true;
    return false;
  };

  return (
    <div
      className="bg-card border-border rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md"
      style={{
        borderLeft: `4px solid ${script.server_color ?? "transparent"}`,
      }}
    >
      {/* Header with Script Name and Status */}
      <div className="mb-3 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editFormData.script_name}
                onChange={(e) => onInputChange("script_name", e.target.value)}
                className="border-border bg-background text-foreground focus:ring-primary w-full rounded border px-2 py-1 text-sm focus:ring-2 focus:outline-none"
                placeholder="Script name"
              />
              <div className="text-muted-foreground text-xs">
                {script.script_path}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-foreground truncate text-sm font-medium">
                {script.script_name}
              </div>
              <div className="text-muted-foreground truncate text-xs">
                {script.script_path}
              </div>
            </div>
          )}
        </div>
        <div className="ml-2 flex-shrink-0">
          <StatusBadge status={script.status}>
            {script.status.replace("_", " ").toUpperCase()}
          </StatusBadge>
        </div>
      </div>

      {/* Details Grid */}
      <div className="mb-4 grid grid-cols-1 gap-3">
        {/* Container ID */}
        <div>
          <div className="text-muted-foreground mb-1 text-xs font-medium">
            Container ID
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editFormData.container_id}
              onChange={(e) => onInputChange("container_id", e.target.value)}
              className="border-border bg-background text-foreground focus:ring-primary w-full rounded border px-2 py-1 font-mono text-sm focus:ring-2 focus:outline-none"
              placeholder="Container ID"
            />
          ) : (
            <div className="text-foreground font-mono text-sm break-all">
              {script.container_id ? (
                <div className="flex items-center space-x-2">
                  <span>{script.container_id}</span>
                  {script.container_status && (
                    <div className="flex items-center space-x-1">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          script.container_status === "running"
                            ? "bg-success"
                            : script.container_status === "stopped"
                              ? "bg-error"
                              : "bg-muted-foreground"
                        }`}
                      ></div>
                      <span
                        className={`text-xs font-medium ${
                          script.container_status === "running"
                            ? "text-success"
                            : script.container_status === "stopped"
                              ? "text-error"
                              : "text-muted-foreground"
                        }`}
                      >
                        {script.container_status === "running"
                          ? "Running"
                          : script.container_status === "stopped"
                            ? "Stopped"
                            : "Unknown"}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                "-"
              )}
            </div>
          )}
        </div>

        {/* Web UI */}
        <div>
          <div className="text-muted-foreground mb-1 text-xs font-medium">
            IP:PORT
          </div>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={editFormData.web_ui_ip}
                onChange={(e) => onInputChange("web_ui_ip", e.target.value)}
                className="border-border bg-background text-foreground focus:ring-primary flex-1 rounded border px-2 py-1 font-mono text-sm focus:ring-2 focus:outline-none"
                placeholder="IP"
              />
              <span className="text-muted-foreground">:</span>
              <input
                type="number"
                value={editFormData.web_ui_port}
                onChange={(e) => onInputChange("web_ui_port", e.target.value)}
                className="border-border bg-background text-foreground focus:ring-primary w-20 rounded border px-2 py-1 font-mono text-sm focus:ring-2 focus:outline-none"
                placeholder="Port"
              />
            </div>
          ) : (
            <div className="text-foreground font-mono text-sm">
              {script.web_ui_ip ? (
                <div className="flex w-full items-center justify-between">
                  <button
                    onClick={onOpenWebUI}
                    disabled={containerStatus === "stopped"}
                    className={`text-info hover:text-info/80 flex-shrink-0 hover:underline ${
                      containerStatus === "stopped"
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                  >
                    {script.web_ui_ip}:{script.web_ui_port ?? 80}
                  </button>
                  {script.container_id && script.execution_mode === "ssh" && (
                    <button
                      onClick={onAutoDetectWebUI}
                      disabled={isAutoDetecting}
                      className="bg-info hover:bg-info/90 text-info-foreground border-info ml-2 flex-shrink-0 rounded border px-2 py-1 text-xs transition-colors disabled:opacity-50"
                      title="Re-detect IP and port"
                    >
                      {isAutoDetecting ? "..." : "Re-detect"}
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">-</span>
                  {script.container_id && script.execution_mode === "ssh" && (
                    <button
                      onClick={onAutoDetectWebUI}
                      disabled={isAutoDetecting}
                      className="bg-info hover:bg-info/90 text-info-foreground border-info rounded border px-2 py-1 text-xs transition-colors disabled:opacity-50"
                      title="Re-detect IP and port"
                    >
                      {isAutoDetecting ? "..." : "Re-detect"}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Server */}
        <div>
          <div className="text-muted-foreground mb-1 text-xs font-medium">
            Server
          </div>
          <span
            className="inline-block rounded px-3 py-1 text-sm"
            style={{
              backgroundColor: script.server_color ?? "transparent",
              color: script.server_color
                ? getContrastColor(script.server_color)
                : "inherit",
            }}
          >
            {script.server_name ?? "-"}
          </span>
        </div>

        {/* Installation Date */}
        <div>
          <div className="text-muted-foreground mb-1 text-xs font-medium">
            Installation Date
          </div>
          <div className="text-muted-foreground text-sm">
            {formatDate(String(script.installation_date))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {isEditing ? (
          <>
            <Button
              onClick={onSave}
              disabled={isUpdating}
              variant="save"
              size="sm"
              className="min-w-0 flex-1"
            >
              {isUpdating ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={onCancel}
              variant="cancel"
              size="sm"
              className="min-w-0 flex-1"
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={onEdit}
              variant="edit"
              size="sm"
              className="min-w-0 flex-1"
            >
              Edit
            </Button>
            {hasActions(script) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-muted/20 hover:bg-muted/30 border-muted text-muted-foreground hover:text-foreground hover:border-muted-foreground min-w-0 flex-1 border transition-all duration-200 hover:scale-105 hover:shadow-md"
                  >
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card border-border w-48">
                  {script.container_id && !script.is_vm && (
                    <DropdownMenuItem
                      onClick={onUpdate}
                      disabled={containerStatus === "stopped"}
                      className="text-muted-foreground hover:text-foreground hover:bg-muted/20 focus:bg-muted/20"
                    >
                      Update
                    </DropdownMenuItem>
                  )}
                  {script.container_id &&
                    script.execution_mode === "ssh" &&
                    onBackup && (
                      <DropdownMenuItem
                        onClick={onBackup}
                        disabled={containerStatus === "stopped"}
                        className="text-muted-foreground hover:text-foreground hover:bg-muted/20 focus:bg-muted/20"
                      >
                        Backup
                      </DropdownMenuItem>
                    )}
                  {script.container_id &&
                    script.execution_mode === "ssh" &&
                    onClone && (
                      <DropdownMenuItem
                        onClick={onClone}
                        disabled={containerStatus === "stopped"}
                        className="text-muted-foreground hover:text-foreground hover:bg-muted/20 focus:bg-muted/20"
                      >
                        Clone
                      </DropdownMenuItem>
                    )}
                  {script.container_id && script.execution_mode === "ssh" && (
                    <DropdownMenuItem
                      onClick={onShell}
                      disabled={containerStatus === "stopped"}
                      className="text-muted-foreground hover:text-foreground hover:bg-muted/20 focus:bg-muted/20"
                    >
                      Shell
                    </DropdownMenuItem>
                  )}
                  {script.web_ui_ip && (
                    <DropdownMenuItem
                      onClick={onOpenWebUI}
                      disabled={containerStatus === "stopped"}
                      className="text-muted-foreground hover:text-foreground hover:bg-muted/20 focus:bg-muted/20"
                    >
                      Open UI
                    </DropdownMenuItem>
                  )}
                  {script.container_id && script.execution_mode === "ssh" && (
                    <>
                      <DropdownMenuSeparator className="bg-border" />
                      <DropdownMenuItem
                        onClick={() =>
                          onStartStop(
                            containerStatus === "running" ? "stop" : "start",
                          )
                        }
                        disabled={
                          isControlling || containerStatus === "unknown"
                        }
                        className={
                          containerStatus === "running"
                            ? "text-error hover:text-error-foreground hover:bg-error/20 focus:bg-error/20"
                            : "text-success hover:text-success-foreground hover:bg-success/20 focus:bg-success/20"
                        }
                      >
                        {isControlling
                          ? "Working..."
                          : containerStatus === "running"
                            ? "Stop"
                            : "Start"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={onDestroy}
                        disabled={isControlling}
                        className="text-error hover:text-error-foreground hover:bg-error/20 focus:bg-error/20"
                      >
                        {isControlling ? "Working..." : "Destroy"}
                      </DropdownMenuItem>
                    </>
                  )}
                  {(!script.container_id ||
                    script.execution_mode !== "ssh") && (
                    <>
                      <DropdownMenuSeparator className="bg-border" />
                      <DropdownMenuItem
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="text-muted-foreground hover:text-foreground hover:bg-muted/20 focus:bg-muted/20"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </>
        )}
      </div>
    </div>
  );
}
