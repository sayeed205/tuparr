import { YTDLWrapper } from '@j3lte/ytdl-wrapper'
import app from '@adonisjs/core/services/app'

const ytdl = new YTDLWrapper()

export type Progress = {
  totalLength: number
  completedLength: number
  downloadSpeed: number | null
}

export type YTDLTask = {
  gid: string
  name: string
  status: 'active' | 'waiting' | 'paused' | 'error' | 'complete' | 'removed'
} & Progress

export type YTDLDownloadOptions = {
  dir?: string
  cookie?: string
}

export class YtdlpService {
  private tasks: Map<string, YTDLTask> = new Map()

  /** Generates a random, unique GID for each yt-dlp task */
  private generateGid(): string {
    let gid
    do {
      gid = Array.from(crypto.getRandomValues(new Uint8Array(8)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
    } while (this.tasks.has(gid))
    return gid
  }

  async addUri(uri: string, { dir }: YTDLDownloadOptions = {}): Promise<string> {
    const gid = this.generateGid()
    const outputDir = dir || app.appRoot.pathname + '/downloads'

    console.log(`Adding uri: ${uri}\nwith gid=${gid}`)

    // create an initial task entry
    this.tasks.set(gid, {
      gid,
      name: uri, // fallback until filename is known
      status: 'waiting',
      totalLength: 0,
      completedLength: 0,
      downloadSpeed: null,
    })

    ytdl
      .exec(
        [
          uri,
          '-o',
          `${outputDir}/%(title)s.%(ext)s`,
          '--progress-template',
          'download:{"totalLength":%(progress.total_bytes)s,"completedLength":%(progress.downloaded_bytes)s,"downloadSpeed":%(progress.speed)s}',
        ],
        { cwd: app.appRoot }
      )
      .on('event', (eventType, eventData) => {
        if (eventType === 'other') {
          try {
            const sanitized = eventData.replace(/\bNA\b/g, 'null')
            const progress = JSON.parse(sanitized) as Progress
            const prev = this.tasks.get(gid)

            if (prev) {
              this.tasks.set(gid, {
                ...prev,
                ...progress,
                status: 'active',
              })
            }
          } catch (err) {
            console.error('Failed to parse progress JSON:', eventData, err)
          }
        }
      })
      .on('close', (code) => {
        const prev = this.tasks.get(gid)
        if (!prev) return

        this.tasks.set(gid, {
          ...prev,
          status: code === 0 ? 'complete' : 'error',
        })
        console.log('Process closed with code: ' + code)
      })
      .on('error', (err) => {
        const prev = this.tasks.get(gid)
        if (!prev) return

        this.tasks.set(gid, {
          ...prev,
          status: 'error',
        })
        console.log('ERROR', err)
      })

    return gid
  }

  /** Get a snapshot of all tasks */
  listTasks(): YTDLTask[] {
    return Array.from(this.tasks.values())
  }

  /** Get a single task by GID */
  getTask(gid: string): YTDLTask | undefined {
    return this.tasks.get(gid)
  }
}
