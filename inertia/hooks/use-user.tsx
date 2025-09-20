import { SharedProps } from '@adonisjs/inertia/types'
import usePageProps from './use-page-props'

export default function useUser() {
  const page = usePageProps<SharedProps>()
  return page.user
}
