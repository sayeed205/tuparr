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
  const { state } = useSidebar()
  const user = useUser()

  const isCollapsed = state === 'collapsed'

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '30px',
            width: '100%',
            position: 'relative',
            paddingLeft: isCollapsed ? 0 : 12,
            transition: 'padding-left 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: isCollapsed ? '100%' : 28,
              minWidth: 28,
              height: '100%',
              transition: 'width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            <CommandIcon
              size={isCollapsed ? 24 : 28}
              strokeWidth={1.5}
              style={{
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transform: `scale(${isCollapsed ? 1 : 1})`,
              }}
            />
          </div>
          <span
            className="sidebar-title"
            style={{
              marginLeft: 12,
              fontWeight: 600,
              fontSize: '1.25rem',
              letterSpacing: '0.02em',
              opacity: isCollapsed ? 0 : 1,
              visibility: isCollapsed ? 'hidden' : 'visible',
              transition: isCollapsed
                ? 'opacity 0.15s ease-out, visibility 0s linear 0.15s, transform 0.15s ease-out'
                : 'opacity 0.2s ease-in 0.1s, visibility 0s linear 0s, transform 0.2s ease-in 0.1s',
              pointerEvents: isCollapsed ? 'none' : 'auto',
              position: 'absolute',
              left: '40px',
              top: '50%',
              transform: isCollapsed
                ? 'translateY(-50%) translateX(-8px) scale(0.95)'
                : 'translateY(-50%) translateX(0) scale(1)',
              willChange: 'transform, opacity',
            }}
          >
            Putarr
          </span>
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
