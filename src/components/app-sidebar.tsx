"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Building2,
  Kanban,
  Users,
  Settings2,
  LifeBuoy,
  MessageSquare,
  Sparkles,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name: string
    email: string
    avatar: string
  }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const defaultUser = {
    name: "Utilisateur",
    email: "user@example.com",
    avatar: "",
  }

  const data = {
    user: user || defaultUser,
    navMain: [
      {
        title: "Tableau de bord",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: true,
      },
      {
        title: "Organisations",
        url: "/dashboard",
        icon: Building2,
        items: [
          {
            title: "Mes organisations",
            url: "/dashboard",
          },
          {
            title: "Créer une organisation",
            url: "/dashboard/create-organization",
          },
        ],
      },
      {
        title: "Paramètres",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "Profil",
            url: "#",
          },
          {
            title: "Préférences",
            url: "#",
          },
          {
            title: "Facturation",
            url: "#",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: MessageSquare,
      },
    ],
    projects: [],
  }
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Sparkles className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">TeamFlow</span>
                  <span className="truncate text-xs">Gestion de projet</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
