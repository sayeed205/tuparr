import React, { useState } from 'react'
import { Head } from '@inertiajs/react'
import AppLayout from '~/components/layout/app-layout'
import { Header } from '~/components/layout/header'
import { Main } from '~/components/layout/main'
import { Card, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { InferPageProps } from '@adonisjs/inertia/types'
import TransfersController from '#controllers/transfers_controller'
import {
  ClockIcon,
  DownloadIcon,
  HardDriveIcon,
  PauseIcon,
  UploadIcon,
  UsersIcon,
} from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Checkbox } from '~/components/ui/checkbox'
import { Progress } from '~/components/ui/progress'

function Modal({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
}) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-card rounded-xl p-6 min-w-[320px] shadow-lg"
        onClick={(e) => e.stopPropagation()}
        style={{ minWidth: 340, maxWidth: 400 }}
      >
        <div className="mb-4">
          <CardTitle>{title}</CardTitle>
        </div>
        <div>{children}</div>
        <Button
          variant="ghost"
          className="absolute top-2 right-2 p-1 rounded"
          aria-label="Close"
          onClick={() => onOpenChange(false)}
        >
          ×
        </Button>
      </div>
    </div>
  )
}

export default function TransfersPage({ transfers }: InferPageProps<TransfersController, 'index'>) {
  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTransfers, setSelectedTransfers] = useState<Set<string>>(new Set())

  // New Transfer Modal State
  const [newLink, setNewLink] = useState('')
  const [newStatus, setNewStatus] = useState<null | { type: 'success' | 'error'; message: string }>(
    null
  )
  const [newSubmitting, setNewSubmitting] = useState(false)

  // Handle new transfer submit
  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    setNewStatus(null)
    setNewSubmitting(true)

    if (!newLink.trim()) {
      setNewStatus({ type: 'error', message: 'Please enter a download link.' })
      setNewSubmitting(false)
      return
    }
    try {
      const resp = await fetch('/api/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ link: newLink }),
      })
      const data = await resp.json()
      if (data.success) {
        setNewStatus({
          type: 'success',
          message: 'Transfer started successfully.',
        })
        setNewLink('')
        setTimeout(() => {
          setModalOpen(false)
          setNewStatus(null)
        }, 900)
        // refresh transfers quickly after new submission
      } else {
        setNewStatus({
          type: 'error',
          message: data.error || 'Failed to start transfer.',
        })
      }
    } catch (err: any) {
      setNewStatus({
        type: 'error',
        message: err?.message || 'Server error / network error.',
      })
    }
    setNewSubmitting(false)
  }

  const handleSelectTransfer = (gid: string, checked: boolean) => {
    const newSelected = new Set(selectedTransfers)
    if (checked) {
      newSelected.add(gid)
    } else {
      newSelected.delete(gid)
    }
    setSelectedTransfers(newSelected)
  }

  // const handleSelectAll = (checked: boolean) => {
  //   if (checked) {
  //     setSelectedTransfers(new Set(transfers.map((t) => t.gid)))
  //   } else {
  //     setSelectedTransfers(new Set())
  //   }
  // }
  //
  // const handleRemoveSelected = () => {
  //   setTransfers(transfers.filter((t) => !selectedTransfers.has(t.gid)))
  //   setSelectedTransfers(new Set())
  // }
  //
  // const handleCancelSelected = () => {
  //   setTransfers(
  //     transfers.map((t) => (selectedTransfers.has(t.gid) ? { ...t, status: 'paused' } : t))
  //   )
  //   setSelectedTransfers(new Set())
  // }

  return (
    <>
      <Head title="Transfers" />
      <AppLayout>
        <Header />
        <Main>
          <div className="space-y-4">
            {transfers.map((transfer) => {
              const progress = calculateProgress(transfer.completedLength, transfer.totalLength)
              const isSelected = selectedTransfers.has(transfer.gid)

              return (
                <Card
                  key={transfer.gid}
                  className={`p-4 transition-all duration-200 ${
                    isSelected ? 'ring-2 ring-primary bg-accent/50' : 'hover:bg-accent/20'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header Row with Status, Speeds, and Connections */}
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleSelectTransfer(transfer.gid, checked as boolean)
                        }
                        className="mt-1"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded-full ${getStatusColor(transfer.status)}`}>
                              {getStatusIcon(transfer.status)}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {transfer.status.toUpperCase()}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <DownloadIcon className="h-3 w-3 text-green-500" />
                              <span className="font-medium">
                                {formatSpeed(transfer.downloadSpeed)}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <UploadIcon className="h-3 w-3 text-blue-500" />
                              <span className="font-medium">
                                {formatSpeed(transfer.uploadSpeed)}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <UsersIcon className="h-3 w-3 text-orange-500" />
                              <span className="font-medium">{transfer.connections}</span>
                            </div>

                            <div className="flex items-center gap-1">
                              <HardDriveIcon className="h-3 w-3 text-purple-500" />
                              <span className="font-medium">{transfer.numSeeders}</span>
                            </div>
                          </div>
                        </div>

                        <h3 className="font-medium text-foreground text-balance leading-tight mb-3">
                          {transfer.bittorrent?.info?.name || 'Unknown Transfer'}
                        </h3>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <Progress value={progress} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                              {formatBytes(transfer.completedLength)} /{' '}
                              {formatBytes(transfer.totalLength)}
                            </span>
                            <span>{progress.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {transfers.length === 0 && (
            <Card className="p-12 text-center">
              <DownloadIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No transfers</h3>
              <p className="text-muted-foreground">Your downloads and uploads will appear here</p>
            </Card>
          )}
        </Main>
      </AppLayout>
      <Modal open={modalOpen} onOpenChange={setModalOpen} title="Add New Transfer">
        <form className="flex flex-col gap-4" onSubmit={handleCreateTransfer}>
          <div>
            <Label htmlFor="new-link">Download Link</Label>
            <Input
              id="new-link"
              type="text"
              placeholder="Paste your download URL"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              disabled={newSubmitting}
              className="mt-1"
              autoFocus
              autoComplete="off"
            />
          </div>
          {/*
            // Future options:
            // For yt-dlp/cookies, add more fields here…
            // {engine === 'yt-dlp' && (...)
          */}
          <Button type="submit" className="w-full" disabled={newSubmitting}>
            {newSubmitting ? 'Starting...' : 'Add Transfer'}
          </Button>
          {newStatus && (
            <div
              className={`rounded px-3 py-2 text-sm mt-2 ${
                newStatus.type === 'success'
                  ? 'bg-success/20 text-success-foreground'
                  : 'bg-destructive/10 text-destructive'
              }`}
            >
              {newStatus.message}
            </div>
          )}
        </form>
      </Modal>
    </>
  )
}

// Utility to format bytes for progress/speeds
function formatBytes(bytes: string | number): string {
  const b = typeof bytes === 'string' ? Number.parseInt(bytes) : bytes
  if (b === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(b) / Math.log(k))
  return Number.parseFloat((b / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatSpeed(bytesPerSecond: string | number): string {
  const speed = formatBytes(bytesPerSecond)
  return speed === '0 B' ? '0 B/s' : speed + '/s'
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-green-500'
    case 'complete':
      return 'bg-blue-500'
    case 'paused':
      return 'bg-yellow-500'
    case 'error':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'active':
      return <DownloadIcon className="h-4 w-4" />
    case 'complete':
      return <HardDriveIcon className="h-4 w-4" />
    case 'paused':
      return <PauseIcon className="h-4 w-4" />
    default:
      return <ClockIcon className="h-4 w-4" />
  }
}

function calculateProgress(completed: string, total: string): number {
  const comp = Number.parseInt(completed)
  const tot = Number.parseInt(total)
  return tot > 0 ? (comp / tot) * 100 : 0
}
