import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Bookmark,
  LayoutDashboard,
  Leaf,
  LogOut,
  ScanLine,
  History,
  User,
  BookOpen,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthenticatedLayout,
});

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Scan Tanaman", url: "/scan", icon: ScanLine },
  { title: "Riwayat Analisis", url: "/history", icon: History },
  { title: "Bookmark", url: "/bookmarks", icon: Bookmark },
  { title: "Artikel Edukasi", url: "/articles", icon: BookOpen },
  { title: "Profil", url: "/profile", icon: User },
];

function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2 px-2 py-2 font-display font-bold">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
            <Leaf className="h-4 w-4" />
          </span>
          {!collapsed && <span>EcoScan AI</span>}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((it) => (
                <SidebarMenuItem key={it.url}>
                  <SidebarMenuButton asChild isActive={pathname === it.url || pathname.startsWith(it.url + "/")}>
                    <Link to={it.url} className="flex items-center gap-2">
                      <it.icon className="h-4 w-4" />
                      {!collapsed && <span>{it.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="mt-auto border-t border-sidebar-border p-2">
        <SidebarMenuButton onClick={signOut} className="flex w-full items-center gap-2">
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Keluar</span>}
        </SidebarMenuButton>
      </div>
    </Sidebar>
  );
}

function AuthenticatedLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <span className="font-display text-sm font-semibold text-muted-foreground">
              EcoScan AI — Dashboard
            </span>
          </header>
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
