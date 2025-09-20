import { Head } from '@inertiajs/react'
import AppLayout from '~/components/layout/app-layout'
import { Header } from '~/components/layout/header'
import { Main } from '~/components/layout/main'

export default function DashboardPage() {
  return (
    <>
      <Head title="Dashboard" />
      <AppLayout>
        <Header></Header>
        <Main>Dashboard here</Main>
      </AppLayout>
    </>
  )
}
