"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card } from "@prisma/client"
import { Calendar, CheckSquare, MessageSquare, Paperclip } from "lucide-react"

interface Props {
  card: Card
}

export default function CardComponent({ card }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group cursor-pointer rounded-lg bg-white p-3 shadow-sm hover:shadow-md dark:bg-zinc-800"
    >
      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
        {card.title}
      </div>

      {/* Card badges */}
      <div className="mt-2 flex flex-wrap gap-2">
        {card.dueDate && (
          <div className="flex items-center gap-1 rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
            <Calendar className="h-3 w-3" />
            {new Date(card.dueDate).toLocaleDateString()}
          </div>
        )}
        {card.description && (
          <div className="flex items-center gap-1 rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
            <MessageSquare className="h-3 w-3" />
          </div>
        )}
        {card.completed && (
          <div className="flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <CheckSquare className="h-3 w-3" />
            Terminé
          </div>
        )}
      </div>
    </div>
  )
}
