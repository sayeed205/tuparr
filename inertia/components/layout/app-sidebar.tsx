import { CommandIcon, LayoutDashboardIcon } from 'lucide-react'
import React from 'react'

import { NavGroup } from '~/components/layout/nav-group'
import { NavUser } from '~/components/layout/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '~/components/ui/sidebar'
import useUser from '~/hooks/use-user'
import type { NavGroup as NavGroupType } from '~/components/layout/types'

const sidebarLinks: NavGroupType[] = [
  {
    title: 'general',
    items: [
      {
        icon: LayoutDashboardIcon,
        title: 'Dahsbord',
        url: '/dashboard',
      },
    ],
  },
]

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar()
  const user = useUser()

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <div className="mb-4 flex items-center justify-center gap-2">
          <CommandIcon className="h-6 w-6" />
          {open && <h1 className="text-xl font-medium">Putarr</h1>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sidebarLinks.map((p) => (
          <NavGroup key={p.title} {...p} />
        ))}
      </SidebarContent>
      <SidebarFooter>{user && <NavUser />}</SidebarFooter>
    </Sidebar>
  )
}
