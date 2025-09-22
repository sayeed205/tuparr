import {
  ClockIcon,
  DownloadIcon,
  HardDriveIcon,
  PauseIcon,
  PlayIcon,
  Trash2Icon,
  UploadIcon,
  UsersIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Head, router, usePoll } from '@inertiajs/react'

import type { InferPageProps } from '@adonisjs/inertia/types'
import type TransfersController from '#controllers/transfers_controller'

import AppLayout from '~/components/layout/app-layout'
import { Header } from '~/components/layout/header'
import { Main } from '~/components/layout/main'
import { Card } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Checkbox } from '~/components/ui/checkbox'
import { Progress } from '~/components/ui/progress'
import { Button } from '~/components/ui/button'
import { route } from '@izzyjs/route/client'

export default function TransfersPage({ transfers }: InferPageProps<TransfersController, 'index'>) {
  const [selectedTransfers, setSelectedTransfers] = useState<Set<string>>(new Set())
  usePoll(1000, { async: true, only: ['transfers'] })

  const handleSelectTransfer = (gid: string, checked: boolean) => {
    const newSelected = new Set(selectedTransfers)
    if (checked) {
      newSelected.add(gid)
    } else {
      newSelected.delete(gid)
    }
    setSelectedTransfers(newSelected)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTransfers(new Set(transfers.map((t) => t.gid)))
    } else {
      setSelectedTransfers(new Set())
    }
  }

  const handleAction = (
    action: 'pause' | 'resume' | 'remove',
    gids?: string[]
  ) => {
    const GIDs = gids ?? Array.from(selectedTransfers)
    if (GIDs.length === 0) return

    router.post(route('transfers.action'), {
      GIDs,
      action,
    })
    setSelectedTransfers(new Set())
  }

  return (
    <>
      <Head title="Transfers" />
      <AppLayout>
        <Header fixed>
          <h3 className="text-3xl">Transfers</h3>
        </Header>
        <Main>
          {/* Controls */}
          <div className="flex items-center justify-between bg-card p-4 rounded-lg border mb-4">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={selectedTransfers.size === transfers.length && transfers.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                {selectedTransfers.size > 0 ? `${selectedTransfers.size} selected` : 'Select all'}
              </span>
            </div>

            {/* Right side actions */}
            <div className="flex gap-2">
              {selectedTransfers.size > 0 ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction('pause')}
                    className="gap-1 bg-transparent"
                  >
                    <PauseIcon className="h-4 w-4" />
                    Pause
                  </Button>

                  {/* Resume only paused in selection */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleAction(
                        'resume',
                        Array.from(selectedTransfers).filter((gid) =>
                          transfers.some((t) => t.gid === gid && t.status === 'paused')
                        )
                      )
                    }
                    className="gap-1 bg-transparent"
                  >
                    <PlayIcon className="h-4 w-4" />
                    Resume
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleAction('remove')}
                    className="gap-1"
                  >
                    <Trash2Icon className="h-4 w-4" />
                    Remove
                  </Button>
                </>
              ) : (
                // No selection: show Resume if any paused transfer exists
                transfers.some((t) => t.status === 'paused') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleAction(
                        'resume',
                        transfers.filter((t) => t.status === 'paused').map((t) => t.gid)
                      )
                    }
                    className="gap-1 bg-transparent"
                  >
                    <PlayIcon className="h-4 w-4" />
                    Resume paused
                  </Button>
                )
              )}
            </div>
          </div>
          {/* Transfers List */}
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
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleSelectTransfer(transfer.gid, checked as boolean)
                        }
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
                              <DownloadIcon className="h-4 w-4 text-green-500" />
                              <span className="font-medium">
                                {formatSpeed(transfer.downloadSpeed)}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <UploadIcon className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">
                                {formatSpeed(transfer.uploadSpeed)}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <UsersIcon className="h-4 w-4 text-orange-500" />
                              <span className="font-medium">{transfer.connections}</span>
                            </div>

                            <div className="flex items-center gap-1">
                              <HardDriveIcon className="h-4 w-4 text-purple-500" />
                              <span className="font-medium">{transfer.numSeeders}</span>
                            </div>
                          </div>
                        </div>

                        <h3 className="font-medium text-foreground text-balance leading-tight mb-3">
                          {transfer.bittorrent?.info?.name ||
                            (transfer.files && transfer.files.length > 0
                              ? transfer.files[0].path
                              : 'Unknown Transfer')}
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
