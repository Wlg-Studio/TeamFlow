"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import prisma from "@/lib/prisma"

export async function createCard(listId: string, title: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  // Get the last card order in this list
  const lastCard = await prisma.card.findFirst({
    where: { listId },
    orderBy: { order: "desc" },
  })

  const card = await prisma.card.create({
    data: {
      title,
      listId,
      order: lastCard ? lastCard.order + 1 : 0,
    },
    include: {
      list: true,
    },
  })

  revalidatePath(`/board/${card.list.boardId}`)
  return card
}

export async function updateCard(
  cardId: string,
  data: {
    title?: string
    description?: string
    dueDate?: Date | null
    completed?: boolean
  }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const card = await prisma.card.update({
    where: { id: cardId },
    data,
    include: {
      list: true,
    },
  })

  revalidatePath(`/board/${card.list.boardId}`)
  return card
}

export async function deleteCard(cardId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const card = await prisma.card.delete({
    where: { id: cardId },
    include: {
      list: true,
    },
  })

  revalidatePath(`/board/${card.list.boardId}`)
  return card
}

export async function moveCard(
  cardId: string,
  newListId: string,
  newOrder: number
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const card = await prisma.card.update({
    where: { id: cardId },
    data: {
      listId: newListId,
      order: newOrder,
    },
    include: {
      list: true,
    },
  })

  revalidatePath(`/board/${card.list.boardId}`)
  return card
}

export async function reorderCards(
  cards: { id: string; listId: string; order: number }[]
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  // Update all card positions
  await Promise.all(
    cards.map((card) =>
      prisma.card.update({
        where: { id: card.id },
        data: {
          listId: card.listId,
          order: card.order,
        },
      })
    )
  )

  // Get boardId for revalidation
  if (cards.length > 0) {
    const card = await prisma.card.findUnique({
      where: { id: cards[0].id },
      include: { list: true },
    })
    if (card) {
      revalidatePath(`/board/${card.list.boardId}`)
    }
  }
}
