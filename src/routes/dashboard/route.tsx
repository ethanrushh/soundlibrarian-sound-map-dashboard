import { ModeToggle } from '@/components/modeToggle'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import LogOutDialog from '@/dialog/logOutDialog'
import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { LogOutIcon, MapIcon, ShieldUser, UserIcon } from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
    component: RouteComponent,
    beforeLoad: async ({ context }) => {
        if (!context.auth.isAuthenticated) {
            console.log(context.auth)
            throw redirect({
                to: '/'
            })
        }
    }
})

function RouteComponent() {
    return (
        <div className='min-h-[100dvh] flex flex-col'>
            <header className='h-12 w-full flex flex-row justify-between items-center p-2 sticky top-0 bg-background'>
                <p className='text-sm text-gray-500'>Sound Map Dashboard</p>

                <div className='flex flex-row justify-center items-center gap-1 h-full'>
                    <ModeToggle />

                    <LogOutDialog>
                        <Button variant='outline'>
                            <LogOutIcon />
                            Log Out
                        </Button>
                    </LogOutDialog>
                </div>
            </header>

            <div className='flex flex-row h-full flex-1'>
                <div className='w-42 h-[calc(100dvh-48px)]'/>
                <ScrollArea className='w-42 h-[calc(100dvh-48px)] fixed! left-0 bottom-0 bg-background drop-shadow-xl'> {/* Full height - header height. Hacky, but the only way of doing this. Its what shadcn themselves do. */}
                    <nav className='flex flex-col gap-4 pt-10 px-5'>
                        <h4 className='text-gray-400 text-xs flex flex-row justify-start items-center gap-1'>
                            <MapIcon className='w-[1.5em]' />
                            Mapping
                        </h4>
                        <ul className='text-xs font-bold'>
                            <li>
                                <Link to='/dashboard/pins/review'>
                                    <Button variant='ghost'>
                                        Review Pins
                                    </Button>
                                </Link>
                            </li>
                            <li>
                                <Link to='/dashboard/pins/all'>
                                    <Button variant='ghost'>
                                        View All
                                    </Button>
                                </Link>
                            </li>
                        </ul>

                        <h4 className='text-gray-400 text-xs flex flex-row justify-start items-center gap-1'>
                            <ShieldUser className='w-[1.5em]' />
                            Administration
                        </h4>
                        <ul className='text-xs font-bold'>
                            <li>
                                <Link to='/dashboard/admin/banned'>
                                    <Button variant='ghost'>
                                        Banned Users
                                    </Button>
                                </Link>
                            </li>
                        </ul>

                        <h4 className='text-gray-400 text-xs flex flex-row justify-start items-center gap-1'>
                            <UserIcon className='w-[1.5em]' />
                            User
                        </h4>
                        <ul className='text-xs font-bold'>
                            <li>
                                <LogOutDialog>
                                    <Button variant='ghost'>
                                        Log Out
                                    </Button>
                                </LogOutDialog>
                            </li>
                        </ul>
                    </nav>
                </ScrollArea>

                <div className='flex-1 pt-10'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
