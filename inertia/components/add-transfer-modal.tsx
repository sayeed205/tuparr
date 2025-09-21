import { Plus } from 'lucide-react'
import { useState } from 'react'

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

interface AddTransferModalProps {
  onAddTransfers?: (links: string[]) => void
}

export default function AddTransferModal({ onAddTransfers }: AddTransferModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newTransferLinks, setNewTransferLinks] = useState('')

  const handleAddTransfers = () => {
    const links = newTransferLinks
      .split('\n')
      .map((link) => link.trim())
      .filter((link) => link.length > 0)

    if (links.length > 0) {
      // Call the callback function if provided
      onAddTransfers?.(links)

      // For demo purposes, log the links
      console.log('[v0] Adding new transfers:', links)

      // Reset form and close modal
      setNewTransferLinks('')
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[60vw]">
        <DialogHeader>
          <DialogTitle>Add New Transfer</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="links">URLs/Magnet Links</Label>
            <Textarea
              id="links"
              placeholder="Enter URLs or magnet links (one per line)

Examples:
https://example.com/file.zip
magnet:?xt=urn:btih:...
ftp://example.com/file.tar.gz
https://releases.ubuntu.com/22.04/ubuntu-22.04.3-desktop-amd64.iso"
              value={newTransferLinks}
              onChange={(e) => setNewTransferLinks(e.target.value)}
              className="min-h-[60vh] resize-none text-sm"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTransfers} disabled={!newTransferLinks.trim()}>
              Add Transfers
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
