// components/debug/ZIndexDebugger.tsx
"use client"
import React, { useEffect, useState } from 'react';

interface DebugOverlay {
  element: Element;
  zIndex: number;
  position: string;
  bounds: DOMRect;
}

const ZIndexDebugger: React.FC = () => {
  const [overlays, setOverlays] = useState<DebugOverlay[]>([]);
  const [clickedElement, setClickedElement] = useState<Element | null>(null);
  const [isDebugging, setIsDebugging] = useState(true);

  useEffect(() => {
    if (!isDebugging) return;

    // Function to get computed z-index
    const getZIndex = (element: Element): number => {
      const computed = window.getComputedStyle(element);
      return parseInt(computed.zIndex) || 0;
    };

    // Function to get position
    const getPosition = (element: Element): string => {
      return window.getComputedStyle(element).position;
    };

    // Function to find all elements with stacking contexts
    const findStackingContexts = () => {
      const elements = document.querySelectorAll('*');
      const stackingContexts: DebugOverlay[] = [];

      elements.forEach((element) => {
        const computed = window.getComputedStyle(element);
        const hasStackingContext =
          computed.position !== 'static' ||
          computed.zIndex !== 'auto' ||
          computed.transform !== 'none' ||
          computed.opacity !== '1' ||
          computed.filter !== 'none' ||
          computed.isolation === 'isolate';

        if (hasStackingContext) {
          stackingContexts.push({
            element,
            zIndex: getZIndex(element),
            position: getPosition(element),
            bounds: element.getBoundingClientRect()
          });
        }
      });

      setOverlays(stackingContexts);
    };

    // Click handler
    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element) {
        setClickedElement(element);
        console.log('Clicked element:', element);
        console.log('Computed style:', window.getComputedStyle(element));
        console.log('Parents:', getParentStack(element));
      }
    };

    // Get parent stack
    const getParentStack = (element: Element | null): string[] => {
      const stack: string[] = [];
      let current = element;
      while (current && current !== document.body) {
        const computed = window.getComputedStyle(current);
        stack.push(`${current.tagName.toLowerCase()} - z-index: ${computed.zIndex}, position: ${computed.position}`);
        current = current.parentElement;
      }
      return stack;
    };

    document.addEventListener('click', handleClick);
    findStackingContexts();

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [isDebugging]);

  if (!isDebugging) return null;

  return (
    <>
      {overlays.map((overlay, index) => (
        <div
          key={index}
          style={{
            position: 'fixed',
            left: overlay.bounds.left + window.scrollX,
            top: overlay.bounds.top + window.scrollY,
            width: overlay.bounds.width,
            height: overlay.bounds.height,
            border: '2px solid red',
            backgroundColor: `rgba(255, 0, 0, 0.1)`,
            pointerEvents: 'none',
            zIndex: 99999
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: 'black',
            color: 'white',
            fontSize: '10px',
            padding: '2px'
          }}>
            z-index: {overlay.zIndex}, pos: {overlay.position}
          </div>
        </div>
      ))}
      {clickedElement && (
        <div style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: 'black',
          color: 'white',
          padding: '10px',
          zIndex: 100000,
          maxWidth: '300px',
          overflow: 'auto'
        }}>
          <h3>Clicked Element Stack:</h3>
          <pre style={{ fontSize: '10px' }}>
            {JSON.stringify(getComputedStyle(clickedElement), null, 2)}
          </pre>
        </div>
      )}
    </>
  );
};

export default ZIndexDebugger;