import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import useAuth from "@/hooks/useAuth";
import { useNavigate, type ReactNode } from "@tanstack/react-router";
import { LogOutIcon, XIcon } from "lucide-react";


export default function LogOutDialog(props: {
    children: ReactNode
}) {
    const navigate = useNavigate()
    const { logOut: authLogOut, updateAuthStatus } = useAuth()

    async function logOut() {
        try {
            await authLogOut()
            await updateAuthStatus()
        }
        catch { console.warn("Couldn't log out, probably already expired.") }
        finally {
            await navigate({
                to: '/'
            })
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {props.children}
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Log Out</DialogTitle>
                    <DialogDescription>Account Management</DialogDescription>
                </DialogHeader>

                <p>Are you sure you want to log out?</p>

                <DialogFooter>
                    <DialogTrigger asChild>
                        <Button variant='secondary'>
                            <XIcon />
                            Close
                        </Button>
                    </DialogTrigger>

                    <Button onClick={logOut} variant='destructive'>
                        <LogOutIcon />
                        Log Out
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
