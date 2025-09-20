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
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { PasswordInput } from '~/components/ui/password-input'
import useError from '~/hooks/use-error'
import { Button } from '~/components/ui/button'

export default function OnboardPage() {
  const form = useForm({
    username: '',
    password: '',
    confirmPassword: '',
  })

  const handleOnboard = (e: React.FormEvent) => {
    e.preventDefault()
    form.post(route('auth.onboard').toString())
  }
  const errors = useError()
  return (
    <>
      <Head title="Onboard" />
      <AuthLayout>
        <Card className="gap-4">
          <CardHeader>
            <CardTitle className="text-lg tracking-tight">Create an account</CardTitle>
            <CardDescription>
              Enter your username and password to create an account. <br />
              Already have an account?{' '}
              <Link
                href={route('auth.login.page').toString()}
                className="hover:text-primary underline underline-offset-4"
              >
                Sign In
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid grid-3 gap-3" onSubmit={handleOnboard}>
              <div className="space-y-2">
                <Label htmlFor="username">
                  Username
                  {errors?.username && (
                    <span className="text-xs text-destructive">{errors.username}</span>
                  )}
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="hitarashi"
                  onChange={(e) => form.setData('username', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">
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
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="***********"
                  onChange={(e) => form.setData('confirmPassword', e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={form.processing}>
                Register
              </Button>
              <div className="relative h-2 text-center">
                {errors?.auth && <p className="text-xs text-destructive">{errors.auth}</p>}
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-muted-foreground px-8 text-center text-sm">
              By creating an account, you agree to our{' '}
              <a href="/terms" className="hover:text-primary underline underline-offset-4">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="hover:text-primary underline underline-offset-4">
                Privacy Policy
              </a>
              .
            </p>
          </CardFooter>
        </Card>
      </AuthLayout>
    </>
  )
}
