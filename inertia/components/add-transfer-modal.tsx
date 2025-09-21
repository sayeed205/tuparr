import { useForm } from '@inertiajs/react'
import { route } from '@izzyjs/route/client'
import { Plus } from 'lucide-react'
import { FormEvent, useState } from 'react'

import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import useError from '~/hooks/use-error'

export default function AddTransferModal() {
  const [isOpen, setIsOpen] = useState(false)
  const form = useForm({
    links: [] as string[],
  })

  const errors = useError()

  const handleAddTransfers = (e: FormEvent) => {
    e.preventDefault()
    // Convert textarea string to array and update before submit
    const linksArray = (form.data.links as string[])
      .join('\n') // If already user-updated, acts as expected, if not, is current.
      .split('\n')
      .map((link) => link.trim())
      .filter((link) => link.length > 0)

    if (linksArray.length === 0) {
      return
    }
    form.setData('links', linksArray)
    // Wait for setData: Instead of relying on async update, manually pass data payload directly
    form.post(route('transfers.new').toString(), {
      onBefore: () => {
        form.setData('links', linksArray)
      },
      onSuccess: () => {
        setIsOpen(false)
        form.setData('links', [])
        form.reset()
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-[60vw] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Transfer</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <form className="space-y-2" onSubmit={handleAddTransfers}>
            <Label htmlFor="links">
              URLs/Magnet Links
              {errors?.links && <span className="text-xs text-destructive">{errors?.links}</span>}
            </Label>
            <Textarea
              id="links"
              placeholder="Enter URLs or magnet links (one per line)

Examples:
https://example.com/file.zip
magnet:?xt=urn:btih:...
ftp://example.com/file.tar.gz
https://releases.ubuntu.com/22.04/ubuntu-22.04.3-desktop-amd64.iso"
              value={(form.data.links as string[]).join('\n')}
              onChange={(e) => {
                // Always update form state directly as array
                form.setData(
                  'links',
                  e.target.value.split('\n').map((link) => link.trim())
                )
              }}
              className="w-full resize-none text-sm break-all"
            />
            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={form.processing}>
                Add Transfers
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
