"use client"

import { useState, useTransition } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove, SortableContext } from "@dnd-kit/sortable"
import { List as ListType, Card as CardType, Board } from "@prisma/client"
import ListComponent from "./List"
import CardComponent from "./Card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { createList } from "@/actions/lists"
import { reorderCards } from "@/actions/cards"

type BoardWithLists = Board & {
  lists: (ListType & {
    cards: CardType[]
  })[]
  organization: {
    slug: string
  }
}

interface Props {
  board: BoardWithLists
}

export default function BoardCanvas({ board: initialBoard }: Props) {
  const [board, setBoard] = useState(initialBoard)
  const [activeCard, setActiveCard] = useState<CardType | null>(null)
  const [newListTitle, setNewListTitle] = useState("")
  const [showNewList, setShowNewList] = useState(false)
  const [isPending, startTransition] = useTransition()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const card = board.lists
      .flatMap((list) => list.cards)
      .find((card) => card.id === active.id)

    if (card) {
      setActiveCard(card)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find the active card
    const activeList = board.lists.find((list) =>
      list.cards.some((card) => card.id === activeId)
    )
    if (!activeList) return

    // Find the over target
    const overList =
      board.lists.find((list) => list.id === overId) ||
      board.lists.find((list) => list.cards.some((card) => card.id === overId))

    if (!overList) return

    if (activeList.id === overList.id) {
      // Reordering within the same list
      const oldIndex = activeList.cards.findIndex((card) => card.id === activeId)
      const newIndex = activeList.cards.findIndex((card) => card.id === overId)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newCards = arrayMove(activeList.cards, oldIndex, newIndex)
        const newLists = board.lists.map((list) =>
          list.id === activeList.id ? { ...list, cards: newCards } : list
        )
        setBoard({ ...board, lists: newLists })
      }
    } else {
      // Moving to a different list
      const activeCards = activeList.cards.filter((card) => card.id !== activeId)
      const activeCard = activeList.cards.find((card) => card.id === activeId)!

      let newOverCards = [...overList.cards]
      const overIndex = overList.cards.findIndex((card) => card.id === overId)

      if (overIndex !== -1) {
        newOverCards.splice(overIndex, 0, activeCard)
      } else {
        newOverCards.push(activeCard)
      }

      const newLists = board.lists.map((list) => {
        if (list.id === activeList.id) {
          return { ...list, cards: activeCards }
        }
        if (list.id === overList.id) {
          return { ...list, cards: newOverCards }
        }
        return list
      })

      setBoard({ ...board, lists: newLists })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveCard(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Save the new order to the database
    const updatedCards: { id: string; listId: string; order: number }[] = []

    board.lists.forEach((list) => {
      list.cards.forEach((card, index) => {
        updatedCards.push({
          id: card.id,
          listId: list.id,
          order: index,
        })
      })
    })

    startTransition(async () => {
      await reorderCards(updatedCards)
    })
  }

  const handleCreateList = async () => {
    if (!newListTitle.trim()) return

    startTransition(async () => {
      const newList = await createList(board.id, newListTitle)
      setBoard({
        ...board,
        lists: [...board.lists, { ...newList, cards: [] }],
      })
      setNewListTitle("")
      setShowNewList(false)
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-500 to-purple-600">
      {/* Header */}
      <div className="border-b border-white/20 bg-black/10 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link
            href={`/organization/${board.organization.slug}`}
            className="text-white/80 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-white">{board.title}</h1>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto p-4">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4">
            <SortableContext items={board.lists.map((list) => list.id)}>
              {board.lists.map((list) => (
                <ListComponent key={list.id} list={list} boardId={board.id} />
              ))}
            </SortableContext>

            {/* Add new list */}
            <div className="w-72 flex-shrink-0">
              {showNewList ? (
                <div className="rounded-lg bg-black/20 p-3 backdrop-blur-sm">
                  <Input
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    placeholder="Entrer le titre de la liste..."
                    className="mb-2 bg-white"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateList()
                      if (e.key === "Escape") {
                        setShowNewList(false)
                        setNewListTitle("")
                      }
                    }}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCreateList}
                      disabled={isPending || !newListTitle.trim()}
                      size="sm"
                    >
                      Ajouter une liste
                    </Button>
                    <Button
                      onClick={() => {
                        setShowNewList(false)
                        setNewListTitle("")
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setShowNewList(true)}
                  variant="ghost"
                  className="w-full justify-start bg-white/20 text-white hover:bg-white/30"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter une liste
                </Button>
              )}
            </div>
          </div>

          <DragOverlay>
            {activeCard ? <CardComponent card={activeCard} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}
