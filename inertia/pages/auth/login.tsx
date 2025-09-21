import React from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import { route } from '@izzyjs/route/client'

import AuthLayout from '~/components/layout/auth-layout'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import useError from '~/hooks/use-error'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { PasswordInput } from '~/components/ui/password-input'
import { Button } from '~/components/ui/button'

export default function LoginPage() {
  const form = useForm({
    username: '',
    password: '',
  })

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    form.post(route('auth.login').toString())
  }

  const errors = useError()
  return (
    <>
      <Head title="Login" />
      <AuthLayout>
        <Card className="gap-4 min-w-[30vw]">
          <CardHeader>
            <CardTitle className="text-lg tracking-tight">Login</CardTitle>
            <CardDescription>
              Enter your username and password below to log into your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-3" onSubmit={handleLogin}>
              <div className="space-y-2">
                <Label>
                  Username
                  {errors?.username && (
                    <span className="text-xs text-destructive">{errors.username}</span>
                  )}
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="m@example.com"
                  onChange={(e) => form.setData('username', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Password
                  {errors?.password && (
                    <span className="text-xs text-destructive">{errors.password}</span>
                  )}
                </Label>
                <PasswordInput
                  id="password"
                  placeholder="***********"
                  onChange={(e) => form.setData('password', e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={form.processing}>
                Login
              </Button>
              <div className="relative h-2 text-center">
                {errors?.auth && <p className="text-xs text-destructive">{errors.auth}</p>}
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-muted-foreground px-8 text-center text-sm">
              By clicking login, you agree to our{' '}
              <Link href="/terms" className="hover:text-primary underline underline-offset-4">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="hover:text-primary underline underline-offset-4">
                Privacy Policy
              </Link>
              .
            </p>
          </CardFooter>
        </Card>
      </AuthLayout>
    </>
  )
}
