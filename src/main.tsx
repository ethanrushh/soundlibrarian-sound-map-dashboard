import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import reportWebVitals from './reportWebVitals.ts'
import { ThemeProvider } from './components/themeProvider.tsx'
import useAuth, { AuthContextProvider } from './hooks/useAuth.tsx'

// Create a new router instance
const router = createRouter({
    routeTree,
    context: {
        auth: undefined!
    },
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

function App() {
    const auth = useAuth()

    return <RouterProvider router={router} context={{ auth }} />
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <StrictMode>
            <ThemeProvider defaultTheme="system" storageKey="intradesign-dashboard-theme">
                <AuthContextProvider>
                    <App />
                </AuthContextProvider>
            </ThemeProvider>
        </StrictMode>,
    )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
