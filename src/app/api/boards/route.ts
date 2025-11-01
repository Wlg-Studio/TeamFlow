import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, organizationSlug } = body

    if (!title || !organizationSlug) {
      return NextResponse.json(
        { error: "Title and organization are required" },
        { status: 400 }
      )
    }

    // Get organization and verify membership
    const organization = await prisma.organization.findUnique({
      where: { slug: organizationSlug },
      include: {
        members: {
          where: {
            userId: session.user.id,
          },
        },
      },
    })

    if (!organization || organization.members.length === 0) {
      return NextResponse.json(
        { error: "Organization not found or you are not a member" },
        { status: 404 }
      )
    }

    const board = await prisma.board.create({
      data: {
        title,
        description,
        organizationId: organization.id,
        createdById: session.user.id,
      },
    })

    // Create default lists
    await prisma.list.createMany({
      data: [
        {
          title: "To Do",
          order: 0,
          boardId: board.id,
        },
        {
          title: "In Progress",
          order: 1,
          boardId: board.id,
        },
        {
          title: "Done",
          order: 2,
          boardId: board.id,
        },
      ],
    })

    return NextResponse.json(board)
  } catch (error) {
    console.error("Error creating board:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
