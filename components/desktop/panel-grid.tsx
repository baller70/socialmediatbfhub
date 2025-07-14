
"use client";

import { useState, useEffect } from "react";
import { WebViewPanel } from "./webview-panel";
import { cn } from "@/lib/utils";
import { Plus, Grid3X3, Grid2X2, Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Panel {
  id: string;
  url: string;
  title?: string;
  isActive?: boolean;
}

interface PanelGridProps {
  panels: Panel[];
  onPanelAdd?: () => void;
  onPanelRemove?: (panelId: string) => void;
  onPanelUpdate?: (panelId: string, updates: Partial<Panel>) => void;
  className?: string;
}

type GridLayout = '1x1' | '2x1' | '2x2' | '3x2' | '3x3';

export function PanelGrid({ 
  panels, 
  onPanelAdd, 
  onPanelRemove, 
  onPanelUpdate,
  className = "" 
}: PanelGridProps) {
  const [layout, setLayout] = useState<GridLayout>('2x2');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Determine optimal layout based on panel count
  useEffect(() => {
    const count = panels.length;
    if (count <= 1) setLayout('1x1');
    else if (count <= 2) setLayout('2x1');
    else if (count <= 4) setLayout('2x2');
    else if (count <= 6) setLayout('3x2');
    else setLayout('3x3');
  }, [panels.length]);

  const getGridClasses = () => {
    switch (layout) {
      case '1x1':
        return 'grid-cols-1 grid-rows-1';
      case '2x1':
        return 'grid-cols-2 grid-rows-1';
      case '2x2':
        return 'grid-cols-2 grid-rows-2';
      case '3x2':
        return 'grid-cols-3 grid-rows-2';
      case '3x3':
        return 'grid-cols-3 grid-rows-3';
      default:
        return 'grid-cols-2 grid-rows-2';
    }
  };

  const getMaxPanels = () => {
    switch (layout) {
      case '1x1': return 1;
      case '2x1': return 2;
      case '2x2': return 4;
      case '3x2': return 6;
      case '3x3': return 9;
      default: return 4;
    }
  };

  const visiblePanels = panels.slice(0, getMaxPanels());
  const emptySlots = Math.max(0, getMaxPanels() - panels.length);

  const handlePanelClose = (panelId: string) => {
    onPanelRemove?.(panelId);
  };

  const handlePanelNavigate = (panelId: string, url: string) => {
    onPanelUpdate?.(panelId, { url });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (panels.length === 0) {
    return (
      <div className={cn("h-full flex items-center justify-center bg-muted/20", className)}>
        <div className="text-center">
          <Grid3X3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
            No Panels Open
          </h2>
          <p className="text-muted-foreground mb-4">
            Add your first panel to get started
          </p>
          <Button onClick={onPanelAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Panel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("h-full flex flex-col bg-muted/20", className)}>
      {/* Grid Controls */}
      <div className="flex items-center justify-between p-4 bg-background border-b">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">
            Layout: {layout.replace('x', '×')}
          </span>
          <span className="text-xs text-muted-foreground">
            ({panels.length} panels)
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setLayout('2x1')}
            className={layout === '2x1' ? 'bg-primary text-primary-foreground' : ''}
          >
            <Grid2X2 className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setLayout('2x2')}
            className={layout === '2x2' ? 'bg-primary text-primary-foreground' : ''}
          >
            <Grid3X3 className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setLayout('3x3')}
            className={layout === '3x3' ? 'bg-primary text-primary-foreground' : ''}
          >
            <Grid3X3 className="w-3 h-3" />
          </Button>
          
          <div className="w-px h-4 bg-border" />
          
          <Button size="sm" variant="outline" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize className="w-3 h-3" /> : <Maximize className="w-3 h-3" />}
          </Button>
          
          <Button size="sm" onClick={onPanelAdd}>
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Panel Grid */}
      <div className={cn(
        "flex-1 p-4 grid gap-4",
        getGridClasses(),
        isFullscreen && "fixed inset-0 z-50 bg-background p-2"
      )}>
        {visiblePanels.map((panel) => (
          <WebViewPanel
            key={panel.id}
            panel={panel}
            onClose={handlePanelClose}
            onNavigate={handlePanelNavigate}
            className="min-h-0"
          />
        ))}
        
        {/* Empty slots */}
        {Array.from({ length: emptySlots }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer"
            onClick={onPanelAdd}
          >
            <div className="text-center">
              <Plus className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">Add Panel</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
