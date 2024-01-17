"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function RegisterAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="•••••••••••"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <hr className="mt-2 mb-1" />
          <div className="flex flex-col gap-2 w-full">
            <h1 className="text-lg font-bold">
              IMAP Settings
            </h1>
            <div className="flex flex-col pl-3">
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="imap_server">
                  Server Hostname / IP Address
                </Label>
                <Input
                  id="imap_server"
                  placeholder="imap.yourdomain.com"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="imap_server"
                  autoCorrect="off"
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="imap_port">
                  Server Port
                </Label>
                <Input
                  id="imap_port"
                  placeholder="993"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="imap_port"
                  autoCorrect="off"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          <hr className="mt-2 mb-1" />
          <div className="flex flex-col gap-2 w-full">
            <h1 className="text-lg font-bold">
              SMTP Settings
            </h1>
            <div className="flex flex-col pl-3">
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="smtp_server">
                  Server Hostname / IP Address
                </Label>
                <Input
                  id="smtp_server"
                  placeholder="smtp.yourdomain.com"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="smtp_server"
                  autoCorrect="off"
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="smtp_port">
                  Server Port
                </Label>
                <Input
                  id="smtp_port"
                  placeholder="587"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="smtp_port"
                  autoCorrect="off"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          <hr className="mt-2 mb-1" />
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create your account
          </Button>
        </div>
      </form>
    </div>
  )
}