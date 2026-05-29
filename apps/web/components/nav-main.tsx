"use client"

import { type Icon } from "@tabler/icons-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { cn } from "~/lib/utils"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const searchParams = useSearchParams()
  const currentTab = searchParams?.get("tab") || "overview"

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu className="gap-1.5">
          {items.map((item) => {
            // Retrieve target tab from URL query
            let itemTab = "overview"
            try {
              const urlObj = new URL(item.url, "http://localhost")
              itemTab = urlObj.searchParams.get("tab") || "overview"
            } catch (e) { }

            const isActive = currentTab === itemTab

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={cn(
                    "w-full h-11 px-4 rounded-xl text-slate-700 font-medium transition-all duration-200 hover:bg-slate-100 scribble-btn shadow-none border-transparent",
                    isActive && "bg-pastel-yellow text-[#2d2638] font-bold scribble-shadow border-2 border-[#2d2638] translate-x-[-2px] translate-y-[-2px]"
                  )}
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    {item.icon && <item.icon className={cn("size-5 shrink-0 text-slate-500", isActive && "text-[#2d2638]")} strokeWidth={1.5} />}
                    <span className="text-sm font-sans font-bold">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
