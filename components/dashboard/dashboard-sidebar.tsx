
"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { App } from "@/lib/types";
import {
  Plus,
  Settings,
  BarChart3,
  LogOut,
  Globe,
  Star,
  MoreVertical,
  Edit,
  Trash2,
  User,
} from "lucide-react";
import { AddAppDialog } from "./add-app-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface DashboardSidebarProps {
  apps: App[];
  selectedApps: App[];
  onAppSelect: (app: App) => void;
  onAppsChange: (apps: App[]) => void;
}

export function DashboardSidebar({
  apps,
  selectedApps,
  onAppSelect,
  onAppsChange,
}: DashboardSidebarProps) {
  const { data: session } = useSession();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/signin" });
  };

  const handleDeleteApp = async (appId: string) => {
    try {
      const response = await fetch(`/api/apps/${appId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onAppsChange(apps.filter(app => app.id !== appId));
        toast.success("App deleted successfully");
      } else {
        toast.error("Failed to delete app");
      }
    } catch (error) {
      toast.error("Failed to delete app");
    }
  };

  const toggleFavorite = async (app: App) => {
    try {
      const response = await fetch(`/api/apps/${app.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...app, isFavorite: !app.isFavorite }),
      });

      if (response.ok) {
        const updatedApp = await response.json();
        onAppsChange(apps.map(a => a.id === app.id ? updatedApp : a));
      }
    } catch (error) {
      toast.error("Failed to update favorite");
    }
  };

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Multi-App Hub</p>
          </div>
        </div>
        
        <Button
          onClick={() => setShowAddDialog(true)}
          className="w-full"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add App
        </Button>
      </div>

      {/* Apps List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-2 space-y-1">
          {apps.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No apps added yet</p>
              <p className="text-xs">Click "Add App" to get started</p>
            </div>
          ) : (
            apps.map((app) => (
              <div
                key={app.id}
                className={cn(
                  "group relative flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-colors",
                  selectedApps.some(a => a.id === app.id)
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted text-muted-foreground"
                )}
                onClick={() => onAppSelect(app)}
              >
                <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
                  {app.icon ? (
                    <span className="text-lg">{app.icon}</span>
                  ) : (
                    <Globe className="w-4 h-4" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{app.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {app.category || "General"}
                  </p>
                </div>

                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(app);
                    }}
                  >
                    <Star
                      className={cn(
                        "w-3 h-3",
                        app.isFavorite ? "fill-yellow-400 text-yellow-400" : ""
                      )}
                    />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteApp(app.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <div className="flex items-center space-x-3 p-2 rounded-md bg-muted/50">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{session?.user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
          </div>
        </div>
        
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" className="flex-1">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <AddAppDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAppAdded={(newApp) => {
          onAppsChange([...apps, newApp]);
          setShowAddDialog(false);
        }}
      />
    </div>
  );
}
