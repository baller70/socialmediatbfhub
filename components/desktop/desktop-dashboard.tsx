
"use client";

import { useState, useEffect } from "react";
import { Panel, GridLayout } from "@/lib/types";
import { DesktopSidebar } from "./desktop-sidebar";
import { PanelGrid } from "./panel-grid";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  Maximize2, 
  Minimize2, 
  RotateCcw,
  Download,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DesktopDashboardProps {
  className?: string;
}

export function DesktopDashboard({ className = "" }: DesktopDashboardProps) {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [selectedPanelId, setSelectedPanelId] = useState<string | undefined>();
  const [gridLayout, setGridLayout] = useState<GridLayout>('2x2');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Load saved panels from localStorage on mount
  useEffect(() => {
    const savedPanels = localStorage.getItem('desktop-panels');
    if (savedPanels) {
      try {
        const parsed = JSON.parse(savedPanels);
        setPanels(parsed);
        if (parsed.length > 0) {
          setSelectedPanelId(parsed[0].id);
        }
      } catch (error) {
        console.error('Error loading saved panels:', error);
      }
    }
  }, []);

  // Save panels to localStorage whenever panels change
  useEffect(() => {
    localStorage.setItem('desktop-panels', JSON.stringify(panels));
  }, [panels]);

  const handlePanelAdd = (panelData: Omit<Panel, 'id'>) => {
    const newPanel: Panel = {
      ...panelData,
      id: Date.now().toString(),
    };
    
    setPanels(prev => [...prev, newPanel]);
    setSelectedPanelId(newPanel.id);
  };

  const handlePanelRemove = (panelId: string) => {
    setPanels(prev => prev.filter(p => p.id !== panelId));
    
    // Update selected panel if the removed panel was selected
    if (selectedPanelId === panelId) {
      const remainingPanels = panels.filter(p => p.id !== panelId);
      setSelectedPanelId(remainingPanels.length > 0 ? remainingPanels[0].id : undefined);
    }
  };

  const handlePanelReorder = (reorderedPanels: Panel[]) => {
    setPanels(reorderedPanels);
  };

  const handlePanelUpdate = (panelId: string, updates: Partial<Panel>) => {
    setPanels(prev => prev.map(panel => 
      panel.id === panelId ? { ...panel, ...updates } : panel
    ));
  };

  const handlePanelSelect = (panelId: string) => {
    setSelectedPanelId(panelId);
  };

  const handleResetPanels = () => {
    setPanels([]);
    setSelectedPanelId(undefined);
    localStorage.removeItem('desktop-panels');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const isElectron = typeof window !== 'undefined' && (window as any).require;

  return (
    <div className={cn("h-screen flex flex-col bg-background", className)}>
      {/* Top Bar */}
      <div className="flex items-center justify-between p-2 bg-muted/30 border-b">
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          <span className="text-sm font-medium">Multi-App Social Dashboard</span>
          {isElectron && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              Desktop Mode
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <span className="text-xs text-muted-foreground mr-2">
            {panels.length} panels • {gridLayout.replace('x', '×')} grid
          </span>
          
          <Button size="sm" variant="ghost" onClick={handleResetPanels}>
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          <Button size="sm" variant="ghost">
            <Settings className="w-4 h-4" />
          </Button>
          
          <Button size="sm" variant="ghost">
            <HelpCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {!sidebarCollapsed && (
          <DesktopSidebar
            panels={panels}
            onPanelAdd={handlePanelAdd}
            onPanelRemove={handlePanelRemove}
            onPanelReorder={handlePanelReorder}
            onPanelSelect={handlePanelSelect}
            selectedPanelId={selectedPanelId}
          />
        )}

        {/* Panel Grid */}
        <div className="flex-1">
          <PanelGrid
            panels={panels}
            onPanelAdd={() => {
              // Trigger add panel dialog through sidebar
              setSidebarCollapsed(false);
            }}
            onPanelRemove={handlePanelRemove}
            onPanelUpdate={handlePanelUpdate}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-muted/20 border-t text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>
            {isElectron ? 'Desktop Application' : 'Web Version'} • 
            Persistent Sessions {isElectron ? 'Enabled' : 'Limited'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span>Ready</span>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
