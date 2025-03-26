import React, { useState, useEffect, useRef } from 'react';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  windowHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

function VirtualList<T>({ items, itemHeight, windowHeight, renderItem }: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleItemCount = Math.ceil(windowHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleItemCount + 1, items.length);

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ height: `${windowHeight}px`, overflow: 'auto', position: 'relative' }}
    >
      <div style={{ height: `${items.length * itemHeight}px`, position: 'relative' }}>
        {items.slice(startIndex, endIndex).map((item, index) => (
          <div
            key={startIndex + index}
            style={{
              position: 'absolute',
              top: `${(startIndex + index) * itemHeight}px`,
              width: '100%',
              height: `${itemHeight}px`,
            }}
          >
            {renderItem(item, startIndex + index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VirtualList;
