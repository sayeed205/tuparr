import { SharedProps } from '@adonisjs/inertia/types'
import usePageProps from './use-page-props'

export default function uesDisk() {
  const { storage } = usePageProps<SharedProps>()
  return storage
}
