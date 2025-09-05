'use client';

import { useEffect, useState } from 'react';

export function MatrixBackground() {
  const [nodes, setNodes] = useState<Array<{ x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    const generateNodes = () => {
      const nodeCount = 20;
      const newNodes = [];
      for (let i = 0; i < nodeCount; i++) {
        newNodes.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 4,
        });
      }
      setNodes(newNodes);
    };

    generateNodes();
    const interval = setInterval(generateNodes, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="matrix-grid" aria-hidden="true">
        {nodes.map((node, index) => (
          <div
            key={index}
            className="matrix-node"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              animationDelay: `${node.delay}s`,
            }}
          />
        ))}
      </div>
      <div className="scanline" aria-hidden="true" />
    </>
  );
}