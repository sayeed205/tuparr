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
const TransfersController = () => import('#controllers/transfers_controller')

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

/*
|--------------------------------------------------------------------------
| Transfers Controller
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    router.get('/', [TransfersController, 'index']).as('page')
  })
  .use(middleware.auth())
  .as('transfers')
  .prefix('transfers')

router
  .group(() => {
    router.get('dashboard', ({ inertia }) => inertia.render('dashboard')).as('dashboard.page')
    router.get('files', ({ inertia }) => inertia.render('files')).as('files.page')
  })
  .as('app')
  .use(middleware.auth())
