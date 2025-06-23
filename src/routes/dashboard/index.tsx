import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div>
            <h1 className='text-center font-bold text-3xl mb-10'>Welcome</h1>

            <p className='text-center'>Please select a tab to continue.</p>
        </div>
    )
}
