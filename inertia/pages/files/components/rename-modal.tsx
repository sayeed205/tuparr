import type React from 'react'
import { route } from '@izzyjs/route/client'
import { router, useForm } from '@inertiajs/react'

import type { Entry } from '#types/files'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import useError from '~/hooks/use-error'

interface RenameModalProps {
  isOpen: boolean
  onClose: () => void
  item: Entry
}

export function RenameModal({ isOpen, onClose, item }: RenameModalProps) {
  const form = useForm({
    name: item.name,
  })
  const errors = useError()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.data.name.trim() && form.data.name !== item.name) {
      router.post(route('files.rename'), {
        name: form.data.name,
        item: item.name,
        dir: route.current(),
      })
      if (!errors?.rename) {
        onClose()
        form.reset()
      }
    }
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename {item.type}</DialogTitle>
          <DialogDescription>Enter a new name for this {item.type}.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name
              {errors?.rename && <span className="text-xs text-destructive">{errors.rename}</span>}
            </Label>
            <Input
              id="name"
              type="text"
              value={form.data.name}
              placeholder={`Enter ${item.type} name`}
              onChange={(e) => form.setData('name', e.target.value)}
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!form.data.name.trim() || form.data.name === item.name}>
              Rename
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
