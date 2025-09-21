import React from 'react'
import { CommandIcon } from 'lucide-react'

interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="bg-background grid h-svh w-full place-items-center">
      <div className="mx-auto flex  flex-col p-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <CommandIcon className="h-8 w-8" />
          <h1 className="text-xl font-medium">Tuparr</h1>
        </div>

        {/* Content (children centered) */}
        {children}
      </div>
    </div>
  )
}
