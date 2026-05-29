"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  IconHome,
  IconFileDescription,
  IconPencil,
  IconTemplate,
  IconMail,
  IconChartBar,
  IconTrophy,
  IconSettings,
  IconChevronRight,
  IconScribble,
  IconLogout,
  IconLogin,
  IconUserPlus
} from "@tabler/icons-react"

import { NavMain } from "~/components/nav-main"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { useUser, useSignOut } from "~/hooks/api/auth"
import { useGetForms } from "~/hooks/api/form"
import { cn } from "~/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "~/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard?tab=overview",
      icon: IconHome,
    },
    {
      title: "My Forms",
      url: "/dashboard?tab=my-forms",
      icon: IconFileDescription,
    },
    {
      title: "Form Builder",
      url: "/dashboard?tab=builder",
      icon: IconPencil,
    },
    {
      title: "Templates",
      url: "/dashboard?tab=templates",
      icon: IconTemplate,
    },
    {
      title: "Submissions",
      url: "/dashboard?tab=submissions",
      icon: IconMail,
    },
    {
      title: "Analytics",
      url: "/dashboard?tab=analytics",
      icon: IconChartBar,
    },
    {
      title: "Settings",
      url: "/dashboard?tab=settings",
      icon: IconSettings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user: loggedInUser } = useUser()
  const { signOutUserAsync } = useSignOut()
  const { forms = [] } = useGetForms()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const sidebarUser = loggedInUser ? {
    name: loggedInUser.fullName,
    email: loggedInUser.email,
    avatar: loggedInUser.profileImageUrl || "",
  } : null

  const initials = sidebarUser?.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "C"

  const handleLogout = () => {
    // Redirect instantly — fire sign-out in background
    window.location.href = "/";
    signOutUserAsync({}).catch(console.error);
  }

  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className={cn("border-r border-sidebar-border bg-sidebar spiral-binding ml-3 mt-3 mb-3 rounded-l-3xl shadow-sm", props.className)}
    >
      <SidebarHeader className="py-5 px-4 bg-sidebar">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/" className="flex items-center gap-3 ml-2 group">

              <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white font-bold font-caveat text-xl">
                P
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-caveat tracking-tight text-slate-800 font-bold">Pratikriya</span>
                <span className="text-[10px] text-slate-500">Your Response Matters</span>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 bg-sidebar flex flex-col justify-between h-full overflow-y-auto">
        <div className="ml-2 space-y-6">
          <NavMain items={data.navMain} />

          {/* Form-based Images (Recent Forms list) */}
          {forms && forms.length > 0 && (
            <div className="px-3 space-y-3 group-data-[collapsible=icon]:hidden">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">
                Form Books
              </p>
              <div className="space-y-2">
                {forms.slice(0, 3).map((form) => (
                  <Link
                    key={form.id}
                    href={`/dashboard?tab=builder&formId=${form.id}`}
                    className="flex items-center gap-2.5 p-2 rounded-xl border-2 border-foreground bg-white hover:bg-slate-50 shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer animate-in fade-in duration-300"
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${form.title}`}
                      alt={form.title}
                      className="size-7 rounded-lg border border-foreground bg-slate-100 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-800 leading-tight">
                        {form.title}
                      </p>
                      <p className="text-[9px] text-slate-400 truncate">
                        {form.acceptsResponses ? "Accepting responses" : "Closed"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Clickable Scribble Peep Illustration linking to kishann.dev */}
          <div className="px-3 pt-2 flex justify-center group-data-[collapsible=icon]:hidden">
            <a
              href="https://kishann.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="group/doodle w-full relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 border-dashed border-primary/45 bg-[#fbfaf5]/40 hover:bg-[#fbfaf5]/80 hover:border-primary/80 transition-all text-center"
            >
              <img
                src="https://api.dicebear.com/7.x/open-peeps/svg?seed=Felix&accessoriesProbability=0&facialHairProbability=0&face=smile,cute&flip=true"
                alt="Scribble Doodle"
                className="size-16 opacity-85 group-hover/doodle:opacity-100 group-hover/doodle:scale-110 transition-transform duration-300 pointer-events-none"
              />
              <span className="text-[10px] font-bold text-primary font-patrick-hand flex items-center gap-0.5">
                Kishann.dev ↗
              </span>
            </a>
          </div>
        </div>

        {/* Doodle decoration at bottom left of sidebar */}
        <div className="mt-auto px-6 py-4 flex flex-col items-start group-data-[collapsible=icon]:hidden">
          <Link href="/contact" className="w-full group/help">
            <div className="bg-pastel-purple scribble-border scribble-shadow p-3 rotate-3 w-full group-hover/help:scale-105 group-hover/help:rotate-0 transition-transform cursor-pointer">
              <p className="text-xs font-bold text-center">Need help?</p>
              <p className="text-[10px] text-center mt-1">We're here for you!</p>
              <div className="flex justify-center mt-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" /><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" /></svg>
              </div>
            </div>
          </Link>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-3 bg-sidebar ml-2 mb-2">
        {loggedInUser ? (
          <div className="scribble-border bg-white p-2.5 scribble-shadow flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-sans">
                Profile
              </p>
              <span className="rounded-full bg-pastel-yellow border border-[#2d2638] px-2 py-0.5 text-[9px] font-bold text-[#2d2638]">
                Creator
              </span>
            </div>

            <Link
              href="/dashboard?tab=settings"
              className="group flex items-center gap-2.5 rounded-lg border-2 border-transparent bg-white px-1 py-1 transition-all duration-300 hover:border-[#2d2638] hover:bg-slate-50"
            >
              <Avatar className="h-8 w-8 rounded-full border-2 border-[#2d2638]">
                <AvatarImage src={sidebarUser?.avatar} alt={sidebarUser?.name} />
                <AvatarFallback className="bg-pastel-blue text-[10px] text-[#2d2638] font-bold">{initials}</AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-xs font-bold text-slate-800">
                  {sidebarUser?.name}
                </p>
                <p className="truncate text-[10px] text-slate-500 font-sans">
                  {sidebarUser?.email}
                </p>
              </div>

              <IconChevronRight className="size-3.5 text-slate-400 group-hover:text-slate-800" strokeWidth={1.5} />
            </Link>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="scribble-btn bg-pastel-pink hover:bg-pink-100 text-[#2d2638] w-full mt-1 h-9"
            >
              <IconLogout className="size-4 mr-2" strokeWidth={1.5} />
              Logout
            </Button>
          </div>
        ) : (
          <div className="scribble-border bg-white p-3 scribble-shadow flex flex-col gap-3">
            <p className="text-xs font-bold text-center text-slate-700">Join the creative minds!</p>
            <div className="flex flex-col gap-2">
              <Button asChild className="scribble-btn bg-pastel-blue hover:bg-blue-100 text-[#2d2638] w-full h-9">
                <Link href="/login">
                  <IconLogin className="size-4 mr-2" strokeWidth={1.5} />
                  Sign In
                </Link>
              </Button>
              <Button asChild className="scribble-btn bg-pastel-green hover:bg-green-100 text-[#2d2638] w-full h-9">
                <Link href="/signup">
                  <IconUserPlus className="size-4 mr-2" strokeWidth={1.5} />
                  Sign Up
                </Link>
              </Button>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
