
"use client";

import { App, LayoutMode } from "@/lib/types";
import { AppIframe } from "./app-iframe";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

interface DashboardContentProps {
  selectedApps: App[];
  layout: LayoutMode;
}

export function DashboardContent({ selectedApps, layout }: DashboardContentProps) {
  if (selectedApps.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <Globe className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
            No Apps Selected
          </h2>
          <p className="text-muted-foreground">
            Select an app from the sidebar to get started
          </p>
        </div>
      </div>
    );
  }

  const getLayoutClasses = () => {
    switch (layout) {
      case "single":
        return "layout-single";
      case "split-h":
        return "layout-split-h";
      case "split-v":
        return "layout-split-v";
      case "grid-3":
        return "layout-grid-3";
      case "grid-4":
        return "layout-grid-4";
      default:
        return "layout-single";
    }
  };

  const getMaxApps = () => {
    switch (layout) {
      case "single":
        return 1;
      case "split-h":
      case "split-v":
        return 2;
      case "grid-3":
        return 3;
      case "grid-4":
        return 4;
      default:
        return 1;
    }
  };

  const appsToShow = selectedApps.slice(0, getMaxApps());

  return (
    <div className="flex-1 p-4 bg-muted/20">
      <div className={cn("h-full", getLayoutClasses())}>
        {appsToShow.map((app, index) => (
          <AppIframe key={`${app.id}-${index}`} app={app} />
        ))}
      </div>
    </div>
  );
}
