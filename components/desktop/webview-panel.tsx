
"use client";

import { useEffect, useRef, useState } from "react";
import { X, RotateCcw, ExternalLink, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Panel {
  id: string;
  url: string;
  title?: string;
  isActive?: boolean;
}

interface WebViewPanelProps {
  panel: Panel;
  onClose?: (panelId: string) => void;
  onNavigate?: (panelId: string, url: string) => void;
  className?: string;
}

export function WebViewPanel({ panel, onClose, onNavigate, className = "" }: WebViewPanelProps) {
  const webviewRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(panel.url);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    // Set up webview event listeners
    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    const handleLoadStop = () => {
      setIsLoading(false);
      setCanGoBack(webview.canGoBack());
      setCanGoForward(webview.canGoForward());
      setCurrentUrl(webview.getURL());
    };

    const handleLoadError = (event: any) => {
      setIsLoading(false);
      setError(`Failed to load: ${event.errorDescription}`);
      console.error('WebView load error:', event);
    };

    const handleNavigate = (event: any) => {
      setCurrentUrl(event.url);
      onNavigate?.(panel.id, event.url);
    };

    // Add event listeners
    webview.addEventListener('did-start-loading', handleLoadStart);
    webview.addEventListener('did-stop-loading', handleLoadStop);
    webview.addEventListener('did-fail-load', handleLoadError);
    webview.addEventListener('will-navigate', handleNavigate);
    webview.addEventListener('did-navigate', handleNavigate);

    // Set webview properties
    webview.src = panel.url;
    webview.partition = `persist:dashboard-${panel.id}`;
    webview.allowpopups = true;

    return () => {
      // Cleanup event listeners
      webview.removeEventListener('did-start-loading', handleLoadStart);
      webview.removeEventListener('did-stop-loading', handleLoadStop);
      webview.removeEventListener('did-fail-load', handleLoadError);
      webview.removeEventListener('will-navigate', handleNavigate);
      webview.removeEventListener('did-navigate', handleNavigate);
    };
  }, [panel.id, panel.url, onNavigate]);

  const handleReload = () => {
    const webview = webviewRef.current;
    if (webview) {
      webview.reload();
    }
  };

  const handleGoBack = () => {
    const webview = webviewRef.current;
    if (webview && webview.canGoBack()) {
      webview.goBack();
    }
  };

  const handleGoForward = () => {
    const webview = webviewRef.current;
    if (webview && webview.canGoForward()) {
      webview.goForward();
    }
  };

  const handleOpenExternal = () => {
    if (typeof window !== 'undefined' && (window as any).require) {
      const { shell } = (window as any).require('electron');
      shell.openExternal(currentUrl);
    } else {
      window.open(currentUrl, '_blank');
    }
  };

  const isElectron = typeof window !== 'undefined' && (window as any).require;

  if (!isElectron) {
    // Fallback to iframe for web version
    return (
      <div className={`relative h-full bg-background border rounded-lg overflow-hidden ${className}`}>
        {/* Panel Controls */}
        <div className="flex items-center justify-between p-2 bg-muted/50 border-b">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium truncate max-w-[200px]">
              {panel.title || new URL(panel.url).hostname}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Button size="sm" variant="ghost" onClick={handleReload}>
              <RotateCcw className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleOpenExternal}>
              <ExternalLink className="w-3 h-3" />
            </Button>
            {onClose && (
              <Button size="sm" variant="ghost" onClick={() => onClose(panel.id)}>
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="relative h-[calc(100%-60px)]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            </div>
          )}
          
          {error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-4">
                <h3 className="font-medium mb-2">Unable to load content</h3>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={handleReload}>Try Again</Button>
              </div>
            </div>
          ) : (
            <iframe
              src={panel.url}
              className="w-full h-full border-none"
              title={panel.title || panel.url}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-full bg-background border rounded-lg overflow-hidden ${className}`}>
      {/* Panel Controls */}
      <div className="flex items-center justify-between p-2 bg-muted/50 border-b">
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleGoBack}
            disabled={!canGoBack}
          >
            <ArrowLeft className="w-3 h-3" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleGoForward}
            disabled={!canGoForward}
          >
            <ArrowRight className="w-3 h-3" />
          </Button>
          <span className="text-sm font-medium truncate max-w-[200px]">
            {panel.title || new URL(currentUrl).hostname}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Button size="sm" variant="ghost" onClick={handleReload}>
            <RotateCcw className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={handleOpenExternal}>
            <ExternalLink className="w-3 h-3" />
          </Button>
          {onClose && (
            <Button size="sm" variant="ghost" onClick={() => onClose(panel.id)}>
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="relative h-[calc(100%-60px)]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        )}
        
        {error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <h3 className="font-medium mb-2">Unable to load content</h3>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleReload}>Try Again</Button>
            </div>
          </div>
        ) : (
          <webview
            ref={webviewRef}
            className="w-full h-full"
            style={{ display: isLoading ? 'none' : 'block' }}
          />
        )}
      </div>
    </div>
  );
}
