# Architecture du Projet TeamFlow

## 📋 Stack Technique

| Catégorie | Technologies |
|-----------|-------------|
| **Framework** | Next.js 15 avec App Router et Turbopack |
| **Langage** | TypeScript |
| **Base de données** | PostgreSQL (Neon) avec Prisma ORM |
| **Authentification** | Better Auth avec support multi-organisations |
| **Styling** | TailwindCSS v4 + Shadcn/ui + Glassmorphisme |
| **Paiements** | Stripe |
| **Emails** | React Email avec Resend |
| **Upload** | UploadThing |
| **Tests** | Vitest (unit) + Playwright (e2e) |
| **Drag & Drop** | @dnd-kit |

## 📁 Structure du Projet

```
TeamFlow/
├── app/                      # Routes Next.js
│   ├── (layout)/            # 🌐 Pages publiques
│   │   └── page.tsx         # Landing page
│   ├── (logged-in)/         # 🔐 Pages protégées (auth requise)
│   │   └── dashboard/       # Dashboard utilisateur
│   ├── orgs/[orgSlug]/      # 🏢 Pages spécifiques aux organisations
│   │   ├── page.tsx         # Vue organisation
│   │   └── boards/          # Boards de l'organisation
│   ├── auth/                # 🔑 Flux d'authentification
│   │   ├── login/
│   │   └── signup/
│   └── api/                 # 🔌 Routes API
│       ├── auth/            # Better Auth
│       ├── boards/
│       ├── organizations/
│       └── uploadthing/
│
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── ui/             # Composants Shadcn/ui
│   │   ├── nowts/          # Composants custom
│   │   └── fastquote/      # Composants métier
│   ├── features/           # Modules par fonctionnalité
│   │   ├── auth/
│   │   ├── organizations/
│   │   ├── boards/
│   │   └── billing/
│   ├── lib/                # Utilitaires et configurations
│   │   ├── auth.ts
│   │   ├── prisma.ts
│   │   ├── stripe.ts
│   │   └── utils.ts
│   └── generated/prisma/   # Client Prisma généré
│
├── prisma/
│   ├── schema/             # Schéma de base de données
│   │   └── schema.prisma
│   └── migrations/         # Migrations
│
├── emails/                 # Templates d'emails React
│   ├── welcome.tsx
│   └── invitation.tsx
│
├── e2e/                    # Tests end-to-end Playwright
├── scripts/                # Scripts utilitaires
└── public/                 # Assets statiques
```

## 🎯 Principes d'Architecture

### 1. Séparation des Préoccupations
- **app/**: Routing et pages
- **src/features/**: Logique métier par domaine
- **src/components/**: UI réutilisable
- **src/lib/**: Utilitaires et configurations

### 2. Feature-First
Chaque fonctionnalité majeure est isolée dans `src/features/`:
```
features/
├── auth/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── organizations/
│   ├── components/
│   ├── hooks/
│   └── api/
└── boards/
    ├── components/
    ├── hooks/
    └── types/
```

### 3. Layouts Groupés
- `(layout)/`: Pages sans authentification
- `(logged-in)/`: Pages nécessitant une session active
- `orgs/[orgSlug]/`: Pages spécifiques aux organisations

## 🔐 Modèle d'Authentification

### Multi-tenant avec Organisations
```typescript
User ──< OrganizationMember >── Organization
                │
                └─> Role (OWNER, ADMIN, MEMBER, GUEST)
```

### Flux d'Auth
1. Inscription/Connexion (Better Auth)
2. Vérification email (optionnel)
3. Sélection ou création d'organisation
4. Accès au dashboard

## 💳 Modèle de Facturation

### Plans
- **Free**: 3 boards, 10 membres
- **Pro**: Boards illimités, 50 membres, €10/mois
- **Enterprise**: Custom

### Stripe Integration
```typescript
Organization ──< Subscription >── StripeCustomer
```

## 📧 Système d'Emails

### Templates React Email
- `welcome.tsx`: Bienvenue nouvel utilisateur
- `invitation.tsx`: Invitation organisation
- `reset-password.tsx`: Réinitialisation mot de passe

### Envoi avec Resend
```typescript
import { resend } from '@/lib/resend'
import WelcomeEmail from '@/emails/welcome'

await resend.emails.send({
  from: 'noreply@teamflow.app',
  to: user.email,
  subject: 'Bienvenue !',
  react: WelcomeEmail({ userName: user.name }),
})
```

## 🧪 Testing

### Tests Unitaires (Vitest)
```bash
pnpm test           # Run tests
pnpm test:ui        # UI interactive
```

### Tests E2E (Playwright)
```bash
pnpm test:e2e       # Run E2E tests
pnpm test:e2e:ui    # UI interactive
```

## 📦 Commandes Principales

```bash
# Développement
pnpm dev              # Démarrer le serveur dev
pnpm build            # Build production
pnpm start            # Démarrer en production

# Base de données
pnpm db:generate      # Générer Prisma Client
pnpm db:push          # Push schema sans migration
pnpm db:migrate       # Créer et appliquer migration
pnpm db:studio        # Interface graphique Prisma

# Tests
pnpm lint             # Linter + auto-fix
pnpm test             # Tests unitaires
pnpm test:e2e         # Tests end-to-end

# Emails
pnpm email:dev        # Prévisualiser emails (port 3001)
```

## 🎨 Design System

### Glassmorphisme iOS-style
- Effets de verre liquide avec `backdrop-filter`
- Transparence et saturation
- Ombres colorées douces
- Animations fluides

### Couleurs
```css
--primary: #007aff     /* Bleu iOS */
--secondary: #5856d6   /* Violet */
--success: #34c759     /* Vert */
--warning: #ff9500     /* Orange */
--danger: #ff3b30      /* Rouge */
```

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
vercel --prod
```

### Variables d'Environnement
```env
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
UPLOADTHING_TOKEN=
```

## 📈 Roadmap

### Phase 1: Core ✅
- [x] Auth multi-tenant
- [x] Boards Kanban
- [x] Design glassmorphique
- [x] Base de données

### Phase 2: Advanced 🚧
- [ ] Facturation Stripe
- [ ] Emails transactionnels
- [ ] Tests complets
- [ ] Webhooks

### Phase 3: Scale 📋
- [ ] WebSockets temps réel
- [ ] Analytics
- [ ] API publique
- [ ] Mobile app
