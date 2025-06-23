import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
import { LoaderIcon, LogInIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { AxiosError } from "axios"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import useAuth from "@/hooks/useAuth"

export const Route = createFileRoute("/login")({
    component: LogInPage,
    beforeLoad: async ({ context }) => {
        if (context.auth.isAuthenticated) {
            throw redirect({
                to: '/dashboard/pins/review'
            })
        }
    }
})


/* public class LogInInDto
{
    public string Username { get; set; }
    public string Password { get; set; }
    public bool ShouldPersist { get; set; }
} */
export const LoginSchema = z.object({
    username: z.string().min(4, "Invalid username").max(50, "Invalid username"),
    password: z.string().min(4, "Invalid password").max(50, "Invalid password"),
    shouldPersist: z.boolean()
})

function LogInPage() {

    const navigate = useNavigate()
    const [showBadCredentials, setShowBadCredentials] = useState(false)
    const [error, setError] = useState<null | string>(null)
    const [loading, setLoading] = useState(false)
    const { logIn, updateAuthStatus } = useAuth()

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            username: '',
            password: '',
            shouldPersist: false
        }
    })

    async function onSubmit(values: z.infer<typeof LoginSchema>) {
        setShowBadCredentials(false)
        setError(null)
        setLoading(true)

        try {
            await logIn(values)
            await updateAuthStatus()

            // Will throw if not successful.
            await navigate({
                to: '/dashboard/pins/review'
            })
        }
        catch (e) {
            // If bad username/password
            if ((e as AxiosError).status === 401) {
                setShowBadCredentials(true)
            }
            else {
                setError('Unknown error occured. Please check your internet connection.')
            }
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-[100dvh] w-full p-10">
            <Card className="w-80 max-w-full">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Admin Login</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            <FormField
                                control={form.control}
                                name='username'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder='example@domain.com' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type='password' placeholder='' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='shouldPersist'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <FormLabel htmlFor="should-persist-form-checkbox">
                                                <Checkbox id="should-persist-form-checkbox" onCheckedChange={field.onChange} checked={field.value} />
                                                Keep me logged in
                                            </FormLabel>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {
                                showBadCredentials && (
                                    <Label className='text-red-800'>
                                        Invalid username or password
                                    </Label>
                                ) || (error && (
                                    <Label className='text-red-800'>
                                        {error}
                                    </Label>
                                ))
                            }

                            <Button disabled={loading} type='submit' className="mt-2 select-none">
                                {
                                    loading ? <LoaderIcon className='animate-spin' /> : <LogInIcon />
                                }
                                Log In
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
