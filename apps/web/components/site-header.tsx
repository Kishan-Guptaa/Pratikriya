"use client"

import React, { useRef, useEffect } from "react"
import Link from "next/link"
import { IconSearch, IconLogout } from "@tabler/icons-react"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { useUser, useSignOut } from "~/hooks/api/auth"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { cn } from "~/lib/utils"

const navItems = [
  { title: "Dashboard", url: "/dashboard?tab=overview", tabName: "overview" },
  { title: "My Forms", url: "/dashboard?tab=my-forms", tabName: "my-forms" },
  { title: "Form Builder", url: "/dashboard?tab=builder", tabName: "builder" },
  { title: "Templates", url: "/dashboard?tab=templates", tabName: "templates" },
  { title: "Submissions", url: "/dashboard?tab=submissions", tabName: "submissions" },
  { title: "Analytics", url: "/dashboard?tab=analytics", tabName: "analytics" },
  { title: "Settings", url: "/dashboard?tab=settings", tabName: "settings" },
];

export function SiteHeader() {
  const { user } = useUser()
  const { signOutUserAsync } = useSignOut()
  const userName = user?.fullName ?? "Guest"
  const userAvatar = user?.profileImageUrl ?? ""

  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const currentTab = searchParams?.get("tab") || "overview"
  const searchQuery = searchParams?.get("search") || ""
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams?.toString())
    if (e.target.value) {
      params.set("search", e.target.value)
    } else {
      params.delete("search")
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleLogout = () => {
    // Redirect instantly — fire sign-out in background
    window.location.href = "/";
    signOutUserAsync({}).catch(console.error);
  }

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "G"

  return (
    <header className="w-full shrink-0 flex flex-col md:flex-row md:items-center justify-between border-b-3 border-[#2d2638] bg-[#fbfaf5] dark:bg-[#0f0b18] px-4 md:px-8 py-3 md:py-0 h-auto md:h-16 gap-3 z-30 sticky top-0">
      {/* Brand & Left logo */}
      <div className="flex items-center justify-between md:justify-start gap-4">
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white font-bold font-caveat text-xl border-2 border-[#2d2638] shadow-[1px_1px_0px_#2d2638]">
            P
          </div>
          <span className="text-2xl font-caveat font-bold text-slate-800 dark:text-white leading-none mt-1">
            Pratikriya
          </span>
        </Link>

        {/* Horizontal Navigation Items - Mobile Horizontal Scroll */}
        <div className="flex md:hidden items-center gap-2">
          {user && (
            <Avatar className="h-7 w-7 rounded-full border border-[#2d2638]">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback className="bg-pastel-blue text-[9px] text-[#2d2638] font-bold">{initials}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex items-center gap-1.5 overflow-x-auto md:overflow-x-visible py-1.5 md:py-0 scrollbar-none max-w-full">
        {navItems.map((item) => {
          const isActive = currentTab === item.tabName
          return (
            <Link
              key={item.title}
              href={item.url}
              className={cn(
                "text-xs font-bold px-3 py-1.5 rounded-xl border border-transparent transition-all whitespace-nowrap",
                isActive 
                  ? "bg-pastel-yellow border-[#2d2638] border-2 text-[#2d2638] shadow-[2px_2px_0px_#2d2638] -translate-y-0.5 -translate-x-0.5" 
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
              )}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Right Side: Search & Profile & Sign-out */}
      <div className="flex items-center justify-between md:justify-end gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 md:w-48 lg:w-60 max-w-md">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search forms..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full h-8 pl-9 pr-14 bg-white/50 dark:bg-zinc-800/50 border-2 border-[#2d2638] rounded-full text-xs text-slate-800 dark:text-white placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-zinc-800 shadow-[1.5px_1.5px_0px_#2d2638] focus:shadow-none transition-all font-patrick-hand"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-4.5 select-none items-center gap-0.5 rounded border border-[#2d2638] bg-[#fbfaf5] px-1.5 font-mono text-[8px] font-bold text-[#2d2638] shadow-[1px_1px_0px_#2d2638]">
            <span>⌘</span><span>K</span>
          </kbd>
        </div>

        {/* User profile & logout */}
        {user && (
          <div className="flex items-center gap-2">
            <Avatar className="hidden md:block h-8 w-8 rounded-full border-2 border-[#2d2638] shadow-[1px_1px_0px_#2d2638] shrink-0">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback className="bg-pastel-blue text-[10px] text-[#2d2638] font-bold">{initials}</AvatarFallback>
            </Avatar>

            <Button
              onClick={handleLogout}
              variant="outline"
              size="xs"
              className="scribble-btn bg-pastel-pink hover:bg-pink-100 text-[#2d2638] font-bold border-2 border-foreground shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[0.5px] hover:translate-y-[0.5px] transition-all h-8 text-[10px] rounded-xl flex items-center gap-1"
            >
              <IconLogout className="size-3.5" strokeWidth={2} />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
