import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Building2, Plus } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  const organizations = await prisma.organizationMember.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      organization: true,
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground mt-2">
            Bienvenue, {session.user.name || session.user.email}
          </p>
        </div>
        <Link href="/dashboard/create-organization">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle organisation
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Mes organisations</h2>
        {organizations.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">
              Aucune organisation
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Commencez par créer votre première organisation pour gérer vos projets
            </p>
            <Link href="/dashboard/create-organization">
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Créer une organisation
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {organizations.map(({ organization }) => (
              <Link
                key={organization.id}
                href={`/organization/${organization.slug}`}
                className="group block"
              >
                <div className="rounded-lg border bg-card p-6 transition-colors hover:bg-accent">
                  <div className="flex items-center gap-3">
                    {organization.image ? (
                      <img
                        src={organization.image}
                        alt={organization.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold group-hover:text-primary">
                        {organization.name}
                      </h3>
                      {organization.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {organization.description}
                        </p>
                      )}
                    </div>
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
