'use client'

import { useTheme } from '@/app/hooks/useTheme'
import { Moon, Sun } from 'lucide-react'


export function ThemeToggle({ isExpanded }: { isExpanded: boolean }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 w-full rounded-md px-2 py-2 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 dark:text-neutral-400"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      {isExpanded && <span>Tema</span>}
    </button>
  )
}
