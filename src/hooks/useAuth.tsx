import { apiUrl } from "@/lib/utils"
import type { LoginSchema } from "@/routes/login/route"
import { type ReactNode } from "@tanstack/react-router"
import axios from "axios"
import { createContext, useCallback, useContext, useEffect, useState } from "react"
import type { z } from "zod"

export type AuthType = {
    isAuthenticated: boolean
    logIn: (credentials: z.infer<typeof LoginSchema>) => Promise<void>
    logOut: () => Promise<void>
    updateAuthStatus: () => Promise<void>
}

const AuthContext = createContext<AuthType | null>(null)


export default function useAuth() {
    const auth = useContext(AuthContext)

    if (!auth)
        throw new Error('useAuth may only be called within an AuthContext')

    return auth
}

function storeAuth(isAuth: boolean) {
    window.localStorage.setItem('intradesign-dashboard-auth-status', JSON.stringify({isAuth}))
}
function getStoredAuth() {
    const status = window.localStorage.getItem('intradesign-dashboard-auth-status')

    if (status === null) {
        return false
    }

    return (JSON.parse(status) as {isAuth: boolean}).isAuth
}

export function AuthContextProvider(props: { children: ReactNode }) {

    const [authState, setAuthState] = useState<{
        isAuthenticated: boolean
    }>({
        isAuthenticated: getStoredAuth()
    })

    const logIn = useCallback(async (credentials: z.infer<typeof LoginSchema>) => {
        await axios.post(apiUrl() + '/auth/log-in', null, {
            params: credentials,
            withCredentials: true
        })
    }, [])

    const logOut = useCallback(async () => {
        await axios.post(apiUrl() + '/auth/log-out', null, {
            withCredentials: true
        })
    }, [])

    const getAuthStatus = useCallback(async () => {
        try {
            const res = await axios.get<{
                isAuthenticated: boolean
            }>(apiUrl() + '/auth/get-auth', {
                withCredentials: true
            })

            if (!res.data.isAuthenticated) {
                throw new Error('No auth')
            }

            return res.data
        }
        catch {
            return {
                isAuthenticated: false
            }
        }
    }, [])

    const updateAuthStatus = useCallback(async () => {
        try {
            const status = await getAuthStatus()

            storeAuth(status.isAuthenticated)
            setAuthState(status)
        }
        catch (e) {
            // Exception means we have no auth.
            storeAuth(false)
            setAuthState({isAuthenticated: false})

            throw e
        }
    }, [])

    useEffect(() => {
        updateAuthStatus()
    }, [])


    return (
        <AuthContext.Provider value={{
            ...authState,
            logIn,
            logOut,
            updateAuthStatus
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}
