import { SiteHeader } from "~/components/site-header"
import { Suspense } from "react"
import { Footer } from "~/components/home/footer"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-background dashboard-root">
      <Suspense fallback={<div className="h-16 shrink-0 border-b border-[#2d2638] bg-[#fbfaf5]/80" />}>
        <SiteHeader />
      </Suspense>
      <main className="flex-1 flex flex-col justify-between">
        <div className="flex-1">
          <Suspense fallback={<div>Loading Content...</div>}>
            {children}
          </Suspense>
        </div>
        <Footer className="px-6 md:px-12 lg:px-24" />
      </main>
    </div>
  )
}