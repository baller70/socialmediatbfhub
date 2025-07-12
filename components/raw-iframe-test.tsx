"use client";

import { useState, useEffect } from "react";

interface RawIframeProps {
  src: string;
  title: string;
}

export function RawIframeTest({ src, title }: RawIframeProps) {
  const [status, setStatus] = useState<string>('loading');
  
  useEffect(() => {
    console.log('RawIframeTest: Component mounted, src:', src);
    setStatus('loading');
    
    // Set a simple timeout to mark as loaded after 3 seconds
    const timeout = setTimeout(() => {
      console.log('RawIframeTest: Timeout reached, marking as loaded');
      setStatus('loaded');
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [src]);

  console.log('RawIframeTest: Rendering with status:', status);

  const iframeHtml = `
    <iframe 
      src="${src}" 
      title="${title}"
      style="width: 100%; height: 300px; border: 1px solid #ccc;"
      onload="console.log('Raw iframe loaded: ${src}')"
      onerror="console.log('Raw iframe error: ${src}')"
    ></iframe>
  `;

  return (
    <div style={{ width: '100%', height: '100%', border: '1px solid #ddd', padding: '20px' }}>
      <div style={{ marginBottom: '10px' }}>
        Status: {status} | Title: {title}
      </div>
      
      {status === 'loading' && (
        <div style={{ color: 'blue', marginBottom: '10px' }}>
          ⏳ Loading {title}... (using raw HTML)
        </div>
      )}
      
      {status === 'loaded' && (
        <div style={{ color: 'green', marginBottom: '10px' }}>
          ✅ {title} should be loaded now!
        </div>
      )}
      
      <div dangerouslySetInnerHTML={{ __html: iframeHtml }} />
    </div>
  );
}
