"use client"

import * as React from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"
import { DragHandleIcon } from "@shopify/polaris-icons"

/**
 * Polaris Sortable List
 * Smooth drag-to-reorder using @dnd-kit
 * - Touch friendly
 * - Keyboard accessible
 * - Smooth transform animations
 */

interface SortableItem {
  id: string
  content: React.ReactNode
}

interface SortableListProps extends React.ComponentProps<"div"> {
  items: SortableItem[]
  onReorder: (items: SortableItem[]) => void
}

function SortableList({
  items,
  onReorder,
  className,
  ...props
}: SortableListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id)
      const newIndex = items.findIndex((i) => i.id === over.id)
      onReorder(arrayMove(items, oldIndex, newIndex))
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div
          data-slot="sortable-list"
          className={cn("space-y-[var(--p-space-200)]", className)}
          {...props}
        >
          {items.map((item) => (
            <SortableRow key={item.id} item={item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

function SortableRow({ item }: { item: SortableItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-[var(--p-space-200)]",
        "px-[var(--p-space-300)] py-[var(--p-space-300)]",
        "rounded-[var(--p-border-radius-200)]",
        "bg-[var(--p-color-bg-surface)]",
        "border border-[var(--p-color-border-secondary)]",
        "transition-shadow duration-150",
        isDragging && "shadow-[var(--p-shadow-400)] z-10 relative border-[var(--p-color-border-emphasis)]",
      )}
    >
      <button
        className="shrink-0 cursor-grab active:cursor-grabbing touch-manipulation rounded-[var(--p-border-radius-100)] p-[var(--p-space-050)] hover:bg-[var(--p-color-bg-fill-transparent-hover)]"
        {...attributes}
        {...listeners}
      >
        <DragHandleIcon className="size-4 fill-[var(--p-color-icon-secondary)]" />
      </button>
      <div className="flex-1 min-w-0">
        {item.content}
      </div>
    </div>
  )
}

export { SortableList }
export type { SortableItem }
