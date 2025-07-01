import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { UserCheck, XIcon } from 'lucide-react';
import axios from 'axios';
import { apiUrl } from '@/lib/utils';
import { Label } from '../ui/label';

export default function BannedUserDataTable({users, refreshUsers }: {users: {banId: string, address: string}[], refreshUsers(): Promise<void>}) {

    const [reviewingUser, setReviewingUser] = useState<typeof users[number] | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (reviewingUser)
            setError(null)
    }, [reviewingUser])

    async function onUnbanUser(user: typeof users[number]) {
        setLoading(true)

        try {
            await axios.post(apiUrl() + '/dashboard/admin/unban-user', null, {
                params: {
                    banId: user.banId
                },
                withCredentials: true
            })

            await refreshUsers()

            setReviewingUser(null)
        }
        catch (e) {
            setError('An unknown error occured. Please try again later.')
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Dialog open={reviewingUser !== null} onOpenChange={x => { if (!x) { setReviewingUser(null) } }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Unban User</DialogTitle>
                        <DialogDescription>Review Users</DialogDescription>
                    </DialogHeader>

                    <p>Are you sure you would like to unban IP address <b>{reviewingUser?.address ?? 'Unknown'}</b></p>

                    <b>This will not restore their banned pin(s)</b>

                    {error && (
                        <Label className='text-red-700'>{error}</Label>
                    )}

                    <DialogFooter>
                        <DialogTrigger asChild disabled={loading}>
                            <Button variant='secondary' disabled={loading}>
                                <XIcon />
                                Close
                            </Button>
                        </DialogTrigger>

                        <Button disabled={loading} onClick={reviewingUser ? (() => onUnbanUser(reviewingUser)) : () => {}}>
                            <UserCheck />
                            Unban
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="w-full px-10">
                <Table className="border rounded-lg">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Address</TableHead>
                            <TableHead className="text-right pr-4">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    {
                        users.map(x => (
                            <TableBody key={x.address}>
                                <TableRow>
                                    <TableCell>
                                        {x.address}
                                    </TableCell>

                                    <TableCell className="flex flex-row justify-end">
                                        <Button className="p-2 text-sm" variant='outline' onClick={() => setReviewingUser(x)}>
                                            Unban
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        ))
                    }
                </Table>
            </div>
        </>
    )
}
