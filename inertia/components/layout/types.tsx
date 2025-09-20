import React from 'react'

interface BaseNavItem {
  title: string
  badge?: string
  icon?: React.ElementType
}

export type NavLink = BaseNavItem & {
  url: string
  items?: never
}

export type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: string })[]
  url?: string
}

export type NavItem = NavCollapsible | NavLink

export interface NavGroup {
  title?: string
  items: NavItem[]
}
