
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardContent } from "./dashboard-content";
import { DashboardHeader } from "./dashboard-header";
import { App, LayoutMode } from "@/lib/types";
import { toast } from "sonner";

export function DashboardLayout() {
  const { data: session } = useSession();
  const [apps, setApps] = useState<App[]>([]);
  const [selectedApps, setSelectedApps] = useState<App[]>([]);
  const [layout, setLayout] = useState<LayoutMode>("single");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const response = await fetch("/api/apps");
      if (response.ok) {
        const data = await response.json();
        setApps(data);
        // Set first app as selected by default
        if (data.length > 0) {
          setSelectedApps([data[0]]);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch apps");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppSelect = (app: App) => {
    if (layout === "single") {
      setSelectedApps([app]);
    } else {
      const maxApps = layout === "split-h" || layout === "split-v" ? 2 : 
                    layout === "grid-3" ? 3 : 4;
      
      if (selectedApps.find(a => a.id === app.id)) {
        setSelectedApps(selectedApps.filter(a => a.id !== app.id));
      } else if (selectedApps.length < maxApps) {
        setSelectedApps([...selectedApps, app]);
      } else {
        setSelectedApps([...selectedApps.slice(1), app]);
      }
    }
  };

  const handleLayoutChange = (newLayout: LayoutMode) => {
    setLayout(newLayout);
    const maxApps = newLayout === "single" ? 1 :
                   newLayout === "split-h" || newLayout === "split-v" ? 2 :
                   newLayout === "grid-3" ? 3 : 4;
    
    if (selectedApps.length > maxApps) {
      setSelectedApps(selectedApps.slice(0, maxApps));
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background">
      <DashboardSidebar
        apps={apps}
        selectedApps={selectedApps}
        onAppSelect={handleAppSelect}
        onAppsChange={setApps}
      />
      <div className="flex-1 flex flex-col">
        <DashboardHeader
          layout={layout}
          onLayoutChange={handleLayoutChange}
          selectedApps={selectedApps}
        />
        <DashboardContent
          selectedApps={selectedApps}
          layout={layout}
        />
      </div>
    </div>
  );
}
