"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import prisma from "@/lib/prisma"

export async function createList(boardId: string, title: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  // Get the last list order
  const lastList = await prisma.list.findFirst({
    where: { boardId },
    orderBy: { order: "desc" },
  })

  const list = await prisma.list.create({
    data: {
      title,
      boardId,
      order: lastList ? lastList.order + 1 : 0,
    },
  })

  revalidatePath(`/board/${boardId}`)
  return list
}

export async function updateList(listId: string, title: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const list = await prisma.list.update({
    where: { id: listId },
    data: { title },
  })

  revalidatePath(`/board/${list.boardId}`)
  return list
}

export async function deleteList(listId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const list = await prisma.list.delete({
    where: { id: listId },
  })

  revalidatePath(`/board/${list.boardId}`)
  return list
}

export async function reorderLists(
  boardId: string,
  lists: { id: string; order: number }[]
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  // Update all list orders
  await Promise.all(
    lists.map((list) =>
      prisma.list.update({
        where: { id: list.id },
        data: { order: list.order },
      })
    )
  )

  revalidatePath(`/board/${boardId}`)
}
