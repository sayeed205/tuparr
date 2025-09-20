import router from '@adonisjs/core/services/router'

import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'
import { loginValidator, onboardValidator } from '#validators/auth_validator'

export default class AuthController {
  async onboardPage({ inertia, response }: HttpContext) {
    const user = await User.query().first()
    if (user) return response.redirect('/login')
    return inertia.render('auth/onboard')
  }
  async onboard({ auth, request, response, session }: HttpContext) {
    const { username, password } = await request.validateUsing(onboardValidator)
    const onboardedUser = await User.query().first()
    if (onboardedUser) {
      session.flash('errors.auth', 'Please login to continue')
      return response.redirect('/login')
    }

    const user = await User.create({ username, password })

    await user.save()

    await auth.use('web').login(user)

    return response.redirect('/')
  }

  async loginPage({ inertia, response }: HttpContext) {
    const user = await User.query().first()
    if (!user) return response.redirect('/onboard')
    return inertia.render('auth/login')
  }
  async login({ auth, request, response, session }: HttpContext) {
    const { username, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(username, password)
      await auth.use('web').login(user)
      const next = request.qs().next as string
      if (next) {
        return response.redirect(next)
      }
      return response.redirect(router.builder().make('home'))
    } catch {
      session.flash('errors.auth', 'Invalid credentials')
      return response.redirect(router.builder().make('auth.login.page'))
    }
  }

  async logout({ auth, response, session }: HttpContext) {
    await auth.use('web').logout()
    session.forget('session-token')
    return response.redirect(router.builder().make('auth.login.page'))
  }
}
