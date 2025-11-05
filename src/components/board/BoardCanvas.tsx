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
    <div className="flex min-h-screen flex-col relative bg-zinc-50">
      {/* Pattern de lignes courtes aléatoires */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
        <defs>
          <pattern id="randomLines" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            {/* Lignes courtes de différentes tailles et orientations */}
            <line x1="20" y1="30" x2="45" y2="30" stroke="#d1d5db" strokeWidth="1.5" />
            <line x1="70" y1="25" x2="85" y2="35" stroke="#d1d5db" strokeWidth="1" />
            <line x1="120" y1="40" x2="155" y2="40" stroke="#d1d5db" strokeWidth="2" />
            <line x1="160" y1="20" x2="175" y2="32" stroke="#d1d5db" strokeWidth="1" />

            <line x1="35" y1="80" x2="60" y2="85" stroke="#d1d5db" strokeWidth="1.5" />
            <line x1="90" y1="70" x2="110" y2="70" stroke="#d1d5db" strokeWidth="1" />
            <line x1="140" y1="90" x2="165" y2="82" stroke="#d1d5db" strokeWidth="1.5" />
            <line x1="180" y1="75" x2="195" y2="75" stroke="#d1d5db" strokeWidth="1" />

            <line x1="15" y1="120" x2="38" y2="128" stroke="#d1d5db" strokeWidth="1" />
            <line x1="55" y1="130" x2="80" y2="130" stroke="#d1d5db" strokeWidth="2" />
            <line x1="105" y1="115" x2="125" y2="122" stroke="#d1d5db" strokeWidth="1" />
            <line x1="145" y1="135" x2="175" y2="135" stroke="#d1d5db" strokeWidth="1.5" />

            <line x1="25" y1="165" x2="42" y2="172" stroke="#d1d5db" strokeWidth="1.5" />
            <line x1="68" y1="170" x2="88" y2="165" stroke="#d1d5db" strokeWidth="1" />
            <line x1="115" y1="180" x2="145" y2="180" stroke="#d1d5db" strokeWidth="1" />
            <line x1="165" y1="175" x2="185" y2="182" stroke="#d1d5db" strokeWidth="2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#randomLines)" />
      </svg>

      {/* Overlay très léger pour adoucir */}
      <div className="absolute inset-0 bg-white/40" style={{ zIndex: 0 }} />

      {/* Header */}
      <div className="relative border-b border-white/20 bg-black/10 px-4 py-3 backdrop-blur-sm" style={{ zIndex: 1 }}>
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
      <div className="relative flex-1 overflow-x-auto p-4" style={{ zIndex: 1 }}>
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
