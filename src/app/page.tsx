import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Zap, Users, TrendingUp } from "lucide-react"

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:from-zinc-950 dark:via-blue-950/20 dark:to-purple-950/20 dark:bg-gradient-to-br">
      {/* Animated Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 animate-pulse rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -right-40 top-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 animate-pulse rounded-full bg-indigo-500/10 blur-3xl" style={{ animationDelay: "2s" }} />
      </div>

      {/* Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20">
        {/* Hero Section */}
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-950/30 px-4 py-2 border border-indigo-100 dark:border-indigo-900">
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              Nouvelle génération de gestion de projet
            </span>
          </div>

          <h1 className="text-7xl font-black tracking-tight text-zinc-900 dark:text-white">
            Organisez votre
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              travail d'équipe
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-xl font-medium leading-relaxed text-zinc-600 dark:text-zinc-300">
            Une plateforme moderne et intuitive pour gérer vos projets,
            collaborer en temps réel et atteindre vos objectifs plus rapidement.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="group gradient-brand">
                Commencer gratuitement
                <Zap className="ml-2 h-4 w-4 transition-transform group-hover:rotate-12" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="group border-zinc-300 hover:border-indigo-500 hover:text-indigo-600">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid w-full max-w-6xl gap-6 md:grid-cols-3">
          <div className="group rounded-3xl p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-brand shadow-lg">
              <Users className="h-7 w-7 text-white" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-white">
              Collaboration
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Travaillez ensemble en temps réel avec votre équipe sur des espaces de travail partagés
            </p>
          </div>

          <div className="group rounded-3xl p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-brand shadow-lg">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-white">
              Interface moderne
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Design glassmorphique style iOS pour une expérience utilisateur exceptionnelle
            </p>
          </div>

          <div className="group rounded-3xl p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-brand shadow-lg">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-white">
              Productivité
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Boards Kanban avec drag & drop, listes personnalisables et cartes intelligentes
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Propulsé par Next.js, Prisma & Better Auth
        </div>
      </div>
    </div>
  )
}
