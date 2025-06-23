import { createFileRoute, redirect } from "@tanstack/react-router"
import "../App.css"

export const Route = createFileRoute("/")({
    component: App,
    loader: async () => {
      throw redirect({
        to: '/login'
      })
    }
})

function App() {
    return (
      <div></div>
    )
}
