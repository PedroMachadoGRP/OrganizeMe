'use client'

import { Fragment, useState } from "react"
import { NavItems } from "@/config"
import { cn } from "@/app/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import Link from "next/link"
import { ChevronLeft, ChevronRight, LogOut, Menu } from "lucide-react"
import { ThemeToggle } from "../ui/ThemeToggle"
import { useAuth } from "@/app/contexts/AuthContext"

export default function SideBar() {
  const [isExpanded, setIsExpand] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const navItem = NavItems()
  const { logout } = useAuth();

  async function handleLogout() {
    try {
      await logout()
    } catch {
      window.location.href = '/login'
    }
  }

  return (
    <>

      <button
        onClick={() => setIsMobileOpen(true)}
        className="
          md:hidden fixed top-4 left-85 z-50
          p-2 rounded-md
          bg-white dark:bg-neutral-800
          shadow-md
        "
      >
        <Menu size={20} />
      </button>


      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}


      <div
        className={cn(
          `
          fixed md:relative z-50
          h-screen
          transition-all duration-300
          bg-white dark:bg-neutral-900
          border-r border-neutral-200 dark:border-neutral-800
          `,
          isExpanded ? "w-56" : "w-17.5",


          isMobileOpen ? "left-0" : "-left-full md:left-0"
        )}
      >
        <aside className="flex h-full flex-col w-full px-3">

          <div className="mt-4 pb-2">
            <div className="flex flex-col space-y-1">
              {navItem.map((item, index) =>
                item.position === "top" ? (
                  <Fragment key={index}>
                    <SideNavItem
                      label={item.name}
                      icon={item.icon}
                      path={item.href}
                      active={item.active}
                      isExpanded={isExpanded}
                    />
                  </Fragment>
                ) : null
              )}
            </div>
          </div>


          <div className="mt-auto mb-4 space-y-2">
            {navItem.map((item, index) =>
              item.position === "bottom" ? (
                <Fragment key={index}>
                  <SideNavItem
                    label={item.name}
                    icon={item.icon}
                    path={item.href}
                    active={item.active}
                    isExpanded={isExpanded}
                  />
                </Fragment>
              ) : null
            )}

            <ThemeToggle isExpanded={isExpanded} />

            <button onClick={handleLogout} className="flex items-center gap-2 w-full rounded-md px-2 py-2 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 dark:text-neutral-400">
              <LogOut size={18} />
              {isExpanded && <span>Sair</span>}
            </button>
          </div>
        </aside>

        <button
          onClick={() => setIsExpand(!isExpanded)}
          className="
            hidden md:flex
            absolute top-1/2 -right-3 -translate-y-1/2
            h-6 w-6 items-center justify-center
            rounded-full border shadow-md
            bg-white dark:bg-neutral-800
          "
        >
          {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
    </>
  )
}



export const SideNavItem: React.FC<{
  label: string
  icon: any
  path: string
  active: boolean
  isExpanded: boolean
}> = ({ label, icon, path, active, isExpanded }) => {
  const base =
    "relative flex items-center rounded-md transition-colors text-lm"

  const activeStyle =
    "bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-white"

  const inactiveStyle =
    "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"

  return isExpanded ? (
    <Link
      href={path}
      className={cn(base, active ? activeStyle : inactiveStyle)}
    >
      <div className="flex items-center gap-2 px-2 py-1.5">
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  ) : (
    <TooltipProvider delayDuration={70}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={path}
            className={cn(
              base,
              "justify-center p-2",
              active ? activeStyle : inactiveStyle
            )}
          >
            {icon}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
