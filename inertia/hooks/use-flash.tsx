import usePageProps from '~/hooks/use-page-props'

export default function useFlash<T>() {
  const props = usePageProps<{ flash: T }>()

  return props.flash
}
