import app from '@adonisjs/core/services/app'

import { type HttpContext } from '@adonisjs/core/http'

import { addTransferValidator, transfersActionValidator } from '#validators/transfers_validator'

export default class TransfersController {
  async index({ inertia }: HttpContext) {
    const aria2 = await app.container.make('aria2')
    const [active, waiting, stopped] = await aria2.multicall([
      {
        method: 'aria2.tellActive',
      },
      {
        method: 'aria2.tellWaiting',
        params: [0, 1000],
      },
      {
        method: 'aria2.tellStopped',
        params: [0, 1000],
      },
    ])
    return inertia.render('transfers', { transfers: [...active, ...waiting, ...stopped] })
  }

  async new({ request, response }: HttpContext) {
    const { links } = await request.validateUsing(addTransferValidator)
    const aria2 = await app.container.make('aria2')
    for (const link of links) {
      try {
        await aria2.addUri([link])
      } catch {}
    }

    return response.redirect('/transfers')
  }

  async action({ request, response }: HttpContext) {
    const { GIDs, action } = await request.validateUsing(transfersActionValidator)
    console.log(request.all())
    const aria2 = await app.container.make('aria2')

    for (const gid of GIDs) {
      try {
        switch (action) {
          case 'pause':
            await aria2.pause(gid)
            break
          case 'resume':
            await aria2.unpause(gid)
            break
          case 'remove':
            const task = await aria2.tellStatus(gid)
            if (task.status === 'removed') await aria2.removeDownloadResult(gid)
            await aria2.remove(gid)
        }
      } catch {}
    }

    return response.redirect('/transfers')
  }
}
