import { Head } from '@inertiajs/react'

import AppLayout from '~/components/layout/app-layout'
import { Header } from '~/components/layout/header'
import { Main } from '~/components/layout/main'

export default function FilesPage() {
  return (
    <>
      <Head title="Files" />
      <AppLayout>
        <Header></Header>
        <Main>Files here</Main>
      </AppLayout>
    </>
  )
}
