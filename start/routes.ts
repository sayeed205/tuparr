/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

import { middleware } from '#start/kernel'
const AuthController = () => import('#controllers/auth_controller')

router.on('/').renderInertia('home').use(middleware.auth())

router
  .group(() => {
    router
      .group(() => {
        router.get('onboard', [AuthController, 'onboardPage']).as('onboard.page')
        router.get('login', [AuthController, 'loginPage']).as('login.page')

        router.post('onboard', [AuthController, 'onboard']).as('onboard')
        router.post('login', [AuthController, 'login']).as('login')
      })
      .use(middleware.guest())
    router.get('logout', [AuthController, 'logout']).as('logout').use(middleware.auth())
  })
  .as('auth')
