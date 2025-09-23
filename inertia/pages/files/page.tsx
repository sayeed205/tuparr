import { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import {
  ArrowLeftIcon,
  DownloadIcon,
  EditIcon,
  FileIcon,
  FolderIcon,
  Grid3X3Icon,
  ListIcon,
  MoreHorizontalIcon,
  Trash2Icon,
} from 'lucide-react'

import type { InferPageProps } from '@adonisjs/inertia/types'
import type FilesController from '#controllers/files_controller'
import type { Entry } from '#types/files'

import AppLayout from '~/components/layout/app-layout'
import { Header } from '~/components/layout/header'
import { Main } from '~/components/layout/main'
import { Badge } from '~/components/ui/badge'
import NotFound from '~/pages/errors/not_found'
import { Button } from '~/components/ui/button'

import { Card } from '~/components/ui/card'
import { Checkbox } from '~/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { route } from '@izzyjs/route/client'
import FilesBreadcrumb from '~/pages/files/files-breadcrumb'
import { DeleteConfirmationModal } from '~/pages/files/components/confirm-delete-modal'
import { RenameModal } from '~/pages/files/components/rename-modal'

export default function FilesPage({
  status,
  path,
  files,
}: InferPageProps<FilesController, 'index'>) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [renameItem, setRenameItem] = useState<Entry | null>(null)

  const handleSelectAll = () => {
    if (selectedItems.length === files.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(files.map((file) => file.name))
    }
  }

  const handleNavigateUp = () => {
    const pathParts = route.current().toString().split('/').filter(Boolean)
    if (pathParts.length > 1) {
      pathParts.pop()
      setSelectedItems([])
      router.visit('/' + pathParts.join('/'))
    }
  }

  const handleItemSelect = (path: string) => {
    setSelectedItems((prev) =>
      prev.includes(path) ? prev.filter((item) => item !== path) : [...prev, path]
    )
  }

  const handleFolderClick = (folderPath: string) => {
    router.visit(path + folderPath)
    setSelectedItems([])
  }

  const handleItemRename = (item: Entry) => {
    setRenameItem(item)
    setShowRenameModal(true)
  }

  const getInfo = (item: Entry) => {
    if (item.type === 'folder') {
      return item.count + ' items'
    }
    return formatBytes(item.size)
  }

  const handleSingleFileDelete = (filePath: string) => {
    setSelectedItems([filePath])
    setShowDeleteModal(true)
  }

  const stats = {
    fileCount: files.filter((f) => f.type === 'file').length,
    folderCount: files.filter((f) => f.type === 'folder').length,
    totalItems: files.length,
  }
  return (
    <>
      <Head title="Files" />
      <AppLayout>
        <Header>
          <h3 className="text-3xl">Files</h3>
        </Header>
        <Main>
          {status === '404' && <NotFound />}
          {status === '200' && (
            <div className=" mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold">Files</h1>
                  <p className="text-muted-foreground">
                    {stats.totalItems} items ({stats.folderCount} folders, {stats.fileCount} files)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {selectedItems.length > 0 && (
                    <>
                      <Badge variant="secondary">{selectedItems.length} selected</Badge>
                      <Button variant="outline" size="sm" onClick={() => setShowDeleteModal(true)}>
                        <Trash2Icon className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </>
                  )}

                  <div className="flex items-center border rounded-md">
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-r-none"
                    >
                      <ListIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-l-none"
                    >
                      <Grid3X3Icon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Navigation Bar */}
              <Card className="p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleNavigateUp}
                      disabled={path === '/'}
                    >
                      <ArrowLeftIcon className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center gap-1 text-sm">
                      <FilesBreadcrumb />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedItems.length === files.length && files.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm text-muted-foreground">Select All</span>
                  </div>
                </div>
              </Card>

              {/* Files List/Grid */}
              {viewMode === 'list' ? (
                <div className="space-y-2">
                  {files.map((item) => (
                    <Card key={item.name} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={selectedItems.includes(item.name)}
                          onCheckedChange={() => handleItemSelect(item.name)}
                        />

                        <div className="flex items-center gap-3 flex-1">
                          {item.type === 'folder' ? (
                            <FolderIcon className="w-5 h-5 text-primary" />
                          ) : (
                            <FileIcon className="w-5 h-5 text-accent-foreground" />
                          )}

                          <div className="flex-1">
                            {item.type === 'folder' ? (
                              <Link
                                href={route.current().toString() + '/' + item.name}
                                className="text-left hover:text-primary transition-colors"
                              >
                                <div className="font-medium">{item.name}</div>
                              </Link>
                            ) : (
                              <button className="text-left " disabled={item.type === 'file'}>
                                <div className="font-medium">{item.name}</div>
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="w-20 text-right">{getInfo(item)}</div>
                            <div>{item.createdAt}</div>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontalIcon className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <DownloadIcon className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleItemRename(item)}>
                              <EditIcon className="w-4 h-4 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleSingleFileDelete(item.name)}
                            >
                              <Trash2Icon className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {files.map((item) => (
                    <Card key={item.name} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Checkbox
                            checked={selectedItems.includes(item.name)}
                            onCheckedChange={() => handleItemSelect(item.name)}
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontalIcon className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <DownloadIcon className="w-4 h-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleItemRename(item)}>
                                <EditIcon className="w-4 h-4 mr-2" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleSingleFileDelete(item.name)}
                              >
                                <Trash2Icon className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <button
                          onClick={() => item.type === 'folder' && handleFolderClick(item.name)}
                          className="w-full text-center hover:text-primary transition-colors"
                          disabled={item.type === 'file'}
                        >
                          <div className="flex justify-center mb-2">
                            {item.type === 'folder' ? (
                              <FolderIcon className="w-12 h-12 text-primary" />
                            ) : (
                              <FileIcon className="w-12 h-12 text-gray-500" />
                            )}
                          </div>
                          <div className="text-sm font-medium truncate" title={item.name}>
                            {item.name}
                          </div>
                          <div className="text-xs text-muted-foreground">{getInfo(item)}</div>
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {files.length === 0 && (
                <Card className="p-12 text-center">
                  <FolderIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No files found</h3>
                  <p className="text-muted-foreground">This folder is empty</p>
                </Card>
              )}
            </div>
          )}

          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            selectedFiles={selectedItems}
          />

          {renameItem && (
            <RenameModal
              isOpen={showRenameModal}
              onClose={() => setShowRenameModal(false)}
              item={renameItem}
            />
          )}
        </Main>
      </AppLayout>
    </>
  )
}

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  const value = bytes / Math.pow(k, i)
  return `${parseFloat(value.toFixed(decimals))} ${sizes[i]}`
}
