import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

interface AuthRouterContext {
  // The ReturnType of your useAuth hook or the value of your AuthContext
  auth: {
    isAuthenticated: boolean
  }
}

export const Route = createRootRouteWithContext<AuthRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
