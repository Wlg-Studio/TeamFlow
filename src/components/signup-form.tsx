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
import { Github, Sparkles, Home } from "lucide-react"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères")
      return
    }

    setLoading(true)

    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      })

      if (result.error) {
        setError(result.error.message || "Échec de l'inscription")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  const handleGithubSignup = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    })
  }

  const handleGoogleSignup = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 glass-card border-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-zinc-900 dark:text-zinc-100 hover:text-primary transition-colors mb-6"
            >
              <Home className="h-4 w-4" />
              Retour à l'accueil
            </Link>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-2xl gradient-brand shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold gradient-brand-text">
                  Créer votre compte
                </h1>
                <p className="text-zinc-900 dark:text-zinc-100 text-balance font-medium">
                  Rejoignez TeamFlow et gérez vos projets efficacement
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
                <FieldLabel htmlFor="name">Nom complet</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Jean Dupont"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
                <FieldDescription className="text-zinc-900 dark:text-zinc-100 font-medium">
                  Nous utiliserons cette adresse pour vous contacter. Votre email ne sera jamais partagé.
                </FieldDescription>
              </Field>

              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
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
                    <FieldLabel htmlFor="confirm-password">
                      Confirmer
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </Field>
                </Field>
                <FieldDescription className="text-zinc-900 dark:text-zinc-100 font-medium">
                  Doit contenir au moins 8 caractères.
                </FieldDescription>
              </Field>

              <Field>
                <Button type="submit" className="w-full gradient-brand" disabled={loading}>
                  {loading ? "Création du compte..." : "Créer un compte"}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Ou continuer avec
              </FieldSeparator>

              <Field className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGithubSignup}
                  disabled={loading}
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">S'inscrire avec GitHub</span>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={loading}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">S'inscrire avec Google</span>
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Vous avez déjà un compte ?{" "}
                <Link href="/login" className="font-semibold text-primary hover-primary">
                  Se connecter
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
                  Gérez vos projets en équipe avec une interface moderne et intuitive
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
