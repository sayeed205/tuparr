/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

import { ThemeProvider } from '~/components/theme-provider'

import '../css/app.css'
import { TailwindIndicator } from '~/components/tailwind-indicator'
import { Toaster } from '~/components/ui/sonner'

const appName = import.meta.env.VITE_APP_NAME || 'Putarr'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => (title ? `${title} - ${appName}` : appName),

  resolve: (name) => {
    return resolvePageComponent(`../pages/${name}.tsx`, import.meta.glob('../pages/**/*.tsx'))
  },

  setup({ el, App, props }) {
    createRoot(el).render(
      <>
        <ThemeProvider defaultTheme="system" storageKey="theme">
          <App {...props} />
          <TailwindIndicator />
          <Toaster />
        </ThemeProvider>
      </>
    )
  },
}).then()
