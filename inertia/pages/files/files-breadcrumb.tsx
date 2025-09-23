import { Link } from '@inertiajs/react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import { HardDriveIcon } from 'lucide-react'
import { route } from '@izzyjs/route/client'
import React from 'react'

const ITEMS_TO_DISPLAY = 2

export default function FilesBreadcrumb() {
  const items = buildBreadcrumbs(route.current().toString())

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={'/files'}>
              <HardDriveIcon className="w-4 h-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {items.length > ITEMS_TO_DISPLAY ? (
          <>
            <BreadcrumbItem>...</BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        ) : null}
        {items.slice(-ITEMS_TO_DISPLAY).map((item, index, arr) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {index === arr.length - 1 ? (
                <BreadcrumbPage className="max-w-20 truncate md:max-w-none">
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild className="max-w-20 truncate md:max-w-none">
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>

            {index !== arr.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

function buildBreadcrumbs(route: string): { href: string; label: string }[] {
  // Remove `/files` prefix
  const withoutRoot = route.replace(/^\/files/, '')

  // Split into segments, filter out empty ones
  const segments = withoutRoot.split('/').filter(Boolean)

  // Build breadcrumbs
  return segments.map((segment, idx) => {
    const href = '/files/' + segments.slice(0, idx + 1).join('/')
    return { href, label: decodeURIComponent(segment) }
  })
}
