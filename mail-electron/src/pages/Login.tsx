import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Link } from "react-router-dom"
import React from 'react'
import { LoginAuthForm } from '@/components/LoginAuthForm'

const Login = () => {
    return (
        <>
            <div className="md:hidden">
                <img
                    src="/examples/authentication-light.png"
                    width={1280}
                    height={843}
                    alt="Authentication"
                    className="block dark:hidden"
                />
                <img
                    src="/examples/authentication-dark.png"
                    width={1280}
                    height={843}
                    alt="Authentication"
                    className="hidden dark:block"
                />
            </div>
            <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                <Link
                    to="/signup"
                    className={cn(
                        buttonVariants({ variant: "secondary" }),
                        "absolute right-4 top-4 px-6 text-lg md:right-8 md:top-8"
                    )}
                >
                    Signup
                </Link>
                <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                    <div className="absolute inset-0 bg-zinc-900" />
                    <div className="relative z-20 flex items-center text-lg font-medium">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 h-6 w-6"
                        >
                            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                        </svg>
                        XolMail
                    </div>
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg">
                                The mail client you have been looking for.
                            </p>
                            <footer className="text-sm">Waleed Nagaria</footer>
                        </blockquote>
                    </div>
                </div>
                <div className="lg:p-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Log into your account
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Enter your email and password below.
                            </p>
                        </div>
                        <LoginAuthForm />
                        <p className="px-8 text-center text-sm text-muted-foreground">
                            By clicking continue, you agree to our{" "}
                            <Link
                                to="/terms"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                                to="/privacy"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login