
"use client";

import { useState, useEffect } from "react";

interface SmartIframeProps {
  src: string;
  title: string;
  embedMethod?: 'direct' | 'proxy';
  fallbackUrl?: string;
  proxyAvailable?: boolean;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function SmartIframe({ 
  src, 
  title, 
  embedMethod = 'proxy',
  fallbackUrl,
  proxyAvailable = true,
  className = '',
  onLoad,
  onError
}: SmartIframeProps) {
  const [loadState, setLoadState] = useState<'loading' | 'loaded' | 'error'>('loaded');
  const [currentSrc, setCurrentSrc] = useState('');
  const [attemptedMethods, setAttemptedMethods] = useState<string[]>([]);

  useEffect(() => {
    console.log('SmartIframe: Setting up for', src);
    
    // Use proxy by default for better embedding success
    if (embedMethod === 'proxy' && proxyAvailable) {
      const proxySrc = `/api/proxy?url=${encodeURIComponent(src)}`;
      console.log('SmartIframe: Using proxy method', proxySrc);
      setCurrentSrc(proxySrc);
      setAttemptedMethods(['proxy']);
    } else {
      console.log('SmartIframe: Using direct method', src);
      setCurrentSrc(src);
      setAttemptedMethods(['direct']);
    }
    
    setLoadState('loaded');
    onLoad?.();
  }, [src, embedMethod, proxyAvailable, onLoad]);

  const tryProxy = () => {
    const proxySrc = `/api/proxy?url=${encodeURIComponent(src)}`;
    setCurrentSrc(proxySrc);
    setAttemptedMethods([...attemptedMethods, 'proxy']);
  };

  const tryDirect = () => {
    setCurrentSrc(src);
    setAttemptedMethods([...attemptedMethods, 'direct']);
  };

  const openInNewTab = () => {
    window.open(fallbackUrl || src, '_blank', 'noopener,noreferrer');
  };

  if (loadState === 'loading') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading {title}...</p>
        </div>
      </div>
    );
  }

  if (loadState === 'error') {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-4">
          <h3 className="font-medium mb-2">Unable to embed {title}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Failed to load the website content.
          </p>
          <div className="space-x-2">
            {!attemptedMethods.includes('proxy') && (
              <button 
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/90"
                onClick={tryProxy}
              >
                Try Proxy Method
              </button>
            )}
            {!attemptedMethods.includes('direct') && (
              <button 
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/90"
                onClick={tryDirect}
              >
                Try Direct Method
              </button>
            )}
            <button 
              className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90"
              onClick={openInNewTab}
            >
              Open in New Tab
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Simple iframe rendering using the proxy approach
  console.log('SmartIframe: Rendering iframe with src:', currentSrc);

  return (
    <div className={`iframe-container ${className}`} style={{ width: '100%', height: '100%' }}>
      <iframe 
        src={currentSrc} 
        title={title}
        style={{ width: '100%', height: '100%', border: 'none' }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
        onLoad={() => {
          console.log('ProxyIframe: Loaded successfully:', currentSrc);
          onLoad?.();
        }}
        onError={() => {
          console.log('ProxyIframe: Error loading:', currentSrc);
          setLoadState('error');
          onError?.();
        }}
      />
    </div>
  );
}
