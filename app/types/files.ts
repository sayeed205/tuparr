export type FileEntry = {
  type: 'file'
  name: string
  size: number
  createdAt: string
}

export type FolderEntry = {
  type: 'folder'
  name: string
  count: number
  createdAt: string
}

export type Entry = FileEntry | FolderEntry
