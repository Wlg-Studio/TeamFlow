import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import BoardCanvas from "@/components/board/BoardCanvas"

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function BoardPage({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  const { id } = await params

  const board = await prisma.board.findUnique({
    where: { id },
    include: {
      organization: {
        include: {
          members: {
            where: {
              userId: session.user.id,
            },
          },
        },
      },
      lists: {
        include: {
          cards: {
            orderBy: {
              order: "asc",
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  })

  if (!board) {
    notFound()
  }

  // Check if user is a member of the organization
  if (board.organization.members.length === 0) {
    redirect("/dashboard")
  }

  return <BoardCanvas board={board} />
}
