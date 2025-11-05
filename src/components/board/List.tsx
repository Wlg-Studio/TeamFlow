"use client"

import { useState, useTransition } from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { List, Card as CardType } from "@prisma/client"
import CardComponent from "./Card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, MoreHorizontal, Trash } from "lucide-react"
import { createCard } from "@/actions/cards"
import { deleteList } from "@/actions/lists"

interface Props {
  list: List & { cards: CardType[] }
  boardId: string
}

export default function ListComponent({ list, boardId }: Props) {
  const [newCardTitle, setNewCardTitle] = useState("")
  const [showNewCard, setShowNewCard] = useState(false)
  const [isPending, startTransition] = useTransition()

  const { setNodeRef } = useDroppable({
    id: list.id,
  })

  const handleCreateCard = async () => {
    if (!newCardTitle.trim()) return

    startTransition(async () => {
      await createCard(list.id, newCardTitle)
      setNewCardTitle("")
      setShowNewCard(false)
    })
  }

  const handleDeleteList = async () => {
    if (!confirm(`Supprimer la liste « ${list.title} » ? Toutes les cartes de cette liste seront supprimées.`)) {
      return
    }

    startTransition(async () => {
      await deleteList(list.id)
    })
  }

  return (
    <div
      ref={setNodeRef}
      className="w-72 flex-shrink-0 rounded-lg bg-zinc-100 p-3 dark:bg-zinc-900"
    >
      {/* List Header */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
          {list.title}
        </h3>
        <button
          onClick={handleDeleteList}
          className="rounded p-1 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>

      {/* Cards */}
      <div className="space-y-2">
        <SortableContext
          items={list.cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {list.cards.map((card) => (
            <CardComponent key={card.id} card={card} />
          ))}
        </SortableContext>

        {/* Add new card */}
        {showNewCard ? (
          <div className="space-y-2">
            <Input
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Entrer le titre de la carte..."
              className="bg-white dark:bg-zinc-800"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateCard()
                if (e.key === "Escape") {
                  setShowNewCard(false)
                  setNewCardTitle("")
                }
              }}
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCreateCard}
                disabled={isPending || !newCardTitle.trim()}
                size="sm"
              >
                Ajouter une carte
              </Button>
              <Button
                onClick={() => {
                  setShowNewCard(false)
                  setNewCardTitle("")
                }}
                variant="ghost"
                size="sm"
              >
                Annuler
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setShowNewCard(true)}
            variant="ghost"
            className="w-full justify-start text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Ajouter une carte
          </Button>
        )}
      </div>
    </div>
  )
}
