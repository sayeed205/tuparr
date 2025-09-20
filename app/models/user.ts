import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

import withCUID from '#models/utils/with_cuid'
import withTimestamps from '#models/utils/with_timestamps'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['username'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder, withCUID(), withTimestamps()) {
  @column()
  declare username: string

  @column({ serializeAs: null })
  declare password: string
}
