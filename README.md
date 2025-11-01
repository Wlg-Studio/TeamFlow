# TeamFlow - Advanced Project Management SaaS

A powerful Kanban-style project management application built with Next.js, featuring real-time collaboration, drag-and-drop, and multi-tenant workspaces.

## Features

### Core Functionality
- **Multi-tenant Workspaces**: Create and manage multiple organizations
- **Kanban Boards**: Intuitive drag-and-drop interface for task management
- **Lists & Cards**: Organize tasks with customizable lists and cards
- **Real-time Updates**: Server actions for instant UI updates

### Authentication & Security
- **Better Auth Integration**: Email/password authentication with email verification
- **OAuth Support**: GitHub and Google login (configurable)
- **Session Management**: Secure session handling with Better Auth

### Database & ORM
- **PostgreSQL (Neon)**: Scalable cloud database
- **Prisma ORM**: Type-safe database access
- **Complete Schema**: 15+ models including Users, Organizations, Boards, Lists, Cards, Comments, Attachments, etc.

### File Management
- **UploadThing**: File upload service for avatars, attachments, and cover images
- **Multiple Upload Types**: Images, PDFs, and videos

### Email Service
- **Resend Integration**: Transactional emails for verification and notifications
- **Email Templates**: Pre-built templates for common scenarios

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: Better Auth
- **Styling**: TailwindCSS
- **Drag & Drop**: @dnd-kit
- **File Upload**: UploadThing
- **Email**: Resend
- **Form Handling**: React Hook Form + Zod
- **State Management**: Zustand
- **UI Components**: Custom components with CVA

## Getting Started

### Prerequisites

- Node.js 18+ or pnpm
- A Neon PostgreSQL database
- (Optional) OAuth credentials for GitHub/Google
- (Optional) Resend API key for emails
- (Optional) UploadThing token for file uploads

### Installation

1. **Clone the repository**
   ```bash
   cd TeamFlow
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   The `.env` file is already set up with your Neon database. Update the following:

   ```env
   # Database (already configured)
   DATABASE_URL='your-neon-connection-string'

   # Better Auth (REQUIRED)
   BETTER_AUTH_SECRET="generate-a-random-secret-here"
   BETTER_AUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

   # OAuth Providers (OPTIONAL - for social login)
   GITHUB_CLIENT_ID=""
   GITHUB_CLIENT_SECRET=""
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""

   # Resend (OPTIONAL - for emails)
   RESEND_API_KEY="your-resend-api-key"

   # UploadThing (OPTIONAL - for file uploads)
   UPLOADTHING_TOKEN="your-uploadthing-token"
   ```

4. **Database is already migrated**

   The database schema has been applied to your Neon database. If you need to reset:
   ```bash
   pnpm prisma migrate reset
   pnpm prisma migrate dev
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open the application**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── actions/           # Server actions for data mutations
│   ├── cards.ts
│   └── lists.ts
├── app/               # Next.js app router pages
│   ├── (auth)/        # Authentication pages
│   ├── api/           # API routes (auth, boards, orgs, uploadthing)
│   ├── board/[id]/    # Board view page
│   ├── dashboard/     # User dashboard
│   └── organization/  # Organization pages
├── components/        # React components
│   ├── board/         # Kanban board components
│   └── ui/            # Reusable UI components
└── lib/               # Utilities and configurations
    ├── auth.ts        # Better Auth server config
    ├── auth-client.ts # Better Auth client hooks
    ├── prisma.ts      # Prisma client singleton
    ├── resend.ts      # Email service
    └── uploadthing.ts # File upload helpers
```

## Database Schema

### Key Models

- **User**: Authentication and user data
- **Organization**: Multi-tenant workspaces
- **OrganizationMember**: User-organization relationships with roles
- **Board**: Project boards within organizations
- **List**: Columns in a Kanban board
- **Card**: Tasks within lists
- **Comment**: Card discussions
- **Attachment**: File attachments on cards
- **Label**: Color-coded labels for cards
- **Checklist**: Task checklists within cards
- **Activity**: Audit log of all actions

## Features Roadmap

### Completed ✅
- [x] Authentication (email/password + OAuth)
- [x] Multi-tenant workspaces
- [x] Board creation and management
- [x] Kanban interface with drag & drop
- [x] List and card CRUD operations
- [x] File upload configuration
- [x] Email service setup

### In Progress 🚧
- [ ] Card details modal
- [ ] Comments and mentions
- [ ] File attachments
- [ ] Labels and tags
- [ ] Checklists
- [ ] Due dates and reminders

### Planned 📋
- [ ] Real-time collaboration with WebSockets
- [ ] Activity feed and notifications
- [ ] Advanced search and filters
- [ ] Multiple board views (Timeline, Calendar, Gantt)
- [ ] Automations and workflows
- [ ] Team analytics and reporting
- [ ] Mobile responsive design improvements
- [ ] Dark mode
- [ ] Export/Import boards
- [ ] Integrations (Slack, GitHub, etc.)

## API Endpoints

### Authentication
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login
- `POST /api/auth/sign-out` - User logout
- `GET /api/auth/session` - Get current session

### Organizations
- `POST /api/organizations` - Create organization

### Boards
- `POST /api/boards` - Create board

### File Upload
- `POST /api/uploadthing` - Upload files

## Development Commands

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm prisma studio    # Open Prisma Studio (database GUI)
pnpm prisma generate  # Generate Prisma Client
pnpm prisma migrate dev # Create and apply migrations
```

## Environment Setup Notes

### Generate a Secret Key

For `BETTER_AUTH_SECRET`, generate a random string:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### OAuth Setup (Optional)

**GitHub OAuth:**
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set callback URL to `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to `.env`

**Google OAuth:**
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Set callback URL to `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Client Secret to `.env`

### Resend Setup (Optional)

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain or use resend's test domain
3. Create an API key
4. Update `RESEND_API_KEY` in `.env`
5. Update email `from` address in `src/lib/resend.ts`

### UploadThing Setup (Optional)

1. Sign up at [uploadthing.com](https://uploadthing.com)
2. Create a new app
3. Copy your token to `UPLOADTHING_TOKEN` in `.env`

## Contributing

This project is currently in development. Contributions, issues, and feature requests are welcome!

## License

MIT

---

Built with Next.js, Prisma, Better Auth, and ❤️
