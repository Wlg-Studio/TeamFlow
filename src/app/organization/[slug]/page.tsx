import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft } from "lucide-react"

interface Props {
  params: Promise<{
    slug: string
  }>
}

export default async function OrganizationPage({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  const { slug } = await params

  const organization = await prisma.organization.findUnique({
    where: { slug },
    include: {
      members: {
        where: {
          userId: session.user.id,
        },
      },
      boards: {
        include: {
          lists: {
            select: {
              id: true,
            },
          },
          _count: {
            select: {
              lists: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      },
    },
  })

  if (!organization) {
    notFound()
  }

  // Check if user is a member
  if (organization.members.length === 0) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Link>

        <div className="mb-8 mt-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {organization.name}
            </h1>
            {organization.description && (
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {organization.description}
              </p>
            )}
          </div>
          <Link href={`/organization/${slug}/create-board`}>
            <Button>
              <Plus className="h-4 w-4" />
              Créer un board
            </Button>
          </Link>
        </div>

        {organization.boards.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-200 p-12 text-center dark:border-zinc-800">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Aucun board pour le moment
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Commencez par créer votre premier board
            </p>
            <Link href={`/organization/${slug}/create-board`}>
              <Button className="mt-4">
                <Plus className="h-4 w-4" />
                Créer un board
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {organization.boards.map((board) => (
              <Link
                key={board.id}
                href={`/board/${board.id}`}
                className="group aspect-video rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-4 shadow-sm transition-all hover:shadow-md"
                style={
                  board.imageThumbUrl
                    ? {
                        backgroundImage: `url(${board.imageThumbUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
              >
                <div className="flex h-full flex-col justify-between">
                  <h3 className="text-lg font-semibold text-white drop-shadow-md">
                    {board.title}
                  </h3>
                  <div className="text-xs text-white/80 drop-shadow">
                    {board._count.lists} {board._count.lists > 1 ? 'listes' : 'liste'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
