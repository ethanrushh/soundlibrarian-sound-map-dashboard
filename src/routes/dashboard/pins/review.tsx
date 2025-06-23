import PinDataTable from '@/components/dashboard/pinDataTable'
import { apiUrl } from '@/lib/utils'
import type { AdminPin } from '@/types/api/adminTypes'
import { createFileRoute } from '@tanstack/react-router'
import axios from 'axios'
import { LoaderIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/dashboard/pins/review')({
    component: RouteComponent,
})

function RouteComponent() {
    const [pins, setPins] = useState<AdminPin[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    async function fetchPins() {
        try {
            const pins = await axios.get<AdminPin[]>(apiUrl() + '/dashboard/pending-pins', {
                withCredentials: true
            })

            setPins(pins.data)
        }
        catch {
            setError(true)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPins()
    }, [])

    return (
        <div>
            <h1 className='text-center font-bold text-3xl mb-10'>Review Pins</h1>

            {
                loading ? (
                    <div className='w-full flex justify-center items-center'>
                        <LoaderIcon className='h-10 w-10 animate-spin' />
                    </div>
                ) : (
                    pins === null || error ? (
                        <p className='text-center text-red-500'>Failed to load pins. Please try again later.</p>
                    ) : (
                        pins.length <= 0 ? (
                            <p className='text-center'>There are <b>0</b> pins pending review.</p>
                        ) : (
                            <PinDataTable refreshPins={fetchPins} pins={pins} />
                        )
                    )
                )
            }
        </div>
    )
}
