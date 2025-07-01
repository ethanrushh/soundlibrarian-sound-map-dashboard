import BannedUserDataTable from '@/components/dashboard/bannedUserDataTable'
import { apiUrl } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import axios from 'axios'
import { LoaderIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/dashboard/admin/banned')({
    component: RouteComponent,
})

function RouteComponent() {
    const [users, setUsers] = useState<{banId: string, address: string}[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    async function fetchUsers() {
        try {
            const pins = await axios.get<{banId: string, address: string}[]>(apiUrl() + '/dashboard/admin/banned-users', {
                withCredentials: true
            })

            setUsers(pins.data)
        }
        catch {
            setError(true)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <div>
            <h1 className='text-center font-bold text-3xl mb-10'>Banned Users</h1>

            {
                loading ? (
                    <div className='w-full flex justify-center items-center'>
                        <LoaderIcon className='h-10 w-10 animate-spin' />
                    </div>
                ) : (
                    users === null || error ? (
                        <p className='text-center text-red-500'>Failed to load users. Please try again later.</p>
                    ) : (
                        users.length <= 0 ? (
                            <p className='text-center'>There are no bans to view.</p>
                        ) : (
                            <BannedUserDataTable refreshUsers={fetchUsers} users={users} />
                        )
                    )
                )
            }
        </div>
    )
}
