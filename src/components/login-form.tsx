"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { ShineAnimation } from "@/components/ui/shine-animation"
import { Github, LogIn, Home } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      })

      if (result.error) {
        setError(result.error.message || "Échec de la connexion")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  const handleGithubLogin = async () => {
    console.log("GitHub login clicked")
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      })
    } catch (error) {
      console.error("GitHub login error:", error)
    }
  }

  const handleGoogleLogin = async () => {
    console.log("Google login clicked")
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      })
    } catch (error) {
      console.error("Google login error:", error)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 glass-card border-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 backdrop-blur-xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-white hover:text-zinc-900 hover:bg-white border border-transparent hover:border-zinc-200 transition-all mb-6 px-3 py-1.5 rounded-md"
            >
              <Home className="h-4 w-4" />
              Retour à l'accueil
            </Link>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-2xl gradient-brand shadow-lg relative overflow-hidden group">
                  <ShineAnimation />
                  <LogIn className="h-6 w-6 text-white relative z-10" />
                </div>
                <h1 className="text-2xl font-bold gradient-brand-text">
                  Bon retour !
                </h1>
                <p className="text-white/90 text-balance font-medium">
                  Connectez-vous à votre compte TeamFlow
                </p>
              </div>

              {error && (
                <FieldError>
                  <div className="rounded-2xl bg-gradient-to-br from-red-50 to-red-100 p-4 text-sm font-medium text-red-700 dark:from-red-900/20 dark:to-red-800/20 dark:text-red-400">
                    {error}
                  </div>
                </FieldError>
              )}

              <Field>
                <FieldLabel htmlFor="email" className="text-white">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-white">Mot de passe</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm text-white/80 hover:text-primary hover:underline underline-offset-2 transition-colors"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </Field>

              <Field>
                <Button type="submit" className="w-full gradient-brand relative overflow-hidden group cursor-pointer" disabled={loading}>
                  <ShineAnimation />
                  <span className="relative z-10">{loading ? "Connexion..." : "Se connecter"}</span>
                </Button>
              </Field>

              <div className="flex items-center gap-4 py-4">
                <div className="flex-1 border-t border-zinc-700"></div>
                <span className="text-white/80 text-sm">Ou continuer avec</span>
                <div className="flex-1 border-t border-zinc-700"></div>
              </div>

              <Field className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGithubLogin}
                  disabled={loading}
                  className="cursor-pointer"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">Se connecter avec GitHub</span>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="cursor-pointer"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Se connecter avec Google</span>
                </Button>
              </Field>

              <FieldDescription className="text-center text-white/90">
                Vous n'avez pas de compte ?{" "}
                <Link href="/signup" className="font-semibold text-primary hover-primary">
                  S'inscrire
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-zinc-50 dark:bg-zinc-900 relative hidden md:block overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -left-20 -top-20 h-64 w-64 animate-pulse rounded-full bg-indigo-500/10 blur-3xl" />
              <div className="absolute -right-20 top-1/3 h-64 w-64 animate-pulse rounded-full bg-purple-500/10 blur-3xl" style={{ animationDelay: "1s" }} />
              <div className="absolute bottom-0 left-1/3 h-64 w-64 animate-pulse rounded-full bg-indigo-500/10 blur-3xl" style={{ animationDelay: "2s" }} />
            </div>
            <div className="relative z-10 flex h-full items-center justify-center p-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Bienvenue sur TeamFlow
                </h2>
                <p className="text-zinc-800 dark:text-zinc-200 text-lg font-semibold">
                  Gérez vos projets en équipe avec efficacité
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        En continuant, vous acceptez nos{" "}
        <a href="#" className="font-semibold text-primary hover-primary">
          Conditions d'utilisation
        </a>{" "}
        et notre{" "}
        <a href="#" className="font-semibold text-primary hover-primary">
          Politique de confidentialité
        </a>
        .
      </FieldDescription>
    </div>
  )
}
