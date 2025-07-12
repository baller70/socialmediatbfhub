"use client";

import { SimpleIframeTest } from '@/components/simple-iframe-test';

export default function SimpleTest() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Simple Iframe Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Basic React Iframe Test</h2>
          <SimpleIframeTest
            src="http://example.com"
            title="Example.com"
          />
        </div>
      </div>
    </div>
  );
}
