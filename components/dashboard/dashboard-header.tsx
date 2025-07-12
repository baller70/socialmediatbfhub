
"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { App, LayoutMode } from "@/lib/types";
import {
  Layout,
  LayoutGrid,
  Maximize2,
  RefreshCw,
  Grid3X3,
  Columns2,
  Rows2,
} from "lucide-react";

interface DashboardHeaderProps {
  layout: LayoutMode;
  onLayoutChange: (layout: LayoutMode) => void;
  selectedApps: App[];
}

export function DashboardHeader({
  layout,
  onLayoutChange,
  selectedApps,
}: DashboardHeaderProps) {
  const getLayoutIcon = (layoutType: LayoutMode) => {
    switch (layoutType) {
      case "single":
        return <Maximize2 className="w-4 h-4" />;
      case "split-h":
        return <Columns2 className="w-4 h-4" />;
      case "split-v":
        return <Rows2 className="w-4 h-4" />;
      case "grid-3":
        return <Grid3X3 className="w-4 h-4" />;
      case "grid-4":
        return <LayoutGrid className="w-4 h-4" />;
      default:
        return <Layout className="w-4 h-4" />;
    }
  };

  const layoutOptions = [
    { value: "single", label: "Single View", icon: <Maximize2 className="w-4 h-4" /> },
    { value: "split-h", label: "Split Horizontal", icon: <Columns2 className="w-4 h-4" /> },
    { value: "split-v", label: "Split Vertical", icon: <Rows2 className="w-4 h-4" /> },
    { value: "grid-3", label: "3-App Grid", icon: <Grid3X3 className="w-4 h-4" /> },
    { value: "grid-4", label: "4-App Grid", icon: <LayoutGrid className="w-4 h-4" /> },
  ];

  return (
    <div className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {getLayoutIcon(layout)}
            <span className="text-sm font-medium">
              {selectedApps.length > 0 
                ? `${selectedApps.length} app${selectedApps.length > 1 ? 's' : ''} active`
                : 'No apps selected'
              }
            </span>
          </div>
          
          {selectedApps.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>•</span>
              <span>{selectedApps.map(app => app.name).join(', ')}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Select value={layout} onValueChange={onLayoutChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {layoutOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center space-x-2">
                    {option.icon}
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh All
          </Button>
        </div>
      </div>
    </div>
  );
}
