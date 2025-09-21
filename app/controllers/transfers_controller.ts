import app from '@adonisjs/core/services/app'

import { type HttpContext } from '@adonisjs/core/http'

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
}
