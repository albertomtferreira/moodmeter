// components/debug/ClickDebugger.tsx
"use client"
import React, { useEffect, useState } from 'react';

interface ClickInfo {
  tagName: string;
  className: string;
  zIndex: string;
  position: string;
  coordinates: { x: number; y: number };
}

const ClickDebugger: React.FC = () => {
  const [clicks, setClicks] = useState<ClickInfo[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      const element = document.elementFromPoint(e.clientX, e.clientY);

      if (element) {
        const computedStyle = window.getComputedStyle(element);
        const clickInfo: ClickInfo = {
          tagName: element.tagName.toLowerCase(),
          className: (element as HTMLElement).className || 'no-class',
          zIndex: computedStyle.zIndex,
          position: computedStyle.position,
          coordinates: { x: e.clientX, y: e.clientY }
        };

        setClicks(prev => [...prev.slice(-4), clickInfo]); // Keep only last 5 clicks

        // Log parent hierarchy
        let current = element;
        let hierarchy = [];
        while (current && current !== document.body) {
          const style = window.getComputedStyle(current);
          hierarchy.push({
            tag: current.tagName.toLowerCase(),
            zIndex: style.zIndex,
            position: style.position
          });
          current = current.parentElement!;
        }

        console.log('Click hierarchy:', hierarchy);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        maxWidth: '300px',
        zIndex: 999999
      }}
    >
      <h3 style={{ margin: '0 0 5px 0' }}>Last 5 Clicks:</h3>
      {clicks.map((click, i) => (
        <div key={i} style={{ marginBottom: '5px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '5px' }}>
          <div>Element: {click.tagName}</div>
          <div>Class: {click.className.slice(0, 30)}...</div>
          <div>Z-Index: {click.zIndex}</div>
          <div>Position: {click.position}</div>
        </div>
      ))}
    </div>
  );
};

export default ClickDebugger;