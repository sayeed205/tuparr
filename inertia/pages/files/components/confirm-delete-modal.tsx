import { AlertTriangleIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Badge } from '~/components/ui/badge'
import { router } from '@inertiajs/react'
import { route } from '@izzyjs/route/client'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  selectedFiles: string[]
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  selectedFiles,
}: DeleteConfirmationModalProps) {
  const handleDelete = () => {
    router.post(route('files.delete'), { items: selectedFiles, dir: route.current() })
    onClose()
  }

  const getFileNames = () => {
    return selectedFiles.map((path) => path.split('/').pop() || path)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangleIcon className="w-5 h-5" />
            Delete Files
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the selected files? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Files to delete:</h4>
            <div className="flex flex-wrap gap-2">
              {getFileNames().map((fileName, index) => (
                <Badge key={index} variant="destructive">
                  {fileName}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete Files
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
