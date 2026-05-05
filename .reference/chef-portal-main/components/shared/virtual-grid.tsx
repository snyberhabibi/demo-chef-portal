"use client";

import * as React from "react";
import { VirtuosoGrid, GridComponents } from "react-virtuoso";
import { cn } from "@/lib/utils";

interface VirtualGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  columns?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  className?: string;
  itemHeight?: number;
  gap?: number;
}

const GridContainer: GridComponents["List"] = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ style, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(var(--columns), 1fr)",
        gap: "var(--gap)",
        ...style,
      }}
    >
      {children}
    </div>
  );
});
GridContainer.displayName = "GridContainer";

const GridItem: GridComponents["Item"] = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
});
GridItem.displayName = "GridItem";

export function VirtualGrid<T>({
  items,
  renderItem,
  columns = { default: 1, sm: 2, md: 3, lg: 4, xl: 5 },
  className,
  itemHeight = 400,
  gap = 16,
}: VirtualGridProps<T>) {
  const [columnCount, setColumnCount] = React.useState(columns.default);

  React.useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= 1280 && columns.xl) {
        setColumnCount(columns.xl);
      } else if (width >= 1024 && columns.lg) {
        setColumnCount(columns.lg);
      } else if (width >= 768 && columns.md) {
        setColumnCount(columns.md);
      } else if (width >= 640 && columns.sm) {
        setColumnCount(columns.sm);
      } else {
        setColumnCount(columns.default);
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, [columns]);

  const totalHeight = Math.ceil(items.length / columnCount) * (itemHeight + gap);

  return (
    <div
      className={cn("w-full", className)}
      style={
        {
          "--columns": columnCount,
          "--gap": `${gap}px`,
        } as React.CSSProperties
      }
    >
      <VirtuosoGrid
        totalCount={items.length}
        components={{
          List: GridContainer,
          Item: GridItem,
        }}
        itemContent={(index) => renderItem(items[index], index)}
        style={{ height: Math.min(totalHeight, 800), width: "100%" }}
      />
    </div>
  );
}

