"use client";

import { useState, useRef, useEffect } from "react";

interface SimpleIframeProps {
  src: string;
  title: string;
}

export function SimpleIframeTest({ src, title }: SimpleIframeProps) {
  const [status, setStatus] = useState<string>('loading');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    console.log('SimpleIframeTest: Component mounted, src:', src);
    setStatus('loading');
    
    // Add native event listeners instead of React synthetic events
    const iframe = iframeRef.current;
    if (iframe) {
      const handleNativeLoad = () => {
        console.log('SimpleIframeTest: Native load event fired for:', src);
        setStatus('loaded');
      };
      
      const handleNativeError = () => {
        console.log('SimpleIframeTest: Native error event fired for:', src);
        setStatus('error');
      };
      
      // Add native event listeners
      iframe.addEventListener('load', handleNativeLoad);
      iframe.addEventListener('error', handleNativeError);
      
      // Cleanup
      return () => {
        iframe.removeEventListener('load', handleNativeLoad);
        iframe.removeEventListener('error', handleNativeError);
      };
    }
  }, [src]);

  const handleLoad = () => {
    console.log('SimpleIframeTest: Load event fired for:', src);
    setStatus('loaded');
  };

  const handleError = () => {
    console.log('SimpleIframeTest: Error event fired for:', src);
    setStatus('error');
  };

  console.log('SimpleIframeTest: Rendering with status:', status);

  return (
    <div style={{ width: '100%', height: '100%', border: '1px solid #ddd' }}>
      {status === 'loading' && (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          Loading {title}... (Status: {status})
        </div>
      )}
      {status === 'error' && (
        <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
          Failed to load {title}
        </div>
      )}
      {status === 'loaded' && (
        <div style={{ padding: '20px', textAlign: 'center', color: 'green' }}>
          ✅ {title} loaded successfully!
        </div>
      )}
      
      <iframe
        ref={(el) => {
          if (el && iframeRef.current !== el) {
            (iframeRef as any).current = el;
            console.log('SimpleIframeTest: Iframe element mounted via ref callback');
            
            // Add native event listeners immediately when element is available
            const handleNativeLoad = () => {
              console.log('SimpleIframeTest: Native load event (ref callback) fired for:', src);
              setStatus('loaded');
            };
            
            const handleNativeError = () => {
              console.log('SimpleIframeTest: Native error event (ref callback) fired for:', src);
              setStatus('error');
            };
            
            // Remove any existing listeners
            el.removeEventListener('load', handleNativeLoad);
            el.removeEventListener('error', handleNativeError);
            
            // Add native event listeners
            el.addEventListener('load', handleNativeLoad);
            el.addEventListener('error', handleNativeError);
            
            // Also try a timeout approach
            setTimeout(() => {
              if (status === 'loading') {
                console.log('SimpleIframeTest: Timeout check - iframe might be loaded');
                try {
                  // For same-origin, we can check readyState
                  if (el.contentDocument) {
                    console.log('SimpleIframeTest: Content document available - marking as loaded');
                    setStatus('loaded');
                  } else {
                    // For cross-origin, assume loaded if iframe exists
                    console.log('SimpleIframeTest: Cross-origin iframe - assuming loaded');
                    setStatus('loaded');
                  }
                } catch (e) {
                  console.log('SimpleIframeTest: Cross-origin iframe - assuming loaded');
                  setStatus('loaded');
                }
              }
            }, 2000);
          }
        }}
        src={src}
        title={title}
        style={{ 
          width: '100%', 
          height: '300px', 
          border: 'none',
          display: status === 'loaded' ? 'block' : 'none'
        }}
        onLoad={handleLoad}
        onError={handleError}
        onLoadStart={() => console.log('SimpleIframeTest: React LoadStart event')}
      />
    </div>
  );
}
