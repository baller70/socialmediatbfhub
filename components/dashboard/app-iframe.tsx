
"use client";

import { useState, useRef, useEffect } from "react";
import { App } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Home,
  ExternalLink,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SmartIframe } from "@/components/smart-iframe";

interface AppIframeProps {
  app: App;
}

export function AppIframe({ app }: AppIframeProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [app.url]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleBack = () => {
    if (iframeRef.current) {
      try {
        iframeRef.current.contentWindow?.history.back();
      } catch (error) {
        // Handle cross-origin restrictions
        console.warn("Cannot navigate: cross-origin restrictions");
      }
    }
  };

  const handleForward = () => {
    if (iframeRef.current) {
      try {
        iframeRef.current.contentWindow?.history.forward();
      } catch (error) {
        // Handle cross-origin restrictions
        console.warn("Cannot navigate: cross-origin restrictions");
      }
    }
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
      setIsLoading(true);
      setHasError(false);
    }
  };

  const handleHome = () => {
    if (iframeRef.current) {
      iframeRef.current.src = app.url;
      setIsLoading(true);
      setHasError(false);
    }
  };

  const openInNewTab = () => {
    window.open(app.url, "_blank", "noopener,noreferrer");
  };

  if (hasError) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-sm flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
              {app.icon ? (
                <span className="text-sm">{app.icon}</span>
              ) : (
                <AlertCircle className="w-3 h-3" />
              )}
            </div>
            <span className="text-sm font-medium truncate">{app.name}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={openInNewTab}>
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        {/* Error Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Cannot load this app</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This website cannot be embedded due to security restrictions.
            </p>
            <div className="space-x-2">
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={openInNewTab} size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm flex flex-col h-full">
      {/* Header with Navigation Controls */}
      <div className="flex items-center justify-between p-2 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
            {app.icon ? (
              <span className="text-sm">{app.icon}</span>
            ) : (
              <div className="w-2 h-2 bg-primary rounded-full" />
            )}
          </div>
          <span className="text-sm font-medium truncate max-w-[150px]">{app.name}</span>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            disabled={!canGoBack}
            className="h-7 w-7 p-0"
          >
            <ArrowLeft className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleForward}
            disabled={!canGoForward}
            className="h-7 w-7 p-0"
          >
            <ArrowRight className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="h-7 w-7 p-0"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHome}
            className="h-7 w-7 p-0"
          >
            <Home className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={openInNewTab}
            className="h-7 w-7 p-0"
          >
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Iframe Content */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading {app.name}...</span>
            </div>
          </div>
        )}
        
        <SmartIframe
          src={app.url}
          title={app.name}
          embedMethod="direct"
          fallbackUrl={app.url}
          proxyAvailable={true}
          className="dashboard-iframe"
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
    </div>
  );
}
