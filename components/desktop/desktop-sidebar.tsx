
"use client";

import { useState } from "react";
import { Panel } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Globe, 
  Trash2, 
  GripVertical, 
  ExternalLink,
  Monitor,
  Smartphone,
  Tablet,
  Star,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DesktopSidebarProps {
  panels: Panel[];
  onPanelAdd: (panel: Omit<Panel, 'id'>) => void;
  onPanelRemove: (panelId: string) => void;
  onPanelReorder: (panels: Panel[]) => void;
  onPanelSelect: (panelId: string) => void;
  selectedPanelId?: string;
  className?: string;
}

const POPULAR_SITES = [
  { name: "Gmail", url: "https://gmail.com", icon: "📧", category: "Email" },
  { name: "Slack", url: "https://slack.com", icon: "💬", category: "Communication" },
  { name: "Discord", url: "https://discord.com", icon: "🎮", category: "Communication" },
  { name: "Twitter", url: "https://pngpix.com/images/hd/twitter-logo-blue-bird-silhouette-22t1ybfdsp3dtabj.jpg", icon: "🐦", category: "Social" },
  { name: "LinkedIn", url: "https://linkedin.com", icon: "💼", category: "Professional" },
  { name: "GitHub", url: "https://github.com", icon: "🐙", category: "Development" },
  { name: "YouTube", url: "https://youtube.com", icon: "📺", category: "Entertainment" },
  { name: "Spotify", url: "https://spotify.com", icon: "🎵", category: "Music" },
  { name: "Notion", url: "https://notion.so", icon: "📝", category: "Productivity" },
  { name: "Figma", url: "https://figma.com", icon: "🎨", category: "Design" },
];

export function DesktopSidebar({
  panels,
  onPanelAdd,
  onPanelRemove,
  onPanelReorder,
  onPanelSelect,
  selectedPanelId,
  className = ""
}: DesktopSidebarProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPanelUrl, setNewPanelUrl] = useState("");
  const [newPanelTitle, setNewPanelTitle] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleAddPanel = () => {
    if (!newPanelUrl.trim()) return;

    let url = newPanelUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const title = newPanelTitle.trim() || new URL(url).hostname;

    onPanelAdd({
      url,
      title,
      isActive: true,
      position: panels.length,
    });

    setNewPanelUrl("");
    setNewPanelTitle("");
    setIsAddDialogOpen(false);
  };

  const handleQuickAdd = (site: typeof POPULAR_SITES[0]) => {
    onPanelAdd({
      url: site.url,
      title: site.name,
      isActive: true,
      position: panels.length,
      category: site.category,
      icon: site.icon,
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newPanels = [...panels];
    const draggedPanel = newPanels[draggedIndex];
    newPanels.splice(draggedIndex, 1);
    newPanels.splice(dropIndex, 0, draggedPanel);

    onPanelReorder(newPanels.map((panel, index) => ({ ...panel, position: index })));
    setDraggedIndex(null);
  };

  return (
    <div className={cn("w-80 bg-background border-r flex flex-col", className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold flex items-center">
            <Monitor className="w-4 h-4 mr-2" />
            Desktop Panels
          </h2>
          <span className="text-xs text-muted-foreground">
            {panels.length} active
          </span>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Panel
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Panel</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Website URL</label>
                <Input
                  placeholder="https://example.com"
                  value={newPanelUrl}
                  onChange={(e) => setNewPanelUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddPanel()}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Panel Title (optional)</label>
                <Input
                  placeholder="Custom panel name"
                  value={newPanelTitle}
                  onChange={(e) => setNewPanelTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddPanel()}
                />
              </div>
              <Button onClick={handleAddPanel} className="w-full">
                Add Panel
              </Button>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium mb-3">Quick Add Popular Sites</h4>
                <div className="grid grid-cols-2 gap-2">
                  {POPULAR_SITES.slice(0, 6).map((site) => (
                    <Button
                      key={site.name}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAdd(site)}
                      className="justify-start"
                    >
                      <span className="mr-2">{site.icon}</span>
                      {site.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Panel List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {panels.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No panels added yet</p>
              <p className="text-xs">Click "Add Panel" to get started</p>
            </div>
          ) : (
            panels.map((panel, index) => (
              <div
                key={panel.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={cn(
                  "group flex items-center p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50",
                  selectedPanelId === panel.id && "bg-primary/10 border-primary/20",
                  draggedIndex === index && "opacity-50"
                )}
                onClick={() => onPanelSelect(panel.id)}
              >
                <GripVertical className="w-4 h-4 text-muted-foreground mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{panel.icon || "🌐"}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">
                        {panel.title || new URL(panel.url).hostname}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {new URL(panel.url).hostname}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (typeof window !== 'undefined' && (window as any).require) {
                        const { shell } = (window as any).require('electron');
                        shell.openExternal(panel.url);
                      } else {
                        window.open(panel.url, '_blank');
                      }
                    }}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPanelRemove(panel.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t bg-muted/20">
        <div className="flex items-center text-xs text-muted-foreground">
          <Smartphone className="w-3 h-3 mr-1" />
          <span>Desktop Mode</span>
          <Separator orientation="vertical" className="mx-2 h-3" />
          <Clock className="w-3 h-3 mr-1" />
          <span>Persistent Sessions</span>
        </div>
      </div>
    </div>
  );
}
