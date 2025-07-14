
"use client";

import { useEffect, useState } from "react";
import { DesktopDashboard } from "./desktop/desktop-dashboard";
import { DashboardLayout } from "./dashboard/dashboard-layout";
import { Button } from "./ui/button";
import { Monitor, Globe, ArrowRight } from "lucide-react";

export function ModeDetector() {
  const [isElectron, setIsElectron] = useState(false);
  const [showModeChoice, setShowModeChoice] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'web' | 'desktop' | null>(null);

  useEffect(() => {
    // Check if we're running in Electron
    const electronCheck = typeof window !== 'undefined' && (window as any).require;
    setIsElectron(!!electronCheck);
    
    // Check for saved mode preference
    const savedMode = localStorage.getItem('dashboard-mode');
    if (savedMode && (savedMode === 'web' || savedMode === 'desktop')) {
      setSelectedMode(savedMode);
    } else if (electronCheck) {
      // Default to desktop mode if in Electron
      setSelectedMode('desktop');
    } else {
      // Show choice if no preference set
      setShowModeChoice(true);
    }
  }, []);

  const handleModeSelect = (mode: 'web' | 'desktop') => {
    setSelectedMode(mode);
    localStorage.setItem('dashboard-mode', mode);
    setShowModeChoice(false);
  };

  if (showModeChoice) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <h1 className="text-2xl font-bold mb-2">Choose Your Experience</h1>
            <p className="text-muted-foreground mb-8">
              Select how you'd like to use the Multi-App Social Dashboard
            </p>
            
            <div className="space-y-4">
              <Button
                onClick={() => handleModeSelect('desktop')}
                className="w-full h-20 flex-col space-y-2"
                variant="outline"
                disabled={!isElectron}
              >
                <Monitor className="w-8 h-8" />
                <div>
                  <div className="font-medium">Desktop Mode</div>
                  <div className="text-xs text-muted-foreground">
                    WebViews with persistent sessions
                  </div>
                </div>
                {isElectron && <ArrowRight className="w-4 h-4 ml-auto" />}
              </Button>
              
              <Button
                onClick={() => handleModeSelect('web')}
                className="w-full h-20 flex-col space-y-2"
                variant="outline"
              >
                <Globe className="w-8 h-8" />
                <div>
                  <div className="font-medium">Web Mode</div>
                  <div className="text-xs text-muted-foreground">
                    Traditional iframe-based panels
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
            </div>
            
            {!isElectron && (
              <p className="text-xs text-amber-600 mt-4">
                Note: Desktop mode is only available in the Electron app
              </p>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowModeChoice(false)}
              className="mt-4"
            >
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render based on selected mode
  if (selectedMode === 'desktop' && isElectron) {
    return <DesktopDashboard />;
  }

  // Default to web dashboard layout
  return <DashboardLayout />;
}
